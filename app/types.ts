type Weapon = {
  id: string;
  name: string;
  traitRange?: string;
  damage?: string;
  feature?: string;
  primary?: boolean;
  secondary?: boolean;
};

type Armor = {
  id: string;
  name: string;
  baseThresholds?: string;
  baseScore?: string;
  feature?: string;
};

type Character = {
  name: string;
  pronouns: string;
  heritage: string;
  subclass: string;
  level: number;
  attributes: {
    agility: number;
    strength: number;
    finesse: number;
    instinct: number;
    presence: number;
    knowledge: number;
  };
  evasion: number;
  armorRating: number;
  armor: number;
  maxArmor: number;
  hp: number;
  maxHp: number;
  stress: number;
  maxStress: number;
  hope: number;
  maxHope: number;
  experienceNotes: string;
  goldHandfuls: number;
  goldBags: number;
  primaryWeapon?: Weapon;
  secondaryWeapon?: Weapon;
  inventoryWeapons: Weapon[];
  activeArmor?: Armor;
  inventory: string[];
  classFeatureNotes: string;
};
