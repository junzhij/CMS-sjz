const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 导入路由
const dataRoutes = require('./src/routes/dataRoutes');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/data', dataRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Express CMS Backend API' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
