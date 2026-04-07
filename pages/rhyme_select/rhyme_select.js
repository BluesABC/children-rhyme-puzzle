// pages/rhyme_select/rhyme_select.js
const { getImageUrl } = require('../../image_config.js')

Page({
  data: {
    difficulty: 1,
    imageLoadStatus: {}, // 图片加载状态
    rhymes: [
      {
        id: 'two_tigers',
        name: '两只老虎',
        desc: '经典童谣：两只老虎跑得快。',
        cover: getImageUrl('two_tigers')
      },
      {
        id: 'twinkle',
        name: '小星星',
        desc: '经典童谣：一闪一闪亮晶晶。',
        cover: getImageUrl('twinkle')
      },
      {
        id: 'pull_turnip',
        name: '拔萝卜',
        desc: '经典童谣：拔萝卜拔萝卜。',
        cover: getImageUrl('pull_turnip')
      },
      {
        id: 'little_donkey',
        name: '我有一只小毛驴',
        desc: '经典童谣：我有一只小毛驴我从来也不骑。',
        cover: getImageUrl('little_donkey')
      },
      {
        id: 'luo_yu_da',
        name: '落雨大',
        desc: '经典粤语童谣：落雨大水浸街。',
        cover: getImageUrl('luo_yu_da')
      },
      {
        id: 'yue_guang_guang',
        name: '月光光',
        desc: '经典粤语童谣：月光光照地堂。',
        cover: getImageUrl('yue_guang_guang')
      },
      {
        id: 'chong_er_fei',
        name: '虫儿飞',
        desc: '经典童谣：虫儿飞虫儿飞。',
        cover: getImageUrl('chong_er_fei')
      }
    ]
  },

  onLoad() {
    this.loadDifficulty()
    // 添加调试信息
    console.log('=== 图片路径调试 ===')
    this.data.rhymes.forEach(rhyme => {
      console.log(`童谣: ${rhyme.name}, 路径: ${rhyme.cover}`)
    })
  },

  // 加载难度设置
  loadDifficulty() {
    const gameData = wx.getStorageSync('gameData') || {}
    const difficulty = gameData.currentLevel || 1
    this.setData({
      difficulty: difficulty
    })
  },

  // 设置难度
  setDifficulty(e) {
    const difficulty = parseInt(e.currentTarget.dataset.diff)
    this.setData({
      difficulty: difficulty
    })
    
    // 保存难度设置
    const gameData = wx.getStorageSync('gameData') || {}
    gameData.currentLevel = difficulty
    wx.setStorageSync('gameData', gameData)
    
    console.log(`设置难度: ${difficulty}`)
  },

  // 图片加载成功处理
  onImageLoad(e) {
    const rhymeId = e.currentTarget.dataset.id
    console.log(`✅ 图片显示成功: ${rhymeId}`)
    
    // 更新加载状态
    this.setData({
      [`imageLoadStatus.${rhymeId}`]: 'success'
    })
  },

  // 图片加载失败处理
  onImageError(e) {
    const rhymeId = e.currentTarget.dataset.id
    const rhyme = this.data.rhymes.find(r => r.id === rhymeId)
    if (rhyme) {
      console.log(`❌ 图片显示失败: ${rhymeId}`)
      console.log(`❌ 失败的图片路径: ${rhyme ? rhyme.cover : '未知'}`)
      console.log(`❌ 错误详情:`, e.detail)
      
      // 更新加载状态
      this.setData({
        [`imageLoadStatus.${rhymeId}`]: 'error'
      })
    }
  },

  startGame(e) {
    const id = e.currentTarget.dataset.id
    this.goGame(id)
  },

  goGame(rhymeId) {
    wx.navigateTo({
      url: `/pages/game/game?rhymeId=${encodeURIComponent(rhymeId)}&difficulty=${this.data.difficulty}`
    })
  },

  backHome() {
    wx.navigateBack()
  }
})