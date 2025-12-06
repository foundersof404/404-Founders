import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
    Easing,
    Pressable,
    Image,
    Dimensions,
    ScrollView,
    Alert,
    Platform,
    Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface HomeScreenProps {
    userName: string;
}

const ACTION_CARD_WIDTH = 300;

// Theme Colors
const LIGHT_COLORS = {
    primaryBlue: '#1A73E8',
    deepBlue: '#0D47A1',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F7FA',
    text: '#000000',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    shadow: 'rgba(0,0,0,0.08)',
};

const DARK_COLORS = {
    primaryBlue: '#4A9EFF',
    deepBlue: '#1A73E8',
    background: '#1A1A1A',
    backgroundSecondary: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#3A3A3A',
    shadow: 'rgba(0,0,0,0.3)',
};

// Translation keys
const translations = {
    en: {
        // Navigation
        home: 'Home',
        scan: 'Scan',
        about: 'About',
        profile: 'Profile',
        
        // Common
        welcome: 'Welcome back',
        search: 'Search for products, SKUs or URLs',
        recommended: 'Recommended for you',
        recommendedSubtitle: 'AI-picked products based on your recent activity.',
        popularCategories: 'Popular categories',
        categoriesSubtitle: 'Quickly jump into key segments.',
        recentActivity: 'Recent activity',
        recentActivitySubtitle: 'Keep track of what you and your team just ran.',
        
        // Menu
        navigation: 'Navigation',
        account: 'Account',
        settings: 'Settings',
        subscriptions: 'Subscriptions',
        theme: 'Theme',
        language: 'Language',
        general: 'General',
        changePassword: 'Change password',
        twoFactorAuth: 'Two-factor auth',
        deleteAccount: 'Delete account',
        logout: 'Logout',
        light: 'Light',
        dark: 'Dark',
        english: 'English',
        arabic: 'العربية',
        
        // Scan
        scanProduct: 'Scan a product',
        scanSubtitle: 'Point your camera at a barcode or product label to start a new scan.',
        allowCamera: 'Allow camera access',
        cameraRequired: 'Camera access is required to scan products.',
        startScanning: 'Start scanning',
        recentScans: 'Recent scans',
        
        // Profile
        premiumUser: 'Premium user',
        personalDetails: 'Personal details',
        security: 'Security',
        notifications: 'Notifications',
        pushNotifications: 'Push notifications',
        emailUpdates: 'Email updates',
        privacy: 'Privacy',
        dataPermissions: 'Data & permissions',
        connectedApps: 'Connected apps',
        accessibility: 'Accessibility',
        reduceMotion: 'Reduce motion',
        
        // Action Cards
        smartScan: 'Smart Scan',
        smartScanSubtitle: 'Use AI to detect and compare prices instantly.',
        bulkUpload: 'Bulk Upload',
        bulkUploadSubtitle: 'Import a list of SKUs and let AI do the rest.',
        priceAlerts: 'Price Alerts',
        priceAlertsSubtitle: 'Get notified when prices move significantly.',
        
        // Categories
        smartphones: 'Smartphones',
        laptops: 'Laptops',
        accessories: 'Accessories',
        appliances: 'Appliances',
        
        // Recommended Items
        highConfidence: 'High confidence match across',
        retailers: 'retailers',
        bestMargin: 'Best margin opportunity right now.',
        recommendedTag: 'Recommended',
        opportunityTag: 'Opportunity',
        
        // Filters
        filters: 'Filters',
        priceRange: 'Price Range',
        location: 'Location',
        category: 'Category',
        availability: 'Availability',
        sortBy: 'Sort By',
        reset: 'Reset',
        applyFilters: 'Apply Filters',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
        preOrder: 'Pre-order',
        lowToHigh: 'Price: Low to High',
        highToLow: 'Price: High to Low',
        newest: 'Newest First',
        mostPopular: 'Most Popular',
        highestRated: 'Highest Rated',
        beirut: 'Beirut',
        tripoli: 'Tripoli',
        saida: 'Saidā',
        zahle: 'Zahlé',
        byblos: 'Byblos',
        outsideBeirut: 'Outside Beirut',
        mountLebanon: 'Mount Lebanon',
        northLebanon: 'North Lebanon',
        southLebanon: 'South Lebanon',
        bekaa: 'Bekaa',
        
        // Menu Navigation Items
        dashboard: 'Dashboard',
        scanProductMenu: 'Scan product',
        scanHistory: 'Scan history',
        favorites: 'Favorites',
        reports: 'Reports',
        
        // Profile
        since: 'Since',
        currentPlan: 'Current plan',
        upgradeProMax: 'Upgrade to Pro Max',
        manageBilling: 'Manage billing',
        invoices: 'Invoices',
        
        // About Page
        priceScanner: 'PriceScanner',
        findRealPrices: 'Find the real best prices. No lies, no tricks.',
        everyoneLying: 'Everyone is lying to you',
        everyoneLyingText: 'Every shop claims they have the "best prices." Every website says "check our website for the best prices." But the truth is, the best prices exist—just not where they tell you.',
        ourPurpose: 'Our Purpose',
        findActualPrices: 'We help you find the ACTUAL best prices',
        findActualPricesText: 'Different websites have different products at different prices. What one store calls "best price" might be 20% higher than another store. We scan across multiple retailers, compare real prices, and show you where you can actually save money.',
        howItWorks: 'How It Works',
        step1Title: 'Scan or Search',
        step1Text: 'Use your camera to scan a barcode, upload a product photo, or search by name or SKU.',
        step2Title: 'AI Matching',
        step2Text: 'Our AI matches your product across multiple retailers and websites in real-time.',
        step3Title: 'Compare Prices',
        step3Text: 'See all available prices side-by-side. We show you the real best deal, not marketing claims.',
        step4Title: 'Save Money',
        step4Text: 'Get price alerts, track deals, and never overpay again. The best price exists—we\'ll help you find it.',
        whyPriceScanner: 'Why PriceScanner?',
        noLies: 'No Lies',
        noLiesText: 'Real prices from real stores. No marketing tricks.',
        multipleStores: 'Multiple Stores',
        multipleStoresText: 'Compare prices across dozens of retailers instantly.',
        realTime: 'Real-Time',
        realTimeText: 'Get up-to-date prices and alerts as they change.',
        aiPowered: 'AI Powered',
        aiPoweredText: 'Smart matching and price prediction using AI.',
        bestPriceExists: 'The best price exists. We\'ll help you find it.',
        stopBelieving: 'Stop believing the marketing. Start saving real money.',
        
        // Activity Types
        scanned: 'Scanned',
        purchased: 'Purchased',
        searched: 'Searched',
        uploaded: 'Uploaded',
        newPriceAlert: 'New price alert',
        reportExported: 'Report exported',
        
        // Other
        scannerMenu: 'Scanner menu',
        products: 'products',
        bestDeals: 'best deals',
        found: 'found',
        dropped: 'dropped',
        by: 'by',
        deal: 'deal',
        deals: 'deals',
        priceDropped: 'Price dropped',
        weeklyPricing: 'Weekly pricing overview',
        minutesAgo: 'min ago',
        hourAgo: 'hour ago',
        yesterday: 'Yesterday',
        today: 'Today',
        
        // Notifications
        priceAlert: 'Price Alert',
        priceDroppedBy: 'price dropped by',
        at: 'at',
        newMatchFound: 'New Match Found',
        matchedAcross: 'matched across',
        scanComplete: 'Scan Complete',
        successfullyScanned: 'Successfully scanned',
        weeklyReport: 'Weekly Report',
        weeklyReportReady: 'Your weekly pricing report is ready',
        
        // Scan Alert
        alertBestPrices: 'Alert - We find the best prices for you',
    },
    ar: {
        // Navigation
        home: 'الرئيسية',
        scan: 'مسح',
        about: 'حول',
        profile: 'الملف الشخصي',
        
        // Common
        welcome: 'مرحباً بعودتك',
        search: 'ابحث عن المنتجات أو الرموز أو الروابط',
        recommended: 'موصى به لك',
        recommendedSubtitle: 'منتجات مختارة بالذكاء الاصطناعي بناءً على نشاطك الأخير.',
        popularCategories: 'الفئات الشائعة',
        categoriesSubtitle: 'انتقل بسرعة إلى الأقسام الرئيسية.',
        recentActivity: 'النشاط الأخير',
        recentActivitySubtitle: 'تابع ما أنت وفريقك قد نفذتموه للتو.',
        
        // Menu
        navigation: 'التنقل',
        account: 'الحساب',
        settings: 'الإعدادات',
        subscriptions: 'الاشتراكات',
        theme: 'المظهر',
        language: 'اللغة',
        general: 'عام',
        changePassword: 'تغيير كلمة المرور',
        twoFactorAuth: 'المصادقة الثنائية',
        deleteAccount: 'حذف الحساب',
        logout: 'تسجيل الخروج',
        light: 'فاتح',
        dark: 'داكن',
        english: 'English',
        arabic: 'العربية',
        
        // Scan
        scanProduct: 'مسح منتج',
        scanSubtitle: 'وجه الكاميرا إلى الباركود أو ملصق المنتج لبدء مسح جديد.',
        allowCamera: 'السماح بالوصول للكاميرا',
        cameraRequired: 'يتطلب الوصول إلى الكاميرا لمسح المنتجات.',
        startScanning: 'بدء المسح',
        recentScans: 'عمليات المسح الأخيرة',
        
        // Profile
        premiumUser: 'مستخدم مميز',
        personalDetails: 'التفاصيل الشخصية',
        security: 'الأمان',
        notifications: 'الإشعارات',
        pushNotifications: 'الإشعارات الفورية',
        emailUpdates: 'تحديثات البريد الإلكتروني',
        privacy: 'الخصوصية',
        dataPermissions: 'البيانات والصلاحيات',
        connectedApps: 'التطبيقات المتصلة',
        accessibility: 'إمكانية الوصول',
        reduceMotion: 'تقليل الحركة',
        
        // Action Cards
        smartScan: 'المسح الذكي',
        smartScanSubtitle: 'استخدم الذكاء الاصطناعي للكشف ومقارنة الأسعار فوراً.',
        bulkUpload: 'رفع مجمع',
        bulkUploadSubtitle: 'استيراد قائمة بالرموز واترك الذكاء الاصطناعي يقوم بالباقي.',
        priceAlerts: 'تنبيهات الأسعار',
        priceAlertsSubtitle: 'احصل على إشعارات عند تحرك الأسعار بشكل كبير.',
        
        // Categories
        smartphones: 'الهواتف الذكية',
        laptops: 'أجهزة اللابتوب',
        accessories: 'الملحقات',
        appliances: 'الأجهزة',
        
        // Recommended Items
        highConfidence: 'تطابق عالي الثقة عبر',
        retailers: 'تجار',
        bestMargin: 'أفضل فرصة هامش ربح الآن.',
        recommendedTag: 'موصى به',
        opportunityTag: 'فرصة',
        
        // Filters
        filters: 'المرشحات',
        priceRange: 'نطاق السعر',
        location: 'الموقع',
        category: 'الفئة',
        availability: 'التوفر',
        sortBy: 'ترتيب حسب',
        reset: 'إعادة تعيين',
        applyFilters: 'تطبيق المرشحات',
        inStock: 'متوفر',
        outOfStock: 'غير متوفر',
        preOrder: 'طلب مسبق',
        lowToHigh: 'السعر: من الأدنى إلى الأعلى',
        highToLow: 'السعر: من الأعلى إلى الأدنى',
        newest: 'الأحدث أولاً',
        mostPopular: 'الأكثر شيوعاً',
        highestRated: 'الأعلى تقييماً',
        beirut: 'بيروت',
        tripoli: 'طرابلس',
        saida: 'صيدا',
        zahle: 'زحلة',
        byblos: 'جبيل',
        outsideBeirut: 'خارج بيروت',
        mountLebanon: 'جبل لبنان',
        northLebanon: 'شمال لبنان',
        southLebanon: 'جنوب لبنان',
        bekaa: 'البقاع',
        
        // Menu Navigation Items
        dashboard: 'لوحة التحكم',
        scanProductMenu: 'مسح منتج',
        scanHistory: 'سجل المسح',
        favorites: 'المفضلة',
        reports: 'التقارير',
        
        // Profile
        since: 'منذ',
        currentPlan: 'الخطة الحالية',
        upgradeProMax: 'الترقية إلى Pro Max',
        manageBilling: 'إدارة الفواتير',
        invoices: 'الفواتير',
        
        // About Page
        priceScanner: 'PriceScanner',
        findRealPrices: 'اعثر على أفضل الأسعار الحقيقية. لا أكاذيب، لا خدع.',
        everyoneLying: 'الجميع يكذب عليك',
        everyoneLyingText: 'كل متجر يدعي أن لديه "أفضل الأسعار". كل موقع يقول "تحقق من موقعنا للحصول على أفضل الأسعار". لكن الحقيقة هي أن أفضل الأسعار موجودة - فقط ليس حيث يقولون لك.',
        ourPurpose: 'هدفنا',
        findActualPrices: 'نساعدك في العثور على أفضل الأسعار الفعلية',
        findActualPricesText: 'مواقع مختلفة لها منتجات بأسعار مختلفة. ما يسميه متجر واحد "أفضل سعر" قد يكون أعلى بنسبة 20% من متجر آخر. نحن نفحص عبر تجار متعددين، نقارن الأسعار الحقيقية، ونريك أين يمكنك توفير المال بالفعل.',
        howItWorks: 'كيف يعمل',
        step1Title: 'المسح أو البحث',
        step1Text: 'استخدم كاميرتك لمسح الباركود، أو ارفع صورة منتج، أو ابحث بالاسم أو الرمز.',
        step2Title: 'المطابقة بالذكاء الاصطناعي',
        step2Text: 'يقوم الذكاء الاصطناعي لدينا بمطابقة منتجك عبر تجار ومواقع متعددة في الوقت الفعلي.',
        step3Title: 'مقارنة الأسعار',
        step3Text: 'اطلع على جميع الأسعار المتاحة جنباً إلى جنب. نريك أفضل صفقة حقيقية، وليس ادعاءات التسويق.',
        step4Title: 'وفر المال',
        step4Text: 'احصل على تنبيهات الأسعار، تتبع الصفقات، ولا تدفع أكثر من اللازم مرة أخرى. أفضل سعر موجود - سنساعدك في العثور عليه.',
        whyPriceScanner: 'لماذا PriceScanner؟',
        noLies: 'لا أكاذيب',
        noLiesText: 'أسعار حقيقية من متاجر حقيقية. لا حيل تسويقية.',
        multipleStores: 'متاجر متعددة',
        multipleStoresText: 'قارن الأسعار عبر عشرات التجار في لحظة.',
        realTime: 'في الوقت الفعلي',
        realTimeText: 'احصل على أسعار محدثة وتنبيهات عند تغيرها.',
        aiPowered: 'مدعوم بالذكاء الاصطناعي',
        aiPoweredText: 'مطابقة ذكية وتنبؤ بالأسعار باستخدام الذكاء الاصطناعي.',
        bestPriceExists: 'أفضل سعر موجود. سنساعدك في العثور عليه.',
        stopBelieving: 'توقف عن تصديق التسويق. ابدأ في توفير المال الحقيقي.',
        
        // Activity Types
        scanned: 'تم المسح',
        purchased: 'تم الشراء',
        searched: 'تم البحث',
        uploaded: 'تم الرفع',
        newPriceAlert: 'تنبيه سعر جديد',
        reportExported: 'تم تصدير التقرير',
        
        // Other
        scannerMenu: 'قائمة الماسح',
        products: 'منتجات',
        bestDeals: 'أفضل الصفقات',
        found: 'تم العثور',
        dropped: 'انخفض',
        by: 'بنسبة',
        deal: 'صفقة',
        deals: 'صفقات',
        priceDropped: 'انخفض السعر',
        weeklyPricing: 'نظرة عامة على الأسعار الأسبوعية',
        minutesAgo: 'دقائق مضت',
        hourAgo: 'ساعة مضت',
        yesterday: 'أمس',
        today: 'اليوم',
        
        // Notifications
        priceAlert: 'تنبيه السعر',
        priceDroppedBy: 'انخفض السعر بنسبة',
        at: 'في',
        newMatchFound: 'تم العثور على تطابق جديد',
        matchedAcross: 'مطابق عبر',
        scanComplete: 'اكتمل المسح',
        successfullyScanned: 'تم المسح بنجاح',
        weeklyReport: 'تقرير أسبوعي',
        weeklyReportReady: 'تقرير الأسعار الأسبوعي الخاص بك جاهز',
        
        // Scan Alert
        alertBestPrices: 'تنبيه - نجد لك أفضل الأسعار',
    },
};

