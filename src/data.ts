export interface ItemRecipe {
  id: string;
  nameEn: string;
  nameZh: string;
  rawId: string;
  enchantedId: string;
  superEnchantedId?: string;
  ratio1: number; // raw to enchanted
  ratio2?: number; // enchanted to super
  collection: string;
  collectionLevel: number;
  npcPrice?: number; // Price of enchanted item if sold to NPC
  superNpcPrice?: number; // Price of super enchanted item if sold to NPC
}

export const FLIP_ITEMS: ItemRecipe[] = [
  {
    id: "WHEAT_BREAD",
    nameEn: "Wheat (Bread Path)",
    nameZh: "小麦 (面包路径)",
    rawId: "WHEAT",
    enchantedId: "ENCHANTED_BREAD",
    ratio1: 60,
    collection: "WHEAT",
    collectionLevel: 2,
    npcPrice: 60,
  },
  {
    id: "WHEAT_HAY",
    nameEn: "Wheat (Hay Bale Path)",
    nameZh: "小麦 (干草块路径)",
    rawId: "WHEAT",
    enchantedId: "ENCHANTED_WHEAT",
    superEnchantedId: "ENCHANTED_HAY_BALE",
    ratio1: 160,
    ratio2: 144,
    collection: "WHEAT",
    collectionLevel: 7,
    npcPrice: 160,
    superNpcPrice: 23040
  },
  {
    id: "MELON",
    nameEn: "Melon",
    nameZh: "西瓜",
    rawId: "MELON",
    enchantedId: "ENCHANTED_MELON_SLICE",
    superEnchantedId: "ENCHANTED_MELON",
    ratio1: 160,
    ratio2: 160,
    collection: "MELON",
    collectionLevel: 5,
    npcPrice: 80,
    superNpcPrice: 12800
  },
  {
    id: "CARROT",
    nameEn: "Carrot",
    nameZh: "胡萝卜",
    rawId: "CARROT_ITEM",
    enchantedId: "ENCHANTED_CARROT",
    superEnchantedId: "ENCHANTED_GOLDEN_CARROT",
    ratio1: 160,
    ratio2: 128, // 128 enchanted carrots + 32 gold (simplified to 128 for profit calc)
    collection: "CARROT",
    collectionLevel: 5,
    npcPrice: 320,
    superNpcPrice: 40960
  },
  {
    id: "POTATO",
    nameEn: "Potato",
    nameZh: "土豆",
    rawId: "POTATO_ITEM",
    enchantedId: "ENCHANTED_POTATO",
    superEnchantedId: "ENCHANTED_BAKED_POTATO",
    ratio1: 160,
    ratio2: 160,
    collection: "POTATO",
    collectionLevel: 5,
    npcPrice: 320,
    superNpcPrice: 51200
  },
  {
    id: "PUMPKIN",
    nameEn: "Pumpkin",
    nameZh: "南瓜",
    rawId: "PUMPKIN",
    enchantedId: "ENCHANTED_PUMPKIN",
    superEnchantedId: "POLISHED_PUMPKIN",
    ratio1: 160,
    ratio2: 160,
    collection: "PUMPKIN",
    collectionLevel: 5,
    npcPrice: 640,
    superNpcPrice: 102400
  },
  {
    id: "SUGAR_CANE",
    nameEn: "Sugar Cane",
    nameZh: "甘蔗",
    rawId: "SUGAR_CANE",
    enchantedId: "ENCHANTED_SUGAR",
    superEnchantedId: "ENCHANTED_SUGAR_CANE",
    ratio1: 160,
    ratio2: 160,
    collection: "SUGAR_CANE",
    collectionLevel: 4,
    npcPrice: 320,
    superNpcPrice: 51200
  },
  {
    id: "NETHER_WART",
    nameEn: "Nether Wart",
    nameZh: "地狱庞",
    rawId: "NETHER_STALK",
    enchantedId: "ENCHANTED_NETHER_STALK",
    superEnchantedId: "ENCHANTED_NETHER_STALK_BLOCK",
    ratio1: 160,
    ratio2: 160,
    collection: "NETHER_WART",
    collectionLevel: 4,
    npcPrice: 640,
    superNpcPrice: 102400
  },
  {
    id: "COCOA",
    nameEn: "Cocoa Beans",
    nameZh: "可可豆",
    rawId: "COCOA_BEANS",
    enchantedId: "ENCHANTED_COCOA_BEANS",
    superEnchantedId: "ENCHANTED_COOKIE",
    ratio1: 160,
    ratio2: 160,
    collection: "COCOA_BEANS",
    collectionLevel: 4,
    npcPrice: 480,
    superNpcPrice: 76800
  },
  {
    id: "MUSHROOM",
    nameEn: "Mushroom",
    nameZh: "蘑菇",
    rawId: "RED_MUSHROOM",
    enchantedId: "ENCHANTED_RED_MUSHROOM",
    superEnchantedId: "ENCHANTED_HUGE_MUSHROOM_RED",
    ratio1: 160,
    ratio2: 160,
    collection: "MUSHROOM",
    collectionLevel: 5,
    npcPrice: 640,
    superNpcPrice: 102400
  },
  {
    id: "CACTUS",
    nameEn: "Cactus",
    nameZh: "仙人掌",
    rawId: "CACTUS",
    enchantedId: "ENCHANTED_CACTUS_GREEN",
    superEnchantedId: "ENCHANTED_CACTUS",
    ratio1: 160,
    ratio2: 160,
    collection: "CACTUS",
    collectionLevel: 5,
    npcPrice: 320,
    superNpcPrice: 51200
  },
  {
    id: "MUTTON",
    nameEn: "Mutton",
    nameZh: "生羊肉",
    rawId: "MUTTON",
    enchantedId: "ENCHANTED_MUTTON",
    superEnchantedId: "ENCHANTED_COOKED_MUTTON",
    ratio1: 160,
    ratio2: 160,
    collection: "MUTTON",
    collectionLevel: 4,
    npcPrice: 800,
    superNpcPrice: 128000
  },
  {
    id: "PORK",
    nameEn: "Pork",
    nameZh: "生猪肉",
    rawId: "PORK",
    enchantedId: "ENCHANTED_PORK",
    superEnchantedId: "ENCHANTED_COOKED_PORK",
    ratio1: 160,
    ratio2: 160,
    collection: "PORK",
    collectionLevel: 4,
    npcPrice: 800,
    superNpcPrice: 128000
  },
  {
    id: "RABBIT",
    nameEn: "Rabbit",
    nameZh: "生兔肉",
    rawId: "RABBIT",
    enchantedId: "ENCHANTED_RABBIT",
    superEnchantedId: "ENCHANTED_COOKED_RABBIT",
    ratio1: 160,
    ratio2: 160,
    collection: "RABBIT",
    collectionLevel: 4,
    npcPrice: 640,
    superNpcPrice: 102400
  },
  {
    id: "CHICKEN",
    nameEn: "Chicken",
    nameZh: "生鸡肉",
    rawId: "RAW_CHICKEN",
    enchantedId: "ENCHANTED_RAW_CHICKEN",
    superEnchantedId: "ENCHANTED_COOKED_CHICKEN",
    ratio1: 160,
    ratio2: 160,
    collection: "RAW_CHICKEN",
    collectionLevel: 4,
    npcPrice: 640,
    superNpcPrice: 102400
  },
  {
    id: "COW",
    nameEn: "Beef",
    nameZh: "生牛肉",
    rawId: "RAW_BEEF",
    enchantedId: "ENCHANTED_RAW_BEEF",
    superEnchantedId: "ENCHANTED_COOKED_BEEF",
    ratio1: 160,
    ratio2: 160,
    collection: "RAW_BEEF",
    collectionLevel: 4,
    npcPrice: 640,
    superNpcPrice: 102400
  },
  {
    id: "COBBLESTONE",
    nameEn: "Cobblestone",
    nameZh: "圆石",
    rawId: "COBBLESTONE",
    enchantedId: "ENCHANTED_COBBLESTONE",
    superEnchantedId: "ENCHANTED_COBBLESTONE_SUPER",
    ratio1: 160,
    ratio2: 160,
    collection: "COBBLESTONE",
    collectionLevel: 4,
    npcPrice: 160,
    superNpcPrice: 25600
  },
  {
    id: "COAL",
    nameEn: "Coal",
    nameZh: "煤炭",
    rawId: "COAL",
    enchantedId: "ENCHANTED_COAL",
    superEnchantedId: "ENCHANTED_COAL_BLOCK",
    ratio1: 160,
    ratio2: 160,
    collection: "COAL",
    collectionLevel: 4,
    npcPrice: 320,
    superNpcPrice: 51200
  },
  {
    id: "IRON",
    nameEn: "Iron",
    nameZh: "铁锭",
    rawId: "IRON_INGOT",
    enchantedId: "ENCHANTED_IRON",
    superEnchantedId: "ENCHANTED_IRON_BLOCK",
    ratio1: 160,
    ratio2: 160,
    collection: "IRON_INGOT",
    collectionLevel: 4,
    npcPrice: 480,
    superNpcPrice: 76800
  },
  {
    id: "GOLD",
    nameEn: "Gold",
    nameZh: "金锭",
    rawId: "GOLD_INGOT",
    enchantedId: "ENCHANTED_GOLD",
    superEnchantedId: "ENCHANTED_GOLD_BLOCK",
    ratio1: 160,
    ratio2: 160,
    collection: "GOLD_INGOT",
    collectionLevel: 4,
    npcPrice: 640,
    superNpcPrice: 102400
  },
  {
    id: "DIAMOND",
    nameEn: "Diamond",
    nameZh: "钻石",
    rawId: "DIAMOND",
    enchantedId: "ENCHANTED_DIAMOND",
    superEnchantedId: "ENCHANTED_DIAMOND_BLOCK",
    ratio1: 160,
    ratio2: 160,
    collection: "DIAMOND",
    collectionLevel: 4,
    npcPrice: 1280,
    superNpcPrice: 204800
  },
  {
    id: "EMERALD",
    nameEn: "Emerald",
    nameZh: "绿宝石",
    rawId: "EMERALD",
    enchantedId: "ENCHANTED_EMERALD",
    superEnchantedId: "ENCHANTED_EMERALD_BLOCK",
    ratio1: 160,
    ratio2: 160,
    collection: "EMERALD",
    collectionLevel: 4,
    npcPrice: 960,
    superNpcPrice: 153600
  },
  {
    id: "LAPIS",
    nameEn: "Lapis",
    nameZh: "青金石",
    rawId: "INK_SACK:4",
    enchantedId: "ENCHANTED_LAPIS_LAZULI",
    superEnchantedId: "ENCHANTED_LAPIS_LAZULI_BLOCK",
    ratio1: 160,
    ratio2: 160,
    collection: "LAPIS_LAZULI",
    collectionLevel: 4,
    npcPrice: 160,
    superNpcPrice: 25600
  },
  {
    id: "REDSTONE",
    nameEn: "Redstone",
    nameZh: "红石",
    rawId: "REDSTONE",
    enchantedId: "ENCHANTED_REDSTONE",
    superEnchantedId: "ENCHANTED_REDSTONE_BLOCK",
    ratio1: 160,
    ratio2: 160,
    collection: "REDSTONE",
    collectionLevel: 4,
    npcPrice: 160,
    superNpcPrice: 25600
  }
];

export const ROMAN_NUMERALS: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X"
};
