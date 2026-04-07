<template>
  <view class="container">
    <!-- 游戏头部 -->
    <view class="game-header">
      <view class="game-info">
        <view class="difficulty">{{ difficultyText }}</view>
        <view class="timer">{{ formatTime(timer) }}</view>
        <view class="moves">步数: {{ moves }}</view>
      </view>
      <view class="game-controls">
        <button class="control-btn" @tap="toggleMute">
          {{ isMuted ? "?" : "?" }}
        </button>
        <button class="control-btn" @tap="showPreview">
          ??
        </button>
        <button class="control-btn" @tap="backToSelect">
          ??
        </button>
      </view>
    </view>

    <!-- 拼图区域 -->
    <view class="puzzle-container">
      <view class="puzzle-board" :style="{ width: puzzleSize + 'px', height: puzzleSize + 'px' }">
        <view 
          v-for="(piece, index) in puzzlePieces" 
          :key="index"
          class="puzzle-piece"
          :class="{ empty: piece.isEmpty }"
          :style="{
            width: pieceSize + 'px',
            height: pieceSize + 'px',
            backgroundImage: piece.isEmpty ? 'none' : `url(${currentImage})`,
            backgroundSize: `${puzzleSize}px ${puzzleSize}px`,
            backgroundPosition: piece.backgroundPosition,
            left: piece.currentX + 'px',
            top: piece.currentY + 'px'
          }"
          @tap="movePiece(index)"
        >
          <text v-if="!piece.isEmpty" class="piece-number">{{ piece.correctIndex + 1 }}</text>
        </view>
      </view>
    </view>

    <!-- 原图预览 -->
    <view class="preview-container" v-if="showPreviewModal" @tap="hidePreview">
      <view class="preview-modal" @tap.stop>
        <view class="preview-header">
          <text class="preview-title">原图预览</text>
          <button class="close-btn" @tap="hidePreview">×</button>
        </view>
        <image class="preview-image" :src="currentImage" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 游戏完成弹窗 -->
    <view class="success-modal" v-if="showSuccessModal">
      <view class="success-content">
        <view class="success-icon">?</view>
        <view class="success-title">恭喜完成！</view>
        <view class="success-stats">
          <text>用时：{{ formatTime(timer) }}</text>
          <text>步数：{{ moves }}</text>
        </view>
        <view class="success-buttons">
          <button class="btn-secondary" @tap="backToSelect">选择童谣</button>
          <button class="btn-primary" @tap="nextLevel">下一关</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 游戏状态
      difficulty: 1,
      difficultyText: "简单",
      gridSize: 3,
      puzzleSize: 300,
      pieceSize: 100,
      timer: 0,
      moves: 0,
      isPlaying: false,
      isMuted: false,
      
      // 拼图数据
      puzzlePieces: [],
      currentImage: "",
      rhymeId: "",
      emptyIndex: 0,
      
      // UI状态
      showPreviewModal: false,
      showSuccessModal: false,
      
      // 音频
      bgmAudio: null,
      
      // 定时器
      timerInterval: null
    }
  },

  onLoad(options) {
    this.initGame(options)
  },

  onUnload() {
    this.cleanup()
  },

  methods: {
    // 初始化游戏
    initGame(options) {
      const { rhymeId, difficulty = 1 } = options
      
      this.rhymeId = rhymeId || ""
      this.difficulty = parseInt(difficulty)
      
      // 设置难度参数
      this.setDifficultyParams()
      
      // 初始化拼图
      this.initPuzzle()
      
      // 开始游戏
      this.startGame()
    },

    // 设置难度参数
    setDifficultyParams() {
      switch (this.difficulty) {
        case 1:
          this.gridSize = 3
          this.difficultyText = "简单"
          break
        case 2:
          this.gridSize = 4
          this.difficultyText = "中等"
          break
        case 3:
          this.gridSize = 5
          this.difficultyText = "困难"
          break
      }

      const win = uni.getSystemInfoSync()
      const available = Math.min(win.windowWidth - 40, 340)
      this.puzzleSize = Math.floor(available / this.gridSize) * this.gridSize
      this.pieceSize = Math.floor(this.puzzleSize / this.gridSize)
      this.emptyIndex = this.gridSize * this.gridSize - 1

      this.currentImage = this.rhymeId ? `/static/images/${this.rhymeId}.png` : ""
    },

    // 初始化拼图
    initPuzzle() {
      const pieces = []
      const totalPieces = this.gridSize * this.gridSize

      // 创建拼图块
      for (let i = 0; i < totalPieces; i++) {
        const row = Math.floor(i / this.gridSize)
        const col = i % this.gridSize
        
        pieces.push({
          correctIndex: i,
          currentIndex: i,
          isEmpty: i === this.emptyIndex,
          backgroundPosition: `-${col * this.pieceSize}px -${row * this.pieceSize}px`,
          currentX: col * this.pieceSize,
          currentY: row * this.pieceSize
        })
      }

      // 打乱拼图
      this.shufflePuzzle(pieces)
      this.puzzlePieces = pieces
    },

    // 打乱拼图
    shufflePuzzle(pieces) {
      const moves = this.gridSize * this.gridSize * 10
      
      for (let i = 0; i < moves; i++) {
        const validMoves = this.getValidMoves(pieces)
        if (validMoves.length > 0) {
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
          this.swapPieces(pieces, randomMove, this.emptyIndex)
        }
      }
    },

    // 获取可移动的拼图块
    getValidMoves(pieces) {
      const emptyPiece = pieces.find(p => p.isEmpty)
      const emptyIndex = pieces.indexOf(emptyPiece)
      const validMoves = []
      
      const row = Math.floor(emptyIndex / this.gridSize)
      const col = emptyIndex % this.gridSize

      // 上
      if (row > 0) validMoves.push(emptyIndex - this.gridSize)
      // 下
      if (row < this.gridSize - 1) validMoves.push(emptyIndex + this.gridSize)
      // 左
      if (col > 0) validMoves.push(emptyIndex - 1)
      // 右
      if (col < this.gridSize - 1) validMoves.push(emptyIndex + 1)

      return validMoves
    },

    // 交换拼图块
    swapPieces(pieces, index1, index2) {
      const temp = pieces[index1]
      pieces[index1] = pieces[index2]
      pieces[index2] = temp
    },

    // 移动拼图块
    movePiece(index) {
      if (!this.isPlaying) return

      const validMoves = this.getValidMoves(this.puzzlePieces)
      
      if (validMoves.includes(index)) {
        this.swapPieces(this.puzzlePieces, index, this.emptyIndex)
        this.moves++
        this.playSound("move")

        // 检查是否完成
        if (this.checkWin()) {
          this.gameWin()
        }
      }
    },

    // 检查是否获胜
    checkWin() {
      return this.puzzlePieces.every((piece, index) => piece.correctIndex === index)
    },

    // 开始游戏
    startGame() {
      this.isPlaying = true
      this.startTimer()
      this.startBgm()
    },

    // 开始计时
    startTimer() {
      this.timer = 0
      this.timerInterval = setInterval(() => {
        this.timer++
      }, 1000)
    },

    // 停止计时
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    // 开始背景音乐
    startBgm() {
      if (!this.rhymeId || this.isMuted) return

      this.bgAudio = uni.createInnerAudioContext()
      this.bgAudio.src = `/static/audio/${this.rhymeId}.mp3`
      this.bgAudio.loop = true
      this.bgAudio.volume = 0.5
      this.bgAudio.play()

      this.bgAudio.onError(() => {
        console.log("音频播放失败")
      })
    },

    // 停止背景音乐
    stopBgm() {
      if (this.bgAudio) {
        this.bgAudio.stop()
        this.bgAudio = null
      }
    },

    // 游戏获胜
    gameWin() {
      this.isPlaying = false
      this.stopTimer()
      this.stopBgm()
      this.playSound("win")

      // 保存最佳成绩
      this.saveBestScore()

      // 显示成功弹窗
      this.showSuccessModal = true
    },

    // 保存最佳成绩
    saveBestScore() {
      const gameData = uni.getStorageSync("gameData") || { bestScores: {} }
      
      if (!gameData.bestScores[this.difficulty] || this.timer < gameData.bestScores[this.difficulty]) {
        gameData.bestScores[this.difficulty] = this.timer
        uni.setStorageSync("gameData", gameData)
      }
    },

    // 下一关
    nextLevel() {
      if (this.difficulty >= 3) {
        this.stopBgm()
        uni.redirectTo({
          url: "/pages/rhyme_select/rhyme_select"
        })
        this.playSound("click")
        return
      }

      const nextLevel = Math.min(this.difficulty + 1, 3)
      const gameData = uni.getStorageSync("gameData") || {}
      gameData.currentLevel = nextLevel
      uni.setStorageSync("gameData", gameData)
      
      this.stopTimer()
      this.showSuccessModal = false
      
      // 重新初始化游戏
      this.initGame({
        rhymeId: this.rhymeId,
        difficulty: nextLevel
      })
    },

    // 返回选择页面
    backToSelect() {
      this.cleanup()
      uni.navigateBack()
    },

    // 切换静音
    toggleMute() {
      this.isMuted = !this.isMuted
      
      if (this.isMuted) {
        this.stopBgm()
      } else {
        this.startBgm()
      }
    },

    // 显示预览
    showPreview() {
      this.showPreviewModal = true
    },

    // 隐藏预览
    hidePreview() {
      this.showPreviewModal = false
    },

    // 格式化时间
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    },

    // 播放音效
    playSound(type) {
      if (this.isMuted) return
      
      try {
        // 这里可以添加音效播放逻辑
        if (type === "move") {
          // 移动音效
        } else if (type === "win") {
          // 胜利音效
        } else if (type === "click") {
          // 点击音效
        }
      } catch (error) {
        console.log("音效播放失败:", error)
      }
    },

    // 清理资源
    cleanup() {
      this.stopTimer()
      this.stopBgm()
    }
  }
}
</script>

