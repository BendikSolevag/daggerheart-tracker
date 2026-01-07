import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { InventorySchema } from "@/app/types";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  const p = await params;
  const characterId = Number(p.id);

  // Auth check

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse payload
  const { inv } = await request.json();

  if (!inv) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const inventory = InventorySchema.parse(inv).map(({ id, ...rest }) => rest);

  // Invalidate old inventory
  const { error: updateError } = await supabase
    .from("inventory")
    .update({
      active: false,
    })
    .eq("character_id", characterId);

  if (updateError) {
    console.log(updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("inventory").insert(inventory);

  if (insertError) {
    console.log(insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
