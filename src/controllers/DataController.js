const Preference = require('../models/Preference');
const Dislike = require('../models/Dislike');
const AIService = require('../services/AIService');

class DataController {
  // 初始化偏好和不喜欢数据
  static async init(req, res) {
    try {
      const { preferences = [], dislikes = [] } = req.body;

      // 清空现有数据
      await Preference.deleteAll();
      await Dislike.deleteAll();

      // 添加新的偏好数据
      const preferenceIds = [];
      for (const pref of preferences) {
        const id = await Preference.create(pref.type, pref.value, pref.weight || 1.0);
        preferenceIds.push(id);
      }

      // 添加新的不喜欢数据
      const dislikeIds = [];
      for (const dislike of dislikes) {
        const id = await Dislike.create(dislike.type, dislike.value, dislike.weight || 1.0);
        dislikeIds.push(id);
      }

      res.status(200).json({
        success: true,
        message: '数据初始化成功',
        data: {
          preferences: preferenceIds.length,
          dislikes: dislikeIds.length
        }
      });
    } catch (error) {
      console.error('初始化错误:', error);
      res.status(500).json({
        success: false,
        message: '数据初始化失败',
        error: error.message
      });
    }
  }

  // 获取AI建议
  static async getSuggestion(req, res) {
    try {
      const additionalData = req.body || {};

      // 获取所有偏好和不喜欢数据
      const preferences = await Preference.getAll();
      const dislikes = await Dislike.getAll();

      // 调用AI服务获取建议
      const suggestion = await AIService.getSuggestion(preferences, dislikes, additionalData);

      res.status(200).json({
        success: true,
        message: '建议获取成功',
        data: {
          suggestion,
          preferences: preferences.length,
          dislikes: dislikes.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('获取建议错误:', error);
      res.status(500).json({
        success: false,
        message: '获取建议失败',
        error: error.message
      });
    }
  }

  // 获取当前数据状态
  static async getStatus(req, res) {
    try {
      const preferences = await Preference.getAll();
      const dislikes = await Dislike.getAll();

      res.status(200).json({
        success: true,
        data: {
          preferences: {
            count: preferences.length,
            data: preferences
          },
          dislikes: {
            count: dislikes.length,
            data: dislikes
          },
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('获取状态错误:', error);
      res.status(500).json({
        success: false,
        message: '获取状态失败',
        error: error.message
      });
    }
  }

  // 添加单个偏好
  static async addPreference(req, res) {
    try {
      const { type, value, weight = 1.0 } = req.body;

      if (!type || !value) {
        return res.status(400).json({
          success: false,
          message: 'type和value字段是必需的'
        });
      }

      const id = await Preference.create(type, value, weight);

      res.status(201).json({
        success: true,
        message: '偏好添加成功',
        data: { id, type, value, weight }
      });
    } catch (error) {
      console.error('添加偏好错误:', error);
      res.status(500).json({
        success: false,
        message: '添加偏好失败',
        error: error.message
      });
    }
  }

  // 添加单个不喜欢
  static async addDislike(req, res) {
    try {
      const { type, value, weight = 1.0 } = req.body;

      if (!type || !value) {
        return res.status(400).json({
          success: false,
          message: 'type和value字段是必需的'
        });
      }

      const id = await Dislike.create(type, value, weight);

      res.status(201).json({
        success: true,
        message: '不喜欢项添加成功',
        data: { id, type, value, weight }
      });
    } catch (error) {
      console.error('添加不喜欢错误:', error);
      res.status(500).json({
        success: false,
        message: '添加不喜欢项失败',
        error: error.message
      });
    }
  }
}

module.exports = DataController;
