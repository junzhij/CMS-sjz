const express = require('express');
const DataController = require('../controllers/DataController');

const router = express.Router();

// POST /api/init - 初始化偏好和不喜欢数据
router.post('/init', DataController.init);

// POST /api/getsuggest - 获取AI建议
router.post('/getsuggest', DataController.getSuggestion);

// GET /api/status - 获取当前数据状态
router.get('/status', DataController.getStatus);

// POST /api/preference - 添加单个偏好
router.post('/preference', DataController.addPreference);

// POST /api/dislike - 添加单个不喜欢项
router.post('/dislike', DataController.addDislike);

// GET /api/ifinit
router.get('/ifinit', DataController.isInitialized);

// POST /api/clear - 清除所有数据
router.post('/clear', DataController.clearData);

// POST /api/preference/ - 删除偏好
router.post('/delpreference', DataController.deletePreference);

// POST /api/dislike/ - 删除不喜欢项
router.post('/deldislike', DataController.deleteDislike);

// POST /api/getrecipe - 获取食谱
router.post('/getrecipe', DataController.getRecipe);
module.exports = router;
