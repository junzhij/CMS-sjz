const express = require('express');
const DataController = require('../controllers/DataController');

const router = express.Router();

/**
 * @swagger
 * /api/init:
 *   post:
 *     summary: 初始化偏好和不喜欢数据
 *     tags: [数据管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     category:
 *                       type: string
 *                     weight:
 *                       type: number
 *               dislikes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     category:
 *                       type: string
 *                     weight:
 *                       type: number
 *     responses:
 *       200:
 *         description: 数据初始化成功
 *       500:
 *         description: 服务器错误
 */
router.post('/init', DataController.init);

/**
 * @swagger
 * /api/getsuggest:
 *   post:
 *     summary: 获取AI建议
 *     description: 基于用户偏好、不喜欢的项目和附加场景数据，生成个性化的AI建议
 *     tags: [AI服务]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuggestionRequest'
 *           examples:
 *             simple:
 *               $ref: '#/components/examples/SimpleSuggestionRequest'
 *             sichuan:
 *               $ref: '#/components/examples/SichuanSuggestionRequest'
 *     responses:
 *       200:
 *         description: 成功获取AI建议
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: AI生成的建议内容（JSON字符串格式）
 *             example: |
 *               [
 *                 {
 *                   "content": "番茄鸡蛋面",
 *                   "reason": "制作简单，用料常见，符合您的快手需求",
 *                   "relevanceScore": 9
 *                 },
 *                 {
 *                   "content": "青菜蛋花汤",
 *                   "reason": "清爽简单，营养丰富，制作时间短",
 *                   "relevanceScore": 8
 *                 }
 *               ]
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/getsuggest', DataController.getSuggestion);

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: 获取当前数据状态
 *     tags: [数据管理]
 *     responses:
 *       200:
 *         description: 成功获取数据状态
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 preferences:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Preference'
 *                 dislikes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dislike'
 *       500:
 *         description: 服务器错误
 */
router.get('/status', DataController.getStatus);

/**
 * @swagger
 * /api/preference:
 *   post:
 *     summary: 添加单个偏好
 *     tags: [数据管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "麻辣口味"
 *               category:
 *                 type: string
 *                 example: "口味"
 *               weight:
 *                 type: number
 *                 example: 0.8
 *     responses:
 *       200:
 *         description: 偏好添加成功
 *       500:
 *         description: 服务器错误
 */
router.post('/preference', DataController.addPreference);

/**
 * @swagger
 * /api/dislike:
 *   post:
 *     summary: 添加单个不喜欢项
 *     tags: [数据管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "过于油腻"
 *               category:
 *                 type: string
 *                 example: "口感"
 *               weight:
 *                 type: number
 *                 example: 0.9
 *     responses:
 *       200:
 *         description: 不喜欢项添加成功
 *       500:
 *         description: 服务器错误
 */
router.post('/dislike', DataController.addDislike);

/**
 * @swagger
 * /api/ifinit:
 *   get:
 *     summary: 检查数据是否已初始化
 *     tags: [数据管理]
 *     responses:
 *       200:
 *         description: 成功获取初始化状态
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 initialized:
 *                   type: boolean
 *                   description: 是否已初始化
 *       500:
 *         description: 服务器错误
 */
router.get('/ifinit', DataController.isInitialized);

/**
 * @swagger
 * /api/clear:
 *   post:
 *     summary: 清除所有数据
 *     tags: [数据管理]
 *     responses:
 *       200:
 *         description: 数据清除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "所有数据已清除"
 *       500:
 *         description: 服务器错误
 */
router.post('/clear', DataController.clearData);

/**
 * @swagger
 * /api/delpreference:
 *   post:
 *     summary: 删除偏好
 *     tags: [数据管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: 偏好删除成功
 *       500:
 *         description: 服务器错误
 */
router.post('/delpreference', DataController.deletePreference);

/**
 * @swagger
 * /api/deldislike:
 *   post:
 *     summary: 删除不喜欢项
 *     tags: [数据管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: 不喜欢项删除成功
 *       500:
 *         description: 服务器错误
 */
router.post('/deldislike', DataController.deleteDislike);

/**
 * @swagger
 * /api/getrecipe:
 *   post:
 *     summary: 获取食谱推荐
 *     description: 根据用户的菜系偏好、难度要求、时间限制和可用食材，推荐合适的食谱
 *     tags: [AI服务]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeRequirement'
 *           examples:
 *             simple:
 *               $ref: '#/components/examples/SimpleRecipeRequest'
 *             sichuan:
 *               summary: '川菜食谱请求'
 *               value:
 *                 cuisine: "川菜"
 *                 difficulty: "简单"
 *                 timeLimit: "30分钟内"
 *                 ingredients: ["豆瓣酱", "花椒", "辣椒", "蒜苗"]
 *                 spiceLevel: "中辣"
 *     responses:
 *       200:
 *         description: 成功获取食谱推荐
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: AI生成的食谱内容（JSON字符串格式）
 *             example: |
 *               [
 *                 {
 *                   "name": "番茄鸡蛋面",
 *                   "ingredients": ["面条 200g", "鸡蛋 2个", "番茄 2个", "葱花 适量"],
 *                   "steps": ["1. 番茄切块，鸡蛋打散", "2. 热锅放油，炒鸡蛋盛起", "3. 炒番茄出汁，加入鸡蛋", "4. 煮面条，拌入番茄鸡蛋", "5. 撒葱花即可"]
 *                 }
 *               ]
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/getrecipe', DataController.getRecipe);

/**
 * @swagger
 * /api/presets:
 *   get:
 *     summary: 获取预设测试数据
 *     tags: [测试数据]
 *     responses:
 *       200:
 *         description: 成功获取预设数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestionPresets:
 *                   type: object
 *                   description: 建议请求预设数据
 *                 recipePresets:
 *                   type: object
 *                   description: 食谱请求预设数据
 */
router.get('/presets', (req, res) => {
  const { suggestionPresets, recipePresets } = require('../config/presets');
  res.json({
    suggestionPresets,
    recipePresets,
    usage: {
      suggestion: "使用 suggestionPresets 中的任意数据作为 /api/getsuggest 的请求体",
      recipe: "使用 recipePresets 中的任意数据作为 /api/getrecipe 的请求体"
    }
  });
});

module.exports = router;
