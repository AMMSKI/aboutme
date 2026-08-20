export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  url?: string;
  appStoreUrl?: string;
  githubUrl?: string;
  tags: string[];
  overview: string;
  architectureHighlights: {
    title: string;
    description: string;
    detailPoints?: string[];
  }[];
  metrics: {
    label: string;
    value: string;
    subtext?: string;
  }[];
}

export interface CaseStudy {
  id: string;
  company: string;
  title: string;
  tags: string[];
  challenge: string;
  execution: string[];
  url?: string;
  diagramType?: 'sequence' | 'flowchart';
  diagramDefinition?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  context: string;
}

export interface PersonInfo {
  name: string;
  roleTitle: string;
  subheadline: string;
  location: string;
  email: string;
  phone: string;
  socials: {
    github: string;
    linkedin: string;
  };
}

export const personalInfo: PersonInfo = {
  name: 'Alan Mamulski',
  roleTitle: 'Senior Full-Stack & Systems Engineer | Technical Founder',
  subheadline: 'Building web apps, mobile apps, real-time data pipelines, and practical AI tools.',
  location: 'South Jordan, Utah',
  email: 'alanmamulski@gmail.com',
  phone: '(801) 661-1873',
  socials: {
    github: 'https://github.com/AMMSKI',
    linkedin: 'https://www.linkedin.com/in/alan-mamulski',
  },
};

export const flagshipProject: Project = {
  id: 'homebaked',
  title: 'Homebaked',
  subtitle: 'Neighborhood Bakery Marketplace',
  role: 'Co-Founder & Lead Engineer',
  url: 'https://homebakedapp.com',
  appStoreUrl: 'https://apps.apple.com/us/app/homebaked-app/id6779087382',
  tags: [
    'Next.js 15',
    'React Native (Expo)',
    'TypeScript',
    'Supabase (PostgreSQL)',
    'Stripe Connect',
    'Mapbox GL'
  ],
  overview: 'Co-founded and built a marketplace connecting local home bakeries with neighbors. Handled the full stack, building the web app, the native iOS app, backend API routes, Mapbox discovery, push notifications, and automated seller payouts through Stripe Connect.',

  architectureHighlights: [
    {
      title: 'Shared API & Real-Time Sync',
      description: 'Built a single set of Next.js 15 API routes to serve both the web storefront and the native iOS app smoothly.',
    },
    {
      title: 'Order Notifications',
      description: 'Set up automated order notifications across push notifications, HTML emails, and SMS updates using database triggers.',
    },
    {
      title: 'Stripe Connect Payouts',
      description: 'Handled multi-party buyer checkouts, platform fee calculations, and automated payouts to baker bank accounts.',
    },
    {
      title: 'Mapbox Bakery Discovery',
      description: 'Used Mapbox location search to let customers discover nearby bakeries and automatically calculate delivery vs. pickup pricing.',
    }
  ],
  metrics: [
    { label: 'Platforms', value: 'Web & Native iOS', subtext: 'Live on the App Store' },
    { label: 'Payments', value: 'Stripe Connect', subtext: 'Automated Merchant Payouts' },
    { label: 'Discovery', value: 'Mapbox GL', subtext: 'Distance-Based Delivery Pricing' },
  ],
};

export const enterpriseCaseStudies: CaseStudy[] = [
  {
    id: 'bill-agentic-ai',
    company: 'Bill.com',
    title: 'Practical AI Integration & Telemetry',
    tags: ['TypeScript', 'Python', 'LLMs', 'Telemetry'],
    url: 'https://www.bill.com/press-release/bill-launches-new-ai-agents',
    challenge: 'Integrating practical AI and document recognition tools into high-volume data workflows while keeping them fast and observable.',
    execution: [
      'Tested prompt tweaks and document processing improvements to boost text extraction accuracy.',
      'Added telemetry, metrics, and tracking to catch issues early and ensure workflow reliability.',
    ],
  },
  {
    id: 'bill-product-engineering',
    company: 'Bill.com',
    title: 'Full-Stack Feature Engineering & Account Workflows',
    tags: ['TypeScript', 'React', 'Node.js', 'REST APIs'],
    challenge: 'Building reliable full-stack features and API workflows for high-traffic financial management platforms.',
    execution: [
      'Led feature engineering and API design for core customer workflows across web interfaces and backend services.',
      'Worked alongside security and compliance teams to review and secure user-facing input flows.',
      'Refactored legacy code in high-traffic areas to improve app speed, reliability, and maintainability.',
    ],
  },
  {
    id: 'divvy-data-pipelines',
    company: 'Divvy / Bill.com',
    title: 'High-Throughput Asynchronous Data Pipelines',
    tags: ['Elixir', 'Phoenix', 'Data Streams', 'PostgreSQL'],
    challenge: 'Building data processing pipelines to clean, transform, and sync database updates across microservices without dropping events.',
    execution: [
      'Built data stream processing pipelines to handle real-time database updates across application services.',
      'Achieved a 91% automated match rate for incoming transactional data using third-party data synchronization tools.',
    ],
  },
  {
    id: 'anglepoint-asset-management',
    company: 'Anglepoint',
    title: 'Full-Stack Web Tools & Feature Planning',
    tags: ['Elixir', 'Phoenix', 'React', 'Full-Stack'],
    challenge: 'Building full-stack web tools to help internal teams analyze software asset data as business requirements changed.',
    execution: [
      'Built and maintained full-stack web applications featuring Elixir backends and React frontends.',
      'Worked directly with non-technical stakeholders to turn business needs into clean technical features.',
    ],
  },
];

export const peerPraise: Testimonial[] = [
  {
    id: 'praise-1',
    quote: 'Alan is one of those rare engineers who can dive into complex systems and just deliver cleanly. He takes ownership of full-stack features and makes building feel effortless.',
    author: 'Engineering Manager',
    role: 'Software Engineering Director',
    context: 'Enterprise Platform Team',
  },
];
