import LocalTime from './LocalTime'
import wordmark from '../assets/images/anthrodev-wordmark.webp'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <img
          className="site-footer__logo"
          src={wordmark}
          width={188}
          height={62}
          alt="AnthroDev — human centered, design driven, impact led"
          loading="lazy"
          decoding="async"
        />
        <LocalTime />
      </div>
    </footer>
  )
}
