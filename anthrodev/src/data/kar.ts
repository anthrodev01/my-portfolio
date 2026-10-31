/**
 * KAR case study copy, transcribed from the Figma files (KAR.svg desktop,
 * KAR_MOBILE.svg phone). Where the two designs differ the difference is noted.
 */
export const kar = {
  slug: 'kar',
  metaTitle: 'KAR: A Peer-to-Peer Car Marketplace — Case study | AnthroDev',
  metaDescription:
    'KAR is a conceptual mobile app that builds trust in the used-car market through verified listings, transparent history and safe messaging. A four-week UX/UI sprint, end to end.',

  title: 'Streamlining Car Buying and Selling Through Trust and Transparency',
  /** Used by the hero artwork's text alternative. */
  heroAlt:
    'The KAR logo over a dark photograph of a classic luxury car, with three phone screens in front: a car detail page for a 1997 BMW Z3, the home feed, and My Orders.',

  facts: [
    { label: 'Project Title:', value: 'A Peer-to-Peer Car Marketplace', strong: 'KAR App:' },
    { label: 'Project Type:', value: 'Mobile App (iOS & Android) | Conceptual UX/UI Design Project' },
    { label: 'Duration:', value: '4-Week Design Sprint' },
    { label: 'My Role:', value: 'Sole UX/UI Designer (End-to-End Process)' },
    { label: 'Tools:', value: 'Figma' },
  ],

  overview: {
    title: 'Product Overview',
    challenge: {
      title: 'The Challenge',
      text: 'The used car market is fraught with anxiety. Buyers lack trust in listings and sellers struggle to reach serious buyers.',
    },
    outcome: {
      title: 'The Outcome',
      text: 'A mobile app that builds trust through verified listings, transparent history reports, and integrated messaging, creating a safer, more efficient marketplace.',
    },
    handAlt:
      'A hand holding a phone that shows the KAR welcome screen: "Welcome to KAR. Home for luxurious and quality automobiles", with a Let\'s Begin button.',
  },

  process: {
    title: 'Design Process',
    /** Colours are the stroke colours from the diagram. */
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
    phases: [
      {
        title: 'Research and Discovery',
        items: [
          'Explore the car-buying journey.',
          'Identify potential user frustrations.',
          'Review marketplace experiences.',
          'Gather relevant secondary research where available.',
        ],
      },
      {
        title: 'Define',
        items: [
          'Organize the key problems.',
          'Identify intended users.',
          'Develop provisional personas.',
          'Define opportunities and priorities.',
        ],
      },
      {
        title: 'Information Architecture and UX',
        items: [
          'Structure app navigation.',
          'Map the discovery journey.',
          'Define detail and comparison flows.',
          'Establish task priorities.',
        ],
      },
      {
        title: 'Wireframing and UI Design',
        items: [
          'Explore low-fidelity layouts.',
          'Establish visual direction.',
          'Design high-fidelity screens.',
          'Create reusable components.',
        ],
      },
      {
        title: 'Prototype, Test, and Iterate',
        items: [
          'Connect primary screens where applicable.',
          'Identify areas requiring validation.',
          'Refine from actual feedback when available.',
          'Prepare specifications where applicable.',
        ],
      },
    ],
  },

  persona: {
    title: 'User Persona',
    avatarAlt: 'Illustration of Alex: a bearded man in a dark jacket against a teal background.',
    details: [
      { label: 'Name:', value: 'Alex' },
      { label: 'Age:', value: '28' },
      { label: 'Tag:', value: 'Alex, The Cautious Buyer' },
    ],
    want: { title: 'Want', text: "I want to be sure I'm not buying someone else's problem." },
    goals: {
      title: 'Goals',
      text: 'Find a reliable car within budget, verify its history, communicate safely with the seller.',
    },
    frustration: {
      title: 'Frustration',
      text: 'Lowball offers, "is this available?" messages, safety concerns, complex paperwork.',
    },
    hmw: {
      title: 'How Might We (HMW) Questions',
      items: [
        "HMW help buyers feel confident about a car's condition before seeing it?",
        'HMW simplify the transaction process after an agreement is made?',
        'HMW facilitate safe and efficient communication between users?',
      ],
    },
  },

  architecture: {
    id: 'architecture',
    eyebrow: 'Information architecture',
    title: 'Organizing the car discovery experience.',
    root: 'Marketplace',
    top: ['Home / Discover', 'Search', 'Saved Cars', 'Compare', 'Profile'],
    nodes: [
      'Browse listings',
      'Search & filter',
      'Vehicle details',
      'Save vehicle',
      'Add to compare',
      'Review comparison',
      'Seller information',
      'Contact seller',
      'Saved & profile settings',
    ],
  },

  flow: {
    eyebrow: 'Core user flow',
    title: 'From discovering a car to contacting the seller.',
    text: 'The primary journey focuses on helping a buyer move from initial discovery to evaluating a vehicle and taking the next step. It does not include an in-app purchase or payment flow.',
    steps: [
      'Start',
      'Open KAR',
      'Browse listings',
      'Apply filters',
      'View matches',
      'Select vehicle',
      'Review details',
      'Evaluate vehicle & seller',
    ],
    decision: "Does this vehicle meet the buyer's needs?",
    no: { tag: 'No', title: 'Return to results', text: 'Refine filters or choose another vehicle' },
    yes: { tag: 'Yes', title: 'Save or contact seller', text: 'Successful completion' },
  },

  wireframes: {
    title: 'Sketches/Low-fidelity Wireframes',
    items: [
      { name: 'Home', alt: 'Low-fidelity home screen: greeting, search field, brand chips, and Just for you, Trending and Latest rows of listing cards.' },
      { name: 'Search', alt: 'Low-fidelity search screen with an empty results area and the keyboard open.' },
      { name: 'Search suggestions', alt: 'Low-fidelity search screen listing suggestions such as "Benz 112".' },
      { name: 'Results', alt: 'Low-fidelity results list of vehicle cards with a filter button.' },
      { name: 'Vehicle details', alt: 'Low-fidelity vehicle page: gallery with a Go to full view button, name, model and price, and four trust tiles: Free test drive, Verified inspection, Verified seller and Latest model.' },
      { name: 'Cart', alt: 'Low-fidelity My Cart screen with two items, a cart total, a Check out button and an Others bought row.' },
      { name: 'Checkout: shipping', alt: 'Low-fidelity checkout, step 1 of 3 (Shipping), listing Home and Office addresses.' },
      { name: 'Add new address', alt: 'Low-fidelity Add New Address form with title, country, telephone, city, postal code and address fields.' },
      { name: 'Checkout: payment', alt: 'Low-fidelity checkout, step 2 of 3 (Payment), listing saved and new payment methods.' },
      { name: 'Add card: scan', alt: 'Low-fidelity Add New Card screen in Scan Card mode.' },
      { name: 'Add card: manual', alt: 'Low-fidelity Add New Card screen in Input manually mode, with card number, holder name, expiry and CVV.' },
      { name: 'Checkout: review', alt: 'Low-fidelity checkout, step 3 of 3 (Review), with the shipping address, payment, items, tax, total and a Place Order button.' },
      { name: 'Messages', alt: 'Low-fidelity chat with seller Mark Lewis, asking for and receiving a test ride.' },
    ],
  },

  hifi: {
    eyebrow: 'High-fidelity screens',
    title: 'Bringing the KAR experience to life.',
    banner: {
      desktop: { title: 'Discover' },
      phone: { title: 'Find a car that fits your life.' },
      tagline: 'Drive what moves you',
      text: 'Discover, compare and evaluate vehicles in one focused mobile experience.',
    },
    stripAlt:
      'Four KAR screens side by side: onboarding, the home feed, filters, and search results.',
    onboarding: {
      caption: 'Onboarding',
      alt: 'KAR onboarding, step 2 of 3: "What kind of car are you looking for?" with selectable tiles for Stylish, Family car, Technology, Best deals, Sport car and Outdoors, and Continue and Skip buttons.',
      text: 'This screen moves beyond technical specs (like engine size) to ask about the user\'s lifestyle and intent. By selecting terms like "Family car" or "Best deals," users feel understood from the start. This data allows the app to personalize the home feed with highly relevant recommendations, increasing engagement and helping buyers discover cars they might not have searched for directly.',
    },
    home: {
      caption: 'Homescreen',
      alt: 'KAR home screen: a personal greeting, search bar, brand chips, and Just for you and Trending rows of listing cards.',
      intro:
        "Imagine Oladejo, opening the app after a busy day. He's not just browsing—he's on a mission to find a reliable car. This home screen is his mission control:",
      points: [
        'The personalized greeting creates an immediate sense of familiarity and trust.',
        'The prominent search bar respects his need for direct control when he knows what he wants.',
        'The "Just for you" section acts as his trusted advisor, already filtering the overwhelming market down to cars that fit his stated life (like "Family car").',
        '"Trending" and "Latest" satisfy his need to feel informed and not miss out on a great deal.',
      ],
      outro:
        'Every section serves a distinct psychological need, reducing his anxiety and decision fatigue from the very first glance.',
    },
    filters: {
      caption: 'Filters',
      alt: 'KAR filters sheet: sort chips, a price range slider with a distribution chart, and a Show 50 results button.',
      text: 'In a market saturated with options, the right filter is a superpower. This screen cuts through the noise by highlighting filters that impact safety, value, and peace of mind first. It helps users move from browsing hundreds of questionable listings to reviewing a shortlist of credible, relevant cars in minutes, putting them in control of their search.',
    },
    other: {
      title: 'Other Screens',
      items: [
        { name: 'Search', alt: 'Search with the keyboard open and suggestions: Benz 112, BMW 112.' },
        { name: 'No results', alt: 'No-results screen: "Oh no! We couldn\'t find any results for "Sedan 156". Did you mean "Sedan M56"?" with a Try a different search button.' },
        { name: 'Results', alt: 'Results for Benz, 500 results, showing a Mercedes Benz EQB at $50,000 and a second listing.' },
        { name: 'Vehicle details', alt: 'Vehicle page for a 1997 BMW Z3 at $12,748 with Preview, Exterior and Interior tabs and trust tiles for Free test drive, Verified inspection, Verified seller and Latest model.' },
        { name: 'Features', alt: 'Vehicle features: drive LHD, original condition, year 1997, convertible/roadster, 2 seats, 2 doors; a Similar cars row; Message seller and Add to cart buttons.' },
        { name: 'Exterior 360°', alt: 'Exterior view of the car in a rotated, full-screen photo viewer with Preview, Exterior and Interior tabs.' },
        { name: 'Interior 360°', alt: 'Interior view of the car in a rotated, full-screen photo viewer with Preview, Exterior and Interior tabs.' },
        { name: 'Order placed', alt: 'Confirmation screen: "Woohoo! Your order has been placed and you will get a shipping confirmation soon." with a Continue button and confetti.' },
        { name: 'Orders: empty', alt: 'My Orders empty state: "Not a single order in sight…" with a View recommended products button.' },
        { name: 'My Orders', alt: 'My Orders list with three orders: a BMW 250M arriving today with a map, a Mercedes Benz EQB and a BMW I3 Base, both delivered.' },
      ],
    },
  },

  prototype: {
    title: 'Interactive Prototype',
    text: 'Experience the core user flow of finding a car and viewing product and checking out, in the interactive prototype below',
    link: 'KAR app prototype link',
    /** From the Figma file's prototype link. */
    href: 'https://www.figma.com/proto/TWYzcBFInvlbmfiYiBqYZU/Kar-App?page-id=604%3A12699&node-id=366-5647&p=f&viewport=282%2C376%2C0.06&t=DlQhpqybwGHAPYmy-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=366%3A5633',
  },

  learnings: {
    title: 'What the process taught me.',
    portraitAlt: 'Portrait of Oladejo Jibril in a denim jacket and sunglasses, in black and white.',
    name: 'Oladejo Jibril',
    items: [
      {
        title: 'Trust is part of the experience',
        text: 'Designing a car marketplace involves more than attractive vehicle cards. Buyers need useful information that helps them evaluate listings and sellers.',
      },
      {
        title: 'Information hierarchy affects decision-making',
        text: 'Price, mileage, specifications and condition all contribute to the decision. A clear hierarchy makes a listing easier to understand.',
      },
      {
        title: 'Comparison is part of discovery',
        text: 'A useful marketplace should support exploration and evaluation. Consistent attributes give buyers a structured way to assess options.',
      },
    ],
    closing:
      'KAR reinforced the importance of designing a marketplace around the decisions users need to make, not just the content they need to browse. A thoughtful experience connects discovery, information clarity, comparison and action into one coherent journey.',
  },

  next: { label: 'Next project', title: 'Afrixa', href: '/work/afrixa' },

  /** For the floating section navigator. */
  sections: [
    { id: 'overview', label: 'Overview' },
    { id: 'process', label: 'Design process' },
    { id: 'persona', label: 'User persona' },
    { id: 'architecture', label: 'Information architecture' },
    { id: 'flow', label: 'Core user flow' },
    { id: 'wireframes', label: 'Wireframes' },
    { id: 'hifi', label: 'High-fidelity screens' },
    { id: 'prototype', label: 'Interactive prototype' },
    { id: 'learnings', label: 'What I learned' },
  ],
}
