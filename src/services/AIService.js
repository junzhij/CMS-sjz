const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'http://tower.taildcd01.ts.net:3000/v1',
});

class AIService {
  // 获取AI建议
  static async getSuggestion(preferences, dislikes, additionalData) {
    try {
      const systemPrompt = `你是一个智能建议系统。基于用户的偏好和不喜欢的内容，为用户提供个性化建议。
      
偏好数据: ${JSON.stringify(preferences)}
不喜欢的数据: ${JSON.stringify(dislikes)}
附加数据: ${JSON.stringify(additionalData)}

请基于这些信息提供3-5个具体的建议，每个建议包含：
1. 建议内容
2. 理由说明
3. 相关性评分(1-10)

返回格式为JSON数组。`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: '请根据我的偏好和不喜欢的内容给出建议。'
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      throw new Error(`AI服务错误: ${error.message}`);
    }
  }

  // 分析数据并生成洞察
  static async analyzeData(data) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个数据分析专家。请分析提供的数据并给出洞察和模式识别。'
          },
          {
            role: 'user',
            content: `请分析以下数据: ${JSON.stringify(data)}`
          }
        ],
        max_tokens: 500,
        temperature: 0.5,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      throw new Error(`数据分析错误: ${error.message}`);
    }
  }
  static async getRecipe(requirements) {
    try {
      const systemPrompt = `你是一个智能食谱推荐系统。基于用户的需求，为用户提供个性化的食谱建议。
用户需求: ${JSON.stringify(requirements)}
请基于这些信息提供一个具体的食谱建议，包含：
1. 食谱名称
2. 食材列表
3. 制作步骤`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: '请根据我的需求给出食谱建议。'
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0].message.content;
    }
    catch (error) {
      throw new Error(`食谱推荐错误: ${error.message}`);
    }
  }
}

module.exports = AIService;
