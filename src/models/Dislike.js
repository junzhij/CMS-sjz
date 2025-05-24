const { pool } = require('../config/database');

class Dislike {
  // 创建新的不喜欢记录
  static async create(type, value, weight = 1.0) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO dislike (type, value, weight) VALUES (?, ?, ?)',
        [type, JSON.stringify(value), weight]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating dislike: ${error.message}`);
    }
  }

  // 获取所有不喜欢记录
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM dislike ORDER BY created_at DESC');
      return rows.map(row => ({
        ...row,
        value: typeof row.value === 'string' ? JSON.parse(row.value) : row.value
      }));
    } catch (error) {
      throw new Error(`Error fetching dislikes: ${error.message}`);
    }
  }

  // 根据类型获取不喜欢记录
  static async getByType(type) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM dislike WHERE type = ? ORDER BY created_at DESC',
        [type]
      );
      return rows.map(row => ({
        ...row,
        value: typeof row.value === 'string' ? JSON.parse(row.value) : row.value
      }));
    } catch (error) {
      throw new Error(`Error fetching dislikes by type: ${error.message}`);
    }
  }

  // 更新不喜欢记录
  static async update(id, type, value, weight) {
    try {
      const [result] = await pool.execute(
        'UPDATE dislike SET type = ?, value = ?, weight = ? WHERE id = ?',
        [type, JSON.stringify(value), weight, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating dislike: ${error.message}`);
    }
  }

  // 删除不喜欢记录
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM dislike WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting dislike: ${error.message}`);
    }
  }

  // 清空所有不喜欢记录
  static async deleteAll() {
    try {
      const [result] = await pool.execute('DELETE FROM dislike');
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting all dislikes: ${error.message}`);
    }
  }
}
module.exports = Dislike;
