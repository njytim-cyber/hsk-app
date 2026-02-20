/**
 * Shop Items — Ported from chinese-tingxie
 * 4 categories: appearance, powerup, tool, content
 */
import type { ShopItem } from './types'

export const SHOP_ITEMS: ShopItem[] = [
    // ── Appearance (Cosmetic) ──
    { id: 'ink_gold', name: '金墨', description: '书写时使用金色墨水', price: 200, type: 'cosmetic', category: 'appearance', icon: '✨' },
    { id: 'ink_jade', name: '翡翠墨', description: '书写时使用翡翠绿墨水', price: 200, type: 'cosmetic', category: 'appearance', icon: '🟢' },
    { id: 'ink_cinnabar', name: '朱砂墨', description: '书写时使用朱红色墨水', price: 200, type: 'cosmetic', category: 'appearance', icon: '🔴' },
    { id: 'ink_purple', name: '紫墨', description: '书写时使用紫色墨水', price: 250, type: 'cosmetic', category: 'appearance', icon: '🟣' },
    { id: 'ink_rainbow', name: '彩虹墨', description: '书写时使用渐变彩虹色', price: 500, type: 'cosmetic', category: 'appearance', icon: '🌈' },
    { id: 'border_gold', name: '金边框', description: '字格使用精美金色边框', price: 300, type: 'cosmetic', category: 'appearance', icon: '🏅' },
    { id: 'border_jade', name: '翡翠边框', description: '字格使用翡翠绿边框', price: 300, type: 'cosmetic', category: 'appearance', icon: '💎' },
    { id: 'texture_bamboo', name: '竹纸', description: '竹编纹理的书写背景', price: 350, type: 'cosmetic', category: 'appearance', icon: '🎋' },
    { id: 'texture_silk', name: '丝绸', description: '丝绸质感的书写背景', price: 400, type: 'cosmetic', category: 'appearance', icon: '🧶' },
    { id: 'anim_sparkle', name: '星光特效', description: '完成时星光闪烁效果', price: 450, type: 'cosmetic', category: 'appearance', icon: '💫' },
    { id: 'anim_petals', name: '花瓣飘落', description: '完成时花瓣飘落效果', price: 450, type: 'cosmetic', category: 'appearance', icon: '🌸' },
    { id: 'anim_fireworks', name: '烟花', description: '满分时烟花庆祝效果', price: 600, type: 'cosmetic', category: 'appearance', icon: '🎆' },

    // ── Power-ups (Consumable) ──
    { id: 'hint_pinyin', name: '拼音提示', description: '显示一个字的拼音提示', price: 30, type: 'consumable', category: 'powerup', icon: '💡', stackable: true },
    { id: 'hint_stroke', name: '笔画提示', description: '显示下一笔的位置', price: 50, type: 'consumable', category: 'powerup', icon: '✏️', stackable: true },
    { id: 'hint_outline', name: '轮廓提示', description: '显示整个字的轮廓', price: 40, type: 'consumable', category: 'powerup', icon: '🔍', stackable: true },
    { id: 'xp_boost_2x', name: '双倍经验', description: '下一次练习获得双倍XP', price: 100, type: 'consumable', category: 'powerup', icon: '⚡', stackable: true },
    { id: 'xp_boost_3x', name: '三倍经验', description: '下一次练习获得三倍XP', price: 200, type: 'consumable', category: 'powerup', icon: '🔥', stackable: true },
    { id: 'shield', name: '护盾', description: '一次错误不计入统计', price: 80, type: 'consumable', category: 'powerup', icon: '🛡️', stackable: true },
    { id: 'time_extend', name: '延时', description: '测验时间延长30秒', price: 60, type: 'consumable', category: 'powerup', icon: '⏰', stackable: true },
    { id: 'hint_bundle_5', name: '提示包x5', description: '5个拼音提示打包优惠', price: 120, type: 'consumable', category: 'powerup', icon: '📦', stackable: true },

    // ── Tools (Permanent) ──
    { id: 'tool_stats', name: '详细统计', description: '解锁高级学习统计面板', price: 500, type: 'permanent', category: 'tool', icon: '📊' },
    { id: 'tool_speed', name: '速度模式', description: '解锁限时速度挑战模式', price: 600, type: 'permanent', category: 'tool', icon: '⚡' },
    { id: 'tool_dark', name: '夜间模式', description: '解锁深色主题', price: 400, type: 'permanent', category: 'tool', icon: '🌙' },
    { id: 'tool_export', name: '导出数据', description: '导出学习进度为PDF', price: 300, type: 'permanent', category: 'tool', icon: '📤' },
    { id: 'tool_review', name: '自定义复习', description: '自由选择复习词汇范围', price: 500, type: 'permanent', category: 'tool', icon: '🎯' },

    // ── Content (Unlockable) ──
    { id: 'content_idioms', name: '成语包', description: '50个常用四字成语', price: 800, type: 'content', category: 'content', icon: '📜' },
    { id: 'content_poems', name: '唐诗包', description: '20首经典唐诗', price: 1000, type: 'content', category: 'content', icon: '🏯' },
    { id: 'content_radicals', name: '偏旁部首', description: '214个常用偏旁部首', price: 600, type: 'content', category: 'content', icon: '🔤' },
    { id: 'content_calligraphy', name: '书法欣赏', description: '名家书法作品集', price: 1200, type: 'content', category: 'content', icon: '🖌️' },
    { id: 'content_culture', name: '文化常识', description: '中国传统文化小课堂', price: 700, type: 'content', category: 'content', icon: '🏮' },
]

/** Get items by category */
export function getItemsByCategory(category: string): ShopItem[] {
    if (category === 'all') return SHOP_ITEMS
    return SHOP_ITEMS.filter(item => item.category === category)
}

/** Get item by ID */
export function getItemById(id: string): ShopItem | undefined {
    return SHOP_ITEMS.find(item => item.id === id)
}

/** Shop categories with Chinese names */
export const SHOP_CATEGORIES = [
    { id: 'all', name: '全部', icon: '🏪' },
    { id: 'appearance', name: '外观', icon: '🎨' },
    { id: 'powerup', name: '道具', icon: '⚡' },
    { id: 'tool', name: '工具', icon: '🔧' },
    { id: 'content', name: '内容', icon: '📚' },
] as const
