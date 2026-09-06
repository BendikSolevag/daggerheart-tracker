"""Generate the upsert SQL files in this directory from ../../srd.pdf.

Usage: pip install pymupdf; python generate_upserts.py [--dump]
--dump also writes parsed.json next to this script for inspection.
"""
import json
import os
import re
import sys
from collections import defaultdict

import pymupdf

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PDF = os.path.join(REPO, "srd.pdf")
OUT_DIR = os.path.join(REPO, "database", "upserts")
SCRATCH = os.path.dirname(os.path.abspath(__file__))

DUMP = "--dump" in sys.argv
WARNINGS = []


def warn(msg):
    WARNINGS.append(msg)
    print("WARN:", msg)


# --------------------------------------------------------------------------
# PDF loading
# --------------------------------------------------------------------------
doc = pymupdf.open(PDF)


def page_lines(pno):
    """Return [(x0, y0, x1, text)] for a 1-based page number, footers removed."""
    page = doc[pno - 1]
    out = []
    for b in page.get_text("dict")["blocks"]:
        if b["type"] != 0:
            continue
        for l in b["lines"]:
            txt = "".join(s["text"] for s in l["spans"])
            if not txt.strip():
                continue
            x0, y0, x1, y1 = l["bbox"]
            out.append((x0, y0, x1, txt))
    # footer: page number + "Daggerheart SRD" near the bottom
    out = [l for l in out if not (l[1] > 740 and (l[3].strip() == "Daggerheart SRD" or l[3].strip().isdigit()))]
    out.sort(key=lambda l: (round(l[1]), l[0]))
    return out


def plain_lines(p_from, p_to):
    """Flat text lines for a page range (inclusive), footers removed, blanks removed."""
    lines = []
    for pno in range(p_from, p_to + 1):
        raw = doc[pno - 1].get_text("text").split("\n")
        # drop footer pair
        cleaned = []
        for i, ln in enumerate(raw):
            s = ln.strip()
            if s == "Daggerheart SRD":
                if cleaned and cleaned[-1].strip().isdigit():
                    cleaned.pop()
                continue
            if not s:
                continue
            cleaned.append(ln)
        lines.extend(cleaned)
    return lines


# --------------------------------------------------------------------------
# Text helpers
# --------------------------------------------------------------------------
def norm_ws(s):
    s = s.replace("\u2011", "-").replace("\u00ad", "").replace("\u00a0", " ")
    s = s.replace("\uf0e0", "\u2192")  # symbol-font arrow used in the Rogue tier list
    if re.search(r"[\ue000-\uf8ff]", s):
        warn(f"private-use glyph in text: {s!r}")
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()


# words a paragraph never ends on: a line ending with one of these (and no
# punctuation) is a wrapped line even though the PDF omitted the trailing space
DANGLING = {"to", "a", "an", "the", "of", "and", "or", "in", "on", "at", "for", "with",
            "from", "by", "your", "their", "this", "that", "is", "are"}


def join_flow(lines):
    """Join wrapped lines into paragraphs.

    A line ending in whitespace continues on the next line; a line ending without
    whitespace ends a paragraph (this matches how the PDF text is laid out).
    Bullet lines (◦ or •) become their own lines prefixed with '• '.
    Returns a list of paragraph strings.
    """
    paras = []
    cur = None
    for raw in lines:
        if raw.strip() == "":
            continue
        is_bullet = bool(re.match(r"^\s*(\u25e6|\u2022)\s*", raw))
        text = re.sub(r"^\s*(\u25e6|\u2022)\s*", "", raw)
        text_stripped = norm_ws(text)
        last_word = text_stripped.split(" ")[-1] if text_stripped else ""
        continues = (raw.endswith(" ") or raw.endswith("\t") or raw.endswith("\u00a0")
                     or text_stripped.endswith("\u2014")
                     or last_word.lower() in DANGLING)
        if is_bullet:
            if cur is not None:
                paras.append(cur)
            cur = "\u2022 " + text_stripped
        elif cur is None:
            cur = text_stripped
        else:
            if cur.endswith("\u2014") or cur.endswith("-"):
                cur = cur + text_stripped
            else:
                cur = cur + " " + text_stripped
        if not continues:
            paras.append(cur)
            cur = None
    if cur is not None:
        paras.append(cur)
    return [p for p in paras if p]


def paras_to_text(paras):
    """Bullets are separated by single newlines, other paragraphs by blank lines."""
    def is_item(p):
        return p.startswith("\u2022") or bool(re.match(r"^\d+\. ", p))

    out = ""
    for i, p in enumerate(paras):
        if i == 0:
            out = p
            continue
        prev = paras[i - 1]
        if is_item(p) and (is_item(prev) or prev.endswith(":")):
            out += "\n" + p
        else:
            out += "\n\n" + p
    return out


FEATURE_SPLIT = re.compile(r"(?<=[.!?)])\s+(?=[A-Z][A-Za-z’'\- ]{1,40}: )")


