import { Tournament, UserWallet } from '../types';

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 't-sponsored-daily',
    title: 'جام سرعت عمل روزانه (اسپانسری)',
    subtitle: 'ورود کاملاً رایگان با تماشای ویدیوی تبلیغاتی حامی مالی',
    category: 'sponsored',
    entryFee: 0,
    prizePool: 1500000,
    firstPrize: 800000,
    secondPrize: 450000,
    thirdPrize: 250000,
    participantsCount: 142,
    maxParticipants: 250,
    endsInSeconds: 7420,
    badge: 'ورود رایگان با تبلیغ',
    sponsorName: 'فروشگاه آنلاین دیجی‌استار (اسپانسر رسمی)',
    sponsorBanner: 'تخفیف ویژه ۳۰ درصدی لوازم گیمینگ و موبایل',
    leaderboard: [
      { rank: 1, username: 'سروش_تندرو', avatar: '⚡', score: 4820, prize: 800000, timeAgo: '۱۰ دقیقه پیش' },
      { rank: 2, username: 'آرش_تک‌تیرانداز', avatar: '🎯', score: 4590, prize: 450000, timeAgo: '۲۲ دقیقه پیش' },
      { rank: 3, username: 'پریا_گیمر', avatar: '👑', score: 4410, prize: 250000, timeAgo: '۳۵ دقیقه پیش' },
      { rank: 4, username: 'شاهین_سریع', avatar: '🦅', score: 4180, timeAgo: '۴۰ دقیقه پیش' },
      { rank: 5, username: 'مبینا_مسترز', avatar: '🌟', score: 3950, timeAgo: '۱ ساعت پیش' },
      { rank: 6, username: 'علی_کوبنده', avatar: '🔥', score: 3820, timeAgo: '۱ ساعت پیش' },
      { rank: 7, username: 'نیما_واکنش', avatar: '🚀', score: 3650, timeAgo: '۲ ساعت پیش' },
    ]
  },
  {
    id: 't-turbo-rapid',
    title: 'چالش توربو سریع ۱۰ نفره',
    subtitle: 'رقابت فشرده و اهدای آنی جوایز پس از تکمیل ظرفیت',
    category: 'rapid',
    entryFee: 15000,
    prizePool: 135000,
    firstPrize: 90000,
    secondPrize: 45000,
    thirdPrize: 0,
    participantsCount: 7,
    maxParticipants: 10,
    endsInSeconds: 1450,
    badge: 'ظرفیت رو به اتمام',
    leaderboard: [
      { rank: 1, username: 'ارسلان_جت', avatar: '🌪️', score: 4350, prize: 90000, timeAgo: '۳ دقیقه پیش' },
      { rank: 2, username: 'امیر_توربو', avatar: '⚡', score: 4120, prize: 45000, timeAgo: '۶ دقیقه پیش' },
      { rank: 3, username: 'رها_اسپید', avatar: '🐆', score: 3900, timeAgo: '۹ دقیقه پیش' },
      { rank: 4, username: 'سینا_سایبر', avatar: '🎮', score: 3740, timeAgo: '۱۴ دقیقه پیش' },
    ]
  },
  {
    id: 't-golden-championship',
    title: 'جام قهرمانان لیگ طلایی',
    subtitle: 'استخر جایزه بزرگ میلیونی با رقابت برترین بازیکنان کشور',
    category: 'championship',
    entryFee: 50000,
    prizePool: 1800000,
    firstPrize: 1000000,
    secondPrize: 500000,
    thirdPrize: 300000,
    participantsCount: 36,
    maxParticipants: 50,
    endsInSeconds: 18300,
    badge: 'جایزه ویژه ۱,۰۰۰,۰۰۰ تومانی',
    sponsorName: 'کافه گیم آرنا',
    leaderboard: [
      { rank: 1, username: 'افسانه_سرعت', avatar: '🏆', score: 5310, prize: 1000000, timeAgo: '۴۵ دقیقه پیش' },
      { rank: 2, username: 'رضا_ماتریکس', avatar: '🕶️', score: 5080, prize: 500000, timeAgo: '۱ ساعت پیش' },
      { rank: 3, username: 'یاسمن_ستاره', avatar: '✨', score: 4890, prize: 300000, timeAgo: '۲ ساعت پیش' },
      { rank: 4, username: 'بردیا_الکترو', avatar: '⚡', score: 4720, timeAgo: '۲ ساعت پیش' },
      { rank: 5, username: 'مهرداد_پرو', avatar: '🎖️', score: 4500, timeAgo: '۳ ساعت پیش' },
    ]
  },
  {
    id: 't-free-practice',
    title: 'میدان تمرین آزاد و گرم‌کردن دست',
    subtitle: 'بازی نامحدود رایگان بدون کسر ورودی برای ثبت رکورد شخصی',
    category: 'practice',
    entryFee: 0,
    prizePool: 0,
    firstPrize: 0,
    secondPrize: 0,
    thirdPrize: 0,
    participantsCount: 890,
    maxParticipants: 10000,
    endsInSeconds: 86400,
    badge: 'تمرین رایگان',
    leaderboard: [
      { rank: 1, username: 'سروش_تندرو', avatar: '⚡', score: 5600, timeAgo: 'امروز' },
      { rank: 2, username: 'شما (رکورد شخصی)', avatar: '😎', score: 0, isUser: true, timeAgo: 'ثبت نشده' },
      { rank: 3, username: 'شهاب_صاعقه', avatar: '☄️', score: 4900, timeAgo: 'امروز' },
    ]
  }
];

