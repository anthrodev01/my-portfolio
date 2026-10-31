import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { installRouter } from './router'

import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/header.css'
import './styles/hero.css'
import './styles/projects.css'
import './styles/contact.css'
import './styles/mobile.css'
import './styles/casestudy.css'
import './styles/motion.css'
import './styles/casestudy-fx.css'
import './styles/home-fx.css'
import './styles/kar.css'
import './styles/kar-fx.css'
import './styles/smooth.css'
import './styles/smooth-fx.css'
import './styles/work.css'
import './styles/about.css'
import './styles/about-fx.css'
import './styles/contact-page.css'
import './styles/contact-page-fx.css'

// Lets CSS know JS is running so scroll-reveal starts hidden only when it can
// actually be revealed again (content stays visible without JS).
document.documentElement.classList.add('js')
installRouter()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