def split_features(paras):
    """Split paragraphs that contain several 'Name: text' features run together
    (happens when the PDF line at a feature's end carries a trailing space)."""
    out = []
    for p in paras:
        if p.startswith("•"):
            out.append(p)
            continue
        out.extend(FEATURE_SPLIT.split(p))
    return out


def flow_text(lines, features=False):
    paras = join_flow(lines)
    if features:
        paras = split_features(paras)
    paras = [re.sub(r"\.\.$", ".", p) for p in paras]  # stray double period in the SRD
    return paras_to_text(paras)


# The new SRD renamed a few entries that already exist in the seed data. Keep the
# existing slug so character references stay intact; the name/description update.
SLUG_ALIASES = {
    "bellamoi-fine-armor": "bellamie-fine-armor",
    "lakestrider-boots": "lasketider-boots",
    "feast-of-xuria": "feast-of-xurla",
    "grindletooth-venom": "grindeltooth-venom",
    "improved-grindletooth-venom": "improved-grindeltooth-venom",
    "homets-secret-potion": "hornets-secret-potion",
}


def apply_aliases(rows):
    for r in rows:
        if r["slug"] in SLUG_ALIASES:
            r["slug"] = SLUG_ALIASES[r["slug"]]
    return rows


def is_heading(line):
    s = line.strip()
    if len(s) < 3 or s != s.upper():
        return False
    if not re.search(r"[A-Z]", s):
        return False
    if re.search(r"\d", s):
        return False
    return bool(re.fullmatch(r"[A-Z ’'&\-–]+", s))


SMALL_WORDS = {"of", "the", "and", "a", "an", "to", "by", "in", "on", "for", "at", "or"}


def title_case(s):
    s = norm_ws(s)
    words = s.split(" ")
    out = []
    for i, w in enumerate(words):
        lw = w.lower()
        if 0 < i < len(words) - 1 and lw in SMALL_WORDS:
            out.append(lw)
            continue
        parts = w.split("-")
        parts = [p[:1].upper() + p[1:].lower() for p in parts]
        out.append("-".join(parts))
    return " ".join(out)


def slugify(name):
    import unicodedata
    s = unicodedata.normalize("NFKD", name)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower().replace("\u2019", "").replace("'", "").replace("&", " and ")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def sql_str(s):
    if s is None:
        return "null"
    return "'" + s.replace("'", "''") + "'"


# --------------------------------------------------------------------------
# Table extraction (coordinate based)
# --------------------------------------------------------------------------
HEADER_LABELS = {"Name", "Tier", "Trait", "Range", "Damage", "Burden", "Feature", "Base",
                 "Thresholds", "Score", "ROLL", "Loot", "LOOT", "description"}
CONTROL_RE = re.compile(r"^(All magic weapons require|TIER \d|Physical Weapons$|Magic Weapons$|"
                        r"PRIMARY WEAPON|SECONDARY WEAPON|The following table)")


def join_cell(texts):
    s = norm_ws(" ".join(norm_ws(t) for t in texts))
    # re-join words hyphenated across a line break ("2-foot- deep")
    s = re.sub(r"(?<=\w)- (?=[a-z])", "-", s)
    return s


def cluster_x(xs, gap=8.0):
    xs = sorted(set(round(x, 1) for x in xs))
    clusters = []
    for x in xs:
        if clusters and x - clusters[-1][-1] <= gap:
            clusters[-1].append(x)
        else:
            clusters.append([x])
    return [sum(c) / len(c) for c in clusters]


def rows_from_body(pno, body, cols, label_texts, anchor_idx):
    def col_of(x):
        best = min(range(len(cols)), key=lambda i: abs(cols[i] - x))
        if abs(cols[best] - x) > 6:
            return None
        return best

    anchors = sorted([l for l in body if col_of(l[0]) == anchor_idx], key=lambda l: l[1])
    rows = []
    for i, a in enumerate(anchors):
        y_from = a[1] - 2
        y_to = anchors[i + 1][1] - 2 if i + 1 < len(anchors) else 10000
        cells = defaultdict(list)
        for l in body:
            if y_from <= l[1] < y_to:
                c = col_of(l[0])
                if c is None:
                    warn(f"p{pno}: unassigned line {l[3]!r} at x={l[0]:.1f}")
                    continue
                cells[c].append(l)
        row = {}
        for c, ls in cells.items():
            ls.sort(key=lambda l: l[1])
            key = label_texts[c] if c < len(label_texts) else f"col{c}"
            row[key] = join_cell([l[3] for l in ls])
        rows.append(row)
    return rows


