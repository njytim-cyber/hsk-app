import { AZURE_VOICES, type AzureVoiceId } from '../../hooks/useAzureTTS'
import { indexToPosition } from '../../hooks/useAvatar'
import { useSettings } from '../../contexts/SettingsContext'
import { useAudio } from '../../contexts/AudioContext'
import './VoicePicker.css'

export function VoicePicker() {
    const { voiceId, update } = useSettings()
    const { speak } = useAudio()
    const selected = voiceId || 'zh-CN-XiaoxiaoNeural'

    const handleSelect = (id: AzureVoiceId) => {
        update('voiceId', id)
        // Preview with the character's name
        const voice = AZURE_VOICES.find(v => v.id === id)
        if (voice) speak(`你好，我是${voice.name.split(' ')[0]}`)
    }

    return (
        <div className="voice-picker">
            <h3 className="voice-picker-title">选择声音</h3>
            <p className="voice-picker-subtitle">Choose a voice for pronunciation</p>
            <div className="voice-grid">
                {AZURE_VOICES.map(voice => {
                    const pos = indexToPosition(voice.avatarIndex)
                    return (
                        <button
                            key={voice.id}
                            className={`voice-option ${selected === voice.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(voice.id)}
                        >
                            <div
                                className="voice-avatar-sprite"
                                style={{
                                    backgroundImage: `url('/avatars.webp')`,
                                    backgroundSize: '800% 800%',
                                    backgroundPosition: `${pos.posX}% ${pos.posY}%`,
                                }}
                            />
                            <span className="voice-name">{voice.name}</span>
                            <span className="voice-desc">{voice.description}</span>
                            <div className="voice-tags">
                                {voice.tags.map(tag => (
                                    <span key={tag} className="voice-tag">{tag}</span>
                                ))}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
