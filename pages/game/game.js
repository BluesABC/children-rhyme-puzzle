// pages/game/game.js
const app = getApp()
const { getAudioCDNUrl, shouldUseCDN } = require('../../cdn_config.js')
const { getImageUrl } = require('../../image_config.js')

Page({
  data: {
    // 游戏状态
    gameTime: 0,
    moveCount: 0,
    difficulty: 1,
    difficultyText: '简单',
    isPaused: false,
    showCompletion: false,
    showPreview: false,
    isNewRecord: false,
    starRating: 0,

    rhymeId: '',
    
    // 拼图相关
    puzzleSize: 300,
    pieceSize: 100,
    imageSize: 300,
    puzzlePieces: [],
    boardCells: [],
    pieces: [],
    trayHeight: 200,
    currentImage: '',
    
    // 触摸相关
    touchStartX: 0,
    touchStartY: 0,
    selectedPiece: null,
    draggingPieceId: null,
    draggingPieceIndex: -1,
    dragOffsetX: 0,
    dragOffsetY: 0,
    boardRect: null,
    trayRect: null,

    bgmErrorShown: false,
    isBgmMuted: false,
    
    // 游戏配置
    gridSize: 3, // 3x3拼图
    emptyIndex: 8, // 空白块位置
    
    // 图片列表
    imageList: [
      'https://picsum.photos/seed/nursery1/300/300.jpg',
      'https://picsum.photos/seed/nursery2/300/300.jpg',
      'https://picsum.photos/seed/nursery3/300/300.jpg',
      'https://picsum.photos/seed/nursery4/300/300.jpg',
      'https://picsum.photos/seed/nursery5/300/300.jpg'
    ]
  },

  onLoad(options) {
    this._dragFramePending = false
    this._pendingDragPos = null
    this._bgmStartedForRhymeId = ''
    this._audioStarted = false // 标记音频是否已开始
    this._audioSuccessShown = false // 标记是否已显示成功提示
    this.initGame(options)
    this.startTimer()
  },

  onReady() {
    this.measureRects()
    // 页面准备就绪后，再次尝试播放音频
    if (this.data.rhymeId) {
      setTimeout(() => {
        this.startBgmForRhyme(this.data.rhymeId)
      }, 1000)
    }
  },

  onUnload() {
    this.stopBgm()
    this.stopTimer()
  },

  // 初始化游戏
  initGame(options = {}) {
    const gameData = wx.getStorageSync('gameData') || {}
    const difficulty = parseInt(options.difficulty || gameData.currentLevel || 1)
    const rhymeId = options.rhymeId ? decodeURIComponent(options.rhymeId) : (this.data.rhymeId || '')
    
    // 根据难度设置网格大小
    let gridSize = 3
    let difficultyText = '\u7b80\u5355'
    
    if (difficulty === 2) {
      gridSize = 4
      difficultyText = '\u4e2d\u7b49'
    } else if (difficulty === 3) {
      gridSize = 5
      difficultyText = '\u56f0\u96be'
    }

    const win = (wx.getWindowInfo && wx.getWindowInfo()) || wx.getSystemInfoSync()
    const available = Math.min(win.windowWidth - 40, 340)
    const puzzleSize = Math.floor(available / gridSize) * gridSize
    const pieceSize = Math.floor(puzzleSize / gridSize)
    const emptyIndex = gridSize * gridSize - 1

    const backupImage = this.data.imageList[Math.floor(Math.random() * this.data.imageList.length)]
    
    // 使用本地图片
    const rhymeImage = rhymeId ? getImageUrl(rhymeId) : ''
    
    // 游戏图片选择 - 优先使用童谣图片，否则使用备用图片
    const gameImage = rhymeImage || backupImage
    
    console.log('=== 游戏初始化 ===')
    console.log('rhymeId:', rhymeId)
    console.log('童谣图片:', rhymeImage)
    console.log('备用图片:', backupImage)
    console.log('游戏图片:', gameImage)
    console.log('图片选择策略：优先使用童谣图片')
    
    this.setData({
      difficulty,
      difficultyText,
      rhymeId,
      gridSize,
      puzzleSize,
      pieceSize,
      imageSize: puzzleSize,
      emptyIndex,
      currentImage: gameImage
    })

    // 延迟启动音频，确保页面完全加载
    setTimeout(() => {
      this.startBgmForRhyme(rhymeId)
    }, 500)
    
    this.createPuzzle()
  },

  startBgmForRhyme(rhymeId) {
    console.log(`开始初始化音频: ${rhymeId}`)
    if (!rhymeId) {
      console.log('没有rhymeId，跳过音频初始化')
      return
    }
    
    // 检查是否是同一个音频且已经在播放
    if (this._bgmStartedForRhymeId === rhymeId && this._bgmCtx && this._audioStarted) {
      console.log(`音频已在播放: ${rhymeId}`)
      return
    }

    console.log(`停止之前的音频`)
    this.stopBgm()
    
    // 重置音频状态
    this._audioStarted = false

    const ctx = wx.createInnerAudioContext()
    ctx.autoplay = false // 先不自动播放，手动控制
    ctx.loop = true
    ctx.obeyMuteSwitch = false
    
    // 使用CDN URL
    const cdnUrl = getAudioCDNUrl(rhymeId)
    console.log(`开始播放音频: ${rhymeId}, URL: ${cdnUrl}`)
    ctx.src = cdnUrl

    // 添加更多事件监听
    ctx.onCanplay(() => {
      console.log(`音频可以播放: ${rhymeId}`)
      
      // 手动播放一次
      if (!this._audioStarted) {
        try {
          ctx.play()
          console.log(`手动播放音频: ${rhymeId}`)
          this._audioStarted = true
        } catch (e) {
          console.log(`手动播放失败，等待用户交互: ${rhymeId}`)
          // 如果错误是"already playing"，这是正常情况
          if (e.errMsg && e.errMsg.includes('already playing')) {
            console.log('音频实际在播放，更新状态')
            this._audioStarted = true
          }
        }
      }
      
      // 显示音频播放成功提示（仅第一次）
      if (!this._audioSuccessShown) {
        this._audioSuccessShown = true
        wx.showToast({
          title: '? 音频已开启',
          icon: 'none',
          duration: 1500
        })
      }
    })

    ctx.onPlay(() => {
      console.log(`音频开始播放: ${rhymeId}`)
      this._audioStarted = true
    })

    ctx.onError((err) => {
      console.error(`音频播放失败: ${rhymeId}`, err)
      // 如果错误是"already playing"，这是正常情况，不当作错误处理
      if (err.errMsg && err.errMsg.includes('already playing')) {
        console.log('音频已在播放（正常状态）')
        this._audioStarted = true
        return
      }
      
      // 如果是解码错误，尝试重新加载
      if (err.errMsg && (err.errMsg.includes('decode') || err.errMsg.includes('Unable to decode'))) {
        console.log('音频解码失败，尝试重新加载')
        // 不重置状态，保持当前播放状态
        setTimeout(() => {
          this.startBgmForRhyme(rhymeId)
        }, 2000)
        return
      }
      
      // 其他错误才重置状态
      this._audioStarted = false
      if (this.data.bgmErrorShown) return
      this.setData({ bgmErrorShown: true })
      wx.showToast({
        title: '童谣音频加载失败',
        icon: 'none',
        duration: 2000
      })
    })

    ctx.onWaiting(() => {
      console.log(`音频加载中: ${rhymeId}`)
    })

    // 添加音频暂停/结束监听
    ctx.onPause(() => {
      console.log(`音频暂停: ${rhymeId}`)
    })

    ctx.onEnded(() => {
      console.log(`音频结束: ${rhymeId}`)
      // 循环播放会自动重新开始
    })

    // 设置音量
    ctx.volume = this.data.isBgmMuted ? 0 : 1

    this._bgmCtx = ctx
    this._bgmStartedForRhymeId = rhymeId

    // 延迟设置音量，确保音频上下文已准备就绪
    setTimeout(() => {
      this.setBgmMuted(this.data.isBgmMuted)
    }, 500)
  },

  // 容器点击事件 - 确保用户交互能触发音频
  onContainerTap() {
    console.log('容器被点击，当前音频状态:', {
      rhymeId: this.data.rhymeId,
      audioStarted: this._audioStarted,
      bgmCtx: !!this._bgmCtx
    })
    this.tryStartAudioOnInteraction()
  },

  // 用户交互时强制播放音频
  tryStartAudioOnInteraction() {
    console.log('尝试播放音频，检查条件:', {
      hasRhymeId: !!this.data.rhymeId,
      rhymeId: this.data.rhymeId,
      hasBgmCtx: !!this._bgmCtx,
      audioStarted: this._audioStarted,
      shouldPlay: this.data.rhymeId && this._bgmCtx && !this._audioStarted
    })
    
    if (this.data.rhymeId && this._bgmCtx && !this._audioStarted) {
      console.log('用户交互触发音频播放')
      try {
        this._bgmCtx.play()
        this._audioStarted = true
      } catch (e) {
        console.log('用户交互播放失败:', e)
        // 如果错误是"already playing"，这是正常情况
        if (e.errMsg && e.errMsg.includes('already playing')) {
          console.log('音频已在播放（正常状态）')
          this._audioStarted = true
          return
        }
        // 如果还是失败，重新创建音频上下文
        setTimeout(() => {
          this.startBgmForRhyme(this.data.rhymeId)
        }, 100)
      }
    } else if (this.data.rhymeId && !this._audioStarted) {
      // 如果有rhymeId但没有音频上下文或状态异常，重新初始化
      console.log('音频状态异常，重新初始化')
      this.startBgmForRhyme(this.data.rhymeId)
    } else {
      console.log('跳过音频播放，原因:', {
        noRhymeId: !this.data.rhymeId,
        noBgmCtx: !this._bgmCtx,
        alreadyStarted: this._audioStarted
      })
    }
  },

  setBgmMuted(muted) {
    const volume = muted ? 0 : 1
    if (this._bgmCtx) {
      try {
        this._bgmCtx.volume = volume
      } catch (e) {
        // ignore
      }
    }
    this.setData({ isBgmMuted: muted })
  },

  toggleBgmMute() {
    this.setBgmMuted(!this.data.isBgmMuted)
    this.playSound('click')
  },

  stopBgm() {
    console.log('停止音频')
    if (this._bgmCtx) {
      try {
        this._bgmCtx.stop()
        this._bgmCtx.destroy()
      } catch (e) {
        // ignore
      }
      this._bgmCtx = null
    }
    this._bgmStartedForRhymeId = ''
    // 不重置 audioStarted 状态，让音频自然播放完成
    // this._audioStarted = false 
  },

  // 创建拼图
  createPuzzle() {
    const { gridSize, pieceSize, puzzleSize, emptyIndex } = this.data
    const pieces = []
    const boardCells = []

    for (let i = 0; i < gridSize * gridSize; i++) {
      const row = Math.floor(i / gridSize)
      const col = i % gridSize
      boardCells.push({
        idx: i,
        x: col * pieceSize,
        y: row * pieceSize
      })
    }
    
    // 创建拼图块
    for (let i = 0; i < gridSize * gridSize; i++) {
      const row = Math.floor(i / gridSize)
      const col = i % gridSize

      pieces.push({
        id: i,
        correctIndex: i,
        bgX: col * puzzleSize / gridSize,
        bgY: row * puzzleSize / gridSize,
        placed: false,
        x: 0,
        y: 0,
        trayX: 0,
        trayY: 0
      })
    }

    // 托盘摆放（随机顺序）
    const order = pieces.map(p => p.id)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = order[i]
      order[i] = order[j]
      order[j] = tmp
    }

    const trayTitleHeight = 28
    const trayRows = Math.ceil(order.length / gridSize)
    const trayHeight = trayTitleHeight + trayRows * pieceSize + 16

    order.forEach((id, idx) => {
      const row = Math.floor(idx / gridSize)
      const col = idx % gridSize
      const p = pieces.find(x => x.id === id)
      const tx = col * pieceSize
      const ty = trayTitleHeight + row * pieceSize
      p.trayX = tx
      p.trayY = ty
      p.x = tx
      p.y = ty
    })

    this.setData({
      puzzlePieces: pieces,
      boardCells,
      pieces,
      trayHeight,
      imageSize: puzzleSize
    })

    this.measureRects()
  },

  measureRects() {
    const query = wx.createSelectorQuery()
    query.select('.board').boundingClientRect()
    query.select('.tray').boundingClientRect()
    query.exec(res => {
      const boardRect = res && res[0] ? res[0] : null
      const trayRect = res && res[1] ? res[1] : null
      this.setData({ boardRect, trayRect })
    })
  },

  // 触摸开始
  onPieceTouchStart(e) {
    if (this.data.isPaused || this.data.showCompletion) return
    
    console.log('拼图块被触摸，当前音频状态:', {
      rhymeId: this.data.rhymeId,
      audioStarted: this._audioStarted,
      bgmCtx: !!this._bgmCtx
    })
    
    // 用户交互时尝试播放音频
    this.tryStartAudioOnInteraction()
    
    const id = parseInt(e.currentTarget.dataset.id)
    const pieceIndex = this.data.pieces.findIndex(p => p.id === id)
    const piece = pieceIndex >= 0 ? this.data.pieces[pieceIndex] : null
    if (!piece || piece.placed) return
    if (!this.data.trayRect) {
      this.measureRects()
      return
    }

    const t = e.touches[0]
    const offsetX = t.clientX - this.data.trayRect.left - piece.x
    const offsetY = t.clientY - this.data.trayRect.top - piece.y

    this.setData({
      draggingPieceId: id,
      draggingPieceIndex: pieceIndex,
      dragOffsetX: offsetX,
      dragOffsetY: offsetY
    })
  },

  // 触摸移动
  onPieceTouchMove(e) {
    const id = this.data.draggingPieceId
    const pieceIndex = this.data.draggingPieceIndex
    if (id === null || pieceIndex < 0 || !this.data.trayRect) return
    const t = e.touches[0]
    const x = t.clientX - this.data.trayRect.left - this.data.dragOffsetX
    const y = t.clientY - this.data.trayRect.top - this.data.dragOffsetY

    this._pendingDragPos = { x, y }
    if (this._dragFramePending) return
    this._dragFramePending = true

    setTimeout(() => {
      this._dragFramePending = false
      if (!this._pendingDragPos) return
      const pos = this._pendingDragPos
      this._pendingDragPos = null

      const basePath = `pieces[${pieceIndex}]`
      this.setData({
        [`${basePath}.x`]: pos.x,
        [`${basePath}.y`]: pos.y
      })
    }, 16)
  },

  // 触摸结束
  onPieceTouchEnd(e) {
    const id = this.data.draggingPieceId
    if (id === null) return

    const pieces = this.data.pieces.slice()
    const idx = this.data.draggingPieceIndex >= 0 ? this.data.draggingPieceIndex : pieces.findIndex(p => p.id === id)
    if (idx === -1) {
      this.setData({ draggingPieceId: null, draggingPieceIndex: -1 })
      return
    }

    const t = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null
    const piece = pieces[idx]
    const boardRect = this.data.boardRect

    // touchend 时把最后一次 move 的 pending 位置强制落地，避免节流导致“明明放对却不吸附”
    if (this._pendingDragPos) {
      pieces[idx] = { ...pieces[idx], x: this._pendingDragPos.x, y: this._pendingDragPos.y }
    }

    let placed = false
    if (t && boardRect) {
      const correctRow = Math.floor(piece.correctIndex / this.data.gridSize)
      const correctCol = piece.correctIndex % this.data.gridSize

      // 用“拼图块自身中心点”进行判定（比手指松手点更稳定）
      // dragOffsetX/Y 是手指在拼图块内部的偏移，touchX - dragOffsetX 即拼图块左上角(屏幕坐标)
      const pieceLeftClientX = t.clientX - this.data.dragOffsetX
      const pieceTopClientY = t.clientY - this.data.dragOffsetY
      const pieceCenterOnBoardX = (pieceLeftClientX + this.data.pieceSize / 2) - boardRect.left
      const pieceCenterOnBoardY = (pieceTopClientY + this.data.pieceSize / 2) - boardRect.top

      const correctCenterX = (correctCol + 0.5) * this.data.pieceSize
      const correctCenterY = (correctRow + 0.5) * this.data.pieceSize

      const dx = Math.abs(pieceCenterOnBoardX - correctCenterX)
      const dy = Math.abs(pieceCenterOnBoardY - correctCenterY)
      // 轴向容错：更宽松但不会跨越到相邻格子（相邻中心距离=1格，阈值<1格即可避免“隔一格也吸附”）
      const tolerance = this.data.pieceSize * 0.85

      const occupied = pieces.some(p => p.placed && p.correctIndex === piece.correctIndex)
      if (!occupied && dx <= tolerance && dy <= tolerance) {
        pieces[idx] = {
          ...piece,
          placed: true,
          x: correctCol * this.data.pieceSize,
          y: correctRow * this.data.pieceSize
        }
        placed = true
      }
    }

    if (!placed) {
      // 还原到托盘位置
      pieces[idx] = { ...piece, x: piece.trayX, y: piece.trayY }
    } else {
      this.setData({ moveCount: this.data.moveCount + 1 })
    }

    this._pendingDragPos = null
    this.setData({ pieces, draggingPieceId: null, draggingPieceIndex: -1 })

    if (pieces.every(p => p.placed)) {
      this.onGameComplete()
    }
  },

  // 打乱拼图
  shufflePuzzle(pieces) {
    const { gridSize, emptyIndex } = this.data
    const totalPieces = gridSize * gridSize
    
    // 通过随机移动来打乱，确保可解
    let currentEmpty = emptyIndex
    const moves = totalPieces * 10 // 移动次数
    
    for (let i = 0; i < moves; i++) {
      const validMoves = this.getValidMoves(currentEmpty, gridSize)
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
      
      // 交换位置
      const temp = pieces[currentEmpty]
      pieces[currentEmpty] = pieces[randomMove]
      pieces[randomMove] = temp
      
      // 更新位置信息
      this.updatePiecePosition(pieces[currentEmpty], currentEmpty)
      this.updatePiecePosition(pieces[randomMove], randomMove)
      
      currentEmpty = randomMove
    }
  },

  // 获取有效移动
  getValidMoves(emptyIndex, gridSize) {
    const moves = []
    const row = Math.floor(emptyIndex / gridSize)
    const col = emptyIndex % gridSize
    
    // 上
    if (row > 0) moves.push(emptyIndex - gridSize)
    // 下
    if (row < gridSize - 1) moves.push(emptyIndex + gridSize)
    // 左
    if (col > 0) moves.push(emptyIndex - 1)
    // 右
    if (col < gridSize - 1) moves.push(emptyIndex + 1)
    
    return moves
  },

  // 更新拼图块位置
  updatePiecePosition(piece, index) {
    const { gridSize, pieceSize } = this.data
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    
    piece.currentIndex = index
    piece.x = col * pieceSize
    piece.y = row * pieceSize
    piece.isCorrect = piece.correctIndex === index
  },

  // 触摸开始
  onTouchStart(e) {
    if (this.data.isPaused || this.data.showCompletion) return
    
    const { index } = e.currentTarget.dataset
    const { puzzlePieces, emptyIndex } = this.data
    
    // 检查是否可以移动
    if (this.canMove(index, emptyIndex)) {
      this.setData({
        touchStartX: e.touches[0].clientX,
        touchStartY: e.touches[0].clientY,
        selectedPiece: index
      })
    }
  },

  // 触摸移动
  onTouchMove(e) {
    // 可以添加拖拽效果
  },

  // 触摸结束
  onTouchEnd(e) {
    if (this.data.selectedPiece === null) return
    
    const { selectedPiece, emptyIndex, puzzlePieces } = this.data
    
    if (this.canMove(selectedPiece, emptyIndex)) {
      this.movePiece(selectedPiece, emptyIndex)
    }
    
    this.setData({
      selectedPiece: null
    })
  },

  // 检查是否可以移动
  canMove(index, emptyIndex) {
    const { gridSize } = this.data
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    const emptyRow = Math.floor(emptyIndex / gridSize)
    const emptyCol = emptyIndex % gridSize
    
    // 检查是否相邻
    return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
           (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  },

  // 移动拼图块
  movePiece(fromIndex, toIndex) {
    const { puzzlePieces } = this.data
    
    // 交换拼图块
    const temp = puzzlePieces[fromIndex]
    puzzlePieces[fromIndex] = puzzlePieces[toIndex]
    puzzlePieces[toIndex] = temp
    
    // 更新位置
    this.updatePiecePosition(puzzlePieces[fromIndex], fromIndex)
    this.updatePiecePosition(puzzlePieces[toIndex], toIndex)
    
    this.setData({
      puzzlePieces,
      emptyIndex: fromIndex,
      moveCount: this.data.moveCount + 1
    })
    
    // 检查是否完成
    if (this.checkCompletion()) {
      this.onGameComplete()
    }
  },

  // 检查是否完成
  checkCompletion() {
    const { puzzlePieces } = this.data
    return puzzlePieces.every(piece => piece.isCorrect)
  },

  // 游戏完成
  onGameComplete() {
    this.stopTimer()
    
    const { gameTime, difficulty, moveCount } = this.data
    const gameData = wx.getStorageSync('gameData') || { bestScores: {} }
    
    console.log('=== 游戏完成 ===')
    console.log('完成时间:', gameTime)
    console.log('难度:', difficulty)
    console.log('步数:', moveCount)
    
    // 检查是否是新纪录
    const currentBest = gameData.bestScores[difficulty]
    const isNewRecord = !currentBest || gameTime < currentBest
    
    console.log('当前最佳:', currentBest)
    console.log('是否新纪录:', isNewRecord)
    
    if (isNewRecord) {
      gameData.bestScores[difficulty] = gameTime
      wx.setStorageSync('gameData', gameData)
      console.log('保存新纪录:', gameTime)
    }
    
    // 计算星级评分 - 使用当前 gameTime 而不是变量
    let starRating = 1
    const finalTime = this.data.gameTime // 确保使用最新的时间
    if (finalTime < 60) starRating = 3
    else if (finalTime < 120) starRating = 2
    
    console.log('星级评分:', starRating, '使用时间:', finalTime)
    
    // 更新完成次数
    gameData.completedGames = (gameData.completedGames || 0) + 1
    wx.setStorageSync('gameData', gameData)
    
    this.setData({
      showCompletion: true,
      isNewRecord,
      starRating,
      gameTime: finalTime // 确保传递最新时间
    })
    
    console.log('=== 游戏完成数据设置 ===')
    console.log('设置的数据:', {
      showCompletion: true,
      isNewRecord,
      starRating,
      gameTime: finalTime
    })
    console.log('当前页面数据 gameTime:', this.data.gameTime)
    
    this.playSound('complete')
  },

  // 开始计时
  startTimer() {
    this.timer = setInterval(() => {
      if (!this.data.isPaused && !this.data.showCompletion) {
        this.setData({
          gameTime: this.data.gameTime + 1
        })
      }
    }, 1000)
  },

  // 停止计时
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  openSettings() {
    // 用户交互时尝试播放音频
    this.tryStartAudioOnInteraction()
    
    const pauseText = this.data.isPaused ? '\u7ee7\u7eed' : '\u6682\u505c'
    wx.showActionSheet({
      itemList: [pauseText, '\u91cd\u73a9', '\u8fd4\u56de\u9996\u9875'],
      success: (res) => {
        if (res.tapIndex === 0) {
          if (this.data.isPaused) this.resumeGame()
          else this.pauseGame()
          return
        }
        if (res.tapIndex === 1) {
          this.restartGame()
          return
        }
        if (res.tapIndex === 2) {
          this.backToHome()
        }
      }
    })
  },

  // 暂停游戏
  pauseGame() {
    this.setData({
      isPaused: !this.data.isPaused
    })
    this.playSound('click')
  },

  // 恢复游戏
  resumeGame() {
    this.setData({
      isPaused: false
    })
    this.playSound('click')
  },

  // 重新开始
  restartGame() {
    this.stopTimer()
    this.stopBgm()
    
    // 保持当前难度和童谣
    const currentDifficulty = this.data.difficulty
    const currentRhymeId = this.data.rhymeId
    
    console.log('重玩游戏，保持难度:', currentDifficulty, '童谣:', currentRhymeId)
    
    this.setData({
      gameTime: 0,
      moveCount: 0,
      isPaused: false,
      showCompletion: false,
      isNewRecord: false,
      starRating: 0
    })
    
    // 使用当前参数重新初始化游戏
    this.initGame({
      difficulty: currentDifficulty,
      rhymeId: currentRhymeId
    })
    
    this.startTimer()
    this.playSound('start')
  },

  // 下一关
  nextLevel() {
    const gameData = wx.getStorageSync('gameData') || {}
    if (this.data.difficulty >= 3) {
      this.stopBgm()
      wx.redirectTo({
        url: '/pages/rhyme_select/rhyme_select'
      })
      this.playSound('click')
      return
    }

    const nextLevel = Math.min(this.data.difficulty + 1, 3)
    gameData.currentLevel = nextLevel
    wx.setStorageSync('gameData', gameData)
    
    this.stopTimer()
    this.setData({
      gameTime: 0,
      moveCount: 0,
      isPaused: false,
      showCompletion: false,
      isNewRecord: false,
      starRating: 0,
      difficulty: nextLevel
    })
    this.initGame()
    this.startTimer()
    this.playSound('start')
  },

  // 返回首页
  backToHome() {
    this.stopTimer()
    this.stopBgm()
    wx.navigateBack()
    this.playSound('click')
  },

  // 打开原图预览（放大）
  openPreview() {
    this.setData({
      showPreview: true
    })
    this.playSound('click')
  },

  // 关闭原图预览（还原）
  closePreview() {
    this.setData({
      showPreview: false
    })
    this.playSound('click')
  },

  // 格式化时间
  formatTime(seconds) {
    console.log('formatTime 被调用，参数:', seconds)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    const result = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    console.log('formatTime 返回结果:', result)
    return result
  },

  // 播放音效
  playSound(type) {
    try {
      if (type === 'start') {
        // 开始游戏音效
      } else if (type === 'click') {
        // 点击音效
      } else if (type === 'complete') {
        // 完成音效
      }
    } catch (error) {
      console.log('音效播放失败:', error)
    }
  }
})