def extract_tables(pno, header_text, anchor_col_fn, prev=None):
    """Extract tables from a page.

    header_text: 'Name' or 'ROLL' - the first header cell text.
    anchor_col_fn(labels) -> index of the column that never wraps (row anchor).
    prev: geometry of the last table on the previous page, used to pick up rows of a
          table that continues onto this page without repeating its header row.
    Returns (tables, events, last_geometry). tables: {page, y, labels, rows}; events:
    control lines (TIER..., PRIMARY..., SECONDARY...) with their y for ordering.
    """
    lines = page_lines(pno)
    headers = [l for l in lines if l[3].strip() == header_text]
    tables = []
    last_geom = None

    def body_filter(l, y_lo, y_hi, x_lo, x_hi):
        t = norm_ws(l[3])
        return (y_lo < l[1] < y_hi and x_lo <= l[0] < x_hi and t not in HEADER_LABELS
                and not CONTROL_RE.match(t))

    # continuation of the previous page's table (no header repeated on this page)
    if prev is not None and prev["page"] == pno - 1:
        top_limit = min(h[1] for h in headers) - 14 if headers else 10000
        # odd/even pages are offset horizontally, so allow some slack and re-cluster columns
        top = [l for l in lines if body_filter(l, -1, top_limit, prev["x_lo"] - 20, prev["x_hi"] + 20)]
        # only if the first line on the page (in this x range) is table-like and is not a heading
        if top and not is_heading(top[0][3]):
            cols = cluster_x([l[0] for l in top])
            if len(cols) == len(prev["labels"]):
                rows = rows_from_body(pno, top, cols, prev["labels"], prev["anchor_idx"])
                if rows:
                    print(f"note: p{pno}: {len(rows)} continuation rows for table from p{pno-1}")
                    tables.append({"page": pno, "y": 0, "labels": prev["labels"], "rows": rows})
                    last_geom = dict(prev, page=pno, cols=cols, x_lo=cols[0] - 4, x_hi=cols[-1] + 12)
            else:
                warn(f"p{pno}: possible table continuation with {len(cols)} columns, expected {len(prev['labels'])}: {[l[3][:30] for l in top[:4]]}")

    for h in headers:
        hx, hy = h[0], h[1]
        # right bound: another header on the same y further right
        right = [o for o in headers if o[0] > hx + 100 and abs(o[1] - hy) < 40]
        right_bound = min(o[0] for o in right) - 6 if right else 10000
        # bottom bound: next header at roughly same x below
        below = [o for o in headers if abs(o[0] - hx) < 30 and o[1] > hy + 5]
        bottom = min(o[1] for o in below) - 14 if below else 10000
        # header labels on the same row (two-line headers like "Base / Thresholds" keep the lower line)
        labels = [l for l in lines if abs(l[1] - hy) < 3 and hx - 4 <= l[0] < right_bound]
        labels.sort(key=lambda l: l[0])
        label_texts = [norm_ws(l[3]) for l in labels]
        if labels:
            right_bound = min(right_bound, max(l[0] for l in labels) + 10)
        body = [l for l in lines if body_filter(l, hy + 6, bottom, hx - 4, right_bound)]
        if not body:
            continue
        cols = cluster_x([l[0] for l in body])
        if len(cols) != len(label_texts):
            warn(f"p{pno} table@{hy:.0f}: {len(cols)} columns vs labels {label_texts}; cols={cols}")
        anchor_idx = anchor_col_fn(label_texts)
        rows = rows_from_body(pno, body, cols, label_texts, anchor_idx)
        tables.append({"page": pno, "y": hy, "labels": label_texts, "rows": rows})
        last_geom = {"page": pno, "labels": label_texts, "cols": cols, "anchor_idx": anchor_idx,
                     "x_lo": hx - 4, "x_hi": right_bound}
    events = []
    for l in lines:
        t = l[3].strip()
        m = re.match(r"^TIER (\d)", t)
        if m:
            events.append((l[1], "tier", int(m.group(1))))
        elif t.startswith("PRIMARY WEAPON"):
            events.append((l[1], "type", "Primary"))
        elif t.startswith("SECONDARY WEAPON"):
            events.append((l[1], "type", "Secondary"))
    return tables, events, last_geom


def split_feature(feat):
    feat = norm_ws(feat or "")
    if not feat or feat in ("\u2014", "-", "—"):
        return None, None
    m = re.match(r"^([^:]+):\s*(.+)$", feat, re.S)
    if not m:
        warn(f"feature without name: {feat!r}")
        return None, feat
    return norm_ws(m.group(1)), norm_ws(m.group(2))


# ---- Weapons ---------------------------------------------------------------
def parse_weapons():
    weapons = []
    tier = None
    wtype = None
    prev = None
    for pno in range(56, 72):
        tables, events, prev = extract_tables(pno, "Name", lambda labels: labels.index("Trait"), prev)
        items = [(t["y"], "table", t) for t in tables] + events
        items.sort(key=lambda e: e[0])
        for y, kind, val in items:
            if kind == "tier":
                tier = val
            elif kind == "type":
                wtype = val
            else:
                for r in val["rows"]:
                    if not r.get("Name"):
                        warn(f"p{pno}: weapon row without name: {r}")
                        continue
                    t = int(r["Tier"]) if "Tier" in r else tier
                    fname, fdesc = split_feature(r.get("Feature"))
                    weapons.append({
                        "slug": slugify(r["Name"]),
                        "name": r["Name"],
                        "tier": t,
                        "weapon_type": wtype if "Tier" not in r else "Primary",
                        "trait": r["Trait"],
                        "range": r["Range"],
                        "damage": r["Damage"],
                        "burden": r["Burden"],
                        "feature_name": fname,
                        "feature_description": fdesc,
                    })
    return weapons


