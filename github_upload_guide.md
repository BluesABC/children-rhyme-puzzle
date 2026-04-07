# GitHub上传操作指南

## ? 需要您手动完成的操作

### 1. 创建GitHub仓库
1. 访问：https://github.com/new
2. 仓库名称：`children-rhyme-puzzle`
3. 描述：`Audio files for children rhyme puzzle game`
4. 选择：**Public** (公开仓库)
5. **不要**添加README、.gitignore或license
6. 点击"Create repository"

### 2. 上传文件
1. 在新创建的仓库页面，点击"Add file" → "Upload files"
2. 将以下文件拖拽到上传区域：
   - `index.html`
   - `README.md`
   - 整个 `audio/` 文件夹（包含7个MP3文件）
3. 在底部提交信息中输入："Initial commit - audio files for CDN"
4. 点击"Commit changes"

### 3. 启用GitHub Pages
1. 进入仓库设置（Settings）
2. 在左侧菜单找到"Pages"
3. 在"Source"部分：
   - Branch: 选择"main"（或"master"）
   - Folder: 选择"/ (root)"
4. 点击"Save"
5. 等待2-3分钟，页面会显示您的GitHub Pages URL

## ? 完成后的结果
您的GitHub Pages URL将是：`https://[您的GitHub用户名].github.io/children-rhyme-puzzle`

音频文件URL格式：`https://[您的GitHub用户名].github.io/children-rhyme-puzzle/audio/[文件名]`

## ? 完成后请告诉我
当您完成GitHub上传后，请告诉我：
1. 您的GitHub用户名
2. GitHub Pages是否成功启用

我将立即帮您更新CDN配置！
