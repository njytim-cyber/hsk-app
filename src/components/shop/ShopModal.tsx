import { useState } from 'react'
import { SHOP_CATEGORIES, getItemsByCategory } from '../../data/shopItems'
import type { ShopItem } from '../../data/types'
import './ShopModal.css'

interface Props {
    coins: number
    purchasedItems: string[]
    onPurchase: (item: ShopItem) => void
    onClose: () => void
}

export default function ShopModal({ coins, purchasedItems, onPurchase, onClose }: Props) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [justBought, setJustBought] = useState<string | null>(null)

    const items = getItemsByCategory(activeCategory)
    const owns = (id: string) => purchasedItems.includes(id)

    const handleBuy = (item: ShopItem) => {
        if (coins < item.price || (owns(item.id) && !item.stackable)) return
        onPurchase(item)
        setJustBought(item.id)
        setTimeout(() => setJustBought(null), 600)
    }

    return (
        <div className="shop-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
        }}>
            <div className="shop-modal">
                {/* Header */}
                <div className="shop-header">
                    <button className="shop-close-btn" onClick={onClose}>❮</button>
                    <h2 className="shop-title">商店</h2>
                    <div className="shop-coins">🪙 {coins}</div>
                </div>

                {/* Category tabs */}
                <div className="shop-tabs">
                    {SHOP_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`shop-tab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span className="tab-icon">{cat.icon}</span>
                            <span className="tab-label">{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Item grid */}
                <div className="shop-items">
                    {items.map((item, i) => {
                        const owned = owns(item.id)
                        const canBuy = coins >= item.price && (!owned || item.stackable)
                        const wasBought = justBought === item.id

                        return (
                            <button
                                key={item.id}
                                className={`shop-item ${owned ? 'owned' : ''} ${wasBought ? 'animate-stamp' : ''}`}
                                style={{ animationDelay: `${i * 30}ms` }}
                                disabled={!canBuy && !owned}
                                onClick={() => handleBuy(item)}
                            >
                                <span className="item-icon">{item.icon}</span>
                                <span className="item-name">{item.name}</span>
                                <span className="item-desc">{item.description}</span>
                                <span className="item-price">
                                    {owned && !item.stackable
                                        ? '✓ 已拥有'
                                        : `🪙 ${item.price}`
                                    }
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