# ---- Armor -----------------------------------------------------------------
def parse_armors():
    armors = []
    tier = None
    prev = None
    for pno in range(72, 75):
        tables, events, prev = extract_tables(pno, "Name", lambda labels: 1, prev)
        items = [(t["y"], "table", t) for t in tables] + events
        items.sort(key=lambda e: e[0])
        for y, kind, val in items:
            if kind == "tier":
                tier = val
            elif kind == "table":
                for r in val["rows"]:
                    thr = r.get("Thresholds") or ""
                    m = re.match(r"^(\d+)\s*/\s*(\d+)$", thr)
                    if not m:
                        warn(f"p{pno}: bad thresholds {r}")
                        continue
                    fname, fdesc = split_feature(r.get("Feature"))
                    armors.append({
                        "slug": slugify(r["Name"]),
                        "name": r["Name"],
                        "tier": tier,
                        "base_threshold_low": int(m.group(1)),
                        "base_threshold_high": int(m.group(2)),
                        "base_score": int(r["Score"]),
                        "feature_name": fname,
                        "feature_description": fdesc,
                    })
    return armors


# ---- Loot (items / consumables) --------------------------------------------
def parse_loot(p_from, p_to):
    out = []
    prev = None
    for pno in range(p_from, p_to + 1):
        tables, _, prev = extract_tables(pno, "ROLL", lambda labels: 0, prev)
        for t in tables:
            name_key = [k for k in t["labels"] if k.lower() == "loot"][0]
            for r in t["rows"]:
                name = r.get(name_key)
                desc = r.get("description")
                if not name or not desc:
                    warn(f"p{pno}: loot row incomplete: {r}")
                    continue
                out.append({"slug": slugify(name), "name": name, "description": desc, "roll": r.get("ROLL")})
    return out


# --------------------------------------------------------------------------
# Prose sections
# --------------------------------------------------------------------------
def find_idx(lines, pred, start=0):
    for i in range(start, len(lines)):
        if pred(lines[i]):
            return i
    return -1


# ---- Domains ---------------------------------------------------------------
def parse_domains():
    lines = plain_lines(7, 7)
    start = find_idx(lines, lambda l: l.strip() == "ARCANA")
    end = find_idx(lines, lambda l: l.strip() == "VALOR", start)
    # include valor block: goes to end of page 7 text
    block = lines[start:]
    domains = []
    i = 0
    while i < len(block):
        if is_heading(block[i]) and block[i].strip() not in ("CORE MATERIALS", "DOMAINS"):
            name = title_case(block[i])
            j = i + 1
            body = []
            while j < len(block) and not is_heading(block[j]):
                body.append(block[j])
                j += 1
            text = " ".join(norm_ws(b) for b in body)
            text = norm_ws(text)
            text = re.sub(r"\s*The \w+ domain can be accessed by the .*?classes\.?$", "", text)
            domains.append({"slug": slugify(name), "name": name, "description": text})
            i = j
        else:
            i += 1
    return domains


# ---- Classes & subclasses --------------------------------------------------
CLASS_NAMES = ["ASSASSIN", "BARD", "BRAWLER", "DRUID", "GUARDIAN", "RANGER", "ROGUE",
               "SERAPH", "SORCERER", "WARLOCK", "WARRIOR", "WITCH", "WIZARD"]


