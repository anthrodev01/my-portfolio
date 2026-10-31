import afrixa640 from '../assets/images/afrixa-640.webp'
import afrixa1304 from '../assets/images/afrixa-1304.webp'
import afrixa2608 from '../assets/images/afrixa-2608.webp'
import kar640 from '../assets/images/kar-640.webp'
import kar1304 from '../assets/images/kar-1304.webp'
import kar2608 from '../assets/images/kar-2608.webp'
import afrixaM764 from '../assets/images/afrixa-m-764.webp'
import afrixaM1146 from '../assets/images/afrixa-m-1146.webp'
import karM779 from '../assets/images/kar-m-779.webp'
import karM1168 from '../assets/images/kar-m-1168.webp'
import sb640 from '../assets/images/smoothballot-640.webp'
import sb1304 from '../assets/images/smoothballot-1304.webp'
import sb1428 from '../assets/images/smoothballot-1428.webp'

export interface ProjectImage {
  /** Fallback src (the 1x desktop size). */
  src: string
  /** Ready-to-use srcset string. */
  srcSet: string
  /** Intrinsic size of `src`, used to reserve space and avoid layout shift. */
  width: number
  height: number
  alt: string
  /** CSS object-position used when the panel is cropped on small screens. */
  position: string
  /**
   * Artwork rendered from the mobile Figma, used below 768px when the mobile
   * design re-composes the panel (KAR) or needs a sharper, pre-scaled copy (Afrixa).
   */
  mobile?: {
    srcSet: string
    /** Intrinsic size of the largest file; only the ratio matters for layout. */
    width: number
    height: number
  }
}

export interface Project {
  slug: string
  title: string
  /** Year the project was designed. */
  year: number
  /** Role and duration, as stated in the case study. */
  role: string
  duration: string
  /** Optional second link on the card (live product, prototype). */
  extra?: { label: string; href: string }
  /** Small caps line in the section header, e.g. "COMMERCE OPERATIONS PLATFORM". */
  category: string
  description: string
  tags: string[]
  /** Case-study route. These pages are built after the homepage is approved. */
  href: string
  /** Which side the text column sits on at desktop widths. */
  align: 'left' | 'right'
  /**
   * Phone layout (<768px), taken from the mobile Figma:
   * - meta:  'beside' puts the category on the title row, 'above' keeps it on the "01" row
   *          (SmoothBallot's category is too long to sit beside its title).
   * - media: 'inset' = whole artwork, 4px from the screen edges (Afrixa),
   *          'bleed' = whole artwork, edge to edge (KAR),
   *          'cover' = edge to edge, centre-cropped to the Figma frame (SmoothBallot).
   */
  mobile: { meta: 'beside' | 'above'; media: 'inset' | 'bleed' | 'cover' }
  image: ProjectImage
}

export const projects: Project[] = [
  {
    slug: 'afrixa',
    title: 'Afrixa',
    year: 2026,
    role: 'UI/UX Designer · Product Designer',
    duration: '2 months',
    category: 'Commerce operations platform',
    description:
      'Bringing sales, inventory, finance and business operations together in one connected commerce platform.',
    tags: ['Product strategy', 'UX design', 'Interface systems'],
    href: '/work/afrixa',
    align: 'left',
    mobile: { meta: 'beside', media: 'inset' },
    image: {
      src: afrixa1304,
      srcSet: `${afrixa640} 640w, ${afrixa1304} 1304w, ${afrixa2608} 2608w`,
      width: 1304,
      height: 680,
      alt: 'Afrixa dashboard showing daily sales, monthly revenue, orders, low stock items, a weekly sales chart and top-selling products.',
      position: 'left top',
      mobile: {
        srcSet: `${afrixaM764} 764w, ${afrixaM1146} 1146w`,
        width: 1146,
        height: 598,
      },
    },
  },
  {
    slug: 'smoothballot',
    title: 'SmoothBallot',
    year: 2023,
    role: 'UI/UX Designer',
    duration: '12 weeks',
    extra: { label: 'Visit live site', href: 'https://smoothballot.com' },
    category: 'Digital voting and participation',
    description:
      'Creating digital experiences that help organizations manage elections, contests and participation.',
    tags: ['Experience design', 'Usability', 'Design systems'],
    href: '/work/smoothballot',
    align: 'right',
    mobile: { meta: 'above', media: 'cover' },
    image: {
      src: sb1304,
      srcSet: `${sb640} 640w, ${sb1304} 1304w, ${sb1428} 1428w`,
      width: 1304,
      height: 621,
      alt: 'SmoothBallot dashboard listing active, upcoming and completed elections and contests.',
      position: 'center center',
    },
  },
  {
    slug: 'kar',
    title: 'KAR',
    year: 2022,
    role: 'Sole UX/UI Designer',
    duration: '4 weeks',
    extra: { label: 'Open prototype', href: 'https://www.figma.com/proto/TWYzcBFInvlbmfiYiBqYZU/Kar-App?page-id=604%3A12699&node-id=366-5647&p=f&viewport=282%2C376%2C0.06&t=DlQhpqybwGHAPYmy-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=366%3A5633' },
    category: 'Car sale mobile app',
    description:
      'Streamlining Car Buying and Selling Through Trust and Transparency',
    tags: ['UX design', 'Mobile Design', 'Product Design'],
    href: '/work/kar',
    align: 'left',
    mobile: { meta: 'beside', media: 'bleed' },
    image: {
      src: kar1304,
      srcSet: `${kar640} 640w, ${kar1304} 1304w, ${kar2608} 2608w`,
      width: 1304,
      height: 680,
      alt: 'KAR car marketplace app: a home feed of listed cars next to a welcome screen reading "Home for luxurious and quality automobiles".',
      position: '100% center',
      mobile: {
        srcSet: `${karM779} 779w, ${karM1168} 1168w`,
        width: 1168,
        height: 609,
      },
    },
  },
]
