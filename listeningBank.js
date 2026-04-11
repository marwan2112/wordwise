// listeningBank.js - بنك الأسئلة السماعية لاختبار المستوى المتكيف
window.listeningBank = {
    A1: [
        {
            id: "list_A1_01",
            audio: "audio/level_test/A1_Q01.mp3",
            text: "How old is Tom?",
            options: ["Twelve", "Twenty", "Thirty"],
            correct: "Twenty"
        },
        {
            id: "list_A1_02",
            audio: "audio/level_test/A1_Q02.mp3",
            text: "Where is the cat?",
            options: ["On the table", "Under the table", "Behind the door"],
            correct: "Under the table"
        },
        {
            id: "list_A1_03",
            audio: "audio/level_test/A1_Q03.mp3",
            text: "How many apples are in the bag?",
            options: ["One", "Two", "Three"],
            correct: "Two"
        },
        {
            id: "list_A1_04",
            audio: "audio/level_test/A1_Q04.mp3",
            text: "Who is at the door?",
            options: ["Tom's mother", "Tom's sister", "Tom's friend"],
            correct: "Tom's sister"
        },
        {
            id: "list_A1_05",
            audio: "audio/level_test/A1_Q05.mp3",
            text: "When is the museum closed?",
            options: ["On Tuesdays", "On Sundays", "On Mondays"],
            correct: "On Mondays"
        }
    ],
    A2: [
        {
            id: "list_A2_01",
            audio: "audio/level_test/A2_Q01.mp3",
            text: "What does the woman order to drink?",
            options: ["Water", "Orange juice", "Tomato soup"],
            correct: "Orange juice"
        },
        {
            id: "list_A2_02",
            audio: "audio/level_test/A2_Q02.mp3",
            text: "When will the train to Manchester leave?",
            options: ["At 5:15", "At 5:35", "At 5:50"],
            correct: "At 5:35"
        },
        {
            id: "list_A2_03",
            audio: "audio/level_test/A2_Q03.mp3",
            text: "What did the man think about the movie?",
            options: ["It was boring", "It was funny", "It was scary"],
            correct: "It was funny"
        },
        {
            id: "list_A2_04",
            audio: "audio/level_test/A2_Q04.mp3",
            text: "What time is David Miller's appointment?",
            options: ["Thursday at 10 AM", "Friday at 2 PM", "Friday at 10 AM"],
            correct: "Friday at 2 PM"
        },
        {
            id: "list_A2_05",
            audio: "audio/level_test/A2_Q05.mp3",
            text: "How much does the woman pay for the shirt?",
            options: ["$30", "$22", "$20"],
            correct: "$22"
        }
    ],
    B1: [
        {
            id: "list_B1_01",
            audio: "audio/level_test/B1_Q01.mp3",
            text: "What does Anna ask Mark to do?",
            options: ["Write the report", "Check the numbers on page 5", "Email the report to the boss"],
            correct: "Check the numbers on page 5"
        },
        {
            id: "list_B1_02",
            audio: "audio/level_test/B1_Q02.mp3",
            text: "Which gate should passengers for Dublin go to?",
            options: ["Gate 7", "Gate 12", "Gate 20"],
            correct: "Gate 12"
        },
        {
            id: "list_B1_03",
            audio: "audio/level_test/B1_Q03.mp3",
            text: "Who is the character Henry based on?",
            options: ["The author's father", "The author's uncle", "The author's grandfather"],
            correct: "The author's uncle"
        },
        {
            id: "list_B1_04",
            audio: "audio/level_test/B1_Q04.mp3",
            text: "What will they do in the morning?",
            options: ["Go to the beach", "Go to the art gallery", "Stay at home"],
            correct: "Go to the art gallery"
        },
        {
            id: "list_B1_05",
            audio: "audio/level_test/B1_Q05.mp3",
            text: "Why should Mrs. Parker call back?",
            options: ["Because her test results are abnormal", "To schedule a follow-up appointment", "To change her office hours"],
            correct: "To schedule a follow-up appointment"
        }
    ],
    B2: [
        {
            id: "list_B2_01",
            audio: "audio/level_test/B2_Q01.mp3",
            text: "According to the lecturer, what is the most effective action for the environment?",
            options: ["Recycling plastic", "Reducing consumption", "Buying new clothes"],
            correct: "Reducing consumption"
        },
        {
            id: "list_B2_02",
            audio: "audio/level_test/B2_Q02.mp3",
            text: "How much will the tourist pay for two student tickets?",
            options: ["$45", "$70", "$90"],
            correct: "$70"
        },
        {
            id: "list_B2_03",
            audio: "audio/level_test/B2_Q03.mp3",
            text: "What does Dr. Lopez say is the main problem with screen time for older children?",
            options: ["It causes poor sleep", "It replaces physical activity and social time", "It exposes them to bad content"],
            correct: "It replaces physical activity and social time"
        },
        {
            id: "list_B2_04",
            audio: "audio/level_test/B2_Q04.mp3",
            text: "What advice does the speaker give to newcomers?",
            options: ["Always look at the map", "Don't use the Tube at first", "Ask station staff for help"],
            correct: "Ask station staff for help"
        },
        {
            id: "list_B2_05",
            audio: "audio/level_test/B2_Q05.mp3",
            text: "What does Sarah think is the cause of lower customer satisfaction in the afternoons?",
            options: ["Poor product quality", "Not enough staff", "Bad customer service training"],
            correct: "Not enough staff"
        }
    ],
    // يمكن إضافة مستويات C1 و C2 بنفس البنية إذا توفرت الأسئلة
    C1: [],
    C2: []
};

// التأكد من وجود بيانات كافية لكل مستوى (يمكن إضافة أسئلة إضافية هنا لاحقاً)
if (!window.listeningBank) window.listeningBank = {};