def parse_classes():
    lines = plain_lines(9, 31)
    classes = []
    subclasses = []
    for ci, cname in enumerate(CLASS_NAMES):
        i = find_idx(lines, lambda l: l.strip() == cname)
        if i < 0:
            warn(f"class {cname} not found")
            continue
        j = find_idx(lines, lambda l: l.strip().startswith("DOMAINS"), i)
        desc = flow_text(lines[i + 1:j])
        m = re.match(r"DOMAINS\s*[–-]\s*(\w+)\s*&\s*(\w+)", norm_ws(lines[j]))
        d1, d2 = m.group(1), m.group(2)
        ev = int(re.search(r"(\d+)", lines[j + 1]).group(1))
        hp = int(re.search(r"(\d+)", lines[j + 2]).group(1))
        k = find_idx(lines, lambda l: l.strip().endswith("HOPE FEATURE"), j)
        items_txt = " ".join(norm_ws(l) for l in lines[j + 3:k])
        items_txt = norm_ws(re.sub(r"^CLASS ITEMS\s*[–-]\s*", "", items_txt))
        f = find_idx(lines, lambda l: l.strip() in ("CLASS FEATURE", "CLASS FEATURES"), k)
        hope = flow_text(lines[k + 1:f], features=True)
        s = find_idx(lines, lambda l: l.strip() == f"{cname} SUBCLASSES", f)
        s_end = s
        sphere = find_idx(lines, lambda l: l.strip() == "SPHERE OF INFLUENCE EXAMPLES", f)
        if 0 <= sphere < s:
            s_end = sphere
        feats = flow_text(lines[f + 1:s_end], features=True)
        feats = re.sub(r"(Levels? [\d–-]+)\s+(Tier \d)", r"\1: \2", feats)
        # subclasses
        bq = find_idx(lines, lambda l: l.strip() == "BACKGROUND QUESTIONS", s)
        sub_lines = lines[s + 1:bq]
        # skip the 'Choose either ...' sentence(s)
        p = 0
        while p < len(sub_lines) and not is_heading(sub_lines[p]):
            p += 1
        sub_heads = [q for q in range(p, len(sub_lines)) if is_heading(sub_lines[q]) and not re.search(
            r"FEATURE|SPELLCAST", sub_lines[q])]
        if len(sub_heads) != 2:
            warn(f"{cname}: found {len(sub_heads)} subclass headings: {[sub_lines[q] for q in sub_heads]}")
        sub_slugs = []
        for n, q in enumerate(sub_heads):
            q_end = sub_heads[n + 1] if n + 1 < len(sub_heads) else len(sub_lines)
            sl = sub_lines[q:q_end]
            sname = title_case(sl[0])
            def idx(pred, start=1):
                for z in range(start, len(sl)):
                    if pred(sl[z].strip()):
                        return z
                return -1
            t_i = idx(lambda t: t == "SPELLCAST TRAIT")
            f_i = idx(lambda t: t.startswith("FOUNDATION FEATURE"))
            sp_i = idx(lambda t: t.startswith("SPECIALIZATION FEATURE"))
            m_i = idx(lambda t: t.startswith("MASTERY FEATURE"))
            desc_end = t_i if t_i > 0 else f_i
            sdesc = flow_text(sl[1:desc_end])
            trait = norm_ws(sl[t_i + 1]) if t_i > 0 else None
            found = flow_text(sl[f_i + 1:sp_i], features=True)
            spec = flow_text(sl[sp_i + 1:m_i], features=True)
            mast = flow_text(sl[m_i + 1:], features=True)
            subclasses.append({
                "slug": slugify(sname), "name": sname, "description": sdesc,
                "spellcast_trait": trait, "foundation_features": found,
                "specialization_features": spec, "mastery_features": mast,
                "class": cname,
            })
            sub_slugs.append(slugify(sname))
        classes.append({
            "slug": slugify(cname), "name": title_case(cname), "description": desc,
            "domain_1": d1.lower(), "domain_2": d2.lower(),
            "subclass_1": sub_slugs[0], "subclass_2": sub_slugs[1] if len(sub_slugs) > 1 else None,
            "starting_evasion": ev, "starting_hit_points": hp, "class_items": items_txt,
            "hope_feature": hope, "class_features": feats,
        })
    return classes, subclasses


def fix_tables_in_text(classes, subclasses):
    """Hand-format the two small roll tables that the PDF text flattens."""
    witch = [c for c in classes if c["slug"] == "witch"][0]
    old = witch["class_features"]
    pattern = re.compile(
        r"Roll\s*\n+Effect\s*\n+1–3\s*\n+(You taste[^\n]*)\n+4–5\s*\n+(You hear[^\n]*)\n+6\s*\n+(You psychically[^\n]*)")
    new, n = pattern.subn(lambda m: f"\u2022 1–3: {m.group(1)}\n\u2022 4–5: {m.group(2)}\n\u2022 6: {m.group(3)}", old)
    if n != 1:
        warn("witch commune table not fixed")
    witch["class_features"] = new
    moon = [s for s in subclasses if s["slug"] == "moon"][0]
    old = moon["mastery_features"]
    pattern = re.compile(
        r"Roll Phase\s*\n+Effect\s*\n+1\s*\n+New\s*\n+(Spend a Hope[^\n]*)\n+2–3 Waxing\s*\n+([^\n]*)\n+4\s*\n+Full\s*\n+([^\n]*)\n+5–6 Waning\s*\n+([^\n]*)")
    new, n = pattern.subn(
        lambda m: f"\u2022 1 (New): {m.group(1)}\n\u2022 2–3 (Waxing): {m.group(2)}\n\u2022 4 (Full): {m.group(3)}\n\u2022 5–6 (Waning): {m.group(4)}",
        old)
    if n != 1:
        warn("moon lunar phases table not fixed")
    moon["mastery_features"] = new


