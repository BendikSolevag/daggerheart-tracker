import { createClient } from "@/supabase/server";
import { CharacterShorthandSchema, PartyMemberSchema } from "./types";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("in base");

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
        <main className="w-full max-w-3xl space-y-4">
          <div>no user bitch</div>
        </main>
      </div>
    );
  }

  const { data: partyData, error: partyError } = await supabase
    .from("partyMembers")
    .select(
      `
        id,
        party_id (
          name,
          id
        ),
        user_id
      `
    )
    .eq("user_id", user.id);

  const parties = PartyMemberSchema.parse(partyData);
  const partyNameById = Object.fromEntries(parties.map((p) => [p.party_id.id, p.party_id.name]));

  const { data: charactersData, error: charactersError } = await supabase
    .from("characters")
    .select(
      `
      id,
      name,
      party_id,
      level,
      class_id (
        id,
        name,
        domain_1_id (
          id,
          name
        ),
        domain_2_id (
          id,
          name
        ),
        hope_feature,
        class_features
      ),
      subclass_id (
        id,
        name,
        spellcast_trait,
        foundation_features,
        specialization_features,
        mastery_features
      ),
      ancestry_id (
        id,
        name,
        feature_1_name,
        feature_1_description,
        feature_2_name,
        feature_2_description
      ),
      community_id (   
        id,     
        name,
        feature_name,
        feature_description
      )
    `
    )
    .in(
      "party_id",
      parties.map((elem) => elem.party_id.id)
    );

  const chars = CharacterShorthandSchema.parse(charactersData);

  const charactersByParty = chars.reduce<Record<number, typeof chars>>((acc, char) => {
    const partyId = char.party_id;
    if (!acc[partyId]) acc[partyId] = [];
    acc[partyId].push(char);
    return acc;
  }, {});
  return (
    <main className="mx-auto max-w-md px-4 py-6 space-y-8 sm:max-w-2xl lg:max-w-4xl">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Characters</h1>
        <p className="text-sm text-gray-500">Signed in as {user.email}</p>
      </header>

      {/* Parties */}
      <div className="space-y-10">
        {Object.entries(charactersByParty).map(([partyId, partyChars]) => (
          <section key={partyId} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Party header */}
            <div className="rounded-t-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">{partyNameById[Number(partyId)] ?? "Unknown Party"}</h2>
              <p className="text-xs text-indigo-100">
                {partyChars.length} character{partyChars.length !== 1 && "s"}
              </p>
            </div>

            {/* Character list */}
            <ul className="divide-y divide-gray-100">
              {partyChars.map((char) => (
                <li key={char.id}>
                  <a href={`/character/${char.id}`} className="group block px-5 py-4 transition active:bg-gray-100 hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-3">
                      {/* Left */}
                      <div className="space-y-0.5">
                        <div className="text-base font-semibold text-gray-900">{char.name}</div>

                        <div className="text-sm text-gray-600">
                          Lv. {char.level} · {char.class_id.name}
                          {char.subclass_id && <span className="text-gray-500"> — {char.subclass_id.name}</span>}
                        </div>

                        <div className="text-xs text-gray-500">
                          {char.ancestry_id.name} · {char.community_id.name}
                        </div>
                      </div>

                      {/* Chevron */}
                      <div className="text-gray-400 transition group-hover:text-gray-600">→</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
