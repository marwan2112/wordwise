// gapfillDB.js - قاعدة بيانات أسئلة ملء الفراغ
// يمكنك إضافة المزيد من الأسئلة حسب الحاجة
window.gapfillDB = {
    // هيكل البيانات: مفتاح = معرف الكلمة (مثلاً "1-1") أو "lessonId_wordId"
    // القيمة = مصفوفة تحتوي على كائنات السؤال
    "1-1": [ // كلمة "Hi" في الدرس 1
        {
            sentence: "______, how are you?",
            options: ["Hi", "Hello", "Goodbye", "Morning"],
            originalSentence: "Hi, how are you?"
        },
        {
            sentence: "She said ______ to her friend.",
            options: ["Hi", "Bye", "Thanks", "Sorry"],
            originalSentence: "She said hi to her friend."
        }
    ],
    "1-2": [ // كلمة "Good morning"
        {
            sentence: "______, class!",
            options: ["Good morning", "Good afternoon", "Good evening", "Good night"],
            originalSentence: "Good morning, class!"
        }
    ],
    // يمكنك إضافة بقية الكلمات بنفس الشكل
    // لإضافة سؤال بسرعة، انسخ هذا النموذج:
    // "lessonId-wordId": [
    //     {
    //         sentence: "الجملة مع ______ مكان الكلمة",
    //         options: ["خيار1", "خيار2", "خيار3", "خيار4"],
    //         originalSentence: "الجملة الأصلية بدون فراغ"
    //     }
    // ]
};

// يمكن أيضاً إضافة أسئلة للكلمات المضافة من قبل المستخدم (تبدأ معرفاتها بـ "u")
