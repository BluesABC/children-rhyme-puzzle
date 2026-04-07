<template>
  <view class="container">
    <!-- 页面标题 -->
    <view class="header">
      <view class="title">选择难度</view>
      <view class="subtitle">选择适合宝宝的难度等级</view>
    </view>

    <!-- 难度选择卡片 -->
    <view class="difficulty-cards">
      <view 
        v-for="item in difficultyList" 
        :key="item.level"
        class="difficulty-card" 
        :class="{ selected: item.level === currentLevel, locked: item.locked }"
        @tap="selectDifficulty"
        :data-level="item.level"
      >
        <!-- 卡片头部 -->
        <view class="card-header">
          <view class="difficulty-icon">{{ item.level }}</view>
          <view class="difficulty-name">{{ item.name }}</view>
          <view class="difficulty-level">Level {{ item.level }}</view>
        </view>

        <!-- 卡片内容 -->
        <view class="card-content">
          <view class="difficulty-desc">{{ item.description }}</view>
          
          <!-- 难度特征 -->
          <view class="features">
            <view class="feature-item" v-for="feature in item.features" :key="feature">
              <text class="feature-icon">-</text>
              <text class="feature-text">{{ feature }}</text>
            </view>
          </view>

          <!-- 最佳成绩 -->
          <view class="best-score" v-if="item.bestScore">
            <text class="score-label">最佳成绩:</text>
            <text class="score-value">{{ formatTime(item.bestScore) }}</text>
          </view>

          <!-- 锁定状态 -->
          <view class="lock-overlay" v-if="item.locked">
            <text class="lock-text">已锁定：需要完成前一关</text>
          </view>
        </view>

        <!-- 选择指示器 -->
        <view class="selection-indicator" v-if="item.level === currentLevel">
          <text class="check-icon">OK</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="btn-secondary" @tap="backToHome">返回首页</button>
      <button class="btn-primary" @tap="startGame" :disabled="currentLevel === 0">
        开始游戏
      </button>
    </view>

    <!-- 游戏提示 -->
    <view class="tips-section">
      <view class="tips-title">
        <text>游戏小贴士</text>
      </view>
      <view class="tips-content">
        <view class="tip-item">
          <text class="tip-number">1</text>
          <text class="tip-text">从简单难度开始，逐步提升挑战</text>
        </view>
        <view class="tip-item">
          <text class="tip-number">2</text>
          <text class="tip-text">观察原图预览，记住图片特征</text>
        </view>
        <view class="tip-item">
          <text class="tip-number">3</text>
          <text class="tip-text">先完成边缘，再处理中间部分</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentLevel: 1,
      difficultyList: [
        {
          level: 1,
          name: "简单",
          icon: "★",
          description: "适合初学者的 3x3 拼图",
          features: [
            "3x3 网格（9 块拼图）",
            "大尺寸拼图块",
            "简单图片内容",
            "适合 2-4 岁宝宝"
          ],
          locked: false,
          bestScore: null
        },
        {
          level: 2,
          name: "中等",
          icon: "◆",
          description: "提升挑战的 4x4 拼图",
          features: [
            "4x4 网格（16 块拼图）",
            "中等尺寸拼图块",
            "复杂图片内容",
            "适合 4-6 岁宝宝"
          ],
          locked: false,
          bestScore: null
        },
        {
          level: 3,
          name: "困难",
          icon: "●",
          description: "高手挑战的 5x5 拼图",
          features: [
            "5x5 网格（25 块拼图）",
            "小尺寸拼图块",
            "高难度图片内容",
            "适合 6 岁以上宝宝"
          ],
          locked: false,
          bestScore: null
        }
      ]
    }
  },

  onLoad(options) {
    this.loadGameData()
  },

  onShow() {
    this.loadGameData()
  },

  methods: {
    // 加载游戏数据
    loadGameData() {
      const gameData = uni.getStorageSync("gameData") || {
        currentLevel: 1,
        bestScores: {}
      }
      
      const currentLevel = gameData.currentLevel || 1
      const bestScores = gameData.bestScores || {}
      
      // 更新难度列表
      this.difficultyList = this.difficultyList.map(item => {
        return {
          ...item,
          bestScore: bestScores[item.level] || null,
          locked: item.level > currentLevel + 1 // 只解锁当前关卡和下一关
        }
      })
      
      this.currentLevel = currentLevel
    },

    // 选择难度
    selectDifficulty(e) {
      const level = parseInt(e.currentTarget.dataset.level)
      const difficulty = this.difficultyList.find(item => item.level === level)
      
      if (difficulty.locked) {
        uni.showToast({
          title: "请先完成前一关",
          icon: "none",
          duration: 2000
        })
        return
      }
      
      this.currentLevel = level
      
      this.playSound("click")
      
      // 保存选择
      const gameData = uni.getStorageSync("gameData") || {}
      gameData.currentLevel = level
      uni.setStorageSync("gameData", gameData)
    },

    // 开始游戏
    startGame() {
      if (this.currentLevel === 0) {
        uni.showToast({
          title: "请选择难度",
          icon: "none",
          duration: 2000
        })
        return
      }
      
      this.playSound("start")

      uni.navigateTo({
        url: "/pages/rhyme_select/rhyme_select"
      })
    },

    // 返回首页
    backToHome() {
      this.playSound("click")
      uni.navigateBack()
    },

    // 格式化时间
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    },

    // 播放音效
    playSound(type) {
      try {
        if (type === "start") {
          // 开始游戏音效
        } else if (type === "click") {
          // 点击音效
        }
      } catch (error) {
        console.log("音效播放失败:", error)
      }
    }
  }
}
</script>

