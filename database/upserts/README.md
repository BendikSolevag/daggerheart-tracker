# SRD upserts

Upsert scripts generated from the updated system reference document (`srd.pdf`, August 2026 build).
Each file is a single `insert ... on conflict (slug) do update` statement, so it can be run
repeatedly: existing rows are updated in place (ids are preserved, so character references keep
working) and new rows are inserted. Nothing is deleted.

## Run order

1. `01_domains.sql` – adds the Dread domain (10 domains total)
2. `02_subclasses.sql` – 26 subclasses (new: Executioners/Poisoners Guild, Juggernaut, Martial Artist, Pact of the Endless/Wrathful, Hedge, Moon)
3. `03_classes.sql` – 13 classes (new: Assassin, Brawler, Warlock, Witch); references domains and subclasses by slug
4. `04_ancestries.sql` – 24 ancestries (new: Aetheris, Gnome, Earthkin, Emberkin, Skykin, Tidekin)
5. `05_communities.sql` – 15 communities (new: Duneborne, Freeborne, Frostborne, Hearthborne, Reborne, Warborne)
6. `06_abilities.sql` – 210 domain cards (21 per domain, full card text)
7. `07_weapons.sql` – 315 weapons, including the combat wheelchair models
8. `08_armors.sql` – 69 armors
9. `09_items.sql` – 120 items (Core Set + Hope & Fear Expansion)
10. `10_consumables.sql` – 120 consumables (Core Set + Hope & Fear Expansion)

## Notes

- Text fields hold the full SRD wording (the original seed abbreviated many class and subclass
  features). Features are separated by blank lines and lists use `•` bullets; real newlines are
  used, which the app renders via `whitespace-pre-line`.
- A few entries were renamed or respelled in the new SRD. Their existing slug is kept so nothing
  breaks (listed at the bottom of the relevant file), e.g. `bellamie-fine-armor` now holds
  "Bellamoi Fine Armor" and `lasketider-boots` holds "Lakestrider Boots".
- Rows in the original seed that no longer exist in the SRD are left untouched and listed as a
  comment at the bottom of each file (ten weapons such as Firestaff and Ghostblade).
- Not modelled because the schema has no table for them: Mixed Ancestry, the Elemental Kin parent
  entry, Transformations, Beastforms, Martial Stances and the Ranger companion.
- `generate_upserts.py` regenerates these files from `srd.pdf` (needs `pip install pymupdf`).
