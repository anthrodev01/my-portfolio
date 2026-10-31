export const site = {
  name: 'AnthroDev',
  fullName: 'Oladejo Jibril',
  role: 'Product Designer & Design Lead',
  location: 'Nigeria',
  /** Shows the green "Open to opportunities" pill in the hero. Set to false to hide it. */
  available: true,
  /** Off-site resume (opens in a new tab). */
  resume: 'https://canva.link/7g3qg6881706iy4',
  email: 'oladejojibril1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/oladejo-jibril',
}

export interface NavItem {
  label: string
  href: string
  /** Opens in a new tab (off-site links). */
  external?: boolean
}

// "Work" scrolls within the homepage (and opens /work from other pages); About and Contact
// are routes; Resume opens the Canva link in a new tab.
export const navLeft: NavItem[] = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
]
export const navRight: NavItem[] = [
  { label: 'Resume', href: site.resume, external: true },
  { label: 'Contact', href: '/contact' },
]