<style scoped>
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: white;
  border-radius: 15rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.game-info {
  display: flex;
  gap: 30rpx;
}

.difficulty,
.timer,
.moves {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.timer {
  color: #FF6B6B;
}

.game-controls {
  display: flex;
  gap: 15rpx;
}

.control-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #F8F8F8;
  border: 2rpx solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.puzzle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
}

.puzzle-board {
  position: relative;
  background: #F8F8F8;
  border-radius: 15rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
}

.puzzle-piece {
  position: absolute;
  border: 1rpx solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.puzzle-piece:not(.empty):active {
  transform: scale(0.95);
}

.puzzle-piece.empty {
  background: transparent !important;
  border: 2rpx dashed #CCCCCC;
}

.piece-number {
  font-size: 24rpx;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.5);
}

.preview-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-modal {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  max-width: 80%;
  max-height: 80%;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.preview-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #F8F8F8;
  border: none;
  font-size: 36rpx;
  color: #666;
}

.preview-image {
  width: 100%;
  max-height: 500rpx;
}

.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.success-content {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  text-align: center;
  max-width: 80%;
}

.success-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.success-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.success-stats {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 30rpx;
}

.success-stats text {
  font-size: 28rpx;
  color: #666;
}

.success-buttons {
  display: flex;
  gap: 20rpx;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 25rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
}

.btn-primary {
  background: linear-gradient(45deg, #FF6B6B, #FF8E8E);
  color: white;
}

.btn-secondary {
  background: white;
  color: #FF6B6B;
  border: 2rpx solid #FF6B6B;
}
</style>