export const INITIAL_USER_WALLET: UserWallet = {
  balance: 65000, // 65,000 Tomans default starter balance for testing
  freeTickets: 2, // 2 free ad tickets
  totalWinnings: 135000,
  tournamentsPlayed: 4,
  bestScore: 3840,
  username: 'قهرمان_مهارتی',
  avatar: '🦁',
  transactions: [
    {
      id: 'tx-101',
      type: 'deposit',
      amount: 50000,
      description: 'شارژ کیف پول (درگاه پرداخت شتاب)',
      date: 'دیروز، ساعت ۱۶:۲۰',
      status: 'completed'
    },
    {
      id: 'tx-102',
      type: 'win',
      amount: 90000,
      description: 'جایزه مقام اول چالش توربو سریع ۱۰ نفره',
      date: 'دیروز، ساعت ۱۸:۴۵',
      status: 'completed'
    },
    {
      id: 'tx-103',
      type: 'entry',
      amount: -15000,
      description: 'هزینه ورودی چالش توربو سریع',
      date: 'دیروز، ساعت ۱۸:۳۰',
      status: 'completed'
    },
    {
      id: 'tx-104',
      type: 'ad_reward',
      amount: 0,
      description: 'دریافت ۱ بلیت رایگان با تماشای تبلیغ اسپانسر',
      date: 'امروز، ساعت ۰۹:۱۵',
      status: 'completed'
    }
  ]
};

export const SPONSOR_ADS = [
  {
    id: 'ad-1',
    brand: 'دیجی‌استار | تجهیزات گیمینگ و موبایل',
    headline: 'هندزفری گیمینگ با تاخیر صدای صفر میلی‌ثانیه',
    body: 'با تخفیف ویژه ۴۰٪ اختصاصی شرکت‌کنندگان جام قهرمانان مهارتی! ارسال رایگان به سراسر کشور.',
    cta: 'مشاهده پیشنهاد تخفیف‌دار',
    tag: 'اسپانسر رسمی لیگ',
    icon: '🎧',
    bgColor: 'from-amber-500/20 to-orange-600/10'
  },
  {
    id: 'ad-2',
    brand: 'کافه بازی و اسنک توربو',
    headline: 'پاتوق اختصاصی گیمرهای مسابقات مهارتی',
    body: 'سفارش آنلاین نوشیدنی‌های انرژی‌زا و اسنک گرم با کد تخفیف SKILL30 در شهر شما.',
    cta: 'دریافت کد تخفیف ۳۰٪',
    tag: 'حامی سلامت و تمرکز',
    icon: '⚡',
    bgColor: 'from-cyan-500/20 to-blue-600/10'
  }
];
