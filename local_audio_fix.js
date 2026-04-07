// 临时本地音频解决方案
// 将音频文件复制回本地以解决CDN问题

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'audio_backup_final');
const targetDir = path.join(__dirname, 'audio', 'rhymes');

console.log('=== 临时音频修复 ===');
console.log('将音频文件复制回本地以解决CDN问题');

try {
  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 复制音频文件
  const audioFiles = [
    'chong_er_fei.mp3',
    'twinkle.mp3', 
    'pull_turnip.mp3',
    'two_tigers.mp3',
    'luo_yu_da.mp3',
    'little_donkey.mp3',
    'yue_guang_guang.mp3'
  ];

  audioFiles.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`? 复制: ${file}`);
    } else {
      console.log(`? 源文件不存在: ${file}`);
    }
  });

  console.log('\n=== 修复完成 ===');
  console.log('音频文件已复制回本地目录');
  console.log('请重新编译小程序测试');
  
} catch (error) {
  console.error('修复失败:', error);
}
