import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './language-context'
import { STORAGE_KEYS } from '../utils/constants'

const nepaliTranslations = {
  Home: 'गृहपृष्ठ',
  Features: 'विशेषताहरू',
  'How It Works': 'कसरी काम गर्छ',
  Pricing: 'मूल्य',
  Contact: 'सम्पर्क',
  About: 'हाम्रो बारेमा',
  Dashboard: 'ड्यासबोर्ड',
  Login: 'लगइन',
  'Get Started': 'सुरु गर्नुहोस्',
  'Personal finance tools for everyday decisions.': 'दैनिक निर्णयका लागि व्यक्तिगत वित्तीय उपकरणहरू।',
  'Personal finance for Nepal': 'नेपालका लागि व्यक्तिगत वित्त व्यवस्थापन',
  'Know Where Your Money Is.': 'तपाईंको पैसा कहाँ छ थाहा पाउनुहोस्।',
  "Know Where It’s Going.": 'यो कहाँ जाँदैछ थाहा पाउनुहोस्।',
  "Know Where It's Going.": 'यो कहाँ जाँदैछ थाहा पाउनुहोस्।',
  'Finora brings bank accounts, cash, eSewa, Khalti, and Fonepay into one calm picture so you can track spending, set budgets, and see whether your goals are realistic.': 'Finora ले बैंक खाता, नगद, eSewa, Khalti र Fonepay लाई एउटै स्पष्ट दृश्यमा ल्याउँछ, जसबाट तपाईं खर्च ट्र्याक गर्न, बजेट बनाउन र आफ्ना लक्ष्य सम्भव छन् कि छैनन् हेर्न सक्नुहुन्छ।',
  'Sign in': 'साइन इन',
  'Built around NPR.': 'नेपाली रुपैयाँलाई आधार मानेर बनाइएको।',
  'What Finora helps you do': 'Finora ले तपाईंलाई के गर्न मद्दत गर्छ',
  'The product is built around a clear picture of money, not a crowded ledger.': 'यो सेवा जटिल हिसाबकिताब होइन, पैसाको स्पष्ट चित्र दिन बनाइएको हो।',
  'Expense Tracking': 'खर्च ट्र्याकिङ',
  'Record income and expenses with category, date, and payment source.': 'आम्दानी र खर्चलाई वर्ग, मिति र भुक्तानी स्रोतसहित रेकर्ड गर्नुहोस्।',
  'Budget Management': 'बजेट व्यवस्थापन',
  'See spent versus remaining for Food, Rent, Transport, and more.': 'खाना, भाडा, यातायात र अन्य शीर्षकमा खर्च भएको र बाँकी रकम हेर्नुहोस्।',
  'Financial Analytics': 'वित्तीय विश्लेषण',
  'Charts for income vs expense, category mix, and savings trend.': 'आम्दानी र खर्च, खर्चका वर्ग तथा बचतको प्रवृत्तिका चार्टहरू।',
  'Savings Goals': 'बचत लक्ष्यहरू',
  'Track Emergency Fund, laptop, travel, education, and other targets.': 'आपत्कालीन कोष, ल्यापटप, यात्रा, शिक्षा र अन्य लक्ष्यहरू ट्र्याक गर्नुहोस्।',
  'Multiple Money Sources': 'धेरै रकम स्रोतहरू',
  'Bank, cash, eSewa, Khalti, and Fonepay in one overview.': 'बैंक, नगद, eSewa, Khalti र Fonepay एउटै दृश्यमा।',
  'Financial Insights': 'वित्तीय जानकारी',
  'Plain-language notes such as food spend rising or a goal staying on track.': 'खानाको खर्च बढेको वा लक्ष्य योजनाअनुसार अघि बढेको जस्ता सरल जानकारी।',
  'How it works': 'कसरी काम गर्छ',
  'Add your money sources': 'आफ्ना रकमका स्रोत थप्नुहोस्',
  'Track transactions': 'कारोबार ट्र्याक गर्नुहोस्',
  'Set budgets': 'बजेट तय गर्नुहोस्',
  'Create savings goals': 'बचत लक्ष्य बनाउनुहोस्',
  'Understand your financial progress': 'आफ्नो वित्तीय प्रगति बुझ्नुहोस्',
  'Built for the way you manage money in Nepal.': 'नेपालमा तपाईंले पैसा व्यवस्थापन गर्ने तरिकाअनुसार बनाइएको।',
  'Balances are shown in NPR by default. Sources match everyday use: cash in hand, a bank account, and wallets you already pay with.': 'खाताको मौज्दात पूर्वनिर्धारित रूपमा नेपाली रुपैयाँमा देखाइन्छ। नगद, बैंक खाता र तपाईंले प्रयोग गर्ने डिजिटल वालेटहरू समेटिएका छन्।',
  'Start understanding your money today.': 'आजै आफ्नो पैसा बुझ्न सुरु गर्नुहोस्।',
  'Create an account to organize your money, track spending, and build a plan around your goals.': 'पैसा व्यवस्थित गर्न, खर्च ट्र्याक गर्न र आफ्ना लक्ष्यअनुसार योजना बनाउन खाता खोल्नुहोस्।',
  'Open navigation': 'नेभिगेसन खोल्नुहोस्',
  'Overview': 'अवलोकन',
  'Transactions': 'कारोबार',
  'Budgets': 'बजेट',
  'Analytics': 'विश्लेषण',
  'Accounts': 'खाताहरू',
  'Savings': 'बचत',
  'Reports': 'प्रतिवेदन',
  'Notifications': 'सूचनाहरू',
  'Settings': 'सेटिङहरू',
  'Activity': 'गतिविधि',
  'Money': 'पैसा',
  'Insights': 'अन्तर्दृष्टि',
  'Know where your money is.': 'तपाईंको पैसा कहाँ छ थाहा पाउनुहोस्।',
  'Log out': 'लगआउट',
  Translator: 'अनुवादक',
  'English to Nepali': 'अंग्रेजीबाट नेपालीमा',
  'Translate English text into Nepali. Translations are saved to your account.': 'अंग्रेजी पाठलाई नेपालीमा अनुवाद गर्नुहोस्। अनुवादहरू तपाईंको खातामा सुरक्षित हुन्छन्।',
  English: 'अंग्रेजी',
  Nepali: 'नेपाली',
  'Enter English text...': 'अंग्रेजी पाठ लेख्नुहोस्...',
  'Your translation will appear here.': 'तपाईंको अनुवाद यहाँ देखिनेछ।',
  'Translating...': 'अनुवाद हुँदैछ...',
  Translate: 'अनुवाद गर्नुहोस्',
  'Translation failed': 'अनुवाद असफल भयो',
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEYS.language) || 'en')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.language, language)
    document.documentElement.lang = language === 'ne' ? 'ne' : 'en'
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'en' ? 'ne' : 'en')),
      t: (text) => (language === 'ne' ? nepaliTranslations[text] || text : text),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
