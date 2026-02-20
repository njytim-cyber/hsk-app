/**
 * PinyinCharacter — Pinyin displayed above character in a grid
 * Ported from chinese-tingxie's char-box pattern
 */
import './PinyinCharacter.css'

interface Props {
    /** Chinese character(s) */
    hanzi: string
    /** Pinyin with tone marks */
    pinyin: string
    /** Whether pinyin is visible */
    showPinyin?: boolean
    /** Size variant */
    size?: 'sm' | 'md' | 'lg'
    /** Optional click handler */
    onClick?: () => void
}

export function PinyinCharacter({
    hanzi,
    pinyin,
    showPinyin = true,
    size = 'md',
    onClick,
}: Props) {
    return (
        <div
            className={`pinyin-char pinyin-char-${size}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <span className={`pc-pinyin ${showPinyin ? '' : 'pc-hidden'}`}>
                {pinyin}
            </span>
            <span className="pc-hanzi">{hanzi}</span>
        </div>
    )
}

/**
 * PinyinGrid — Display multiple characters with pinyin above each
 * Like chinese-tingxie's character-container
 */
interface GridProps {
    /** Array of character objects */
    characters: Array<{ hanzi: string; pinyin: string }>
    /** Whether pinyin is visible */
    showPinyin?: boolean
    /** Size variant */
    size?: 'sm' | 'md' | 'lg'
}

export function PinyinGrid({ characters, showPinyin = true, size = 'md' }: GridProps) {
    return (
        <div className="pinyin-grid">
            {characters.map((char, i) => (
                <PinyinCharacter
                    key={`${char.hanzi}-${i}`}
                    hanzi={char.hanzi}
                    pinyin={char.pinyin}
                    showPinyin={showPinyin}
                    size={size}
                />
            ))}
        </div>
    )
}
