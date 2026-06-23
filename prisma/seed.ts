import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Seed script for the Simon J Cleary author website.
 * Idempotent: clears all tables, then re-creates the canonical content.
 * Run with: `bun run prisma:seed`
 *
 * Content reflects the real Duke Savage trilogy:
 *   Book 1 — Ghosts in the Ash (published)
 *   Book 2 — Residue (forthcoming)
 *   Book 3 — The Record (forthcoming)
 */

async function main() {
  console.log("› Clearing existing rows…");
  await Promise.all([
    db.subscriber.deleteMany(),
    db.contactMessage.deleteMany(),
    db.book.deleteMany(),
    db.journalPost.deleteMany(),
    db.eventItem.deleteMany(),
    db.pressItem.deleteMany(),
  ]);

  // ───────────────────────────── BOOKS ─────────────────────────────
  const books = [
    {
      title: "Ghosts in the Ash",
      series: "Duke Savage",
      seriesIndex: 1,
      subtitle: "A Duke Savage Novel",
      tagline:
        "In a city that erases people with a transposed digit, one investigator was hired to find a woman who was never meant to be found.",
      description:
        "Duke Savage is fifty-three — a former investigative journalist turned private investigator operating out of a cramped office above a pawnshop in Los Angeles. Estranged from his daughter Julie and struggling to stay ahead of the addictions and regrets accumulated across decades, Duke survives by taking the cases nobody else wants. When an encrypted message warns that a young woman is running out of time, he begins searching for Sarah Chu, a twenty-seven-year-old data analyst who appears to have vanished without explanation. What he discovers is more disturbing than a disappearance: Sarah has been systematically erased from the administrative systems that govern modern life — employment records, housing data, medical access, financial history — transformed from a living person into what the system classifies as an administrative variance. The trail leads to Victoria Cross, a former insider exposing a powerful network known as the Babylon Circuit, which has developed a method for quietly displacing vulnerable people from valuable property corridors while remaining entirely within the law. Nobody broke the law. The law was the mechanism.",
      excerpt:
        "The house was a rental on Fontenelle Boulevard, the kind of property that existed in the kind of neglected rental where weeds choked the lawn and the furnace groaned like it was already spring. Two bedrooms, a yard that had given up, and the same furnace that ran three months behind the weather.\n\nThe man who lived there had been renting it for eleven months under a lease that was due for renewal in six weeks, though the lease would not be renewed. That had already been decided by people who would never see the property or know its address. The decision existed in a different document, in a different city, filed under a category that had no official name.\n\nThe street was quiet at 2 a.m. It was the kind of quiet that a Midwestern winter produced — not peaceful, but sealed. The cold kept people inside and kept sound close to the ground and kept the city's overnight processes running without witnesses.\n\nThe man inside the house had a daughter. Eight years old. She slept in the back bedroom with a lamp on — not from fear, but from habit, the specific comfort of a child who had learned that darkness was negotiable and light was a decision you could make for yourself. The lamp threw a warm stripe under the closed door. In the hallway, it looked like a signal.\n\nThe man was at his desk when they came through the door. He had a transcript in front of him, forty-three pages, double-spaced, the testimony of a man who had agreed to speak on the condition that his name would never appear in print and his family would never be endangered. The man at the desk had made all three promises. He had meant them. He had not yet understood that promises required infrastructure to keep, and that his infrastructure was already compromised.\n\nThe door came in on the second impact. Thirty seconds was enough. The man put the transcript in the furnace on his way through the kitchen. That was the right decision and he knew it and made it without hesitation, which was the last clean decision of the evening.\n\nWhat followed was not clean. It lasted four minutes. The intention was communication. The message was: you are not protected. Your promises are not infrastructure. The story does not exist. The message was delivered.\n\nWhat had not been factored — what existed in no document, no operational brief, no risk assessment — was the child. She appeared at the top of the stairs at the two-minute mark, drawn by the noise the way kids are drawn to anything that sounds wrong. She stood at the top of the stairs in her nightgown with the lamp light behind her and she looked down at the hallway. She could not tell them apart.\n\nThe variable had a daughter. The daughter had a wound now that had no name yet, that would take years to surface and longer to understand, that would express itself as distance and then as the specific vocabulary of a woman who had learned to say what she meant because the alternative — the elaborate interior architecture of not saying it — had been built by her father and she had watched what it cost him.\n\nThe men left. The man on the floor of his hallway got up. This was also noted — that he got up, that he always got up, that this quality in him was both his value and his problem. A man who didn't get up was a solved problem. A man who got up was a variable that required ongoing management.\n\nHe would require ongoing management for the next twenty-five years.\n\nThe transcript was ash. The informant would be dead in six days. The story did not run. The organisation noted the outcome in its records under the category it used for resolved operational risks: MANAGED. VARIABLE CONTAINED. MONITORING ONGOING.\n\nThe child went back to her room.\n\nShe left the lamp on.",
      releaseDate: new Date("2026-09-15"),
      status: "published",
      coverUrl: "/images/books/ghosts-in-the-ash.jpg",
      featured: true,
    },
    {
      title: "Residue",
      series: "Duke Savage",
      seriesIndex: 2,
      subtitle: "A Duke Savage Novel",
      tagline:
        "Power doesn't hide. It franchises. The mechanism Duke wounded in Book 1 has learned to hide better — and this time it's running on healthcare.",
      description:
        "The heat of the first case turns colder. More institutional. More dangerous. Duke is no longer operating in a case he controls; he's operating inside an architecture that was designed around people like him. When adults in supportive housing programs begin disappearing — their records scrambled by a new data platform called CONTINUUM — Duke traces the same architecture he exposed in Book 1, now franchised into healthcare and deployed across seven states. The man who designed the model is Thomas R. Carver, and he watched the first prosecution as a learning event. Meanwhile, Duke's daughter Julie has been running her own parallel investigation for eleven weeks without telling him. The case closes. The federal record exists. The audit is never closed.",
      excerpt: null,
      releaseDate: new Date("2027-05-01"),
      status: "forthcoming",
      coverUrl: "",
      featured: false,
    },
    {
      title: "The Record",
      series: "Duke Savage",
      seriesIndex: 3,
      subtitle: "A Duke Savage Novel",
      tagline:
        "The mechanism doesn't fear exposure. It fears irrelevance. The final case goes after the federal policy framework itself.",
      description:
        "Colder than the second book. Quieter. More personal. The gonzo paranoia has been replaced by something surgical. Duke is older. The case is bigger. The cost is closer to home. Carver's play is no longer a housing corridor or a healthcare platform — it is the federal data governance framework itself. A single line of policy Carver signed in 2019 is about to become the foundation of a new federal data integration standard applied across eleven agencies and forty-two states. If it passes, the architecture Duke has spent two books exposing becomes the operating system for the government's interaction with the most vulnerable populations in the country. Not a corridor. Not a platform. A standard. The mechanism doesn't hide in companies anymore. It hides in policy. And the weapon Duke reaches for is one he put down fifteen years ago: journalism.",
      excerpt: null,
      releaseDate: new Date("2028-03-01"),
      status: "forthcoming",
      coverUrl: "",
      featured: false,
    },
  ];

  // ───────────────────────────── JOURNAL ─────────────────────────────
  const posts = [
    {
      title: "On Writing the System as a Character",
      slug: "on-writing-the-system-as-a-character",
      category: "Craft",
      date: new Date("2026-05-12"),
      readMinutes: 6,
      excerpt:
        "The antagonist of Ghosts in the Ash isn't a person. It's a procedure. Here's how I learned to write a villain that lives in a database field.",
      body:
        "The antagonist of Ghosts in the Ash isn't a person. It's a procedure. A lapsed authorization. A transposed digit. An address verification that routes a medication reminder to the wrong building. That's the thing I kept circling for twenty-seven drafts: how do you write a villain that lives in a database field?\n\nThe answer, I think, is that you stop thinking of the system as background and start thinking of it as a character — one with a voice, a methodology, a kind of patience that no human antagonist can match. The system doesn't get tired. It doesn't get angry. It doesn't even know your name. It just processes you, and the processing is the violence.\n\nDuke sees this because Duke was a journalist before he was anything else, and a journalist is trained to ask who benefits. Every scene in the book, I tried to make sure Duke is tracking the transaction — who pays, who gets erased, what language was used to hide the exchange. Nobody in this book breaks the law. That's the horror. The law was the mechanism.\n\nI didn't fully understand what I'd written until the night my wife's friends went quiet listening to it and told me: the dry, sarcastic, notices-everything cynic — that's one hundred percent you. I'm still not sure if that's a compliment. I'm sure it's accurate.",
    },
    {
      title: "Three Voices, One Detective",
      slug: "three-voices-one-detective",
      category: "Craft",
      date: new Date("2026-04-03"),
      readMinutes: 5,
      excerpt:
        "Hunter S. Thompson's paranoia, Chandler's staccato, Ellroy's darkness. How Duke Savage was built from three writers who never met.",
      body:
        "Duke Savage is written in the register of three dead men who never met each other.\n\nHunter S. Thompson gave him the paranoia — the gonzo, drug-shadowed, notices-everything exhaustion of a man who has seen the world's guts and found them wanting. Thompson's contribution is the voice: the acid wit, the perpetual disappointment, the sense that the conspiracy is always real and always boring.\n\nRaymond Chandler gave him the sentences. Short. Staccato. A razor laid flat on the page. Chandler taught me that a detective novel is a poem with a body in it, and that the body matters less than the light you shine on it.\n\nJames Ellroy gave him the darkness. The institutional rot. The sense that power and violence are the same animal wearing different cages. Ellroy's contribution is the moral temperature: cold, precise, unforgiving of the euphemism.\n\nIf you can hold those three in the same mouth without one swallowing the others, you've got Duke. He's a gonzo journalist who learned to type like Chandler and see like Ellroy. He's also, and this matters more than any of the craft, a father who failed his daughter and is still calculating the cost. The voices are the instrument. The guilt is the engine.",
    },
    {
      title: "Twenty-Seven Drafts, or How the Book Wrote Me",
      slug: "twenty-seven-drafts-or-how-the-book-wrote-me",
      category: "Dispatch",
      date: new Date("2026-02-18"),
      readMinutes: 7,
      excerpt:
        "Every book begins with a real thing you can't stop seeing. This one began with the realization that the system doesn't need to be violent to destroy you.",
      body:
        "Twenty-seven drafts is not a number I'm proud of. It's a number I'm honest about.\n\nThe first draft of Ghosts in the Ash was a detective novel. The seventh draft was a thriller. The fourteenth was something I couldn't name. By the twenty-seventh, I understood that the book had been writing me the whole time — that the thing I kept circling, the thing I couldn't get right, wasn't a plot problem. It was a recognition problem. I couldn't see the mechanism clearly enough to write it, and the reason I couldn't see it was that I'd been living inside it.\n\nThe book is about how power learns to be invisible. Not violent — invisible. A transposed digit in a housing database. A lapsed pharmacy authorization. An address verification failure that routes a medication reminder to the wrong building. By the time anyone notices, the person is already gone, reclassified from a resident into an administrative variance, and the city has moved on. That's not a conspiracy. That's a workflow.\n\nSomewhere around draft nineteen I stopped trying to write the book I thought I was writing and started writing the book that was actually there. The difference was Duke. Once I let him be a man who'd been broken by his own crusade — a journalist who went too deep, a father who couldn't protect his daughter, an addict who manages it — the mechanism became visible. Duke sees it because Duke has been inside systems that process people. He knows what the processing feels like from the inside.\n\nTwenty-seven drafts. The last one felt like the first one that was honest. I think that's all you can ask of a book.",
    },
    {
      title: "The L.A. That Isn't on the Postcard",
      slug: "the-la-that-isnt-on-the-postcard",
      category: "Dispatch",
      date: new Date("2026-01-20"),
      readMinutes: 4,
      excerpt:
        "Duke's Los Angeles isn't the one in the movies. It's the one in the administrative code. A walking tour of the corners I can't stop writing about.",
      body:
        "Duke's Los Angeles isn't the one in the movies. It's the one in the administrative code — the one where eleven million people live in a basin and the systems that govern them were designed to be unnavigable.\n\nDuke works out of the Arts District, in a city that has spent a century learning to look like a postcard while operating like a procurement desk. The book's L.A. is the nonprofit philanthropy circuit and the consulting firms in Arlington and the research archives in Baltimore — because the mechanism that displaced 847 families in Los Angeles was designed in a conference room in McLean and laundered through a foundation whose smile had been clinically optimized to convert human trust into institutional compliance.\n\nI walk the city at hours no one should be walking it. Not because I'm Duke — I'm not, though my wife's friends disagree — but because the city at 3 a.m. is the only city that tells the truth. During the day, L.A. performs. At night, the performance drops, and what's left is the inventory: the shuttered nonprofits, the data centers, the buildings that look like community services and function as routing nodes. Duke sees all of it. My job is only to write it down.\n\nThe book ends in the Mojave. I won't say why. But if you've ever driven east out of the basin at dawn and felt the city let go of you all at once, you already know.",
    },
  ];

  // ───────────────────────────── EVENTS ─────────────────────────────
  // No events seeded — appearances are T.B.A. and managed as they're confirmed.
  const events: {
    title: string;
    venue: string;
    city: string;
    date: Date;
    type: string;
    url: string | null;
    past: boolean;
  }[] = [];

  // ───────────────────────────── PRESS ─────────────────────────────
  // No press seeded — reviews will appear as they are received. Nothing fabricated.
  const press: {
    quote: string;
    source: string;
    author: string | null;
    url: string | null;
    rating: number | null;
  }[] = [];

  console.log("› Seeding books, journal, events, press…");
  const [b, p, e, pr] = await Promise.all([
    db.book.createMany({ data: books }),
    db.journalPost.createMany({ data: posts }),
    db.eventItem.createMany({ data: events }),
    db.pressItem.createMany({ data: press }),
  ]);

  console.log(
    `  ✓ books=${b.count} journal=${p.count} events=${e.count} press=${pr.count}`
  );
  console.log("› Done.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
