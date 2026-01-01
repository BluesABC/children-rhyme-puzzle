# Children Rhyme Puzzle Audio CDN

## 部署步骤

1. **创建GitHub仓库**
   - 访问 https://github.com/new
   - 仓库名：`children-rhyme-puzzle`
   - 设为公开仓库

2. **上传文件**
   - 将此目录中的所有文件上传到仓库
   - 包括：`index.html`、`README.md`、`audio/`目录

3. **启用GitHub Pages**
   - 进入仓库设置
   - 找到"Pages"选项
   - 选择源分支（通常是main或master）
   - 选择根目录`/`
   - 点击"Save"

4. **获取CDN URL**
   - 等待几分钟部署完成
   - 访问：`https://username.github.io/children-rhyme-puzzle`
   - 音频文件URL：`https://username.github.io/children-rhyme-puzzle/audio/[filename]`

## 更新小程序配置

在 `cdn_config.js` 中更新：
```javascript
const CDN_BASE_URL = 'https://username.github.io/children-rhyme-puzzle'
```

## 使用jsDelivr加速（推荐）

可以使用jsDelivr获得更快的访问速度：
```
https://cdn.jsdelivr.net/gh/username/children-rhyme-puzzle/audio/[filename]
```

更新 `cdn_config.js`：
```javascript
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/username/children-rhyme-puzzle'
```

## 配置小程序域名

1. 登录微信小程序后台
2. 进入"开发" → "开发管理" → "开发设置"
3. 在"服务器域名"中添加：
   - request域名：`https://username.github.io`
   - 或使用jsDelivr：`https://cdn.jsdelivr.net`

## 测试

重新编译小程序，测试音频播放功能。

## 优势

- **完全免费**：GitHub Pages和jsDelivr都是免费的
- **全球加速**：jsDelivr提供全球CDN加速
- **高可用性**：GitHub提供稳定的服务
- **易于更新**：只需更新GitHub仓库即可
