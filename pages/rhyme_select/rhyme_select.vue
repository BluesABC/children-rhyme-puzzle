<template>
  <view class="container">
    <view class="header">
      <view class="title">选择童谣</view>
      <view class="subtitle">选择喜欢的童谣主题开始拼图</view>
    </view>

    <view class="difficulty-row card">
      <view class="row-title">选择难度</view>
      <view class="difficulty-buttons">
        <button 
          class="diff-btn" 
          :class="{ active: difficulty === 1 }" 
          data-diff="1" 
          @tap="setDifficulty"
        >
          简单 3x3
        </button>
        <button 
          class="diff-btn" 
          :class="{ active: difficulty === 2 }" 
          data-diff="2" 
          @tap="setDifficulty"
        >
          中等 4x4
        </button>
        <button 
          class="diff-btn" 
          :class="{ active: difficulty === 3 }" 
          data-diff="3" 
          @tap="setDifficulty"
        >
          困难 5x5
        </button>
      </view>
    </view>

    <view class="rhyme-list">
      <view 
        v-for="item in rhymes" 
        :key="item.id" 
        class="rhyme-card card" 
        @tap="chooseRhyme" 
        :data-id="item.id"
      >
        <view class="rhyme-left">
          <image class="rhyme-cover" :src="item.cover" mode="aspectFill"></image>
        </view>
        <view class="rhyme-right">
          <view class="rhyme-name">{{ item.name }}</view>
          <view class="rhyme-desc">{{ item.desc }}</view>
          <view class="play-btn">开始游戏</view>
        </view>
      </view>
    </view>

    <view class="back-btn-wrapper">
      <button class="back-btn" @tap="backHome">返回首页</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      difficulty: 1,
      rhymes: [
        {
          id: "two_tigers",
          name: "两只老虎",
          desc: "经典童谣：两只老虎跑得快。",
          cover: "/static/images/two_tigers.png"
        },
        {
          id: "twinkle",
          name: "小星星",
          desc: "经典童谣：一闪一闪亮晶晶。",
          cover: "/static/images/twinkle.png"
        },
        {
          id: "pull_turnip",
          name: "拔萝卜",
          desc: "经典童谣：嘿哟嘿哟拔萝卜。",
          cover: "/static/images/pull_turnip.png"
        },
        {
          id: "little_donkey",
          name: "我有一只小毛驴",
          desc: "经典童谣：从来也不骑。",
          cover: "/static/images/little_donkey.png"
        },
        {
          id: "luo_yu_da",
          name: "落雨大",
          desc: "经典童谣：落雨大，水浸街。",
          cover: "/static/images/luo_yu_da.png"
        },
        {
          id: "yue_guang_guang",
          name: "月光光",
          desc: "经典童谣：月光光，照地堂。",
          cover: "/static/images/yue_guang_guang.png"
        },
        {
          id: "chong_er_fei",
          name: "虫儿飞",
          desc: "经典童谣：虫儿飞，花儿睡。",
          cover: "/static/images/chong_er_fei.png"
        }
      ]
    }
  },

  methods: {
    setDifficulty(e) {
      const diff = parseInt(e.currentTarget.dataset.diff)
      this.difficulty = diff
    },

    chooseRhyme(e) {
      const id = e.currentTarget.dataset.id
      this.goGame(id)
    },

    startGame(e) {
      const id = e.currentTarget.dataset.id
      this.goGame(id)
    },

    goGame(rhymeId) {
      uni.navigateTo({
        url: `/pages/game/game?rhymeId=${encodeURIComponent(rhymeId)}&difficulty=${this.difficulty}`
      })
    },

    backHome() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.difficulty-row {
  margin-bottom: 30rpx;
}

.row-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.difficulty-buttons {
  display: flex;
  gap: 15rpx;
}

.diff-btn {
  flex: 1;
  padding: 20rpx;
  border: 2rpx solid #E0E0E0;
  border-radius: 10rpx;
  background: white;
  color: #666;
  font-size: 24rpx;
  transition: all 0.3s ease;
}

.diff-btn.active {
  border-color: #FF6B6B;
  background: #FF6B6B;
  color: white;
}

.rhyme-list {
  margin-bottom: 30rpx;
}

.rhyme-card {
  display: flex;
  padding: 20rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.rhyme-card:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.rhyme-left {
  margin-right: 20rpx;
}

.rhyme-cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
}

.rhyme-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rhyme-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.rhyme-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 15rpx;
}

.play-btn {
  align-self: flex-start;
  background: #FF6B6B;
  color: white;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.back-btn-wrapper {
  text-align: center;
}

.back-btn {
  background: white;
  color: #FF6B6B;
  border: 2rpx solid #FF6B6B;
  padding: 25rpx 50rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
}
</style>
