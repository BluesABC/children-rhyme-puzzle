// 通用工具函数

// 格式化时间
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// 播放音效
export function playSound(type, isMuted = false) {
  if (isMuted) return
  
  try {
    // 这里可以添加音效播放逻辑
    if (type === "move") {
      // 移动音效
    } else if (type === "win") {
      // 胜利音效
    } else if (type === "click") {
      // 点击音效
    } else if (type === "start") {
      // 开始游戏音效
    }
  } catch (error) {
    console.log("音效播放失败:", error)
  }
}

// 获取难度名称
export function getDifficultyName(level) {
  const names = ["", "简单", "中等", "困难"]
  return names[level] || `难度${level}`
}

// 保存游戏数据
export function saveGameData(key, value) {
  try {
    const gameData = uni.getStorageSync("gameData") || {}
    gameData[key] = value
    uni.setStorageSync("gameData", gameData)
  } catch (error) {
    console.log("保存游戏数据失败:", error)
  }
}

// 获取游戏数据
export function getGameData(key, defaultValue = null) {
  try {
    const gameData = uni.getStorageSync("gameData") || {}
    return gameData[key] !== undefined ? gameData[key] : defaultValue
  } catch (error) {
    console.log("获取游戏数据失败:", error)
    return defaultValue
  }
}

// 显示提示信息
export function showToast(title, icon = "none", duration = 2000) {
  uni.showToast({
    title,
    icon,
    duration
  })
}

// 显示确认对话框
export function showModal(title, content, showCancel = true) {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      showCancel,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}
