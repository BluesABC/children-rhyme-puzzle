# 小程序本地图片路径测试

## 问题分析
错误信息显示：`/pages/game/images/rhymes/two_tigers.jpg`
这说明路径被解析为相对于当前页面，而不是项目根目录。

## 当前配置
- 路径：`/images/rhymes/two_tigers.jpg`
- 期望：从项目根目录解析
- 实际：从页面目录解析

## 解决方案尝试

### 1. 使用绝对路径（当前）
```javascript
const CDN_IMAGE_BASE = '/images/rhymes'
```
结果：失败，路径被错误解析

### 2. 使用相对路径
```javascript
const CDN_IMAGE_BASE = '../../images/rhymes'
```
可能适用于特定页面，但不通用

### 3. 使用完整路径
```javascript
const CDN_IMAGE_CONFIG = {
  'two_tigers': '/images/rhymes/two_tigers.jpg'
}
```

### 4. 检查项目配置
可能需要在project.config.json中声明资源路径

## 小程序图片路径规则
1. 绝对路径以 `/` 开头，从项目根目录开始
2. 相对路径相对于当前页面文件
3. CSS background-image 可能有特殊限制

## 调试步骤
1. 检查控制台输出的图片路径
2. 确认文件是否存在于正确位置
3. 测试不同路径格式
