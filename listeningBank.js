// listeningBank.js - بنك الأسئلة السماعية لاختبار المستوى المتكيف
window.listeningBank = {
    A1: [
        { 
            id: "list_A1_01", 
            audio: "audio/level_test/A1 Q01.mp4", 
            text: "How old is Tom?",
            options: ["Twelve", "Twenty", "Thirty"], 
            correct: "Twenty",
            transcript: "Woman: Hello. What's your name? Man: My name is Tom. Woman: How old are you, Tom? Man: I am twenty years old."
        },
        { 
            id: "list_A1_02", 
            audio: "audio/level_test/A1 Q02.mp4", 
            text: "Where is the cat?",
            options: ["On the table", "Under the table", "Behind the door"], 
            correct: "Under the table",
            transcript: "Man: Where is the cat? Woman: Look, it's under the table. Man: Oh yes, I see it."
        },
        { 
            id: "list_A1_03", 
            audio: "audio/level_test/A1 Q03.mp4", 
            text: "How many apples are in the bag?",
            options: ["One", "Two", "Three"], 
            correct: "Two",
            transcript: "Woman: What do you have in your bag? Man: I have two apples and a banana. Woman: No sandwich? Man: No, no sandwich today."
        },
        { 
            id: "list_A1_04", 
            audio: "audio/level_test/A1 Q04.mp4", 
            text: "Who is at the door?",
            options: ["Tom's mother", "Tom's sister", "Tom's friend"], 
            correct: "Tom's sister",
            transcript: "(Doorbell rings) Man: Who is it? Woman: It's Sarah, your sister. Open the door, please. Man: Okay, coming."
        },
        { 
            id: "list_A1_05", 
            audio: "audio/level_test/A1 Q05.mp4", 
            text: "When is the museum closed?",
            options: ["On Tuesdays", "On Sundays", "On Mondays"], 
            correct: "On Mondays",
            transcript: "Woman: Is the museum open today? Man: No, it's closed on Mondays. Come back tomorrow. Woman: Okay, thank you."
        }
    ],
    A2: [
        { 
            id: "list_A2_01", 
            audio: "audio/level_test/A2 Q01.mp4", 
            text: "What does the woman order to drink?",
            options: ["Water", "Orange juice", "Tomato soup"], 
            correct: "Orange juice",
            transcript: "Waiter: Are you ready to order? Man: Yes, I'll have the chicken salad, please. Woman: And I'll have the tomato soup. Waiter: Anything to drink? Man: Just water. Woman: Orange juice for me."
        },
        { 
            id: "list_A2_02", 
            audio: "audio/level_test/A2 Q02.mp4", 
            text: "When will the train to Manchester leave?",
            options: ["At 5:15", "At 5:35", "At 5:50"], 
            correct: "At 5:35",
            transcript: "Announcer: Attention, please. The 5:15 train to Manchester is delayed by 20 minutes. It will now depart at 5:35 from platform 3. We apologise for the inconvenience."
        },
        { 
            id: "list_A2_03", 
            audio: "audio/level_test/A2 Q03.mp4", 
            text: "What did the man think about the movie?",
            options: ["It was boring", "It was funny", "It was scary"], 
            correct: "It was funny",
            transcript: "Woman: What did you do yesterday evening? Man: I watched a movie at home. It was very funny. Woman: Oh, what was it called? Man: 'The Crazy Neighbour'. Woman: I saw that last week. I didn't like it much."
        },
        { 
            id: "list_A2_04", 
            audio: "audio/level_test/A2 Q04.mp4", 
            text: "What time is David Miller's appointment?",
            options: ["Thursday at 10 AM", "Friday at 2 PM", "Friday at 10 AM"], 
            correct: "Friday at 2 PM",
            transcript: "Doctor's receptionist: Good morning, Park Street Surgery. How can I help you? Man: I'd like to make an appointment with Dr. Jones, please. Receptionist: Dr. Jones is available on Thursday at 10 AM or Friday at 2 PM. Man: I'll take Friday at 2 PM. Receptionist: Okay, what's your name? Man: David Miller."
        },
        { 
            id: "list_A2_05", 
            audio: "audio/level_test/A2 Q05.mp4", 
            text: "How much does the woman pay for the shirt?",
            options: ["$30", "$22", "$20"], 
            correct: "$22",
            transcript: "Woman: Excuse me, how much is this blue shirt? Shop assistant: It's normally $30, but today it's on sale for $22. Woman: Great, I'll take it. And do you have it in large? Shop assistant: Yes, here you go."
        }
    ],
    B1: [
        { 
            id: "list_B1_01", 
            audio: "audio/level_test/B1 Q01.mp4", 
            text: "What does Anna ask Mark to do?",
            options: ["Write the report", "Check the numbers on page 5", "Email the report to the boss"], 
            correct: "Check the numbers on page 5",
            transcript: "Mark: Hi, Anna. Did you finish the report? Anna: Almost. I just need to add the sales figures from last quarter. Mark: The boss needs it by 3 PM. Anna: Don't worry, I'll email it to him before lunch. I've already checked most of the data. Mark: Great. Let me know if you need help with the graphs. Anna: Actually, could you double-check the numbers on page 5? I'm not 100% sure. Mark: Sure, no problem."
        },
        { 
            id: "list_B1_02", 
            audio: "audio/level_test/B1 Q02.mp4", 
            text: "Which gate should passengers for Dublin go to?",
            options: ["Gate 7", "Gate 12", "Gate 20"], 
            correct: "Gate 12",
            transcript: "Announcer: This is a final boarding call for flight BA 247 to Dublin. Passengers travelling to Dublin, please proceed immediately to gate 12. The gate will close in five minutes. Passengers Smith and Johnson, please contact ground staff at the information desk."
        },
        { 
            id: "list_B1_03", 
            audio: "audio/level_test/B1 Q03.mp4", 
            text: "Who is the character Henry based on?",
            options: ["The author's father", "The author's uncle", "The author's grandfather"], 
            correct: "The author's uncle",
            transcript: "Interviewer: Your new book, 'The Silent Garden', has become very popular. How long did it take you to write it? Author: About two years. But the idea came to me much earlier, maybe five years ago, when I visited my grandmother's old house. Interviewer: And who is your favourite character in the book? Author: Definitely the old gardener, Henry. He's based on my uncle. Interviewer: Will there be a sequel? Author: I'm thinking about it, but no promises yet."
        },
        { 
            id: "list_B1_04", 
            audio: "audio/level_test/B1 Q04.mp4", 
            text: "What will they do in the morning?",
            options: ["Go to the beach", "Go to the art gallery", "Stay at home"], 
            correct: "Go to the art gallery",
            transcript: "Tom: So, what do you want to do on Saturday? Lucy: I'd love to go to the beach if the weather is nice. Tom: The forecast says it's going to rain in the morning, but sunny in the afternoon. Lucy: Oh, then how about we go to the new art gallery in the morning, then the beach after lunch? Tom: That sounds perfect. What time shall we meet? Lucy: Let's meet at the gallery at 10 AM. It opens at 9, so we'll miss the crowds. Tom: Great. I'll pick you up at 9:30."
        },
        { 
            id: "list_B1_05", 
            audio: "audio/level_test/B1 Q05.mp4", 
            text: "Why should Mrs. Parker call back?",
            options: ["Because her test results are abnormal", "To schedule a follow-up appointment", "To change her office hours"], 
            correct: "To schedule a follow-up appointment",
            transcript: "Hello, this is Dr. Evans' office calling for Mrs. Parker. Your test results have come back, and everything looks normal. However, the doctor would like to see you for a routine follow-up next week. Please call us back at 555-0198 to schedule an appointment. Our office hours are Monday to Friday, 9 AM to 5 PM. Thank you."
        }
    ],
    B2: [
        { 
            id: "list_B2_01", 
            audio: "audio/level_test/B2 Q01.mp4", 
            text: "According to the lecturer, what is the most effective action for the environment?",
            options: ["Recycling plastic", "Reducing consumption", "Buying new clothes"], 
            correct: "Reducing consumption",
            transcript: "Lecturer: Many people believe that recycling is the most important thing we can do for the environment. But in fact, reducing our consumption is even more effective. For example, producing a new cotton t-shirt requires 2,700 litres of water – that's enough for one person to drink for two and a half years. So, if you buy a second-hand shirt instead of a new one, you save all that water. Recycling is good, but reusing and reducing are better."
        },
        { 
            id: "list_B2_02", 
            audio: "audio/level_test/B2 Q02.mp4", 
            text: "How much will the tourist pay for two student tickets?",
            options: ["$45", "$70", "$90"], 
            correct: "$70",
            transcript: "Tourist: I'd like to take a day trip to the mountains. Do you have any tours tomorrow? Agent: Yes, we have a coach tour leaving at 8 AM. It includes a guide, lunch, and a visit to a waterfall. It returns around 6 PM. The cost is $45 per person. Tourist: That sounds good. Is there a discount for students? Agent: Yes, with a valid student ID, it's $35. Tourist: Great. I'll book two student tickets. Agent: Here you are. Please be at the bus stop on Main Street by 7:45 AM."
        },
        { 
            id: "list_B2_03", 
            audio: "audio/level_test/B2 Q03.mp4", 
            text: "What does Dr. Lopez say is the main problem with screen time for older children?",
            options: ["It causes poor sleep", "It replaces physical activity and social time", "It exposes them to bad content"], 
            correct: "It replaces physical activity and social time",
            transcript: "Host: We're talking today about screen time for children. Our guest, Dr. Maria Lopez, is a child psychologist. Dr. Lopez, what do you recommend? Dr. Lopez: For children under two, no screen time except video calls with family. For ages two to five, no more than one hour per day of high-quality programming. And parents should watch with their children to help them understand what they're seeing. Host: And for older children? Dr. Lopez: It's less about a specific time limit and more about balance. Ensure they have physical activity, sleep, and face-to-face social time. The real problem is when screens replace these things."
        },
        { 
            id: "list_B2_04", 
            audio: "audio/level_test/B2 Q01.mp4", 
            text: "What advice does the speaker give to newcomers?",
            options: ["Always look at the map", "Don't use the Tube at first", "Ask station staff for help"], 
            correct: "Ask station staff for help",
            transcript: "When I first moved to London, I was really nervous about using the Tube. The map looked so complicated. But after a few days, I realised it's actually very logical. Each line has a colour, and all you need to know is which direction you're going – north, south, east or west. Now I can get anywhere without even looking at the map. My advice to newcomers: don't be afraid to ask station staff for help. They're usually very friendly."
        },
        { 
            id: "list_B2_05", 
            audio: "audio/level_test/B2 Q05.mp4", 
            text: "What does Sarah think is the cause of lower customer satisfaction in the afternoons?",
            options: ["Poor product quality", "Not enough staff", "Bad customer service training"], 
            correct: "Not enough staff",
            transcript: "Manager: Sarah, I've seen your report on customer feedback. The numbers look good overall, but there's a drop in satisfaction in the afternoons. Sarah: Yes, I noticed that. I think it's because we're understaffed between 1 PM and 3 PM. Customers have to wait longer. Manager: That makes sense. Can you propose a solution by Friday? Sarah: I'd like to hire two part-time staff for those hours. I've already spoken to HR. Manager: Go ahead and write up the proposal. I'll approve it if the budget allows."
        }
    ],
    C1: [], C2: []
};
