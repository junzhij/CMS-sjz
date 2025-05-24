const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 导入路由
const dataRoutes = require('./src/routes/dataRoutes');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 导入模型
const Preference = require('./src/models/Preference');
const Dislike = require('./src/models/Dislike');
// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', dataRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Express CMS Backend API' });
});

// 启动时清空数据的函数
async function clearDataOnStartup() {
  // 检查环境变量是否启用清空功能
  if (process.env.CLEAR_DATA_ON_STARTUP !== 'true') {
    console.log('💡 跳过数据清空（CLEAR_DATA_ON_STARTUP 未设置为 true）');
    return;
  }

  try {
    console.log('🗑️  正在清空启动数据...');
    
    // 删除所有偏好数据
    const deletedPreferences = await Preference.deleteAll();
    console.log(`✅ 已删除 ${deletedPreferences} 条偏好记录`);
    
    // 删除所有不喜欢数据
    const deletedDislikes = await Dislike.deleteAll();
    console.log(`✅ 已删除 ${deletedDislikes} 条不喜欢记录`);
    
    console.log('🧹 数据清空完成！');
  } catch (error) {
    console.error('❌ 清空数据时出错:', error.message);
  }
}

// // 启动服务器
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   await clearDataOnStartup();
// });
clearDataOnStartup();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`📡 API 可用地址: http://localhost:${PORT}/api`);
  console.log(`📄 根路由: http://localhost:${PORT}/`);
});

module.exports = app;