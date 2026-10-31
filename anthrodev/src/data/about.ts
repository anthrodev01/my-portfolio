import portraitSm from '../assets/images/about/about-portrait-sm.webp'
import portraitLg from '../assets/images/about/about-portrait-lg.webp'
import pitchSm from '../assets/images/about/about-pitch-sm.webp'
import pitchLg from '../assets/images/about/about-pitch-lg.webp'
import fieldSm from '../assets/images/about/about-field-sm.webp'
import fieldLg from '../assets/images/about/about-field-lg.webp'
import momentsSm from '../assets/images/about/about-moments-sm.webp'
import momentsLg from '../assets/images/about/about-moments-lg.webp'
import deskSm from '../assets/images/about/about-desk-sm.webp'
import deskLg from '../assets/images/about/about-desk-lg.webp'
import adventuresSm from '../assets/images/about/about-adventures-sm.webp'
import adventuresLg from '../assets/images/about/about-adventures-lg.webp'
import badgeSm from '../assets/images/about/about-badge-sm.webp'
import badgeLg from '../assets/images/about/about-badge-lg.webp'
import detailsSm from '../assets/images/about/about-details-sm.webp'
import detailsLg from '../assets/images/about/about-details-lg.webp'

export interface AboutImage {
  sm: string
  lg: string
  /** Intrinsic size of the large file, so the browser can reserve the space. */
  w: number
  h: number
}

export const portrait: AboutImage & { zoom: number; focus: { d: string; m: string } } = {
  sm: portraitSm,
  lg: portraitLg,
  w: 1100,
  h: 1467,
  // The design crops the photo differently on desktop (tall frame) and phone
  zoom: 1.04,
  focus: { d: '49% 0%', m: '49% 63%' },
}

/** What the design's gallery shows, in the order it is numbered. */
export interface Snap {
  id: string
  no: string
  image: AboutImage
  alt: string
  /** Bold label (left) and handwritten line (right) under the photo. */
  label?: string
  note?: string
  /** How the design crops the photo: a little zoom, and where it sits in its frame
   *  (CSS object-position) on desktop and on phones. */
  zoom: number
  focus: { d: string; m: string }
  /** Colour of the paper behind the photo. */
  paper: string
  /** Whether the strip of tape across the top is shown. */
  tape?: boolean
}

export const snaps: Snap[] = [
  {
    id: 'pitch',
    no: '01',
    image: { sm: pitchSm, lg: pitchLg, w: 960, h: 1280 },
    alt: 'A football team in green kits lined up for a photo on a dirt pitch under a blue sky.',
    label: 'On the pitch',
    note: 'The beautiful game ⚽',
    zoom: 1.04,
    focus: { d: '100% 50%', m: '100% 50%' },
    paper: '#dce5d4',
    tape: true,
  },
  {
    id: 'field',
    no: '02',
    image: { sm: fieldSm, lg: fieldLg, w: 1000, h: 750 },
    alt: 'A person taking notes in a notebook among cars and people at a busy roadside park.',
    label: 'Out in the field',
    note: 'Always observing.',
    zoom: 1.2,
    focus: { d: '7% 95%', m: '10% 98%' },
    paper: '#e2dac6',
  },
  {
    id: 'moments',
    no: '03',
    image: { sm: momentsSm, lg: momentsLg, w: 1000, h: 667 },
    alt: 'Attendees at an event raising their hands in a bright room; one wears a Smooth Ballot t-shirt.',
    zoom: 1,
    focus: { d: '60% 50%', m: '50% 0%' },
    paper: '#e8d2c2',
    tape: true,
  },
  {
    id: 'desk',
    no: '04',
    image: { sm: deskSm, lg: deskLg, w: 1000, h: 891 },
    alt: 'A person in a blue cap sitting at a desk with a laptop and two monitors.',
    label: 'Design in progress',
    note: 'Life outside the Figma file.',
    zoom: 1,
    focus: { d: '50% 50%', m: '54% 50%' },
    paper: '#deddd7',
  },
  {
    id: 'adventures',
    no: '05',
    image: { sm: adventuresSm, lg: adventuresLg, w: 900, h: 1200 },
    alt: 'A person in a patterned shirt touching a bird sculpture in an art gallery.',
    label: 'Little adventures',
    note: 'Curiosity takes me places.',
    zoom: 1.04,
    focus: { d: '14% 0%', m: '23% 2%' },
    paper: '#e0e1da',
  },
  {
    id: 'badge',
    no: '06',
    image: { sm: badgeSm, lg: badgeLg, w: 860, h: 970 },
    alt: 'A person in a white tee and blue cap, wearing a lanyard, standing in front of a desk.',
    zoom: 1,
    focus: { d: '50% 10%', m: '50% 16%' },
    paper: '#ecd6cf',
  },
  {
    id: 'details',
    no: '07',
    image: { sm: detailsSm, lg: detailsLg, w: 860, h: 1147 },
    alt: 'A person in a red outfit and cap standing on steps below a golden statue.',
    label: 'Everyday details',
    note: 'The small things count, too.',
    zoom: 1,
    focus: { d: '50% 12%', m: '50% 23%' },
    paper: '#f1efe9',
  },
]

export const steps = [
  {
    no: '01',
    title: 'Understand',
    proof: { label: 'See it in Afrixa', href: '/work/afrixa#cs-persona' },
    text: 'Explore the problem, intended users, product requirements and business context.',
  },
  {
    no: '02',
    title: 'Structure',
    proof: { label: 'See it in Afrixa', href: '/work/afrixa#cs-ia' },
    text: 'Organize information, define user journeys and establish a clear foundation for the experience.',
  },
  {
    no: '03',
    title: 'Design',
    proof: { label: 'See it in Afrixa', href: '/work/afrixa#cs-screens' },
    text: 'Translate the structure into intuitive interfaces, meaningful interactions and reusable components.',
  },
  {
    no: '04',
    title: 'Refine',
    proof: { label: 'See it in Afrixa', href: '/work/afrixa#cs-reflection' },
    text: 'Review details, collaborate with stakeholders and developers, and improve through feedback and iteration.',
  },
]
