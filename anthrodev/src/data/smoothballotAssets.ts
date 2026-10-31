// The SmoothBallot case-study artwork (src/assets/images/sb). Plain imports so Vite fingerprints each file.
import laptop830 from '../assets/images/sb/sb-laptop-830.webp'
import laptop1660 from '../assets/images/sb/sb-laptop-1660.webp'
import site640 from '../assets/images/sb/sb-site-640.webp'
import site1046 from '../assets/images/sb/sb-site-1046.webp'
import shot1_768 from '../assets/images/sb/sb-shot-1-768.webp'
import shot1_1152 from '../assets/images/sb/sb-shot-1-1152.webp'
import shot2_768 from '../assets/images/sb/sb-shot-2-768.webp'
import shot2_1152 from '../assets/images/sb/sb-shot-2-1152.webp'
import shot3_768 from '../assets/images/sb/sb-shot-3-768.webp'
import shot3_1152 from '../assets/images/sb/sb-shot-3-1152.webp'
import phone1 from '../assets/images/sb/sb-phone-1.webp'
import phone2 from '../assets/images/sb/sb-phone-2.webp'
import adminLoginPoster from '../assets/images/sb/sb-admin-login-poster.webp'
import adminLoginVideo from '../assets/video/sb/sb-admin-login.mp4'
import resultsPoster from '../assets/images/sb/sb-results-export-poster.webp'
import resultsVideo from '../assets/video/sb/sb-results-export.mp4'
import setupPoster from '../assets/images/sb/sb-election-setup-poster.webp'
import setupVideo from '../assets/video/sb/sb-election-setup.mp4'
import castPoster from '../assets/images/sb/sb-cast-vote-poster.webp'
import castVideo from '../assets/video/sb/sb-cast-vote.mp4'
import checkPoster from '../assets/images/sb/sb-check-result-poster.webp'
import checkVideo from '../assets/video/sb/sb-check-result.mp4'
import memoji from '../assets/images/sb/sb-memoji.webp'

export const sbImg = {
  laptop830, laptop1660, site640, site1046,
  shot1_768, shot1_1152, shot2_768, shot2_1152, shot3_768, shot3_1152,
  phone1, phone2, memoji,
}

/** Screen recordings that play in the workflow frames (the image is the poster). */
export const sbVideo = {
  adminLogin: { src: adminLoginVideo, poster: adminLoginPoster },
  electionSetup: { src: setupVideo, poster: setupPoster },
  castVote: { src: castVideo, poster: castPoster },
  checkResult: { src: checkVideo, poster: checkPoster },
  resultsExport: { src: resultsVideo, poster: resultsPoster },
}
