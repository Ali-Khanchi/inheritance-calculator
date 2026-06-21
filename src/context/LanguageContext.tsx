import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

// Flat structure: English text keys map directly to Arabic translations.
const arabicTranslations: Record<string, string> = {
  // Navigation & General UI
  Home: 'الرئيسية',
  Examples: 'الأمثلة',
  Navigation: 'التنقل',
  Close: 'إغلاق',
  'Group 1 Heirs': 'ورثة المجموعة الأولى',
  'Group 2 Heirs': 'ورثة المجموعة الثانية',
  'Case Distribution Examples': 'أمثلة توزيع الحالات',
  'Pre-calculated reference guides for Group 1 heirs':
    'أدلة مرجعية محسوبة مسبقًا لورثة المجموعة الأولى',
  'Second Group Inheritance Examples': 'أمثلة إرث المجموعة الثانية',
  'Pre-calculated reference guides for Group 2 heirs (Siblings & Grandparents)':
    'أدلة مرجعية محسوبة مسبقًا لورثة المجموعة الثانية (الإخوة والأجداد)',
  Total: 'الإجمالي',
  'Inputs:': 'المدخلات:',

  // Subcategories (Group 1 & 2)
  'Base/Fall-through Scenarios': 'الحالات الأساسية / الاحتياطية',
  'Children Calculations': 'حسابات الأولاد',
  'Spouse Calculations (Deceased Male)': 'حسابات الزوجة (المتوفى ذكر)',
  'Spouse Calculations (Deceased Female)': 'حسابات الزوج (المتوفاة أنثى)',
  'Both Parents Calculations': 'حسابات كلا الأبوين معًا',
  'Single Parent Calculations': 'حسابات أحد الأبوين منفردًا',
  'Extra Complex Scenarios': 'مسائل إضافية مركبة',
  'Siblings Only Calculations': 'حسابات الإخوة فقط',
  'Mixed Siblings Complex Calculations': 'حسابات الإخوة المختلطة المركبة',
  'Grandparents Only Calculations': 'حسابات الأجداد فقط',
  'Grandparents and Spouses': 'الأجداد مع الزوج أو الزوجة',
  'Grandparents and Siblings Combinations': 'اجتماع الأجداد والإخوة',

  // Input Keys & Output Label Variables (Parsed dynamically via CamelCase splitting)
  Father: 'الأب',
  Mother: 'الأم',
  Husband: 'الزوج',
  Wife: 'الزوجة',
  'Wife (each)': 'الزوجة (لكل واحدة)',
  'Son (each)': 'الابن (لكل واحد)',
  'Daughter (each)': 'الابنة (لكل واحدة)',
  Musalahah: 'المصالحة',
  Settlement: 'المصالحة / التسوية',
  Sons: 'الأبناء',
  Daughters: 'البنات',
  Wives: 'الزوجات',
  'Deceased Is Male': 'المتوفى ذكر',
  'Deceased Is Female': 'المتوفى أنثى',
  'Father Alive': 'الأب على قيد الحياة',
  'Mother Alive': 'الأم على قيد الحياة',
  'Has S C': 'يوجد إخوة حاجبون للأم',
  'Has Husband': 'يوجد زوج',
  'Full Brother': 'الأخ الشقيق',
  'Full Sister': 'الأخت الشقيقة',
  'Full Brothers': 'الإخوة الأشقاء',
  'Full Sisters': 'الأخوات الشقيقات',
  'Paternal Brother': 'الأخ لأب',
  'Paternal Sister': 'الأخت لأب',
  'Paternal Brothers': 'الإخوة لأب',
  PaternalSisters: 'الأخوات لأب',
  'Paternal Sisters': 'الأخوات لأب',
  'Maternal Brother': 'الأخ لأم',
  'Maternal Sister': 'الأخت لأم',
  'Maternal Brothers': 'الإخوة لأم',
  'Maternal Sisters': 'الأخوات لأم',
  'Paternal Grandpa': 'الجد لأب',
  'Paternal Grandma': 'الجدة لأب',
  'Maternal Grandpa': 'الجد لأم',
  'Maternal Grandma': 'الجدة لأم',

  // --- Group 1 Example Titles ---
  'No relatives in first circle': 'لا يوجد أقارب في الطبقة الأولى',
  'Single son gets full share': 'ابن واحد يحصل على التركة كاملة',
  'Single daughter gets full share': 'بنت واحدة تحصل على التركة كاملة',
  'Children get full share, son twice daughter':
    'الأولاد يحصلون على التركة، للذكر مثل حظ الأنثيين',
  'Children get full share, sons get same share':
    'الأولاد يحصلون على التركة، والأبناء يتقاسمون بالتساوي',
  'Children get full share, daughters get same share':
    'الأولاد يحصلون على التركة، والبنات يتقاسمن بالتساوي',
  'Many children, equal number of sons and daughters':
    'أولاد كثر، عدد متساوٍ من الأبناء والبنات',
  'Many children, uneven number of sons and daughters':
    'أولاد كثر، عدد غير متساوٍ من الأبناء والبنات',
  'No children, wife gets one quarter': 'لا يوجد أولاد، الزوجة تحصل على الربع',
  'No children, wives split one quarter':
    'لا يوجد أولاد، الزوجات يتقاسمن الربع',
  'One son, wife gets one eighth': 'ابن واحد، الزوجة تحصل على الثمن',
  'One daughter, wife gets one eighth': 'بنت واحدة، الزوجة تحصل على الثمن',
  'Many children, wife gets one eighth': 'أولاد كثر، الزوجة تحصل على الثمن',
  'No children, husband gets one half': 'لا يوجد أولاد، الزوج يحصل على النصف',
  'One daughter, husband gets one quarter': 'بنت واحدة، الزوج يحصل على الربع',
  'One son, husband gets one quarter': 'ابن واحد، الزوج يحصل على الربع',
  'Many children, husband gets one quarter': 'أولاد كثر، الزوج يحصل على الربع',
  'No children, no siblings, both parents alive':
    'لا أولاد ولا إخوة، الأبوان على قيد الحياة',
  'No children, has siblings, both parents alive':
    'لا أولاد ويوجد إخوة حجب، الأبوان على قيد الحياة',
  'One daughter, no siblings, both parents alive':
    'بنت واحدة ولا إخوة، الأبوان على قيد الحياة',
  'One daughter, has siblings, both parents alive':
    'بنت واحدة ويوجد إخوة حجب، الأبوان على قيد الحياة',
  'One son, both parents alive': 'ابن واحد، الأبوان على قيد الحياة',
  'Two daughters, both parents alive': 'بنتان، الأبوان على قيد الحياة',
  'One daughter, single parent': 'بنت واحدة، أحد الأبوين فقط على قيد الحياة',
  'Two daughters, single parent': 'بنتان، أحد الأبوين فقط على قيد الحياة',
  'One son, single parent': 'ابن واحد، أحد الأبوين فقط على قيد الحياة',
  'Two sons, single parent': 'ابنان، أحد الأبوين فقط على قيد الحياة',
  'Multiple children, single parent':
    'أولاد متعددون، أحد الأبوين فقط على قيد الحياة',
  'One wife, one daughter, has siblings, both parents':
    'زوجة واحدة وبنت واحدة مع وجود إخوة حجب وكلا الأبوين',

  // --- Group 2 Example Titles ---
  'Rule 1: Only 1 full brother inherits entire estate':
    'القاعدة 1: أخ شقيق واحد يرث التركة كاملة',
  'Rule 2: Multiple full brothers divide estate equally':
    'القاعدة 2: إخوة أشقاء متعددون يتقاسمون التركة بالتساوي',
  'Rule 2: Multiple full sisters divide estate equally':
    'القاعدة 2: أخوات شقيقات متعددات يتقاسمن التركة بالتساوي',
  'Rule 3: Full brothers and sisters split with brother receiving twice the share of sister':
    'القاعدة 3: الإخوة والأخوات الأشقاء يتقاسمون للذكر مثل حظ الأنثيين',
  'Rule 4: Paternal half-siblings do not inherit if full brothers and sisters exist':
    'القاعدة 4: الإخوة لأب يسقطون من الإرث مع وجود إخوة أشقاء',
  'Rule 5: Only 1 paternal half-brother gets entire estate if no full siblings exist':
    'القاعدة 5: أخ لأب واحد يرث التركة كاملة عند عدم وجود أشقاء',
  'Rule 5: Only 1 paternal half-sister gets entire estate if no full siblings exist':
    'القاعدة 5: أخت لأب واحدة ترث التركة كاملة عند عدم وجود أشقاء',
  'Rule 6: Paternal half-siblings split with brother twice the share of sister if no full siblings exist':
    'القاعدة 6: الإخوة لأب يتقاسمون للذكر مثل حظ الأنثيين عند عدم وجود أشقاء',
  'Rule 7: Only 1 maternal half-sibling inherits entire estate (Brother)':
    'القاعدة 7: أخ لأم واحد ينفرد بالتركة كاملة',
  'Rule 7: Only 1 maternal half-sibling inherits entire estate (Sister)':
    'القاعدة 7: أخت لأم واحدة تنفرد بالتركة كاملة',
  'Rule 8: Multiple maternal half-siblings divide estate equally regardless of gender':
    'القاعدة 8: الإخوة لأم المتعددون يتقاسمون الفريضة بالتساوي بين الذكور والإناث',
  'Rule 9: Full siblings, paternal half-siblings, and 1 maternal half-sibling':
    'القاعدة 9: أشقاء وإخوة لأب مع أخ لأم واحد',
  'Rule 10: Full siblings, paternal half-siblings, and multiple maternal half-siblings':
    'القاعدة 10: أشقاء وإخوة لأب مع إخوة لأم متعددين',
  'Rule 11: No full siblings, paternal half-siblings, and 1 maternal half-sibling':
    'القاعدة 11: لا يوجد أشقاء، مع وجود إخوة لأب وأخ لأم واحد',
  'Rule 12: No full siblings, paternal half-siblings, and multiple maternal half-siblings':
    'القاعدة 12: لا يوجد أشقاء، مع وجود إخوة لأب وإخوة لأم متعددين',
  'Rule 13: Deduction for spouse is taken from full/paternal siblings, not maternal siblings':
    'القاعدة 13: النقص بسبب الزوج/الزوجة يقع على عاتق الأشقاء أو الإخوة لأب لا الإخوة لأم',
  'Rule 14: Only grandfather, inherits entire estate':
    'القاعدة 14: الجد لأب وحده ينفرد بالتركة كاملة',
  'Rule 14: Only grandmother, inherits entire estate':
    'القاعدة 14: الجدة لأم وحدها تنفرد بالتركة كاملة',
  'Rule 15: Only paternal grandparents split 2:1 (grandfather twice grandmother)':
    'القاعدة 15: الأجداد من جهة الأب يتقاسمون التركة تفاوتًا للذكر مثل حظ الأنثيين',
  'Rule 16: Only maternal grandparents split estate equally':
    'القاعدة 16: الأجداد من جهة الأم يتقاسمون التركة بالتساوي مطلقًا',
  'Rule 17: One paternal and one maternal grandparent split 2:1 by side (2 grandpas)':
    'القاعدة 17: جد لأب وجد لأم يتقاسمان بنسبة الثلثين والثلث بحسب الجهة',
  'Rule 17: One paternal and one maternal grandparent split 2:1 by side (paternal grandma and maternal grandpa)':
    'القاعدة 17: جدة لأب وجد لأم يتقاسمان بنسبة الثلثين والثلث بحسب الجهة',
  'Rule 18: Both paternal and maternal grandparents mix':
    'القاعدة 18: اختلاط الأجداد من جهتي الأب والأم معًا',
  'Rule 19: Only wife and grandparents':
    'القاعدة 19: اجتماع الزوجة مع الأجداد من الطرفين',
  'Rule 20: Only husband and grandparents':
    'القاعدة 20: اجتماع الزوج مع الأجداد من الطرفين',
  'Rule 21: All maternal relatives divide estate equally':
    'القاعدة 21: جميع الأقارب من جهة الأم يتقاسمون حصتهم بالتساوي',
  'Rule 22: All paternal relatives split with male twice female':
    'القاعدة 22: جميع الأقارب من جهة الأب يتقاسمون للذكر مثل حظ الأنثيين',
  'Rule 23: Paternal and maternal mix (1/3 maternal, 2/3 paternal male twice female)':
    'القاعدة 23: خلط جهتي الأب والأم (الثلث بالتساوي للأم، والثلثان تفاوتًا للأب)',
  'Rule 24: Paternal grandparents and 1 maternal half-sibling (1/6 maternal, remainder paternal)':
    'القاعدة 24: أجداد لأب وأخ لأم واحد (السدس مفرداً للأم، والباقي للأب)',
  'Rule 25: Paternal grandparents and multiple maternal half-siblings (1/3 maternal, remainder paternal)':
    'القاعدة 25: أجداد لأب وإخوة لأم متعددون (الثلث للأم بالتساوي، والباقي للأب)',
  'Rule 26: Maternal grandparents and multiple paternal half-siblings':
    'القاعدة 26: أجداد لأم وإخوة لأب متعددون',
  'Rule 27: Maternal grandparents and only 1 paternal half-sister (includes musalahah)':
    'القاعدة 27: أجداد لأم وأخت لأب واحدة (تستلزم المصالحة)',
  'Rule 28: Maternal/Paternal grandparents mixed with paternal half-siblings':
    'القاعدة 28: أجداد من الطرفين مختلطون مع إخوة لأب',
  'Rule 29: Grandparents and maternal half-sibling mix':
    'القاعدة 29: اجتماع الأجداد من الطرفين مع الإخوة لأم',
  'Rule 30: Paternal and maternal siblings with paternal grandparent (only 1 maternal sibling)':
    'القاعدة 30: إخوة لأب ولأم مع جد لأب (بوجود أخ لأم واحد)',
  'Rule 30: Paternal and maternal siblings with paternal grandparent (2 maternal siblings)':
    'القاعدة 30: إخوة لأب ولأم مع جد لأب (بوجود أخوان لأم)',
  'Rule 31: Paternal and maternal siblings with maternal grandparent':
    'القاعدة 31: إخوة لأب ولأم مع جد لأم'
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [lang, setLang] = useState<Language>('en');
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  // If Arabic is active, look up the translation. Otherwise, pass through the key (English text).
  const t = (key: string) =>
    lang === 'ar' ? arabicTranslations[key] || key : key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