export function HomeScreen({ userName }: HomeScreenProps) {
    const insets = useSafeAreaInsets();
    const screenWidth = Dimensions.get('window').width;
    const drawerWidth = screenWidth * 0.75;
    const pageOpacity = useRef(new Animated.Value(0)).current;
    const pageTranslateY = useRef(new Animated.Value(10)).current;
    const welcomeOpacity = useRef(new Animated.Value(0)).current;
    const searchScale = useRef(new Animated.Value(1)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const actionScrollX = useRef(new Animated.Value(0)).current;

    const [activeNav, setActiveNav] = useState<'home' | 'scan' | 'about' | 'profile'>('home');
    
    // Animated values for navigation labels
    // Active tab: label hidden (opacity 0), inactive tabs: label visible (opacity 1)
    const homeLabelOpacity = useRef(new Animated.Value(0)).current; // home is active, so hidden
    const scanLabelOpacity = useRef(new Animated.Value(1)).current; // scan is inactive, so visible
    const aboutLabelOpacity = useRef(new Animated.Value(1)).current; // about is inactive, so visible
    const profileLabelOpacity = useRef(new Animated.Value(1)).current; // profile is inactive, so visible
    
    const homeLabelTranslateY = useRef(new Animated.Value(8)).current; // home label starts down (hidden)
    const scanLabelTranslateY = useRef(new Animated.Value(0)).current; // inactive labels start visible
    const aboutLabelTranslateY = useRef(new Animated.Value(0)).current;
    const profileLabelTranslateY = useRef(new Animated.Value(0)).current;
    
    // Animated values for page transitions
    const homePageOpacity = useRef(new Animated.Value(1)).current;
    const scanPageOpacity = useRef(new Animated.Value(0)).current;
    const aboutPageOpacity = useRef(new Animated.Value(0)).current;
    const profilePageOpacity = useRef(new Animated.Value(0)).current;
    
    const homePageTranslateX = useRef(new Animated.Value(0)).current;
    const scanPageTranslateX = useRef(new Animated.Value(screenWidth)).current;
    const aboutPageTranslateX = useRef(new Animated.Value(screenWidth)).current;
    const profilePageTranslateX = useRef(new Animated.Value(screenWidth)).current;
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
    const [selectedSortBy, setSelectedSortBy] = useState<string | null>(null);
    const menuProgress = useRef(new Animated.Value(0)).current;
    const notificationProgress = useRef(new Animated.Value(0)).current;
    const filterProgress = useRef(new Animated.Value(0)).current;
    const scanAlertScroll = useRef(new Animated.Value(0)).current;
    const [welcomeVisible, setWelcomeVisible] = useState(true);
    const [typedWelcome, setTypedWelcome] = useState('');
    const [reduceMotion, setReduceMotion] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isArabic, setIsArabic] = useState(false);
    const [permission, requestCameraPermission] = useCameraPermissions();
    const [lastScannedValue, setLastScannedValue] = useState<string | null>(null);
    
    
    // Get current theme colors and translations
    const theme = isDarkTheme ? DARK_COLORS : LIGHT_COLORS;
    const t = translations[isArabic ? 'ar' : 'en'];
    
    // Use theme colors with fallback for compatibility
    const COLORS = {
        primaryBlue: theme.primaryBlue,
        deepBlue: theme.deepBlue,
        background: theme.background,
        backgroundSecondary: theme.backgroundSecondary,
        backgroundWhite: theme.background,
        lightGreyBg: theme.backgroundSecondary,
        softGreyText: theme.textSecondary,
        text: theme.text,
        textSecondary: theme.textSecondary,
        black: theme.text,
        shadow: theme.shadow,
        border: theme.border,
    };
    
    // Create dynamic styles based on theme
    const styles = createStyles(COLORS);
    
    // Get action cards with translations
    const actionCards = [
        {
            id: 'scan',
            title: t.smartScan,
            subtitle: t.smartScanSubtitle,
            icon: 'barcode-scan',
        },
        {
            id: 'bulk',
            title: t.bulkUpload,
            subtitle: t.bulkUploadSubtitle,
            icon: 'file-upload-outline',
        },
        {
            id: 'alerts',
            title: t.priceAlerts,
            subtitle: t.priceAlertsSubtitle,
            icon: 'bell-alert-outline',
        },
    ];

    // Get recommended items with translations
    const recommendedItems = [
        {
            id: 'r1',
            title: 'iPhone 15 Pro',
            subtitle: `${t.highConfidence} 4 ${t.retailers}.`,
            tag: t.recommendedTag,
            imageUrl:
                'https://images.unsplash.com/photo-1709178295038-acbeec786fcf?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            id: 'r2',
            title: 'MacBook Air M2',
            subtitle: t.bestMargin,
            tag: t.opportunityTag,
            imageUrl:
                'https://images.unsplash.com/photo-1659135890064-d57187f0946c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    ];

    // Get categories with translations
    const categories = [
        { id: 'c1', label: t.smartphones, icon: 'cellphone' },
        { id: 'c2', label: t.laptops, icon: 'laptop' },
        { id: 'c3', label: t.accessories, icon: 'headphones' },
        { id: 'c4', label: t.appliances, icon: 'fridge-outline' },
    ];

    // Get locations with translations
    const locations = [
        { id: 'beirut', label: t.beirut },
        { id: 'outside-beirut', label: t.outsideBeirut },
        { id: 'mount-lebanon', label: t.mountLebanon },
        { id: 'north', label: t.northLebanon },
        { id: 'south', label: t.southLebanon },
        { id: 'bekaa', label: t.bekaa },
    ];

    // Get availability options with translations
    const availabilityOptions = [
        { id: 'in-stock', label: t.inStock },
        { id: 'out-of-stock', label: t.outOfStock },
        { id: 'pre-order', label: t.preOrder },
    ];
    
    useEffect(() => {
        Animated.parallel([
            Animated.timing(pageOpacity, {
                toValue: 1,
                duration: 260,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(pageTranslateY, {
                toValue: 0,
                duration: 260,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [pageOpacity, pageTranslateY]);

    useEffect(() => {
        // Typing-style welcome shown only once per HomeScreen mount
        const fullMessage = `${t.welcome}, ${userName}`;
        setTypedWelcome('');
        setWelcomeVisible(true);
        // Start fully visible while typing
        welcomeOpacity.setValue(1);

        let index = 0;
        const typingInterval = setInterval(() => {
            index += 1;
            setTypedWelcome(fullMessage.slice(0, index));
            if (index >= fullMessage.length) {
                clearInterval(typingInterval);
                // After a short pause, fade the whole message out
                setTimeout(() => {
                    Animated.timing(welcomeOpacity, {
                        toValue: 0,
                        duration: 300,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }).start(() => {
                        setWelcomeVisible(false);
                    });
                }, 5000);
            }
        }, 120);

        return () => {
            clearInterval(typingInterval);
        };
    }, [userName, welcomeOpacity]);

    // Animate navigation labels when activeNav changes
    useEffect(() => {
        const animationDuration = 300;
        const easing = Easing.out(Easing.cubic);

        // Get all label animations
        const labelAnims: Array<{
            opacity: Animated.Value;
            translateY: Animated.Value;
            isActive: boolean;
        }> = [
            { opacity: homeLabelOpacity, translateY: homeLabelTranslateY, isActive: activeNav === 'home' },
            { opacity: scanLabelOpacity, translateY: scanLabelTranslateY, isActive: activeNav === 'scan' },
            { opacity: aboutLabelOpacity, translateY: aboutLabelTranslateY, isActive: activeNav === 'about' },
            { opacity: profileLabelOpacity, translateY: profileLabelTranslateY, isActive: activeNav === 'profile' },
        ];

        // Animate all labels
        // Active tab: fade out and slide down (opacity 0, translateY 8)
        // Inactive tabs: fade in and slide up (opacity 1, translateY 0)
        const animations = labelAnims.map(({ opacity, translateY, isActive }) => {
            return Animated.parallel([
                Animated.timing(opacity, {
                    toValue: isActive ? 0 : 1, // Active = hidden, Inactive = visible
                    duration: animationDuration,
                    easing,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: isActive ? 8 : 0, // Active = slide down (hidden), Inactive = slide up (visible)
                    duration: animationDuration,
                    easing,
                    useNativeDriver: true,
                }),
            ]);
        });

        Animated.parallel(animations).start();
    }, [activeNav, homeLabelOpacity, scanLabelOpacity, aboutLabelOpacity, profileLabelOpacity, 
        homeLabelTranslateY, scanLabelTranslateY, aboutLabelTranslateY, profileLabelTranslateY]);

    // Animate page transitions when activeNav changes
    useEffect(() => {
        const animationDuration = 350;
        const easing = Easing.out(Easing.cubic);
        
        // Define tab order for determining slide direction
        const tabOrder: Array<'home' | 'scan' | 'about' | 'profile'> = ['home', 'scan', 'about', 'profile'];
        const currentIndex = tabOrder.indexOf(activeNav);
        
        // Get all page animations
        const pageAnims: Array<{
            opacity: Animated.Value;
            translateX: Animated.Value;
            isActive: boolean;
            tabIndex: number;
        }> = [
            { opacity: homePageOpacity, translateX: homePageTranslateX, isActive: activeNav === 'home', tabIndex: 0 },
            { opacity: scanPageOpacity, translateX: scanPageTranslateX, isActive: activeNav === 'scan', tabIndex: 1 },
            { opacity: aboutPageOpacity, translateX: aboutPageTranslateX, isActive: activeNav === 'about', tabIndex: 2 },
            { opacity: profilePageOpacity, translateX: profilePageTranslateX, isActive: activeNav === 'profile', tabIndex: 3 },
        ];

        // Animate all pages
        const animations = pageAnims.map(({ opacity, translateX, isActive, tabIndex }) => {
            // Determine slide direction: if moving forward (right), new page slides from right, old slides left
            // If moving backward (left), new page slides from left, old slides right
            const slideDirection = tabIndex < currentIndex ? -1 : 1; // -1 = left, 1 = right
            
            return Animated.parallel([
                Animated.timing(opacity, {
                    toValue: isActive ? 1 : 0,
                    duration: animationDuration,
                    easing,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: isActive ? 0 : (slideDirection * screenWidth),
                    duration: animationDuration,
                    easing,
                    useNativeDriver: true,
                }),
            ]);
        });

        Animated.parallel(animations).start();
    }, [activeNav, screenWidth, homePageOpacity, scanPageOpacity, aboutPageOpacity, profilePageOpacity,
        homePageTranslateX, scanPageTranslateX, aboutPageTranslateX, profilePageTranslateX]);

    // Start scrolling alert animation when on scan page
    useEffect(() => {
        if (activeNav === 'scan') {
            const bannerWidth = screenWidth + 200;
            scanAlertScroll.setValue(0);
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanAlertScroll, {
                        toValue: -bannerWidth,
                        duration: 15000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scanAlertScroll, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            scanAlertScroll.stopAnimation();
        }
    }, [activeNav, screenWidth, scanAlertScroll]);

    const openMenu = () => {
        setIsMenuOpen(true);
        menuProgress.setValue(0);
        Animated.timing(menuProgress, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(menuProgress, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start(() => {
            setIsMenuOpen(false);
        });
    };

    const openNotification = () => {
        setIsNotificationOpen(true);
        notificationProgress.setValue(0);
        Animated.timing(notificationProgress, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    };

    const closeNotification = () => {
        Animated.timing(notificationProgress, {
            toValue: 0,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start(() => {
            setIsNotificationOpen(false);
        });
    };

    const openFilter = () => {
        setIsFilterOpen(true);
        filterProgress.setValue(0);
        Animated.timing(filterProgress, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    };

    const closeFilter = () => {
        Animated.timing(filterProgress, {
            toValue: 0,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start(() => {
            setIsFilterOpen(false);
        });
    };

    const applyFilters = () => {
        // Apply filter logic here
        console.log('Filters applied:', {
            priceRange,
            selectedLocation,
            selectedCategory,
            selectedAvailability,
            selectedSortBy,
        });
        closeFilter();
    };

    const resetFilters = () => {
        setPriceRange({ min: '', max: '' });
        setSelectedLocation(null);
        setSelectedCategory(null);
        setSelectedAvailability(null);
        setSelectedSortBy(null);
    };

    const handleSearchFocus = () => {
        Animated.spring(searchScale, {
            toValue: 1.02,
            useNativeDriver: true,
            friction: 6,
        }).start();
    };

    const handleSearchBlur = () => {
        Animated.spring(searchScale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 6,
        }).start();
    };

    // Get sort options with translations
    const sortOptions = [
        { id: 'price-low', label: t.lowToHigh },
        { id: 'price-high', label: t.highToLow },
        { id: 'newest', label: t.newest },
        { id: 'popular', label: t.mostPopular },
        { id: 'rating', label: t.highestRated },
    ];

    interface ActivityItem {
        id: string;
        type: 'scan' | 'search' | 'buy' | 'upload' | 'alert' | 'export';
        title: string;
        subtitle: string;
        time: string;
        date?: string;
        details?: {
            productName?: string;
            store?: string;
            price?: string;
            quantity?: number;
            imageUrl?: string;
            dealsFound?: number;
            priceChange?: string;
        };
    }

    const recentActivity: ActivityItem[] = [
        {
            id: 'a1',
            type: 'scan',
            title: 'Scanned 12 products',
            subtitle: 'Electronics · 3 best deals found',
            time: '2 min ago',
            date: 'Today, 3:42 PM',
            details: {
                productName: 'iPhone 15 Pro, MacBook Air M2, AirPods Pro',
                dealsFound: 3,
            },
        },
        {
            id: 'a2',
            type: 'buy',
            title: 'Purchased MacBook Air M2',
            subtitle: 'Best Buy · $1,199.99',
            time: '5 min ago',
            date: 'Today, 3:39 PM',
            details: {
                productName: 'MacBook Air M2 256GB',
                store: 'Best Buy',
                price: '$1,199.99',
                quantity: 1,
            },
        },
        {
            id: 'a3',
            type: 'search',
            title: 'Searched for iPhone 15 Pro',
            subtitle: 'Found 8 retailers with prices',
            time: '15 min ago',
            date: 'Today, 3:29 PM',
            details: {
                productName: 'iPhone 15 Pro 256GB',
                dealsFound: 8,
            },
        },
        {
            id: 'a4',
            type: 'upload',
            title: 'Uploaded product photo',
            subtitle: 'Product matched: AirPods Pro',
            time: '1 hour ago',
            date: 'Today, 2:45 PM',
            details: {
                productName: 'AirPods Pro (2nd Gen)',
                imageUrl: 'https://example.com/image.jpg',
            },
        },
        {
            id: 'a5',
            type: 'alert',
            title: 'New price alert',
            subtitle: 'MacBook Air M2 dropped 4%',
            time: '18 min ago',
            date: 'Today, 3:26 PM',
            details: {
                productName: 'MacBook Air M2',
                priceChange: '-4%',
                store: 'Best Buy',
            },
        },
        {
            id: 'a6',
            type: 'scan',
            title: 'Scanned 5 products',
            subtitle: 'Home & Kitchen · 2 best deals',
            time: '2 hours ago',
            date: 'Today, 1:42 PM',
            details: {
                productName: 'Coffee Maker, Blender, Toaster',
                dealsFound: 2,
            },
        },
        {
            id: 'a7',
            type: 'buy',
            title: 'Purchased AirPods Pro',
            subtitle: 'Apple Store · $249.99',
            time: 'Yesterday',
            date: 'Yesterday, 4:15 PM',
            details: {
                productName: 'AirPods Pro (2nd Gen)',
                store: 'Apple Store',
                price: '$249.99',
                quantity: 1,
            },
        },
        {
            id: 'a8',
            type: 'search',
            title: 'Searched for Samsung TV',
            subtitle: 'Found 12 retailers',
            time: 'Yesterday',
            date: 'Yesterday, 2:30 PM',
            details: {
                productName: 'Samsung 55" 4K Smart TV',
                dealsFound: 12,
            },
        },
        {
            id: 'a9',
            type: 'export',
            title: 'Report exported',
            subtitle: 'Weekly pricing overview',
            time: 'Yesterday',
            date: 'Yesterday, 10:00 AM',
            details: {},
        },
    ];

    // Get notifications with translations
    const notifications = [
        {
            id: 'n1',
            title: t.priceAlert,
            message: isArabic 
                ? `MacBook Air M2 ${t.priceDroppedBy} 4% ${t.at} Best Buy`
                : `MacBook Air M2 ${t.priceDroppedBy} 4% ${t.at} Best Buy`,
            time: `2 ${t.minutesAgo}`,
            type: 'price',
        },
        {
            id: 'n2',
            title: t.newMatchFound,
            message: isArabic
                ? `iPhone 15 Pro ${t.matchedAcross} 4 ${t.retailers}`
                : `iPhone 15 Pro ${t.matchedAcross} 4 ${t.retailers}`,
            time: `15 ${t.minutesAgo}`,
            type: 'match',
        },
        {
            id: 'n3',
            title: t.scanComplete,
            message: `${t.successfullyScanned} 12 ${t.products}`,
            time: `1 ${t.hourAgo}`,
            type: 'scan',
        },
        {
            id: 'n4',
            title: t.weeklyReport,
            message: t.weeklyReportReady,
            time: t.yesterday,
            type: 'report',
        },
    ];

    const renderRecommendedCard = (item: (typeof recommendedItems)[number]) => {
        return (
            <Animated.View key={item.id} style={styles.recommendedWrapper}>
                <BlurView intensity={25} tint="light" style={styles.recommendedCard}>
                    <Image
                        source={{ uri: (item as any).imageUrl }}
                        style={styles.recommendedImage}
                        resizeMode="cover"
                    />
                    <View style={styles.recommendedTextContainer}>
                        <Text style={styles.recommendedTitle}>{item.title}</Text>
                        <Text style={styles.recommendedSubtitle}>{item.subtitle}</Text>
                        <View style={styles.recommendedTag}>
                            <Text style={styles.recommendedTagText}>{item.tag}</Text>
                        </View>
                    </View>
                </BlurView>
            </Animated.View>
        );
    };

    const renderCategoryCard = (item: (typeof categories)[number]) => {
        return (
            <View key={item.id} style={styles.categoryCardWrapper}>
                <Pressable style={styles.categoryCard}>
                    <View style={styles.categoryIcon}>
                        <MaterialCommunityIcons
                            name={item.icon as any}
                            size={18}
                            color={COLORS.backgroundWhite}
                        />
                    </View>
                    <Text style={styles.categoryLabel}>{item.label}</Text>
                </Pressable>
            </View>
        );
    };

    const getActivityIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'scan':
                return 'barcode-scan';
            case 'search':
                return 'magnify';
            case 'buy':
                return 'shopping';
            case 'upload':
                return 'image-plus';
            case 'alert':
                return 'bell-alert';
            case 'export':
                return 'file-export';
            default:
                return 'circle';
        }
    };

    const getActivityColor = (type: ActivityItem['type']) => {
        switch (type) {
            case 'scan':
                return COLORS.primaryBlue;
            case 'search':
                return '#10B981';
            case 'buy':
                return '#F59E0B';
            case 'upload':
                return '#8B5CF6';
            case 'alert':
                return '#EF4444';
            case 'export':
                return '#6366F1';
            default:
                return COLORS.softGreyText;
        }
    };

    const renderActivityItem = (item: ActivityItem, showFullDetails: boolean = false) => {
        const iconName = getActivityIcon(item.type);
        const iconColor = getActivityColor(item.type);

        return (
            <Pressable key={item.id} style={styles.activityItemWrapper}>
                {({ pressed }) => (
                    <BlurView 
                        intensity={20} 
                        tint="light" 
                        style={[
                            styles.activityItem,
                            pressed && styles.activityItemPressed
                        ]}
                    >
                        <View style={[styles.activityAvatar, { backgroundColor: `${iconColor}15` }]}>
                            <MaterialCommunityIcons
                                name={iconName as any}
                                size={18}
                                color={iconColor}
                            />
                        </View>
                        <View style={styles.activityTextContainer}>
                            <View style={styles.activityHeader}>
                                <Text style={styles.activityTitle}>{item.title}</Text>
                                {showFullDetails && item.date && (
                                    <Text style={styles.activityDate}>{item.date}</Text>
                                )}
                            </View>
                            <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                            {showFullDetails && item.details && (
                                <View style={styles.activityDetails}>
                                    {item.details.productName && (
                                        <View style={styles.activityDetailRow}>
                                            <MaterialCommunityIcons
                                                name="tag-outline"
                                                size={14}
                                                color={COLORS.softGreyText}
                                            />
                                            <Text style={styles.activityDetailText}>
                                                {item.details.productName}
                                            </Text>
                                        </View>
                                    )}
                                    {item.details.store && (
                                        <View style={styles.activityDetailRow}>
                                            <MaterialCommunityIcons
                                                name="store-outline"
                                                size={14}
                                                color={COLORS.softGreyText}
                                            />
                                            <Text style={styles.activityDetailText}>
                                                {item.details.store}
                                            </Text>
                                        </View>
                                    )}
                                    {item.details.price && (
                                        <View style={styles.activityDetailRow}>
                                            <MaterialCommunityIcons
                                                name="currency-usd"
                                                size={14}
                                                color={COLORS.softGreyText}
                                            />
                                            <Text style={styles.activityDetailText}>
                                                {item.details.price}
                                                {item.details.quantity && item.details.quantity > 1 && ` × ${item.details.quantity}`}
                                            </Text>
                                        </View>
                                    )}
                                    {item.details.dealsFound !== undefined && (
                                        <View style={styles.activityDetailRow}>
                                            <MaterialCommunityIcons
                                                name="star-outline"
                                                size={14}
                                                color={COLORS.softGreyText}
                                            />
                                            <Text style={styles.activityDetailText}>
                                                {item.details.dealsFound} {item.details.dealsFound === 1 ? t.deal : t.deals} {t.found}
                                            </Text>
                                        </View>
                                    )}
                                    {item.details.priceChange && (
                                        <View style={styles.activityDetailRow}>
                                            <MaterialCommunityIcons
                                                name="trending-down"
                                                size={14}
                                                color="#EF4444"
                                            />
                                            <Text style={[styles.activityDetailText, { color: '#EF4444' }]}>
                                                {t.priceDropped} {item.details.priceChange}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                        <View style={styles.activityMeta}>
                            <Text style={[styles.activityTime, { color: iconColor }]}>{item.time}</Text>
                            <View style={styles.activityChevronContainer}>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    size={18}
                                    color={COLORS.textSecondary}
                                />
                            </View>
                        </View>
                    </BlurView>
                )}
            </Pressable>
        );
    };

    const isProfile = activeNav === 'profile';
    const isScan = activeNav === 'scan';

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar style="dark" />
            <Animated.View
                style={[
                    styles.container,
                    {
                        opacity: pageOpacity,
                        transform: [{ translateY: pageTranslateY }],
                    },
                ]}
            >
                {/* Top Bar */}
                <Animated.View>
                    <BlurView intensity={16} tint="light" style={styles.topBar}>
                        <View style={styles.topBarLeft}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (isMenuOpen) {
                                        closeMenu();
                                    } else {
                                        openMenu();
                                    }
                                }}
                                style={styles.menuButton}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons
                                    name="menu"
                                    size={22}
                                    color={COLORS.black}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.topBarCenter}>
                            <Text style={styles.logoText}>𝚂𝚌𝚊𝚗𝚗𝚎𝚛</Text>
                        </View>
                        <View style={styles.topBarRight}>
                            <TouchableOpacity
                                onPress={openNotification}
                                style={styles.notificationIcon}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons
                                    name="bell-outline"
                                    size={20}
                                    color={COLORS.softGreyText}
                                />
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </Animated.View>

                {/* Notification Overlay */}
                {isNotificationOpen && (
                    <Animated.View
                        style={[
                            styles.notificationOverlay,
                            {
                                opacity: notificationProgress,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.notificationBackdrop}
                            activeOpacity={1}
                            onPress={closeNotification}
                        />
                        <Animated.View
                            style={[
                                styles.notificationPanel,
                                {
                                    transform: [
                                        {
                                            translateY: notificationProgress.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-Dimensions.get('window').height * 0.6, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <BlurView intensity={30} tint={isDarkTheme ? "dark" : "light"} style={styles.notificationPanelContent}>
                                <View style={styles.notificationHeader}>
                                    <Text style={styles.notificationHeaderTitle}>{t.notifications}</Text>
                                    <TouchableOpacity
                                        onPress={closeNotification}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    >
                                        <MaterialCommunityIcons
                                            name="close"
                                            size={24}
                                            color={COLORS.softGreyText}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={styles.notificationList}
                                >
                                    {notifications.map((notification) => {
                                        const iconName =
                                            notification.type === 'price'
                                                ? 'bell-alert'
                                                : notification.type === 'match'
                                                ? 'check-circle'
                                                : notification.type === 'scan'
                                                ? 'barcode-scan'
                                                : 'file-chart';
                                        return (
                                            <View key={notification.id} style={styles.notificationItem}>
                                                <BlurView intensity={20} tint={isDarkTheme ? "dark" : "light"} style={styles.notificationItemContent}>
                                                    <View style={styles.notificationIconWrapper}>
                                                        <MaterialCommunityIcons
                                                            name={iconName as any}
                                                            size={20}
                                                            color={COLORS.primaryBlue}
                                                        />
                                                    </View>
                                                    <View style={styles.notificationTextContainer}>
                                                        <Text style={styles.notificationItemTitle}>
                                                            {notification.title}
                                                        </Text>
                                                        <Text style={styles.notificationItemMessage}>
                                                            {notification.message}
                                                        </Text>
                                                        <Text style={styles.notificationItemTime}>
                                                            {notification.time}
                                                        </Text>
                                                    </View>
                                                </BlurView>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </BlurView>
                        </Animated.View>
                    </Animated.View>
                )}

                {/* Filter Overlay */}
                {isFilterOpen && (
                    <Animated.View
                        style={[
                            styles.filterOverlay,
                            {
                                opacity: filterProgress,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.filterBackdrop}
                            activeOpacity={1}
                            onPress={closeFilter}
                        />
                        <Animated.View
                            style={[
                                styles.filterPanel,
                                {
                                    transform: [
                                        {
                                            translateY: filterProgress.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [Dimensions.get('window').height, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <BlurView intensity={30} tint="light" style={styles.filterPanelContent}>
                                <View style={styles.filterHeader}>
                                    <Text style={styles.filterHeaderTitle}>{t.filters}</Text>
                                    <TouchableOpacity
                                        onPress={closeFilter}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    >
                                        <MaterialCommunityIcons
                                            name="close"
                                            size={24}
                                            color={COLORS.softGreyText}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={styles.filterScrollContent}
                                >
                                    {/* Price Range */}
                                    <View style={styles.filterSection}>
                                        <Text style={styles.filterSectionTitle}>{t.priceRange}</Text>
                                        <View style={styles.priceRangeContainer}>
                                            <View style={styles.priceInputContainer}>
                                                <Text style={styles.priceLabel}>Min</Text>
                                                <TextInput
                                                    style={styles.priceInput}
                                                    placeholder="0"
                                                    keyboardType="numeric"
                                                    value={priceRange.min}
                                                    onChangeText={(text) => {
                                                        // Only allow numbers and empty string
                                                        if (text === '' || /^\d+$/.test(text)) {
                                                            setPriceRange({
                                                                ...priceRange,
                                                                min: text,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </View>
                                            <View style={styles.priceInputContainer}>
                                                <Text style={styles.priceLabel}>Max</Text>
                                                <TextInput
                                                    style={styles.priceInput}
                                                    placeholder="0"
                                                    keyboardType="numeric"
                                                    value={priceRange.max}
                                                    onChangeText={(text) => {
                                                        // Only allow numbers and empty string
                                                        if (text === '' || /^\d+$/.test(text)) {
                                                            setPriceRange({
                                                                ...priceRange,
                                                                max: text,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    {/* Location */}
                                    <View style={styles.filterSection}>
                                        <Text style={styles.filterSectionTitle}>{t.location}</Text>
                                        <View style={styles.filterOptionsGrid}>
                                            {locations.map((location) => (
                                                <TouchableOpacity
                                                    key={location.id}
                                                    style={[
                                                        styles.filterOptionChip,
                                                        selectedLocation === location.id &&
                                                            styles.filterOptionChipActive,
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedLocation(
                                                            selectedLocation === location.id
                                                                ? null
                                                                : location.id
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.filterOptionChipText,
                                                            selectedLocation === location.id &&
                                                                styles.filterOptionChipTextActive,
                                                        ]}
                                                    >
                                                        {location.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Category */}
                                    <View style={styles.filterSection}>
                                        <Text style={styles.filterSectionTitle}>{t.category}</Text>
                                        <View style={styles.filterOptionsGrid}>
                                            {categories.map((category) => (
                                                <TouchableOpacity
                                                    key={category.id}
                                                    style={[
                                                        styles.filterOptionChip,
                                                        selectedCategory === category.id &&
                                                            styles.filterOptionChipActive,
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedCategory(
                                                            selectedCategory === category.id
                                                                ? null
                                                                : category.id
                                                        )
                                                    }
                                                >
                                                    <MaterialCommunityIcons
                                                        name={category.icon as any}
                                                        size={16}
                                                        color={
                                                            selectedCategory === category.id
                                                                ? COLORS.backgroundWhite
                                                                : COLORS.primaryBlue
                                                        }
                                                        style={styles.filterOptionIcon}
                                                    />
                                                    <Text
                                                        style={[
                                                            styles.filterOptionChipText,
                                                            selectedCategory === category.id &&
                                                                styles.filterOptionChipTextActive,
                                                        ]}
                                                    >
                                                        {category.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Availability */}
                                    <View style={styles.filterSection}>
                                        <Text style={styles.filterSectionTitle}>{t.availability}</Text>
                                        <View style={styles.filterOptionsList}>
                                            {availabilityOptions.map((option) => (
                                                <TouchableOpacity
                                                    key={option.id}
                                                    style={[
                                                        styles.filterOptionRow,
                                                        selectedAvailability === option.id &&
                                                            styles.filterOptionRowActive,
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedAvailability(
                                                            selectedAvailability === option.id
                                                                ? null
                                                                : option.id
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.filterOptionRowText,
                                                            selectedAvailability === option.id &&
                                                                styles.filterOptionRowTextActive,
                                                        ]}
                                                    >
                                                        {option.label}
                                                    </Text>
                                                    {selectedAvailability === option.id && (
                                                        <MaterialCommunityIcons
                                                            name="check"
                                                            size={20}
                                                            color={COLORS.primaryBlue}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Sort By */}
                                    <View style={styles.filterSection}>
                                        <Text style={styles.filterSectionTitle}>{t.sortBy}</Text>
                                        <View style={styles.filterOptionsList}>
                                            {sortOptions.map((option) => (
                                                <TouchableOpacity
                                                    key={option.id}
                                                    style={[
                                                        styles.filterOptionRow,
                                                        selectedSortBy === option.id &&
                                                            styles.filterOptionRowActive,
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedSortBy(
                                                            selectedSortBy === option.id
                                                                ? null
                                                                : option.id
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.filterOptionRowText,
                                                            selectedSortBy === option.id &&
                                                                styles.filterOptionRowTextActive,
                                                        ]}
                                                    >
                                                        {option.label}
                                                    </Text>
                                                    {selectedSortBy === option.id && (
                                                        <MaterialCommunityIcons
                                                            name="check"
                                                            size={20}
                                                            color={COLORS.primaryBlue}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>

                                {/* Filter Actions */}
                                <View style={styles.filterActions}>
                                    <TouchableOpacity
                                        style={styles.filterResetButton}
                                        onPress={resetFilters}
                                    >
                                        <Text style={styles.filterResetButtonText}>{t.reset}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.filterApplyButton}
                                        onPress={applyFilters}
                                    >
                                        <Text style={styles.filterApplyButtonText}>{t.applyFilters}</Text>
                                    </TouchableOpacity>
                                </View>
                            </BlurView>
                        </Animated.View>
                    </Animated.View>
                )}

                {/* Menu Overlay */}
                {isMenuOpen && (
                    <Animated.View
                        style={[
                            styles.menuOverlay,
                            {
                                opacity: menuProgress,
                                transform: [
                                    {
                                        translateX: menuProgress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-drawerWidth, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.menuBackdrop}
                            activeOpacity={1}
                            onPress={closeMenu}
                        />
                        <BlurView intensity={30} tint={isDarkTheme ? "dark" : "light"} style={styles.menuContainer}>
                            <View style={styles.menuHeaderRow}>
                                <View style={styles.menuHeaderLeft}>
                                    <View style={styles.menuLogoWrapper}>
                                        <Image
                                            source={require('../../../assets/icon.png')}
                                            style={styles.menuLogo}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={styles.menuTitle}>{t.scannerMenu}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={closeMenu}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={22}
                                        color={COLORS.softGreyText}
                                    />
                                </TouchableOpacity>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styles.menuSectionTitle}>{t.navigation}</Text>
                                {[
                                    { label: t.home, icon: 'home-outline' },
                                    { label: t.dashboard, icon: 'view-dashboard-outline' },
                                    { label: t.scanProductMenu, icon: 'barcode-scan' },
                                    { label: t.scanHistory, icon: 'history' },
                                    { label: t.favorites, icon: 'star-outline' },
                                    { label: t.reports, icon: 'file-chart-outline' },
                                    { label: t.notifications, icon: 'bell-outline' },
                                ].map((item) => (
                                    <TouchableOpacity key={item.label} style={styles.menuItem}>
                                        <View style={styles.menuItemRow}>
                                            <MaterialCommunityIcons
                                                name={item.icon as any}
                                                size={18}
                                                color={COLORS.primaryBlue}
                                            />
                                            <Text style={styles.menuItemText}>{item.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    style={styles.menuSectionHeaderRow}
                                    onPress={() => setIsAccountOpen((prev) => !prev)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.menuSectionTitle}>{t.account}</Text>
                                    <MaterialCommunityIcons
                                        name={isAccountOpen ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={COLORS.softGreyText}
                                    />
                                </TouchableOpacity>
                                {isAccountOpen && (
                                    <>
                                        <TouchableOpacity style={styles.menuItem}>
                                            <View style={styles.menuItemRow}>
                                                <MaterialCommunityIcons
                                                    name="account-outline"
                                                    size={18}
                                                    color={COLORS.primaryBlue}
                                                />
                                                <Text style={styles.menuItemText}>Profile</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuItem}>
                                            <View style={styles.menuItemRow}>
                                                <MaterialCommunityIcons
                                                    name="login"
                                                    size={18}
                                                    color={COLORS.primaryBlue}
                                                />
                                                <Text style={styles.menuItemText}>{isArabic ? 'تسجيل الدخول' : 'Login'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.menuItem}
                                            onPress={() =>
                                                Alert.alert('Log out', 'Are you sure you want to log out?', [
                                                    { text: 'Cancel', style: 'cancel' },
                                                    { text: 'Log out', style: 'destructive' },
                                                ])
                                            }
                                        >
                                            <View style={styles.menuItemRow}>
                                                <MaterialCommunityIcons
                                                    name="logout"
                                                    size={18}
                                                    color="#EF4444"
                                                />
                                                <Text style={[styles.menuItemText, styles.menuItemDanger]}>
                                                    Logout
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                )}

                                <TouchableOpacity
                                    style={styles.menuSectionHeaderRow}
                                    onPress={() => setIsSettingsOpen((prev) => !prev)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.menuSectionTitle}>{t.settings}</Text>
                                    <MaterialCommunityIcons
                                        name={isSettingsOpen ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={COLORS.softGreyText}
                                    />
                                </TouchableOpacity>
                                {isSettingsOpen && (
                                    <>
                                        {/* Theme Toggle */}
                                        <View style={styles.menuToggleItem}>
                                            <View style={styles.menuToggleRow}>
                                                <MaterialCommunityIcons
                                                    name={isDarkTheme ? 'weather-night' : 'weather-sunny'}
                                                    size={20}
                                                    color={COLORS.primaryBlue}
                                                />
                                                <View style={styles.menuToggleContent}>
                                                    <Text style={styles.menuToggleLabel}>
                                                        {t.theme}
                                                    </Text>
                                                    <Text style={styles.menuToggleSubtext}>
                                                        {isDarkTheme ? t.dark : t.light}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Switch
                                                value={isDarkTheme}
                                                onValueChange={setIsDarkTheme}
                                                trackColor={{ false: COLORS.border, true: COLORS.primaryBlue }}
                                                thumbColor={isDarkTheme ? '#FFFFFF' : '#FFFFFF'}
                                                ios_backgroundColor={COLORS.border}
                                            />
                                        </View>

                                        {/* Language Toggle */}
                                        <View style={styles.menuToggleItem}>
                                            <View style={styles.menuToggleRow}>
                                                <MaterialCommunityIcons
                                                    name="translate"
                                                    size={20}
                                                    color={COLORS.primaryBlue}
                                                />
                                                <View style={styles.menuToggleContent}>
                                                    <Text style={styles.menuToggleLabel}>
                                                        {t.language}
                                                    </Text>
                                                    <Text style={styles.menuToggleSubtext}>
                                                        {isArabic ? t.arabic : t.english}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Switch
                                                value={isArabic}
                                                onValueChange={setIsArabic}
                                                trackColor={{ false: '#E5E7EB', true: COLORS.primaryBlue }}
                                                thumbColor={isArabic ? '#FFFFFF' : '#FFFFFF'}
                                                ios_backgroundColor="#E5E7EB"
                                            />
                                        </View>

                                        <TouchableOpacity style={styles.menuItem}>
                                            <View style={styles.menuItemRow}>
                                                <MaterialCommunityIcons
                                                    name="tune-variant"
                                                    size={18}
                                                    color={COLORS.primaryBlue}
                                                />
                                                <Text style={styles.menuItemText}>{isArabic ? 'عام' : 'General'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSubItem}>
                                            <Text style={styles.menuSubItemText}>
                                                {t.changePassword}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSubItem}>
                                            <Text style={styles.menuSubItemText}>
                                                {t.twoFactorAuth}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.menuSubItem}
                                            onPress={() =>
                                                Alert.alert(
                                                    t.deleteAccount,
                                                    isArabic 
                                                        ? 'هل أنت متأكد أنك تريد حذف حسابك نهائياً؟'
                                                        : 'Are you sure you want to permanently delete your account?',
                                                    [
                                                        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
                                                        { text: isArabic ? 'حذف' : 'Delete', style: 'destructive' },
                                                    ]
                                                )
                                            }
                                        >
                                            <Text style={[styles.menuSubItemText, styles.menuItemDanger]}>
                                                {t.deleteAccount}
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                <TouchableOpacity
                                    style={styles.menuSectionHeaderRow}
                                    onPress={() => setIsSubscriptionsOpen((prev) => !prev)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.menuSectionTitle}>{t.subscriptions}</Text>
                                    <MaterialCommunityIcons
                                        name={isSubscriptionsOpen ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={COLORS.softGreyText}
                                    />
                                </TouchableOpacity>
                                {isSubscriptionsOpen && (
                                    <>
                                        <TouchableOpacity style={styles.menuItem}>
                                            <View style={styles.menuItemRow}>
                                                <MaterialCommunityIcons
                                                    name="crown-outline"
                                                    size={18}
                                                    color={COLORS.primaryBlue}
                                                />
                                                <Text style={styles.menuItemText}>Current plan: Pro</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSubItem}>
                                            <Text style={styles.menuSubItemText}>Upgrade to Pro Max</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSubItem}>
                                            <Text style={styles.menuSubItemText}>Manage billing</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.menuSubItem}>
                                            <Text style={styles.menuSubItemText}>Invoices</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </ScrollView>
                        </BlurView>
                    </Animated.View>
                )}

                <View style={styles.pagesContainer}>
                    {/* Home/History Page */}
                    <Animated.View
                        style={[
                            styles.pageWrapper,
                            {
                                opacity: homePageOpacity,
                                transform: [{ translateX: homePageTranslateX }],
                            },
                        ]}
                        pointerEvents={activeNav === 'home' ? 'auto' : 'none'}
                        collapsable={false}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                        >
                            {!isProfile && !isScan && (
                                <>
                            {/* Welcome Section */}
                            {welcomeVisible && (
                                <Animated.View style={{ opacity: welcomeOpacity, marginBottom: 12 }}>
                                    <Text style={styles.welcomeCombined}>{typedWelcome}</Text>
                                </Animated.View>
                            )}

                            {/* Search + Filter row */}
                            <View style={styles.searchRow}>
                                <Animated.View
                                    style={[
                                        styles.searchBar,
                                        {
                                            transform: [{ scale: searchScale }],
                                        },
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name="magnify"
                                        size={20}
                                        color={COLORS.textSecondary}
                                        style={styles.searchIcon}
                                    />
                                    <TextInput
                                        placeholder={t.search}
                                        placeholderTextColor={COLORS.textSecondary}
                                        style={styles.searchInput}
                                        onFocus={handleSearchFocus}
                                        onBlur={handleSearchBlur}
                                    />
                                </Animated.View>
                                <TouchableOpacity
                                    style={styles.filterButton}
                                    activeOpacity={0.9}
                                    onPress={openFilter}
                                >
                                    <MaterialCommunityIcons
                                        name="tune-variant"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Action Cards – horizontal scroll */}
                            <Animated.View
                                style={[
                                    styles.actionParallax,
                                    {
                                        transform: [
                                            {
                                                translateY: scrollY.interpolate({
                                                    inputRange: [0, 200],
                                                    outputRange: [0, -4],
                                                    extrapolate: 'clamp',
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Animated.ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.actionScroll}
                                    decelerationRate="fast"
                                    snapToAlignment="start"
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { x: actionScrollX } } }],
                                        { useNativeDriver: false }
                                    )}
                                    scrollEventThrottle={16}
                                >
                                    {actionCards.map((card) => (
                                        <Pressable key={card.id} style={styles.actionPressable}>
                                            {({ pressed }) => (
                                                <Animated.View
                                                    style={[
                                                        styles.actionGradientWrapper,
                                                        {
                                                            transform: [
                                                                {
                                                                    scale: pressed ? 0.97 : 1,
                                                                },
                                                            ],
                                                        },
                                                    ]}
                                                >
                                                    <BlurView intensity={24} tint="light" style={styles.actionGlass}>
                                                        <LinearGradient
                                                            colors={[COLORS.primaryBlue, COLORS.deepBlue]}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 1, y: 1 }}
                                                            style={styles.actionGradient}
                                                        >
                                                            <View style={styles.actionIconCircle}>
                                                                <MaterialCommunityIcons
                                                                    name={card.icon as any}
                                                                    size={22}
                                                                    color={COLORS.backgroundWhite}
                                                                />
                                                            </View>
                                                            <View style={styles.actionTextBlock}>
                                                                <Text style={styles.actionTitle}>{card.title}</Text>
                                                                <Text style={styles.actionSubtitle}>
                                                                    {card.subtitle}
                                                                </Text>
                                                            </View>
                                                        </LinearGradient>
                                                    </BlurView>
                                                </Animated.View>
                                            )}
                                        </Pressable>
                                    ))}
                                </Animated.ScrollView>
                                <View style={styles.carouselDots}>
                                    {actionCards.map((card, index) => {
                                        const inputRange = [
                                            (index - 1) * ACTION_CARD_WIDTH,
                                            index * ACTION_CARD_WIDTH,
                                            (index + 1) * ACTION_CARD_WIDTH,
                                        ];
                                        const dotWidth = actionScrollX.interpolate({
                                            inputRange,
                                            outputRange: [6, 16, 6],
                                            extrapolate: 'clamp',
                                        });
                                        const dotOpacity = actionScrollX.interpolate({
                                            inputRange,
                                            outputRange: [0.4, 1, 0.4],
                                            extrapolate: 'clamp',
                                        });
                                        return (
                                            <Animated.View
                                                key={card.id}
                                                style={[
                                                    styles.carouselDot,
                                                    { width: dotWidth, opacity: dotOpacity },
                                                ]}
                                            />
                                        );
                                    })}
                                </View>
                            </Animated.View>

                            {/* Recommended Section */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{t.recommended}</Text>
                                <Text style={styles.sectionSubtitle}>
                                    {t.recommendedSubtitle}
                                </Text>
                            </View>
                            {recommendedItems.map((item) => renderRecommendedCard(item))}

                            {/* Popular Categories */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{t.popularCategories}</Text>
                                <Text style={styles.sectionSubtitle}>{t.categoriesSubtitle}</Text>
                            </View>
                            <View style={styles.categoriesGrid}>
                                {categories.map((category) => renderCategoryCard(category))}
                            </View>

                            {/* Recent Activity - Only on Home */}
                            {activeNav === 'home' && (
                                <>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>{t.recentActivity}</Text>
                                        <Text style={styles.sectionSubtitle}>
                                            {t.recentActivitySubtitle}
                                        </Text>
                                    </View>
                                    <View style={styles.activityList}>
                                        {recentActivity.slice(0, 3).map((item) => renderActivityItem(item, false))}
                                    </View>
                                </>
                            )}

                            {/* History Page - Full Details */}
                        </>
                        )}
                        </ScrollView>
                    </Animated.View>

                    {/* Scan Page */}
                    <Animated.View
                        style={[
                            styles.pageWrapper,
                            {
                                opacity: scanPageOpacity,
                                transform: [{ translateX: scanPageTranslateX }],
                            },
                        ]}
                        pointerEvents={activeNav === 'scan' ? 'auto' : 'none'}
                        collapsable={false}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                        >
                            <View style={styles.scanContainer}>
                            <View style={styles.scanHeader}>
                                <Text style={styles.scanTitle}>Scan a product</Text>
                                <Text style={styles.scanSubtitle}>
                                    {t.scanSubtitle}
                                </Text>
                            </View>

                            <View style={styles.scanFrame}>
                                {!permission?.granted && (
                                    <View style={styles.scanPermissionContainer}>
                                        <Text style={styles.scanPermissionText}>
                                            {t.cameraRequired}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.scanButtonSecondary}
                                            onPress={requestCameraPermission}
                                        >
                                            <Text style={styles.scanButtonSecondaryText}>
                                                {t.allowCamera}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {permission?.granted && (
                                    <CameraView
                                        style={StyleSheet.absoluteFillObject}
                                        facing="back"
                                        barcodeScannerSettings={{
                                            barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e'],
                                        }}
                                        onBarcodeScanned={({ data }) => {
                                            if (data === lastScannedValue) return;
                                            setLastScannedValue(data);
                                            Alert.alert('Scanned', `Detected barcode: ${data}`);
                                        }}
                                    />
                                )}
                                <View style={styles.scanCornerTopLeft} />
                                <View style={styles.scanCornerTopRight} />
                                <View style={styles.scanCornerBottomLeft} />
                                <View style={styles.scanCornerBottomRight} />
                                <View style={styles.scanReticle} />
                            </View>

                            <View style={styles.scanHintRow}>
                                <MaterialCommunityIcons
                                    name="information-outline"
                                    size={18}
                                    color={COLORS.softGreyText}
                                />
                                <Text style={styles.scanHintText}>
                                    We’ll use AI to match this product across multiple stores for you.
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.scanButton} activeOpacity={0.9}>
                                <MaterialCommunityIcons
                                    name="barcode-scan"
                                    size={22}
                                    color={COLORS.backgroundWhite}
                                />
                                <Text style={styles.scanButtonText}>{t.startScanning}</Text>
                            </TouchableOpacity>

                            {/* Scrolling Alert Banner */}
                            <View style={styles.scanAlertContainer}>
                                <Animated.View
                                    style={[
                                        styles.scanAlertBanner,
                                        {
                                            transform: [
                                                {
                                                    translateX: scanAlertScroll,
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <View style={styles.scanAlertContent}>
                                        <MaterialCommunityIcons
                                            name="alert"
                                            size={18}
                                            color="#EF4444"
                                        />
                                        <Text style={styles.scanAlertText}>{t.alertBestPrices}</Text>
                                    </View>
                                    <View style={styles.scanAlertContent}>
                                        <MaterialCommunityIcons
                                            name="alert"
                                            size={18}
                                            color="#EF4444"
                                        />
                                        <Text style={styles.scanAlertText}>{t.alertBestPrices}</Text>
                                    </View>
                                </Animated.View>
                            </View>

                            <View style={styles.scanRecentHeader}>
                                <Text style={styles.scanRecentTitle}>{t.recentScans}</Text>
                            </View>
                            <View style={styles.activityList}>
                                {recentActivity.map((item) => renderActivityItem(item))}
                            </View>
                        </View>
                        </ScrollView>
                    </Animated.View>

                    {/* About Page */}
                    <Animated.View
                        style={[
                            styles.pageWrapper,
                            {
                                opacity: aboutPageOpacity,
                                transform: [{ translateX: aboutPageTranslateX }],
                            },
                        ]}
                        pointerEvents={activeNav === 'about' ? 'auto' : 'none'}
                        collapsable={false}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                        >
                            <View style={styles.aboutContainer}>
                                {/* Hero Section */}
                                <View style={styles.aboutHero}>
                                    <View style={styles.aboutIconCircle}>
                                        <MaterialCommunityIcons
                                            name="magnify"
                                            size={48}
                                            color={COLORS.primaryBlue}
                                        />
                                    </View>
                                    <Text style={styles.aboutHeroTitle}>{t.priceScanner}</Text>
                                    <Text style={styles.aboutHeroSubtitle}>
                                        {t.findRealPrices}
                                    </Text>
                                </View>

                                {/* Main Message Section */}
                                <View style={styles.aboutSection}>
                                    <View style={styles.aboutFeatureCard}>
                                        <View style={styles.aboutFeatureIcon}>
                                            <MaterialCommunityIcons
                                                name="alert-circle"
                                                size={32}
                                                color="#EF4444"
                                            />
                                        </View>
                                        <Text style={styles.aboutFeatureTitle}>
                                            {t.everyoneLying}
                                        </Text>
                                        <Text style={styles.aboutFeatureText}>
                                            {t.everyoneLyingText}
                                        </Text>
                                    </View>
                                </View>

                                {/* Purpose Section */}
                                <View style={styles.aboutSection}>
                                    <Text style={styles.aboutSectionTitle}>{t.ourPurpose}</Text>
                                    <View style={styles.aboutPurposeCard}>
                                        <MaterialCommunityIcons
                                            name="target"
                                            size={28}
                                            color={COLORS.primaryBlue}
                                        />
                                        <Text style={styles.aboutPurposeTitle}>
                                            {t.findActualPrices}
                                        </Text>
                                        <Text style={styles.aboutPurposeText}>
                                            {t.findActualPricesText}
                                        </Text>
                                    </View>
                                </View>

                                {/* How It Works */}
                                <View style={styles.aboutSection}>
                                    <Text style={styles.aboutSectionTitle}>{t.howItWorks}</Text>
                                    
                                    <View style={styles.aboutStepCard}>
                                        <View style={styles.aboutStepNumber}>
                                            <Text style={styles.aboutStepNumberText}>1</Text>
                                        </View>
                                        <View style={styles.aboutStepContent}>
                                            <Text style={styles.aboutStepTitle}>{t.step1Title}</Text>
                                            <Text style={styles.aboutStepText}>
                                                {t.step1Text}
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons
                                            name="barcode-scan"
                                            size={24}
                                            color={COLORS.primaryBlue}
                                        />
                                    </View>

                                    <View style={styles.aboutStepCard}>
                                        <View style={styles.aboutStepNumber}>
                                            <Text style={styles.aboutStepNumberText}>2</Text>
                                        </View>
                                        <View style={styles.aboutStepContent}>
                                            <Text style={styles.aboutStepTitle}>{t.step2Title}</Text>
                                            <Text style={styles.aboutStepText}>
                                                {t.step2Text}
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons
                                            name="robot"
                                            size={24}
                                            color={COLORS.primaryBlue}
                                        />
                                    </View>

                                    <View style={styles.aboutStepCard}>
                                        <View style={styles.aboutStepNumber}>
                                            <Text style={styles.aboutStepNumberText}>3</Text>
                                        </View>
                                        <View style={styles.aboutStepContent}>
                                            <Text style={styles.aboutStepTitle}>{t.step3Title}</Text>
                                            <Text style={styles.aboutStepText}>
                                                {t.step3Text}
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons
                                            name="chart-line"
                                            size={24}
                                            color={COLORS.primaryBlue}
                                        />
                                    </View>

                                    <View style={styles.aboutStepCard}>
                                        <View style={styles.aboutStepNumber}>
                                            <Text style={styles.aboutStepNumberText}>4</Text>
                                        </View>
                                        <View style={styles.aboutStepContent}>
                                            <Text style={styles.aboutStepTitle}>{t.step4Title}</Text>
                                            <Text style={styles.aboutStepText}>
                                                {t.step4Text}
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons
                                            name="wallet"
                                            size={24}
                                            color={COLORS.primaryBlue}
                                        />
                                    </View>
                                </View>

                                {/* Key Features */}
                                <View style={styles.aboutSection}>
                                    <Text style={styles.aboutSectionTitle}>{t.whyPriceScanner}</Text>
                                    
                                    <View style={styles.aboutFeatureGrid}>
                                        <View style={styles.aboutFeatureItem}>
                                            <MaterialCommunityIcons
                                                name="shield-check"
                                                size={28}
                                                color="#10B981"
                                            />
                                            <Text style={styles.aboutFeatureItemTitle}>{t.noLies}</Text>
                                            <Text style={styles.aboutFeatureItemText}>
                                                {t.noLiesText}
                                            </Text>
                                        </View>

                                        <View style={styles.aboutFeatureItem}>
                                            <MaterialCommunityIcons
                                                name="store"
                                                size={28}
                                                color={COLORS.primaryBlue}
                                            />
                                            <Text style={styles.aboutFeatureItemTitle}>{t.multipleStores}</Text>
                                            <Text style={styles.aboutFeatureItemText}>
                                                {t.multipleStoresText}
                                            </Text>
                                        </View>

                                        <View style={styles.aboutFeatureItem}>
                                            <MaterialCommunityIcons
                                                name="lightning-bolt"
                                                size={28}
                                                color="#F59E0B"
                                            />
                                            <Text style={styles.aboutFeatureItemTitle}>{t.realTime}</Text>
                                            <Text style={styles.aboutFeatureItemText}>
                                                {t.realTimeText}
                                            </Text>
                                        </View>

                                        <View style={styles.aboutFeatureItem}>
                                            <MaterialCommunityIcons
                                                name="brain"
                                                size={28}
                                                color="#8B5CF6"
                                            />
                                            <Text style={styles.aboutFeatureItemTitle}>{t.aiPowered}</Text>
                                            <Text style={styles.aboutFeatureItemText}>
                                                {t.aiPoweredText}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Bottom Message */}
                                <View style={styles.aboutBottomCard}>
                                    <MaterialCommunityIcons
                                        name="check-circle"
                                        size={32}
                                        color="#10B981"
                                    />
                                    <Text style={styles.aboutBottomTitle}>
                                        {t.bestPriceExists}
                                    </Text>
                                    <Text style={styles.aboutBottomText}>
                                        {t.stopBelieving}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </Animated.View>

                    {/* Profile Page */}
                    <Animated.View
                        style={[
                            styles.pageWrapper,
                            {
                                opacity: profilePageOpacity,
                                transform: [{ translateX: profilePageTranslateX }],
                            },
                        ]}
                        pointerEvents={activeNav === 'profile' ? 'auto' : 'none'}
                        collapsable={false}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                        >
                            <View style={styles.profileContainer}>
                            <View style={styles.profileHeader}>
                                <View style={styles.profileAvatar}>
                                    <Text style={styles.profileAvatarInitials}>
                                        {userName
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.profileTextBlock}>
                                    <View style={styles.profileNameRow}>
                                        <Text style={styles.profileName}>{userName}</Text>
                                        <View style={styles.profileBadge}>
                                            <MaterialCommunityIcons
                                                name="check-decagram"
                                                size={14}
                                                color="#FFFFFF"
                                            />
                                        </View>
                                    </View>
                                    <Text style={styles.profileSubtitle}>Premium user · Since 2025</Text>
                                </View>
                            </View>

                            <View style={styles.profileSectionGroup}>
                                <Text style={styles.profileSectionTitle}>{t.account}</Text>
                                <TouchableOpacity style={styles.profileRow}>
                                    <Text style={styles.profileRowLabel}>{t.personalDetails}</Text>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={20}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileRow}>
                                    <Text style={styles.profileRowLabel}>{t.security}</Text>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={20}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.profileSectionGroup}>
                                <Text style={styles.profileSectionTitle}>{t.notifications}</Text>
                                <TouchableOpacity style={styles.profileRow}>
                                    <Text style={styles.profileRowLabel}>{t.pushNotifications}</Text>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={20}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileRow}>
                                    <Text style={styles.profileRowLabel}>{t.emailUpdates}</Text>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={20}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.profileSectionGroup}>
                                <Text style={styles.profileSectionTitle}>{t.privacy}</Text>
                                <TouchableOpacity style={styles.profileRow}>
                                    <Text style={styles.profileRowLabel}>{t.dataPermissions}</Text>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={20}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileRow}>
                                    <Text style={styles.profileRowLabel}>{t.connectedApps}</Text>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={20}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.profileSectionGroup}>
                                <Text style={styles.profileSectionTitle}>{t.accessibility}</Text>
                                <View style={styles.profileRow}>
                                    <Text style={styles.profileRowLabel}>{t.reduceMotion}</Text>
                                    <Switch
                                        value={reduceMotion}
                                        onValueChange={setReduceMotion}
                                        thumbColor={reduceMotion ? COLORS.primaryBlue : '#FFFFFF'}
                                                trackColor={{ false: COLORS.border, true: '#BFDBFE' }}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.profileLogoutButton}
                                onPress={() =>
                                    Alert.alert('Log out', 'Are you sure you want to log out?', [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Log out', style: 'destructive' },
                                    ])
                                }
                            >
                                <Text style={styles.profileLogoutText}>{t.logout}</Text>
                            </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </View>

                {/* Bottom Navigation */}
                <View style={styles.bottomNavContainer}>
                    <View style={[styles.bottomNav, { paddingBottom: Platform.OS === 'ios' ? Math.max(8, Math.min(insets.bottom, 8)) : 12 + insets.bottom }]}>
                        {(
                            [
                                { key: 'home', icon: 'home-variant', inactiveIcon: 'home-variant-outline', label: t.home },
                                { key: 'scan', icon: 'barcode-scan', inactiveIcon: 'barcode-scan', label: t.scan },
                                { key: 'about', icon: 'information', inactiveIcon: 'information-outline', label: t.about },
                                { key: 'profile', icon: 'account-circle', inactiveIcon: 'account-circle-outline', label: t.profile },
                            ] as const
                        ).map((item) => {
                            const isActive = activeNav === item.key;
                            const color = isActive ? COLORS.primaryBlue : COLORS.textSecondary;
                            
                            // Get animated values for this item
                            let labelOpacity: Animated.Value;
                            let labelTranslateY: Animated.Value;
                            
                            switch (item.key) {
                                case 'home':
                                    labelOpacity = homeLabelOpacity;
                                    labelTranslateY = homeLabelTranslateY;
                                    break;
                                case 'scan':
                                    labelOpacity = scanLabelOpacity;
                                    labelTranslateY = scanLabelTranslateY;
                                    break;
                                case 'about':
                                    labelOpacity = aboutLabelOpacity;
                                    labelTranslateY = aboutLabelTranslateY;
                                    break;
                                case 'profile':
                                    labelOpacity = profileLabelOpacity;
                                    labelTranslateY = profileLabelTranslateY;
                                    break;
                            }
                            
                            return (
                                <Pressable
                                    key={item.key}
                                    onPress={() => setActiveNav(item.key)}
                                    style={styles.bottomNavItem}
                                >
                                    {({ pressed }) => {
                                        const baseScale = isActive ? 1.05 : 1;
                                        const scale = pressed ? baseScale * 0.95 : baseScale;
                                        return (
                                            <View style={styles.bottomNavItemContent}>
                                                <Animated.View
                                                    style={[
                                                        styles.bottomNavIconWrapper,
                                                        {
                                                            transform: [{ scale }],
                                                        },
                                                    ]}
                                                >
                                                    <MaterialCommunityIcons
                                                        name={isActive ? item.icon : item.inactiveIcon}
                                                        size={26}
                                                        color={color}
                                                    />
                                                </Animated.View>
                                                <Animated.View
                                                    style={[
                                                        styles.bottomNavLabelWrapper,
                                                        {
                                                            opacity: labelOpacity,
                                                            transform: [{ translateY: labelTranslateY }],
                                                        },
                                                    ]}
                                                >
                                                    <Text style={[styles.bottomNavLabel, { color }]}>
                                                        {item.label}
                                                    </Text>
                                                </Animated.View>
                                            </View>
                                        );
                                    }}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

// Dynamic styles function that takes theme colors
const createStyles = (COLORS: { primaryBlue: string; deepBlue: string; background: string; backgroundSecondary: string; backgroundWhite: string; lightGreyBg: string; softGreyText: string; text: string; textSecondary: string; black: string; shadow: string; border: string }) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.backgroundWhite,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundWhite,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.backgroundWhite,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 28 : 12,
        paddingBottom: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    topBarLeft: {
        width: 48,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    menuButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(15,23,42,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBarCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.8,
        color: COLORS.black,
        textAlign: 'center',
    },
    topBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(26,115,232,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primaryBlue,
    },
    pagesContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    pageWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 72,
        backgroundColor: COLORS.backgroundWhite,
    },
    welcomeCombined: {
        fontSize: 18,
        color: COLORS.softGreyText,
        marginTop: 2,
    },
    welcomeNameInline: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.black,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 18,
    },
    searchBar: {
        flex: 1,
        backgroundColor: COLORS.backgroundWhite,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButton: {
        marginLeft: 12,
        width: 44,
        height: 44,
        borderRadius: 16,
        backgroundColor: COLORS.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        fontSize: 15,
        color: COLORS.black,
    },
    actionScroll: {
        marginTop: 24,
        paddingRight: 16,
    },
    actionPressable: {
        width: ACTION_CARD_WIDTH,
        height: 150,
        marginRight: 16,
    },
    actionGradientWrapper: {
        flex: 1,
        borderRadius: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
    },
    actionGlass: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
        overflow: 'hidden',
    },
    actionGradient: {
        flex: 1,
        borderRadius: 20,
        padding: 18,
        justifyContent: 'space-between',
    },
    actionIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionTextBlock: {
        marginTop: 8,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.backgroundWhite,
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 18,
    },
    carouselDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    carouselDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E5E7EB',
    },
    carouselDotActive: {
        width: 16,
        borderRadius: 8,
        backgroundColor: COLORS.primaryBlue,
    },
    sectionHeader: {
        marginTop: 28,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
    },
    sectionSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: COLORS.softGreyText,
    },
    recommendedWrapper: {
        marginBottom: 12,
        shadowColor: '#1D4ED8',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 18,
        elevation: 6,
    },
    recommendedCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 28,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(191,219,254,0.9)',
        overflow: 'hidden',
    },
    recommendedImage: {
        width: 56,
        height: 56,
        borderRadius: 24,
        marginRight: 12,
        overflow: 'hidden',
    },
    recommendedTextContainer: {
        flex: 1,
    },
    recommendedTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 4,
    },
    recommendedSubtitle: {
        fontSize: 13,
        color: COLORS.softGreyText,
        marginBottom: 8,
    },
    recommendedTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: COLORS.primaryBlue,
    },
    recommendedTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.backgroundWhite,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    categoryCardWrapper: {
        width: '50%',
        paddingHorizontal: 6,
        marginBottom: 14,
    },
    categoryCard: {
        backgroundColor: COLORS.lightGreyBg,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryIcon: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: COLORS.primaryBlue,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
        textAlign: 'center',
    },
    activityList: {
        marginTop: 4,
    },
    activityItemWrapper: {
        marginBottom: 10,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    actionParallax: {
        marginTop: 24,
    },
    activityAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.lightGreyBg,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityTextContainer: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 2,
    },
    activitySubtitle: {
        fontSize: 12,
        color: COLORS.softGreyText,
    },
    activityMeta: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    activityTime: {
        fontSize: 11,
        color: COLORS.primaryBlue,
        marginBottom: 4,
        textAlign: 'center',
    },
    activityChevronContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityChevron: {
        width: 8,
        height: 14,
        borderLeftWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: '#9CA3AF',
        transform: [{ rotate: '-45deg' }],
    },
    activityItemPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    activityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    activityDate: {
        fontSize: 11,
        color: COLORS.softGreyText,
        fontWeight: '500',
    },
    activityDetails: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        gap: 6,
    },
    activityDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    activityDetailText: {
        fontSize: 12,
        color: COLORS.softGreyText,
        flex: 1,
    },
    historyHeader: {
        marginBottom: 24,
        paddingTop: 8,
    },
    historyTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 6,
    },
    historySubtitle: {
        fontSize: 14,
        color: COLORS.softGreyText,
        lineHeight: 20,
    },
    historySection: {
        marginBottom: 32,
    },
    historySectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    aboutContainer: {
        paddingTop: 8,
    },
    aboutHero: {
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 16,
    },
    aboutIconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: `${COLORS.primaryBlue}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    aboutHeroTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 8,
        textAlign: 'center',
    },
    aboutHeroSubtitle: {
        fontSize: 16,
        color: COLORS.softGreyText,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 24,
    },
    aboutSection: {
        marginBottom: 32,
    },
    aboutSectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 16,
    },
    aboutFeatureCard: {
        backgroundColor: COLORS.lightGreyBg,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    aboutFeatureIcon: {
        marginBottom: 12,
    },
    aboutFeatureTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 8,
        textAlign: 'center',
    },
    aboutFeatureText: {
        fontSize: 14,
        color: COLORS.softGreyText,
        lineHeight: 22,
        textAlign: 'center',
    },
    aboutPurposeCard: {
        backgroundColor: COLORS.lightGreyBg,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    aboutPurposeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.black,
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    aboutPurposeText: {
        fontSize: 14,
        color: COLORS.softGreyText,
        lineHeight: 22,
        textAlign: 'center',
    },
    aboutStepCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGreyBg,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
    },
    aboutStepNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    aboutStepNumberText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.backgroundWhite,
    },
    aboutStepContent: {
        flex: 1,
        marginRight: 12,
    },
    aboutStepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 4,
    },
    aboutStepText: {
        fontSize: 13,
        color: COLORS.softGreyText,
        lineHeight: 20,
    },
    aboutFeatureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    aboutFeatureItem: {
        width: '48%',
        backgroundColor: COLORS.lightGreyBg,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 12,
    },
    aboutFeatureItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        marginTop: 12,
        marginBottom: 6,
        textAlign: 'center',
    },
    aboutFeatureItemText: {
        fontSize: 12,
        color: COLORS.softGreyText,
        lineHeight: 18,
        textAlign: 'center',
    },
    aboutBottomCard: {
        backgroundColor: `${COLORS.primaryBlue}10`,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
        borderWidth: 2,
        borderColor: `${COLORS.primaryBlue}20`,
    },
    aboutBottomTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    aboutBottomText: {
        fontSize: 14,
        color: COLORS.softGreyText,
        textAlign: 'center',
        lineHeight: 22,
    },
    scanContainer: {
        paddingTop: 16,
    },
    scanHeader: {
        marginBottom: 18,
    },
    scanTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 4,
    },
    scanSubtitle: {
        fontSize: 13,
        color: COLORS.softGreyText,
    },
    scanFrame: {
        marginTop: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 16,
    },
    scanFrameText: {
        fontSize: 13,
        color: COLORS.softGreyText,
        marginTop: 12,
    },
    scanCornerTopLeft: {
        position: 'absolute',
        top: 18,
        left: 18,
        width: 32,
        height: 32,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderColor: COLORS.primaryBlue,
        borderRadius: 10,
    },
    scanCornerTopRight: {
        position: 'absolute',
        top: 18,
        right: 18,
        width: 32,
        height: 32,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderColor: COLORS.primaryBlue,
        borderRadius: 10,
    },
    scanCornerBottomLeft: {
        position: 'absolute',
        bottom: 18,
        left: 18,
        width: 32,
        height: 32,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderColor: COLORS.primaryBlue,
        borderRadius: 10,
    },
    scanCornerBottomRight: {
        position: 'absolute',
        bottom: 18,
        right: 18,
        width: 32,
        height: 32,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderColor: COLORS.primaryBlue,
        borderRadius: 10,
    },
    scanReticle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(15,118,110,0.35)',
    },
    scanPermissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    scanPermissionText: {
        fontSize: 14,
        color: COLORS.softGreyText,
        textAlign: 'center',
        marginBottom: 12,
    },
    scanButtonSecondary: {
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.primaryBlue,
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    scanButtonSecondaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primaryBlue,
    },
    scanHintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 6,
    },
    scanHintText: {
        flex: 1,
        fontSize: 12,
        color: COLORS.softGreyText,
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        backgroundColor: COLORS.primaryBlue,
        paddingVertical: 14,
        marginBottom: 24,
        shadowColor: COLORS.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        gap: 8,
    },
    scanButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    scanAlertContainer: {
        marginTop: 20,
        marginBottom: 20,
        height: 40,
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    scanAlertBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        width: '200%',
    },
    scanAlertContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 8,
    },
    scanAlertText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
    },
    scanRecentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    scanRecentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
    },
    profileContainer: {
        paddingTop: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    profileAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileAvatarInitials: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    profileTextBlock: {
        flex: 1,
    },
    profileNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
        marginRight: 8,
    },
    profileBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primaryBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSubtitle: {
        fontSize: 13,
        color: COLORS.softGreyText,
    },
    profileSectionGroup: {
        marginTop: 20,
    },
    profileSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    profileRowLabel: {
        fontSize: 15,
        color: COLORS.text,
    },
    profileLogoutButton: {
        marginTop: 32,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
    },
    profileLogoutText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#DC2626',
    },
    menuOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
    },
    menuBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '75%',
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        paddingTop: 72,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: COLORS.backgroundSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 18,
        elevation: 10,
    },
    menuSectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.softGreyText,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 4,
        marginBottom: 6,
    },
    menuHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
    },
    menuHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuLogoWrapper: {
        width: 28,
        height: 28,
        borderRadius: 10,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLogo: {
        width: 22,
        height: 22,
        borderRadius: 6,
    },
    menuItem: {
        paddingVertical: 10,
    },
    menuItemText: {
        fontSize: 15,
        color: COLORS.text,
    },
    menuItemDanger: {
        color: '#EF4444',
    },
    menuItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuToggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 4,
    },
    menuToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    menuToggleContent: {
        flex: 1,
    },
    menuToggleLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 2,
    },
    menuToggleSubtext: {
        fontSize: 13,
        color: COLORS.softGreyText,
    },
    menuSubItem: {
        paddingVertical: 6,
        paddingLeft: 12,
    },
    menuSubItemText: {
        fontSize: 14,
        color: COLORS.softGreyText,
    },
    menuSectionHeaderRow: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomNavContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.backgroundWhite,
    },
    bottomNav: {
        paddingHorizontal: 24,
        paddingTop: 12,
        backgroundColor: COLORS.backgroundWhite,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.09,
        shadowRadius: 12,
        elevation: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomNavItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomNavItemContent: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: 50,
    },
    bottomNavIconWrapper: {
        marginBottom: 4,
    },
    bottomNavLabelWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
        height: 16,
    },
    bottomNavLabel: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    notificationOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
    },
    notificationBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    notificationPanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Dimensions.get('window').height * 0.6,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
    },
    notificationPanelContent: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.98)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: Platform.OS === 'android' ? 28 : 12,
        paddingBottom: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 18,
        elevation: 10,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    notificationHeaderTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.black,
    },
    notificationList: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    notificationItem: {
        marginBottom: 12,
    },
    notificationItemContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    notificationIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.lightGreyBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationTextContainer: {
        flex: 1,
    },
    notificationItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 4,
    },
    notificationItemMessage: {
        fontSize: 13,
        color: COLORS.softGreyText,
        marginBottom: 6,
        lineHeight: 18,
    },
    notificationItemTime: {
        fontSize: 11,
        color: COLORS.primaryBlue,
    },
    filterOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 25,
    },
    filterBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    filterPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Dimensions.get('window').height * 0.85,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    filterPanelContent: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.98)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: Platform.OS === 'android' ? 28 : 12,
        paddingBottom: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.15,
        shadowRadius: 18,
        elevation: 10,
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    filterHeaderTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.black,
    },
    filterScrollContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    filterSection: {
        marginTop: 24,
        marginBottom: 8,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 12,
    },
    priceRangeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    priceInputContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 13,
        color: COLORS.softGreyText,
        marginBottom: 6,
    },
    priceInput: {
        backgroundColor: COLORS.lightGreyBg,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: COLORS.black,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    filterOptionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterOptionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.lightGreyBg,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        marginBottom: 8,
    },
    filterOptionChipActive: {
        backgroundColor: COLORS.primaryBlue,
        borderColor: COLORS.primaryBlue,
    },
    filterOptionIcon: {
        marginRight: 6,
    },
    filterOptionChipText: {
        fontSize: 14,
        color: COLORS.black,
        fontWeight: '500',
    },
    filterOptionChipTextActive: {
        color: COLORS.backgroundWhite,
        fontWeight: '600',
    },
    filterOptionsList: {
        gap: 8,
    },
    filterOptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: COLORS.lightGreyBg,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    filterOptionRowActive: {
        backgroundColor: 'rgba(26,115,232,0.08)',
        borderColor: COLORS.primaryBlue,
    },
    filterOptionRowText: {
        fontSize: 15,
        color: COLORS.black,
        fontWeight: '500',
    },
    filterOptionRowTextActive: {
        color: COLORS.primaryBlue,
        fontWeight: '600',
    },
    filterActions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    filterResetButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: COLORS.lightGreyBg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    filterResetButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.black,
    },
    filterApplyButton: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: COLORS.primaryBlue,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primaryBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    filterApplyButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.backgroundWhite,
    },
});
