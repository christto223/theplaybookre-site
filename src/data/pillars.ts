export interface Pillar {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  articleCount?: number;
}

export const PILLARS: Pillar[] = [
  {
    slug: 'lead-generation',
    name: 'Lead Generation',
    shortName: 'Lead Generation',
    description: 'From cold calls and door knocks to referrals and content engines, every way to build a pipeline that actually compounds.',
  },
  {
    slug: 'marketing-and-branding',
    name: 'Marketing & Branding',
    shortName: 'Marketing',
    description: 'Your brand, your content, your reputation online and off. How to be findable, memorable, and trusted before anyone meets you.',
  },
  {
    slug: 'sales-skills-and-scripts',
    name: 'Sales Skills & Scripts',
    shortName: 'Sales Skills',
    description: 'Scripts, objection handling, negotiation, and the art of closing without pressure.',
  },
  {
    slug: 'business-systems',
    name: 'Business Systems',
    shortName: 'Business Systems',
    description: 'CRMs, workflows, time blocking, and the operating infrastructure that keeps a real business running.',
  },
  {
    slug: 'ai-and-technology',
    name: 'AI & Technology',
    shortName: 'AI & Tech',
    description: 'The tools and tech stack that give serious agents an unfair advantage.',
  },
  {
    slug: 'mindset-and-performance',
    name: 'Mindset & Performance',
    shortName: 'Mindset',
    description: 'The mental game of a long career in real estate. Consistency, resilience, and staying sharp.',
  },
  {
    slug: 'growth-and-scaling',
    name: 'Growth & Scaling',
    shortName: 'Growth & Scaling',
    description: 'When to hire, how to delegate, and what it takes to build beyond yourself.',
  },
  {
    slug: 'the-fundamentals',
    name: 'The Fundamentals',
    shortName: 'Fundamentals',
    description: 'The core competencies every agent needs to master. Start here if you\'re new.',
  },
];

export function getPillarBySlug(slug: string): Pillar | undefined {
  return PILLARS.find(p => p.slug === slug);
}

export function getPillarName(slug: string): string {
  return getPillarBySlug(slug)?.name ?? slug;
}
