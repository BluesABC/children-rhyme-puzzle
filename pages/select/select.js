// pages/select/select.js
const app = getApp()

Page({
  data: {
    currentLevel: 1,
    difficultyList: [
      {
        level: 1,
        name: '\u7b80\u5355',
        icon: '★',
        description: '\u9002\u5408\u521d\u5b66\u8005\u7684 3x3 \u62fc\u56fe',
        features: [
          '3x3 \u7f51\u683c\uff089 \u5757\u62fc\u56fe\uff09',
          '\u5927\u5c3a\u5bf8\u62fc\u56fe\u5757',
          '\u7b80\u5355\u56fe\u7247\u5185\u5bb9',
          '\u9002\u5408 2-4 \u5c81\u5b9d\u5b9d'
        ],
        locked: false,
        bestScore: null
      },
      {
        level: 2,
        name: '\u4e2d\u7b49',
        icon: '◆',
        description: '\u63d0\u5347\u6311\u6218\u7684 4x4 \u62fc\u56fe',
        features: [
          '4x4 \u7f51\u683c\uff0816 \u5757\u62fc\u56fe\uff09',
          '\u4e2d\u7b49\u5c3a\u5bf8\u62fc\u56fe\u5757',
          '\u590d\u6742\u56fe\u7247\u5185\u5bb9',
          '\u9002\u5408 4-6 \u5c81\u5b9d\u5b9d'
        ],
        locked: false,
        bestScore: null
      },
      {
        level: 3,
        name: '\u56f0\u96be',
        icon: '',
        description: '\u9ad8\u624b\u6311\u6218\u7684 5x5 \u62fc\u56fe',
        features: [
          '5x5 \u7f51\u683c\uff0825 \u5757\u62fc\u56fe\uff09',
          '\u5c0f\u5c3a\u5bf8\u62fc\u56fe\u5757',
          '\u9ad8\u96be\u5ea6\u56fe\u7247\u5185\u5bb9',
          '\u9002\u5408 6 \u5c81\u4ee5\u4e0a\u5b9d\u5b9d'
        ],
        locked: false,
        bestScore: null
      }
    ]
  },

  onLoad(options) {
    this.loadGameData()
  },

  onShow() {
    this.loadGameData()
  },

  // 加载游戏数据
  loadGameData() {
    const gameData = wx.getStorageSync('gameData') || {
      currentLevel: 1,
      bestScores: {}
    }
    
    const currentLevel = gameData.currentLevel || 1
    const bestScores = gameData.bestScores || {}
    
    // 更新难度列表
    const difficultyList = this.data.difficultyList.map(item => {
      return {
        ...item,
        bestScore: bestScores[item.level] || null,
        locked: item.level > currentLevel + 1 // 只解锁当前关卡和下一关
      }
    })
    
    this.setData({
      currentLevel,
      difficultyList
    })
  },

  // 选择难度
  selectDifficulty(e) {
    const level = parseInt(e.currentTarget.dataset.level)
    const difficulty = this.data.difficultyList.find(item => item.level === level)
    
    if (difficulty.locked) {
      wx.showToast({
        title: '\u8bf7\u5148\u5b8c\u6210\u524d\u4e00\u5173',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    this.setData({
      currentLevel: level
    })
    
    this.playSound('click')
    
    // 保存选择
    const gameData = wx.getStorageSync('gameData') || {}
    gameData.currentLevel = level
    wx.setStorageSync('gameData', gameData)
  },

  // 开始游戏
  startGame() {
    if (this.data.currentLevel === 0) {
      wx.showToast({
        title: '\u8bf7\u9009\u62e9\u96be\u5ea6',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    this.playSound('start')

    wx.navigateTo({
      url: '/pages/rhyme_select/rhyme_select'
    })
  },

  // 返回首页
  backToHome() {
    this.playSound('click')
    wx.navigateBack()
  },

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // 播放音效
  playSound(type) {
    try {
      if (type === 'start') {
        // 开始游戏音效
      } else if (type === 'click') {
        // 点击音效
      }
    } catch (error) {
      console.log('音效播放失败:', error)
    }
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '\u513f\u7ae5\u6b4c\u8c23\u62fc\u56fe\u6e38\u620f - \u6311\u6218\u4e0d\u540c\u96be\u5ea6',
      path: '/pages/select/select',
      imageUrl: ''
    }
  }
})
