const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    // 创建数据库
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'express_cms'} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ 数据库创建成功');

    // 选择数据库
    await connection.query(`USE ${process.env.DB_NAME || 'express_cms'}`);

    // 创建 preference 表
    const createPreferenceTable = `
      CREATE TABLE IF NOT EXISTS preference (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(100) NOT NULL COMMENT '偏好类型',
        value JSON NOT NULL COMMENT '偏好值',
        weight DECIMAL(3,2) DEFAULT 1.00 COMMENT '权重',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_weight (weight),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createPreferenceTable);
    console.log('✅ preference 表创建成功');

    // 创建 dislike 表
    const createDislikeTable = `
      CREATE TABLE IF NOT EXISTS dislike (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(100) NOT NULL COMMENT '不喜欢类型',
        value JSON NOT NULL COMMENT '不喜欢值',
        weight DECIMAL(3,2) DEFAULT 1.00 COMMENT '权重',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_weight (weight),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createDislikeTable);
    console.log('✅ dislike 表创建成功');

    console.log('🎉 数据库初始化完成！');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
  } finally {
    await connection.end();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;