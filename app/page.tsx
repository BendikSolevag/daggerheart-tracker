import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { CharacterShorthandSchema, PartyMemberSchema } from "./types";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`${process.env.NEXT_PUBLIC_URL}/auth`);
  }

  const { data: partyData, error: partyError } = await supabase
    .from("partyMembers")
    .select(
      `
        id,
        party_id,
        user_id
      `
    )
    .eq("user_id", user.id);

  const parties = PartyMemberSchema.parse(partyData);
  console.log(parties.map((elem) => elem.party_id));

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
      parties.map((elem) => elem.party_id)
    );

  const chars = CharacterShorthandSchema.parse(charactersData);

  const charactersByParty = chars.reduce<Record<number, typeof chars>>((acc, char) => {
    const partyId = char.party_id;
    if (!acc[partyId]) acc[partyId] = [];
    acc[partyId].push(char);
    return acc;
  }, {});
  return (
    <main className="space-y-6">
      <div>Welcome, {user.email}</div>

      {Object.entries(charactersByParty).map(([partyId, partyChars]) => (
        <section key={partyId} className="border rounded p-4">
          <h2 className="text-lg font-bold mb-2">Party {partyId}</h2>

          <ul className="space-y-2">
            {partyChars.map((char) => (
              <li key={char.id} className="rounded bg-gray-100 p-3">
                <a href={`/character/${char.id}`}>
                  <div className="font-semibold">
                    {char.name} (Lv. {char.level})
                  </div>

                  <div className="text-sm text-gray-700">
                    Class: {char.class_id.name}
                    {char.subclass_id && ` — ${char.subclass_id.name}`}
                  </div>

                  <div className="text-sm text-gray-600">
                    Ancestry: {char.ancestry_id.name} | Community: {char.community_id.name}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
