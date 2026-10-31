/**
 * Afrixa case study content — copied from the Figma desktop + mobile files.
 * Where the two files disagree (the mobile file repeats one pain point and
 * labels two learnings "02"), the desktop wording / numbering is used.
 */

export const afrixa = {
  slug: 'afrixa',
  metaTitle: 'Afrixa Commerce OS — Case study | AnthroDev',
  metaDescription:
    'Afrixa brings sales, inventory, accounting, customer management, suppliers and business insights into one connected platform. A product design case study by Jibril Oladejo.',

  title: { top: 'Afrixa', accent: 'Commerce OS' },
  headline: 'Bringing everyday business operations into one connected experience.',
  intro:
    'Afrixa brings sales, inventory, accounting, customer management, suppliers and business insights into one connected platform, helping retail businesses manage operations with greater visibility and control.',

  facts: [
    { key: 'role', label: 'Role', value: 'UI/UX Designer · Product Designer' },
    { key: 'team', label: 'Team', value: 'Product & Development Team' },
    { key: 'tools', label: 'Tools', value: 'Figma' },
    { key: 'duration', label: 'Duration', value: '2 Months' },
    { key: 'platform', label: 'Platform', value: 'Web application' },
  ],

  overview: [
    'Afrixa explores how the recurring tasks involved in running a business could live within one coherent system. The product brings sales, stock, product records and financial activity into a shared operational view.',
    'It is intended for business owners and operations teams who need visibility across day-to-day commerce activity without continuously reconciling separate tools and records.',
  ],

  premise: {
    label: 'Product premise',
    text: 'Give teams one reliable place to understand what is happening, decide what needs attention and complete routine operational work.',
  },

  problem: {
    eyebrow: 'The problem',
    title: 'Retail operations are fragmented and difficult to manage.',
    text: 'Many retail businesses rely on paper records, spreadsheets, messaging applications and disconnected tools to manage sales, stock, expenses and supplier relationships. This makes it harder to maintain accurate records, understand performance and make informed operational decisions.',
    items: [
      {
        title: 'Inventory discrepancies',
        text: 'Limited stock visibility can make replenishment and availability difficult to coordinate.',
      },
      {
        title: 'Fragmented records',
        text: 'Sales and financial information can be spread across tools and manual records.',
      },
      {
        title: 'Inefficient purchasing',
        text: 'Supplier and replenishment workflows require extra coordination and follow-up.',
      },
      {
        title: 'Delayed insight',
        text: 'Important business activity can be difficult to understand at a glance.',
      },
    ],
  },

  solution: {
    eyebrow: 'The solution',
    title: 'One connected platform for smarter retail management.',
    text: 'Afrixa Commerce OS is designed to bring essential retail operations together in one workspace, helping owners and teams manage everyday tasks while gaining a clearer view of business performance.',
    card: { label: 'Connected workspace', title: 'Afrixa Commerce OS', note: 'One operational view' },
    modules: [
      { title: 'Point of Sale', text: 'Process transactions and manage checkout.' },
      { title: 'Inventory Management', text: 'Monitor stock and replenishment.' },
      { title: 'Product Management', text: 'Organize product information and pricing.' },
      { title: 'Accounting', text: 'Organize financial records and expenses.' },
      { title: 'Supplier Management', text: 'Coordinate suppliers and purchasing.' },
      { title: 'Reports & AI Insights', text: 'Review activity and surface useful insights.' },
    ],
  },

  process: {
    eyebrow: 'Project timeline',
    title: 'The design process',
    steps: ['Discover', 'Define', 'Ideate', 'Design', 'Testing'],
    phases: [
      {
        title: 'Discovery and Problem Definition',
        duration: '1 week',
        items: [
          'Understand the operational challenges Afrixa aims to address.',
          'Define intended users and business context.',
          'Establish the product’s key functional areas.',
        ],
      },
      {
        title: 'User Needs and Information Architecture',
        duration: '1 week',
        items: [
          'Define the primary persona and user needs.',
          'Organize product modules and navigation.',
          'Map relationships across sales, products, inventory and reporting.',
        ],
      },
      {
        title: 'User Flows and Low-Fidelity Wireframes',
        duration: '2 weeks',
        items: [
          'Map essential user journeys.',
          'Explore dashboard hierarchy and page structure.',
          'Establish task flows and interface priorities.',
        ],
      },
      {
        title: 'High-Fidelity UI Design',
        duration: '2 weeks',
        items: [
          'Develop visual styles and reusable components.',
          'Design dashboard, POS, products and inventory.',
          'Establish consistency across key operational screens.',
        ],
      },
      {
        title: 'Design Refinement and Handoff',
        duration: '2 weeks',
        items: [
          'Refine interface details and interaction states.',
          'Review consistency across modules.',
          'Prepare specifications and components where applicable.',
        ],
      },
    ],
  },

  persona: {
    eyebrow: 'Provisional design persona',
    title: 'Understanding the people behind retail operations',
    tag: 'Primary persona / provisional',
    name: ['Tunde', 'Adeyemi'],
    photoAlt: 'Tunde Adeyemi, the provisional persona: a smiling man in a grey shirt with his arms crossed outside a shop.',
    details: [
      { key: 'role', label: 'Role', value: 'Independent retail business owner' },
      { key: 'business', label: 'Business', value: 'Growing supermarket or retail store' },
      { key: 'age', label: 'Age', value: '38' },
    ],
    bio: 'Tunde manages daily retail operations, including sales, stock, staff, suppliers and expenses. He needs a clearer way to understand business performance without switching between multiple tools or relying on fragmented records.',
    goals: [
      'Monitor sales and performance in one place.',
      'Maintain accurate inventory records.',
      'Track expenses and financial activity.',
      'Coordinate replenishment and suppliers.',
      'Make informed decisions quickly.',
    ],
    pains: [
      'Records are spread across different tools.',
      'Manual reconciliation can take time.',
      'Performance is difficult to assess at a glance.',
      'Supplier coordination requires extra effort.',
    ],
    quote: '“I want to understand what is happening in my business without checking five different places.”',
    quoteNote: 'Core need · Provisional persona',
    opportunity: {
      label: 'Design opportunity',
      text: 'Create a connected, easy-to-understand workspace that gives users access to important information and everyday operational tasks.',
    },
  },

  needs: {
    eyebrow: 'User needs',
    title: 'Turning user needs into design opportunities',
    rows: [
      ['Understand business performance.', 'A dashboard with sales summaries, business metrics, activity feeds and relevant alerts.'],
      ['Maintain accurate inventory.', 'Structured inventory tables, stock indicators, search, filters and low-stock alerts.'],
      ['Process sales efficiently.', 'A POS flow prioritizing product discovery, cart management, clear totals and payment selection.'],
      ['Organize financial information.', 'Clear financial summaries, transaction histories and date-based reporting.'],
      ['Coordinate suppliers and replenishment.', 'Connected supplier information, purchasing workflows and order status visibility.'],
      ['Make informed decisions.', 'Accessible reports and AI-assisted business insights.'],
    ],
  },

  architecture: {
    eyebrow: 'Information architecture',
    title: 'Organizing the retail ecosystem',
    root: { label: 'Central overview', title: 'Afrixa Commerce OS', note: 'Dashboard' },
    nodes: [
      'Point of Sale',
      'Products',
      'Inventory',
      'Orders & Suppliers',
      'Customers / CRM',
      'Accounting',
      'Reports',
      'AI Insights',
      'Settings & Access',
    ],
  },

  flow: {
    eyebrow: 'Core user flow',
    title: 'Connecting everyday retail operations',
    text: 'The core flow illustrates how a retail user moves from accessing the platform to completing operational tasks and reviewing business activity.',
    start: 'Sign in',
    dashboard: 'Business dashboard',
    select: 'Select operational module',
    modules: ['Point of Sale', 'Products & Inventory', 'Accounting', 'Orders & Suppliers', 'Reports & AI Insights'],
    end: 'Update relevant records & dashboard',
    journeys: [
      {
        title: 'POS journey',
        steps: ['Find product', 'Add to cart', 'Review total', 'Select payment', 'Complete transaction', 'Confirm sale'],
      },
      {
        title: 'Inventory journey',
        steps: ['Open inventory', 'Find product', 'Review stock', 'Adjust or replenish', 'Save changes', 'Confirm update'],
      },
      {
        title: 'Reports journey',
        steps: ['Open reports', 'Select date range', 'Review performance', 'Explore insights', 'Identify next action'],
      },
    ],
  },

  screens: {
    eyebrow: 'High-fidelity screens',
    title: 'Bringing the product experience to life',
    tabs: ['Dashboard', 'Point of Sale', 'Products', 'Reports'],
    alt: 'Afrixa dashboard showing daily sales, monthly revenue, orders, low stock items, a weekly sales chart, top-selling products, a priority restock list and the AFRIXA Agent.',
    posAlt:
      'Afrixa point of sale screen with a searchable product grid and category filters on the left, and the current sale on the right with line items, customer, discount, totals, a Hold button and a Charge button.',
    productsAlt:
      'Afrixa products screen with a searchable product table showing name, SKU, category, selling price, stock level, reorder point and status, with All, Active, Low Stock and Archived filters, and Import, Export and Add Product actions.',
    reportsAlt:
      'Afrixa reports screen showing date range, branch and comparison filters, sales, orders, average order value and refund totals, a sales over time bar chart, and sales broken down by payment method and by category.',
  },

  reflection: {
    eyebrow: 'Reflection',
    title: 'What I learned from the process',
    learnings: [
      {
        title: 'Product complexity requires clear prioritization.',
        text: 'Afrixa spans multiple operational areas. Designing a coherent experience means understanding how each module fits into the larger system while ensuring everyday tasks remain easy to find.',
      },
      {
        title: 'Information architecture shapes usability.',
        text: 'A dashboard is not just a collection of metrics. Navigation, relationships between modules and access to the right actions are fundamental to making the product understandable.',
      },
      {
        title: 'Consistency matters across complex products.',
        text: 'Reusable components, predictable interactions and clear data presentation help create a cohesive experience across dashboards, tables, forms and transaction flows.',
      },
    ],
    closing:
      'Working on Afrixa reinforced the importance of designing beyond individual screens. Strong product design connects user needs, business operations, information architecture and interface decisions into one coherent experience.',
  },

  next: { label: 'Next project', title: 'SmoothBallot', href: '/work/smoothballot' },

  outro: {
    eyebrow: 'Afrixa Commerce OS · Case study',
    title: 'One connected view of the work that keeps retail moving.',
  },
}
