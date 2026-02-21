/**
 * HSK 4 Video Lesson Units — 10 Themes, 37 Target Phrases
 * Each unit has one practice sentence using 3–4 HSK 4 target phrases.
 * Videos are placeholders — videoDescription describes the intended video.
 */

import type { VideoLessonConfig } from './videoLessonData'

export interface LessonUnit {
    id: string
    emoji: string
    title: string
    titleEn: string
    lesson: VideoLessonConfig
}

export const lessonUnits: LessonUnit[] = [
    // ──────────────────────────────────────────────
    // Unit 1: Perseverance & Success (existing POC)
    // ──────────────────────────────────────────────
    {
        id: 'perseverance',
        emoji: '',
        title: '坚持与成功',
        titleEn: 'Perseverance & Success',
        lesson: {
            id: 'hsk4-perseverance',
            title: '坚持与成功',
            titleEn: 'Perseverance & Success',
            hskLevel: 4,
            videoSrc: '/videos/short-video-poc.mp4',
            videoDescription: 'A young athlete training for a marathon in the rain. Voiceover about never giving up.',
            sentence: '只要坚持不放弃，你最后一定会成功的。',
            sentenceEn: 'As long as you persist and don\'t give up, you will definitely succeed.',
            words: [
                { hanzi: '只要', pinyin: 'zhǐyào', english: 'as long as', startTime: 0.5, endTime: 1.5 },
                { hanzi: '坚持', pinyin: 'jiānchí', english: 'persist', startTime: 1.5, endTime: 2.5, isTarget: true },
                { hanzi: '不', pinyin: 'bù', english: 'not', startTime: 2.5, endTime: 3.0 },
                { hanzi: '放弃', pinyin: 'fàngqì', english: 'give up', startTime: 3.0, endTime: 4.0, isTarget: true },
                { hanzi: '，', pinyin: '', english: '', startTime: 4.0, endTime: 4.2 },
                { hanzi: '你', pinyin: 'nǐ', english: 'you', startTime: 4.2, endTime: 4.8 },
                { hanzi: '最后', pinyin: 'zuìhòu', english: 'in the end', startTime: 4.8, endTime: 5.6 },
                { hanzi: '一定会', pinyin: 'yídìng huì', english: 'will definitely', startTime: 5.6, endTime: 6.8 },
                { hanzi: '成功', pinyin: 'chénggōng', english: 'succeed', startTime: 6.8, endTime: 7.8, isTarget: true },
                { hanzi: '的', pinyin: 'de', english: '(particle)', startTime: 7.8, endTime: 8.2 },
                { hanzi: '。', pinyin: '', english: '', startTime: 8.2, endTime: 8.5 },
            ],
            writingTarget: ['坚', '持', '放', '弃', '成', '功'],
            scrambleAnswer: ['只要', '坚持', '不', '放弃', '，', '你', '最后', '一定会', '成功', '的', '。'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 2: Feelings & Emotions
    // ──────────────────────────────────────────────
    {
        id: 'emotions',
        emoji: '',
        title: '感受与情感',
        titleEn: 'Feelings & Emotions',
        lesson: {
            id: 'hsk4-emotions',
            title: '感受与情感',
            titleEn: 'Feelings & Emotions',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'A graduation ceremony. A student hugs their parents, tears of joy. Monologue reflecting on the emotional journey.',
            sentence: '看到他的努力，我很感动，也不再难过了。',
            sentenceEn: 'Seeing his effort, I was moved, and no longer felt sad.',
            words: [
                { hanzi: '看到', pinyin: 'kàndào', english: 'see', startTime: 0, endTime: 1 },
                { hanzi: '他的', pinyin: 'tā de', english: 'his', startTime: 1, endTime: 1.5 },
                { hanzi: '努力', pinyin: 'nǔlì', english: 'effort', startTime: 1.5, endTime: 2.5 },
                { hanzi: '，', pinyin: '', english: '', startTime: 2.5, endTime: 2.7 },
                { hanzi: '我', pinyin: 'wǒ', english: 'I', startTime: 2.7, endTime: 3.0 },
                { hanzi: '很', pinyin: 'hěn', english: 'very', startTime: 3.0, endTime: 3.4 },
                { hanzi: '感动', pinyin: 'gǎndòng', english: 'moved', startTime: 3.4, endTime: 4.2, isTarget: true },
                { hanzi: '，', pinyin: '', english: '', startTime: 4.2, endTime: 4.4 },
                { hanzi: '也', pinyin: 'yě', english: 'also', startTime: 4.4, endTime: 4.8 },
                { hanzi: '不再', pinyin: 'bú zài', english: 'no longer', startTime: 4.8, endTime: 5.4 },
                { hanzi: '难过', pinyin: 'nánguò', english: 'sad', startTime: 5.4, endTime: 6.2, isTarget: true },
                { hanzi: '了', pinyin: 'le', english: '(particle)', startTime: 6.2, endTime: 6.5 },
                { hanzi: '。', pinyin: '', english: '', startTime: 6.5, endTime: 6.8 },
            ],
            writingTarget: ['感', '动', '难', '过'],
            scrambleAnswer: ['看到', '他的', '努力', '，', '我', '很', '感动', '，', '也', '不再', '难过', '了', '。'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 3: Travel & Transport
    // ──────────────────────────────────────────────
    {
        id: 'travel',
        emoji: '',
        title: '旅游与交通',
        titleEn: 'Travel & Transport',
        lesson: {
            id: 'hsk4-travel',
            title: '旅游与交通',
            titleEn: 'Travel & Transport',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'A traveler checking in at an airport counter. Close-up of passport, boarding pass, luggage on conveyor belt.',
            sentence: '请带好你的护照和行李，航班马上要起飞了。',
            sentenceEn: 'Please bring your passport and luggage, the flight is about to take off.',
            words: [
                { hanzi: '请', pinyin: 'qǐng', english: 'please', startTime: 0, endTime: 0.6 },
                { hanzi: '带好', pinyin: 'dài hǎo', english: 'bring', startTime: 0.6, endTime: 1.2 },
                { hanzi: '你的', pinyin: 'nǐ de', english: 'your', startTime: 1.2, endTime: 1.6 },
                { hanzi: '护照', pinyin: 'hùzhào', english: 'passport', startTime: 1.6, endTime: 2.4, isTarget: true },
                { hanzi: '和', pinyin: 'hé', english: 'and', startTime: 2.4, endTime: 2.7 },
                { hanzi: '行李', pinyin: 'xínglǐ', english: 'luggage', startTime: 2.7, endTime: 3.5, isTarget: true },
                { hanzi: '，', pinyin: '', english: '', startTime: 3.5, endTime: 3.7 },
                { hanzi: '航班', pinyin: 'hángbān', english: 'flight', startTime: 3.7, endTime: 4.5, isTarget: true },
                { hanzi: '马上', pinyin: 'mǎshàng', english: 'immediately', startTime: 4.5, endTime: 5.2 },
                { hanzi: '要', pinyin: 'yào', english: 'about to', startTime: 5.2, endTime: 5.5 },
                { hanzi: '起飞', pinyin: 'qǐfēi', english: 'take off', startTime: 5.5, endTime: 6.2 },
                { hanzi: '了', pinyin: 'le', english: '(particle)', startTime: 6.2, endTime: 6.5 },
                { hanzi: '。', pinyin: '', english: '', startTime: 6.5, endTime: 6.8 },
            ],
            writingTarget: ['护', '照', '行', '李', '航', '班'],
            scrambleAnswer: ['请', '带好', '你的', '护照', '和', '行李', '，', '航班', '马上', '要', '起飞', '了', '。'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 4: Health & Body
    // ──────────────────────────────────────────────
    {
        id: 'health',
        emoji: '🏃',
        title: '健康与身体',
        titleEn: 'Health & Body',
        lesson: {
            id: 'hsk4-health',
            title: '健康与身体',
            titleEn: 'Health & Body',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'A woman jogging in a park at sunrise. She pauses to stretch. Voiceover about building healthy habits.',
            sentence: '如果你想减肥，就应该每天锻炼身体。',
            sentenceEn: 'If you want to lose weight, you should exercise every day.',
            words: [
                { hanzi: '如果', pinyin: 'rúguǒ', english: 'if', startTime: 0, endTime: 0.8 },
                { hanzi: '你', pinyin: 'nǐ', english: 'you', startTime: 0.8, endTime: 1.1 },
                { hanzi: '想', pinyin: 'xiǎng', english: 'want to', startTime: 1.1, endTime: 1.5 },
                { hanzi: '减肥', pinyin: 'jiǎnféi', english: 'lose weight', startTime: 1.5, endTime: 2.3, isTarget: true },
                { hanzi: '，', pinyin: '', english: '', startTime: 2.3, endTime: 2.5 },
                { hanzi: '就', pinyin: 'jiù', english: 'then', startTime: 2.5, endTime: 2.8 },
                { hanzi: '应该', pinyin: 'yīnggāi', english: 'should', startTime: 2.8, endTime: 3.5 },
                { hanzi: '每天', pinyin: 'měitiān', english: 'every day', startTime: 3.5, endTime: 4.2 },
                { hanzi: '锻炼', pinyin: 'duànliàn', english: 'exercise', startTime: 4.2, endTime: 5.0, isTarget: true },
                { hanzi: '身体', pinyin: 'shēntǐ', english: 'body', startTime: 5.0, endTime: 5.8, isTarget: true },
                { hanzi: '。', pinyin: '', english: '', startTime: 5.8, endTime: 6.0 },
            ],
            writingTarget: ['减', '肥', '锻', '炼', '身', '体'],
            scrambleAnswer: ['如果', '你', '想', '减肥', '，', '就', '应该', '每天', '锻炼', '身体', '。'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 5: Work & Career
    // ──────────────────────────────────────────────
    {
        id: 'career',
        emoji: '',
        title: '工作与事业',
        titleEn: 'Work & Career',
        lesson: {
            id: 'hsk4-career',
            title: '工作与事业',
            titleEn: 'Work & Career',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'An office scene. A colleague announces they\'re leaving. Conversation between two coworkers about career plans.',
            sentence: '他辞职以后，打算找一份工资更高的工作。',
            sentenceEn: 'After he resigned, he plans to find a job with higher salary.',
            words: [
                { hanzi: '他', pinyin: 'tā', english: 'he', startTime: 0, endTime: 0.4 },
                { hanzi: '辞职', pinyin: 'cízhí', english: 'resign', startTime: 0.4, endTime: 1.2, isTarget: true },
                { hanzi: '以后', pinyin: 'yǐhòu', english: 'after', startTime: 1.2, endTime: 1.8 },
                { hanzi: '，', pinyin: '', english: '', startTime: 1.8, endTime: 2.0 },
                { hanzi: '打算', pinyin: 'dǎsuàn', english: 'plan to', startTime: 2.0, endTime: 2.7 },
                { hanzi: '找', pinyin: 'zhǎo', english: 'find', startTime: 2.7, endTime: 3.1 },
                { hanzi: '一份', pinyin: 'yí fèn', english: 'a (measure word)', startTime: 3.1, endTime: 3.6 },
                { hanzi: '工资', pinyin: 'gōngzī', english: 'salary', startTime: 3.6, endTime: 4.3, isTarget: true },
                { hanzi: '更高的', pinyin: 'gèng gāo de', english: 'higher', startTime: 4.3, endTime: 5.0 },
                { hanzi: '工作', pinyin: 'gōngzuò', english: 'job', startTime: 5.0, endTime: 5.7 },
                { hanzi: '。', pinyin: '', english: '', startTime: 5.7, endTime: 6.0 },
            ],
            writingTarget: ['辞', '职', '工', '资'],
            scrambleAnswer: ['他', '辞职', '以后', '，', '打算', '找', '一份', '工资', '更高的', '工作', '。'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 6: Education & Learning
    // ──────────────────────────────────────────────
    {
        id: 'education',
        emoji: '',
        title: '教育与学习',
        titleEn: 'Education & Learning',
        lesson: {
            id: 'hsk4-education',
            title: '教育与学习',
            titleEn: 'Education & Learning',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'A university campus. Students walking to class, studying in the library. Narrator talks about the joy of gaining knowledge.',
            sentence: '毕业以后，她想继续研究中国的语言和文化。',
            sentenceEn: 'After graduation, she wants to continue researching Chinese language and culture.',
            words: [
                { hanzi: '毕业', pinyin: 'bìyè', english: 'graduate', startTime: 0, endTime: 0.8, isTarget: true },
                { hanzi: '以后', pinyin: 'yǐhòu', english: 'after', startTime: 0.8, endTime: 1.3 },
                { hanzi: '，', pinyin: '', english: '', startTime: 1.3, endTime: 1.5 },
                { hanzi: '她', pinyin: 'tā', english: 'she', startTime: 1.5, endTime: 1.8 },
                { hanzi: '想', pinyin: 'xiǎng', english: 'want to', startTime: 1.8, endTime: 2.2 },
                { hanzi: '继续', pinyin: 'jìxù', english: 'continue', startTime: 2.2, endTime: 2.9 },
                { hanzi: '研究', pinyin: 'yánjiū', english: 'research', startTime: 2.9, endTime: 3.7, isTarget: true },
                { hanzi: '中国的', pinyin: 'zhōngguó de', english: 'Chinese', startTime: 3.7, endTime: 4.4 },
                { hanzi: '语言', pinyin: 'yǔyán', english: 'language', startTime: 4.4, endTime: 5.1 },
                { hanzi: '和', pinyin: 'hé', english: 'and', startTime: 5.1, endTime: 5.3 },
                { hanzi: '文化', pinyin: 'wénhuà', english: 'culture', startTime: 5.3, endTime: 6.0, isTarget: true },
                { hanzi: '。', pinyin: '', english: '', startTime: 6.0, endTime: 6.3 },
            ],
            writingTarget: ['毕', '业', '研', '究', '文', '化'],
            scrambleAnswer: ['毕业', '以后', '，', '她', '想', '继续', '研究', '中国的', '语言', '和', '文化', '。'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 7: Daily Life & Home
    // ──────────────────────────────────────────────
    {
        id: 'daily-life',
        emoji: '',
        title: '日常生活',
        titleEn: 'Daily Life',
        lesson: {
            id: 'hsk4-daily-life',
            title: '日常生活',
            titleEn: 'Daily Life',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'A family cleaning their apartment on a weekend morning. Mom and dad divide chores while kids help out.',
            sentence: '周末的时候，我们要打扫房间、整理衣服。',
            sentenceEn: 'On weekends, we need to clean the room and organize clothes.',
            words: [
                { hanzi: '周末', pinyin: 'zhōumò', english: 'weekend', startTime: 0, endTime: 0.7 },
                { hanzi: '的', pinyin: 'de', english: '(particle)', startTime: 0.7, endTime: 0.9 },
                { hanzi: '时候', pinyin: 'shíhou', english: 'time', startTime: 0.9, endTime: 1.5 },
                { hanzi: '，', pinyin: '', english: '', startTime: 1.5, endTime: 1.7 },
                { hanzi: '我们', pinyin: 'wǒmen', english: 'we', startTime: 1.7, endTime: 2.2 },
                { hanzi: '要', pinyin: 'yào', english: 'need to', startTime: 2.2, endTime: 2.5 },
                { hanzi: '打扫', pinyin: 'dǎsǎo', english: 'clean', startTime: 2.5, endTime: 3.3, isTarget: true },
                { hanzi: '房间', pinyin: 'fángjiān', english: 'room', startTime: 3.3, endTime: 4.0 },
                { hanzi: '、', pinyin: '', english: '', startTime: 4.0, endTime: 4.1 },
                { hanzi: '整理', pinyin: 'zhěnglǐ', english: 'organize', startTime: 4.1, endTime: 4.9, isTarget: true },
                { hanzi: '衣服', pinyin: 'yīfu', english: 'clothes', startTime: 4.9, endTime: 5.6, isTarget: true },
                { hanzi: '。', pinyin: '', english: '', startTime: 5.6, endTime: 5.9 },
            ],
            writingTarget: ['打', '扫', '整', '理', '衣', '服'],
            scrambleAnswer: ['周末', '的', '时候', '，', '我们', '要', '打扫', '房间', '、', '整理', '衣服', '。'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 8: Shopping & Money
    // ──────────────────────────────────────────────
    {
        id: 'shopping',
        emoji: '',
        title: '购物与消费',
        titleEn: 'Shopping & Money',
        lesson: {
            id: 'hsk4-shopping',
            title: '购物与消费',
            titleEn: 'Shopping & Money',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'A customer at a store examining a product. She discusses quality and price with the shopkeeper, asks about discounts.',
            sentence: '这件商品质量不好，我想退货，能打折吗？',
            sentenceEn: 'This product\'s quality is bad, I want to return it. Can I get a discount?',
            words: [
                { hanzi: '这件', pinyin: 'zhè jiàn', english: 'this (item)', startTime: 0, endTime: 0.6 },
                { hanzi: '商品', pinyin: 'shāngpǐn', english: 'product', startTime: 0.6, endTime: 1.3 },
                { hanzi: '质量', pinyin: 'zhìliàng', english: 'quality', startTime: 1.3, endTime: 2.1, isTarget: true },
                { hanzi: '不好', pinyin: 'bù hǎo', english: 'not good', startTime: 2.1, endTime: 2.7 },
                { hanzi: '，', pinyin: '', english: '', startTime: 2.7, endTime: 2.9 },
                { hanzi: '我', pinyin: 'wǒ', english: 'I', startTime: 2.9, endTime: 3.2 },
                { hanzi: '想', pinyin: 'xiǎng', english: 'want to', startTime: 3.2, endTime: 3.5 },
                { hanzi: '退货', pinyin: 'tuìhuò', english: 'return goods', startTime: 3.5, endTime: 4.3, isTarget: true },
                { hanzi: '，', pinyin: '', english: '', startTime: 4.3, endTime: 4.5 },
                { hanzi: '能', pinyin: 'néng', english: 'can', startTime: 4.5, endTime: 4.8 },
                { hanzi: '打折', pinyin: 'dǎzhé', english: 'discount', startTime: 4.8, endTime: 5.5, isTarget: true },
                { hanzi: '吗', pinyin: 'ma', english: '(question)', startTime: 5.5, endTime: 5.8 },
                { hanzi: '？', pinyin: '', english: '', startTime: 5.8, endTime: 6.0 },
            ],
            writingTarget: ['质', '量', '退', '货', '打', '折'],
            scrambleAnswer: ['这件', '商品', '质量', '不好', '，', '我', '想', '退货', '，', '能', '打折', '吗', '？'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 9: Nature & Weather
    // ──────────────────────────────────────────────
    {
        id: 'nature',
        emoji: '',
        title: '自然与天气',
        titleEn: 'Nature & Weather',
        lesson: {
            id: 'hsk4-nature',
            title: '自然与天气',
            titleEn: 'Nature & Weather',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'Drone footage of a misty forest and mountains. Peaceful but showing subtle signs of pollution. Narrator reflects on protecting nature.',
            sentence: '森林的景色很美，可是污染越来越严重了。',
            sentenceEn: 'The forest scenery is beautiful, but pollution is getting worse and worse.',
            words: [
                { hanzi: '森林', pinyin: 'sēnlín', english: 'forest', startTime: 0, endTime: 0.8, isTarget: true },
                { hanzi: '的', pinyin: 'de', english: '(particle)', startTime: 0.8, endTime: 1.0 },
                { hanzi: '景色', pinyin: 'jǐngsè', english: 'scenery', startTime: 1.0, endTime: 1.8, isTarget: true },
                { hanzi: '很', pinyin: 'hěn', english: 'very', startTime: 1.8, endTime: 2.1 },
                { hanzi: '美', pinyin: 'měi', english: 'beautiful', startTime: 2.1, endTime: 2.6 },
                { hanzi: '，', pinyin: '', english: '', startTime: 2.6, endTime: 2.8 },
                { hanzi: '可是', pinyin: 'kěshì', english: 'but', startTime: 2.8, endTime: 3.4 },
                { hanzi: '污染', pinyin: 'wūrǎn', english: 'pollution', startTime: 3.4, endTime: 4.2, isTarget: true },
                { hanzi: '越来越', pinyin: 'yuèláiyuè', english: 'more and more', startTime: 4.2, endTime: 5.0 },
                { hanzi: '严重', pinyin: 'yánzhòng', english: 'serious', startTime: 5.0, endTime: 5.7 },
                { hanzi: '了', pinyin: 'le', english: '(particle)', startTime: 5.7, endTime: 6.0 },
                { hanzi: '。', pinyin: '', english: '', startTime: 6.0, endTime: 6.3 },
            ],
            writingTarget: ['森', '林', '景', '色', '污', '染'],
            scrambleAnswer: ['森林', '的', '景色', '很', '美', '，', '可是', '污染', '越来越', '严重', '了', '。'],
        },
    },

    // ──────────────────────────────────────────────
    // Unit 10: Relationships & Trust
    // ──────────────────────────────────────────────
    {
        id: 'relationships',
        emoji: '',
        title: '人际关系',
        titleEn: 'Relationships & Trust',
        lesson: {
            id: 'hsk4-relationships',
            title: '人际关系',
            titleEn: 'Relationships & Trust',
            hskLevel: 4,
            videoSrc: '',
            videoDescription: 'Two friends sit on a bench after an argument. One apologizes sincerely. Dialogue about trust and misunderstanding.',
            sentence: '这次的误会是我的错，我应该向你道歉。',
            sentenceEn: 'This misunderstanding was my fault, I should apologize to you.',
            words: [
                { hanzi: '这次的', pinyin: 'zhè cì de', english: 'this time\'s', startTime: 0, endTime: 0.8 },
                { hanzi: '误会', pinyin: 'wùhuì', english: 'misunderstanding', startTime: 0.8, endTime: 1.6, isTarget: true },
                { hanzi: '是', pinyin: 'shì', english: 'is', startTime: 1.6, endTime: 1.9 },
                { hanzi: '我的', pinyin: 'wǒ de', english: 'my', startTime: 1.9, endTime: 2.3 },
                { hanzi: '错', pinyin: 'cuò', english: 'fault', startTime: 2.3, endTime: 2.8 },
                { hanzi: '，', pinyin: '', english: '', startTime: 2.8, endTime: 3.0 },
                { hanzi: '我', pinyin: 'wǒ', english: 'I', startTime: 3.0, endTime: 3.3 },
                { hanzi: '应该', pinyin: 'yīnggāi', english: 'should', startTime: 3.3, endTime: 3.9 },
                { hanzi: '向', pinyin: 'xiàng', english: 'toward', startTime: 3.9, endTime: 4.2 },
                { hanzi: '你', pinyin: 'nǐ', english: 'you', startTime: 4.2, endTime: 4.5 },
                { hanzi: '道歉', pinyin: 'dàoqiàn', english: 'apologize', startTime: 4.5, endTime: 5.3, isTarget: true },
                { hanzi: '。', pinyin: '', english: '', startTime: 5.3, endTime: 5.5 },
            ],
            writingTarget: ['误', '会', '道', '歉'],
            scrambleAnswer: ['这次的', '误会', '是', '我的', '错', '，', '我', '应该', '向', '你', '道歉', '。'],
        },
    },
]
