/**
 * The Shattered City — story introduction & cast.
 *
 * Character cards built from the author's character notes for the Ambrose
 * sisters. `storyIntro` feeds the positioning section; `cast` feeds the three
 * power cards.
 */

export const storyIntro = {
  eyebrow: "// THE SECOND NOVEL",
  positioning: "ADULT SCIENCE-FANTASY",
  title: "A city that flushes its failures on schedule. Three sisters climb out of the wreckage.",
  body: [
    "Neo-Tethys is a city that runs on pressure. In the lower sectors they call the scheduled floods the landlord’s knock — water that rises on a timetable while crews chain down what they want to keep. The city isn’t drowning anyone. It is mopping its floor.",
    "When the transit platform collapses, three sisters — Sophia, Kiera and Zoey — wake in a buried deck with no water, no food, no map, and fresh marks on their skin. The marks were branded in without their consent. They have only one direction left to move. Up. An adult science-fantasy of ruin, kinship, and the heavy cost of deciding for the people you love.",
  ],
};

export type CastMember = {
  id: string;
  name: string;
  epithet: string;
  power: string;
  description: string;
};

export const cast: CastMember[] = [
  {
    id: "sophia",
    name: "Sophia",
    epithet: "Alpha-One · Catalyst",
    power: "She can make things hot. The amber brand rises along her arm when she calls it.",
    description:
      "The eldest — twenty-one and long out of childhood. Self-appointed protector of the family, fiercely decisive, guarded. Carries a heavy wrench and an oil-stained work jacket, and hides a burned palm under her sleeve — a price already paid to keep one sister whole.",
  },
  {
    id: "kiera",
    name: "Kiera",
    epithet: "Alpha-Two · Regulator",
    power: "She reads water and probable futures. The blue lattice hums; each glimpse costs her blood.",
    description:
      "The middle sister — fifteen, precise, and quietly aggrieved. She processes trauma through data and physical law, maps flood lines and failure modes in her head, and walks on a knee that may never carry her fast again. The visions come with nosebleeds she pretends not to notice.",
  },
  {
    id: "zoey",
    name: "Zoey",
    epithet: "Alpha-Three · Anchor",
    power: "She feels the city before it moves. The silver spiral listens to what the pipes won’t say.",
    description:
      "The youngest — twelve, observant, afraid of her own reach. She hears the thought-currents inside the city’s bones, knows when a structure is about to lie about holding, and hums the four-note lullaby her mother left behind when a resonance needs answering.",
  },
];