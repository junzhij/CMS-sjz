// 预设的建议请求数据，用于Swagger Playground测试
const suggestionPresets = {
  // 1. 简单快手餐
  simple: {
    preferences: ["快速制作", "简单食材", "家常菜"],
    dislikes: ["复杂工艺", "长时间烹饪", "难买食材"],
    additionalData: {
      scenario: "今天想吃简单点",
      timeLimit: "30分钟内",
      cookingSkill: "初级",
      availableIngredients: ["鸡蛋", "面条", "青菜", "葱"],
      mood: "想要快速解决"
    }
  },

  // 2. 川菜系列
  sichuan: {
    preferences: ["川菜", "麻辣", "下饭菜", "重口味"],
    dislikes: ["清淡", "甜食", "生冷"],
    additionalData: {
      scenario: "今天想吃川菜",
      spiceLevel: "中辣",
      cookingStyle: "家常川菜",
      availableIngredients: ["豆瓣酱", "花椒", "辣椒", "蒜苗"],
      mood: "想要开胃下饭"
    }
  },

  // 3. 粤菜清淡
  cantonese: {
    preferences: ["粤菜", "清淡", "营养", "蒸煮"],
    dislikes: ["油腻", "重口味", "辛辣"],
    additionalData: {
      scenario: "今天想吃粤菜",
      healthFocus: "养生清淡",
      cookingMethod: "蒸煮为主",
      availableIngredients: ["鱼", "排骨", "冬瓜", "姜丝"],
      mood: "想要清爽养胃"
    }
  },

  // 4. 日式料理
  japanese: {
    preferences: ["日式", "精致", "海鲜", "清爽"],
    dislikes: ["重油", "复杂调料", "过咸"],
    additionalData: {
      scenario: "今天想吃日式料理",
      style: "家庭日式",
      cookingMethod: "生食+简单烹饪",
      availableIngredients: ["三文鱼", "海苔", "米饭", "芥末"],
      mood: "想要精致清新"
    }
  },

  // 5. 素食健康
  vegetarian: {
    preferences: ["素食", "健康", "低脂", "维生素丰富"],
    dislikes: ["肉类", "高热量", "油炸"],
    additionalData: {
      scenario: "今天想吃素食",
      healthGoal: "减脂健康",
      cookingMethod: "少油烹饪",
      availableIngredients: ["豆腐", "蘑菇", "西兰花", "胡萝卜"],
      mood: "想要清爽健康"
    }
  },

  // 6. 韩式料理
  korean: {
    preferences: ["韩式", "发酵食品", "泡菜", "烤制"],
    dislikes: ["过甜", "油腻", "生冷"],
    additionalData: {
      scenario: "今天想吃韩式料理",
      flavor: "酸辣开胃",
      cookingMethod: "烤制+发酵",
      availableIngredients: ["五花肉", "泡菜", "大蒜", "芝麻油"],
      mood: "想要开胃解腻"
    }
  }
};

// 食谱请求预设数据
const recipePresets = {
  sichuan: {
    cuisine: "川菜",
    difficulty: "简单",
    timeLimit: "30分钟内",
    ingredients: ["豆瓣酱", "花椒", "辣椒", "蒜苗"]
  },
  quick: {
    cuisine: "家常菜",
    difficulty: "简单",
    timeLimit: "15分钟内",
    ingredients: ["鸡蛋", "面条", "青菜", "葱"]
  },
  healthy: {
    cuisine: "素食",
    difficulty: "简单",
    timeLimit: "20分钟内",
    ingredients: ["豆腐", "蘑菇", "西兰花", "胡萝卜"]
  }
};

module.exports = {
  suggestionPresets,
  recipePresets
};
