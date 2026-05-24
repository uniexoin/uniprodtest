export type LanguageCode = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    dashboard: "Vendor Dashboard",
    welcome: "Welcome back",
    commandCenter: "Command center online.",
    syncDb: "Sync DB",
    syncing: "Syncing...",
    profileSettings: "Profile Settings",
    analyticsOverview: "Analytics Overview",
    revenueSales: "Revenue & Sales",
    ledgerBook: "Ledger Book",
    vehicleFleet: "Vehicle Fleet",
    roomPgManager: "Room & PG Manager",
    laundryPipeline: "Laundry Pipeline",
    
    // KPI Titles
    netEarnings: "Net Earnings",
    conversion: "Conversion Rate",
    totalVolume: "Total Volume",
    avgOrder: "Avg Order Value",
    
    // KPI Labels
    confirmed: "Confirmed",
    newBookings: "NEW BOOKINGS",
    status: "STATUS",
    liveStream: "LIVE STREAM",
    
    // KPI Live Insights
    earningsInsight: "LIVE: Your revenue grew 12% MoM. Highly profitable right now!",
    conversionInsight: "LIVE: 92% completion. Your response time is faster than 95% of vendors!",
    volumeInsight: "LIVE: 30+ bookings processed. Keep availability updated for high visibility.",
    avgOrderInsight: "LIVE: Average ticket is ₹3,200. Consider high-tier bundles to raise average.",
    
    // Descriptions
    earningsDesc: "Net earnings after service fee",
    conversionDesc: "Percentage of bookings completed",
    volumeDesc: "All-time booking volume",
    avgOrderDesc: "Average transaction value",
    
    // Buttons
    withdraw: "Withdraw Funds",
    statements: "Statements",
    changeLang: "Change Language",
    
    // General
    recentActivity: "Recent Activity",
    noActivity: "No recent activity recorded.",
    viewCapacity: "View Capacity Settings",
    statusBadge: "Vendor Status",
    activeStay: "Stays Manager",
    activeFleet: "Vehicles Manager"
  },
  hi: {
    dashboard: "विक्रेता डैशबोर्ड",
    welcome: "आपका स्वागत है",
    commandCenter: "कमांड सेंटर ऑनलाइन है।",
    syncDb: "डेटा सिंक करें",
    syncing: "सिंक हो रहा है...",
    profileSettings: "प्रोफ़ाइल सेटिंग्स",
    analyticsOverview: "विश्लेषण अवलोकन",
    revenueSales: "राजस्व और बिक्री",
    ledgerBook: "खाता बही (लेजर)",
    vehicleFleet: "वाहन बेड़ा (फ्लीट)",
    roomPgManager: "कमरा और पीजी प्रबंधक",
    laundryPipeline: "लाँड्री पाइपलाइन",
    
    netEarnings: "शुद्ध कमाई",
    conversion: "रूपांतरण दर",
    totalVolume: "कुल मात्रा",
    avgOrder: "औसत ऑर्डर मूल्य",
    
    confirmed: "पुष्टि की गई",
    newBookings: "नई बुकिंग",
    status: "स्थिति",
    liveStream: "लाइव स्ट्रीम",
    
    earningsInsight: "लाइव: आपकी आय 12% बढ़ी। वर्तमान में अत्यधिक लाभदायक!",
    conversionInsight: "लाइव: 92% पूर्णता। आप 95% विक्रेताओं से तेज़ जवाब देते हैं!",
    volumeInsight: "लाइव: 30+ बुकिंग। अच्छी विजिबिलिटी के लिए उपलब्धता अपडेट रखें।",
    avgOrderInsight: "लाइव: औसत टिकट ₹3,200 है। औसत बढ़ाने के लिए प्रीमियम पैकेज पेश करें।",
    
    earningsDesc: "सेवा शुल्क के बाद शुद्ध कमाई",
    conversionDesc: "पूर्ण बुकिंग का प्रतिशत",
    volumeDesc: "अब तक की कुल बुकिंग",
    avgOrderDesc: "औसत लेनदेन मूल्य",
    
    withdraw: "पैसे निकालें",
    statements: "स्टेटमेंट",
    changeLang: "भाषा बदलें",
    
    recentActivity: "हाल की गतिविधि",
    noActivity: "कोई हाल की गतिविधि दर्ज नहीं है।",
    viewCapacity: "क्षमता सेटिंग्स देखें",
    statusBadge: "विक्रेता स्थिति",
    activeStay: "कमरा प्रबंधक",
    activeFleet: "वाहन प्रबंधक"
  },
  bn: {
    dashboard: "বিক্রেতা ড্যাশবোর্ড",
    welcome: "স্বাগতম",
    commandCenter: "কমান্ড সেন্টার অনলাইন।",
    syncDb: "ডাটা সিঙ্ক",
    syncing: "সিঙ্ক হচ্ছে...",
    profileSettings: "প্রোফাইল সেটিংস",
    analyticsOverview: "বিশ্লেষণ ওভারভিউ",
    revenueSales: "রাজস্ব এবং বিক্রয়",
    ledgerBook: "লেজার বুক",
    vehicleFleet: "যানবাহন ফ্লিট",
    roomPgManager: "রুম ও পিজি ম্যানেজার",
    laundryPipeline: "লন্ড্রি পাইপলাইন",
    
    netEarnings: "নিট আয়",
    conversion: "রূপান্তর হার",
    totalVolume: "মোট ভলিউম",
    avgOrder: "গড় অর্ডার মূল্য",
    
    confirmed: "নিশ্চিত করা",
    newBookings: "নতুন বুকিং",
    status: "অবস্থা",
    liveStream: "লাইভ স্ট্রিম",
    
    earningsInsight: "লাইভ: আপনার আয় 12% বৃদ্ধি পেয়েছে। বর্তমানে অত্যন্ত লাভজনক!",
    conversionInsight: "লাইভ: 92% সম্পন্ন। আপনার প্রতিক্রিয়া সময় 95% বিক্রেতার চেয়ে দ্রুত!",
    volumeInsight: "লাইভ: 30+ বুকিং সম্পন্ন। উচ্চ দৃশ্যমানতার জন্য উপলব্ধতা আপডেট রাখুন।",
    avgOrderInsight: "লাইভ: গড় টিকিট ₹৩,২০০। গড় বাড়ানোর জন্য প্রিমিয়াম প্যাকেজ অফার করুন।",
    
    earningsDesc: "পরিষেবা ফি কাটার পরে নিট আয়",
    conversionDesc: "সম্পন্ন বুকিংয়ের শতকরা হার",
    volumeDesc: "সর্বকালের মোট বুকিং",
    avgOrderDesc: "গড় লেনদেনের মূল্য",
    
    withdraw: "টাকা উত্তোলন",
    statements: "বিবরণী",
    changeLang: "ভাষা পরিবর্তন",
    
    recentActivity: "সাম্প্রতিক কার্যকলাপ",
    noActivity: "কোন সাম্প্রতিক কার্যকলাপের রেকর্ড নেই।",
    viewCapacity: "ধারণক্ষমতা সেটিংস",
    statusBadge: "বিক্রেতার অবস্থা",
    activeStay: "রুম ম্যানেজার",
    activeFleet: "যানবাহন ম্যানেজার"
  },
  te: {
    dashboard: "విక్రేత డాష్‌బోర్డ్",
    welcome: "స్వాగతం",
    commandCenter: "కమాండ్ సెంటర్ ఆన్‌లైన్.",
    syncDb: "డేటా సింక్",
    syncing: "సింక్ అవుతోంది...",
    profileSettings: "ప్రొఫైల్ సెట్టింగ్‌లు",
    analyticsOverview: "విశ్లేషణ అవలోకనం",
    revenueSales: "ఆదాయం & విక్రయాలు",
    ledgerBook: "లెడ్జర్ బుక్",
    vehicleFleet: "వాహనాల ఫ్లీట్",
    roomPgManager: "రూమ్ & పీజీ మేనేజర్",
    laundryPipeline: "లాండ్రీ పైప్‌లైన్",
    
    netEarnings: "నికర ఆదాయం",
    conversion: "కన్వర్షన్ రేట్",
    totalVolume: "మొత్తం వాల్యూమ్",
    avgOrder: "సగటు ఆర్డర్ విలువ",
    
    confirmed: "ధృవీకరించబడింది",
    newBookings: "కొత్త బుకింగ్స్",
    status: "స్థితి",
    liveStream: "లైవ్ స్ట్రీమ్",
    
    earningsInsight: "లైవ్: మీ ఆదాయం 12% పెరిగింది. ప్రస్తుతం చాలా లాభదాయకం!",
    conversionInsight: "లైవ్: 92% పూర్తి. 95% విక్రేతల కంటే మీ రెస్పాన్స్ సమయం వేగంగా ఉంది!",
    volumeInsight: "లైవ్: 30+ బుకింగ్‌లు. అధిక విజిబిలిటీ కోసం అందుబాటును అప్‌డేట్ చేయండి.",
    avgOrderInsight: "లైవ్: సగటు బుకింగ్ ₹3,200. సగటును పెంచడానికి ప్రీమియం ప్యాకేజీలు ఇవ్వండి.",
    
    earningsDesc: "సర్వీస్ ఫీజు పోగా నికర ఆదాయం",
    conversionDesc: "పూర్తయిన బుకింగ్‌ల శాతం",
    volumeDesc: "సర్వకాలీన బుకింగ్ వాల్యూమ్",
    avgOrderDesc: "సగటు లావాదేవీ విలువ",
    
    withdraw: "డబ్బు విత్‌డ్రా",
    statements: "స్టేట్‌మెంట్లు",
    changeLang: "భాష మార్చండి",
    
    recentActivity: "ఇటీవలి కార్యాచరణ",
    noActivity: "ఇటీవలి కార్యాచరణ ఏదీ లేదు.",
    viewCapacity: "సామర్థ్య సెట్టింగ్‌లు",
    statusBadge: "విక్రేత స్థితి",
    activeStay: "రూమ్స్ మేనేజర్",
    activeFleet: "వాహనాల మేనేజర్"
  },
  ta: {
    dashboard: "விற்பனையாளர் டாஷ்போர்டு",
    welcome: "நல்வரவு",
    commandCenter: "கட்டளை மையம் ஆன்லைன்.",
    syncDb: "தரவை ஒத்திசை",
    syncing: "ஒத்திசைக்கிறது...",
    profileSettings: "சுயவிவர அமைப்புகள்",
    analyticsOverview: "பகுப்பாய்வு கண்ணோட்டம்",
    revenueSales: "வருவாய் & விற்பனை",
    ledgerBook: "பேரேடு புத்தகம்",
    vehicleFleet: "வாகனக் குழு",
    roomPgManager: "அறை & பிஜி மேலாளர்",
    laundryPipeline: "சலவை குழாய்",
    
    netEarnings: "நிகர வருமானம்",
    conversion: "மாற்று விகிதம்",
    totalVolume: "மொத்த அளவு",
    avgOrder: "சராசரி ஆர்டர் மதிப்பு",
    
    confirmed: "உறுதிசெய்யப்பட்டது",
    newBookings: "புதிய முன்பதிவுகள்",
    status: "நிலை",
    liveStream: "நேரடி ஒளிபரப்பு",
    
    earningsInsight: "நேரலை: உங்கள் வருவாய் 12% அதிகரித்துள்ளது. தற்போது மிக லாபகரமானது!",
    conversionInsight: "நேரலை: 92% நிறைவு. 95% விற்பனையாளர்களை விட உங்கள் பதில் வேகம் அதிகம்!",
    volumeInsight: "நேரலை: 30+ முன்பதிவுகள். அதிக தெரிவுநிலைக்கு இருக்கை நிலவரத்தை புதுப்பிக்கவும்.",
    avgOrderInsight: "நேரலை: சராசரி கட்டணம் ₹3,200. சராசரியை உயர்த்த பிரீமியம் தொகுப்புகளை வழங்கவும்.",
    
    earningsDesc: "சேவைக் கட்டணத்திற்குப் பின் நிகர வருமானம்",
    conversionDesc: "நிறைவடைந்த முன்பதிவுகளின் சதவீதம்",
    volumeDesc: "எல்லாக் காலத்திற்குமான முன்பதிவு அளவு",
    avgOrderDesc: "சராசரி பரிவர்த்தனை மதிப்பு",
    
    withdraw: "பணத்தை எடு",
    statements: "அறிக்கைகள்",
    changeLang: "மொழியை மாற்று",
    
    recentActivity: "சமீபத்திய செயல்பாடு",
    noActivity: "சமீபத்திய செயல்பாடு ஏதுமில்லை.",
    viewCapacity: "கொள்ளளவு அமைப்புகள்",
    statusBadge: "விற்பனையாளர் நிலை",
    activeStay: "அறைகள் மேலாளர்",
    activeFleet: "வாகனங்கள் மேலாளர்"
  },
  mr: {
    dashboard: "विक्रेता डॅशबोर्ड",
    welcome: "स्वागत आहे",
    commandCenter: "कमांड सेंटर ऑनलाइन आहे.",
    syncDb: "डेटा सिंक करा",
    syncing: "सिंक होत आहे...",
    profileSettings: "प्रोफाइल सेटिंग्ज",
    analyticsOverview: "विश्लेषण विहंगावलोकन",
    revenueSales: "महसूल आणि विक्री",
    ledgerBook: "खातेवही पुस्तक",
    vehicleFleet: "वाहन ताफा",
    roomPgManager: "रुम आणि पीजी व्यवस्थापक",
    laundryPipeline: "लॉन्ड्री पाइपलाइन",
    
    netEarnings: "निव्वळ कमाई",
    conversion: "रूपांतरण दर",
    totalVolume: "एकूण प्रमाण",
    avgOrder: "सरासरी ऑर्डर मूल्य",
    
    confirmed: "पुष्टीकृत",
    newBookings: "नवीन बुकिंग",
    status: "स्थिती",
    liveStream: "लाइव्ह प्रवाह",
    
    earningsInsight: "लाइव्ह: तुमची कमाई १२% वाढली. सध्या अत्यंत फायदेशीर!",
    conversionInsight: "लाइव्ह: ९२% पूर्णता. तुमचा प्रतिसाद वेळ ९५% विक्रेत्यांपेक्षा वेगवान आहे!",
    volumeInsight: "लाइव्ह: ३०+ बुकिंग्ज. उच्च दृश्यमानतेसाठी उपलब्धता अद्ययावत ठेवा.",
    avgOrderInsight: "लाइव्ह: सरासरी तिकीट ₹३,२०० आहे. सरासरी वाढवण्यासाठी प्रीमियम पॅकेजेस द्या.",
    
    earningsDesc: "सेवा शुल्कानंतर निव्वळ कमाई",
    conversionDesc: "पूर्ण झालेल्या बुकिंगची टक्केवारी",
    volumeDesc: "आजवरचे एकूण बुकिंग प्रमाण",
    avgOrderDesc: "सरासरी व्यवहार मूल्य",
    
    withdraw: "पैसे काढा",
    statements: "स्टेटमेंट",
    changeLang: "भाषा बदला",
    
    recentActivity: "अलीकडील क्रियाकलाप",
    noActivity: "अलीकडील कोणताही क्रियाकलाप नाही.",
    viewCapacity: "क्षमता सेटिंग्ज",
    statusBadge: "विक्रेता स्थिती",
    activeStay: "रुम व्यवस्थापक",
    activeFleet: "वाहन व्यवस्थापक"
  },
  gu: {
    dashboard: "વિક્રેતા ડેશબોર્ડ",
    welcome: "સ્વાગત છે",
    commandCenter: "કમાન્ડ સેન્ટર ઓનલાઈન.",
    syncDb: "ડેટા સિંક કરો",
    syncing: "સિંક થઈ રહ્યું છે...",
    profileSettings: "પ્રોફાઇલ સેટિંગ્સ",
    analyticsOverview: "વિશ્લેષણ ઝાંખી",
    revenueSales: "આવક અને વેચાણ",
    ledgerBook: "લેજર બુક",
    vehicleFleet: "વાહન કાફલો",
    roomPgManager: "રૂમ અને પીજી મેનેજર",
    laundryPipeline: "લોન્ડ્રી પાઇપલાઇન",
    
    netEarnings: "ચોખ્ખી કમાણી",
    conversion: "રૂપાંતરણ દર",
    totalVolume: "કુલ વોલ્યુમ",
    avgOrder: "સરેરાશ ઓર્ડર મૂલ્ય",
    
    confirmed: "કન્ફર્મ કરેલ",
    newBookings: "નવી બુકિંગ",
    status: "સ્થિતિ",
    liveStream: "લાઇવ પ્રવાહ",
    
    earningsInsight: "લાઇવ: તમારી કમાણી 12% વધી. હાલમાં અત્યંત નફાકારક!",
    conversionInsight: "લાઇવ: 92% પૂર્ણતા. તમારો પ્રતિસાદ સમય 95% વિક્રેતાઓ કરતા ઝડપી છે!",
    volumeInsight: "લાઇવ: 30+ બુકિંગ. ઉચ્ચ દૃશ્યતા માટે ઉપલબ્ધતા અપડેટ રાખો.",
    avgOrderInsight: "લાઇવ: સરેરાશ ટિકિટ ₹3,200 છે. સરેરાશ વધારવા માટે પ્રીમિયમ પેકેજ આપો.",
    
    earningsDesc: "સેવા ફી પછીની ચોખ્ખી કમાણી",
    conversionDesc: "પૂર્ણ થયેલ બુકિંગની ટકાવારી",
    volumeDesc: "અત્યાર સુધીની કુલ બુકિંગ",
    avgOrderDesc: "સરેરાશ વ્યવહાર મૂલ્ય",
    
    withdraw: "પૈસા ઉપાડો",
    statements: "નિવેદનો",
    changeLang: "ભાષા બદલો",
    
    recentActivity: "તાજેતરની પ્રવૃત્તિ",
    noActivity: "કોઈ તાજેતરની પ્રવૃત્તિ નથી.",
    viewCapacity: "ક્ષમતા સેટિંગ્સ",
    statusBadge: "વિક્રેતા સ્થિતિ",
    activeStay: "રૂમ્સ મેનેજર",
    activeFleet: "વાહનો મેનેજર"
  },
  kn: {
    dashboard: "ವಿಕ್ರೇತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    welcome: "ಸ್ವಾಗತ",
    commandCenter: "ಕಮಾಂಡ್ ಸೆಂಟರ್ ಆನ್‌ಲೈನ್.",
    syncDb: "ಡೇಟಾ ಸಿಂಕ್",
    syncing: "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...",
    profileSettings: "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    analyticsOverview: "ವಿಶ್ಲೇಷಣೆ ಅವಲೋಕನ",
    revenueSales: "ಆದಾಯ మరియు ಮಾರಾಟ",
    ledgerBook: "ಲೆಡ್ಜರ್ ಪುಸ್ತಕ",
    vehicleFleet: "ವಾಹನಗಳ ಫ್ಲೀಟ್",
    roomPgManager: "ರೂಮ್ ಮತ್ತು ಪಿಜಿ ವ್ಯವಸ್ಥಾಪಕ",
    laundryPipeline: "ಲಾಂಡ್ರಿ ಪೈಪ್‌ಲೈನ್",
    
    netEarnings: "ನಿವ್ವಳ ಗಳಿಕೆ",
    conversion: "ಪರಿವರ್ತನೆ ದರ",
    totalVolume: "ಒಟ್ಟು ಪರಿಮಾಣ",
    avgOrder: "ಸರಾಸರಿ ಆರ್ಡರ್ ಮೌಲ್ಯ",
    
    confirmed: "ಖಚಿತಪಡಿಸಲಾಗಿದೆ",
    newBookings: "ಹೊಸ ಬುಕಿಂಗ್ಸ್",
    status: "ಸ್ಥಿತಿ",
    liveStream: "ಲೈವ್ ಸ್ಟ್ರೀಮ್",
    
    earningsInsight: "ಲೈವ್: ನಿಮ್ಮ ಗಳಿಕೆ 12% ಹೆಚ್ಚಾಗಿದೆ. ಪ್ರಸ್ತುತ ಅತ್ಯಂತ ಲಾಭದಾಯಕ!",
    conversionInsight: "ಲೈವ್: 92% ಯಶಸ್ಸು. ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ ಶೇ 95 ವಿಕ್ರೇತರಿಗಿಂತ ವೇಗವಾಗಿದೆ!",
    volumeInsight: "ಲೈವ್: 30+ ಬುಕಿಂಗ್. ಹೆಚ್ಚಿನ ಗೋಚರತೆಗಾಗಿ ಲಭ್ಯತೆಯನ್ನು ನವೀಕರಿಸಿ.",
    avgOrderInsight: "ಲೈವ್: ಸರಾಸರಿ ಬುಕಿಂಗ್ ₹3,200. ಸರಾಸರಿ ಹೆಚ್ಚಿಸಲು ಪ್ರೀಮಿಯಂ ಪ್ಯಾಕೇಜ್ ಸೇರಿಸಿ.",
    
    earningsDesc: "ಸೇವಾ ಶುಲ್ಕ ಕಡಿತದ ನಂತರದ ನಿವ್ವಳ ಗಳಿಕೆ",
    conversionDesc: "ಪೂರ್ಣಗೊಂಡ ಬುಕಿಂಗ್‌ಗಳ ಶೇಕಡಾವಾರು",
    volumeDesc: "ಸಾರ್ವಕಾಲಿಕ ಒಟ್ಟು ಬುಕಿಂಗ್",
    avgOrderDesc: "ಸರಾಸರಿ ವಹಿವಾಟು ಮೌಲ್ಯ",
    
    withdraw: "ಹಣ ಹಿಂಪಡೆಯಿರಿ",
    statements: "ಹೇಳಿಕೆಗಳು",
    changeLang: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
    
    recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    noActivity: "ಯಾವುದೇ ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ ಇಲ್ಲ.",
    viewCapacity: "ಸಾಮರ್ಥ್ಯ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    statusBadge: "ವಿಕ್ರೇತ ಸ್ಥಿತಿ",
    activeStay: "ರೂಮ್ಸ್ ಮ್ಯಾನೇಜರ್",
    activeFleet: "ವಾಹನಗಳ ಮ್ಯಾನೇಜರ್"
  },
  ml: {
    dashboard: "വെണ്ടർ ഡാഷ്‌ബോർഡ്",
    welcome: "സ്വാഗതം",
    commandCenter: "കമാൻഡ് സെന്റർ ഓൺലൈൻ.",
    syncDb: "ഡാറ്റ സമന്വയിപ്പിക്കുക",
    syncing: "സമന്വയിപ്പിക്കുന്നു...",
    profileSettings: "പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ",
    analyticsOverview: "വിശകലന അവലോകനം",
    revenueSales: "വരുമാനവും വിൽപ്പനയും",
    ledgerBook: "ലെഡ്ജർ ബുക്ക്",
    vehicleFleet: "വാഹന വ്യൂഹം",
    roomPgManager: "റൂം & പിജി മാനേജർ",
    laundryPipeline: "അലക്കു പൈപ്പ്ലൈൻ",
    
    netEarnings: "അറ്റ വരുമാനം",
    conversion: "കൺവേർഷൻ നിരക്ക്",
    totalVolume: "ആകെ വോളിയം",
    avgOrder: "ശരാശരി ഓർഡർ മൂല്യം",
    
    confirmed: "സ്ഥിരീകരിച്ചു",
    newBookings: "പുതിയ ബുക്കിംഗുകൾ",
    status: "നില",
    liveStream: "തത്സമയ സംപ്രേക്ഷണം",
    
    earningsInsight: "ലൈവ്: നിങ്ങളുടെ വരുമാനം 12% വർദ്ധിച്ചു. ഇപ്പോൾ വളരെ ലാഭകരമാണ്!",
    conversionInsight: "ലൈവ്: 92% പൂർത്തീകരണം. നിങ്ങളുടെ പ്രതികരണ സമയം 95% വെണ്ടർമാരേക്കാൾ വേഗതയുള്ളതാണ്!",
    volumeInsight: "ലൈവ്: 30+ ബുക്കിംഗുകൾ. ഉയർന്ന ദൃശ്യപരതയ്ക്കായി ലഭ്യത അപ്‌ഡേറ്റ് ചെയ്യുക.",
    avgOrderInsight: "ലൈവ്: ശരാശരി ടിക്കറ്റ് ₹3,200. ശരാശരി വർദ്ധിപ്പിക്കാൻ പ്രീമിയം പാക്കേജ് നൽകുക.",
    
    earningsDesc: "സേവന നിരക്കുകൾക്ക് ശേഷമുള്ള അറ്റ വരുമാനം",
    conversionDesc: "പൂർത്തിയാക്കിയ ബുക്കിംഗുകളുടെ ശതമാനം",
    volumeDesc: "എക്കാലത്തെയും ആകെ ബുക്കിംഗുകൾ",
    avgOrderDesc: "ശരാശരി ഇടപാട് മൂല്യം",
    
    withdraw: "പണം പിൻവലിക്കുക",
    statements: "സ്റ്റേറ്റ്‌മെന്റുകൾ",
    changeLang: "ഭാഷ മാറ്റുക",
    
    recentActivity: "സമീപകാല പ്രവർത്തനങ്ങൾ",
    noActivity: "സമീപകാല പ്രവർത്തനങ്ങളൊന്നും രേഖപ്പെടുത്തിയിട്ടില്ല.",
    viewCapacity: "ശേഷി ക്രമീകരണങ്ങൾ",
    statusBadge: "വെണ്ടർ നില",
    activeStay: "റൂം മാനേജർ",
    activeFleet: "വാഹന മാനേജർ"
  },
  pa: {
    dashboard: "ਵਿਕਰੇਤਾ ਡੈਸ਼ਬੋਰਡ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    commandCenter: "ਕਮਾਂਡ ਸੈਂਟਰ ਆਨਲਾਈਨ ਹੈ।",
    syncDb: "ਡਾਟਾ ਸਿੰਕ ਕਰੋ",
    syncing: "ਸਿੰਕ ਹੋ ਰਿਹਾ ਹੈ...",
    profileSettings: "ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਜ਼",
    analyticsOverview: "ਵਿਸ਼ਲੇਸ਼ਣ ਸੰਖੇਪ",
    revenueSales: "ਮਾਲੀਆ ਅਤੇ ਵਿਕਰੀ",
    ledgerBook: "ਖਾਤਾ ਬਹੀ",
    vehicleFleet: "ਵਾਹਨ ਫਲੀਟ",
    roomPgManager: "ਕਮਰਾ ਅਤੇ ਪੀਜੀ ਪ੍ਰਬੰਧਕ",
    laundryPipeline: "ਲਾਂਡਰੀ ਪਾਈਪਲਾਈਨ",
    
    netEarnings: "ਸ਼ੁੱਧ ਕਮਾਈ",
    conversion: "ਪਰਿਵਰਤਨ ਦਰ",
    totalVolume: "ਕੁੱਲ ਮਾਤਰਾ",
    avgOrder: "ਔਸਤ ਆਰਡਰ ਮੁੱਲ",
    
    confirmed: "ਪੁਸ਼ਟੀ ਕੀਤੀ",
    newBookings: "ਨਵੀਆਂ ਬੁਕਿੰਗਾਂ",
    status: "ਸਥਿਤੀ",
    liveStream: "ਲਾਈਵ ਸਟ੍ਰੀਮ",
    
    earningsInsight: "ਲਾਈਵ: ਤੁਹਾਡੀ ਕਮਾਈ 12% ਵਧੀ। ਇਸ ਵੇਲੇ ਬਹੁਤ ਲਾਭਦਾਇਕ ਹੈ!",
    conversionInsight: "ਲਾਈਵ: 92% ਪੂਰਨਤਾ। ਤੁਹਾਡਾ ਜਵਾਬ ਸਮਾਂ 95% ਵਿਕਰੇਤਾਵਾਂ ਨਾਲੋਂ ਤੇਜ਼ ਹੈ!",
    volumeInsight: "ਲਾਈਵ: 30+ ਬੁਕਿੰਗਾਂ। ਉੱਚ ਦਿੱਖ ਲਈ ਉਪਲਬਧਤਾ ਅਪਡੇਟ ਰੱਖੋ।",
    avgOrderInsight: "ਲਾਈਵ: ਔਸत ਟਿਕਟ ₹3,200 ਹੈ। ਔਸਤ ਵਧਾਉਣ ਲਈ ਪ੍ਰੀਮੀਅਮ ਪੈਕੇਜ ਪੇਸ਼ ਕਰੋ।",
    
    earningsDesc: "ਸੇਵਾ ਫੀਸ ਤੋਂ ਬਾਅद ਸ਼ੁੱਧ ਕਮਾਈ",
    conversionDesc: "ਪੂਰੀਆਂ ਹੋਈਆਂ ਬੁਕਿੰਗਾਂ ਦੀ ਪ੍ਰਤੀਸ਼ਤਤਾ",
    volumeDesc: "ਹੁਣ ਤੱਕ ਦੀਆਂ ਕੁੱਲ ਬੁਕਿੰਗਾਂ",
    avgOrderDesc: "ਔਸਤ ਲੈਣ-ਦੇਣ ਮੁੱਲ",
    
    withdraw: "ਪੈਸੇ ਕਢਵਾਓ",
    statements: "ਸਟੇਟਮੈਂਟਾਂ",
    changeLang: "ਭਾਸ਼ਾ ਬਦਲੋ",
    
    recentActivity: "ਹਾਲੀਆ ਸਰਗਰਮੀ",
    noActivity: "ਕੋਈ ਹਾਲੀਆ ਸਰਗਰਮੀ ਦਰਜ ਨਹੀਂ ਹੈ।",
    viewCapacity: "ਸਮਰੱਥਾ ਸੈਟਿੰਗਾਂ ਦੇਖੋ",
    statusBadge: "ਵਿਕਰੇਤਾ ਸਥਿਤੀ",
    activeStay: "ਕਮਰੇ ਪ੍ਰਬੰਧਕ",
    activeFleet: "ਵਾਹਨ ਪ੍ਰਬੰਧਕ"
  }
};
