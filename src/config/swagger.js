const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express CMS Backend API',
      version: '1.0.0',
      description: `
# 智能建议系统 API

这是一个基于 AI 的智能建议系统，提供以下功能：

## 主要功能
- 🤖 **AI 建议生成**: 基于用户偏好和历史数据生成个性化建议
- 🍳 **食谱推荐**: 根据食材和偏好推荐合适的食谱
- 📊 **数据管理**: 管理用户偏好和不喜欢的项目
- 📈 **数据分析**: 提供数据洞察和模式识别

## 快速开始
1. 首先访问 \`/api/presets\` 获取测试数据
2. 使用预设数据测试各个 API 端点
3. 查看响应格式并根据需要调整请求

## API 测试建议
- 使用 \`/api/presets\` 获取预设的测试数据
- 先调用 \`/api/init\` 初始化数据（可选）
- 然后测试 \`/api/getsuggest\` 和 \`/api/getrecipe\` 等主要功能
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3210',
        description: '开发服务器',
      },
    ],
    tags: [
      {
        name: 'AI服务',
        description: 'AI 相关的服务端点，包括建议生成和食谱推荐'
      },
      {
        name: '数据管理',
        description: '用户数据管理相关的端点'
      },
      {
        name: '测试数据',
        description: '用于测试的预设数据'
      }
    ],
    components: {
      schemas: {
        Preference: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: '偏好ID',
              example: 1
            },
            name: {
              type: 'string',
              description: '偏好名称',
              example: '麻辣口味'
            },
            category: {
              type: 'string',
              description: '偏好分类',
              example: '口味'
            },
            weight: {
              type: 'number',
              description: '权重值(0-1)',
              minimum: 0,
              maximum: 1,
              example: 0.8
            },
          },
        },
        Dislike: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: '不喜欢项ID',
              example: 1
            },
            name: {
              type: 'string',
              description: '不喜欢项名称',
              example: '过于油腻'
            },
            category: {
              type: 'string',
              description: '不喜欢项分类',
              example: '口感'
            },
            weight: {
              type: 'number',
              description: '权重值(0-1)',
              minimum: 0,
              maximum: 1,
              example: 0.9
            },
          },
        },
        AISuggestion: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: '建议内容',
              example: '推荐制作番茄鸡蛋面'
            },
            reason: {
              type: 'string',
              description: '理由说明',
              example: '基于您对简单快手菜的偏好，番茄鸡蛋面制作简单，用料常见，15分钟即可完成'
            },
            relevanceScore: {
              type: 'number',
              minimum: 1,
              maximum: 10,
              description: '相关性评分(1-10)',
              example: 8.5
            },
          },
        },
        SuggestionRequest: {
          type: 'object',
          required: ['preferences', 'dislikes'],
          properties: {
            preferences: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '用户偏好列表',
              example: ['快速制作', '简单食材', '家常菜']
            },
            dislikes: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '用户不喜欢的项目列表',
              example: ['复杂工艺', '长时间烹饪', '难买食材']
            },
            additionalData: {
              type: 'object',
              description: '附加场景数据',
              properties: {
                scenario: {
                  type: 'string',
                  description: '使用场景',
                  example: '今天想吃简单点'
                },
                timeLimit: {
                  type: 'string',
                  description: '时间限制',
                  example: '30分钟内'
                },
                cookingSkill: {
                  type: 'string',
                  description: '烹饪技能水平',
                  example: '初级'
                },
                availableIngredients: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: '可用食材',
                  example: ['鸡蛋', '面条', '青菜', '葱']
                },
                mood: {
                  type: 'string',
                  description: '当前心情/需求',
                  example: '想要快速解决'
                }
              }
            }
          }
        },
        RecipeRequirement: {
          type: 'object',
          properties: {
            cuisine: {
              type: 'string',
              description: '菜系类型',
              example: '川菜'
            },
            difficulty: {
              type: 'string',
              description: '难度等级',
              enum: ['简单', '中等', '困难'],
              example: '简单'
            },
            timeLimit: {
              type: 'string',
              description: '时间限制',
              example: '30分钟内'
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '可用食材',
              example: ['鸡蛋', '面条', '青菜']
            },
            spiceLevel: {
              type: 'string',
              description: '辣度等级',
              enum: ['不辣', '微辣', '中辣', '重辣'],
              example: '中辣'
            }
          },
        },
        Recipe: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '食谱名称',
              example: '番茄鸡蛋面'
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '食材列表',
              example: ['面条 200g', '鸡蛋 2个', '番茄 2个', '葱花 适量']
            },
            steps: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '制作步骤',
              example: [
                '1. 番茄切块，鸡蛋打散',
                '2. 热锅放油，炒鸡蛋盛起',
                '3. 炒番茄出汁，加入鸡蛋',
                '4. 煮面条，拌入番茄鸡蛋',
                '5. 撒葱花即可'
              ]
            },
            cookingTime: {
              type: 'string',
              description: '制作时间',
              example: '15分钟'
            },
            difficulty: {
              type: 'string',
              description: '难度等级',
              example: '简单'
            }
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: '错误消息',
              example: 'AI服务暂时不可用'
            },
            code: {
              type: 'string',
              description: '错误代码',
              example: 'AI_SERVICE_ERROR'
            }
          },
        },
      },
      examples: {
        SimpleSuggestionRequest: {
          summary: '简单快手餐建议请求',
          value: {
            preferences: ['快速制作', '简单食材', '家常菜'],
            dislikes: ['复杂工艺', '长时间烹饪', '难买食材'],
            additionalData: {
              scenario: '今天想吃简单点',
              timeLimit: '30分钟内',
              cookingSkill: '初级',
              availableIngredients: ['鸡蛋', '面条', '青菜', '葱'],
              mood: '想要快速解决'
            }
          }
        },
        SichuanSuggestionRequest: {
          summary: '川菜建议请求',
          value: {
            preferences: ['川菜', '麻辣', '下饭菜', '重口味'],
            dislikes: ['清淡', '甜食', '生冷'],
            additionalData: {
              scenario: '今天想吃川菜',
              spiceLevel: '中辣',
              cookingStyle: '家常川菜',
              availableIngredients: ['豆瓣酱', '花椒', '辣椒', '蒜苗'],
              mood: '想要开胃下饭'
            }
          }
        },
        SimpleRecipeRequest: {
          summary: '简单食谱请求',
          value: {
            cuisine: '家常菜',
            difficulty: '简单',
            timeLimit: '15分钟内',
            ingredients: ['鸡蛋', '面条', '青菜', '葱']
          }
        }
      }
    },
  },
  apis: ['./src/routes/*.js'], // 指向包含 API 注释的文件
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
