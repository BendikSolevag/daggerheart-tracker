export function Header({
  char,
  onChangeName,
  onChangePronouns,
  onChangeHeritage,
  onChangeSubclass,
  onChangeLevel,
}: {
  char: Character;
  onChangeName: (v: string) => void;
  onChangePronouns: (v: string) => void;
  onChangeHeritage: (v: string) => void;
  onChangeSubclass: (v: string) => void;
  onChangeLevel: (v: number) => void;
}) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-sky-500 rounded-md flex items-center justify-center text-white font-bold">B</div>
        <div>
          <input
            aria-label="Character name"
            className="text-xl font-semibold bg-transparent border-b border-zinc-200 focus:outline-none"
            value={char.name}
            onChange={(e) => onChangeName(e.target.value)}
          />
          <div className="text-sm text-zinc-500">
            <input className="bg-transparent focus:outline-none" value={char.pronouns} onChange={(e) => onChangePronouns(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 w-full">
        <div className="grid grid-cols-1">
          <label className="text-xs text-zinc-500 w-full">Heritage</label>
          <input
            className="px-2 py-1 rounded-md border w-full"
            value={char.heritage}
            onChange={(e) => onChangeHeritage(e.target.value)}
            placeholder="Heritage"
          />
        </div>

        <div className="grid grid-cols-5 space-x-2">
          <div className="col-span-4 grid grid-cols-1">
            <label className="text-xs text-zinc-500">Subclass</label>
            <input className="px-2 py-1 rounded-md border" value={char.subclass} onChange={(e) => onChangeSubclass(e.target.value)} placeholder="Subclass" />
          </div>

          <div className="col-span-1 grid grid-cols-1">
            <label className="text-xs text-zinc-500">Level</label>
            <input
              id="characterLevel"
              className="px-2 py-1 rounded-md border"
              type="number"
              value={char.level}
              min={1}
              onChange={(e) => onChangeLevel(Number(e.target.value || 1))}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
