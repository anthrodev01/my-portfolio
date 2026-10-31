/**
 * SmoothBallot case study copy, transcribed from the Figma files (smooth_l.svg desktop,
 * smooth_mob.svg phone). Where the two designs differ the difference is noted.
 */
export type PhaseItem = string | { text: string; desktopOnly: boolean }
export interface Phase {
  title: string
  items: PhaseItem[]
}

export const sb = {
  slug: 'smoothballot',
  metaTitle: 'SmoothBallot: A Secure E-voting Platform — Case study | AnthroDev',
  metaDescription:
    'SmoothBallot is a secure electronic voting platform for transparent, credible and accessible elections. A 12-week UI/UX design sprint covering the admin and voter workflows.',

  heroAlt:
    'A laptop showing the SmoothBallot website: "Seamlessly create and manage elections at your fingertips", with Get Started and Watch Demo buttons.',

  facts: [
    { label: 'Project Title:', value: 'SmoothBallot', strong: true },
    { label: 'Project Type:', value: 'E-voting Platform' },
    { label: 'Duration:', value: '12-Week Design Sprint' },
    { label: 'My Role:', value: 'UI/UX Designer' },
    { label: 'Tools:', value: 'Figma, Figjam' },
  ],

  credits: {
    title: 'Credits',
    people: [
      'Oladejo Jibril (UI/UX Designer)',
      'Ilerioluwa Adebayo (UI/UX Designer)',
      'Prince Ogbonna (Team lead, CMO)',
      'Araoye Oluwafemi (Frontend Developer)',
      'Ilbitoye Samuel (Frontend Developer)',
      'Owoade Anuoluwapo (Software Developer)',
    ],
  },

  overview: {
    title: 'Product Overview',
    paragraphs: [
      'SmoothBallot is a secure electronic voting platform designed to enable transparent, credible, and accessible elections. The platform allows organizations, institutions, and political bodies to set up and manage elections digitally while minimizing human interference and electoral malpractice.',
      'Built with the Nigerian electoral landscape in mind, where election rigging and result manipulation are common. SmoothBallot leverages structured workflows, access control, and real-time result tracking to promote trust and integrity in voting processes.',
    ],
  },

  problem: {
    title: 'Problem Statement',
    intro: 'Election processes in Nigeria and similar emerging democracies face persistent challenges such as:',
    items: [
      'Manual vote manipulation and result tampering',
      'Lack of transparency in vote counting',
      'Voter intimidation and ballot stuffing',
      'Delayed or falsified election results',
      'Poor accessibility for remote or disabled voters',
    ],
    outro: 'These issues reduce public trust in elections and undermine democratic processes.',
  },

  goal: {
    title: 'Goal & Objectives',
    intro:
      'Design a digital voting experience that ensures fairness, transparency, and administrative control while remaining easy to use for voters and election administrators.',
    lead: 'Key Objectives:',
    items: [
      'Prevent vote rigging through controlled access and digital audit trails',
      'Enable real-time result visibility without manual interference',
      'Provide administrators with full control over election setup and monitoring',
      'Allow voters to cast votes securely from any location',
      'Ensure the platform is scalable for multiple election types',
    ],
  },

  process: {
    title: 'Design Process',
    text: 'I adopted a human-centered, structured approach that turns complex problems into simple, usable products.',
    steps: [
      { label: 'Discover', color: '#57e5cc' },
      { label: 'Define', color: '#ff3508' },
      { label: 'Ideate', color: '#02a6ec' },
      { label: 'Design', color: '#e2e526' },
      { label: 'Testing', color: '#7dd326' },
    ],
    summary:
      'The process runs Discover, Define, Ideate, Design, Testing. Findings from Design and from Testing loop back into Ideate.',
  },

  timeline: {
    eyebrow: 'Design timeline',
    title: 'From understanding the problem to shaping the experience.',
    phases: <Phase[]>[
      {
        title: 'Research and Discovery',
        items: [
          'Problem definition and goal setting',
          'Research into election workflows and common rigging methods',
          'Identifying key user groups (admins and voters)',
        ],
      },
      {
        title: 'Define',
        items: [
          'Feature prioritization',
          'Information architecture design',
          'Admin and voter user flow mapping',
          // The desktop design lists two more; the phone design stops at three.
          { text: 'Wireframe sketches for key screens', desktopOnly: true },
          { text: 'Mapping high-level user journeys', desktopOnly: true },
        ],
      },
      {
        title: 'Design & Prototype',
        items: ['High-fidelity UI design', 'Admin dashboard design', 'Voting flow design', 'Clickable prototype creation'],
      },
      {
        title: 'Test & Refine',
        items: [
          'Usability testing',
          'Observing voter and admin interactions',
          'Refining copy, layout, and interactions',
          'Final design polish',
        ],
      },
    ],
  },

  admin: {
    title: 'Admin Workflow',
    shots: [
      {
        name: 'Admin Sign Up and Login Flow',
        alt: 'Browser window on smoothballot.com showing the SmoothBallot landing page: "Seamlessly create and manage elections at your fingertips", with an election settings screen beside it.',
      },
      {
        name: 'Political Election and Voter’s Acquisition Flow',
        alt: 'Browser window on the SmoothBallot dashboard: an illustration of three people at a laptop, "Ready to start? Create your first election now!", and a Create new election button.',
      },
      {
        name: 'Election Result Analytics and Result Export Flow',
        alt: 'Browser window on the election management dashboard for "Smoothdemo", on the Voters tab: a search box, an Add New Voters button, and one accredited voter marked Voted.',
      },
    ],
  },

  voter: {
    title: 'Voter’s Work Flow',
    shots: [
      {
        name: 'Casting a Vote Flow',
        alt: 'A phone showing the accreditation email from SMOOTHDEMO: your login details, a voting link, a result link, and "Thank you for choosing Smooth ballot".',
      },
      {
        name: 'Checking Result while election is still in Session',
        alt: 'The same accreditation email on a phone, with the result link the voter uses to check the count while the election is running.',
      },
    ],
  },

  live: {
    title: 'Visit Live Website',
    text: 'This sprint reinforced the importance of designing for confidence, not just functionality. In sensitive products like voting platforms, clarity and transparency are just as important as security.',
    link: 'Visit Website',
    // The designs don't give a URL; the browser mockups show smoothballot.com.
    href: 'https://smoothballot.com',
    thanks: 'Thank you for viewing',
    reach: 'Reach out via email:',
    memojiAlt: 'A smiling cartoon portrait giving a thumbs up.',
    emails: ['oladejojibril1@gmail.com', 'anthrodev01@gmail.com'],
  },

  next: { label: 'Next project', title: 'KAR App', href: '/work/kar' },

  /** For the floating section navigator. */
  sections: [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem and goals' },
    { id: 'process', label: 'Design process' },
    { id: 'admin', label: 'Admin workflow' },
    { id: 'voter', label: 'Voter’s workflow' },
    { id: 'live', label: 'Live website' },
  ],
}
