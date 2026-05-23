// From the Desk of Chris Linsell — manually curated crossover posts from chrislinsell.com
// Update this list as new posts are published. Newest first.

export interface CLPost {
  type: string;        // label: Analysis / Perspective / Opinion / etc.
  word: string;        // large background word shown in card image area
  title: string;
  excerpt: string;
  date: string;        // display format: "May 2026"
  href: string;        // full URL to the article on chrislinsell.com
}

export const CL_POSTS: CLPost[] = [
  {
    type: 'Analysis',
    word: 'AI',
    title: 'AI Will Kill the Average Agent — and Empower the Great Ones',
    excerpt: 'My honest take on where AI in real estate is going, why most agents are using it wrong, and what the agents who survive this wave will have in common.',
    date: 'May 2026',
    href: 'https://chrislinsell.com/blog',
  },
  {
    type: 'Perspective',
    word: 'NAR',
    title: "The NAR Settlement Changed Everything. Here's What Real Estate Actually Looks Like Now.",
    excerpt: "One year in — what the settlement actually did to agent income, buyer behavior, and the structure of the industry. The real picture, not the press release version.",
    date: 'Apr 2026',
    href: 'https://chrislinsell.com/blog',
  },
  {
    type: 'Opinion',
    word: 'TEAM',
    title: 'The Real Reason Most Real Estate Teams Fail',
    excerpt: "It's not the market. It's not the leads. I've watched enough teams collapse up close to tell you exactly what actually causes it — and it's almost always the same thing.",
    date: 'Mar 2026',
    href: 'https://chrislinsell.com/blog',
  },
];
