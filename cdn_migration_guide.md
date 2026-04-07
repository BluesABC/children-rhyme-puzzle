# CDN迁移指南

## 背景说明
小程序代码包中非必要的静态资源（图片、音频等）体积超过200K时，建议上传到CDN并使用URL引入，以提高加载速度。

## 当前状态分析

### 图片资源 ? (已优化，无需CDN)
- two_tigers.jpg: 136.78 KB
- little_donkey.jpg: 147.24 KB  
- twinkle.jpg: 156.56 KB
- luo_yu_da.jpg: 171.58 KB
- pull_turnip.jpg: 173.59 KB
- chong_er_fei.jpg: 176.48 KB
- yue_guang_guang.jpg: 188.88 KB

**所有图片都在200K以下，可以保留在本地**

### 音频资源 ? (需要CDN)
- chong_er_fei.mp3: 1,525.93 KB
- twinkle.mp3: 1,575.71 KB
- pull_turnip.mp3: 1,769.20 KB
- two_tigers.mp3: 2,007.96 KB
- luo_yu_da.mp3: 2,354.82 KB
- little_donkey.mp3: 2,422.25 KB
- yue_guang_guang.mp3: 2,499.37 KB

**所有音频都超过200K，需要迁移到CDN**

## CDN迁移步骤

### 1. 准备CDN服务
选择以下CDN服务之一：
- 阿里云OSS
- 腾讯云COS
- 七牛云
- 又拍云
- 微信云存储（推荐）

### 2. 上传音频文件
将以下文件上传到CDN：
```
audio/rhymes/chong_er_fei.mp3
audio/rhymes/twinkle.mp3
audio/rhymes/pull_turnip.mp3
audio/rhymes/two_tigers.mp3
audio/rhymes/luo_yu_da.mp3
audio/rhymes/little_donkey.mp3
audio/rhymes/yue_guang_guang.mp3
```

### 3. 更新CDN配置
修改 `cdn_config.js` 中的 `CDN_BASE_URL` 为实际的CDN域名：
```javascript
const CDN_BASE_URL = 'https://your-actual-cdn-domain.com/children-rhyme-puzzle'
```

### 4. 代码修改
在相关页面中引入CDN配置并使用CDN URL。

## 推荐的CDN解决方案

### 方案1: 微信云存储（推荐）
```javascript
// 使用微信云存储
const CDN_BASE_URL = 'cloud://your-env-id.your-bucket/children-rhyme-puzzle'
```

### 方案2: 免费CDN服务
- GitHub Pages + jsDelivr
- Cloudflare（免费额度）
- Firebase Hosting

### 方案3: 自建CDN
使用Nginx + 对象存储服务

## 迁移后的优势
1. **减少代码包大小**: 从约15MB减少到约1MB
2. **提高加载速度**: 音频按需加载
3. **节省用户流量**: 不需要的音频不下载
4. **便于更新**: 音频文件可独立更新

## 注意事项
1. CDN域名需要在小程序后台配置为合法域名
2. 确保CDN服务的稳定性和速度
3. 考虑音频文件的缓存策略
4. 测试CDN访问的可靠性