# ---- Ancestries ------------------------------------------------------------
def parse_ancestries():
    lines = plain_lines(32, 38)
    start = find_idx(lines, lambda l: l.strip() == "AETHERIS")
    end = find_idx(lines, lambda l: l.strip() == "MIXED ANCESTRY")
    block = lines[start:end]
    heads = [i for i, l in enumerate(block) if is_heading(l) and not l.strip().startswith("ANCESTRY FEATURE")]
    out = []
    for n, i in enumerate(heads):
        j = heads[n + 1] if n + 1 < len(heads) else len(block)
        sec = block[i:j]
        name = title_case(sec[0])
        fi = find_idx(sec, lambda l: l.strip().startswith("ANCESTRY FEATURE"))
        if fi < 0:
            # e.g. ELEMENTAL KIN parent section (no features of its own)
            print(f"note: skipping ancestry section without features: {name}")
            continue
        desc = flow_text(sec[1:fi])
        feats = split_features(join_flow(sec[fi + 1:]))
        if len(feats) != 2:
            warn(f"{name}: {len(feats)} feature paragraphs: {feats}")
        def split(f):
            m = re.match(r"^([^:]+):\s*(.+)$", f, re.S)
            return (norm_ws(m.group(1)), norm_ws(m.group(2))) if m else (None, f)
        f1 = split(feats[0])
        f2 = split(feats[1]) if len(feats) > 1 else (None, None)
        out.append({"slug": slugify(name), "name": name, "description": desc,
                    "feature_1_name": f1[0], "feature_1_description": f1[1],
                    "feature_2_name": f2[0], "feature_2_description": f2[1]})
    return out


# ---- Communities -----------------------------------------------------------
def parse_communities():
    lines = plain_lines(38, 42)
    start = find_idx(lines, lambda l: l.strip() == "DUNEBORNE")
    end = find_idx(lines, lambda l: l.strip() == "TRANSFORMATIONS")
    block = lines[start:end]
    heads = [i for i, l in enumerate(block) if is_heading(l) and l.strip() != "COMMUNITY FEATURE"]
    out = []
    for n, i in enumerate(heads):
        j = heads[n + 1] if n + 1 < len(heads) else len(block)
        sec = block[i:j]
        name = title_case(sec[0])
        fi = find_idx(sec, lambda l: l.strip() == "COMMUNITY FEATURE")
        desc = flow_text(sec[1:fi])
        # the "X are often ..." adjective sentence always stands as its own paragraph
        desc = re.sub(r"(?<=\.) (?=[A-Z][a-z]+ are often )", "\n\n", desc)
        feat = flow_text(sec[fi + 1:])
        m = re.match(r"^([^:]+):\s*(.+)$", feat, re.S)
        fname, fdesc = (norm_ws(m.group(1)), m.group(2).strip()) if m else (None, feat)
        fdesc = re.sub(r"\.\.$", ".", fdesc)
        out.append({"slug": slugify(name), "name": name, "description": desc,
                    "feature_name": fname, "feature_description": fdesc})
    return out


# ---- Abilities (domain cards) ------------------------------------------------
def parse_abilities():
    lines = plain_lines(206, 224)
    start = find_idx(lines, lambda l: re.match(r"^[A-Z]+ DOMAIN\s*$", l.strip()))
    lines = lines[start:]
    domain = None
    cards = []
    card_starts = [i for i, l in enumerate(lines) if re.match(r"^Level (\d+) (\w+) (Spell|Ability|Grimoire)$", l.strip())]
    for n, i in enumerate(card_starts):
        m = re.match(r"^Level (\d+) (\w+) (Spell|Ability|Grimoire)$", lines[i].strip())
        level, dom, typ = int(m.group(1)), m.group(2), m.group(3)
        # name: previous line, possibly two lines
        name_lines = [lines[i - 1]]
        if i - 2 >= 0 and lines[i - 2].endswith(" ") and is_heading(lines[i - 2]) and not lines[i - 2].strip().endswith("DOMAIN"):
            name_lines.insert(0, lines[i - 2])
        name_raw = " ".join(norm_ws(re.sub(r"^\s*-+", "", x)) for x in name_lines)
        name = title_case(name_raw)
        rc = re.match(r"Recall Cost:\s*(\d+)", lines[i + 1].strip())
        if not rc:
            warn(f"{name}: no recall cost line: {lines[i+1]!r}")
        recall = int(rc.group(1)) if rc else 0
        # description: from i+2 to the next card's name line (exclusive)
        if n + 1 < len(card_starts):
            nxt = card_starts[n + 1]
            end = nxt - 1
            if nxt - 2 >= 0 and lines[nxt - 2].endswith(" ") and is_heading(lines[nxt - 2]) and not lines[nxt - 2].strip().endswith("DOMAIN"):
                end = nxt - 2
            # domain header between cards
            body = lines[i + 2:end]
            body = [b for b in body if not re.match(r"^[A-Z]+ DOMAIN\s*$", b.strip())]
        else:
            body = lines[i + 2:]
        desc = flow_text(body, features=True)
        if slugify(name) == "forest-sprites":
            # closing sentence wraps onto the last bullet's line in the PDF
            desc = desc.replace(" A sprite vanishes", "\n\nA sprite vanishes")
        cards.append({"slug": slugify(name), "name": name, "domain": dom.lower(), "level": level,
                      "ability_type": typ, "recall_cost": recall, "description": desc})
    return cards


