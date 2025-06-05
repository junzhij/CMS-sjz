const Preference = require('../models/Preference');
const Dislike = require('../models/Dislike');
const AIService = require('../services/AIService');
const { marked } = require('marked');

class DataController {
  // 初始化偏好和不喜欢数据
  static async init(req, res) {
    try {
      console.log('接收到的原始数据:', req.body);
      
      let { preferences = [], dislikes = [] } = req.body;

      // 处理字符串格式的数据
      if (typeof preferences === 'string') {
        try {
          preferences = JSON.parse(preferences);
        } catch (e) {
          console.error('解析 preferences 字符串失败:', e);
          preferences = [];
        }
      }

      if (typeof dislikes === 'string') {
        try {
          dislikes = JSON.parse(dislikes);
        } catch (e) {
          console.error('解析 dislikes 字符串失败:', e);
          dislikes = [];
        }
      }

      console.log('解析后的 preferences:', preferences);
      console.log('解析后的 dislikes:', dislikes);

      // 确保是数组
      if (!Array.isArray(preferences)) preferences = [];
      if (!Array.isArray(dislikes)) dislikes = [];

      // 清空现有数据
      await Preference.deleteAll();
      await Dislike.deleteAll();

      // 添加新的偏好数据
      const preferenceIds = [];
      for (const pref of preferences) {
        // 验证数据格式
        if (!pref || !pref.type || !pref.value) {
          console.warn('跳过无效的偏好数据:', pref);
          continue;
        }
        const id = await Preference.create(pref.type, pref.value, pref.weight || 1.0);
        preferenceIds.push(id);
      }

      // 添加新的不喜欢数据
      const dislikeIds = [];
      for (const dislike of dislikes) {
        // 验证数据格式
        if (!dislike || !dislike.type || !dislike.value) {
          console.warn('跳过无效的不喜欢数据:', dislike);
          continue;
        }
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
      const analyzeData = await AIService.getSuggestion(preferences, dislikes, additionalData);
      console.log('AI分析原始结果:', analyzeData);
      
      // 处理AI返回的数据，转换为JSON格式
      let suggestions = [];
      
      if (typeof analyzeData === 'string') {
        // 清理AI返回的格式标记
        let cleanedData = analyzeData
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        
        console.log('清理后的数据:', cleanedData);
        
        try {
          suggestions = JSON.parse(cleanedData);
        } catch (e) {
          console.error('解析 AI 分析结果失败:', e);
          // 如果解析失败，返回一个包含原始数据的对象
          suggestions = [{
            suggestion: "数据解析失败",
            reason: "AI返回的数据格式无法解析",
            relevance: 0,
            rawData: analyzeData
          }];
        }
      } else if (Array.isArray(analyzeData)) {
        suggestions = analyzeData;
      } else {
        suggestions = [analyzeData];
      }

      res.status(200).json({
        success: true,
        message: '建议获取成功',
        additionalData,
        data: {
          suggestions: suggestions,
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
  static async getRecipe(req, res) {
    try {
      // 支持多种请求格式
      const { requirements, dishName, reason, ...otherData } = req.body;
      
      // 构建完整的食谱要求对象
      let recipeRequirements;
      
      if (requirements) {
        // 如果直接提供了 requirements 对象
        recipeRequirements = requirements;
      } else if (dishName) {
        // 如果提供了 dishName 和 reason，构建要求对象
        recipeRequirements = {
          dishName,
          reason,
          ...otherData
        };
      } else {
        // 使用整个请求体作为要求
        recipeRequirements = req.body;
      }
      
      console.log('处理后的食谱要求:', recipeRequirements);
      
      const suggestion = await AIService.getRecipe(recipeRequirements);
      const htmlContent = marked(suggestion);
      console.log('AI食谱建议:', suggestion);
      
      res.status(200).json({
        success: true,
        message: '食谱获取成功',
        data: {
          htmlContent,
          rawSuggestion: suggestion,
          requirements: recipeRequirements,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('获取食谱错误:', error);
      res.status(500).json({
        success: false,
        message: '获取食谱失败',
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
// 获取是否已初始化
  static async isInitialized(req, res) {
    try {
      const preferences = await Preference.getAll();
      const dislikes = await Dislike.getAll();

      const initialized = preferences.length > 0 || dislikes.length > 0;

      res.status(200).json({
        success: true,
        initialized,
        data: {
          preferences: preferences.length,
          dislikes: dislikes.length
        }
      });
    } catch (error) {
      console.error('检查初始化状态错误:', error);
      res.status(500).json({
        success: false,
        message: '检查初始化状态失败',
        error: error.message
      });
    }
  }

  // 清除所有数据
  static async clearData(req, res) {
    try {
      await Preference.deleteAll();
      await Dislike.deleteAll();

      res.status(200).json({
        success: true,
        message: '所有数据已清除'
      });
    } catch (error) {
      console.error('清除数据错误:', error);
      res.status(500).json({
        success: false,
        message: '清除数据失败',
        error: error.message
      });
    }
  }
  // 删除单个偏好
  static async deletePreference(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: '偏好ID是必需的'
        });
      }

      const deleted = await Preference.delete(id);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: '偏好删除成功'
        });
      } else {
        res.status(404).json({
          success: false,
          message: '偏好未找到'
        });
      }
    } catch (error) {
      console.error('删除偏好错误:', error);
      res.status(500).json({
        success: false,
        message: '删除偏好失败',
        error: error.message
      });
    }
  }
  // 删除单个不喜欢项
  static async deleteDislike(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: '不喜欢项ID是必需的'
        });
      }

      const deleted = await Dislike.delete(id);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: '不喜欢项删除成功'
        });
      } else {
        res.status(404).json({
          success: false,
          message: '不喜欢项未找到'
        });
      }
    } catch (error) {
      console.error('删除不喜欢项错误:', error);
      res.status(500).json({
        success: false,
        message: '删除不喜欢项失败',
        error: error.message
      });
    }
  }
}

module.exports = DataController;
