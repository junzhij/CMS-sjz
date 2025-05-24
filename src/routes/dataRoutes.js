const express = require('express');
const DataController = require('../controllers/DataController');

const router = express.Router();

// POST /api/data/init - 初始化偏好和不喜欢数据
router.post('/init', DataController.init);

// POST /api/data/getsuggest - 获取AI建议
router.post('/getsuggest', DataController.getSuggestion);

// GET /api/data/status - 获取当前数据状态
router.get('/status', DataController.getStatus);

// POST /api/data/preference - 添加单个偏好
router.post('/preference', DataController.addPreference);

// POST /api/data/dislike - 添加单个不喜欢项
router.post('/dislike', DataController.addDislike);

module.exports = router;
