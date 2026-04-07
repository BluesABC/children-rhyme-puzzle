// CDN配置文件
// 使用jsDelivr CDN - 最稳定的免费CDN

// jsDelivr CDN - 已验证可用
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle@main'

// 音频文件CDN配置 - 使用jsDelivr，正确路径为audio_backup_final目录
const AUDIO_CDN_CONFIG = {
  'chong_er_fei': 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle@main/audio_backup_final/chong_er_fei.mp3',
  'twinkle': 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle@main/audio_backup_final/twinkle.mp3',
  'pull_turnip': 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle@main/audio_backup_final/pull_turnip.mp3',
  'two_tigers': 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle@main/audio_backup_final/two_tigers.mp3',
  'luo_yu_da': 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle@main/audio_backup_final/luo_yu_da.mp3',
  'little_donkey': 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle@main/audio_backup_final/little_donkey.mp3',
  'yue_guang_guang': 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle@main/audio_backup_final/yue_guang_guang.mp3'
}

// 获取音频CDN URL
function getAudioCDNUrl(rhymeId) {
  return AUDIO_CDN_CONFIG[rhymeId] || null
}

// 检查是否需要使用CDN
function shouldUseCDN(filePath) {
  return filePath && filePath.includes('/audio/')
}

module.exports = {
  AUDIO_CDN_CONFIG,
  getAudioCDNUrl,
  shouldUseCDN,
  CDN_BASE_URL
}