# --------------------------------------------------------------------------
# Existing seed slugs (for stale-slug report)
# --------------------------------------------------------------------------
def existing_slugs(fname):
    path = os.path.join(REPO, "database", fname)
    with open(path, encoding="utf-8") as f:
        txt = f.read()
    return set(re.findall(r"^\s*\(?\s*'([a-z0-9-]+)'\s*,", txt, re.M))


# --------------------------------------------------------------------------
# SQL writers
# --------------------------------------------------------------------------
HEADER = """-- Generated from the Daggerheart SRD (srd.pdf) by scripts run on 2026-09-05.
-- Upserts keyed on slug: existing rows are updated in place (ids are preserved),
-- new rows are inserted. Rows whose slug no longer appears in the SRD are left
-- untouched and listed at the bottom of this file.
--
-- Run order: 01_domains, 02_subclasses, 03_classes, 04_ancestries, 05_communities,
--            06_abilities, 07_weapons, 08_armors, 09_items, 10_consumables
"""


def write_upsert(fname, table, cols, rows, value_fn, stale, extra_comment=None, compact=False):
    path = os.path.join(OUT_DIR, fname)
    lines = [HEADER]
    if extra_comment:
        lines.append(extra_comment)
    if compact:
        lines.append(f"insert into public.{table}\n  (" + ", ".join(cols) + ")\nvalues")
    else:
        lines.append(f"insert into public.{table} (\n  " + ",\n  ".join(cols) + "\n)\nvalues")
    vals = []
    for r in rows:
        if compact:
            vals.append("  (" + ", ".join(value_fn(r)) + ")")
        else:
            vals.append("(\n  " + ",\n  ".join(value_fn(r)) + "\n)")
    lines.append(",\n".join(vals))
    update_cols = [c for c in cols if c != "slug"]
    lines.append("on conflict (slug) do update set\n  " + ",\n  ".join(f"{c} = excluded.{c}" for c in update_cols) + ";")
    aliased = [(r["slug"], r["name"]) for r in rows if r["slug"] in SLUG_ALIASES.values()]
    if aliased:
        lines.append("")
        lines.append("-- Renamed in this SRD; the existing slug is kept so character references stay intact:")
        for s_, n_ in aliased:
            lines.append(f"--   {s_}  ->  {n_}")
    if stale:
        lines.append("")
        lines.append("-- Slugs present in the original seed file but not produced from this SRD")
        lines.append("-- (removed in the new SRD; rows left untouched, review manually):")
        for s in sorted(stale):
            lines.append(f"--   {s}")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    print(f"wrote {fname}: {len(rows)} rows")


