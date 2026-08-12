export interface PersonalStory {
  backstory: string;
  foundingMotivation: string;
  favoriteStack: string;
  hobbies: string[];
  lifeStory: string;
  popCultureFavorites: string;
}

export const personalStory: PersonalStory = {
  backstory: "I love building software that feels great to use. Whether it's shipping full-stack web apps, native mobile apps, or backend data pipelines, I focus on building things that are simple, fast, and reliable.",
  foundingMotivation: "Co-founded Homebaked to build a real platform for local bakeries. Built the entire system from scratch, from Next.js API routes and Postgres down to the native iOS app in React Native with Stripe Connect payouts.",
  favoriteStack: "TypeScript, React, React Native, Next.js, Node.js, Elixir.",
  hobbies: ["3D Printing & Game Dev", "Snowboarding Utah Mountains", "Golfing", "PC Gaming", "Skateboarding & Clay Sculpting"],
  lifeStory: "I live in Utah with my wife, two daughters, and our cat Bumi. When I'm not coding, I'm usually picking up a new hobby for a week, whether that's photography, clay sculpting, refurbishing old furniture, or skateboarding.",

  popCultureFavorites: "Huge fan of games with great atmosphere like Outer Wilds and Dredge, plus classics like GTA V. I code both for work and just for the fun of building cool things."
};
