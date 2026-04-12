class App {
    constructor() {
        this.currentPage = 'home';
        this.adaptiveListeningActive = false;
        this.adaptiveListeningHistory = [];
        this.adaptiveListeningCurrentLevel = 'A1';
        this.adaptiveListeningPhase = 'initial';
        this.adaptiveListeningLevelStats = {};
        this.adaptiveListeningUsedQuestions = {};
        this.adaptiveListeningCurrentSetQuestions = [];
        this.adaptiveListeningCurrentSetIndex = 0;
        this.adaptiveListeningCurrentSetCorrect = 0;
        this.adaptiveListeningConfirmationQuestions = [];
        this.adaptiveListeningConfirmationCorrect = 0;
        this.adaptiveListeningConfirmationTotal = 0;
        this.adaptiveListeningAudioPlayed = {};
        this.adaptiveListeningTotalQuestions = 0;
        this.adaptiveListeningMaxQuestions = 25;
        this.adaptiveListeningLastAnswer = null;
        this.adaptiveTestLevelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        this.currentAudio = null;
        this.isWaiting = false;
        this.lang = 'ar';
        this.theme = 'light';
        
        // بيانات تجريبية لاختبار القراءة (في حال عدم وجود placementBank)
        if (!window.placementBank) {
            window.placementBank = {};
            for (let level of this.adaptiveTestLevelOrder) {
                window.placementBank[level] = [];
                for (let i = 1; i <= 5; i++) {
                    window.placementBank[level].push({
                        id: `${level}_${i}`,
                        q: `Sample question ${i} for ${level}: Choose the correct answer.`,
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correct: "Option A",
                        skill: "Vocabulary"
                    });
                }
            }
        }
        
        this.init();
    }
    
    t(ar, en) { return this.lang === 'en' ? en : ar; }
    
    init() {
        this.render();
        this.setupEvents();
    }
    
    setupEvents() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'goHome') {
                this.currentPage = 'home';
                this.render();
            } else if (action === 'showInstructions') {
                this.currentPage = 'instructions';
                this.render();
            } else if (action === 'startListening') {
                this.startListeningTest();
            } else if (action === 'startReading') {
                this.startReadingTest();
            } else if (action === 'adaptiveListeningAnswer') {
                this.handleListeningAnswer(btn.dataset.param, btn.dataset.correct, btn);
            } else if (action === 'showTranscript') {
                this.showTranscript();
            } else if (action === 'nextListening') {
                this.nextListeningQuestion();
            } else if (action === 'adaptiveAnswer') {
                this.handleAdaptiveAnswer(btn.dataset.param, btn.dataset.correct, btn);
            }
        });
    }
    
    // ========== دوال الاختبار السماعي ==========
    startListeningTest() {
        this.adaptiveListeningActive = true;
        this.adaptiveListeningHistory = [];
        this.adaptiveListeningCurrentLevel = 'A1';
        this.adaptiveListeningPhase = 'initial';
        this.adaptiveListeningTotalQuestions = 0;
        this.adaptiveListeningMaxQuestions = 25;
        
        this.adaptiveListeningLevelStats = {};
        for (let level of this.adaptiveTestLevelOrder) {
            this.adaptiveListeningLevelStats[level] = { correct: 0, total: 0 };
            this.adaptiveListeningUsedQuestions[level] = [];
        }
        
        this.adaptiveListeningCurrentSetQuestions = [];
        this.adaptiveListeningCurrentSetIndex = 0;
        this.adaptiveListeningCurrentSetCorrect = 0;
        this.adaptiveListeningConfirmationQuestions = [];
        this.adaptiveListeningConfirmationCorrect = 0;
        this.adaptiveListeningConfirmationTotal = 0;
        this.adaptiveListeningAudioPlayed = {};
        this.adaptiveListeningLastAnswer = null;
        
        this.loadListeningSet('A1', 5);
        this.currentPage = 'listening_test';
        this.render();
    }
    
    loadListeningSet(level, count) {
        const bank = window.listeningBank[level];
        if (!bank || bank.length === 0) {
            console.warn(`No questions for ${level}, using default`);
            this.finishListeningPhase();
            return;
        }
        const used = this.adaptiveListeningUsedQuestions[level];
        let available = bank.filter(q => !used.includes(q.id));
        if (available.length < count) {
            if (available.length === 0) {
                this.adaptiveListeningUsedQuestions[level] = [];
                available = [...bank];
            }
        }
        const shuffled = [...available];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const selected = shuffled.slice(0, count);
        for (let q of selected) {
            this.adaptiveListeningUsedQuestions[level].push(q.id);
        }
        this.adaptiveListeningCurrentSetQuestions = selected;
        this.adaptiveListeningCurrentSetIndex = 0;
        this.adaptiveListeningCurrentSetCorrect = 0;
    }
    
    getCurrentListeningQuestion() {
        if (this.adaptiveListeningPhase === 'confirmation') {
            if (this.adaptiveListeningConfirmationQuestions.length > 0) {
                return this.adaptiveListeningConfirmationQuestions[0];
            }
            return null;
        }
        if (this.adaptiveListeningCurrentSetIndex >= this.adaptiveListeningCurrentSetQuestions.length) {
            this.evaluateListeningSet();
            if (this.adaptiveListeningPhase === 'confirmation') {
                return this.adaptiveListeningConfirmationQuestions[0] || null;
            } else {
                if (this.adaptiveListeningCurrentSetQuestions.length === 0) {
                    this.loadListeningSet(this.adaptiveListeningCurrentLevel, 4);
                }
                this.adaptiveListeningCurrentSetIndex = 0;
                return this.adaptiveListeningCurrentSetQuestions[0] || null;
            }
        }
        return this.adaptiveListeningCurrentSetQuestions[this.adaptiveListeningCurrentSetIndex];
    }
    
    evaluateListeningSet() {
        const setSize = this.adaptiveListeningCurrentSetQuestions.length;
        const setCorrect = this.adaptiveListeningCurrentSetCorrect;
        const percent = setSize > 0 ? (setCorrect / setSize) * 100 : 0;
        
        const stats = this.adaptiveListeningLevelStats[this.adaptiveListeningCurrentLevel];
        stats.correct += setCorrect;
        stats.total += setSize;
        this.adaptiveListeningTotalQuestions += setSize;
        
        if (this.adaptiveListeningTotalQuestions >= this.adaptiveListeningMaxQuestions) {
            this.finishListeningPhase();
            return;
        }
        
        const levels = this.adaptiveTestLevelOrder;
        const idx = levels.indexOf(this.adaptiveListeningCurrentLevel);
        
        if (this.adaptiveListeningPhase === 'initial') {
            if (percent >= 70 && idx < levels.length - 1) {
                this.adaptiveListeningCurrentLevel = levels[idx + 1];
                this.adaptiveListeningPhase = 'moving_up';
            } else if (percent <= 40 && idx > 0) {
                this.adaptiveListeningCurrentLevel = levels[idx - 1];
                this.adaptiveListeningPhase = 'moving_down';
            } else {
                this.adaptiveListeningPhase = 'confirmation';
                this.prepareConfirmationSet();
            }
        } else if (this.adaptiveListeningPhase === 'moving_up' || this.adaptiveListeningPhase === 'moving_down') {
            if (percent >= 70) {
                if (this.adaptiveListeningPhase === 'moving_up' && idx < levels.length - 1) {
                    this.adaptiveListeningCurrentLevel = levels[idx + 1];
                } else {
                    this.adaptiveListeningPhase = 'confirmation';
                    this.prepareConfirmationSet();
                }
            } else if (percent <= 40 && idx > 0) {
                this.adaptiveListeningCurrentLevel = levels[idx - 1];
                if (this.adaptiveListeningPhase === 'moving_up') this.adaptiveListeningPhase = 'moving_down';
            } else {
                this.adaptiveListeningPhase = 'confirmation';
                this.prepareConfirmationSet();
            }
        }
        
        if (this.adaptiveListeningPhase !== 'confirmation') {
            this.loadListeningSet(this.adaptiveListeningCurrentLevel, 4);
        }
    }
    
    prepareConfirmationSet() {
        let remaining = this.adaptiveListeningMaxQuestions - this.adaptiveListeningTotalQuestions;
        let count = Math.min(8, Math.max(5, remaining));
        if (count < 3) {
            this.finishListeningPhase();
            return;
        }
        const bank = window.listeningBank[this.adaptiveListeningCurrentLevel];
        if (!bank) {
            this.finishListeningPhase();
            return;
        }
        const used = this.adaptiveListeningUsedQuestions[this.adaptiveListeningCurrentLevel];
        let available = bank.filter(q => !used.includes(q.id));
        if (available.length < count) {
            if (available.length === 0) {
                this.adaptiveListeningUsedQuestions[this.adaptiveListeningCurrentLevel] = [];
                available = [...bank];
            }
        }
        const shuffled = [...available];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        this.adaptiveListeningConfirmationQuestions = shuffled.slice(0, count);
        this.adaptiveListeningConfirmationCorrect = 0;
        this.adaptiveListeningConfirmationTotal = count;
        this.adaptiveListeningPhase = 'confirmation';
    }
    
    handleListeningAnswer(selected, correct, btn) {
        if (this.isWaiting) return;
        this.isWaiting = true;
        
        const isCorrect = (selected.trim().toLowerCase() === correct.trim().toLowerCase());
        this.playTone(isCorrect);
        
        let currentQ;
        if (this.adaptiveListeningPhase === 'confirmation') {
            currentQ = this.adaptiveListeningConfirmationQuestions[0];
            if (isCorrect) this.adaptiveListeningConfirmationCorrect++;
            this.adaptiveListeningHistory.push({
                level: this.adaptiveListeningCurrentLevel,
                question: currentQ.text,
                selected: selected,
                correct: correct,
                isCorrect: isCorrect,
                transcript: currentQ.transcript
            });
            this.adaptiveListeningConfirmationQuestions.shift();
            this.adaptiveListeningTotalQuestions++;
            
            if (this.adaptiveListeningConfirmationQuestions.length === 0 || this.adaptiveListeningTotalQuestions >= this.adaptiveListeningMaxQuestions) {
                setTimeout(() => {
                    this.finishListeningPhase();
                    this.isWaiting = false;
                }, 1000);
                this.disableOptions(selected, correct, isCorrect);
                return;
            }
        } else {
            currentQ = this.adaptiveListeningCurrentSetQuestions[this.adaptiveListeningCurrentSetIndex];
            this.adaptiveListeningHistory.push({
                level: this.adaptiveListeningCurrentLevel,
                question: currentQ.text,
                selected: selected,
                correct: correct,
                isCorrect: isCorrect,
                transcript: currentQ.transcript
            });
            if (isCorrect) this.adaptiveListeningCurrentSetCorrect++;
            this.adaptiveListeningCurrentSetIndex++;
            this.adaptiveListeningTotalQuestions++;
        }
        
        this.adaptiveListeningLastAnswer = {
            isCorrect: isCorrect,
            transcript: currentQ.transcript,
            showTranscript: false
        };
        
        this.disableOptions(selected, correct, isCorrect);
        
        setTimeout(() => {
            this.isWaiting = false;
            this.render();
        }, 1000);
    }
    
    disableOptions(selected, correct, isCorrect) {
        const opts = document.querySelectorAll('.quiz-opt-btn');
        opts.forEach(btn => {
            btn.disabled = true;
            const val = btn.dataset.param;
            if (val === correct) btn.classList.add('correct-answer');
            else if (val === selected && !isCorrect) btn.classList.add('wrong-answer');
        });
    }
    
    playTone(isCorrect) {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        }
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        if (isCorrect) {
            osc.frequency.value = 523.25;
            osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.1);
            gain.gain.value = 0.1;
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
        } else {
            osc.frequency.value = 220;
            osc.frequency.linearRampToValueAtTime(110, this.audioCtx.currentTime + 0.2);
            gain.gain.value = 0.2;
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4);
        }
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.4);
    }
    
    playAudio(src) {
        if (!src || src === "") {
            alert("ملف الصوت غير متوفر حالياً");
            return;
        }
        if (this.currentAudio) {
            this.currentAudio.pause();
        }
        this.currentAudio = new Audio(src);
        this.currentAudio.play().catch(e => console.log("Audio error:", e));
    }
    
    playListeningAudio(audioSrc, qid) {
        if (this.adaptiveListeningAudioPlayed[qid]) {
            alert("لا يمكن إعادة تشغيل الصوت مرة أخرى.");
            return;
        }
        if (audioSrc && audioSrc !== "") {
            this.playAudio(audioSrc);
            this.adaptiveListeningAudioPlayed[qid] = true;
            const btn = document.getElementById(`playBtn_${qid}`);
            if (btn) {
                btn.disabled = true;
                btn.innerText = "✓ تم الاستماع";
            }
        } else {
            alert("ملف الصوت غير موجود.");
        }
    }
    
    showTranscript() {
        if (this.adaptiveListeningLastAnswer) {
            this.adaptiveListeningLastAnswer.showTranscript = !this.adaptiveListeningLastAnswer.showTranscript;
            this.render();
        }
    }
    
    nextListeningQuestion() {
        this.adaptiveListeningLastAnswer = null;
        this.render();
    }
    
    finishListeningPhase() {
        console.log("Listening phase finished");
        // يمكن الانتقال إلى اختبار القراءة أو عرض النتيجة
        this.adaptiveListeningActive = false;
        alert("انتهى اختبار الاستماع! سيتم الانتقال إلى اختبار القراءة.");
        this.startReadingTest();
    }
    
    // ========== اختبار القراءة المبسط ==========
    startReadingTest() {
        this.adaptiveTestActive = true;
        this.adaptiveTestHistory = [];
        this.adaptiveTestCurrentLevel = 'A2';
        this.adaptiveTestPhase = 'initial';
        this.adaptiveTestTotalQuestions = 0;
        this.adaptiveTestMaxQuestions = 20;
        this.adaptiveTestLevelStats = {};
        this.adaptiveTestUsedQuestions = {};
        for (let level of this.adaptiveTestLevelOrder) {
            this.adaptiveTestLevelStats[level] = { correct: 0, total: 0 };
            this.adaptiveTestUsedQuestions[level] = [];
        }
        this.adaptiveTestCurrentSetQuestions = [];
        this.adaptiveTestCurrentSetIndex = 0;
        this.adaptiveTestCurrentSetCorrect = 0;
        this.adaptiveTestConfirmationQuestions = [];
        this.loadReadingSet('A2', 5);
        this.currentPage = 'reading_test';
        this.render();
    }
    
    loadReadingSet(level, count) {
        const bank = window.placementBank[level];
        if (!bank || bank.length === 0) {
            console.warn(`No reading questions for ${level}`);
            return;
        }
        const used = this.adaptiveTestUsedQuestions[level];
        let available = bank.filter(q => !used.includes(q.id));
        if (available.length < count) {
            if (available.length === 0) {
                this.adaptiveTestUsedQuestions[level] = [];
                available = [...bank];
            }
        }
        const shuffled = [...available];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const selected = shuffled.slice(0, count);
        for (let q of selected) this.adaptiveTestUsedQuestions[level].push(q.id);
        this.adaptiveTestCurrentSetQuestions = selected;
        this.adaptiveTestCurrentSetIndex = 0;
        this.adaptiveTestCurrentSetCorrect = 0;
    }
    
    getCurrentReadingQuestion() {
        if (this.adaptiveTestPhase === 'confirmation') {
            if (this.adaptiveTestConfirmationQuestions.length > 0) return this.adaptiveTestConfirmationQuestions[0];
            return null;
        }
        if (this.adaptiveTestCurrentSetIndex >= this.adaptiveTestCurrentSetQuestions.length) {
            this.evaluateReadingSet();
            if (this.adaptiveTestPhase === 'confirmation') return this.adaptiveTestConfirmationQuestions[0] || null;
            if (this.adaptiveTestCurrentSetQuestions.length === 0) this.loadReadingSet(this.adaptiveTestCurrentLevel, 4);
            this.adaptiveTestCurrentSetIndex = 0;
            return this.adaptiveTestCurrentSetQuestions[0] || null;
        }
        return this.adaptiveTestCurrentSetQuestions[this.adaptiveTestCurrentSetIndex];
    }
    
    evaluateReadingSet() {
        const setSize = this.adaptiveTestCurrentSetQuestions.length;
        const setCorrect = this.adaptiveTestCurrentSetCorrect;
        const percent = setSize > 0 ? (setCorrect / setSize) * 100 : 0;
        const stats = this.adaptiveTestLevelStats[this.adaptiveTestCurrentLevel];
        stats.correct += setCorrect;
        stats.total += setSize;
        this.adaptiveTestTotalQuestions += setSize;
        if (this.adaptiveTestTotalQuestions >= this.adaptiveTestMaxQuestions) {
            this.finishReadingTest();
            return;
        }
        const levels = this.adaptiveTestLevelOrder;
        const idx = levels.indexOf(this.adaptiveTestCurrentLevel);
        if (this.adaptiveTestPhase === 'initial') {
            if (percent >= 70 && idx < levels.length-1) {
                this.adaptiveTestCurrentLevel = levels[idx+1];
                this.adaptiveTestPhase = 'moving_up';
            } else if (percent <= 40 && idx > 0) {
                this.adaptiveTestCurrentLevel = levels[idx-1];
                this.adaptiveTestPhase = 'moving_down';
            } else {
                this.adaptiveTestPhase = 'confirmation';
                this.prepareReadingConfirmation();
            }
        } else if (this.adaptiveTestPhase === 'moving_up' || this.adaptiveTestPhase === 'moving_down') {
            if (percent >= 70) {
                if (this.adaptiveTestPhase === 'moving_up' && idx < levels.length-1) this.adaptiveTestCurrentLevel = levels[idx+1];
                else { this.adaptiveTestPhase = 'confirmation'; this.prepareReadingConfirmation(); }
            } else if (percent <= 40 && idx > 0) {
                this.adaptiveTestCurrentLevel = levels[idx-1];
                if (this.adaptiveTestPhase === 'moving_up') this.adaptiveTestPhase = 'moving_down';
            } else {
                this.adaptiveTestPhase = 'confirmation';
                this.prepareReadingConfirmation();
            }
        }
        if (this.adaptiveTestPhase !== 'confirmation') this.loadReadingSet(this.adaptiveTestCurrentLevel, 4);
    }
    
    prepareReadingConfirmation() {
        let remaining = this.adaptiveTestMaxQuestions - this.adaptiveTestTotalQuestions;
        let count = Math.min(8, Math.max(5, remaining));
        if (count < 3) { this.finishReadingTest(); return; }
        const bank = window.placementBank[this.adaptiveTestCurrentLevel];
        if (!bank) { this.finishReadingTest(); return; }
        const used = this.adaptiveTestUsedQuestions[this.adaptiveTestCurrentLevel];
        let available = bank.filter(q => !used.includes(q.id));
        if (available.length < count) {
            if (available.length === 0) {
                this.adaptiveTestUsedQuestions[this.adaptiveTestCurrentLevel] = [];
                available = [...bank];
            }
        }
        const shuffled = [...available];
        for (let i = shuffled.length-1; i>0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        this.adaptiveTestConfirmationQuestions = shuffled.slice(0, count);
        this.adaptiveTestConfirmationCorrect = 0;
        this.adaptiveTestConfirmationTotal = count;
        this.adaptiveTestPhase = 'confirmation';
    }
    
    handleAdaptiveAnswer(selected, correct, btn) {
        if (this.isWaiting) return;
        this.isWaiting = true;
        const isCorrect = (selected.trim().toLowerCase() === correct.trim().toLowerCase());
        this.playTone(isCorrect);
        if (this.adaptiveTestPhase === 'confirmation') {
            if (isCorrect) this.adaptiveTestConfirmationCorrect++;
            this.adaptiveTestConfirmationQuestions.shift();
            this.adaptiveTestTotalQuestions++;
            if (this.adaptiveTestConfirmationQuestions.length === 0 || this.adaptiveTestTotalQuestions >= this.adaptiveTestMaxQuestions) {
                setTimeout(() => { this.finishReadingTest(); this.isWaiting = false; }, 1000);
                this.disableOptions(selected, correct, isCorrect);
                return;
            }
        } else {
            if (isCorrect) this.adaptiveTestCurrentSetCorrect++;
            this.adaptiveTestCurrentSetIndex++;
            this.adaptiveTestTotalQuestions++;
        }
        this.disableOptions(selected, correct, isCorrect);
        setTimeout(() => {
            this.isWaiting = false;
            this.render();
        }, 1000);
    }
    
    finishReadingTest() {
        this.adaptiveTestActive = false;
        let bestLevel = 'A1';
        for (let level of this.adaptiveTestLevelOrder) {
            const s = this.adaptiveTestLevelStats[level];
            if (s.total >= 2 && (s.correct/s.total) >= 0.7) bestLevel = level;
        }
        alert(`انتهى الاختبار! مستواك التقريبي: ${bestLevel}`);
        this.currentPage = 'home';
        this.render();
    }
    
    // ========== واجهة المستخدم ==========
    render() {
        const app = document.getElementById('app');
        if (!app) return;
        app.innerHTML = this.getHeader() + this.getMainContent();
    }
    
    getHeader() {
        if (this.currentPage === 'auth') return '';
        return `<header class="header">
            <div class="header-content">
                <div class="logo-container" data-action="goHome"><img src="wordwise_logo.png" alt="WordWise"><h2>WordWise</h2></div>
                <div class="header-buttons">
                    <button class="header-btn" data-action="toggleLang">${this.lang === 'ar' ? 'EN' : 'عربي'}</button>
                    <button class="header-btn" data-action="toggleTheme">${this.theme === 'light' ? '🌙' : '☀️'}</button>
                    <button class="header-btn" data-action="goToProfile">👤</button>
                </div>
            </div>
        </header>`;
    }
    
    getMainContent() {
        if (this.currentPage === 'home') {
            return `<main class="main-content">
                <div class="reading-card welcome-banner"><h3>مرحباً بك في WordWise</h3></div>
                <button class="hero-btn" data-action="showInstructions" style="background:#ec4899;">🧠 اختبار مستوى متقدم</button>
                <button class="hero-btn" data-action="goToProfile" style="background:#8b5cf6;">👤 الملف الشخصي</button>
            </main>`;
        }
        if (this.currentPage === 'instructions') {
            return `<main class="main-content">
                <button class="hero-btn" data-action="goHome" style="margin-bottom:15px;">← رجوع</button>
                <div class="reading-card">
                    <h2 style="text-align:center;">🧠 اختبار تحديد المستوى</h2>
                    <p>الاختبار يتكون من جزئين:</p>
                    <ul><li>🎧 اختبار الاستماع (يبدأ من A1)</li><li>📖 اختبار القراءة والقواعد (يبدأ من A2)</li></ul>
                    <div style="display:flex; gap:12px; margin-top:20px;">
                        <button class="hero-btn" data-action="startListening" style="background:#8b5cf6; flex:1;">🎧 بدء الاختبار السماعي</button>
                        <button class="hero-btn" data-action="startReading" style="background:#3b82f6; flex:1;">📖 بدء الاختبار المقروء</button>
                    </div>
                </div>
            </main>`;
        }
        if (this.currentPage === 'listening_test') {
            if (!this.adaptiveListeningActive) return `<div class="reading-card"><p>جاري الانتقال...</p></div>`;
            const q = this.getCurrentListeningQuestion();
            if (!q) return `<div class="reading-card"><p>جاري تحميل السؤال...</p></div>`;
            const opts = [...q.options].sort(() => 0.5 - Math.random());
            const total = this.adaptiveListeningHistory.length;
            const played = this.adaptiveListeningAudioPlayed[q.id];
            return `<div class="reading-card">
                <div style="display:flex; justify-content:space-between;">
                    <span>السؤال ${total+1}</span>
                    <span>المستوى: ${this.adaptiveListeningCurrentLevel}</span>
                </div>
                <div style="text-align:center; margin:20px 0;">
                    <button id="playBtn_${q.id}" class="hero-btn" onclick="appInstance.playListeningAudio('${q.audio}', '${q.id}')" style="background:#6366f1;" ${played ? 'disabled' : ''}>
                        🔊 ${played ? 'تم الاستماع' : 'تشغيل التسجيل'}
                    </button>
                </div>
                <h3 style="text-align:center;">${q.text}</h3>
                <div class="quiz-options">
                    ${opts.map(opt => `<button class="quiz-opt-btn" data-action="adaptiveListeningAnswer" data-param="${opt}" data-correct="${q.correct}">${opt}</button>`).join('')}
                </div>
                ${this.adaptiveListeningLastAnswer ? `
                    <div class="result-message" style="text-align:center; margin-top:15px;">
                        ${this.adaptiveListeningLastAnswer.isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة!'}
                    </div>
                    <button class="hero-btn" data-action="showTranscript" style="background:#f59e0b; margin-top:10px;">📝 عرض النص المكتوب</button>
                    ${this.adaptiveListeningLastAnswer.showTranscript ? `<div style="margin-top:10px; padding:10px; background:#f1f5f9; border-radius:8px;">${this.adaptiveListeningLastAnswer.transcript}</div>` : ''}
                    <button class="hero-btn" data-action="nextListening" style="margin-top:10px;">➡️ التالي</button>
                ` : ''}
            </div>`;
        }
        if (this.currentPage === 'reading_test') {
            if (!this.adaptiveTestActive) return `<div class="reading-card"><p>جاري التحميل...</p></div>`;
            const q = this.getCurrentReadingQuestion();
            if (!q) return `<div class="reading-card"><p>جاري تحميل السؤال...</p></div>`;
            const opts = [...q.options].sort(() => 0.5 - Math.random());
            const total = this.adaptiveTestHistory.length;
            return `<div class="reading-card">
                <div style="display:flex; justify-content:space-between;">
                    <span>السؤال ${total+1}</span>
                    <span>المستوى: ${this.adaptiveTestCurrentLevel}</span>
                </div>
                <h3>${q.q}</h3>
                <div class="quiz-options">
                    ${opts.map(opt => `<button class="quiz-opt-btn" data-action="adaptiveAnswer" data-param="${opt}" data-correct="${q.correct}">${opt}</button>`).join('')}
                </div>
            </div>`;
        }
        return `<div class="reading-card"><p>جاري التحميل...</p></div>`;
    }
}

const appInstance = new App();
