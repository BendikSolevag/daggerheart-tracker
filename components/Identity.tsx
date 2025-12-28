import { Character } from "@/app/types";

export function IdentityPanel({ char }: { char: Character }) {
  const { class_id, subclass_id, ancestry_id, community_id } = char;

  return (
    <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm space-y-4">
      <h2 className="font-semibold">Identity</h2>

      {/* Class & Domains */}
      <section className="rounded-md border bg-zinc-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{class_id.name}</span>
          <div className="flex gap-2 text-xs text-zinc-600">
            <Badge>{class_id.domain_1_id.name}</Badge>
            <Badge>{class_id.domain_2_id.name}</Badge>
          </div>
        </div>

        <div className="mt-2 space-y-1 text-sm text-zinc-700">
          <Feature label="Hope Feature" text={class_id.hope_feature} />
          <Feature label="Class Features" text={class_id.class_features} />
        </div>
      </section>

      {/* Subclass */}
      <section className="rounded-md border bg-zinc-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{subclass_id.name}</span>
          <Badge>{subclass_id.spellcast_trait}</Badge>
        </div>

        <div className="mt-2 space-y-1 text-sm text-zinc-700">
          <Feature label="Foundation" text={subclass_id.foundation_features} />
          <Feature label="Specialization" text={subclass_id.specialization_features} />
          <Feature label="Mastery" text={subclass_id.mastery_features} />
        </div>
      </section>

      {/* Origins */}
      <section className="grid sm:grid-cols-2 gap-3">
        <OriginCard
          title="Ancestry"
          name={ancestry_id.name}
          features={[
            {
              name: ancestry_id.feature_1_name,
              description: ancestry_id.feature_1_description,
            },
            {
              name: ancestry_id.feature_2_name,
              description: ancestry_id.feature_2_description,
            },
          ]}
        />

        <OriginCard
          title="Community"
          name={community_id.name}
          features={[
            {
              name: community_id.feature_name,
              description: community_id.feature_description,
            },
          ]}
        />
      </section>
    </div>
  );
}

/* ---------- Small building blocks ---------- */

function renderText(text: string) {
  return (
    text
      // convert escaped newlines first
      .replace(/\\r\\n|\\n|\\r/g, "\n")
      // convert real CRLF / CR
      .replace(/\r\n|\r/g, "\n")
      // collapse multiple newlines into one
      .replace(/\n{2,}/g, "\n")
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700">{children}</span>;
}

function Feature({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="font-medium text-zinc-800">{label}:</div> <span className="text-zinc-600 whitespace-pre-line">{renderText(text)}</span>
    </div>
  );
}

function OriginCard({ title, name, features }: { title: string; name: string; features: { name: string; description: string }[] }) {
  return (
    <div className="rounded-md border bg-zinc-50 p-3">
      <div className="text-sm font-semibold">
        {title}: {name}
      </div>
      <div className="mt-2 space-y-1 text-sm text-zinc-700">
        {features.map((f) => (
          <div key={f.name}>
            <div className="font-medium">{f.name}:</div> <span className="text-zinc-600">{renderText(f.description)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
