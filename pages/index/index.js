// pages/index/index.js
const app = getApp()

Page({
  data: {
    totalGames: 0,
    completedGames: 0,
    currentLevel: 1
  },

  onLoad(options) {
    this.loadGameData()
    this.addAnimation()
  },

  onShow() {
    this.loadGameData()
  },

  // 加载游戏数据
  loadGameData() {
    const gameData = wx.getStorageSync('gameData') || {
      totalGames: 0,
      completedGames: 0,
      currentLevel: 1,
      bestScores: {}
    }
    
    this.setData({
      totalGames: gameData.totalGames || 0,
      completedGames: gameData.completedGames || 0,
      currentLevel: gameData.currentLevel || 1
    })
  },

  // 添加动画效果
  addAnimation() {
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.select('.bounce').boundingClientRect()
      query.exec((res) => {
        if (res[0]) {
          this.setData({
            bounceAnimation: true
          })
        }
      })
    }, 500)
  },

  // 开始游戏
  startGame() {
    // 增加游戏次数
    const gameData = wx.getStorageSync('gameData') || {
      totalGames: 0,
      completedGames: 0,
      currentLevel: 1,
      bestScores: {}
    }
    
    gameData.totalGames = (gameData.totalGames || 0) + 1
    wx.setStorageSync('gameData', gameData)

    // 播放音效
    this.playSound('start')

    // 跳转到童谣选择页面
    wx.navigateTo({
      url: '/pages/rhyme_select/rhyme_select'
    })
  },

  // 选择难度
  selectLevel() {
    this.playSound('click')
    wx.navigateTo({
      url: '/pages/rhyme_select/rhyme_select'
    })
  },

  // 查看成绩
  viewScores() {
    this.playSound('click')
    const gameData = wx.getStorageSync('gameData') || { bestScores: {} }
    
    if (Object.keys(gameData.bestScores).length === 0) {
      wx.showToast({
        title: '还没有游戏记录哦',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let scoreText = '最佳成绩\n\n'
    const levels = ['简单', '中等', '困难']
    
    Object.keys(gameData.bestScores).forEach(level => {
      const score = gameData.bestScores[level]
      const levelName = levels[level - 1] || `难度${level}`
      scoreText += `${levelName}: ${score}秒\n`
    })

    wx.showModal({
      title: '游戏成绩',
      content: scoreText,
      showCancel: false,
      confirmText: '好的'
    })
  },

  // 游戏说明
  aboutGame() {
    this.playSound('click')
    wx.showModal({
      title: '游戏说明',
      content: '儿童歌谣拼图游戏\n\n游戏规则：\n1. 选择喜欢的童谣主题图片\n2. 把下方拼图块拖到上方对应空白格\n3. 放对后会自动吸附并固定\n\n游戏目标：\n培养宝宝观察力与动手能力',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 播放音效
  playSound(type) {
    // 这里可以添加音效播放逻辑
    // 由于微信小程序音频文件需要上传，这里先预留接口
    try {
      if (type === 'start') {
        // 播放开始游戏音效
      } else if (type === 'click') {
        // 播放点击音效
      } else if (type === 'complete') {
        // 播放完成音效
      }
    } catch (error) {
      console.log('音效播放失败:', error)
    }
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '儿童歌谣拼图游戏',
      path: '/pages/index/index',
      imageUrl: '' // 可以设置分享图片
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '儿童歌谣拼图游戏 - 让宝宝在快乐中学习成长',
      imageUrl: '' // 可以设置分享图片
    }
  }
})
