// Image configuration file
// Rhyme image local paths

// Use local images from project root
const IMAGE_BASE = '/images/rhymes'

// Rhyme image local configuration
const IMAGE_CONFIG = {
  'two_tigers': `${IMAGE_BASE}/two_tigers.jpg`,
  'twinkle': `${IMAGE_BASE}/twinkle.jpg`,
  'pull_turnip': `${IMAGE_BASE}/pull_turnip.jpg`,
  'little_donkey': `${IMAGE_BASE}/little_donkey.jpg`,
  'luo_yu_da': `${IMAGE_BASE}/luo_yu_da.jpg`,
  'yue_guang_guang': `${IMAGE_BASE}/yue_guang_guang.jpg`,
  'chong_er_fei': `${IMAGE_BASE}/chong_er_fei.jpg`
}

// Get image URL
function getImageUrl(rhymeId) {
  const url = IMAGE_CONFIG[rhymeId]
  console.log(`»ñÈ¡Í¼Æ¬URL: ${rhymeId} -> ${url}`)
  return url
}

module.exports = {
  IMAGE_CONFIG,
  getImageUrl,
  IMAGE_BASE
}
