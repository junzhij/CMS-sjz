# Swagger API Playground 使用指南

## 🚀 快速开始

您的 Swagger API Playground 已成功设置完成！现在可以访问：

**📚 Swagger UI**: http://localhost:3210/api-docs

## 🎯 主要功能

### 1. AI 建议系统 (`/api/getsuggest`)
基于用户偏好生成个性化建议

### 2. 食谱推荐系统 (`/api/getrecipe`)
根据食材和偏好推荐食谱

### 3. 数据管理
- 添加/删除偏好和不喜欢项
- 查看数据状态
- 清空数据

## 🧪 测试建议

### 步骤 1: 获取测试数据
```bash
GET /api/presets
```
这将返回所有预设的测试数据，包括：
- `suggestionPresets`: 6种不同场景的建议请求数据
- `recipePresets`: 3种食谱请求数据

### 步骤 2: 测试 AI 建议
1. 在 Swagger UI 中找到 `/api/getsuggest` 端点
2. 点击 "Try it out"
3. 复制以下示例数据或使用预设数据：

```json
{
  "preferences": ["快速制作", "简单食材", "家常菜"],
  "dislikes": ["复杂工艺", "长时间烹饪", "难买食材"],
  "additionalData": {
    "scenario": "今天想吃简单点",
    "timeLimit": "30分钟内",
    "cookingSkill": "初级",
    "availableIngredients": ["鸡蛋", "面条", "青菜", "葱"],
    "mood": "想要快速解决"
  }
}
```

### 步骤 3: 测试食谱推荐
1. 找到 `/api/getrecipe` 端点
2. 使用以下示例数据：

```json
{
  "cuisine": "川菜",
  "difficulty": "简单", 
  "timeLimit": "30分钟内",
  "ingredients": ["豆瓣酱", "花椒", "辣椒", "蒜苗"]
}
```

## 📋 预设测试场景

### 建议系统预设：
1. **simple**: 简单快手餐
2. **sichuan**: 川菜系列
3. **cantonese**: 粤菜清淡
4. **japanese**: 日式料理
5. **vegetarian**: 素食健康
6. **korean**: 韩式料理

### 食谱系统预设：
1. **sichuan**: 川菜食谱
2. **quick**: 快手菜谱
3. **healthy**: 健康素食

## 🛠️ 高级功能

### 数据管理端点：
- `POST /api/init`: 初始化系统数据
- `GET /api/status`: 查看当前数据状态
- `POST /api/clear`: 清空所有数据
- `POST /api/preference`: 添加单个偏好
- `POST /api/dislike`: 添加不喜欢项

## 💡 使用技巧

1. **使用示例**: Swagger UI 提供了多个预设示例，可直接点击使用
2. **复制预设**: 先调用 `/api/presets` 获取完整的测试数据
3. **错误处理**: 所有端点都包含错误响应示例
4. **数据格式**: 注意 AI 返回的是 JSON 字符串，需要解析

## 🔧 故障排除

如果遇到问题：
1. 确保服务器正在运行在 http://localhost:3210
2. 检查 OpenAI API 配置是否正确
3. 查看服务器日志获取详细错误信息

---

**🎉 现在就开始在 Swagger UI 中测试您的 API 吧！**