<style scoped>
.difficulty-cards {
  margin-bottom: 50rpx;
}

.difficulty-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 25rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
  border: 3rpx solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.difficulty-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.difficulty-card.selected {
  border-color: #FF6B6B;
  background: linear-gradient(135deg, #FFF5F5, #FFFFFF);
  box-shadow: 0 10rpx 25rpx rgba(255, 107, 107, 0.3);
}

.difficulty-card.locked {
  opacity: 0.7;
  background: #F8F8F8;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  gap: 20rpx;
}

.difficulty-icon {
  font-size: 60rpx;
  width: 100rpx;
  text-align: center;
}

.difficulty-name {
  flex: 1;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.difficulty-level {
  font-size: 24rpx;
  color: #FF6B6B;
  background: #FFF5F5;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-weight: bold;
}

.card-content {
  position: relative;
}

.difficulty-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.features {
  margin-bottom: 20rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  font-size: 24rpx;
  color: #555;
}

.feature-icon {
  color: #4CAF50;
  font-weight: bold;
  margin-right: 10rpx;
  font-size: 28rpx;
}

.feature-text {
  flex: 1;
}

.best-score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFF5F5;
  padding: 15rpx 20rpx;
  border-radius: 10rpx;
  border: 1rpx solid #FFD0D0;
}

.score-label {
  font-size: 24rpx;
  color: #888;
}

.score-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 17rpx;
}

.lock-icon {
  font-size: 60rpx;
  margin-bottom: 10rpx;
}

.lock-text {
  font-size: 24rpx;
  color: #888;
  text-align: center;
}

.selection-indicator {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 50rpx;
  height: 50rpx;
  background: #FF6B6B;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 10rpx rgba(255, 107, 107, 0.3);
  animation: checkBounce 0.5s ease-out;
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.check-icon {
  color: white;
  font-size: 30rpx;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 30rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(45deg, #FF6B6B, #FF8E8E);
  color: white;
  box-shadow: 0 8rpx 20rpx rgba(255, 107, 107, 0.3);
}

.btn-primary[disabled] {
  background: #E0E0E0;
  color: #999;
  box-shadow: none;
}

.btn-secondary {
  background: white;
  color: #FF6B6B;
  border: 3rpx solid #FF6B6B;
}

.btn-primary:active,
.btn-secondary:active {
  transform: translateY(2rpx);
}

.tips-section {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
}

.tips-title {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.tips-icon {
  font-size: 36rpx;
  margin-right: 10rpx;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 15rpx;
}

.tip-number {
  width: 40rpx;
  height: 40rpx;
  background: #FF6B6B;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  padding-top: 5rpx;
}
</style>
