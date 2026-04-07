# ? 小程序域名配置指南

## ? 需要配置的域名

### GitHub Pages方案
**request合法域名**: `https://BluesABC.github.io`

## ? 配置步骤

### 1. 登录微信小程序后台
1. 访问：https://mp.weixin.qq.com
2. 使用您的小程序账号登录

### 2. 进入开发设置
1. 点击「开发」→「开发管理」
2. 点击「开发设置」标签

### 3. 配置服务器域名
1. 找到「服务器域名」部分
2. 在「request合法域名」中添加：
   ```
   https://BluesABC.github.io
   ```
3. 点击「保存」

## ? 音频文件URL

您的音频文件现在可以通过以下URL访问：
- `https://BluesABC.github.io/children-rhyme-puzzle/audio/chong_er_fei.mp3`
- `https://BluesABC.github.io/children-rhyme-puzzle/audio/twinkle.mp3`
- `https://BluesABC.github.io/children-rhyme-puzzle/audio/pull_turnip.mp3`
- `https://BluesABC.github.io/children-rhyme-puzzle/audio/two_tigers.mp3`
- `https://BluesABC.github.io/children-rhyme-puzzle/audio/luo_yu_da.mp3`
- `https://BluesABC.github.io/children-rhyme-puzzle/audio/little_donkey.mp3`
- `https://BluesABC.github.io/children-rhyme-puzzle/audio/yue_guang_guang.mp3`

## ? 测试步骤

### 1. 验证GitHub Pages
访问：https://BluesABC.github.io/children-rhyme-puzzle
应该能看到音频文件列表

### 2. 重新编译小程序
1. 在微信开发者工具中重新编译
2. 进入游戏页面
3. 选择任意童谣
4. 应该能正常播放背景音乐

### 3. 检查控制台
如果音频无法播放，查看开发者工具控制台是否有错误信息

## ? 优化方案（可选）

### 使用jsDelivr加速
如果GitHub Pages速度较慢，可以使用jsDelivr CDN：

1. 更新 `cdn_config.js` 中的CDN_BASE_URL：
   ```javascript
   const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/BluesABC/children-rhyme-puzzle'
   ```

2. 在小程序后台添加域名：
   ```
   https://cdn.jsdelivr.net
   ```

## ? 完成检查清单

- [x] GitHub仓库创建完成
- [x] 音频文件上传完成
- [x] GitHub Pages启用
- [x] CDN配置更新完成
- [ ] 小程序域名配置
- [ ] 音频功能测试

---

**配置完成后，您的音频功能将完全恢复！** ?
