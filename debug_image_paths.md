# 图片路径调试指南

## 当前配置
- 路径格式: `images/rhymes/图片名.jpg`
- 图片位置: `images/rhymes/` 文件夹

## 调试步骤

### 1. 检查控制台日志
在手机调试器中查看：
```
=== 图片路径调试 ===
童谣: 两只老虎, 路径: images/rhymes/two_tigers.jpg
童谣: 小星星, 路径: images/rhymes/twinkle.jpg
...
```

### 2. 如果图片仍不显示，尝试以下方案：

#### 方案A: 绝对路径
修改 `cdn_image_config.js` 中的路径为：
```javascript
const CDN_IMAGE_BASE = '/images/rhymes'
```

#### 方案B: 相对根目录路径
修改 `cdn_image_config.js` 中的路径为：
```javascript
const CDN_IMAGE_BASE = './images/rhymes'
```

#### 方案C: 完整相对路径
直接在配置中写完整路径：
```javascript
const CDN_IMAGE_CONFIG = {
  'two_tigers': 'images/rhymes/two_tigers.jpg',
  'twinkle': 'images/rhymes/twinkle.jpg',
  // ...
}
```

### 3. 检查图片文件
- 确认图片文件名完全匹配（包括大小写）
- 确认图片格式确实是 JPG
- 确认图片没有损坏

### 4. 清除缓存
在手机上：
- 删除小程序
- 重新扫码进入
- 清除小程序缓存

### 5. 检查项目结构
确保文件夹结构正确：
```
children-rhyme-puzzle/
├── images/
│   └── rhymes/
│       ├── two_tigers.jpg
│       ├── twinkle.jpg
│       └── ...
├── pages/
└── ...
```

## 常见错误
1. 路径前有多余的斜杠
2. 图片文件名不匹配
3. 图片格式不支持
4. 文件夹结构不正确
