// app.js - نسخة مبسطة تعمل بشكل مؤكد
window.addEventListener('error', function(e) {
    console.error('خطأ:', e.message);
    alert('❌ خطأ: ' + e.message);
});

class App {
    constructor() {
        this.currentPage = 'home';
        this.loadingData = false;
        this.userData = { name: 'مستخدم' };
        this.masteredWords = [];
        this.unlockedLessons = [];
        this.userCoins = 100;
        this.userStats = { xp: 0, level: 1, earnedBadges: [] };
        
        // بيانات اختبار المستوى
        this.adaptiveTestActive = false;
        this.adaptiveTestLevelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        
        // بيانات السماعي
        this.adaptiveListeningActive = false;
        this.adaptiveListeningCurrentLevel = 'A1';
        this.adaptiveListeningQuestions = [];
        this.adaptiveListeningIndex = 0;
        this.adaptiveListeningScore = 0;
        this.adaptiveListeningHistory = [];
        this.adaptiveListeningLastAnswer = null;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    t(ar, en) { return ar; }
    
    init() {
        this.render();
    }

    // ========== دوال الاختبار ==========
    showLevelTestInstructions() {
        this.currentPage = 'level_test_instructions';
        this.render();
    }

    startAdaptiveLevelTestListening() {
        console.log("✅ بدء الاختبار السماعي");
        
        // التحقق من وجود البيانات
        if (!window.listeningBank || Object.keys(window.listeningBank).length === 0) {
            alert("⚠️ بيانات الاختبار السماعي غير متوفرة. سيتم استخدام أسئلة تجريبية.");
            // إنشاء بيانات تجريبية
            window.listeningBank = {
                A1: [
                    { id: "test1", audio: "", text: "What is the man's name?", options: ["Tom", "John", "Mike"], correct: "Tom", transcript: "My name is Tom." },
                    { id: "test2", audio: "", text: "Where is the cat?", options: ["Under table", "On chair", "In garden"], correct: "Under table", transcript: "The cat is under the table." }
                ],
                A2: [
                    { id: "test3", audio: "", text: "What time is the train?", options: ["5:15", "5:35", "5:50"], correct: "5:35", transcript: "The train leaves at 5:35." }
                ]
            };
        }
        
        // تهيئة الأسئلة من المستوى A1
        this.adaptiveListeningQuestions = [...(window.listeningBank.A1 || [])];
        this.adaptiveListeningIndex = 0;
        this.adaptiveListeningScore = 0;
        this.adaptiveListeningHistory = [];
        this.adaptiveListeningLastAnswer = null;
        this.adaptiveListeningActive = true;
        
        this.currentPage = 'adaptive_listening_test';
        this.render();
    }

    startAdaptiveLevelTestReading() {
        console.log("✅ بدء الاختبار المقروء");
        
        // التحقق من وجود البيانات
        if (!window.placementBank || Object.keys(window.placementBank).length === 0) {
            alert("⚠️ بيانات اختبار القراءة غير متوفرة. سيتم استخدام أسئلة تجريبية.");
            // إنشاء بيانات تجريبية
            window.placementBank = {
                A1: [{ id: "read1", q: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correct: "Paris", skill: "General" }],
                A2: [{ id: "read2", q: "Choose the correct sentence:", options: ["He go to school", "He goes to school", "He going to school", "He went to school"], correct: "He goes to school", skill: "Grammar" }]
            };
        }
        
        // تجميع كل الأسئلة
        let allQuestions = [];
        for (let level of this.adaptiveTestLevelOrder) {
            if (window.placementBank[level]) {
                allQuestions = allQuestions.concat(window.placementBank[level]);
            }
        }
        
        this.adaptiveTestQuestions = allQuestions;
        this.adaptiveTestIndex = 0;
        this.adaptiveTestScore = 0;
        this.adaptiveTestActive = true;
        
        this.currentPage = 'adaptive_test';
        this.render();
    }

    handleListeningAnswer(selected, correct) {
        const isCorrect = (selected === correct);
        if (isCorrect) this.adaptiveListeningScore++;
        
        const currentQ = this.adaptiveListeningQuestions[this.adaptiveListeningIndex];
        this.adaptiveListeningHistory.push({
            question: currentQ.text,
            selected: selected,
            correct: correct,
            isCorrect: isCorrect,
            transcript: currentQ.transcript || ''
        });
        
        this.adaptiveListeningLastAnswer = {
            isCorrect: isCorrect,
            transcript: currentQ.transcript || '',
            showTranscript: false
        };
        
        this.adaptiveListeningIndex++;
        
        if (this.adaptiveListeningIndex >= this.adaptiveListeningQuestions.length) {
            this.finishListeningTest();
        } else {
            this.render();
        }
    }

    showListeningTranscript() {
        if (this.adaptiveListeningLastAnswer) {
            this.adaptiveListeningLastAnswer.showTranscript = !this.adaptiveListeningLastAnswer.showTranscript;
            this.render();
        }
    }

    nextListeningQuestion() {
        this.adaptiveListeningLastAnswer = null;
        this.render();
    }

    finishListeningTest() {
        const score = this.adaptiveListeningScore;
        const total = this.adaptiveListeningQuestions.length;
        let level = 'A1';
        if (score/total >= 0.8) level = 'B1';
        else if (score/total >= 0.6) level = 'A2';
        
        alert(`🎉 انتهى الاختبار السماعي!\nالنتيجة: ${score}/${total}\nالمستوى المقترح: ${level}`);
        
        this.adaptiveListeningActive = false;
        this.currentPage = 'home';
        this.render();
    }

    handleAdaptiveAnswer(selected, correct) {
        const isCorrect = (selected === correct);
        if (isCorrect) this.adaptiveTestScore++;
        
        this.adaptiveTestIndex++;
        
        if (this.adaptiveTestIndex >= this.adaptiveTestQuestions.length) {
            const score = this.adaptiveTestScore;
            const total = this.adaptiveTestQuestions.length;
            alert(`🎉 انتهى الاختبار المقروء!\nالنتيجة: ${score}/${total}`);
            this.adaptiveTestActive = false;
            this.currentPage = 'home';
        }
        this.render();
    }

    // ========== دوال عرض الصفحات ==========
    render() {
        const app = document.getElementById('app');
        if (!app) return;
        app.innerHTML = this.getView();
    }

    getView() {
        if (this.currentPage === 'home') {
            return `<main class="main-content">
                <div class="reading-card welcome-banner">
                    <h3>👋 مرحباً، ${this.userData.name || 'مستخدم'}</h3>
                    <p>💎 رصيدك: ${this.userCoins} لؤلؤة</p>
                    <p>⭐ مستوى: ${this.userStats.level}</p>
                </div>
                <button class="hero-btn" onclick="appInstance.showLevelTestInstructions()" style="width:100%; background:#ec4899; margin:12px 0;">🧠 اختبار مستوى متقدم</button>
                <button class="hero-btn" onclick="appInstance.currentPage='profile'; appInstance.render()" style="width:100%; background:#64748b;">👤 الملف الشخصي</button>
            </main>`;
        }
        
        if (this.currentPage === 'profile') {
            return `<main class="main-content">
                <button class="hero-btn" onclick="appInstance.currentPage='home'; appInstance.render()" style="margin-bottom:15px; background:#64748b;">← رجوع</button>
                <div class="reading-card">
                    <h3>الملف الشخصي</h3>
                    <p>الاسم: ${this.userData.name}</p>
                    <p>نقاط الخبرة: ${this.userStats.xp}</p>
                    <p>المستوى: ${this.userStats.level}</p>
                    <p>اللآلئ: ${this.userCoins}</p>
                </div>
            </main>`;
        }
        
        if (this.currentPage === 'level_test_instructions') {
            return `<main class="main-content">
                <button class="hero-btn" onclick="appInstance.currentPage='home'; appInstance.render()" style="margin-bottom:15px; background:#64748b;">← رجوع</button>
                <div class="reading-card">
                    <h2 style="text-align:center;">🧠 اختبار تحديد المستوى</h2>
                    <p>هذا الاختبار يتكون من جزئين:</p>
                    <ul>
                        <li><strong>🎧 اختبار الاستماع</strong> - يبدأ من مستوى A1</li>
                        <li><strong>📖 اختبار القراءة والقواعد</strong> - يبدأ من مستوى A2</li>
                    </ul>
                    <div style="display:flex; gap:12px; margin-top:20px;">
                        <button class="hero-btn" onclick="appInstance.startAdaptiveLevelTestListening()" style="background:#8b5cf6; flex:1;">🎧 بدء الاختبار السماعي</button>
                        <button class="hero-btn" onclick="appInstance.startAdaptiveLevelTestReading()" style="background:#3b82f6; flex:1;">📖 بدء الاختبار المقروء</button>
                    </div>
                </div>
            </main>`;
        }
        
        if (this.currentPage === 'adaptive_listening_test') {
            if (!this.adaptiveListeningActive || this.adaptiveListeningIndex >= this.adaptiveListeningQuestions.length) {
                return `<div class="reading-card"><p>جاري التحميل...</p></div>`;
            }
            const q = this.adaptiveListeningQuestions[this.adaptiveListeningIndex];
            const opts = [...q.options].sort(() => 0.5 - Math.random());
            
            let html = `<div class="reading-card">
                <div style="display:flex; justify-content:space-between;">
                    <span>السؤال ${this.adaptiveListeningIndex + 1}/${this.adaptiveListeningQuestions.length}</span>
                    <span>المستوى: ${this.adaptiveListeningCurrentLevel}</span>
                </div>
                <div style="text-align:center; margin:20px 0;">
                    <button class="hero-btn" onclick="alert('سيتم تشغيل الصوت: ${q.audio || 'ملف غير متوفر'}')" style="background:#6366f1;">🔊 تشغيل التسجيل</button>
                </div>
                <h3 style="text-align:center;">${q.text}</h3>
                <div class="quiz-options">`;
            
            opts.forEach(opt => {
                html += `<button class="quiz-opt-btn" onclick="appInstance.handleListeningAnswer('${opt.replace(/'/g, "\\'")}', '${q.correct.replace(/'/g, "\\'")}')">${opt}</button>`;
            });
            
            html += `</div>`;
            
            if (this.adaptiveListeningLastAnswer) {
                html += `<div style="margin-top:15px; text-align:center;">
                    <div style="background:${this.adaptiveListeningLastAnswer.isCorrect ? '#d1fae5' : '#fee2e2'}; padding:10px; border-radius:8px;">
                        ${this.adaptiveListeningLastAnswer.isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة!'}
                    </div>
                    <button class="hero-btn" onclick="appInstance.showListeningTranscript()" style="background:#f59e0b; margin:8px 0;">📝 عرض النص المكتوب</button>
                    ${this.adaptiveListeningLastAnswer.showTranscript ? `<div style="background:#f1f5f9; padding:10px; border-radius:8px; text-align:left;">${this.adaptiveListeningLastAnswer.transcript}</div>` : ''}
                    <button class="hero-btn" onclick="appInstance.nextListeningQuestion()" style="background:#3b82f6;">➡️ التالي</button>
                </div>`;
            }
            
            html += `</div>`;
            return html;
        }
        
        if (this.currentPage === 'adaptive_test') {
            if (!this.adaptiveTestActive || this.adaptiveTestIndex >= this.adaptiveTestQuestions.length) {
                return `<div class="reading-card"><p>جاري التحميل...</p></div>`;
            }
            const q = this.adaptiveTestQuestions[this.adaptiveTestIndex];
            const opts = [...q.options].sort(() => 0.5 - Math.random());
            
            let html = `<div class="reading-card">
                <div style="display:flex; justify-content:space-between;">
                    <span>السؤال ${this.adaptiveTestIndex + 1}/${this.adaptiveTestQuestions.length}</span>
                </div>
                <h3 style="text-align:center;">${q.q}</h3>
                <div class="quiz-options">`;
            
            opts.forEach(opt => {
                html += `<button class="quiz-opt-btn" onclick="appInstance.handleAdaptiveAnswer('${opt.replace(/'/g, "\\'")}', '${q.correct.replace(/'/g, "\\'")}')">${opt}</button>`;
            });
            
            html += `</div></div>`;
            return html;
        }
        
        return `<div class="reading-card"><p>جاري التحميل...</p></div>`;
    }
}

const appInstance = new App();