def check_unique(rows, label):
    seen = {}
    for r in rows:
        if r["slug"] in seen:
            warn(f"{label}: duplicate slug {r['slug']} ({seen[r['slug']]} / {r['name']})")
        seen[r["slug"]] = r["name"]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    domains = parse_domains()
    classes, subclasses = parse_classes()
    fix_tables_in_text(classes, subclasses)
    ancestries = parse_ancestries()
    communities = parse_communities()
    abilities = parse_abilities()
    weapons = apply_aliases(parse_weapons())
    armors = apply_aliases(parse_armors())
    items = apply_aliases(parse_loot(75, 79))
    consumables = apply_aliases(parse_loot(80, 84))

    for label, rows in [("domains", domains), ("classes", classes), ("subclasses", subclasses),
                        ("ancestries", ancestries), ("communities", communities), ("abilities", abilities),
                        ("weapons", weapons), ("armors", armors), ("items", items), ("consumables", consumables)]:
        check_unique(rows, label)
        print(f"{label}: {len(rows)}")

    domain_slugs = {d["slug"] for d in domains}
    for a in abilities:
        if a["domain"] not in domain_slugs:
            warn(f"ability {a['slug']} has unknown domain {a['domain']}")
    for c in classes:
        for d in (c["domain_1"], c["domain_2"]):
            if d not in domain_slugs:
                warn(f"class {c['slug']} unknown domain {d}")

    if DUMP:
        with open(os.path.join(SCRATCH, "parsed.json"), "w", encoding="utf-8") as f:
            json.dump({"domains": domains, "classes": classes, "subclasses": subclasses,
                       "ancestries": ancestries, "communities": communities, "abilities": abilities,
                       "weapons": weapons, "armors": armors, "items": items, "consumables": consumables},
                      f, ensure_ascii=False, indent=1)
        print("dumped parsed.json")

    s = sql_str
    write_upsert("01_domains.sql", "domains", ["slug", "name", "description"], domains,
                 lambda r: [s(r["slug"]), s(r["name"]), s(r["description"])],
                 existing_slugs("domains.sql") - {r["slug"] for r in domains})

    write_upsert("02_subclasses.sql", "subclasses",
                 ["slug", "name", "description", "spellcast_trait", "foundation_features",
                  "specialization_features", "mastery_features"], subclasses,
                 lambda r: [s(r["slug"]), s(r["name"]), s(r["description"]), s(r["spellcast_trait"]),
                            s(r["foundation_features"]), s(r["specialization_features"]), s(r["mastery_features"])],
                 existing_slugs("subclasses.sql") - {r["slug"] for r in subclasses})

    write_upsert("03_classes.sql", "classes",
                 ["slug", "name", "description", "domain_1_id", "domain_2_id", "subclass_1_id", "subclass_2_id",
                  "starting_evasion", "starting_hit_points", "class_items", "hope_feature", "class_features"], classes,
                 lambda r: [s(r["slug"]), s(r["name"]), s(r["description"]),
                            f"(select id from public.domains where slug = {s(r['domain_1'])})",
                            f"(select id from public.domains where slug = {s(r['domain_2'])})",
                            f"(select id from public.subclasses where slug = {s(r['subclass_1'])})",
                            f"(select id from public.subclasses where slug = {s(r['subclass_2'])})",
                            str(r["starting_evasion"]), str(r["starting_hit_points"]), s(r["class_items"]),
                            s(r["hope_feature"]), s(r["class_features"])],
                 existing_slugs("classes.sql") - {r["slug"] for r in classes},
                 extra_comment="-- Requires 01_domains.sql and 02_subclasses.sql to have been applied first.\n")

    write_upsert("04_ancestries.sql", "ancestries",
                 ["slug", "name", "description", "feature_1_name", "feature_1_description",
                  "feature_2_name", "feature_2_description"], ancestries,
                 lambda r: [s(r["slug"]), s(r["name"]), s(r["description"]), s(r["feature_1_name"]),
                            s(r["feature_1_description"]), s(r["feature_2_name"]), s(r["feature_2_description"])],
                 existing_slugs("ancestries.sql") - {r["slug"] for r in ancestries},
                 extra_comment="-- Mixed Ancestry has no fixed features and is not included as a row.\n")

    write_upsert("05_communities.sql", "communities",
                 ["slug", "name", "description", "feature_name", "feature_description"], communities,
                 lambda r: [s(r["slug"]), s(r["name"]), s(r["description"]), s(r["feature_name"]),
                            s(r["feature_description"])],
                 existing_slugs("communities.sql") - {r["slug"] for r in communities})

    write_upsert("06_abilities.sql", "abilities",
                 ["slug", "name", "domain_id", "level", "ability_type", "recall_cost", "description"], abilities,
                 lambda r: [s(r["slug"]), s(r["name"]),
                            f"(select id from public.domains where slug = {s(r['domain'])})",
                            str(r["level"]), s(r["ability_type"]), str(r["recall_cost"]), s(r["description"])],
                 existing_slugs("abilities.sql") - {r["slug"] for r in abilities},
                 extra_comment="-- Requires 01_domains.sql to have been applied first (adds the Dread domain).\n")

    write_upsert("07_weapons.sql", "weapons",
                 ["slug", "name", "tier", "weapon_type", "trait", "range", "damage", "burden",
                  "feature_name", "feature_description"], weapons,
                 lambda r: [s(r["slug"]), s(r["name"]), str(r["tier"]), s(r["weapon_type"]), s(r["trait"]),
                            s(r["range"]), s(r["damage"]), s(r["burden"]), s(r["feature_name"]),
                            s(r["feature_description"])],
                 existing_slugs("weapons.sql") - {r["slug"] for r in weapons},
                 extra_comment="-- Includes the combat wheelchair models (Primary weapons; arcane frames use trait 'Spellcast').\n",
                 compact=True)

    write_upsert("08_armors.sql", "armors",
                 ["slug", "name", "tier", "base_threshold_low", "base_threshold_high", "base_score",
                  "feature_name", "feature_description"], armors,
                 lambda r: [s(r["slug"]), s(r["name"]), str(r["tier"]), str(r["base_threshold_low"]),
                            str(r["base_threshold_high"]), str(r["base_score"]), s(r["feature_name"]),
                            s(r["feature_description"])],
                 existing_slugs("armors.sql") - {r["slug"] for r in armors}, compact=True)

    write_upsert("09_items.sql", "items", ["slug", "name", "description"], items,
                 lambda r: [s(r["slug"]), s(r["name"]), s(r["description"])],
                 existing_slugs("items.sql") - {r["slug"] for r in items},
                 extra_comment="-- Core Set items plus the Hope & Fear Expansion Set items.\n", compact=True)

    write_upsert("10_consumables.sql", "consumables", ["slug", "name", "description"], consumables,
                 lambda r: [s(r["slug"]), s(r["name"]), s(r["description"])],
                 existing_slugs("consumables.sql") - {r["slug"] for r in consumables},
                 extra_comment="-- Core Set consumables plus the Hope & Fear Expansion Set consumables.\n", compact=True)

    print(f"\n{len(WARNINGS)} warnings")


if __name__ == "__main__":
    main()
