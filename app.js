// ====================== app.js - النسخة النهائية المعدلة بالكامل ======================
window.addEventListener('error', function(e) {
    alert('❌ خطأ في السطر: ' + e.lineno + '\nالملف: ' + e.filename + '\nالرسالة: ' + e.message);
    document.body.innerHTML = '<pre style="color:red; background:white; padding:10px;">خطأ في السطر: ' + e.lineno + '\n' + e.message + '</pre>';
});

class App {
    constructor() {
        // أنظمة الحماية والمتغيرات الأساسية
        this.loadingData = true;
        this.isDataLoaded = false;
        this.canSave = false;
        this.isProcessingAuth = false;
        
        // نظام الإعلانات المتدرج اليومي
        this.adDailyData = { count: 0, date: new Date().toDateString(), levelCompleted: 0 };
        this.adRewardLevels = [
            { adsNeeded: 3, reward: 50 },
            { adsNeeded: 4, reward: 75 },
            { adsNeeded: 5, reward: 100 }
        ];
        
        // ========== نظام اختبار المستوى المتطور (القراءة) ==========
        this.adaptiveTestActive = false;
        this.adaptiveTestHistory = [];
        this.adaptiveTestCurrentLevel = 'A2';
        this.adaptiveTestPhase = 'initial';
        this.adaptiveTestLevelResults = {};
        this.adaptiveTestFinalLevel = null;
        this.adaptiveTestTotalQuestions = 0;
        this.adaptiveTestMaxQuestions = 50;
        this.adaptiveTestMinQuestions = 35;
        this.adaptiveTestQuestionsPerSet = 4;
        this.adaptiveTestCurrentSetQuestions = [];
        this.adaptiveTestCurrentSetIndex = 0;
        this.adaptiveTestCurrentSetCorrect = 0;
        this.adaptiveTestUsedQuestions = {};
        this.adaptiveTestConfirmationQuestions = [];
        this.adaptiveTestConfirmationCorrect = 0;
        this.adaptiveTestConfirmationTotal = 0;
        this.adaptiveTestLevelStats = {};
        this.adaptiveTestLevelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        this.adaptiveTestQuestionBank = {};
        
        // ========== نظام اختبار المستوى السماعي ==========
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
        this.adaptiveListeningMinQuestions = 15;
        this.adaptiveListeningLastAnswer = null;
        this.adaptiveListeningAnswered = false;
        this.listeningBestLevel = 'A1';
        this.readingStartLevelFromListening = 'A2';
        this.listeningResult = null;
        
        // متغيرات التطبيق الأساسية
        this.repeatAllSessionMastered = [];
        this.currentAudio = null;
        this.audioPlaybackRate = 1.0;
        this.availableSpeeds = [0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0];
        this.theme = localStorage.getItem('theme') || 'light';
        this.jumbleArabicHint = '';
        this.jumbleCurrentSentence = '';
        this.lang = localStorage.getItem('appLang') || 'ar';
        this.skippedCards = [];
        this.xpEarnedWords = [];
        document.documentElement.setAttribute('dir', this.lang === 'ar' ? 'rtl' : 'ltr');

        this.userStats = { xp: 0, level: 1, badges: [], earnedBadges: [], tier: 'برونزي' };
        this.placementResults = [];
        this.placementFullHistory = [];
        this.currentPlacementDetails = [];
        this.viewingPlacementDetails = null;
        this.userCoins = 0;
        this.showCoinModal = false;
        this.showPurchaseForm = false;

        // متغيرات التمارين
        this.jumbleOriginalSentence = '';
        this.jumbleWords = [];
        this.jumbleUserAnswer = [];
        this.jumbleChecked = false;
        this.jumbleCorrect = false;
        this.jumbleHintUsedCount = 0;
        this.jumbleHistory = [];
        this.jumbleUnlocked = {};
        this.jumbleNextCount = 0;

        this.listeningRemaining = [];
        this.listeningCurrent = null;
        this.listeningOptions = [];
        this.listeningAnswered = false;
        this.listeningTimer = null;
        this.listeningErrorTimer = null;
        this.listeningUnlocked = {};
        this.listeningNextCount = 0;
        this.listeningCorrectCount = 0;
        this.listeningCorrectTotal = 0;

        this.spellingRemaining = [];
        this.spellingCurrent = null;
        this.spellingAnswered = false;
        this.spellingUserAnswer = '';
        this.spellingResult = null;
        this.spellingUnlocked = {};
        this.spellingNextCount = 0;
        this.spellingCorrectCount = 0;
        this.spellingCorrectTotal = 0;

        this.gapFillRemaining = [];
        this.gapFillCurrentQuestion = null;
        this.gapFillOptions = [];
        this.gapFillAnswered = false;
        this.gapFillResult = null;
        this.gapFillTimer = null;
        this.gapFillUnlocked = {};
        this.gapFillExplanation = '';
        this.gapFillExplanationVisible = false;
        this.gapFillOptionsMeanings = [];
        this.gapFillNextCount = 0;
        this.gapFillUsedQuestions = {};
        this.gapFillNoQuestionsMessageShown = false;
        this.gapFillAvailableWords = [];
        this.gapFillRemainingWords = [];
        this.gapFillCurrentLessonId = null;
        this.gapFillCorrectCount = 0;
        this.gapFillCorrectTotal = 0;

        this.levelTestLevel = null;
        this.levelTestLessons = [];
        this.levelTestCurrentLessonIndex = 0;
        this.levelTestCurrentLessonId = null;
        this.levelTestLessonQuestions = [];
        this.levelTestRequiredCorrect = 5;
        this.levelTestCurrentCorrect = 0;
        this.levelTestCurrentTotal = 0;
        this.levelTestQuestionsBank = {};
        this.levelTestResults = [];
        this.levelTestQuestionsAnswered = 0;
        this.levelTestMaxQuestions = 100;
        this.levelTestCurrentQuestion = null;
        this.levelTestCurrentOptions = [];
        this.levelTestUnlockedCount = 0;
        this.levelTestCoinsEarned = 0;

        this.lastTestedLesson = { beginner: 0, intermediate: 0, advanced: 0 };
        this.newWordsAddedCount = 0;
        this.adWatchedCount = 0;
        this.purchaseRequests = [];

        this.userProfile = {
            name: '',
            age: '',
            joinDate: new Date().toLocaleDateString('ar-EG'),
            level: 'A1',
            image: '',
            testsHistory: []
        };
        
        this.showUserInfoModal = false;
        this.authMode = 'login';
        this.showLevelTestPromptAfterSignup = false;
        this.pendingNewUser = null;

        this.currentUser = null;
        this.userData = null;
        this.userVocabulary = [];
        this.masteredWords = [];
        this.unlockedLessons = [];
        this.hiddenFromCards = [];
        this.customLessons = {};
        this.generatedLessons = {};

        this.showAllCardsTemporary = false;
        this.isUnlockTest = false;
        this.tempLessonToUnlock = null;
        this.selectedLevel = null;
        this.selectedLessonId = null;
        this.currentCardIndex = 0;
        this.quizQuestions = [];
        this.quizIndex = 0;
        this.quizScore = 0;
        this.quizOptions = [];
        this.audioCtx = null;
        this.isWaiting = false;
        this.scrollPos = 0;
        this.levelTestResultMessage = '';

        this.exerciseStats = {
            quiz: { correct: 0, total: 0 },
            listening: { correct: 0, total: 0 },
            spelling: { correct: 0, total: 0 },
            gapFill: { correct: 0, total: 0 }
        };

        this.quizCorrectWords = [];
        this.listeningCorrectWords = [];
        this.spellingCorrectWords = [];
        this.gapFillCorrectWords = [];

        this.badgeDefinitions = {
            general: [
                { id: 'bronze_medal', icon: '🥉', name: 'وسام برونزي', nameEn: 'Bronze Medal', requirement: { lessons: 5, words: 100 }, condition: (stats) => stats.totalLessons >= 5 && stats.totalMastered >= 100 },
                { id: 'silver_medal', icon: '🥈', name: 'وسام فضي', nameEn: 'Silver Medal', requirement: { lessons: 15, words: 300 }, condition: (stats) => stats.totalLessons >= 15 && stats.totalMastered >= 300 },
                { id: 'gold_medal', icon: '🥇', name: 'وسام ذهبي', nameEn: 'Gold Medal', requirement: { lessons: 35, words: 800 }, condition: (stats) => stats.totalLessons >= 35 && stats.totalMastered >= 800 },
                { id: 'diamond_medal', icon: '💎', name: 'وسام ماسي', nameEn: 'Diamond Medal', requirement: { lessons: 60, words: 2000 }, condition: (stats) => stats.totalLessons >= 60 && stats.totalMastered >= 2000 },
                { id: 'bronze_crown', icon: '👑', name: 'تاج برونزي', nameEn: 'Bronze Crown', requirement: { lessons: 80, words: 2500 }, condition: (stats) => stats.totalLessons >= 80 && stats.totalMastered >= 2500 },
                { id: 'silver_crown', icon: '👑', name: 'تاج فضي', nameEn: 'Silver Crown', requirement: { lessons: 100, words: 3500 }, condition: (stats) => stats.totalLessons >= 100 && stats.totalMastered >= 3500 },
                { id: 'gold_crown', icon: '👑', name: 'تاج ذهبي', nameEn: 'Gold Crown', requirement: { lessons: 120, words: 5000 }, condition: (stats) => stats.totalLessons >= 120 && stats.totalMastered >= 5000 },
                { id: 'diamond_crown', icon: '👑', name: 'تاج ماسي', nameEn: 'Diamond Crown', requirement: { lessons: 150, words: 7000 }, condition: (stats) => stats.totalLessons >= 150 && stats.totalMastered >= 7000 }
            ],
            quiz: [
                { id: 'quiz_beginner', icon: '📖', name: 'مبتدئ', nameEn: 'Beginner', requirement: 25, condition: (count) => count >= 25 },
                { id: 'quiz_diligent', icon: '📚', name: 'مجتهد', nameEn: 'Diligent', requirement: 125, condition: (count) => count >= 125 },
                { id: 'quiz_advanced', icon: '🎓', name: 'متقدم', nameEn: 'Advanced', requirement: 350, condition: (count) => count >= 350 },
                { id: 'quiz_expert', icon: '🏅', name: 'خبير', nameEn: 'Expert', requirement: 500, condition: (count) => count >= 500 },
                { id: 'quiz_professional', icon: '🏆', name: 'محترف', nameEn: 'Professional', requirement: 1000, condition: (count) => count >= 1000 }
            ],
            listening: [
                { id: 'listening_beginner', icon: '🎧', name: 'مبتدئ', nameEn: 'Beginner', requirement: 25, condition: (count) => count >= 25 },
                { id: 'listening_diligent', icon: '🎵', name: 'مجتهد', nameEn: 'Diligent', requirement: 125, condition: (count) => count >= 125 },
                { id: 'listening_advanced', icon: '🎼', name: 'متقدم', nameEn: 'Advanced', requirement: 250, condition: (count) => count >= 250 },
                { id: 'listening_expert', icon: '🎙️', name: 'خبير', nameEn: 'Expert', requirement: 350, condition: (count) => count >= 350 },
                { id: 'listening_professional', icon: '🏅', name: 'محترف', nameEn: 'Professional', requirement: 500, condition: (count) => count >= 500 }
            ],
            spelling: [
                { id: 'spelling_beginner', icon: '✏️', name: 'مبتدئ', nameEn: 'Beginner', requirement: 25, condition: (count) => count >= 25 },
                { id: 'spelling_diligent', icon: '📝', name: 'مجتهد', nameEn: 'Diligent', requirement: 100, condition: (count) => count >= 100 },
                { id: 'spelling_advanced', icon: '✍️', name: 'متقدم', nameEn: 'Advanced', requirement: 200, condition: (count) => count >= 200 },
                { id: 'spelling_expert', icon: '🖋️', name: 'خبير', nameEn: 'Expert', requirement: 350, condition: (count) => count >= 350 },
                { id: 'spelling_professional', icon: '🏆', name: 'محترف', nameEn: 'Professional', requirement: 500, condition: (count) => count >= 500 }
            ],
            gapFill: [
                { id: 'gapfill_beginner', icon: '🔲', name: 'مبتدئ', nameEn: 'Beginner', requirement: 50, condition: (count) => count >= 50 },
                { id: 'gapfill_diligent', icon: '📊', name: 'مجتهد', nameEn: 'Diligent', requirement: 150, condition: (count) => count >= 150 },
                { id: 'gapfill_advanced', icon: '📈', name: 'متقدم', nameEn: 'Advanced', requirement: 250, condition: (count) => count >= 250 },
                { id: 'gapfill_expert', icon: '🎯', name: 'خبير', nameEn: 'Expert', requirement: 400, condition: (count) => count >= 400 },
                { id: 'gapfill_professional', icon: '💎', name: 'محترف', nameEn: 'Professional', requirement: 800, condition: (count) => count >= 800 }
            ]
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // ====================== دوال مساعدة ======================
    t(ar, en) { return this.lang === 'en' ? en : ar; }
    
    toggleLanguage() {
        this.lang = this.lang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('appLang', this.lang);
        document.documentElement.setAttribute('dir', this.lang === 'ar' ? 'rtl' : 'ltr');
        this.render();
    }

    shuffleArray(arr) { 
        for (let i = arr.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [arr[i], arr[j]] = [arr[j], arr[i]]; 
        } 
    }

    // ====================== نظام AudioContext الآمن ======================
    initAudioContext() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(e => console.warn("AudioContext resume error:", e));
        }
    }

    // ====================== نظام نقاط الخبرة (XP) مع منع التكرار ======================
    async addXPOnce(amount, wordId, context = 'general') {
        const idStr = `${context}_${wordId}`;
        if (!this.xpEarnedWords.includes(idStr)) {
            this.userStats.xp += amount;
            this.xpEarnedWords.push(idStr);
            await this.updateLevelAndBadges();
            await this.saveUserData();
            return true;
        }
        return false;
    }

    getRequiredXPForLevel(level) {
        if (level <= 1) return 0;
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += 100 + (i - 1) * 100 + Math.pow(i - 1, 2) * 10;
        }
        return total;
    }

    getCurrentLevelProgress() {
        const currentXP = this.userStats.xp;
        let level = 1;
        let totalRequired = 0;
        while (true) {
            const nextRequired = 100 + (level - 1) * 100 + Math.pow(level - 1, 2) * 10;
            if (currentXP < totalRequired + nextRequired) {
                const currentProgress = currentXP - totalRequired;
                const neededForNext = nextRequired;
                return { level, currentProgress, neededForNext, totalXP: currentXP };
            }
            totalRequired += nextRequired;
            level++;
        }
    }

    async updateLevelAndBadges() {
        if (!this.canSave) return;
        const oldLevel = this.userStats.level;
        const newProgress = this.getCurrentLevelProgress();
        const newLevel = newProgress.level;
        if (newLevel > oldLevel) {
            this.userStats.level = newLevel;
            const levelsGained = newLevel - oldLevel;
            this.userCoins += levelsGained * 100;
            const congratsMsg = this.t('تهانينا! لقد وصلت إلى المستوى', 'Congrats! You reached level') + ' ' + newLevel + ' ' + this.t('وحصلت على', 'and earned') + ' ' + (levelsGained * 100) + ' ' + this.t('لؤلؤة!', 'pearls!');
            this.showCustomModal('success', '🎉', congratsMsg);
        }
        const totalLessons = (this.unlockedLessons || []).length;
        const totalMastered = (this.masteredWords || []).length;
        if (totalMastered >= 7000 && totalLessons >= 150) this.userStats.tier = this.t('👑 تاج ماسي', '👑 Diamond Crown');
        else if (totalMastered >= 5000 && totalLessons >= 120) this.userStats.tier = this.t('👑 تاج ذهبي', '👑 Gold Crown');
        else if (totalMastered >= 3500 && totalLessons >= 100) this.userStats.tier = this.t('👑 تاج فضي', '👑 Silver Crown');
        else if (totalMastered >= 2500 && totalLessons >= 80) this.userStats.tier = this.t('👑 تاج برونزي', '👑 Bronze Crown');
        else if (totalMastered >= 2000 && totalLessons >= 60) this.userStats.tier = this.t('💎 وسام ماسي', '💎 Diamond Medal');
        else if (totalMastered >= 800 && totalLessons >= 35) this.userStats.tier = this.t('🥇 وسام ذهبي', '🥇 Gold Medal');
        else if (totalMastered >= 300 && totalLessons >= 15) this.userStats.tier = this.t('🥈 وسام فضي', '🥈 Silver Medal');
        else if (totalMastered >= 100 && totalLessons >= 5) this.userStats.tier = this.t('🥉 وسام برونزي', '🥉 Bronze Medal');
        else this.userStats.tier = this.t('مبتدئ', 'Beginner');

        const stats = { totalLessons, totalMastered };
        const newlyEarned = [];
        for (const badge of this.badgeDefinitions.general) {
            if (!this.userStats.earnedBadges?.includes(badge.id) && badge.condition(stats)) {
                this.userStats.earnedBadges = this.userStats.earnedBadges || [];
                this.userStats.earnedBadges.push(badge.id);
                newlyEarned.push(badge);
                this.userCoins += 100;
            }
        }
        for (const exerciseType of ['quiz', 'listening', 'spelling', 'gapFill']) {
            const correctCount = this.exerciseStats[exerciseType]?.correct || 0;
            for (const badge of this.badgeDefinitions[exerciseType]) {
                if (!this.userStats.earnedBadges?.includes(badge.id) && badge.condition(correctCount)) {
                    this.userStats.earnedBadges = this.userStats.earnedBadges || [];
                    this.userStats.earnedBadges.push(badge.id);
                    newlyEarned.push(badge);
                    this.userCoins += 100;
                }
            }
        }
        if (newlyEarned.length > 0) {
            const badgeNames = newlyEarned.map(b => `${b.icon} ${this.t(b.name, b.nameEn)}`).join(', ');
            this.showCustomModal('success', '🏅', this.t(`تهانينا! حصلت على أوسمة جديدة: ${badgeNames}`, `Congratulations! You earned new badges: ${badgeNames}`));
        }
        await this.saveUserData();
    }

    recordCorrectAnswer(exerciseType, wordId) {
        if (!this.exerciseStats[exerciseType]) this.exerciseStats[exerciseType] = { correct: 0, total: 0 };
        
        let correctWordsArray = null;
        if (exerciseType === 'quiz') correctWordsArray = this.quizCorrectWords;
        else if (exerciseType === 'listening') correctWordsArray = this.listeningCorrectWords;
        else if (exerciseType === 'spelling') correctWordsArray = this.spellingCorrectWords;
        else if (exerciseType === 'gapFill') correctWordsArray = this.gapFillCorrectWords;
        
        if (correctWordsArray && !correctWordsArray.includes(wordId)) {
            this.exerciseStats[exerciseType].correct++;
            correctWordsArray.push(wordId);
        }
        this.exerciseStats[exerciseType].total++;
        
        let xpAmount = 0;
        switch(exerciseType) {
            case 'quiz': xpAmount = 2; break;
            case 'jumble': xpAmount = 3; break;
            case 'listening': xpAmount = 4; break;
            case 'spelling': xpAmount = 6; break;
            case 'gapFill': xpAmount = 7; break;
            default: xpAmount = 1;
        }
        if (wordId) this.addXPOnce(xpAmount, wordId, exerciseType);
        this.updateLevelAndBadges();
        this.saveUserData();
    }
    
    recordTotalAnswer(exerciseType) {
        if (!this.exerciseStats[exerciseType]) this.exerciseStats[exerciseType] = { correct: 0, total: 0 };
        this.exerciseStats[exerciseType].total++;
        this.saveUserData();
    }

    addXP(amount, source = '') {
        if (amount <= 0) return;
        this.userStats.xp += amount;
        this.updateLevelAndBadges();
        this.saveUserData();
    }

    addLessonReward(lessonId) {
        const key = `lesson_opened_${lessonId}`;
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, 'true');
            this.addXP(50, 'فتح درس جديد');
        }
    }

    addQuizCorrectReward(wordId) { this.recordCorrectAnswer('quiz', wordId); }
    addSpellingCorrectReward(wordId) { this.recordCorrectAnswer('spelling', wordId); }
    addListeningCorrectReward(wordId) { this.recordCorrectAnswer('listening', wordId); }
    addGapFillCorrectReward(wordId) { this.recordCorrectAnswer('gapFill', wordId); }
    addMasteredWordReward(wordId) { this.addXPOnce(1, wordId, 'mastered'); }

    // ====================== نظام المصادقة ======================
    async handleSignup() {
        if (this.isProcessingAuth) return;
        this.isProcessingAuth = true;
        
        const name = document.getElementById('signupName')?.value;
        const email = document.getElementById('signupEmail')?.value;
        const pass = document.getElementById('signupPass')?.value;
        const confirmPass = document.getElementById('signupConfirmPass')?.value;
        const age = document.getElementById('signupAge')?.value;
        
        if (!name || !email || !pass || !confirmPass) {
            alert(this.t('الرجاء ملء جميع الحقول', 'Please fill all fields'));
            this.isProcessingAuth = false;
            return;
        }
        if (pass !== confirmPass) {
            alert(this.t('كلمة المرور وتأكيدها غير متطابقين', 'Password and confirmation do not match'));
            this.isProcessingAuth = false;
            return;
        }
        if (pass.length < 6) {
            alert(this.t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters'));
            this.isProcessingAuth = false;
            return;
        }
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(userCredential.user, { displayName: name });
            this.currentUser = userCredential.user;
            this.userData = { name: name, email: email, uid: userCredential.user.uid };
            this.resetToDefaults();
            this.userCoins = 100;
            this.userProfile.name = name;
            if (age) this.userProfile.age = age;
            this.isDataLoaded = true;
            this.canSave = true;
            await this.saveUserData();
            
            this.showLevelTestPromptAfterSignup = true;
            this.render();
            this.showCustomModal('question', '🧠', this.t('هل ترغب في إجراء اختبار مستوى اللغة الإنجليزية؟', 'Would you like to take an English level test?'), () => {
                this.showLevelTestPromptAfterSignup = false;
                this.showLevelTestInstructions();
            }, () => {
                this.showLevelTestPromptAfterSignup = false;
                this.currentPage = 'home';
                this.render();
            });
            
        } catch (error) {
            console.error("Signup error:", error);
            alert(this.t('فشل إنشاء الحساب: ' + error.message, 'Signup failed: ' + error.message));
        } finally {
            this.isProcessingAuth = false;
        }
    }

    async handleLogin() {
        if (this.isProcessingAuth) return;
        this.isProcessingAuth = true;
        const email = document.getElementById('loginEmail')?.value;
        const pass = document.getElementById('loginPass')?.value;
        if (!email || !pass) {
            alert(this.t('الرجاء إدخال البريد الإلكتروني وكلمة المرور', 'Please enter email and password'));
            this.isProcessingAuth = false;
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            this.currentUser = userCredential.user;
            this.userData = { name: userCredential.user.displayName || '', email: userCredential.user.email, uid: userCredential.user.uid };
            this.loadingData = true;
            this.render();
            await this.loadUserData(userCredential.user.uid);
            this.currentPage = 'home';
            this.render();
        } catch (error) {
            console.error("Login error:", error);
            alert(this.t('فشل تسجيل الدخول: ' + error.message, 'Login failed: ' + error.message));
        } finally {
            this.isProcessingAuth = false;
        }
    }

    async loadUserData(uid) {
        if (!uid) return;
        try {
            this.loadingData = true;
            this.isDataLoaded = false;
            this.canSave = false;
            this.render();
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("✅ تم تحميل البيانات من Firestore");
                
                this.userModifiedWords = data.userModifiedWords ?? {};
                this.quizCorrectWords = data.quizCorrectWords ?? [];
                this.listeningCorrectWords = data.listeningCorrectWords ?? [];
                this.spellingCorrectWords = data.spellingCorrectWords ?? [];
                this.gapFillCorrectWords = data.gapFillCorrectWords ?? [];

                this.userCoins = data.userCoins ?? 100;
                this.masteredWords = data.masteredWords ?? [];
                this.unlockedLessons = data.unlockedLessons ?? [];
                this.hiddenFromCards = data.hiddenFromCards ?? [];
                this.userVocabulary = data.userVocabulary ?? [];
                this.xpEarnedWords = data.xpEarnedWords ?? [];
                this.userStats = data.userStats ?? { xp: 0, level: 1, badges: [], earnedBadges: [], tier: 'برونزي' };
                this.userProfile = data.userProfile ?? { name: '', age: '', joinDate: new Date().toLocaleDateString('ar-EG'), level: 'A1', image: '', testsHistory: [] };
                
                if (data.userProfile) Object.assign(this.userProfile, data.userProfile);
                if (!this.userProfile.name) this.userProfile.name = data.name || this.userData?.name || '';
                
                this.placementResults = data.placementResults ?? [];
                this.placementFullHistory = data.placementFullHistory ?? [];
                this.exerciseStats = data.exerciseStats ?? { quiz: { correct: 0, total: 0 }, listening: { correct: 0, total: 0 }, spelling: { correct: 0, total: 0 }, gapFill: { correct: 0, total: 0 } };
                this.jumbleUnlocked = data.jumbleUnlocked ?? {};
                this.listeningUnlocked = data.listeningUnlocked ?? {};
                this.spellingUnlocked = data.spellingUnlocked ?? {};
                this.gapFillUnlocked = data.gapFillUnlocked ?? {};
                this.customLessons = data.customLessons ?? {};
                this.generatedLessons = data.generatedLessons ?? {};
                
                if (data.adDailyData) this.adDailyData = data.adDailyData;
                else this.adDailyData = { count: 0, date: new Date().toDateString(), levelCompleted: 0 };
                
                if (this.placementResults?.length) this.userProfile.level = this.placementResults[0].level;
                
                this.isDataLoaded = true;
                this.canSave = true;
                await this.updateLevelAndBadges();
            } else {
                console.log("ℹ️ مستخدم جديد، تهيئة بيانات افتراضية");
                this.resetToDefaults();
                this.userModifiedWords = {};
                this.quizCorrectWords = [];
                this.listeningCorrectWords = [];
                this.spellingCorrectWords = [];
                this.gapFillCorrectWords = [];
                this.isDataLoaded = true;
                this.canSave = true;
            }
        } catch (error) {
            console.error("❌ خطأ في تحميل البيانات:", error);
            this.isDataLoaded = true;
            this.canSave = true;
            this.showCustomModal('error', '⚠️', this.t('فشل تحميل البيانات من الخادم. سيتم العمل محلياً مؤقتاً.', 'Failed to load data. Working offline temporarily.'));
        } finally {
            this.loadingData = false;
            this.render();
        }
    }

    resetToDefaults() {
        this.userCoins = 100;
        this.masteredWords = [];
        this.unlockedLessons = [];
        this.userVocabulary = [];
        this.xpEarnedWords = [];
        this.userStats = { xp: 0, level: 1, badges: [], earnedBadges: [], tier: 'برونزي' };
        this.userProfile = {
            name: this.userData?.name || '',
            age: '',
            joinDate: new Date().toLocaleDateString('ar-EG'),
            level: 'A1',
            image: '',
            testsHistory: []
        };
        this.exerciseStats = {
            quiz: { correct: 0, total: 0 },
            listening: { correct: 0, total: 0 },
            spelling: { correct: 0, total: 0 },
            gapFill: { correct: 0, total: 0 }
        };
        this.adDailyData = { count: 0, date: new Date().toDateString(), levelCompleted: 0 };
        this.quizCorrectWords = [];
        this.listeningCorrectWords = [];
        this.spellingCorrectWords = [];
        this.gapFillCorrectWords = [];
    }

    async saveUserData() {
        if (!this.currentUser || this.loadingData || !this.isDataLoaded || !this.canSave) return;
        const uid = this.currentUser.uid;
        const data = {
            userVocabulary: this.userVocabulary || [],
            masteredWords: this.masteredWords || [],
            userModifiedWords: this.userModifiedWords || {}, 
            unlockedLessons: this.unlockedLessons || [],
            hiddenFromCards: this.hiddenFromCards || [],
            customLessons: this.customLessons || {},
            generatedLessons: this.generatedLessons || {},
            userStats: this.userStats || { xp: 0, level: 1, badges: [], earnedBadges: [], tier: 'برونزي' },
            placementResults: this.placementResults || [],
            placementFullHistory: this.placementFullHistory || [],
            userCoins: this.userCoins || 0,
            jumbleUnlocked: this.jumbleUnlocked || {},
            listeningUnlocked: this.listeningUnlocked || {},
            spellingUnlocked: this.spellingUnlocked || {},
            gapFillUnlocked: this.gapFillUnlocked || {},
            newWordsAddedCount: this.newWordsAddedCount || 0,
            adWatchedCount: this.adWatchedCount || 0,
            purchaseRequests: this.purchaseRequests || [],
            userProfile: this.userProfile || {},
            exerciseStats: this.exerciseStats || {},
            lastTestedLesson: this.lastTestedLesson || {},
            xpEarnedWords: this.xpEarnedWords || [],
            adDailyData: this.adDailyData || { count: 0, date: new Date().toDateString(), levelCompleted: 0 },
            quizCorrectWords: this.quizCorrectWords || [],
            listeningCorrectWords: this.listeningCorrectWords || [],
            spellingCorrectWords: this.spellingCorrectWords || [],
            gapFillCorrectWords: this.gapFillCorrectWords || [],
            lastUpdated: new Date().toISOString()
        };
        try {
            await setDoc(doc(db, "users", uid), data, { merge: true });
            console.log("✅ تم الحفظ في Firestore بنجاح");
        } catch (err) {
            console.error("❌ فشل الحفظ:", err);
            localStorage.setItem(`backup_data_${uid}`, JSON.stringify(data));
        }
    }

    async logout() {
        await this.saveUserData();
        await signOut(auth);
        this.currentUser = null;
        this.userData = null;
        this.resetToDefaults();
        this.isDataLoaded = false;
        this.canSave = false;
        this.currentPage = 'auth';
        this.render();
    }

    // ====================== نظام الإعلانات المتدرج ======================
    getCurrentAdReward() {
        const today = new Date().toDateString();
        if (this.adDailyData.date !== today) {
            this.adDailyData = { count: 0, date: today, levelCompleted: 0 };
            this.saveUserData();
        }
        let levelIndex = this.adDailyData.levelCompleted;
        if (levelIndex >= this.adRewardLevels.length) return null;
        const level = this.adRewardLevels[levelIndex];
        const currentInLevel = this.adDailyData.count - (levelIndex === 0 ? 0 : this.adRewardLevels.slice(0, levelIndex).reduce((s, l) => s + l.adsNeeded, 0));
        return { 
            adsNeeded: level.adsNeeded, reward: level.reward, currentCount: currentInLevel, totalSoFar: this.adDailyData.count, remainingNeeded: level.adsNeeded - currentInLevel, levelIndex: levelIndex
        };
    }

    watchAdsForCoins() {
        const rewardInfo = this.getCurrentAdReward();
        if (!rewardInfo) {
            this.showCustomModal('info', '⚠️', this.t('لقد استنفدت جميع مستويات الإعلانات اليوم. عاود غداً!', 'You have exhausted all ad reward levels today. Come back tomorrow!'));
            return;
        }
        this.showAd('rewarded', (success) => {
            if (success) {
                const today = new Date().toDateString();
                if (this.adDailyData.date !== today) this.adDailyData = { count: 0, date: today, levelCompleted: 0 };
                this.adDailyData.count++;
                const currentLevel = this.adRewardLevels[this.adDailyData.levelCompleted];
                if (currentLevel) {
                    const currentLevelCount = this.adDailyData.count - (this.adDailyData.levelCompleted === 0 ? 0 : this.adRewardLevels.slice(0, this.adDailyData.levelCompleted).reduce((s, l) => s + l.adsNeeded, 0));
                    if (currentLevelCount >= currentLevel.adsNeeded) {
                        this.userCoins += currentLevel.reward;
                        this.adDailyData.levelCompleted++;
                        this.showCustomModal('success', '🎉', this.t(`تهانينا! حصلت على ${currentLevel.reward} لؤلؤة. (المستوى ${this.adDailyData.levelCompleted} من ${this.adRewardLevels.length})`, `Congratulations! You earned ${currentLevel.reward} pearls. (Level ${this.adDailyData.levelCompleted} of ${this.adRewardLevels.length})`));
                    } else {
                        this.showCustomModal('info', '📺', this.t(`شاهدت إعلاناً! تقدمك: ${currentLevelCount}/${currentLevel.adsNeeded} للإعلانات في هذا المستوى.`, `You watched an ad! Progress: ${currentLevelCount}/${currentLevel.adsNeeded} ads in this level.`));
                    }
                }
                this.saveUserData();
                this.render();
            }
        });
    }

    showAd(type, callback) {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-overlay';
        modalDiv.onclick = (e) => { if (e.target === modalDiv) { modalDiv.remove(); if (callback) callback(false); } };
        modalDiv.innerHTML = `
            <div class="modal-content" style="text-align:center;">
                <div class="result-icon" style="font-size:3rem;">📺</div>
                <div class="result-message" style="font-size:1.1rem; font-weight:bold;">${this.t('جارٍ عرض الإعلان', 'Ad is playing')}</div>
                <div class="result-message" style="font-size:0.85rem; margin-top:-5px; color:#666;">${this.t('يرجى الانتظار قليلاً', 'Please wait a moment')}</div>
                <div class="progress-bar-container" style="margin:15px 0;"><div class="progress-bar-fill" style="width:0%; transition:width 2s linear;"></div></div>
                <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;"><button class="hero-btn" id="cancelAdBtn" style="background:#ef4444;">${this.t('إلغاء', 'Cancel')}</button></div>
            </div>
        `;
        document.body.appendChild(modalDiv);
        const progressBar = modalDiv.querySelector('.progress-bar-fill');
        setTimeout(() => { if (progressBar) progressBar.style.width = '100%'; }, 50);
        const cancelBtn = modalDiv.querySelector('#cancelAdBtn');
        cancelBtn.onclick = () => { modalDiv.remove(); if (callback) callback(false); };
        setTimeout(() => { if (modalDiv.parentNode) { modalDiv.remove(); if (callback) callback(true); } }, 2000);
    }

    requestPurchase() { this.showPurchaseForm = true; this.showCoinModal = true; this.render(); }
    
    submitPurchaseRequest() {
        const name = document.getElementById('purchaseName')?.value;
        const email = document.getElementById('purchaseEmail')?.value;
        const phone = document.getElementById('purchasePhone')?.value;
        if (!name || !email || !phone) { this.showCustomModal('error', '❌', this.t('الرجاء إدخال جميع البيانات', 'Please fill all fields')); return; }
        this.purchaseRequests.push({ name, email, phone, coins: 300, date: new Date().toISOString(), status: 'pending' });
        this.saveUserData();
        this.showCustomModal('success', '✅', this.t('تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً.', 'Your request has been sent.'));
        this.showPurchaseForm = false;
        this.showCoinModal = false;
        this.render();
    }
    
    toggleCoinModal() { this.showCoinModal = !this.showCoinModal; this.showPurchaseForm = false; this.render(); }

    showCustomModal(type, icon, message, onConfirm = null, onCancel = null) {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-overlay';
        modalDiv.onclick = (e) => { if (e.target === modalDiv) { modalDiv.remove(); if (onCancel) onCancel(); } };
        if (type === 'question') {
            modalDiv.innerHTML = `<div class="modal-content result-modal"><div class="result-icon" style="font-size:3rem; text-align:center;">${icon}</div><div class="result-message" style="text-align:center; margin:15px 0;">${message}</div><div style="display:flex; gap:12px; justify-content:center;"><button class="hero-btn" id="modalConfirmYesBtn" style="background:#10b981;">${this.t('نعم', 'Yes')}</button><button class="hero-btn" id="modalConfirmNoBtn" style="background:#ef4444;">${this.t('لا', 'No')}</button></div></div>`;
            document.body.appendChild(modalDiv);
            document.getElementById('modalConfirmYesBtn').onclick = () => { modalDiv.remove(); if (onConfirm) onConfirm(); };
            document.getElementById('modalConfirmNoBtn').onclick = () => { modalDiv.remove(); if (onCancel) onCancel(); };
        } else {
            modalDiv.innerHTML = `<div class="modal-content result-modal"><div class="result-icon" style="font-size:3rem; text-align:center;">${icon}</div><div class="result-message" style="text-align:center; margin:15px 0;">${message}</div><button class="hero-btn" id="modalConfirmBtn" style="background:#3b82f6; width:100%;">${this.t('حسناً', 'OK')}</button></div>`;
            document.body.appendChild(modalDiv);
            const confirmBtn = modalDiv.querySelector('#modalConfirmBtn');
            confirmBtn.onclick = () => { modalDiv.remove(); if (onConfirm) onConfirm(); };
        }
    }

    showCoinPurchaseModal(price, onConfirm, onCancel = null) {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-overlay';
        modalDiv.onclick = (e) => { if (e.target === modalDiv) modalDiv.remove(); if (onCancel) onCancel(); };
        modalDiv.innerHTML = `<div class="modal-content result-modal" style="text-align:center;"><div class="result-icon" style="font-size:2.5rem;">💎</div><div class="result-message" style="font-size:1rem; margin-bottom:15px;">${this.t(`هل تريد فتح هذه الميزة بـ ${price} لؤلؤة؟`, `Do you want to unlock this feature for ${price} pearls?`)}</div><div style="display:flex; gap:12px; justify-content:center;"><button class="hero-btn" id="confirmPurchaseBtn" style="background:#10b981;">${this.t('تأكيد', 'Confirm')}</button><button class="hero-btn" id="cancelPurchaseBtn" style="background:#ef4444;">${this.t('إلغاء', 'Cancel')}</button></div></div>`;
        document.body.appendChild(modalDiv);
        document.getElementById('confirmPurchaseBtn').onclick = () => { modalDiv.remove(); onConfirm(true); };
        document.getElementById('cancelPurchaseBtn').onclick = () => { modalDiv.remove(); if (onCancel) onCancel(); };
    }

    showConfirmModal(message, onConfirm, onCancel = null) {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-overlay';
        modalDiv.onclick = (e) => { if (e.target === modalDiv) { modalDiv.remove(); if (onCancel) onCancel(); } };
        modalDiv.innerHTML = `<div class="modal-content" style="text-align:center;"><div class="result-icon" style="font-size:2.5rem;">❓</div><div class="result-message" style="font-size:1rem; margin-bottom:20px;">${message}</div><div style="display:flex; gap:12px; justify-content:center;"><button class="hero-btn" id="confirmYesBtn" style="background:#10b981;">${this.t('نعم', 'Yes')}</button><button class="hero-btn" id="confirmNoBtn" style="background:#ef4444;">${this.t('إلغاء', 'Cancel')}</button></div></div>`;
        document.body.appendChild(modalDiv);
        document.getElementById('confirmYesBtn').onclick = () => { modalDiv.remove(); if (onConfirm) onConfirm(); };
        document.getElementById('confirmNoBtn').onclick = () => { modalDiv.remove(); if (onCancel) onCancel(); };
    }

    // ====================== دوال التطبيق الأساسية ======================
    unlockLessonWithCoins(lessonId) {
        if (this.userCoins >= 100) {
            this.showCoinPurchaseModal(100, (confirmed) => {
                if (confirmed) {
                    this.userCoins -= 100;
                    this.unlockedLessons.push(String(lessonId));
                    this.saveUserData();
                    this.updateLevelAndBadges();
                    this.showCustomModal('success', '🎉', this.t(`تم فتح الدرس بنجاح!`, `Lesson unlocked successfully!`));
                    this.selectedLessonId = lessonId;
                    this.currentPage = 'reading';
                    this.isUnlockTest = false;
                    this.render();
                }
            });
        } else {
            this.showCustomModal('error', '❌', this.t('ليس لديك لآلئ كافية! تحتاج 100 لؤلؤة.', 'You don\'t have enough pearls! You need 100 pearls.'));
        }
    }

    openLesson(lessonId) {
        const list = this.getLessonsForCurrentLevel();
        const isUnlocked = this.unlockedLessons.includes(String(lessonId)) || (list[0] && list[0].id == lessonId) || this.selectedLevel === 'custom_list';
        if (isUnlocked) {
            const defaultLessonIds = [1, 61, 301];
            const isDefault = defaultLessonIds.includes(Number(lessonId));
            if (!isDefault && !this.unlockedLessons.includes(String(lessonId)) && this.selectedLevel !== 'custom_list') this.addLessonReward(lessonId);
            this.selectedLessonId = lessonId;
            this.resetExercisesForNewLesson();
            this.currentPage = 'reading';
            this.isUnlockTest = false;
            this.resetGapFillForNewLesson();
        } else {
            this.tempLessonToUnlock = lessonId;
            this.currentPage = 'unlock_choice';
        }
        this.render();
    }

    resetExercisesForNewLesson() {
        this.spellingRemaining = [];
        this.spellingCurrent = null;
        this.spellingAnswered = false;
        this.spellingUserAnswer = '';
        this.spellingResult = null;
        this.listeningRemaining = [];
        this.listeningCurrent = null;
        this.listeningOptions = [];
        this.listeningAnswered = false;
        if (this.listeningTimer) clearTimeout(this.listeningTimer);
        if (this.listeningErrorTimer) clearTimeout(this.listeningErrorTimer);
        this.jumbleHistory = [];
        this.jumbleChecked = false;
        this.jumbleCorrect = false;
        this.jumbleHintUsedCount = 0;
        this.gapFillRemainingWords = [];
        this.gapFillUsedQuestions = {};
        this.gapFillCurrentLessonId = null;
        this.gapFillCurrentQuestion = null;
        this.gapFillAnswered = false;
        this.gapFillResult = null;
        this.gapFillExplanationVisible = false;
    }

    resetGapFillForNewLesson() {
        this.gapFillRemainingWords = [];
        this.gapFillUsedQuestions = {};
        this.gapFillCurrentLessonId = null;
        this.gapFillNoQuestionsMessageShown = false;
        this.gapFillCurrentQuestion = null;
        this.gapFillAnswered = false;
        this.gapFillResult = null;
        this.gapFillExplanationVisible = false;
    }

    getLessonsForCurrentLevel() {
        if (!this.selectedLevel) return [];
        let originalLessons = window.lessonsList[this.selectedLevel] || [];
        let generated = Object.values(this.generatedLessons).filter(l => l.level === this.selectedLevel);
        let generatedLessonsFormatted = generated.map(g => ({ id: g.id, title: g.title, isGenerated: true }));
        return [...originalLessons, ...generatedLessonsFormatted];
    }

    addTestToHistory(testType, score, details) { this.userProfile.testsHistory.push({ type: testType, date: new Date().toLocaleString('ar-EG'), score: score, details: details }); }
    
    showProfile() { this.currentPage = 'profile'; this.render(); }
    
    showTestHistory() { this.currentPage = 'test_history'; this.render(); }
    
    viewTestDetails(index) { const record = this.placementResults[index]; if (record) { this.viewingPlacementDetails = record; this.currentPage = 'placement_details'; this.render(); } }
    
    deletePlacementTest(index) {
        this.showConfirmModal(this.t('هل أنت متأكد من حذف هذا الاختبار من السجل؟', 'Are you sure you want to delete this test from history?'), () => {
            this.placementResults.splice(index, 1);
            this.saveUserData();
            this.render();
            this.showCustomModal('success', '✅', this.t('تم حذف الاختبار بنجاح', 'Test deleted successfully'));
        });
    }

    updateProfile() {
        const newName = document.getElementById('profileName')?.value;
        const newAge = document.getElementById('profileAge')?.value;
        const imageFile = document.getElementById('profileImage')?.files[0];
        
        if (newName) { 
            this.userProfile.name = newName; 
            if (this.userData && this.currentUser) { 
                this.userData.name = newName; 
                updateProfile(this.currentUser, { displayName: newName }).catch(console.error); 
            } 
        }
        if (newAge) this.userProfile.age = newAge;
        if (imageFile) { 
            const reader = new FileReader(); 
            reader.onload = (e) => { 
                this.userProfile.image = e.target.result; 
                this.saveUserData(); 
                this.render(); 
            }; 
            reader.readAsDataURL(imageFile); 
        }
        this.saveUserData();
        this.render();
        this.showCustomModal('success', '✅', this.t('تم حفظ التغييرات بنجاح', 'Changes saved successfully'));
    }
    
    async updateEmail() {
        const newEmail = prompt(this.t('أدخل البريد الإلكتروني الجديد:', 'Enter new email:'));
        if (newEmail && newEmail.includes('@')) {
            if (this.currentUser) {
                try {
                    await updateEmail(this.currentUser, newEmail);
                    this.userData.email = newEmail;
                    await this.saveUserData();
                    this.showCustomModal('success', '✅', this.t('تم تغيير البريد الإلكتروني بنجاح. يرجى تأكيد البريد الجديد.', 'Email changed successfully. Please verify your new email.'));
                    this.render();
                } catch (err) {
                    this.showCustomModal('error', '❌', this.t('فشل تغيير البريد الإلكتروني: ' + err.message, 'Failed to change email: ' + err.message));
                }
            }
        } else if (newEmail) {
            this.showCustomModal('error', '❌', this.t('البريد الإلكتروني غير صالح', 'Invalid email'));
        }
    }

    getEnglishLevel() { return this.userProfile.level || 'A1'; }
    
    showUserInfo() { this.showUserInfoModal = true; this.render(); }
    
    closeUserInfoModal() { this.showUserInfoModal = false; this.render(); }
    
    changeUserPassword() {
        const newPass = prompt(this.t('أدخل كلمة المرور الجديدة:', 'Enter new password:'));
        if (newPass && newPass.length >= 6) {
            if (this.currentUser) {
                updatePassword(this.currentUser, newPass).then(() => {
                    this.showCustomModal('success', '✅', this.t('تم تغيير كلمة المرور بنجاح', 'Password changed successfully'));
                }).catch(err => {
                    this.showCustomModal('error', '❌', this.t('فشل تغيير كلمة المرور: ' + err.message, 'Failed to change password: ' + err.message));
                });
            } else {
                this.showCustomModal('error', '❌', this.t('لم يتم تسجيل الدخول', 'Not logged in'));
            }
        } else if (newPass) {
            this.showCustomModal('error', '❌', this.t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters'));
        }
    }
    
    verifyEmail() {
        if (this.currentUser) {
            if (this.currentUser.emailVerified) {
                this.showCustomModal('info', '✅', this.t('بريدك الإلكتروني مؤكد بالفعل', 'Your email is already verified'));
            } else {
                sendEmailVerification(this.currentUser).then(() => {
                    this.showCustomModal('success', '📧', this.t('تم إرسال رابط التأكيد إلى بريدك الإلكتروني', 'Verification link sent to your email'));
                }).catch(err => {
                    this.showCustomModal('error', '❌', this.t('فشل إرسال رابط التأكيد: ' + err.message, 'Failed to send verification link: ' + err.message));
                });
            }
        } else {
            this.showCustomModal('error', '❌', this.t('لم يتم تسجيل الدخول', 'Not logged in'));
        }
    }

    syncTestHistoryFromBackup() {
        const backup = localStorage.getItem('placementResults_backup');
        if (backup) {
            try {
                this.placementResults = JSON.parse(backup);
                this.saveUserData();
                this.render();
                this.showCustomModal('success', '✅', this.t('تم استعادة الاختبارات بنجاح', 'Tests restored successfully'));
            } catch(e) {
                this.showCustomModal('error', '❌', this.t('فشل استعادة النسخة الاحتياطية', 'Failed to restore backup'));
            }
        } else {
            this.showCustomModal('info', 'ℹ️', this.t('لا توجد نسخة احتياطية', 'No backup found'));
        }
    }

    // ====================== نظام اختبار المستوى ======================
    prepareAdaptiveQuestionBank() {
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        this.adaptiveTestQuestionBank = {};
        for (let level of levels) {
            if (window.placementBank && window.placementBank[level]) {
                this.adaptiveTestQuestionBank[level] = [...window.placementBank[level]];
            } else {
                this.adaptiveTestQuestionBank[level] = [];
            }
        }
    }

    loadAdaptiveQuestionSet(level, count) {
        const bank = this.adaptiveTestQuestionBank[level];
        if (!bank || bank.length === 0) return [];
        const usedIds = this.adaptiveTestUsedQuestions[level] || [];
        let available = bank.filter(q => !usedIds.includes(q.id));
        if (available.length < count) {
            if (available.length === 0) {
                this.adaptiveTestUsedQuestions[level] = [];
                available = [...bank];
            }
        }
        const shuffled = [...available];
        this.shuffleArray(shuffled);
        const selected = shuffled.slice(0, count);
        if (!this.adaptiveTestUsedQuestions[level]) this.adaptiveTestUsedQuestions[level] = [];
        for (let q of selected) {
            this.adaptiveTestUsedQuestions[level].push(q.id);
        }
        this.adaptiveTestCurrentSetQuestions = selected;
        this.adaptiveTestCurrentSetIndex = 0;
        this.adaptiveTestCurrentSetCorrect = 0;
    }

    getCurrentAdaptiveQuestion() {
        if (this.adaptiveTestPhase === 'confirmation') {
            if (this.adaptiveTestConfirmationQuestions.length > 0) {
                return this.adaptiveTestConfirmationQuestions[0];
            }
            return null;
        }
        if (this.adaptiveTestCurrentSetIndex >= this.adaptiveTestCurrentSetQuestions.length) {
            this.evaluateCurrentSetAndTransition();
            if (this.adaptiveTestPhase === 'confirmation') {
                if (this.adaptiveTestConfirmationQuestions.length > 0) {
                    return this.adaptiveTestConfirmationQuestions[0];
                }
                return null;
            } else {
                if (this.adaptiveTestCurrentSetQuestions.length === 0) {
                    this.loadAdaptiveQuestionSet(this.adaptiveTestCurrentLevel, 4);
                }
                this.adaptiveTestCurrentSetIndex = 0;
                if (this.adaptiveTestCurrentSetQuestions.length === 0) return null;
                return this.adaptiveTestCurrentSetQuestions[0];
            }
        }
        return this.adaptiveTestCurrentSetQuestions[this.adaptiveTestCurrentSetIndex];
    }

    evaluateCurrentSetAndTransition() {
        const setSize = this.adaptiveTestCurrentSetQuestions.length;
        const setCorrect = this.adaptiveTestCurrentSetCorrect;
        const percentage = setSize > 0 ? (setCorrect / setSize) * 100 : 0;

        if (!this.adaptiveTestLevelStats[this.adaptiveTestCurrentLevel]) {
            this.adaptiveTestLevelStats[this.adaptiveTestCurrentLevel] = { correct: 0, total: 0 };
        }
        this.adaptiveTestLevelStats[this.adaptiveTestCurrentLevel].correct += setCorrect;
        this.adaptiveTestLevelStats[this.adaptiveTestCurrentLevel].total += setSize;

        this.adaptiveTestTotalQuestions += setSize;

        if (this.adaptiveTestTotalQuestions >= this.adaptiveTestMaxQuestions) {
            this.finalizeAdaptiveTest();
            return;
        }

        const levels = this.adaptiveTestLevelOrder;
        const currentIdx = levels.indexOf(this.adaptiveTestCurrentLevel);

        if (this.adaptiveTestPhase === 'initial') {
            if (percentage >= 70) {
                if (currentIdx < levels.length - 1) {
                    this.adaptiveTestCurrentLevel = levels[currentIdx + 1];
                    this.adaptiveTestPhase = 'moving_up';
                } else {
                    this.adaptiveTestPhase = 'confirmation';
                    this.prepareConfirmationQuestions();
                }
            } else if (percentage <= 40) {
                if (currentIdx > 0) {
                    this.adaptiveTestCurrentLevel = levels[currentIdx - 1];
                    this.adaptiveTestPhase = 'moving_down';
                } else {
                    this.adaptiveTestPhase = 'confirmation';
                    this.prepareConfirmationQuestions();
                }
            } else {
                this.adaptiveTestPhase = 'confirmation';
                this.prepareConfirmationQuestions();
            }
        }
        else if (this.adaptiveTestPhase === 'moving_up' || this.adaptiveTestPhase === 'moving_down') {
            if (percentage >= 70) {
                if (this.adaptiveTestPhase === 'moving_up') {
                    if (currentIdx < levels.length - 1) {
                        this.adaptiveTestCurrentLevel = levels[currentIdx + 1];
                    } else {
                        this.adaptiveTestPhase = 'confirmation';
                        this.prepareConfirmationQuestions();
                    }
                } else {
                    this.adaptiveTestPhase = 'confirmation';
                    this.prepareConfirmationQuestions();
                }
            } else if (percentage <= 40) {
                if (currentIdx > 0) {
                    this.adaptiveTestCurrentLevel = levels[currentIdx - 1];
                    if (this.adaptiveTestPhase === 'moving_up') {
                        this.adaptiveTestPhase = 'moving_down';
                    }
                } else {
                    this.adaptiveTestPhase = 'confirmation';
                    this.prepareConfirmationQuestions();
                }
            } else {
                this.adaptiveTestPhase = 'confirmation';
                this.prepareConfirmationQuestions();
            }
        }

        if (this.adaptiveTestPhase !== 'confirmation') {
            this.loadAdaptiveQuestionSet(this.adaptiveTestCurrentLevel, 4);
        }
    }

    prepareConfirmationQuestions() {
        let remaining = this.adaptiveTestMaxQuestions - this.adaptiveTestTotalQuestions;
        let confirmCount = Math.min(12, Math.max(8, remaining));
        if (confirmCount < 5) {
            this.finalizeAdaptiveTest();
            return;
        }
        const bank = this.adaptiveTestQuestionBank[this.adaptiveTestCurrentLevel];
        if (!bank || bank.length === 0) {
            this.finalizeAdaptiveTest();
            return;
        }
        const usedIds = this.adaptiveTestUsedQuestions[this.adaptiveTestCurrentLevel] || [];
        let available = bank.filter(q => !usedIds.includes(q.id));
        if (available.length < confirmCount) {
            available = bank.filter(q => !usedIds.includes(q.id));
            if (available.length === 0) {
                this.adaptiveTestUsedQuestions[this.adaptiveTestCurrentLevel] = [];
                available = [...bank];
            }
        }
        const shuffled = [...available];
        this.shuffleArray(shuffled);
        this.adaptiveTestConfirmationQuestions = shuffled.slice(0, confirmCount);
        this.adaptiveTestConfirmationCorrect = 0;
        this.adaptiveTestConfirmationTotal = this.adaptiveTestConfirmationQuestions.length;
        this.adaptiveTestPhase = 'confirmation';
    }

    handleAdaptiveAnswer(selected, correct, btnElement) {
        if (this.isWaiting) return;
        this.isWaiting = true;
        
        const selectedTrim = selected.trim().toLowerCase();
        const correctTrim = correct.trim().toLowerCase();
        const isCorrect = (selectedTrim === correctTrim);
        this.playTone(isCorrect ? 'correct' : 'error');
        
        let currentQuestion = null;
        
        if (this.adaptiveTestPhase === 'confirmation') {
            currentQuestion = this.adaptiveTestConfirmationQuestions[0];
            if (isCorrect) this.adaptiveTestConfirmationCorrect++;
            this.adaptiveTestHistory.push({
                level: this.adaptiveTestCurrentLevel,
                phase: 'confirmation',
                question: currentQuestion.q,
                options: currentQuestion.options,
                correct: correct,
                selected: selected,
                isCorrect: isCorrect,
                skill: currentQuestion.skill
            });
            this.adaptiveTestConfirmationQuestions.shift();
            this.adaptiveTestTotalQuestions++;
            
            if (this.adaptiveTestConfirmationQuestions.length === 0 || this.adaptiveTestTotalQuestions >= this.adaptiveTestMaxQuestions) {
                setTimeout(() => {
                    this.finalizeAdaptiveTest();
                    this.isWaiting = false;
                    this.render();
                }, 1200);
                const allOptions = document.querySelectorAll('.quiz-opt-btn');
                allOptions.forEach(btn => {
                    btn.disabled = true;
                    const btnParam = btn.dataset.param ? btn.dataset.param.trim().toLowerCase() : '';
                    if (btnParam === correctTrim) btn.classList.add('correct-answer');
                    else if (btnParam === selectedTrim && !isCorrect) btn.classList.add('wrong-answer');
                });
                return;
            }
        } else {
            currentQuestion = this.adaptiveTestCurrentSetQuestions[this.adaptiveTestCurrentSetIndex];
            this.adaptiveTestHistory.push({
                level: this.adaptiveTestCurrentLevel,
                phase: this.adaptiveTestPhase,
                question: currentQuestion.q,
                options: currentQuestion.options,
                correct: correct,
                selected: selected,
                isCorrect: isCorrect,
                skill: currentQuestion.skill
            });
            if (isCorrect) {
                this.adaptiveTestCurrentSetCorrect++;
            }
            this.adaptiveTestCurrentSetIndex++;
            this.adaptiveTestTotalQuestions++;
        }
        
        const allOptions = document.querySelectorAll('.quiz-opt-btn');
        allOptions.forEach(btn => {
            btn.disabled = true;
            const btnParam = btn.dataset.param ? btn.dataset.param.trim().toLowerCase() : '';
            if (btnParam === correctTrim) btn.classList.add('correct-answer');
            else if (btnParam === selectedTrim && !isCorrect) btn.classList.add('wrong-answer');
            else btn.classList.add('other-option');
        });
        
        setTimeout(() => {
            this.isWaiting = false;
            this.render();
        }, 1200);
    }

    // ====================== دوال اختبار المستوى السماعي ======================
    showLevelTestInstructions() {
        this.currentPage = 'level_test_instructions';
        this.render();
    }

    startAdaptiveLevelTestListening() {
        console.log("✅ startAdaptiveLevelTestListening تم استدعاؤها");
        if (!window.listeningBank) {
            console.error("❌ window.listeningBank غير موجود");
            this.showCustomModal('error', '❌', 'بيانات الاختبار السماعي غير متوفرة. تأكد من تحميل listeningBank.js');
            return;
        }
        if (!window.listeningBank.A1 || window.listeningBank.A1.length === 0) {
            console.warn("⚠️ listeningBank فارغ، جاري إضافة بيانات افتراضية");
            this.addDefaultListeningQuestions();
        }
        this.adaptiveListeningActive = true;
        this.listeningCompleted = false;
        this.adaptiveListeningHistory = [];
        this.adaptiveListeningCurrentLevel = 'A1';
        this.adaptiveListeningPhase = 'initial';
        this.adaptiveListeningTotalQuestions = 0;
        this.adaptiveListeningMaxQuestions = 25;
        
        this.adaptiveListeningLevelStats = {
            'A1': { correct: 0, total: 0 },
            'A2': { correct: 0, total: 0 },
            'B1': { correct: 0, total: 0 },
            'B2': { correct: 0, total: 0 },
            'C1': { correct: 0, total: 0 },
            'C2': { correct: 0, total: 0 }
        };
        
        this.adaptiveListeningUsedQuestions = {};
        for (let level of this.adaptiveTestLevelOrder) {
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
        this.adaptiveListeningAnswered = false;
        
        this.loadListeningQuestionSet('A1', 5);
        this.currentPage = 'adaptive_listening_test';
        this.render();
    }

    addDefaultListeningQuestions() {
        if (!window.listeningBank) window.listeningBank = {};
        const levels = ['A1', 'A2', 'B1', 'B2'];
        for (let level of levels) {
            if (!window.listeningBank[level]) window.listeningBank[level] = [];
            for (let i = 1; i <= 5; i++) {
                window.listeningBank[level].push({
                    id: `${level}_${i}`,
                    audio: `audio/level_test/${level}_Q${i}.mp4`,
                    text: `Sample question ${i} for ${level} level. Listen carefully and choose the correct answer.`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correct: "Option A",
                    transcript: `This is the transcript for question ${i} of level ${level}.`
                });
            }
        }
    }

    startAdaptiveLevelTestReading() {
        console.log("✅ startAdaptiveLevelTestReading تم استدعاؤها");
        
        if (!window.placementBank) {
            console.error("❌ window.placementBank غير موجود");
            this.showCustomModal('error', '❌', 'بيانات اختبار القراءة غير متوفرة. تأكد من تحميل data.js');
            return;
        }
        
        this.prepareAdaptiveQuestionBank();
        
        let hasQuestions = false;
        for (let level of ['A1', 'A2', 'B1', 'B2']) {
            if (this.adaptiveTestQuestionBank[level] && this.adaptiveTestQuestionBank[level].length > 0) {
                hasQuestions = true;
                break;
            }
        }
        
        if (!hasQuestions) {
            console.warn("⚠️ لا توجد أسئلة في placementBank، جاري إضافة أسئلة افتراضية");
            this.addDefaultReadingQuestions();
        }
        
        this.adaptiveTestActive = true;
        this.adaptiveTestHistory = [];
        this.adaptiveTestCurrentLevel = this.readingStartLevelFromListening || 'A2';
        this.adaptiveTestPhase = 'initial';
        this.adaptiveTestTotalQuestions = 0;
        this.adaptiveTestMaxQuestions = 50;
        
        this.adaptiveTestLevelStats = {
            'A1': { correct: 0, total: 0 },
            'A2': { correct: 0, total: 0 },
            'B1': { correct: 0, total: 0 },
            'B2': { correct: 0, total: 0 },
            'C1': { correct: 0, total: 0 },
            'C2': { correct: 0, total: 0 }
        };
        
        this.adaptiveTestUsedQuestions = {};
        for (let level of this.adaptiveTestLevelOrder) {
            this.adaptiveTestUsedQuestions[level] = [];
        }
        
        this.adaptiveTestCurrentSetQuestions = [];
        this.adaptiveTestCurrentSetIndex = 0;
        this.adaptiveTestCurrentSetCorrect = 0;
        this.adaptiveTestConfirmationQuestions = [];
        this.adaptiveTestConfirmationCorrect = 0;
        this.adaptiveTestConfirmationTotal = 0;
        
        this.loadAdaptiveQuestionSet(this.adaptiveTestCurrentLevel, 5);
        this.currentPage = 'adaptive_test';
        this.render();
    }

    addDefaultReadingQuestions() {
        const levels = ['A1', 'A2', 'B1', 'B2'];
        for (let level of levels) {
            if (!this.adaptiveTestQuestionBank[level]) this.adaptiveTestQuestionBank[level] = [];
            for (let i = 1; i <= 10; i++) {
                this.adaptiveTestQuestionBank[level].push({
                    id: `${level}_${i}`,
                    q: `Sample reading question ${i} for ${level} level. What is the correct answer?`,
                    options: ["Choice A", "Choice B", "Choice C", "Choice D"],
                    correct: "Choice A",
                    skill: "Reading"
                });
            }
        }
    }

    loadListeningQuestionSet(level, count) {
        const bank = window.listeningBank[level];
        if (!bank || bank.length === 0) {
            console.warn(`⚠️ لا توجد أسئلة سماعية للمستوى ${level}`);
            this.addDefaultListeningQuestions();
            return this.loadListeningQuestionSet(level, count);
        }
        const usedIds = this.adaptiveListeningUsedQuestions[level] || [];
        let available = bank.filter(q => !usedIds.includes(q.id));
        if (available.length < count) {
            if (available.length === 0) {
                this.adaptiveListeningUsedQuestions[level] = [];
                available = [...bank];
            }
        }
        const shuffled = [...available];
        this.shuffleArray(shuffled);
        const selected = shuffled.slice(0, count);
        if (!this.adaptiveListeningUsedQuestions[level]) this.adaptiveListeningUsedQuestions[level] = [];
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
            this.evaluateListeningSetAndTransition();
            if (this.adaptiveListeningPhase === 'confirmation') {
                if (this.adaptiveListeningConfirmationQuestions.length > 0) {
                    return this.adaptiveListeningConfirmationQuestions[0];
                }
                return null;
            } else {
                if (this.adaptiveListeningCurrentSetQuestions.length === 0) {
                    this.loadListeningQuestionSet(this.adaptiveListeningCurrentLevel, 4);
                }
                this.adaptiveListeningCurrentSetIndex = 0;
                if (this.adaptiveListeningCurrentSetQuestions.length === 0) return null;
                return this.adaptiveListeningCurrentSetQuestions[0];
            }
        }
        return this.adaptiveListeningCurrentSetQuestions[this.adaptiveListeningCurrentSetIndex];
    }

    evaluateListeningSetAndTransition() {
        const setSize = this.adaptiveListeningCurrentSetQuestions.length;
        const setCorrect = this.adaptiveListeningCurrentSetCorrect;
        const percentage = setSize > 0 ? (setCorrect / setSize) * 100 : 0;

        if (!this.adaptiveListeningLevelStats[this.adaptiveListeningCurrentLevel]) {
            this.adaptiveListeningLevelStats[this.adaptiveListeningCurrentLevel] = { correct: 0, total: 0 };
        }
        this.adaptiveListeningLevelStats[this.adaptiveListeningCurrentLevel].correct += setCorrect;
        this.adaptiveListeningLevelStats[this.adaptiveListeningCurrentLevel].total += setSize;

        this.adaptiveListeningTotalQuestions += setSize;

        if (this.adaptiveListeningTotalQuestions >= this.adaptiveListeningMaxQuestions) {
            this.finalizeListeningPhase();
            return;
        }

        const levels = this.adaptiveTestLevelOrder;
        const currentIdx = levels.indexOf(this.adaptiveListeningCurrentLevel);

        if (this.adaptiveListeningPhase === 'initial') {
            if (percentage >= 70) {
                if (currentIdx < levels.length - 1) {
                    this.adaptiveListeningCurrentLevel = levels[currentIdx + 1];
                    this.adaptiveListeningPhase = 'moving_up';
                } else {
                    this.adaptiveListeningPhase = 'confirmation';
                    this.prepareListeningConfirmationQuestions();
                }
            } else if (percentage <= 40) {
                if (currentIdx > 0) {
                    this.adaptiveListeningCurrentLevel = levels[currentIdx - 1];
                    this.adaptiveListeningPhase = 'moving_down';
                } else {
                    this.adaptiveListeningPhase = 'confirmation';
                    this.prepareListeningConfirmationQuestions();
                }
            } else {
                this.adaptiveListeningPhase = 'confirmation';
                this.prepareListeningConfirmationQuestions();
            }
        }
        else if (this.adaptiveListeningPhase === 'moving_up' || this.adaptiveListeningPhase === 'moving_down') {
            if (percentage >= 70) {
                if (this.adaptiveListeningPhase === 'moving_up') {
                    if (currentIdx < levels.length - 1) {
                        this.adaptiveListeningCurrentLevel = levels[currentIdx + 1];
                    } else {
                        this.adaptiveListeningPhase = 'confirmation';
                        this.prepareListeningConfirmationQuestions();
                    }
                } else {
                    this.adaptiveListeningPhase = 'confirmation';
                    this.prepareListeningConfirmationQuestions();
                }
            } else if (percentage <= 40) {
                if (currentIdx > 0) {
                    this.adaptiveListeningCurrentLevel = levels[currentIdx - 1];
                    if (this.adaptiveListeningPhase === 'moving_up') {
                        this.adaptiveListeningPhase = 'moving_down';
                    }
                } else {
                    this.adaptiveListeningPhase = 'confirmation';
                    this.prepareListeningConfirmationQuestions();
                }
            } else {
                this.adaptiveListeningPhase = 'confirmation';
                this.prepareListeningConfirmationQuestions();
            }
        }

        if (this.adaptiveListeningPhase !== 'confirmation') {
            this.loadListeningQuestionSet(this.adaptiveListeningCurrentLevel, 4);
        }
    }

    prepareListeningConfirmationQuestions() {
        let remaining = this.adaptiveListeningMaxQuestions - this.adaptiveListeningTotalQuestions;
        let confirmCount = Math.min(8, Math.max(5, remaining));
        if (confirmCount < 3) {
            this.finalizeListeningPhase();
            return;
        }
        const bank = window.listeningBank[this.adaptiveListeningCurrentLevel];
        if (!bank || bank.length === 0) {
            this.finalizeListeningPhase();
            return;
        }
        const usedIds = this.adaptiveListeningUsedQuestions[this.adaptiveListeningCurrentLevel] || [];
        let available = bank.filter(q => !usedIds.includes(q.id));
        if (available.length < confirmCount) {
            available = bank.filter(q => !usedIds.includes(q.id));
            if (available.length === 0) {
                this.adaptiveListeningUsedQuestions[this.adaptiveListeningCurrentLevel] = [];
                available = [...bank];
            }
        }
        const shuffled = [...available];
        this.shuffleArray(shuffled);
        this.adaptiveListeningConfirmationQuestions = shuffled.slice(0, confirmCount);
        this.adaptiveListeningConfirmationCorrect = 0;
        this.adaptiveListeningConfirmationTotal = this.adaptiveListeningConfirmationQuestions.length;
        this.adaptiveListeningPhase = 'confirmation';
    }

    handleAdaptiveListeningAnswer(selected, correct, btnElement) {
        console.log("🔊 handleAdaptiveListeningAnswer called", { selected, correct, isWaiting: this.isWaiting });
        
        if (this.isWaiting) return;
        this.isWaiting = true;
        
        const selectedTrim = selected.trim().toLowerCase();
        const correctTrim = correct.trim().toLowerCase();
        const isCorrect = (selectedTrim === correctTrim);
        console.log("📊 Answer is correct?", isCorrect);
        
        try {
            this.playTone(isCorrect ? 'correct' : 'error');
        } catch(e) {
            console.error("❌ playTone error:", e);
        }
        
        let currentQuestion = null;
        
        try {
            if (this.adaptiveListeningPhase === 'confirmation') {
                if (!this.adaptiveListeningConfirmationQuestions.length) {
                    console.error("❌ No confirmation questions available");
                    this.isWaiting = false;
                    return;
                }
                currentQuestion = this.adaptiveListeningConfirmationQuestions[0];
                if (isCorrect) this.adaptiveListeningConfirmationCorrect++;
                this.adaptiveListeningHistory.push({
                    level: this.adaptiveListeningCurrentLevel,
                    phase: 'confirmation',
                    question: currentQuestion.text,
                    audio: currentQuestion.audio,
                    options: currentQuestion.options,
                    correct: correct,
                    selected: selected,
                    isCorrect: isCorrect,
                    transcript: currentQuestion.transcript || ''
                });
                this.adaptiveListeningLastAnswer = {
                    isCorrect: isCorrect,
                    transcript: currentQuestion.transcript || '',
                    showTranscript: false,
                    currentQuestion: currentQuestion
                };
                this.adaptiveListeningConfirmationQuestions.shift();
                this.adaptiveListeningTotalQuestions++;
                this.adaptiveListeningAnswered = true;
            } else {
                if (!this.adaptiveListeningCurrentSetQuestions.length || this.adaptiveListeningCurrentSetIndex >= this.adaptiveListeningCurrentSetQuestions.length) {
                    console.error("❌ No current set questions or index out of bounds");
                    this.isWaiting = false;
                    return;
                }
                currentQuestion = this.adaptiveListeningCurrentSetQuestions[this.adaptiveListeningCurrentSetIndex];
                this.adaptiveListeningHistory.push({
                    level: this.adaptiveListeningCurrentLevel,
                    phase: this.adaptiveListeningPhase,
                    question: currentQuestion.text,
                    audio: currentQuestion.audio,
                    options: currentQuestion.options,
                    correct: correct,
                    selected: selected,
                    isCorrect: isCorrect,
                    transcript: currentQuestion.transcript || ''
                });
                this.adaptiveListeningLastAnswer = {
                    isCorrect: isCorrect,
                    transcript: currentQuestion.transcript || '',
                    showTranscript: false,
                    currentQuestion: currentQuestion
                };
                if (isCorrect) {
                    this.adaptiveListeningCurrentSetCorrect++;
                }
                this.adaptiveListeningCurrentSetIndex++;
                this.adaptiveListeningTotalQuestions++;
                this.adaptiveListeningAnswered = true;
            }
            
            this.disableAndColorOptions(correctTrim, selectedTrim, isCorrect);
            this.isWaiting = false;
            this.render();
            
        } catch(error) {
            console.error("❌ Error in handleAdaptiveListeningAnswer:", error);
            this.isWaiting = false;
            this.render();
        }
    }

    disableAndColorOptions(correctTrim, selectedTrim, isCorrect) {
        const allOptions = document.querySelectorAll('.quiz-opt-btn');
        allOptions.forEach(btn => {
            btn.disabled = true;
            const btnParam = btn.dataset.param ? btn.dataset.param.trim().toLowerCase() : '';
            if (btnParam === correctTrim) {
                btn.classList.add('correct-answer');
            } else if (btnParam === selectedTrim && !isCorrect) {
                btn.classList.add('wrong-answer');
            } else {
                btn.classList.add('other-option');
            }
        });
    }

    showListeningTranscript() {
        if (this.adaptiveListeningLastAnswer && this.adaptiveListeningLastAnswer.transcript) {
            this.adaptiveListeningLastAnswer.showTranscript = !this.adaptiveListeningLastAnswer.showTranscript;
            this.render();
        } else {
            this.showCustomModal('info', '📝', this.t('لا يوجد نص مكتوب متاح لهذا التسجيل.', 'No transcript available for this recording.'));
        }
    }

    nextAdaptiveListeningQuestion() {
        // التحقق مما إذا كنا في مرحلة التأكيد أو المجموعة الحالية
        if (this.adaptiveListeningPhase === 'confirmation') {
            if (this.adaptiveListeningConfirmationQuestions.length === 0 || this.adaptiveListeningTotalQuestions >= this.adaptiveListeningMaxQuestions) {
                // انتهى الجزء السماعي
                this.finalizeListeningPhase();
                return;
            }
        } else {
            // ننتقل إلى السؤال التالي في المجموعة الحالية، أو نقيّم المجموعة
            if (this.adaptiveListeningCurrentSetIndex >= this.adaptiveListeningCurrentSetQuestions.length) {
                this.evaluateListeningSetAndTransition();
                if (this.adaptiveListeningPhase === 'confirmation') {
                    if (this.adaptiveListeningConfirmationQuestions.length === 0) {
                        this.finalizeListeningPhase();
                        return;
                    }
                } else {
                    if (this.adaptiveListeningCurrentSetQuestions.length === 0) {
                        this.loadListeningQuestionSet(this.adaptiveListeningCurrentLevel, 4);
                    }
                    this.adaptiveListeningCurrentSetIndex = 0;
                }
            }
        }
        
        // إعادة تعيين حالة الإجابة
        this.adaptiveListeningLastAnswer = null;
        this.adaptiveListeningAnswered = false;
        this.render();
    }

    playListeningAudio(audioSrc, questionId) {
        console.log("playListeningAudio called", audioSrc, questionId);
        if (this.adaptiveListeningAudioPlayed[questionId]) {
            this.showCustomModal('info', '🔊', this.t('يمكنك الاستماع إلى التسجيل مرة واحدة فقط.', 'You can listen to the recording only once.'));
            return;
        }
        if (audioSrc && audioSrc.trim() !== "") {
            this.playAudio(audioSrc);
            this.adaptiveListeningAudioPlayed[questionId] = true;
            const playBtn = document.getElementById(`playAudioBtn_${questionId}`);
            if (playBtn) {
                playBtn.disabled = true;
                playBtn.style.opacity = '0.5';
                playBtn.innerText = '✓';
            }
        } else {
            this.showCustomModal('error', '❌', this.t('ملف الصوت غير متوفر.', 'Audio file not available.'));
        }
    }

    finalizeListeningPhase() {
        console.log("✅ انتهت مرحلة الاختبار السماعي");
        let bestLevel = 'A1';
        let bestPercentage = 0;
        for (let level of this.adaptiveTestLevelOrder) {
            const stats = this.adaptiveListeningLevelStats[level];
            if (stats && stats.total >= 2 && (stats.correct / stats.total) * 100 >= 70) {
                bestLevel = level;
                bestPercentage = (stats.correct / stats.total) * 100;
            }
        }
        
        if (this.adaptiveListeningPhase === 'confirmation' && this.adaptiveListeningConfirmationTotal > 0) {
            const confirmPercent = (this.adaptiveListeningConfirmationCorrect / this.adaptiveListeningConfirmationTotal) * 100;
            if (confirmPercent >= 60) {
                bestLevel = this.adaptiveListeningCurrentLevel;
            }
        }
        
        let readingStartLevel = bestLevel;
        const levels = this.adaptiveTestLevelOrder;
        const bestIdx = levels.indexOf(bestLevel);
        if (bestIdx === 0) readingStartLevel = 'A2';
        else readingStartLevel = levels[Math.min(bestIdx, levels.length-1)];
        
        const listeningResult = {
            type: 'listening',
            level: bestLevel,
            date: new Date().toLocaleString('ar-EG'),
            score: this.adaptiveListeningHistory.filter(h => h.isCorrect).length,
            totalQuestions: this.adaptiveListeningHistory.length
        };
        this.userProfile.testsHistory.push(listeningResult);
        
        this.listeningResult = listeningResult;
        this.listeningBestLevel = bestLevel;
        this.readingStartLevelFromListening = readingStartLevel;
        this.listeningCompleted = true;
        
        this.showCustomModal('info', '🎧📖', this.t('انتهيت من الجزء السماعي. اضغط "متابعة" لبدء الجزء المقروء.', 'You have completed the listening part. Click "Continue" to start the reading part.'), () => {
            this.continueToReadingTest();
        });
    }

    continueToReadingTest() {
        this.prepareAdaptiveQuestionBank();
        this.adaptiveTestActive = true;
        this.adaptiveTestHistory = [];
        this.adaptiveTestCurrentLevel = this.readingStartLevelFromListening || 'A2';
        this.adaptiveTestPhase = 'initial';
        this.adaptiveTestTotalQuestions = 0;
        this.adaptiveTestMaxQuestions = 50;
        
        this.adaptiveTestLevelStats = {
            'A1': { correct: 0, total: 0 },
            'A2': { correct: 0, total: 0 },
            'B1': { correct: 0, total: 0 },
            'B2': { correct: 0, total: 0 },
            'C1': { correct: 0, total: 0 },
            'C2': { correct: 0, total: 0 }
        };
        
        this.adaptiveTestUsedQuestions = {};
        for (let level of this.adaptiveTestLevelOrder) {
            this.adaptiveTestUsedQuestions[level] = [];
        }
        
        this.adaptiveTestCurrentSetQuestions = [];
        this.adaptiveTestCurrentSetIndex = 0;
        this.adaptiveTestCurrentSetCorrect = 0;
        this.adaptiveTestConfirmationQuestions = [];
        this.adaptiveTestConfirmationCorrect = 0;
        this.adaptiveTestConfirmationTotal = 0;
        
        this.loadAdaptiveQuestionSet(this.adaptiveTestCurrentLevel, 5);
        this.currentPage = 'adaptive_test';
        this.render();
    }

    finalizeAdaptiveTest() {
        console.log("✅ finalizeAdaptiveTest تم استدعاؤها");
        
        // حساب أفضل مستوى للقراءة
        let bestReadingLevel = 'A1';
        let bestReadingPercentage = 0;
        for (let level of this.adaptiveTestLevelOrder) {
            const stats = this.adaptiveTestLevelStats[level];
            if (stats && stats.total >= 4 && (stats.correct / stats.total) * 100 >= 70) {
                bestReadingLevel = level;
                bestReadingPercentage = (stats.correct / stats.total) * 100;
            }
        }
        
        if (this.adaptiveTestPhase === 'confirmation' && this.adaptiveTestConfirmationTotal > 0) {
            const confirmPercent = (this.adaptiveTestConfirmationCorrect / this.adaptiveTestConfirmationTotal) * 100;
            if (confirmPercent >= 60) {
                bestReadingLevel = this.adaptiveTestCurrentLevel;
            }
        }
        
        // حساب أفضل مستوى للاستماع (من this.listeningResult)
        let bestListeningLevel = this.listeningResult ? this.listeningResult.level : 'A1';
        
        // تحديد المستوى النهائي (يمكن أن يكون المتوسط أو الأعلى)
        const levelsOrder = this.adaptiveTestLevelOrder;
        const listeningIdx = levelsOrder.indexOf(bestListeningLevel);
        const readingIdx = levelsOrder.indexOf(bestReadingLevel);
        const finalLevelIdx = Math.max(listeningIdx, readingIdx);
        const finalLevel = levelsOrder[finalLevelIdx];
        
        // تحليل نقاط القوة والضعف
        const strengths = [];
        const weaknesses = [];
        
        // تحليل أداء الاستماع حسب المستويات
        for (let level of levelsOrder) {
            const stats = this.adaptiveListeningLevelStats[level];
            if (stats && stats.total > 0) {
                const percent = (stats.correct / stats.total) * 100;
                if (percent >= 70) strengths.push(`${level} (استماع)`);
                else if (percent <= 40) weaknesses.push(`${level} (استماع)`);
            }
        }
        
        // تحليل أداء القراءة
        for (let level of levelsOrder) {
            const stats = this.adaptiveTestLevelStats[level];
            if (stats && stats.total > 0) {
                const percent = (stats.correct / stats.total) * 100;
                if (percent >= 70) strengths.push(`${level} (قراءة)`);
                else if (percent <= 40) weaknesses.push(`${level} (قراءة)`);
            }
        }
        
        const combinedResult = {
            level: finalLevel,
            displayLevel: finalLevel,
            date: new Date().toLocaleString('ar-EG'),
            listeningScore: this.listeningResult ? this.listeningResult.score : 0,
            listeningTotal: this.listeningResult ? this.listeningResult.totalQuestions : 0,
            readingScore: this.adaptiveTestHistory.filter(h => h.isCorrect).length,
            readingTotal: this.adaptiveTestHistory.length,
            totalScore: (this.listeningResult ? this.listeningResult.score : 0) + this.adaptiveTestHistory.filter(h => h.isCorrect).length,
            totalQuestions: (this.listeningResult ? this.listeningResult.totalQuestions : 0) + this.adaptiveTestHistory.length,
            ielts: this.getIeltsEquivalent(finalLevel),
            strengths: strengths,
            weaknesses: weaknesses,
            details: {
                listening: this.adaptiveListeningHistory,
                reading: this.adaptiveTestHistory
            }
        };
        
        this.placementResults.unshift(combinedResult);
        this.placementFullHistory.push(combinedResult);
        this.userProfile.level = combinedResult.level;
        this.userProfile.testsHistory.push({
            type: 'اختبار مستوى متكامل (استماع وقراءة)',
            date: combinedResult.date,
            score: `${combinedResult.totalScore}/${combinedResult.totalQuestions}`,
            level: combinedResult.displayLevel
        });
        
        this.saveUserData();
        
        this.adaptiveTestActive = false;
        this.adaptiveListeningActive = false;
        this.currentPage = 'adaptive_test_result';
        this.render();
    }

    showAdaptiveResult() {
        const lastResult = this.placementResults[0];
        if (!lastResult) return `<div class="reading-card"><p>${this.t('لا توجد نتيجة', 'No result')}</p></div>`;
        
        const strengthsHtml = lastResult.strengths && lastResult.strengths.length > 0 
            ? `<div style="margin-top:10px;"><strong>✅ ${this.t('نقاط القوة:', 'Strengths:')}</strong> ${lastResult.strengths.join(', ')}</div>` 
            : '';
        const weaknessesHtml = lastResult.weaknesses && lastResult.weaknesses.length > 0 
            ? `<div style="margin-top:5px;"><strong>⚠️ ${this.t('نقاط الضعف:', 'Weaknesses:')}</strong> ${lastResult.weaknesses.join(', ')}</div>` 
            : '';
        
        return `<div class="reading-card result-card">
            <h2 style="text-align:center;">🏁 ${this.t('نتيجة الاختبار المتكامل', 'Integrated Test Result')}</h2>
            <div style="background:#f0f7ff; padding:15px; border-radius:10px; margin:10px 0; text-align:center;">
                <h1 style="color:#1e40af; margin-bottom:5px; font-size:1.8rem;">${lastResult.displayLevel}</h1>
                <p style="font-weight:bold; color:#3b82f6;">IELTS: ${lastResult.ielts}</p>
                <p style="font-size:0.85rem; color:#64748b;">${this.t('الاستماع:', 'Listening:')} ${lastResult.listeningScore}/${lastResult.listeningTotal}</p>
                <p style="font-size:0.85rem; color:#64748b;">${this.t('القراءة:', 'Reading:')} ${lastResult.readingScore}/${lastResult.readingTotal}</p>
                <p style="font-size:0.9rem; font-weight:bold; margin-top:8px;">${this.t('المجموع:', 'Total:')} ${lastResult.totalScore}/${lastResult.totalQuestions}</p>
                ${strengthsHtml}
                ${weaknessesHtml}
                <p style="font-size:0.8rem; color:#64748b; margin-top:10px;">${this.t('تاريخ الاختبار:', 'Test date:')} ${lastResult.date}</p>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:15px;">
                <button class="hero-btn" onclick="appInstance.showLevelTestInstructions()" style="background:#ec4899; flex:1;">${this.t('إعادة الاختبار 🔄', 'Retake Test 🔄')}</button>
                <button class="hero-btn" data-action="goHome" style="background:#64748b; flex:1;">${this.t('الرئيسية', 'Home')}</button>
            </div>
        </div>`;
    }
    
    getIeltsEquivalent(level) { const map = { 'A1': '2.0-3.0', 'A2': '3.0-4.0', 'B1': '4.0-5.0', 'B2': '5.5-6.5', 'C1': '7.0-8.0', 'C2': '8.5-9.0' }; return map[level]; }

    // ====================== دوال التمارين الأساسية ======================
    prepareJumble() {
        const lesson = this.getCurrentLessonData();
        if (!lesson) return;
        const termWords = lesson.terms.map(t => t.english.toLowerCase());
        const sentences = lesson.content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        const usefulSentences = sentences.filter(s => { const words = s.split(/\s+/).length; if (words < 3 || words > 7) return false; const lower = s.toLowerCase(); return termWords.some(word => lower.includes(word)); });
        let availableSentences = usefulSentences.length > 0 ? usefulSentences : sentences.filter(s => { const words = s.split(/\s+/).length; return words >= 3 && words <= 7; });
        if (availableSentences.length === 0) { const words = lesson.terms.slice(0, 4).map(t => t.english); this.jumbleOriginalSentence = words.join(' '); }
        else { const unused = availableSentences.filter(s => !this.jumbleHistory.includes(s)); if (unused.length === 0) { this.jumbleHistory = []; this.jumbleOriginalSentence = availableSentences[Math.floor(Math.random() * availableSentences.length)]; } else { this.jumbleOriginalSentence = unused[Math.floor(Math.random() * unused.length)]; } this.jumbleHistory.push(this.jumbleOriginalSentence); }
        this.jumbleCurrentSentence = this.jumbleOriginalSentence;
        this.translateText(this.jumbleOriginalSentence).then(translated => { if (this.jumbleCurrentSentence === this.jumbleOriginalSentence) this.jumbleArabicHint = translated; this.render(); }).catch(() => { if (this.jumbleCurrentSentence === this.jumbleOriginalSentence) this.jumbleArabicHint = ''; this.render(); });
        this.jumbleWords = this.jumbleOriginalSentence.split(/\s+/).filter(w => w.length > 0);
        this.shuffleArray(this.jumbleWords);
        this.jumbleUserAnswer = [];
        this.jumbleChecked = false;
        this.jumbleCorrect = false;
        this.jumbleHintUsedCount = 0;
    }

    handleJumbleSelect(word) { if (this.jumbleChecked) return; const index = this.jumbleWords.indexOf(word); if (index !== -1) { this.jumbleWords.splice(index, 1); this.jumbleUserAnswer.push(word); this.render(); } }
    handleJumbleRemove(word) { if (this.jumbleChecked) return; const index = this.jumbleUserAnswer.indexOf(word); if (index !== -1) { this.jumbleUserAnswer.splice(index, 1); this.jumbleWords.push(word); this.render(); } }
    handleJumbleReset() { this.jumbleWords = this.jumbleOriginalSentence.split(/\s+/).filter(w => w.length > 0); this.shuffleArray(this.jumbleWords); this.jumbleUserAnswer = []; this.jumbleChecked = false; this.jumbleCorrect = false; this.jumbleHintUsedCount = 0; this.render(); }
    handleJumbleCheck() { if (this.jumbleChecked) return; const userSentence = this.jumbleUserAnswer.join(' '); const isCorrect = (userSentence.toLowerCase().trim() === this.jumbleOriginalSentence.toLowerCase().trim()); this.jumbleChecked = true; this.jumbleCorrect = isCorrect; this.playTone(isCorrect ? 'correct' : 'error'); if (isCorrect) { this.recordCorrectAnswer('jumble', this.jumbleOriginalSentence); } else { this.recordTotalAnswer('jumble'); } this.render(); }
    handleJumbleHint() {
        if (this.jumbleChecked) return;
        if (this.jumbleHintUsedCount >= 3) {
            this.showCustomModal('info', '💡', this.t('لقد استنفدت عدد التلميحات المسموحة لهذه الجملة (3 تلميحات).', 'You have exhausted the allowed hints for this sentence (3 hints).'));
            return;
        }
        const originalWords = this.jumbleOriginalSentence.split(/\s+/);
        let nextWord = null;
        for (let word of originalWords) {
            if (!this.jumbleUserAnswer.includes(word)) {
                nextWord = word;
                break;
            }
        }
        if (nextWord && this.jumbleWords.includes(nextWord)) {
            const index = this.jumbleWords.indexOf(nextWord);
            this.jumbleWords.splice(index, 1);
            this.jumbleUserAnswer.push(nextWord);
            this.jumbleHintUsedCount++;
            this.showCustomModal('info', '💡', this.t(`تمت إضافة الكلمة: "${nextWord}"`, `Added word: "${nextWord}"`));
        } else {
            this.showCustomModal('info', '💡', this.t('لا توجد كلمات متبقية للإضافة! قم بالتحقق من إجابتك.', 'No more words to add! Check your answer.'));
        }
        this.render();
    }
    handleJumbleNext() { this.jumbleNextCount++; if (this.jumbleNextCount % 10 === 0) this.showAd('image'); this.prepareJumble(); this.render(); }

    getAllAvailableWordsForExercises() { 
        const lesson = this.getCurrentLessonData(); 
        if (!lesson) return []; 
        const allTerms = [...lesson.terms, ...this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId)]; 
        return allTerms.filter(t => !this.hiddenFromCards.includes(String(t.id))); 
    }

    prepareListeningQuiz() {
        if (this.listeningTimer) clearTimeout(this.listeningTimer);
        if (this.listeningErrorTimer) clearTimeout(this.listeningErrorTimer);
        const available = this.getAllAvailableWordsForExercises();
        if (available.length === 0) { alert(this.t('لا توجد كلمات متاحة للاستماع.', 'No words available for listening.')); return; }
        if (this.listeningRemaining.length === 0) this.listeningRemaining = [...available].sort(() => 0.5 - Math.random());
        this.listeningCurrent = this.listeningRemaining[0];
        this.listeningAnswered = false;
        const allTerms = this.getAllAvailableWordsForExercises();
        const otherTerms = allTerms.filter(t => t.id !== this.listeningCurrent.id);
        const shuffled = [...otherTerms].sort(() => 0.5 - Math.random());
        const wrongOptions = shuffled.slice(0, 3).map(t => t.arabic);
        while (wrongOptions.length < 3) wrongOptions.push('???');
        this.listeningOptions = [this.listeningCurrent.arabic, ...wrongOptions].sort(() => 0.5 - Math.random());
        this.speak(this.listeningCurrent.english);
    }

    handleNormalListeningAnswer(selectedArabic) {
        if (this.listeningAnswered || !this.listeningCurrent) return;
        this.listeningAnswered = true;
        const isCorrect = (selectedArabic === this.listeningCurrent.arabic);
        this.playTone(isCorrect ? 'correct' : 'error');
        const allOptions = document.querySelectorAll('.listening-opt-btn');
        allOptions.forEach(btn => { btn.disabled = true; btn.classList.remove('correct-answer', 'wrong-answer', 'other-option'); if (btn.dataset.param === this.listeningCurrent.arabic) btn.classList.add('correct-answer'); else if (btn.dataset.param === selectedArabic && !isCorrect) btn.classList.add('wrong-answer'); else btn.classList.add('other-option'); });
        if (isCorrect) { this.listeningRemaining.shift(); this.addListeningCorrectReward(this.listeningCurrent.id); this.listeningTimer = setTimeout(() => { this.listeningTimer = null; if (this.listeningRemaining.length === 0) { alert(this.t('🎉 تهانينا! أكملت جميع الكلمات.', '🎉 Congratulations! You completed all words.')); this.currentPage = 'reading'; } else this.prepareListeningQuiz(); this.render(); }, 2500); }
        else { this.recordTotalAnswer('listening'); this.listeningErrorTimer = setTimeout(() => { this.listeningErrorTimer = null; this.listeningAnswered = false; allOptions.forEach(btn => { btn.disabled = false; btn.classList.remove('correct-answer', 'wrong-answer', 'other-option'); }); this.render(); }, 1500); }
    }

    unlockListening(lessonId) { if (this.listeningUnlocked[lessonId]) return true; if (this.userCoins >= 50) { this.showCoinPurchaseModal(50, (confirmed) => { if (confirmed) { this.userCoins -= 50; this.listeningUnlocked[lessonId] = true; this.saveUserData(); this.prepareListeningQuiz(); this.currentPage = 'listening'; this.render(); } }); } else this.showCustomModal('error', '❌', this.t(`ليس لديك لآلئ كافية! تحتاج 50 لؤلؤة.`, `You don't have enough pearls! You need 50 pearls.`)); return false; }
    unlockJumble(lessonId) { if (this.jumbleUnlocked[lessonId]) return true; if (this.userCoins >= 50) { this.showCoinPurchaseModal(50, (confirmed) => { if (confirmed) { this.userCoins -= 50; this.jumbleUnlocked[lessonId] = true; this.saveUserData(); this.prepareJumble(); this.currentPage = 'jumble'; this.render(); } }); } else this.showCustomModal('error', '❌', this.t(`ليس لديك لآلئ كافية! تحتاج 50 لؤلؤة.`, `You don't have enough pearls! You need 50 pearls.`)); return false; }
    unlockSpelling(lessonId) { if (this.spellingUnlocked[lessonId]) return true; if (this.userCoins >= 50) { this.showCoinPurchaseModal(50, (confirmed) => { if (confirmed) { this.userCoins -= 50; this.spellingUnlocked[lessonId] = true; this.saveUserData(); this.prepareSpelling(); this.currentPage = 'spelling'; this.render(); } }); } else this.showCustomModal('error', '❌', this.t(`ليس لديك لآلئ كافية! تحتاج 50 لؤلؤة.`, `You don't have enough pearls! You need 50 pearls.`)); return false; }

    prepareSpelling() {
        const available = this.getAllAvailableWordsForExercises();
        if (available.length === 0) { alert(this.t('لا توجد كلمات متاحة للكتابة.', 'No words available for spelling.')); return; }
        if (this.spellingRemaining.length === 0) this.spellingRemaining = [...available].sort(() => 0.5 - Math.random());
        this.spellingCurrent = this.spellingRemaining[0];
        this.spellingAnswered = false;
        this.spellingUserAnswer = '';
        this.spellingResult = null;
    }

    handleSpellingCheck() {
        if (this.spellingAnswered || !this.spellingCurrent) return;
        const userAnswer = this.spellingUserAnswer.trim().toLowerCase();
        const correctAnswer = this.spellingCurrent.english.trim().toLowerCase();
        const isCorrect = (userAnswer === correctAnswer);
        this.spellingAnswered = true;
        this.spellingResult = isCorrect ? 'correct' : 'wrong';
        this.playTone(isCorrect ? 'correct' : 'error');
        if (isCorrect) { 
            this.addSpellingCorrectReward(this.spellingCurrent.id); 
            this.spellingRemaining.shift(); 
        } else { 
            this.recordTotalAnswer('spelling'); 
            if (this.spellingRemaining.length > 1) { 
                const wrongWord = this.spellingRemaining.shift(); 
                this.spellingRemaining.push(wrongWord); 
            } 
        }
        this.render();
    }

    handleSpellingNext() {
        if (this.spellingRemaining.length === 0) { alert(this.t('🎉 تهانينا! أكملت جميع الكلمات.', '🎉 Congratulations! You completed all words.')); this.currentPage = 'reading'; }
        else { this.spellingNextCount++; if (this.spellingNextCount % 10 === 0) this.showAd('image'); this.prepareSpelling(); }
        this.render();
    }

    handleSpellingInput(e) { this.spellingUserAnswer = e.target.value; }

    prepareLevelTest(levelParam) {
        let lessonIds = [], levelName = '';
        if (levelParam === 'beginner') { levelName = 'beginner'; lessonIds = window.lessonsList['beginner'] ? window.lessonsList['beginner'].map(l => l.id) : []; }
        else if (levelParam === 'intermediate') { levelName = 'intermediate'; lessonIds = window.lessonsList['intermediate'] ? window.lessonsList['intermediate'].map(l => l.id) : []; }
        else if (levelParam === 'advanced') { levelName = 'advanced'; lessonIds = window.lessonsList['advanced'] ? window.lessonsList['advanced'].map(l => l.id) : []; }
        else return;
        if (lessonIds.length === 0) { alert(this.t('لا توجد دروس في هذا المستوى.', 'No lessons in this level.')); return; }
        this.levelTestLevel = levelName;
        this.levelTestLessons = lessonIds;
        let startIndex = 0;
        for (let i = 0; i < lessonIds.length; i++) { if (!this.unlockedLessons.includes(lessonIds[i])) { startIndex = i; break; } }
        if (startIndex === 0 && this.unlockedLessons.includes(lessonIds[0])) { startIndex = this.lastTestedLesson[levelName] || 0; if (startIndex >= lessonIds.length) startIndex = 0; }
        this.levelTestCurrentLessonIndex = startIndex;
        this.levelTestCurrentLessonId = lessonIds[startIndex];
        this.levelTestRequiredCorrect = 5;
        this.levelTestCurrentCorrect = 0;
        this.levelTestCurrentTotal = 0;
        this.levelTestQuestionsBank = {};
        this.levelTestResults = [];
        this.levelTestQuestionsAnswered = 0;
        this.levelTestCurrentQuestion = null;
        this.levelTestUnlockedCount = 0;
        this.levelTestCoinsEarned = 0;
        lessonIds.forEach(id => { const lesson = this.getLessonDataById(id); if (lesson && lesson.terms) { let allWords = [...lesson.terms]; const added = this.userVocabulary.filter(v => v.lessonId == id); allWords.push(...added); allWords = allWords.filter(t => !this.hiddenFromCards.includes(String(t.id))); this.shuffleArray(allWords); this.levelTestQuestionsBank[id] = allWords; } else { this.levelTestQuestionsBank[id] = []; } });
        this.loadNextLevelTestQuestion();
        this.currentPage = 'level_test';
        this.render();
    }

    getAllLevelWords() {
        if (!this.levelTestLevel) return [];
        const lessonIds = this.levelTestLessons || [];
        let allWords = [];
        lessonIds.forEach(id => { const lesson = this.getLessonDataById(id); if (lesson && lesson.terms) allWords = allWords.concat(lesson.terms); const added = this.userVocabulary.filter(v => v.lessonId == id); allWords = allWords.concat(added); });
        allWords = allWords.filter(t => !this.hiddenFromCards.includes(String(t.id)));
        const unique = {}; allWords.forEach(w => unique[w.id] = w); return Object.values(unique);
    }

    loadNextLevelTestQuestion() {
        if (this.levelTestQuestionsAnswered >= this.levelTestMaxQuestions) { this.finishLevelTestEarly(); return; }
        const lessonId = this.levelTestCurrentLessonId;
        if (!lessonId) { this.finishLevelTestEarly(); return; }
        let bank = this.levelTestQuestionsBank[lessonId];
        if (!bank || bank.length === 0) { this.moveToNextLesson(); return; }
        this.levelTestCurrentQuestion = bank.shift();
        let wrongOptions = [];
        const currentLessonWords = [...bank];
        this.shuffleArray(currentLessonWords);
        for (let i = 0; i < 3; i++) { if (currentLessonWords.length > i) wrongOptions.push(currentLessonWords[i].arabic); else break; }
        if (wrongOptions.length < 3) { const allLevelWords = this.getAllLevelWords().filter(w => w.id !== this.levelTestCurrentQuestion.id); this.shuffleArray(allLevelWords); for (let i = 0; i < 3 - wrongOptions.length; i++) { if (allLevelWords.length > i) wrongOptions.push(allLevelWords[i].arabic); else break; } }
        while (wrongOptions.length < 3) wrongOptions.push('???');
        const options = [this.levelTestCurrentQuestion.arabic, ...wrongOptions];
        this.shuffleArray(options);
        this.levelTestCurrentOptions = options;
    }

    handleLevelTestAnswer(selected, correct, btnElement) {
        if (this.isWaiting) return;
        this.isWaiting = true;
        const selectedTrim = selected.trim().toLowerCase();
        const correctTrim = correct.trim().toLowerCase();
        const isCorrect = (selectedTrim === correctTrim);
        this.playTone(isCorrect ? 'correct' : 'error');
        const allOptions = document.querySelectorAll('.quiz-opt-btn');
        allOptions.forEach(btn => { btn.disabled = true; btn.classList.remove('correct-answer', 'wrong-answer', 'other-option'); const btnParam = btn.dataset.param ? btn.dataset.param.trim().toLowerCase() : ''; if (btnParam === correctTrim) btn.classList.add('correct-answer'); else if (btnParam === selectedTrim && !isCorrect) btn.classList.add('wrong-answer'); else btn.classList.add('other-option'); });
        this.levelTestQuestionsAnswered++;
        this.levelTestCurrentTotal++;
        if (isCorrect) this.levelTestCurrentCorrect++;
        if (!this.levelTestAnswers) this.levelTestAnswers = [];
        this.levelTestAnswers.push({ question: this.levelTestCurrentQuestion, selected: selected, correct: correct, isCorrect: isCorrect });
        setTimeout(() => {
            if (this.levelTestCurrentCorrect >= this.levelTestRequiredCorrect) { if (!this.unlockedLessons.includes(this.levelTestCurrentLessonId)) { this.unlockedLessons.push(this.levelTestCurrentLessonId); this.levelTestUnlockedCount++; this.userCoins += 20; this.levelTestCoinsEarned += 20; this.levelTestResults.push({ lessonId: this.levelTestCurrentLessonId, passed: true, attempts: this.levelTestCurrentTotal }); this.addLessonReward(this.levelTestCurrentLessonId); } this.moveToNextLesson(); }
            else { if (this.levelTestQuestionsBank[this.levelTestCurrentLessonId].length === 0) { const lesson = this.getLessonDataById(this.levelTestCurrentLessonId); if (lesson && lesson.terms) { let allWords = [...lesson.terms]; const added = this.userVocabulary.filter(v => v.lessonId == this.levelTestCurrentLessonId); allWords.push(...added); allWords = allWords.filter(t => !this.hiddenFromCards.includes(String(t.id))); this.shuffleArray(allWords); this.levelTestQuestionsBank[this.levelTestCurrentLessonId] = allWords; this.levelTestRequiredCorrect += 2; this.levelTestCurrentCorrect = 0; this.levelTestCurrentTotal = 0; } else { this.moveToNextLesson(); this.isWaiting = false; this.render(); return; } } this.loadNextLevelTestQuestion(); }
            this.isWaiting = false;
            this.render();
        }, 1200);
    }

    moveToNextLesson() {
        this.levelTestCurrentLessonIndex++;
        if (this.levelTestCurrentLessonIndex >= this.levelTestLessons.length) { this.finishLevelTestEarly(); return; }
        this.levelTestCurrentLessonId = this.levelTestLessons[this.levelTestCurrentLessonIndex];
        this.levelTestRequiredCorrect = 5;
        this.levelTestCurrentCorrect = 0;
        this.levelTestCurrentTotal = 0;
        this.loadNextLevelTestQuestion();
    }

    finishLevelTestEarly() {
        const lastLessonIndex = this.levelTestCurrentLessonIndex;
        this.lastTestedLesson[this.levelTestLevel] = lastLessonIndex;
        this.saveUserData();
        const passedLessons = this.levelTestResults.filter(r => r.passed).map(r => r.lessonId);
        let message = '';
        if (passedLessons.length > 0) { message = this.t(`✅ تم فتح الدروس: ${passedLessons.join('، ')}.`, `✅ Lessons unlocked: ${passedLessons.join(', ')}.`); if (this.levelTestCurrentLessonIndex < this.levelTestLessons.length) message += this.t(` توقف عند الدرس ${this.levelTestLessons[this.levelTestCurrentLessonIndex]}.`, ` Stopped at lesson ${this.levelTestLessons[this.levelTestCurrentLessonIndex]}.`); else message += this.t(` 🎉 لقد أكملت جميع الدروس!`, ` 🎉 You have completed all lessons!`); }
        else { if (this.levelTestCurrentLessonIndex < this.levelTestLessons.length) message = this.t(`لم يتم فتح أي درس. استمر من الدرس ${this.levelTestLessons[this.levelTestCurrentLessonIndex]}.`, `No lessons unlocked. Continue from lesson ${this.levelTestLessons[this.levelTestCurrentLessonIndex]}.`); else message = this.t(`🎉 لقد أكملت جميع الدروس مسبقاً.`, `🎉 You have already completed all lessons.`); }
        if (this.levelTestCoinsEarned > 0) message += this.t(`\nحصلت على ${this.levelTestCoinsEarned} لؤلؤة إضافية.`, `\nYou earned ${this.levelTestCoinsEarned} extra pearls.`);
        this.levelTestResultMessage = message;
        this.showAd('video', () => { this.currentPage = 'level_test_result'; this.render(); this.showCustomModal('info', '📊', message); });
    }

    isLessonCompleted(lessonId) { const lesson = this.getLessonDataById(lessonId); if (!lesson) return false; const allTermIds = lesson.terms.map(t => String(t.id)); return allTermIds.every(id => this.masteredWords.includes(id)); }
    grantLessonCompletionReward(lessonId) { const key = `lesson_completed_${lessonId}`; if (!localStorage.getItem(key) && this.isLessonCompleted(lessonId)) { this.userCoins += 20; localStorage.setItem(key, 'true'); this.saveUserData(); this.updateLevelAndBadges(); this.showCustomModal('success', '🎉', this.t(`أحسنت! أكملت جميع كلمات الدرس وحصلت على 20 لؤلؤة إضافية.`, `Well done! You completed all lesson words and earned 20 extra pearls.`)); } }
    speak(text) { if (!text) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.85; window.speechSynthesis.speak(u); }
    async translateAuto(text, targetId) { const el = document.getElementById(targetId); if (!el) return; if (!text.trim()) { if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = ""; else el.innerText = ""; return; } try { const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`); const data = await res.json(); const translatedText = data.responseData.translatedText; if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = translatedText; else el.innerText = translatedText; } catch (e) {} }
    async translateText(text) { if (!text) return ''; try { const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`); const data = await res.json(); return data.responseData.translatedText || ''; } catch (e) { return ''; } }
    
    playTone(type) {
        this.initAudioContext();
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().then(() => this._playTone(type)).catch(() => {});
        } else {
            this._playTone(type);
        }
    }
    
    _playTone(type) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        if (type === 'correct') {
            osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
        } else {
            osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(110, this.audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4);
        }
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.4);
    }
    
    playAudio(src) { const fullSrc = new URL(src, window.location.href).href; if (this.currentAudio) { if (this.currentAudio.src === fullSrc && !this.currentAudio.ended) { this.currentAudio.play(); return; } else this.currentAudio.pause(); } this.currentAudio = new Audio(fullSrc); this.currentAudio.playbackRate = this.audioPlaybackRate; this.currentAudio.play().catch(e => console.log("Audio play error:", e)); }
    pauseAudio() { if (this.currentAudio) this.currentAudio.pause(); }
    stopAudio() { if (this.currentAudio) { this.currentAudio.pause(); this.currentAudio.currentTime = 0; } }
    skipBack10() { if (this.currentAudio) this.currentAudio.currentTime = Math.max(0, this.currentAudio.currentTime - 10); }
    skipForward10() { if (this.currentAudio) this.currentAudio.currentTime = Math.min(this.currentAudio.duration, this.currentAudio.currentTime + 10); }
    setAudioSpeed(rate) { if (rate >= 0.5 && rate <= 3.0) { this.audioPlaybackRate = rate; if (this.currentAudio) this.currentAudio.playbackRate = rate; this.render(); } }
    speedUp() { const currentIndex = this.availableSpeeds.indexOf(this.audioPlaybackRate); if (currentIndex < this.availableSpeeds.length - 1) this.setAudioSpeed(this.availableSpeeds[currentIndex + 1]); }
    speedDown() { const currentIndex = this.availableSpeeds.indexOf(this.audioPlaybackRate); if (currentIndex > 0) this.setAudioSpeed(this.availableSpeeds[currentIndex - 1]); }
    getCorrectAnswer(q) { return q.correct || q.answer || q.a || q.right || q.rightAnswer || ''; }
    prepareQuiz(terms, isUnlockMode = false) { this.isUnlockTest = isUnlockMode; const addedByUser = this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId); const fullPool = [...terms, ...addedByUser].filter(t => !this.hiddenFromCards.includes(String(t.id))); if (this.isUnlockTest) this.quizQuestions = fullPool.sort(() => 0.5 - Math.random()).slice(0, Math.max(1, Math.floor(fullPool.length / 2))); else this.quizQuestions = fullPool; this.quizIndex = 0; this.quizScore = 0; this.generateOptions(); }
    generateOptions() { if (this.quizIndex >= this.quizQuestions.length) return; const currentQ = this.quizQuestions[this.quizIndex]; const lesson = this.getCurrentLessonData() || { terms: [] }; let allArb = [...lesson.terms, ...this.userVocabulary].map(t => t.arabic); let wrongs = [...new Set(allArb.filter(a => a !== currentQ.arabic))].sort(() => 0.5 - Math.random()).slice(0, 3); while (wrongs.length < 3) wrongs.push(this.t("خيار " + (wrongs.length + 1), "Option " + (wrongs.length + 1))); this.quizOptions = [currentQ.arabic, ...wrongs].sort(() => 0.5 - Math.random()); }
    handleAnswer(selected, correct, btnElement) { if (this.isWaiting) return; this.isWaiting = true; const selectedTrim = selected.trim().toLowerCase(); const correctTrim = correct.trim().toLowerCase(); const isCorrect = (selectedTrim === correctTrim); if (isCorrect) { this.quizScore++; this.playTone('correct'); this.addQuizCorrectReward(this.quizQuestions[this.quizIndex].id); } else { this.playTone('error'); this.recordTotalAnswer('quiz'); } const allOptions = document.querySelectorAll('.quiz-opt-btn'); allOptions.forEach(btn => { btn.disabled = true; btn.classList.remove('correct-answer', 'wrong-answer', 'other-option'); const btnParam = btn.dataset.param ? btn.dataset.param.trim().toLowerCase() : ''; if (btnParam === correctTrim) btn.classList.add('correct-answer'); else if (btnParam === selectedTrim && !isCorrect) btn.classList.add('wrong-answer'); else btn.classList.add('other-option'); }); setTimeout(() => { this.quizIndex++; if (this.quizIndex < this.quizQuestions.length) this.generateOptions(); this.isWaiting = false; this.render(); }, 1100); }
    generateDynamicGapFillQuestion(wordObj) { const { english, arabic } = wordObj; const sentence = this.t(`The word "______" means "${arabic}".`, `The word "______" means "${arabic}".`); const originalSentence = this.t(`The word "${english}" means "${arabic}".`, `The word "${english}" means "${arabic}".`); const options = [english, ...this.getRandomWordsForOptions(english, 3)]; return { sentence, originalSentence, options, word: english, arabic }; }
    getRandomWordsForOptions(correctWord, count) { const lesson = this.getCurrentLessonData(); if (!lesson) return []; const allTerms = [...lesson.terms, ...this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId)]; const otherWords = allTerms.filter(t => t.english !== correctWord).map(t => t.english); const shuffled = [...otherWords].sort(() => 0.5 - Math.random()); const selected = shuffled.slice(0, count); while (selected.length < count) selected.push('???'); return selected; }
    async prepareGapFill() { if (this.gapFillTimer) clearTimeout(this.gapFillTimer); const lesson = this.getCurrentLessonData(); if (!lesson) return; if (this.gapFillCurrentLessonId !== this.selectedLessonId) { this.resetGapFillForNewLesson(); this.gapFillCurrentLessonId = this.selectedLessonId; } const available = this.getAllAvailableWordsForExercises(); if (available.length === 0) { alert(this.t('🎉 لا توجد كلمات متاحة! قم بإضافة كلمات جديدة.', '🎉 No words available! Add new words.')); return; } if (!this.gapFillRemainingWords || this.gapFillRemainingWords.length === 0) { this.gapFillRemainingWords = [...available]; this.shuffleArray(this.gapFillRemainingWords); this.gapFillUsedQuestions = {}; this.gapFillNoQuestionsMessageShown = false; } const targetWordObj = this.gapFillRemainingWords[0]; const targetWord = targetWordObj.english; const targetArabic = targetWordObj.arabic; const wordId = targetWordObj.id; let questionData = null; if (window.gapfillDB && window.gapfillDB[wordId] && window.gapfillDB[wordId].length > 0) { const questionsForWord = window.gapfillDB[wordId]; if (!this.gapFillUsedQuestions[wordId]) this.gapFillUsedQuestions[wordId] = []; let availableQuestions = questionsForWord.filter(q => !this.gapFillUsedQuestions[wordId].includes(q)); if (availableQuestions.length === 0) { this.gapFillUsedQuestions[wordId] = []; availableQuestions = questionsForWord; } const randomIndex = Math.floor(Math.random() * availableQuestions.length); questionData = availableQuestions[randomIndex]; this.gapFillUsedQuestions[wordId].push(questionData); } if (!questionData) questionData = this.generateDynamicGapFillQuestion(targetWordObj); while (questionData.options.length < 4) questionData.options.push('???'); this.shuffleArray(questionData.options); this.gapFillCurrentQuestion = { text: questionData.sentence, correct: targetWord, arabic: targetArabic, originalSentence: questionData.originalSentence || questionData.sentence.replace('______', targetWord), originalSentenceArabic: '', wordId: wordId }; this.gapFillOptions = questionData.options; this.gapFillAnswered = false; this.gapFillResult = null; this.gapFillExplanation = ''; this.gapFillOptionsMeanings = []; this.gapFillExplanationVisible = false; this.render(); }
    handleGapFillAnswer(selectedEnglish) { if (this.gapFillAnswered || !this.gapFillCurrentQuestion) return; this.gapFillAnswered = true; const isCorrect = (selectedEnglish.trim().toLowerCase() === this.gapFillCurrentQuestion.correct.trim().toLowerCase()); this.playTone(isCorrect ? 'correct' : 'error'); this.gapFillResult = isCorrect ? 'correct' : 'wrong'; const allOptions = document.querySelectorAll('.gapfill-opt-btn'); allOptions.forEach(btn => { btn.disabled = true; btn.classList.remove('correct-answer', 'wrong-answer', 'other-option'); if (btn.dataset.english === this.gapFillCurrentQuestion.correct) btn.classList.add('correct-answer'); else if (btn.dataset.english === selectedEnglish && !isCorrect) btn.classList.add('wrong-answer'); else btn.classList.add('other-option'); }); const lesson = this.getCurrentLessonData(); const allTerms = lesson ? [...lesson.terms, ...this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId)] : []; this.gapFillOptionsMeanings = this.gapFillOptions.map(opt => { const term = allTerms.find(t => t.english === opt); if (term) return { english: opt, arabic: term.arabic }; return { english: opt, arabic: 'معنى غير متاح' }; }); if (isCorrect) { if (this.gapFillRemainingWords && this.gapFillRemainingWords.length > 0) this.gapFillRemainingWords.shift(); this.addGapFillCorrectReward(this.gapFillCurrentQuestion.wordId); } else { this.recordTotalAnswer('gapFill'); if (this.gapFillRemainingWords && this.gapFillRemainingWords.length > 0) { const currentWord = this.gapFillRemainingWords.shift(); const len = this.gapFillRemainingWords.length; if (len > 0) { const randomIndex = Math.floor(Math.random() * len) + 1; this.gapFillRemainingWords.splice(randomIndex, 0, currentWord); } else this.gapFillRemainingWords.push(currentWord); } } this.gapFillExplanation = isCorrect ? this.t(`✅ إجابة صحيحة! كلمة "${this.gapFillCurrentQuestion.correct}" تعني "${this.gapFillCurrentQuestion.arabic}" في العربية.`, `✅ Correct answer! The word "${this.gapFillCurrentQuestion.correct}" means "${this.gapFillCurrentQuestion.arabic}" in Arabic.`) : this.t(`❌ إجابة خاطئة. الإجابة الصحيحة هي "${this.gapFillCurrentQuestion.correct}" (${this.gapFillCurrentQuestion.arabic}).`, `❌ Wrong answer. The correct answer is "${this.gapFillCurrentQuestion.correct}" (${this.gapFillCurrentQuestion.arabic}).`); this.render(); }
    handleGapFillNext() { if (this.gapFillRemainingWords.length === 0) { alert(this.t('🎉 تهانينا! أكملت جميع الكلمات.', '🎉 Congratulations! You completed all words.')); this.currentPage = 'reading'; } else this.prepareGapFill(); this.render(); }
    async showDetailedGapFillExplanation() {
        if (!this.gapFillCurrentQuestion) return;
        this.gapFillExplanationVisible = !this.gapFillExplanationVisible;
        if (this.gapFillExplanationVisible) {
            const lesson = this.getCurrentLessonData();
            let allTerms = lesson ? [...lesson.terms] : [];
            const userWordsForLesson = this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId);
            allTerms.push(...userWordsForLesson);
            if (this.selectedLevel && window.lessonsList && window.lessonsList[this.selectedLevel]) {
                for (let l of window.lessonsList[this.selectedLevel]) {
                    const lessonData = this.getLessonDataById(l.id);
                    if (lessonData && lessonData.terms) {
                        for (let term of lessonData.terms) {
                            if (!allTerms.some(t => t.english === term.english)) allTerms.push(term);
                        }
                    }
                }
            }
            for (let uv of this.userVocabulary) {
                if (!allTerms.some(t => t.english === uv.english)) allTerms.push(uv);
            }
            this.gapFillOptionsMeanings = [];
            for (let opt of this.gapFillOptions) {
                let found = allTerms.find(t => t.english === opt);
                if (found) {
                    this.gapFillOptionsMeanings.push({ english: opt, arabic: found.arabic });
                } else {
                    let translated = await this.translateText(opt);
                    if (translated && translated !== opt) {
                        this.gapFillOptionsMeanings.push({ english: opt, arabic: translated });
                    } else {
                        this.gapFillOptionsMeanings.push({ english: opt, arabic: this.t('معنى غير متاح', 'Meaning not available') });
                    }
                }
            }
            if (!this.gapFillCurrentQuestion.originalSentenceArabic && this.gapFillCurrentQuestion.originalSentence) {
                const translated = await this.translateText(this.gapFillCurrentQuestion.originalSentence);
                this.gapFillCurrentQuestion.originalSentenceArabic = translated || '';
            } else if (!this.gapFillCurrentQuestion.originalSentenceArabic && this.gapFillCurrentQuestion.text) {
                const fullSentence = this.gapFillCurrentQuestion.text.replace('______', this.gapFillCurrentQuestion.correct);
                const translated = await this.translateText(fullSentence);
                this.gapFillCurrentQuestion.originalSentenceArabic = translated || '';
            }
            let detailedExplanation = this.t(`✅ الإجابة الصحيحة هي "<strong>${this.gapFillCurrentQuestion.correct}</strong>" (${this.gapFillCurrentQuestion.arabic}).<br><br>`, `✅ The correct answer is "<strong>${this.gapFillCurrentQuestion.correct}</strong>" (${this.gapFillCurrentQuestion.arabic}).<br><br>`);
            detailedExplanation += this.t(`📖 الجملة الكاملة بالإنجليزية: "${this.gapFillCurrentQuestion.originalSentence || this.gapFillCurrentQuestion.text.replace('______', this.gapFillCurrentQuestion.correct)}"<br>`, `📖 The full sentence in English: "${this.gapFillCurrentQuestion.originalSentence || this.gapFillCurrentQuestion.text.replace('______', this.gapFillCurrentQuestion.correct)}"<br>`);
            detailedExplanation += this.t(`🌐 الترجمة العربية: "${this.gapFillCurrentQuestion.originalSentenceArabic || 'جاري التحميل...'}"<br><br>`, `🌐 Arabic translation: "${this.gapFillCurrentQuestion.originalSentenceArabic || 'Loading...'}"<br><br>`);
            detailedExplanation += this.t(`📚 معاني الخيارات:<br>`, `📚 Meanings of options:<br>`);
            this.gapFillOptionsMeanings.forEach(opt => {
                detailedExplanation += this.t(`• <strong>${opt.english}</strong> : ${opt.arabic}<br>`, `• <strong>${opt.english}</strong> : ${opt.arabic}<br>`);
            });
            detailedExplanation += this.t(`<br>💡 سبب الاختيار: كلمة "<strong>${this.gapFillCurrentQuestion.correct}</strong>" (${this.gapFillCurrentQuestion.arabic}) هي الأنسب لسياق الجملة.`, `<br>💡 Reason: The word "<strong>${this.gapFillCurrentQuestion.correct}</strong>" (${this.gapFillCurrentQuestion.arabic}) is the most appropriate for the sentence context.`);
            this.gapFillExplanation = detailedExplanation;
        }
        this.render();
        setTimeout(() => {
            const explanationDiv = document.querySelector('.gapfill-explanation');
            if (explanationDiv) {
                explanationDiv.style.maxHeight = '300px';
                explanationDiv.style.overflowY = 'auto';
            }
        }, 50);
    }
    unlockGapFill(lessonId) { if (this.gapFillUnlocked[lessonId]) return true; if (this.userCoins >= 75) { this.showCoinPurchaseModal(75, (confirmed) => { if (confirmed) { this.userCoins -= 75; this.gapFillUnlocked[lessonId] = true; this.saveUserData(); this.resetGapFillForNewLesson(); this.prepareGapFill(); this.currentPage = 'gapfill'; this.render(); } }); } else this.showCustomModal('error', '❌', this.t(`ليس لديك لآلئ كافية! تحتاج 75 لؤلؤة.`, `You don't have enough pearls! You need 75 pearls.`)); return false; }
    async handleNewWord() { const eng = document.getElementById('newEng').value.trim(); const arb = document.getElementById('newArb').value.trim(); if (!eng || !arb) return; const lesson = this.getCurrentLessonData(); if (!lesson) { alert(this.t('الدرس غير موجود.', 'Lesson not found.')); return; } const existingWords = lesson.terms.map(t => t.english.toLowerCase()); const userWords = this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId).map(v => v.english.toLowerCase()); if (existingWords.includes(eng.toLowerCase()) || userWords.includes(eng.toLowerCase())) { this.showCustomModal('error', '⚠️', this.t('هذه الكلمة موجودة بالفعل في الدرس. لا يمكن إضافتها مرة أخرى.', 'This word already exists in the lesson. Cannot add again.')); return; } this.userVocabulary.push({ id: "u" + Date.now(), lessonId: String(this.selectedLessonId), english: eng, arabic: arb }); await this.saveUserData(); document.getElementById('newEng').value = ''; document.getElementById('newArb').value = ''; this.newWordsAddedCount++; if (this.newWordsAddedCount % 10 === 0) this.showAd('video'); this.render(); this.showCustomModal('success', '✅', this.t('تمت إضافة الكلمة بنجاح إلى بطاقات الدرس.', 'Word successfully added to lesson flashcards.')); }
    toggleEditMode(wordId) {
        const area = document.getElementById(`editArea_${wordId}`);
        if (area) {
            area.style.display = (area.style.display === 'none') ? 'block' : 'none';
            if (area.style.display === 'block') area.scrollIntoView({ behavior: 'smooth' });
        }
    }
    async saveCardEdit(wordId) {
        try {
            const inputEng = document.getElementById(`editEng_${wordId}`);
            const inputArb = document.getElementById(`editArb_${wordId}`);
            if (!inputEng || !inputArb) return;
            const newEng = inputEng.value.trim();
            const newArb = inputArb.value.trim();
            if (!newEng || !newArb) {
                alert("يرجى ملء الحقول");
                return;
            }
            if (!this.userModifiedWords) this.userModifiedWords = {};
            this.userModifiedWords[wordId] = {
                english: newEng,
                arabic: newArb
            };
            if (window.lessonsData) {
                const idx = window.lessonsData.findIndex(w => String(w.id) === String(wordId));
                if (idx !== -1) {
                    window.lessonsData[idx].english = newEng;
                    window.lessonsData[idx].arabic = newArb;
                }
            }
            await this.saveUserData();
            const area = document.getElementById(`editArea_${wordId}`);
            if (area) area.style.display = 'none';
            this.render();
            if (this.showCustomModal) {
                this.showCustomModal('success', '✅', 'تم الحفظ في سحابة حسابك');
            } else {
                alert("تم الحفظ بنجاح ✅");
            }
        } catch (e) {
            console.error("Save error:", e);
            alert("حدث خطأ أثناء الحفظ");
        }
    }
    getCurrentLessonData() { if (!this.selectedLessonId) return null; return this.getLessonDataById(this.selectedLessonId); }
    getLessonDataById(id) { if (window.lessonsData[id]) return window.lessonsData[id]; if (this.generatedLessons[id]) return this.generatedLessons[id]; return null; }

    getBadgesDisplay() { 
        const earnedBadges = this.userStats.earnedBadges || []; 
        const allBadges = [...this.badgeDefinitions.general, ...this.badgeDefinitions.quiz, ...this.badgeDefinitions.listening, ...this.badgeDefinitions.spelling, ...this.badgeDefinitions.gapFill]; 
        const displayBadges = allBadges.slice(0, 8); 
        if (displayBadges.length === 0) return `<div class="badges-container" data-action="showBadges" style="justify-content:center; color:#aaa; cursor:pointer;"><span>🏅 ${this.t('اضغط لعرض الأوسمة', 'Click to view badges')}</span></div>`; 
        return `<div class="badges-container" data-action="showBadges">${displayBadges.map(b => { const isEarned = earnedBadges.includes(b.id); return `<span class="badge-item ${isEarned ? 'earned' : 'locked'}" title="${this.t(b.name, b.nameEn)}">${b.icon}</span>`; }).join('')}${allBadges.length > 8 ? `<span class="badge-item" style="font-size:0.9rem;">+${allBadges.length - 8}</span>` : ''}</div>`; 
    }
    showBadgesModal() { 
        const earnedBadges = this.userStats.earnedBadges || []; 
        const totalLessons = (this.unlockedLessons || []).length; 
        const totalMastered = (this.masteredWords || []).length; 
        let html = `<div style="text-align:center; margin-bottom:15px;"><div style="font-size:1.1rem; font-weight:bold;">🏅 ${this.t('الأوسمة والإنجازات', 'Badges & Achievements')}</div><div style="font-size:0.75rem; color:#666;">${this.t('الأوسمة الباهتة لم يتم الحصول عليها بعد', 'Dim badges are not yet earned')}</div></div><div class="badges-grid">`; 
        html += `<div style="grid-column:1/-1; margin:10px 0 5px; font-weight:bold; text-align:center; border-bottom:2px solid #ffd700;">📊 ${this.t('أوسمة التقدم العام', 'General Progress Badges')}</div>`; 
        for (const badge of this.badgeDefinitions.general) { 
            const isEarned = earnedBadges.includes(badge.id); 
            let progressText = ''; 
            if (badge.id === 'bronze_medal') progressText = `${this.t('الدروس:', 'Lessons:')} ${totalLessons}/5 | ${this.t('الكلمات:', 'Words:')} ${totalMastered}/100`; 
            else if (badge.id === 'silver_medal') progressText = `${this.t('الدروس:', 'Lessons:')} ${totalLessons}/15 | ${this.t('الكلمات:', 'Words:')} ${totalMastered}/300`; 
            else if (badge.id === 'gold_medal') progressText = `${this.t('الدروس:', 'Lessons:')} ${totalLessons}/35 | ${this.t('الكلمات:', 'Words:')} ${totalMastered}/800`; 
            else if (badge.id === 'diamond_medal') progressText = `${this.t('الدروس:', 'Lessons:')} ${totalLessons}/60 | ${this.t('الكلمات:', 'Words:')} ${totalMastered}/2000`; 
            else if (badge.id === 'bronze_crown') progressText = `${this.t('الدروس:', 'Lessons:')} ${totalLessons}/80 | ${this.t('الكلمات:', 'Words:')} ${totalMastered}/2500`; 
            else if (badge.id === 'silver_crown') progressText = `${this.t('الدروس:', 'Lessons:')} ${totalLessons}/100 | ${this.t('الكلمات:', 'Words:')} ${totalMastered}/3500`; 
            else if (badge.id === 'gold_crown') progressText = `${this.t('الدروس:', 'Lessons:')} ${totalLessons}/120 | ${this.t('الكلمات:', 'Words:')} ${totalMastered}/5000`; 
            else if (badge.id === 'diamond_crown') progressText = `${this.t('الدروس:', 'Lessons:')} ${totalLessons}/150 | ${this.t('الكلمات:', 'Words:')} ${totalMastered}/7000`; 
            html += `<div class="badge-modal-item ${isEarned ? 'earned' : ''}"><span class="badge-icon">${badge.icon}</span><span class="badge-name">${this.t(badge.name, badge.nameEn)}</span>${progressText ? `<div class="badge-progress">${progressText}</div>` : ''}<div>${isEarned ? '✅' : '🔒'}</div></div>`; 
        } 
        html += `<div style="grid-column:1/-1; margin:15px 0 5px; font-weight:bold; text-align:center; border-bottom:2px solid #ffd700;">📝 ${this.t('أوسمة اختبار الكلمات', 'Quiz Badges')}</div>`; 
        for (const badge of this.badgeDefinitions.quiz) { 
            const isEarned = earnedBadges.includes(badge.id); 
            const current = this.exerciseStats.quiz?.correct || 0; 
            html += `<div class="badge-modal-item ${isEarned ? 'earned' : ''}"><span class="badge-icon">${badge.icon}</span><span class="badge-name">${this.t(badge.name, badge.nameEn)}</span><div class="badge-progress">${current}/${badge.requirement}</div><div>${isEarned ? '✅' : '🔒'}</div></div>`; 
        } 
        html += `<div style="grid-column:1/-1; margin:15px 0 5px; font-weight:bold; text-align:center; border-bottom:2px solid #ffd700;">🎧 ${this.t('أوسمة الاستماع', 'Listening Badges')}</div>`; 
        for (const badge of this.badgeDefinitions.listening) { 
            const isEarned = earnedBadges.includes(badge.id); 
            const current = this.exerciseStats.listening?.correct || 0; 
            html += `<div class="badge-modal-item ${isEarned ? 'earned' : ''}"><span class="badge-icon">${badge.icon}</span><span class="badge-name">${this.t(badge.name, badge.nameEn)}</span><div class="badge-progress">${current}/${badge.requirement}</div><div>${isEarned ? '✅' : '🔒'}</div></div>`; 
        } 
        html += `<div style="grid-column:1/-1; margin:15px 0 5px; font-weight:bold; text-align:center; border-bottom:2px solid #ffd700;">✍️ ${this.t('أوسمة الكتابة', 'Spelling Badges')}</div>`; 
        for (const badge of this.badgeDefinitions.spelling) { 
            const isEarned = earnedBadges.includes(badge.id); 
            const current = this.exerciseStats.spelling?.correct || 0; 
            html += `<div class="badge-modal-item ${isEarned ? 'earned' : ''}"><span class="badge-icon">${badge.icon}</span><span class="badge-name">${this.t(badge.name, badge.nameEn)}</span><div class="badge-progress">${current}/${badge.requirement}</div><div>${isEarned ? '✅' : '🔒'}</div></div>`; 
        } 
        html += `<div style="grid-column:1/-1; margin:15px 0 5px; font-weight:bold; text-align:center; border-bottom:2px solid #ffd700;">📝 ${this.t('أوسمة ملء الفراغ', 'Gap Fill Badges')}</div>`; 
        for (const badge of this.badgeDefinitions.gapFill) { 
            const isEarned = earnedBadges.includes(badge.id); 
            const current = this.exerciseStats.gapFill?.correct || 0; 
            html += `<div class="badge-modal-item ${isEarned ? 'earned' : ''}"><span class="badge-icon">${badge.icon}</span><span class="badge-name">${this.t(badge.name, badge.nameEn)}</span><div class="badge-progress">${current}/${badge.requirement}</div><div>${isEarned ? '✅' : '🔒'}</div></div>`; 
        } 
        html += '</div>'; 
        this.showCustomModal('info', '🏅', html); 
    }
    
    addThemeStyles() { 
        const styleId = 'theme-dynamic-styles'; 
        if (document.getElementById(styleId)) return; 
        const style = document.createElement('style'); 
        style.id = styleId; 
        style.textContent = `
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Cairo',sans-serif;background:#f5f7fb;margin:0;padding:0}
            [data-theme="dark"]{--bg-main:#121212;--bg-card:#1e1e1e;--text-main:#ffffff;--text-muted:#cccccc;--border-color:#444}
            [data-theme="dark"] body{background-color:#121212!important;color:#ffffff!important}
            .header{position:sticky;top:0;z-index:100;background:white;border-bottom:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(0,0,0,0.05);padding-top:env(safe-area-inset-top);padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
            [data-theme="dark"] .header{background:#1e1e1e;border-bottom-color:#333}
            .header-content{display:flex;justify-content:space-between;align-items:center;padding:8px 16px;max-width:100%;gap:8px}
            .logo-container{display:flex;align-items:center;gap:6px;cursor:pointer;flex-shrink:0}
            .logo-container img{width:32px;height:32px;object-fit:contain;display:block}
            .logo-container h2{margin:0;font-size:1.2rem;font-weight:bold;background:linear-gradient(135deg,#1e40af,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
            [data-theme="dark"] .logo-container h2{background:linear-gradient(135deg,#ffd700,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
            .header-buttons{display:flex;align-items:center;gap:6px;flex-shrink:0}
            .header-btn{background:none;border:none;font-size:1rem;cursor:pointer;padding:6px 8px;border-radius:8px;transition:all 0.2s;color:inherit;display:flex;align-items:center;gap:4px}
            .header-btn:hover{background:rgba(0,0,0,0.05)}
            [data-theme="dark"] .header-btn:hover{background:rgba(255,255,255,0.1)}
            .lang-btn{background:#3b82f6;color:white;font-weight:bold;border-radius:20px;padding:4px 12px}
            [data-theme="dark"] .lang-btn{background:#ffd700;color:#000}
            .lang-btn:hover{opacity:0.9;transform:scale(0.98)}
            .coin-display{background:#ffd700;color:#000;padding:4px 10px;border-radius:20px;font-weight:bold;display:flex;align-items:center;gap:4px;cursor:pointer;font-size:0.85rem}
            .nav-menu{display:flex;flex-wrap:wrap;gap:4px;padding:8px 12px;background:rgba(0,0,0,0.03);border-top:1px solid rgba(0,0,0,0.05);justify-content:center}
            [data-theme="dark"] .nav-menu{background:rgba(255,255,255,0.03);border-top-color:rgba(255,255,255,0.05)}
            .nav-btn{padding:6px 12px;font-size:0.75rem;border-radius:20px;background:#f0f0f0;border:none;cursor:pointer;transition:all 0.2s;color:#333}
            .nav-btn.active{background:#3b82f6;color:white}
            [data-theme="dark"] .nav-btn{background:#333;color:#fff}
            [data-theme="dark"] .nav-btn.active{background:#3b82f6}
            .main-content{max-width:600px;margin:0 auto;padding:16px;width:100%}
            .reading-card{background:white;border-radius:20px;padding:20px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);border:1px solid #eef2ff}
            [data-theme="dark"] .reading-card{background:#1e1e1e;border-color:#333}
            .feature-card{background:#f8fafc;border-radius:16px;padding:16px;text-align:center;cursor:pointer;transition:all 0.3s;border:1px solid #e2e8f0}
            [data-theme="dark"] .feature-card{background:#2d2d2d;border-color:#444}
            .feature-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.1)}
            .hero-btn{padding:12px 20px;font-size:0.95rem;border-radius:12px;border:none;background:#3b82f6;color:white;cursor:pointer;transition:all 0.2s;font-weight:bold}
            .hero-btn:hover{opacity:0.9;transform:scale(0.98)}
            .features-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin:16px 0}
            .badges-container{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;padding:12px;background:rgba(0,0,0,0.03);border-radius:16px;cursor:pointer;justify-content:center}
            [data-theme="dark"] .badges-container{background:rgba(255,255,255,0.05)}
            .badge-item{font-size:1.4rem;transition:transform 0.2s;cursor:pointer}
            .badge-item.earned{opacity:1;filter:none}
            .badge-item.locked{opacity:0.3;filter:grayscale(1)}
            .badge-item:hover{transform:scale(1.1)}
            .badges-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:12px;padding:10px}
            .badge-modal-item{text-align:center;padding:12px;border-radius:12px;background:#f5f5f5;transition:0.2s;cursor:pointer}
            [data-theme="dark"] .badge-modal-item{background:#2d2d2d}
            .badge-modal-item.earned{background:linear-gradient(135deg,#ffd700,#ffb347);color:#000;font-weight:bold;box-shadow:0 4px 12px rgba(255,215,0,0.3)}
            .badge-modal-item:not(.earned){opacity:0.5;filter:grayscale(0.8)}
            .badge-modal-item .badge-icon{font-size:2rem;display:block;margin-bottom:5px}
            .badge-modal-item .badge-name{font-size:0.8rem;font-weight:bold}
            .badge-modal-item .badge-progress{font-size:0.65rem;color:#666;margin-top:4px}
            [data-theme="dark"] .badge-modal-item .badge-progress{color:#aaa}
            .progress-bar-container{width:100%;height:8px;background:#e0e0e0;border-radius:10px;margin:8px 0;overflow:hidden}
            .progress-bar-fill{height:100%;background:linear-gradient(90deg,#ffd700,#ffa500);border-radius:10px;transition:width 0.3s}
            .welcome-banner{background:linear-gradient(135deg,#1e40af,#3b82f6);color:white;border:none}
            [data-theme="dark"] .welcome-banner{background:linear-gradient(135deg,#1a1a2e,#16213e)}
            .quiz-options{display:flex;flex-direction:column;gap:10px;margin-top:20px}
            .quiz-opt-btn{padding:12px 16px;font-size:0.95rem;border-radius:12px;border:1px solid #ddd;background:#f9f9f9;cursor:pointer;transition:all 0.2s;text-align:center}
            [data-theme="dark"] .quiz-opt-btn{background:#333;border-color:#555;color:white}
            .quiz-opt-btn:hover:not(:disabled){transform:scale(1.02);background:#e0e0e0}
            .quiz-opt-btn.correct-answer{background:#10b981!important;color:white;border-color:#10b981}
            .quiz-opt-btn.wrong-answer{background:#ef4444!important;color:white;border-color:#ef4444}
            .flashcard-container{perspective:1000px;cursor:pointer;margin:20px 0;height:250px}
            .flashcard{position:relative;width:100%;height:100%;text-align:center;transition:transform 0.6s;transform-style:preserve-3d;border-radius:20px}
            .flashcard.flipped{transform:rotateY(180deg)}
            .flashcard-front,.flashcard-back{position:absolute;width:100%;height:100%;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;border-radius:20px;background:linear-gradient(135deg,#667eea,#764ba2);box-shadow:0 8px 20px rgba(0,0,0,0.15);padding:20px}
            .flashcard-back{background:linear-gradient(135deg,#f093fb,#f5576c);transform:rotateY(180deg)}
            .flashcard-front h1,.flashcard-back h1{font-size:1.6rem;margin:0;color:white}
            @media (max-width:480px){.header-content{padding:6px 12px}.logo-container img{width:28px;height:28px}.logo-container h2{font-size:1rem}.header-btn{padding:4px 6px;font-size:0.85rem}.coin-display{padding:3px 8px;font-size:0.75rem}.nav-btn{padding:4px 8px;font-size:0.65rem}.main-content{padding:12px}.reading-card{padding:16px}.flashcard-container{height:200px}.flashcard-front h1,.flashcard-back h1{font-size:1.2rem}.badge-item{font-size:1.2rem}.features-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}}
            .modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;justify-content:center;align-items:center;z-index:1000;animation:fadeIn 0.3s}
            .modal-content{background:white;border-radius:24px;padding:24px;max-width:380px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 35px rgba(0,0,0,0.3);animation:slideUp 0.3s}
            [data-theme="dark"] .modal-content{background:#1e1e1e;color:white}
            @keyframes fadeIn{from{opacity:0}to{opacity:1}}
            @keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
            .coin-option{background:#f5f5f5;border-radius:16px;padding:15px;margin-bottom:15px;cursor:pointer;transition:transform 0.2s;border:1px solid #e0e0e0}
            [data-theme="dark"] .coin-option{background:#2d2d2d;border-color:#444}
            .coin-option:hover{transform:scale(1.02)}
            .auth-container{text-align:center;margin-bottom:30px}
            .auth-container img{width:80px;height:80px;object-fit:contain;margin-bottom:15px}
            .auth-tabs{display:flex;gap:10px;margin-bottom:20px;justify-content:center}
            .auth-tab{padding:10px 20px;border-radius:30px;cursor:pointer;background:#e2e8f0;transition:all 0.2s}
            .auth-tab.active{background:#3b82f6;color:white}
            .auth-input{width:100%;padding:12px;margin:8px 0;border-radius:12px;border:1px solid #ddd;font-size:1rem}
            [data-theme="dark"] .auth-input{background:#2d2d2d;border-color:#555;color:white}
            .spelling-input{width:100%;padding:15px;font-size:1.1rem;border:2px solid #ddd;border-radius:12px;margin:20px 0;direction:ltr;text-align:left}
            .gapfill-sentence{font-size:1.2rem;font-weight:bold;text-align:center;margin:25px 0;padding:20px;background:#f8fafc;border-radius:16px}
            [data-theme="dark"] .gapfill-sentence{background:#2d2d2d}
            .logout-btn{background:#dc2626;color:white;padding:12px 20px;font-size:1rem;font-weight:bold;border-radius:12px;width:100%;border:none;cursor:pointer}
            .logout-btn:hover{opacity:0.9}
            .card-controls-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:15px 0}
            .card-nav-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0}
            .history-item{background:#f1f5f9;padding:12px;margin-bottom:10px;border-radius:12px;cursor:pointer}
            [data-theme="dark"] .history-item{background:#2d2d2d}
            .scrollable-text{max-height:400px;overflow-y:auto;padding:10px;line-height:1.6;direction:ltr;text-align:left}
            .profile-image{width:100px;height:100px;border-radius:50%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;overflow:hidden;border:3px solid #ffd700;cursor:pointer;margin:10px auto}
            .profile-image img{width:100%;height:100%;object-fit:cover}
            .info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;flex-wrap:wrap;gap:8px}
            [data-theme="dark"] .info-row{border-bottom-color:#444}
            .info-row input{padding:6px;border-radius:6px;border:1px solid #ddd}
            [data-theme="dark"] .info-row input{background:#2d2d2d;border-color:#555;color:white}
            .user-info-btn{background:#8b5cf6;margin:10px auto;display:block;width:80%}
        `; 
        document.head.appendChild(style); 
    }
    
    setupGlobalEvents() {
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const { action, param, correct, total, index } = btn.dataset;
            
            if (action === 'ansQ') { this.handleAnswer(param, correct, btn); return; }
            if (action === 'levelTestAns') { this.handleLevelTestAnswer(param, correct, btn); return; }
            if (action === 'gapfillAnswer') { this.handleGapFillAnswer(btn.dataset.english); return; }
            if (action === 'gapfillNext') { this.handleGapFillNext(); return; }
            if (action === 'gapfillShowExplanation') { this.showDetailedGapFillExplanation(); return; }
            if (action === 'adaptiveAnswer') { this.handleAdaptiveAnswer(param, correct, btn); return; }
            if (action === 'adaptiveListeningAnswer') { 
                console.log("✅ adaptiveListeningAnswer triggered", param, correct);
                this.handleAdaptiveListeningAnswer(param, correct, btn); 
                return; 
            }
            if (action === 'showListeningTranscript') { this.showListeningTranscript(); return; }
            if (action === 'nextAdaptiveListeningQuestion') { 
                this.nextAdaptiveListeningQuestion(); 
                return; 
            }
            if (action === 'playListeningAudio') {
                const audioSrc = btn.dataset.audio;
                const qId = btn.dataset.id;
                this.playListeningAudio(audioSrc, qId);
                return;
            }
            if (action === 'normalListeningAnswer') {
                this.handleNormalListeningAnswer(param);
                return;
            }
            if (action === 'test_sample_audio') {
                // تشغيل عينة صوتية من أول درس في A1 (يمكن تعديل المسار)
                const sampleAudioSrc = 'audio/lesson1.mp3';
                this.playAudio(sampleAudioSrc);
                return;
            }
            
            switch (action) {
                case 'masterWord': if (!this.masteredWords.includes(String(param))) { this.masteredWords.push(String(param)); this.addMasteredWordReward(param); if (this.selectedLessonId) this.grantLessonCompletionReward(this.selectedLessonId); await this.saveUserData(); } break;
                case 'playAudio': this.playAudio(param); break;
                case 'pauseAudio': this.pauseAudio(); break;
                case 'stopAudio': this.stopAudio(); break;
                case 'skipBack10': this.skipBack10(); break;
                case 'skipForward10': this.skipForward10(); break;
                case 'speedUp': this.speedUp(); this.render(); break;
                case 'speedDown': this.speedDown(); this.render(); break;
                case 'goHome': this.stopAudio(); this.currentPage = 'home'; this.selectedLessonId = null; this.isUnlockTest = false; this.viewingPlacementDetails = null; this.levelTestLevel = null; this.adaptiveTestActive = false; this.adaptiveListeningActive = false; break;
                case 'logout': if (confirm(this.t('هل أنت متأكد من تسجيل الخروج؟', 'Are you sure you want to logout?'))) this.logout(); break;
                case 'selLevel': this.selectedLevel = param; this.currentPage = (param === 'custom_list') ? 'custom_lessons_view' : 'lessons'; break;
                case 'toggleTheme': this.toggleTheme(); break;
                case 'toggleLang': this.toggleLanguage(); break;
                case 'selLesson': this.scrollPos = window.scrollY; this.openLesson(param); break;
                case 'unlockWithTest': const list = window.lessonsList[this.selectedLevel] || []; const curIdx = list.findIndex(l => l.id == param); const prevId = list[curIdx - 1]?.id; if (prevId) { this.tempLessonToUnlock = param; this.selectedLessonId = prevId; this.prepareQuiz(this.getLessonDataById(prevId).terms, true); this.currentPage = 'quiz'; } break;
                case 'unlockWithCoins': this.unlockLessonWithCoins(param); break;
                case 'start_listening_test':
                    this.startAdaptiveLevelTestListening();
                    break;
                case 'start_reading_test':
                    this.startAdaptiveLevelTestReading();
                    break;
                case 'setPage':
                    if (param === 'listening' && this.selectedLessonId) { if (!this.listeningUnlocked[this.selectedLessonId]) { if (!this.unlockListening(this.selectedLessonId)) return; } else this.prepareListeningQuiz(); }
                    else if (param === 'jumble' && this.selectedLessonId) { if (!this.jumbleUnlocked[this.selectedLessonId]) { if (!this.unlockJumble(this.selectedLessonId)) return; } else this.prepareJumble(); }
                    else if (param === 'spelling' && this.selectedLessonId) { if (!this.spellingUnlocked[this.selectedLessonId]) { if (!this.unlockSpelling(this.selectedLessonId)) return; } else this.prepareSpelling(); }
                    else if (param === 'quiz' && this.selectedLessonId) { const lessonData = this.getLessonDataById(this.selectedLessonId); if (lessonData) this.prepareQuiz(lessonData.terms, false); }
                    else if (param === 'profile') { this.showProfile(); return; }
                    else if (param === 'test_history') { this.showTestHistory(); return; }
                    else if (param === 'gapfill' && this.selectedLessonId) { if (!this.gapFillUnlocked[this.selectedLessonId]) { if (!this.unlockGapFill(this.selectedLessonId)) return; } else this.prepareGapFill(); }
                    else if (param === 'adaptive_test') { this.startAdaptiveLevelTestReading(); return; }
                    else if (param === 'level_test_instructions') { this.showLevelTestInstructions(); return; }
                    this.currentPage = param; this.currentCardIndex = 0; break;
                case 'masterWordFlash': 
                    const cardM = document.querySelector('.flashcard-container'); 
                    if (cardM) { 
                        cardM.classList.add('master-anim'); 
                        setTimeout(() => cardM.classList.remove('master-anim'), 200);
                        const wordId = String(param); 
                        if (!this.masteredWords.includes(wordId)) { 
                            this.masteredWords.push(wordId); 
                            this.addMasteredWordReward(param); 
                            if (this.selectedLessonId) this.grantLessonCompletionReward(this.selectedLessonId); 
                            await this.saveUserData(); 
                        } 
                        if (this.showAllCardsTemporary && !this.repeatAllSessionMastered.includes(wordId)) { 
                            this.repeatAllSessionMastered.push(wordId); 
                            await this.saveUserData(); 
                        } 
                        this.render(); 
                    } 
                    return;
                case 'deleteWord': this.showConfirmModal(this.t('هل أنت متأكد من حذف هذه الكلمة نهائياً من بطاقاتك؟', 'Are you sure you want to permanently delete this word from your flashcards?'), async () => { const cardD = document.querySelector('.flashcard-container'); if (cardD) { cardD.classList.add('delete-anim'); setTimeout(async () => { this.hiddenFromCards.push(String(param)); await this.saveUserData(); this.render(); }, 300); } }); return;
                case 'speak': this.speak(param); break;
                case 'nextC': const lessonData = this.getCurrentLessonData(); const addedWords = this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId); const allWords = lessonData ? [...lessonData.terms, ...addedWords] : []; let activeCards; if (this.showAllCardsTemporary) activeCards = allWords.filter(t => !this.hiddenFromCards.includes(String(t.id)) && !this.repeatAllSessionMastered.includes(String(t.id))); else activeCards = allWords.filter(t => !this.masteredWords.includes(String(t.id)) && !this.hiddenFromCards.includes(String(t.id))); if (activeCards.length === 0) break; const currentCard = activeCards[this.currentCardIndex]; if (currentCard && !this.skippedCards.includes(String(currentCard.id))) this.skippedCards.push(String(currentCard.id)); this.currentCardIndex++; if (this.currentCardIndex >= activeCards.length) this.currentCardIndex = 0; this.render(); break;
                case 'prevC': const lessonPrev = this.getCurrentLessonData(); const addedPrev = this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId); const allWordsPrev = lessonPrev ? [...lessonPrev.terms, ...addedPrev] : []; let activePrev; if (this.showAllCardsTemporary) activePrev = allWordsPrev.filter(t => !this.hiddenFromCards.includes(String(t.id)) && !this.repeatAllSessionMastered.includes(String(t.id))); else activePrev = allWordsPrev.filter(t => !this.masteredWords.includes(String(t.id)) && !this.hiddenFromCards.includes(String(t.id))); if (activePrev.length === 0) break; this.currentCardIndex--; if (this.currentCardIndex < 0) this.currentCardIndex = activePrev.length - 1; this.render(); break;
                case 'restartCards':
                    this.skippedCards = [];
                    this.currentCardIndex = 0;
                    if (param === 'all') {
                        this.repeatAllSessionMastered = [];
                        this.showAllCardsTemporary = true;
                    } else if (param === 'remaining') {
                        this.showAllCardsTemporary = false;
                        this.repeatAllSessionMastered = [];
                    }
                    const cardShuffle = document.querySelector('.flashcard-container');
                    if (cardShuffle) cardShuffle.classList.add('shuffle-anim-card');
                    setTimeout(() => {
                        if (cardShuffle) cardShuffle.classList.remove('shuffle-anim-card');
                        this.render();
                    }, 300);
                    this.showAd('image');
                    return;
                case 'addNewWord': this.handleNewWord(); break;
                case 'saveCardEdit': this.saveCardEdit(param); break;
                case 'backToLessons': this.stopAudio(); this.currentPage = (this.selectedLevel === 'custom_list') ? 'custom_lessons_view' : 'lessons'; this.selectedLessonId = null; this.isUnlockTest = false; this.render(); setTimeout(() => window.scrollTo(0, this.scrollPos), 50); return;
                case 'doLogin': this.handleLogin(); return;
                case 'doSignup': this.handleSignup(); return;
                case 'switchAuthMode': this.authMode = param; this.render(); return;
                case 'viewPlacementDetails': const record = this.placementResults[parseInt(index)]; if (record) { this.viewingPlacementDetails = record; this.currentPage = 'placement_details'; this.render(); } break;
                case 'viewTestHistoryDetails': this.viewTestDetails(parseInt(index)); break;
                case 'deletePlacementTest': this.deletePlacementTest(parseInt(index)); break;
                case 'backFromDetails': this.viewingPlacementDetails = null; this.currentPage = 'test_history'; this.render(); break;
                case 'jumbleSelect': this.handleJumbleSelect(param); break;
                case 'jumbleRemove': this.handleJumbleRemove(param); break;
                case 'jumbleReset': this.handleJumbleReset(); break;
                case 'jumbleCheck': this.handleJumbleCheck(); break;
                case 'jumbleHint': this.handleJumbleHint(); break;
                case 'jumbleNext': this.handleJumbleNext(); break;
                case 'spellingCheck': this.handleSpellingCheck(); break;
                case 'spellingNext': this.handleSpellingNext(); break;
                case 'startLevelTest': this.prepareLevelTest(param); break;
                case 'finishLevelTest': this.finishLevelTestEarly(); break;
                case 'watchAds': this.watchAdsForCoins(); break;
                case 'requestPurchase': this.requestPurchase(); break;
                case 'toggleCoinModal': this.toggleCoinModal(); break;
                case 'submitPurchase': this.submitPurchaseRequest(); break;
                case 'updateProfile': this.updateProfile(); break;
                case 'updateEmail': this.updateEmail(); break;
                case 'goToProfile': this.showProfile(); break;
                case 'showBadges': this.showBadgesModal(); break;
                case 'showUserInfo': this.showUserInfo(); break;
                case 'closeUserInfoModal': this.closeUserInfoModal(); break;
                case 'changeUserPassword': this.changeUserPassword(); break;
                case 'verifyEmail': this.verifyEmail(); break;
                case 'syncTestHistory': this.syncTestHistoryFromBackup(); break;
            }
            this.render();
        });
        document.addEventListener('input', (e) => { if (e.target.id === 'spellingInput') this.spellingUserAnswer = e.target.value; });
    }

    render() {
        const app = document.getElementById('app');
        if (!app) return;
        if (this.loadingData) {
            app.innerHTML = `<div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:Cairo, sans-serif;"><div class="loader" style="border:4px solid #f3f3f3; border-top:4px solid #3498db; border-radius:50%; width:40px; height:40px; animation:spin 2s linear infinite;"></div><p style="margin-top:20px; color:#666;">${this.t('جاري مزامنة بياناتك...', 'Syncing your data...')}</p><style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style></div>`;
            return;
        }
        const lesson = this.getCurrentLessonData();
        const added = this.userVocabulary.filter(v => v.lessonId == this.selectedLessonId);
        const allTerms = lesson ? [...lesson.terms, ...added] : [];
        app.innerHTML = this.getHeader() + `<div id="view">${this.getView(lesson, allTerms)}</div>`;
        
        if (this.showUserInfoModal) {
            const modalDiv = document.createElement('div');
            modalDiv.className = 'modal-overlay';
            modalDiv.onclick = (e) => { if (e.target === modalDiv) this.closeUserInfoModal(); };
            modalDiv.innerHTML = `
                <div class="modal-content" style="max-width:400px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                        <h3 style="margin:0;">📋 ${this.t('معلومات المستخدم', 'User Information')}</h3>
                        <span onclick="appInstance.closeUserInfoModal()" style="cursor:pointer; font-size:1.5rem;">&times;</span>
                    </div>
                    <div class="info-row"><span>${this.t('الاسم:', 'Name:')}</span> <span><strong>${this.userProfile.name || this.userData?.name || ''}</strong></span></div>
                    <div class="info-row"><span>${this.t('العمر:', 'Age:')}</span> <span><strong>${this.userProfile.age || this.t('غير محدد', 'Not set')}</strong></span></div>
                    <div class="info-row"><span>${this.t('تاريخ الانضمام:', 'Join Date:')}</span> <span><strong>${this.userProfile.joinDate}</strong></span></div>
                    <div class="info-row"><span>${this.t('مستوى اللغة:', 'Language Level:')}</span> <span><strong>${this.getEnglishLevel()}</strong></span></div>
                    <div class="info-row"><span>${this.t('البريد الإلكتروني:', 'Email:')}</span> <span><strong>${this.userData?.email || ''}</strong> ${this.currentUser?.emailVerified ? '✅' : '⚠️'}</span></div>
                    <div class="info-row"><span>${this.t('نقاط الخبرة (XP):', 'XP:')}</span> <span><strong>${this.userStats.xp}</strong></span></div>
                    <div class="info-row"><span>${this.t('اللآلئ:', 'Pearls:')}</span> <span><strong>${this.userCoins} 💎</strong></span></div>
                    <div style="margin:15px 0; display:flex; flex-direction:column; gap:10px;">
                        <button class="hero-btn" data-action="changeUserPassword" style="background:#f59e0b;">🔑 ${this.t('تغيير كلمة السر', 'Change Password')}</button>
                        <button class="hero-btn" data-action="verifyEmail" style="background:#10b981;">📧 ${this.t('تأكيد البريد الإلكتروني', 'Verify Email')}</button>
                        <button class="hero-btn" data-action="updateEmail" style="background:#3b82f6;">✉️ ${this.t('تغيير البريد الإلكتروني', 'Change Email')}</button>
                    </div>
                    <button class="hero-btn" onclick="appInstance.closeUserInfoModal()" style="background:#64748b;">${this.t('إغلاق', 'Close')}</button>
                </div>
            `;
            app.appendChild(modalDiv);
        }
        
        if (this.showCoinModal) {
            const modalDiv = document.createElement('div');
            modalDiv.className = 'modal-overlay';
            modalDiv.onclick = (e) => { if (e.target === modalDiv) this.toggleCoinModal(); };
            let modalContent = '';
            if (this.showPurchaseForm) {
                modalContent = `<div class="modal-content"><div class="modal-header" style="display:flex; justify-content:space-between; margin-bottom:15px;"><h3 style="margin:0;">💰 ${this.t('طلب شراء 300 لؤلؤة', 'Request 300 Pearls')}</h3><span class="close-btn" onclick="appInstance.toggleCoinModal()" style="cursor:pointer; font-size:1.5rem;">&times;</span></div><p style="text-align:center; margin-bottom:15px;">${this.t('مقابل 1 دولار أمريكي', 'For 1 USD')}</p><div class="purchase-form"><input type="text" id="purchaseName" placeholder="${this.t('الاسم الكامل', 'Full Name')}" style="width:100%; padding:10px; margin:5px 0; border-radius:8px; border:1px solid #ddd;"><input type="email" id="purchaseEmail" placeholder="${this.t('البريد الإلكتروني', 'Email')}" style="width:100%; padding:10px; margin:5px 0; border-radius:8px; border:1px solid #ddd;"><input type="tel" id="purchasePhone" placeholder="${this.t('رقم الهاتف', 'Phone Number')}" style="width:100%; padding:10px; margin:5px 0; border-radius:8px; border:1px solid #ddd;"><button class="hero-btn" data-action="submitPurchase" style="background:#10b981; width:100%; margin-top:10px;">${this.t('إرسال الطلب', 'Submit Request')}</button></div></div>`;
            } else {
                const rewardInfo = this.getCurrentAdReward();
                const remainingText = rewardInfo ? `${rewardInfo.currentCount}/${rewardInfo.adsNeeded} ${this.t('لإعلانات هذا المستوى', 'ads for this level')}` : this.t('اكتمل', 'Completed');
                modalContent = `<div class="modal-content"><div class="modal-header" style="display:flex; justify-content:space-between; margin-bottom:15px;"><h3 style="margin:0;">💰 ${this.t('خيارات العملات', 'Currency Options')}</h3><span class="close-btn" onclick="appInstance.toggleCoinModal()" style="cursor:pointer; font-size:1.5rem;">&times;</span></div><div class="coin-option" onclick="appInstance.watchAdsForCoins()"><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:1rem;">👁️ ${this.t('مشاهدة إعلانات', 'Watch Ads')}</span><span style="background:#ffd700; padding:4px 8px; border-radius:20px;">${rewardInfo ? rewardInfo.reward : 0}+</span></div><div style="font-size:0.7rem; color:#666;">${remainingText}</div></div><div class="coin-option" onclick="appInstance.requestPurchase()"><div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:1rem;">💳 ${this.t('شراء 300 لؤلؤة', 'Buy 300 Pearls')}</span><span style="background:#ffd700; padding:4px 8px; border-radius:20px;">1$</span></div></div></div>`;
            }
            modalDiv.innerHTML = modalContent; app.appendChild(modalDiv);
        }
    }

    getHeader() {
        if (this.currentPage === 'auth') return '';
        let nav = '';
        if (this.selectedLessonId && ['reading', 'flashcards', 'quiz', 'jumble', 'listening', 'spelling', 'gapfill'].includes(this.currentPage) && !this.isUnlockTest) {
            nav = `<div class="nav-menu"><button class="nav-btn ${this.currentPage === 'reading' ? 'active' : ''}" data-action="setPage" data-param="reading">${this.t('📖 النص', '📖 Text')}</button><button class="nav-btn ${this.currentPage === 'flashcards' ? 'active' : ''}" data-action="setPage" data-param="flashcards">${this.t('🎴 بطاقات', '🎴 Flashcards')}</button><button class="nav-btn ${this.currentPage === 'quiz' ? 'active' : ''}" data-action="setPage" data-param="quiz">${this.t('🧩 اختبار', '🧩 Quiz')}</button><button class="nav-btn ${this.currentPage === 'jumble' ? 'active' : ''}" data-action="setPage" data-param="jumble">${this.t('🔤 ترتيب', '🔤 Jumble')}</button><button class="nav-btn ${this.currentPage === 'listening' ? 'active' : ''}" data-action="setPage" data-param="listening">${this.t('🎧 استماع', '🎧 Listening')}</button><button class="nav-btn ${this.currentPage === 'spelling' ? 'active' : ''}" data-action="setPage" data-param="spelling">${this.t('✍️ كتابة', '✍️ Spelling')}</button><button class="nav-btn ${this.currentPage === 'gapfill' ? 'active' : ''}" data-action="setPage" data-param="gapfill">${this.t('📝 ملء فراغ', '📝 Gap Fill')}</button></div>`;
        }
        return `<header class="header"><div class="header-content"><div class="logo-container" data-action="goHome"><img src="wordwise_logo.png" alt="WordWise"><h2>WordWise</h2></div><div class="header-buttons"><button class="header-btn lang-btn" data-action="toggleLang" title="${this.t('تغيير اللغة', 'Change Language')}">${this.lang === 'ar' ? 'EN' : 'عربي'}</button><button class="header-btn" data-action="toggleTheme" title="${this.t('الوضع الليلي', 'Dark Mode')}">${this.theme === 'light' ? '🌙' : '☀️'}</button><div class="coin-display" data-action="toggleCoinModal" title="${this.t('رصيد اللآلئ', 'Pearls Balance')}"><span>💎</span> ${this.userCoins}<span style="font-size:0.9rem;">➕</span></div><button class="header-btn" data-action="goToProfile" title="${this.t('الملف الشخصي', 'Profile')}">👤</button></div></div>${nav}</header>`;
    }

    getView(lesson, allTerms) {
        if (this.currentPage === 'auth') {
            return `<main class="main-content"><div class="auth-container"><img src="wordwise_logo.png" alt="WordWise"><h1>WordWise</h1><p>${this.t('كن حكيماً في اختيار كلماتك', 'Be wise in choosing your words')}</p></div><div class="reading-card auth-card"><div class="auth-tabs"><div class="auth-tab ${this.authMode === 'login' ? 'active' : ''}" data-action="switchAuthMode" data-param="login">${this.t('تسجيل الدخول', 'Login')}</div><div class="auth-tab ${this.authMode === 'signup' ? 'active' : ''}" data-action="switchAuthMode" data-param="signup">${this.t('إنشاء حساب', 'Sign Up')}</div></div>${this.authMode === 'login' ? `<input id="loginEmail" placeholder="${this.t('البريد الإلكتروني', 'Email')}" class="auth-input"><input type="password" id="loginPass" placeholder="${this.t('كلمة المرور', 'Password')}" class="auth-input"><button class="hero-btn" data-action="doLogin" style="width:100%;">${this.t('تسجيل الدخول', 'Login')}</button>` : `<input id="signupName" placeholder="${this.t('الاسم الكامل', 'Full Name')}" class="auth-input"><input id="signupEmail" placeholder="${this.t('البريد الإلكتروني', 'Email')}" class="auth-input"><input type="password" id="signupPass" placeholder="${this.t('كلمة المرور', 'Password')}" class="auth-input"><input type="password" id="signupConfirmPass" placeholder="${this.t('تأكيد كلمة المرور', 'Confirm Password')}" class="auth-input"><input id="signupAge" placeholder="${this.t('العمر (اختياري)', 'Age (Optional)')}" class="auth-input"><button class="hero-btn" data-action="doSignup" style="width:100%;">${this.t('إنشاء حساب', 'Sign Up')}</button>`}<p style="margin-top:12px; font-size:0.75rem; color:#666; text-align:center;">${this.t('جميع بياناتك محفوظة ومرتبطة بهذا البريد.', 'All your data is stored and linked to this email.')}</p></div></main>`;
        }
        
        if (this.currentPage === 'home') { 
            const progress = this.getCurrentLevelProgress(); 
            const totalMastered = this.masteredWords ? this.masteredWords.length : 0; 
            const totalLessons = this.unlockedLessons ? this.unlockedLessons.length : 0; 
            const xpProgress = `${progress.currentProgress}/${progress.neededForNext}`; 
            const xpPercent = (progress.currentProgress / progress.neededForNext) * 100; 
            return `<main class="main-content"><div class="reading-card welcome-banner"><div style="display: flex; justify-content: space-between; align-items: center; flex-wrap:wrap; gap:10px;"><h3 style="margin:0;">${this.t(`مرحباً، ${this.userData?.name || 'مستخدم'} 👋`, `Welcome, ${this.userData?.name || 'User'} 👋`)}</h3><div style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">⭐ ${this.t('مستوى', 'Level')} ${progress.level}</div></div><div style="margin-top: 15px;"><div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 6px;"><span>${this.t('نقاط الخبرة (XP)', 'Experience Points (XP)')}</span><span>${xpProgress}</span></div><div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${xpPercent}%;"></div></div></div>${this.getBadgesDisplay()}<div style="margin-top: 10px; font-size:0.85rem;">${this.t('التاج الحالي:', 'Current Crown:')} ${this.userStats.tier}</div><div style="margin-top: 4px; font-size:0.8rem;">${this.t('الدروس المفتوحة:', 'Unlocked Lessons:')} ${totalLessons} | ${this.t('الكلمات المتقنة:', 'Mastered Words:')} ${totalMastered}</div></div><button class="hero-btn" data-action="setPage" data-param="addLesson" style="width:100%; background:#8b5cf6; margin-top:12px;">📸 ${this.t('إضافة من الكاميرا أو الهاتف', 'Add from Camera or Phone')}</button><button class="hero-btn" data-action="setPage" data-param="level_test_instructions" style="width:100%; background:#ec4899; margin:12px 0;">🧠 ${this.t('اختبار مستوى متقدم', 'Advanced Level Test')}</button><div class="features-grid">${window.levels.map(l => `<div class="feature-card" data-action="selLevel" data-param="${l.id}"><h3 style="font-size:1rem;">${l.icon} ${this.lang === 'en' ? (l.id === 'beginner' ? 'Beginner' : l.id === 'intermediate' ? 'Intermediate' : 'Advanced') : l.name}</h3></div>`).join('')}${Object.keys(this.customLessons).length > 0 ? `<div class="feature-card" data-action="selLevel" data-param="custom_list" style="border:1px solid #f97316;"><h3 style="font-size:1rem;">📂 ${this.t('نصوصي', 'My Texts')}</h3></div>` : ''}</div><button data-action="logout" class="logout-btn">${this.t('تسجيل الخروج', 'Logout')}</button></main>`;
        }
        
        if (this.currentPage === 'level_test_instructions') {
            return `<main class="main-content">
                <button class="hero-btn" data-action="goHome" style="margin-bottom:15px; background:#64748b;">← ${this.t('رجوع', 'Back')}</button>
                <div class="reading-card">
                    <h2 style="text-align:center;">🧠 ${this.t('اختبار تحديد المستوى المتقدم', 'Advanced Level Test')}</h2>
                    <p style="margin:15px 0; line-height:1.6;">${this.t('هذا الاختبار يتكون من جزئين متكاملين، وسيتكيف مع مستواك تلقائياً:', 'This test consists of two integrated parts, and will automatically adapt to your level:')}</p>
                    <ul style="margin:10px 20px; line-height:1.8;">
                        <li><strong>🎧 ${this.t('الجزء الأول: اختبار الاستماع التكيفي', 'Part 1: Adaptive Listening Test')}</strong> - ${this.t('سيتم تشغيل تسجيلات قصيرة مرة واحدة فقط، ثم الإجابة على أسئلة. يبدأ من مستوى A1 ويتكيف مع إجاباتك.', 'Short recordings played once, then answer questions. Starts at A1 and adapts to your answers.')}</li>
                        <li><strong>📖 ${this.t('الجزء الثاني: اختبار القراءة والقواعد التكيفي', 'Part 2: Adaptive Reading & Grammar Test')}</strong> - ${this.t('أسئلة قراءة وقواعد. يبدأ من المستوى الذي وصلت إليه في الجزء الأول.', 'Reading and grammar questions. Starts from the level you reached in part one.')}</li>
                    </ul>
                    <p style="margin:15px 0; background:#fef3c7; padding:10px; border-radius:8px;">💡 ${this.t('نصيحة: تأكد من سماع التسجيل جيداً، لا يمكن إعادة تشغيل الصوت. الاختبار يتكيف مع إجاباتك، لذا حاول قدر الإمكان.', 'Tip: Listen carefully, audio cannot be replayed. The test adapts to your answers, so do your best.')}</p>
                    <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:20px;">
                        <button class="hero-btn" data-action="test_sample_audio" style="background:#f59e0b; flex:1;">🔊 ${this.t('اختبار عينة صوتية', 'Sample Audio Test')}</button>
                        <button class="hero-btn" data-action="start_listening_test" style="background:#8b5cf6; flex:1;">🎧 ${this.t('بدء الاختبار المتكامل', 'Start Integrated Test')}</button>
                    </div>
                    <p style="margin-top:15px; font-size:0.75rem; color:#666; text-align:center;">${this.t('سيتم عرض نتيجة موحدة في النهاية مع تحليل نقاط القوة والضعف.', 'A unified result with strengths and weaknesses analysis will be shown at the end.')}</p>
                </div>
            </main>`;
        }
        
        if (this.currentPage === 'adaptive_listening_test') {
            if (!this.adaptiveListeningActive) {
                return `<div class="reading-card"><p>${this.t('جاري الانتقال إلى اختبار القراءة...', 'Moving to reading test...')}</p></div>`;
            }
            const question = this.getCurrentListeningQuestion();
            if (!question) {
                return `<div class="reading-card"><p>${this.t('جاري تحميل السؤال التالي...', 'Loading next question...')}</p></div>`;
            }
            const opts = [...question.options].sort(() => 0.5 - Math.random());
            const correctAnswer = question.correct;
            const totalSoFar = this.adaptiveListeningHistory.length;
            const questionId = question.id;
            const audioSrc = question.audio;
            const hasPlayed = this.adaptiveListeningAudioPlayed[questionId] || false;
            
            return `<div class="reading-card">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; flex-wrap:wrap; gap:8px;">
                    <span style="background:#e2e8f0; color:#475569; padding:4px 12px; border-radius:20px; font-weight:bold; font-size:0.8rem;">
                        ${this.t('السؤال', 'Question')} ${totalSoFar + 1} - ${this.t('استماع', 'Listening')}
                    </span>
                </div>
                <div style="text-align:center; margin:20px 0;">
                    <button id="playAudioBtn_${questionId}" class="hero-btn" data-action="playListeningAudio" data-audio="${audioSrc}" data-id="${questionId}" style="background:#6366f1; font-size:1.5rem; padding:10px 20px; ${hasPlayed ? 'opacity:0.5;' : ''}" ${hasPlayed ? 'disabled' : ''}>
                        🔊
                    </button>
                </div>
                <h3 style="margin-bottom:20px; direction:ltr; text-align:center; font-size:1.1rem;">${question.text}</h3>
                <div class="quiz-options" id="listeningOptions">
                    ${opts.map(opt => `<button class="quiz-opt-btn listening-opt-btn" data-action="adaptiveListeningAnswer" data-param="${opt}" data-correct="${correctAnswer}">${opt}</button>`).join('')}
                </div>
                ${this.adaptiveListeningLastAnswer ? `
                    <div class="spelling-feedback ${this.adaptiveListeningLastAnswer.isCorrect ? 'correct-feedback' : 'wrong-feedback'}" style="text-align:center; margin:12px 0;">
                        ${this.adaptiveListeningLastAnswer.isCorrect ? this.t('✅ إجابة صحيحة!', '✅ Correct answer!') : this.t('❌ إجابة خاطئة!', '❌ Wrong answer!')}
                    </div>
                    <button class="hero-btn" data-action="showListeningTranscript" style="background:#f59e0b; width:100%; margin:8px 0;">📝 ${this.t('عرض النص المكتوب', 'Show Transcript')}</button>
                    ${this.adaptiveListeningLastAnswer.showTranscript ? `<div style="margin:10px 0; padding:12px; background:#f1f5f9; border-radius:8px; direction:ltr; text-align:left; font-size:0.85rem;">${this.adaptiveListeningLastAnswer.transcript}</div>` : ''}
                    <button class="hero-btn" data-action="nextAdaptiveListeningQuestion" style="background:#3b82f6; width:100%;">➡️ ${this.t('التالي', 'Next')}</button>
                ` : ''}
            </div>`;
        }
        
        if (this.currentPage === 'adaptive_test') {
            if (!this.adaptiveTestActive) {
                return this.showAdaptiveResult();
            }
            const question = this.getCurrentAdaptiveQuestion();
            if (!question) {
                return `<div class="reading-card"><p>${this.t('جاري تحميل السؤال التالي...', 'Loading next question...')}</p></div>`;
            }
            const opts = [...question.options].sort(() => 0.5 - Math.random());
            const correctAnswer = question.correct;
            const totalSoFar = this.adaptiveTestHistory.length;
        
            return `<div class="reading-card">
                <div style="display:flex; justify-content:flex-end; margin-bottom:15px; flex-wrap:wrap; gap:8px;">
                    <span style="background:#e2e8f0; color:#475569; padding:4px 12px; border-radius:20px; font-weight:bold; font-size:0.8rem;">
                        ${this.t('السؤال', 'Question')} ${totalSoFar + 1}
                    </span>
                </div>
                <h2 style="margin-bottom:25px; direction:ltr; text-align:left; line-height:1.4; font-size:1.2rem;">${question.q}</h2>
                <div class="quiz-options">
                    ${opts.map(opt => `<button class="quiz-opt-btn" data-action="adaptiveAnswer" data-param="${opt}" data-correct="${correctAnswer}">${opt}</button>`).join('')}
                </div>
            </div>`;
        }
        
        if (this.currentPage === 'adaptive_test_result') {
            return this.showAdaptiveResult();
        }
        
        if (this.currentPage === 'profile') { 
            const englishLevel = this.getEnglishLevel(); 
            const totalLessons = this.unlockedLessons.length; 
            const totalMastered = this.masteredWords.length; 
            const progressPercent = (totalLessons / 100) * 100; 
            return `<main class="main-content"><button class="hero-btn" data-action="goHome" style="margin-bottom:15px; background:#64748b;">← ${this.t('رجوع', 'Back')}</button><div class="reading-card profile-container"><div class="profile-image" onclick="document.getElementById('profileImage').click()">${this.userProfile.image ? `<img src="${this.userProfile.image}" alt="profile">` : `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="#aaa"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`}</div><input type="file" id="profileImage" accept="image/*" style="display:none;" onchange="appInstance.updateProfile()"><div class="profile-info"><div class="info-row"><span>${this.t('الاسم:', 'Name:')}</span> <span><input type="text" id="profileName" value="${this.userProfile.name || this.userData?.name || ''}" placeholder="${this.t('الاسم', 'Name')}"></span></div><div class="info-row"><span>${this.t('العمر:', 'Age:')}</span> <span><input type="number" id="profileAge" value="${this.userProfile.age || ''}" placeholder="${this.t('العمر', 'Age')}"></span></div><div class="info-row"><span>${this.t('تاريخ الانضمام:', 'Join Date:')}</span> <span>${this.userProfile.joinDate}</span></div><div class="info-row"><span>${this.t('مستوى اللغة:', 'Language Level:')}</span> <span>${englishLevel}</span></div><div class="info-row"><span>${this.t('نقاط الخبرة (XP):', 'XP:')}</span> <span>${this.userStats.xp}</span></div><div class="info-row"><span>${this.t('اللآلئ:', 'Pearls:')}</span> <span>${this.userCoins} 💎</span></div></div><button class="hero-btn user-info-btn" data-action="showUserInfo" style="background:#8b5cf6;">📋 ${this.t('إعدادات الحساب', 'Account Settings')}</button><div style="width:100%; margin:12px 0;"><div style="display:flex; justify-content:space-between; font-size:0.85rem;"><span>${this.t('التقدم العام', 'Overall Progress')}</span><span>${totalLessons} ${this.t('درس', 'Lesson')} / 100</span></div><div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${progressPercent}%;"></div></div></div><h4 style="margin:15px 0 8px;">🏅 ${this.t('الأوسمة والإنجازات', 'Badges & Achievements')}</h4>${this.getBadgesDisplay()}<h4 style="margin:15px 0 8px;">📜 ${this.t('سجل الاختبارات', 'Test History')}</h4><button class="hero-btn" data-action="setPage" data-param="test_history" style="background:#3b82f6;">${this.t('عرض سجل الاختبارات', 'View Test History')}</button><button class="hero-btn" data-action="updateProfile" style="background:#10b981; margin-top:15px;">${this.t('حفظ التغييرات', 'Save Changes')}</button></div></main>`;
        }
        
        if (this.currentPage === 'test_history') return `<main class="main-content"><button class="hero-btn" data-action="goHome" style="margin-bottom:15px; background:#64748b;">← ${this.t('الرجوع للرئيسية', 'Back to Home')}</button><button class="hero-btn" data-action="syncTestHistory" style="margin-bottom:15px; background:#f59e0b;">🔄 ${this.t('استعادة الاختبارات', 'Restore Tests')}</button><div class="reading-card"><h2 style="text-align:center;">📋 ${this.t('سجل اختبارات المستوى', 'Level Test History')}</h2>${this.placementResults.length === 0 ? `<p style="text-align:center; color:#666; padding:20px;">${this.t('لا توجد اختبارات سابقة', 'No previous tests')}</p>` : `<div class="history-list">${this.placementResults.map((r, idx) => `<div class="history-item" onclick="appInstance.viewTestDetails(${idx})"><div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:5px;"><span><strong>${r.date}</strong></span><span>${this.t('المستوى:', 'Level:')} ${r.displayLevel || r.level}</span></div><div style="display:flex; justify-content:space-between; margin-top:5px; flex-wrap:wrap; gap:5px;"><span>${this.t('الدرجة:', 'Score:')} ${r.totalScore || r.score}/${r.totalQuestions}</span><span>IELTS: ${r.ielts}</span></div><button class="hero-btn" data-action="deletePlacementTest" data-index="${idx}" style="margin-top:5px; background:#ef4444; padding:4px 8px; font-size:0.7rem;">🗑️ ${this.t('حذف', 'Delete')}</button></div>`).join('')}</div>`}</div></main>`;
        
        if (this.currentPage === 'placement_details' && this.viewingPlacementDetails) { 
            const details = this.viewingPlacementDetails.details || []; 
            return `<div class="reading-card"><button class="hero-btn" data-action="backFromDetails" style="margin-bottom:15px; background:#64748b;">← ${this.t('رجوع', 'Back')}</button><h2 style="text-align:center;">${this.t('تفاصيل اختبار', 'Test Details')} ${this.viewingPlacementDetails.date}</h2><p style="text-align:center;">${this.t('المستوى النهائي:', 'Final Level:')} <strong>${this.viewingPlacementDetails.displayLevel || this.viewingPlacementDetails.level}</strong> | ${this.t('الدرجة:', 'Score:')} ${this.viewingPlacementDetails.totalScore || this.viewingPlacementDetails.score}/${this.viewingPlacementDetails.totalQuestions}</p><div style="max-height:350px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">${details.map((d, i) => `<div style="border-bottom:1px solid #e2e8f0; padding:8px; margin-bottom:5px;"><p><strong>${this.t('س', 'Q')}${i + 1}:</strong> ${d.question}</p><p>${this.t('مستوى السؤال:', 'Question level:')} ${d.level || this.t('غير محدد', 'Not specified')}</p><p>${this.t('إجابتك:', 'Your answer:')} ${d.selected || this.t('لم يجب', 'Not answered')} - ${d.isCorrect ? '✅' : '❌'}</p><p>${this.t('الإجابة الصحيحة:', 'Correct answer:')} ${d.correct || this.t('غير معروفة', 'Unknown')}</p></div>`).join('')}</div></div>`; 
        }
        
        if (this.currentPage === 'lessons') { const list = this.getLessonsForCurrentLevel(); let testLevelParam = ''; if (this.selectedLevel === 'beginner') testLevelParam = 'beginner'; else if (this.selectedLevel === 'intermediate') testLevelParam = 'intermediate'; else if (this.selectedLevel === 'advanced') testLevelParam = 'advanced'; const addLessonButton = `<div class="feature-card" data-action="setPage" data-param="addLesson" style="border: 2px dashed #10b981; background: linear-gradient(135deg, #e0f2e9, #d1fae5);"><h3 style="font-size:0.95rem;">📝 ${this.t('إضافة درس يدوي', 'Add Manual Lesson')}</h3><p style="font-size:0.7rem; margin-top:4px;">${this.t('أضف درساً خاصاً بك', 'Add your own lesson')}</p></div>`; return `<main class="main-content"><button class="hero-btn" data-action="goHome" style="margin-bottom:15px; background:#64748b;">← ${this.t('رجوع', 'Back')}</button>${testLevelParam ? `<div style="margin-bottom:15px; text-align:center;"><button class="hero-btn" data-action="startLevelTest" data-param="${testLevelParam}" style="background:#8b5cf6;">📊 ${this.t('اختبار المستوى الشامل', 'Comprehensive Level Test')}</button></div>` : ''}<div class="features-grid">${list.map(l => { const isOk = (list[0].id == l.id || this.unlockedLessons.includes(String(l.id))) && !l.isGenerated; const displayLock = (!isOk && !l.isGenerated) ? '🔒 ' : ''; return `<div class="feature-card" data-action="selLesson" data-param="${l.id}" style="${(!isOk && !l.isGenerated) ? 'opacity:0.6;' : ''}"><h3 style="font-size:0.9rem;">${displayLock}${l.title}</h3>${l.isGenerated ? `<div style="display:flex; justify-content:center; gap:8px; margin-top:8px; flex-wrap:wrap;"><button class="hero-btn" data-action="deleteGeneratedLesson" data-param="${l.id}" style="background:#ef4444; padding:4px 8px; font-size:0.65rem;">🗑️ ${this.t('حذف', 'Delete')}</button><button class="hero-btn" data-action="regenerateAILesson" data-param="${this.selectedLevel},${l.id}" style="background:#f59e0b; padding:4px 8px; font-size:0.65rem;">🔄 ${this.t('إعادة توليد', 'Regenerate')}</button></div>` : ''}</div>`; }).join('')}${addLessonButton}</div></main>`;
        }
        
        if (this.currentPage === 'unlock_choice') return `<div class="reading-card" style="text-align:center;"><h3>🔓 ${this.t('فتح الدرس', 'Unlock Lesson')}</h3><p style="margin:10px 0;">${this.t('اختر طريقة فتح الدرس:', 'Choose how to unlock the lesson:')}</p><div class="unlock-choice"><button class="hero-btn" data-action="unlockWithTest" data-param="${this.tempLessonToUnlock}" style="background:#3b82f6;">🧪 ${this.t('خوض الاختبار', 'Take Test')}</button><button class="hero-btn" data-action="unlockWithCoins" data-param="${this.tempLessonToUnlock}" style="background:#ffd700; color:#000;">💰 ${this.t('دفع 100 لؤلؤة', 'Pay 100 Pearls')} (${this.t('رصيدك:', 'Your balance:')} ${this.userCoins})</button></div><button class="hero-btn" data-action="goHome" style="margin-top:15px; background:#64748b;">${this.t('الرئيسية', 'Home')}</button></div>`;
        
        if (this.currentPage === 'custom_lessons_view') { const lessons = Object.values(this.customLessons); return `<main class="main-content"><button class="hero-btn" data-action="goHome" style="margin-bottom:15px; background:#64748b;">← ${this.t('العودة للرئيسية', 'Back to Home')}</button><h2 style="margin-bottom:15px; text-align:center; font-size:1.3rem;">📂 ${this.t('نصوصي الخاصة', 'My Custom Texts')}</h2>${lessons.length === 0 ? `<div class="reading-card" style="text-align:center; padding:25px; color:#666;">${this.t('لا توجد نصوص محفوظة. صوّر نصك الأول الآن!', 'No saved texts. Capture your first text now!')}</div>` : ''}<div style="display: flex; flex-direction: column; gap: 12px;">${lessons.map(l => `<div class="reading-card" style="border-right: 4px solid #6366f1;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap:wrap; gap:8px;"><h3 style="margin:0; color:#4f46e5; cursor:pointer; font-size:1rem;" data-action="selLesson" data-param="${l.id}">${l.title}</h3><div style="display: flex; gap: 10px;"><button onclick="appInstance.editLessonTitle('${l.id}')" style="background:none; border:none; cursor:pointer; font-size:1rem;">✏️</button><button onclick="appInstance.editLessonContent('${l.id}')" style="background:none; border:none; cursor:pointer; font-size:1rem;">📝</button><button onclick="appInstance.deleteCustomLesson('${l.id}')" style="background:none; border:none; cursor:pointer; font-size:1rem;">🗑️</button></div></div><p style="font-size:0.8rem; color:#555; margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; direction:ltr; text-align:left;">${l.content}</p><button class="hero-btn" data-action="selLesson" data-param="${l.id}" style="width:100%; padding:8px; font-size:0.85rem; background:#6366f1;">📖 ${this.t('فتح النص للدراسة', 'Open Text for Study')}</button></div>`).join('')}</div></main>`;
        }
        
        if (this.currentPage === 'reading') { 
            const audioSrc = lesson.audio || `audio/${lesson.id}.mp3`; 
            return `<main class="main-content"><div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;"><button class="hero-btn" data-action="backToLessons" style="background:#64748b; padding:6px 12px;">⬅ ${this.t('تراجع', 'Back')}</button><div style="display: flex; gap: 4px; background: #f0f0f0; padding: 4px; border-radius: 8px; flex-wrap: wrap;"><button class="hero-btn" data-action="playAudio" data-param="${audioSrc}" style="background:#3b82f6; padding:5px 8px; font-size:0.75rem;">▶️ ${this.t('تشغيل', 'Play')}</button><button class="hero-btn" data-action="pauseAudio" style="background:#f59e0b; padding:5px 8px; font-size:0.75rem;">⏸️ ${this.t('إيقاف مؤقت', 'Pause')}</button><button class="hero-btn" data-action="stopAudio" style="background:#ef4444; padding:5px 8px; font-size:0.75rem;">⏹️ ${this.t('إيقاف', 'Stop')}</button><button class="hero-btn" data-action="skipBack10" style="background:#8b5cf6; padding:5px 8px; font-size:0.75rem;">⏪ 10</button><button class="hero-btn" data-action="skipForward10" style="background:#8b5cf6; padding:5px 8px; font-size:0.75rem;">10 ⏩</button><button class="hero-btn" data-action="speedDown" style="background:#8b5cf6; padding:5px 8px; font-size:0.75rem;">🐢</button><span style="background:#fff; padding:3px 6px; border-radius:5px; font-size:0.7rem;">${this.audioPlaybackRate.toFixed(2)}x</span><button class="hero-btn" data-action="speedUp" style="background:#8b5cf6; padding:5px 8px; font-size:0.75rem;">🐇</button></div></div><div class="reading-card"><h2 style="font-size:1.2rem;">${lesson.title}</h2><div class="scrollable-text" style="margin-top:10px; font-size:0.9rem;">${lesson.content}</div></div><div class="reading-card" style="margin-top:15px; border:1px dashed #6366f1; background:#f0f7ff;"><h4 style="margin-bottom:8px;">${this.t('إضافة كلمة جديدة:', 'Add New Word:')}</h4><input id="newEng" placeholder="${this.t('اكتب بالإنجليزية هنا...', 'Write in English here...')}" style="width:100%; padding:8px; border-radius:8px; border:1px solid #ddd;" oninput="appInstance.translateAuto(this.value, 'newArb')"><input id="newArb" placeholder="${this.t('الترجمة تظهر هنا...', 'Translation will appear here...')}" style="width:100%; padding:8px; margin:8px 0; border-radius:8px; border:1px solid #ddd; background:#fff;"><button class="hero-btn" data-action="addNewWord" style="width:100%; background:#10b981; padding:8px;">✅ ${this.t('إضافة للقائمة', 'Add to List')}</button></div></main>`;
        }

        if (this.currentPage === 'flashcards') {
            let rawTerms = (allTerms && allTerms.length > 0) ? allTerms : (window.lessonsData || []);
            let termsToUse = rawTerms.map(word => {
                if (this.userModifiedWords && this.userModifiedWords[word.id]) {
                    return { ...word, ...this.userModifiedWords[word.id] };
                }
                return word;
            });

            let active;
            if (this.showAllCardsTemporary) {
                active = termsToUse.filter(t => !this.hiddenFromCards.includes(String(t.id)) && !this.repeatAllSessionMastered.includes(String(t.id)));
            } else {
                active = termsToUse.filter(t => !this.masteredWords.includes(String(t.id)) && !this.hiddenFromCards.includes(String(t.id)));
            }

            if (active.length === 0) {
                return `<div class="reading-card" style="text-align:center; padding:40px 20px;">
                            <h3>🎉 اكتملت المراجعة!</h3>
                            <button class="hero-btn" data-action="restartCards" data-param="all" style="background:#f59e0b; width:100%; margin:15px 0;">🔁 إعادة تكرار الكل</button>
                            <button class="hero-btn" data-action="goHome" style="background:#64748b; width:100%;">🏠 الرئيسية</button>
                        </div>`;
            }

            const t = active[this.currentCardIndex] || active[0];

            return `<main class="main-content">
                <div style="text-align: right; margin-bottom: 10px;">
                    <button onclick="appInstance.toggleEditMode('${t.id}')" style="background: #e2e8f0; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size:0.8rem;">✏️ تعديل الكلمة</button>
                </div>

                <div class="flashcard-container" onclick="this.querySelector('.flashcard').classList.toggle('flipped')">
                    <div class="flashcard">
                        <div class="flashcard-front"><h1>${t.english || ''}</h1></div>
                        <div class="flashcard-back"><h1>${t.arabic || ''}</h1></div>
                    </div>
                </div>

                <div id="editArea_${t.id}" style="display:none; margin-top:20px; background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #cbd5e1;">
                    <input type="text" id="editEng_${t.id}" value="${t.english || ''}" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd; text-align:center;">
                    <input type="text" id="editArb_${t.id}" value="${t.arabic || ''}" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd; text-align:center; direction:rtl;">
                    <button class="hero-btn" onclick="appInstance.saveCardEdit('${t.id}')" style="width:100%; background:#8b5cf6;">✅ حفظ التعديل</button>
                </div>

                <div class="card-controls-row" style="margin-top:20px;">
                    <button class="hero-btn" data-action="speak" data-param="${t.english}" style="background:#6366f1;">🔊</button>
                    <button class="hero-btn" data-action="masterWordFlash" data-param="${t.id}" style="background:#10b981;">✅</button>
                    <button class="hero-btn" data-action="deleteWord" data-param="${t.id}" style="background:#ef4444;">🗑️</button>
                </div>

                <button class="hero-btn" data-action="restartCards" data-param="remaining" style="width:100%; margin:12px 0; background:#f59e0b;">🔁 تكرار المتبقي</button>
                
                <div class="card-nav-row">
                    <button class="hero-btn" data-action="prevC" style="background:#64748b;">السابق</button>
                    <button class="hero-btn" data-action="nextC" data-total="${active.length}" style="background:#64748b;">التالي</button>
                </div>

                <div style="text-align:center; margin-top:15px; color:#666; font-size:0.9rem; font-weight:bold;">
                    ${this.currentCardIndex + 1} / ${active.length}
                </div>
            </main>`;
        }
        
        if (this.currentPage === 'quiz') { if (this.quizIndex >= this.quizQuestions.length) { const pass = (this.quizScore / this.quizQuestions.length) >= 0.75; if (this.isUnlockTest && pass) { this.unlockedLessons.push(String(this.tempLessonToUnlock)); this.userCoins += 20; this.saveUserData(); this.updateLevelAndBadges(); this.showCustomModal('success', '🎉', this.t(`لقد فتحت درساً جديداً وحصلت على 20 لؤلؤة!`, `You unlocked a new lesson and earned 20 pearls!`)); } this.saveUserData(); return `<div class="reading-card finish-box" style="text-align:center;"><h2>${pass ? this.t("نجحت! 🎉", "Passed! 🎉") : this.t("حاول مجدداً", "Try Again")}</h2><button class="hero-btn" data-action="backToLessons" style="margin-top:15px;">${this.t('متابعة', 'Continue')}</button></div>`; } const q = this.quizQuestions[this.quizIndex]; return `<div class="reading-card quiz-box"><div class="quiz-info" style="font-size:0.8rem; margin-bottom:12px; text-align:center;">${this.t('السؤال', 'Question')} ${this.quizIndex + 1}/${this.quizQuestions.length}</div><div class="quiz-question-row" style="display:flex; align-items:center; gap:10px; justify-content:center;"><h2 style="margin:0; font-size:1.2rem;">${q.english}</h2><button class="quiz-speak-btn" data-action="speak" data-param="${q.english}" style="background:none; border:none; font-size:1.3rem; cursor:pointer;">🔊</button></div><div class="quiz-options" style="margin-top:20px;">${this.quizOptions.map(opt => `<button class="quiz-opt-btn" data-action="ansQ" data-param="${opt}" data-correct="${q.arabic}">${opt}</button>`).join('')}</div></div>`; }
        
        if (this.currentPage === 'jumble') { if (!this.jumbleUnlocked[this.selectedLessonId]) return `<div class="reading-card" style="text-align: center;"><h3>🔤 ${this.t('ترتيب الجمل', 'Sentence Jumble')}</h3><p>${this.t('لفتح هذا التمرين تحتاج 50 💎 لؤلؤة (مرة واحدة فقط للدرس).', 'To unlock this exercise you need 50 💎 pearls (one-time per lesson).')}</p><p>${this.t('رصيدك الحالي:', 'Your balance:')} ${this.userCoins} 💎</p><button class="hero-btn" onclick="appInstance.unlockJumble('${this.selectedLessonId}')" style="background: #8b5cf6;">${this.t('فتح (50 💎)', 'Unlock (50 💎)')}</button></div>`; return `<div class="reading-card"><h3>🔤 ${this.t('رتب الكلمات لتكوين جملة صحيحة', 'Arrange the words to form a correct sentence')}</h3><div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 15px 0; padding: 10px; background: ${this.jumbleChecked ? (this.jumbleCorrect ? '#d1fae5' : '#fee2e2') : '#f1f5f9'}; border-radius: 8px; min-height: 55px;">${this.jumbleUserAnswer.map(word => `<span class="jumble-word-top" data-action="jumbleRemove" data-param="${word}" style="cursor: pointer; background: #3b82f6; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.9rem;">${word}</span>`).join('')}</div><div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 15px 0; padding: 10px; background: #e2e8f0; border-radius: 8px; min-height: 55px;">${this.jumbleWords.map(word => `<button class="hero-btn" data-action="jumbleSelect" data-param="${word}" style="padding: 5px 10px; background: #64748b; font-size: 0.85rem; ${this.jumbleChecked ? 'opacity:0.5; pointer-events:none;' : ''}">${word}</button>`).join('')}</div><div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;"><button class="hero-btn" data-action="jumbleReset" style="background:#f59e0b; padding:6px 12px;">🔄 ${this.t('إعادة', 'Reset')}</button><button class="hero-btn" data-action="jumbleCheck" style="background:#10b981; padding:6px 12px;" ${this.jumbleChecked ? 'disabled' : ''}>✅ ${this.t('تحقق', 'Check')}</button><button class="hero-btn" data-action="jumbleHint" style="background:#3b82f6; padding:6px 12px;" ${this.jumbleChecked || this.jumbleHintUsedCount >= 3 ? 'disabled' : ''}>💡 ${this.t('تلميح', 'Hint')} (${this.jumbleHintUsedCount}/3)</button>${this.jumbleChecked ? `<button class="hero-btn" data-action="jumbleNext" style="background:#3b82f6; padding:6px 12px;">➡️ ${this.t('التالي', 'Next')}</button>` : ''}</div>${this.jumbleArabicHint ? `<div style="margin-top: 12px; padding: 8px; background: #e0f2fe; border-radius: 8px; text-align: center; font-size: 0.85rem;">🔍 ${this.t('الترجمة:', 'Translation:')} ${this.jumbleArabicHint}</div>` : ''}</div>`; }
        
        if (this.currentPage === 'listening') { if (!this.listeningUnlocked[this.selectedLessonId]) return `<div class="reading-card" style="text-align: center;"><h3>🎧 ${this.t('اختبار الاستماع', 'Listening Test')}</h3><p>${this.t('لفتح هذا الاختبار تحتاج 50 💎 لؤلؤة (مرة واحدة فقط للدرس).', 'To unlock this test you need 50 💎 pearls (one-time per lesson).')}</p><p>${this.t('رصيدك الحالي:', 'Your balance:')} ${this.userCoins} 💎</p><button class="hero-btn" onclick="appInstance.unlockListening('${this.selectedLessonId}')" style="background: #8b5cf6;">${this.t('فتح (50 💎)', 'Unlock (50 💎)')}</button></div>`; if (!this.listeningCurrent) { this.prepareListeningQuiz(); return `<div class="reading-card"><p>${this.t('جاري تحضير التمرين...', 'Preparing exercise...')}</p></div>`; } return `<div class="reading-card"><h3>🎧 ${this.t('استمع واختر الكلمة الصحيحة', 'Listen and choose the correct word')}</h3><div style="text-align: center; margin: 20px 0;"><button class="hero-btn" data-action="speak" data-param="${this.listeningCurrent.english}" style="font-size: 1.3rem; padding: 12px; background: #6366f1;">🔊 ${this.t('استمع مرة أخرى', 'Listen Again')}</button></div><div class="quiz-options">${this.listeningOptions.map(opt => `<button class="quiz-opt-btn listening-opt-btn" data-action="normalListeningAnswer" data-param="${opt}">${opt}</button>`).join('')}</div></div>`; }
        
        if (this.currentPage === 'spelling') { if (!this.spellingUnlocked[this.selectedLessonId]) return `<div class="reading-card" style="text-align: center;"><h3>✍️ ${this.t('تمرين الكتابة', 'Spelling Exercise')}</h3><p>${this.t('لفتح هذا التمرين تحتاج 50 💎 لؤلؤة (مرة واحدة فقط للدرس).', 'To unlock this exercise you need 50 💎 pearls (one-time per lesson).')}</p><p>${this.t('رصيدك الحالي:', 'Your balance:')} ${this.userCoins} 💎</p><button class="hero-btn" onclick="appInstance.unlockSpelling('${this.selectedLessonId}')" style="background: #8b5cf6;">${this.t('فتح (50 💎)', 'Unlock (50 💎)')}</button></div>`; if (!this.spellingCurrent) { this.prepareSpelling(); return `<div class="reading-card"><p>${this.t('جاري تحضير التمرين...', 'Preparing exercise...')}</p></div>`; } return `<div class="reading-card spelling-card"><h3>✍️ ${this.t('اكتب الكلمة بالانجليزية', 'Write the word in English')}</h3><div style="font-size:1.3rem; text-align:center; margin:15px 0; padding:12px; background:#f0f7ff; border-radius:12px;">${this.spellingCurrent.arabic}</div><input type="text" id="spellingInput" class="spelling-input" placeholder="${this.t('اكتب الكلمة هنا...', 'Write the word here...')}" value="${this.spellingUserAnswer}" ${this.spellingAnswered ? 'disabled' : ''} style="padding:10px; font-size:1rem;">${this.spellingResult ? `<div class="spelling-feedback ${this.spellingResult === 'correct' ? 'correct-feedback' : 'wrong-feedback'}" style="text-align:center; margin:10px 0;">${this.spellingResult === 'correct' ? this.t('✅ إجابة صحيحة!', '✅ Correct answer!') : this.t('❌ إجابة خاطئة!', '❌ Wrong answer!')}</div>` : ''}<div style="display:flex; gap:8px; justify-content:center;"><button class="hero-btn" data-action="spellingCheck" style="background:#10b981;" ${this.spellingAnswered ? 'disabled' : ''}>✅ ${this.t('تحقق', 'Check')}</button>${this.spellingAnswered ? `<button class="hero-btn" data-action="spellingNext" style="background:#3b82f6;">➡️ ${this.t('التالي', 'Next')}</button>` : ''}</div></div>`; }
        
        if (this.currentPage === 'level_test') { if (!this.levelTestCurrentQuestion) return `<div class="reading-card"><p>${this.t('جاري تحضير الاختبار...', 'Preparing test...')}</p></div>`; const q = this.levelTestCurrentQuestion; const options = this.levelTestCurrentOptions || []; return `<div class="reading-card"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:8px;"><span style="background:#e2e8f0; color:#475569; padding:3px 10px; border-radius:20px; font-weight:bold; font-size:0.75rem;">${this.t('السؤال', 'Question')} ${this.levelTestQuestionsAnswered + 1} / ${this.levelTestMaxQuestions}</span><button class="hero-btn" data-action="finishLevelTest" style="background:#ef4444; padding:3px 10px; font-size:0.75rem;">⏹️ ${this.t('إنهاء الاختبار', 'Finish Test')}</button></div><div class="quiz-question-row" style="display:flex; align-items:center; gap:8px; justify-content:center;"><h2 style="margin:0; font-size:1.1rem;">${q.english}</h2><button class="quiz-speak-btn" data-action="speak" data-param="${q.english}" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">🔊</button></div><div class="quiz-options" style="margin-top:20px;">${options.map(opt => `<button class="quiz-opt-btn" data-action="levelTestAns" data-param="${opt}" data-correct="${q.arabic}">${opt}</button>`).join('')}</div></div>`; }
        
        if (this.currentPage === 'level_test_result') return `<div class="reading-card"><h2 style="text-align:center;">🏁 ${this.t('نتيجة الاختبار الشامل', 'Comprehensive Test Result')}</h2><div style="background:#f0f7ff; padding:12px; border-radius:10px; margin:15px 0; text-align:center;"><p style="font-size:0.95rem;">${this.levelTestResultMessage}</p></div><button class="hero-btn" data-action="goHome" style="background:#64748b;">${this.t('العودة للرئيسية', 'Back to Home')}</button></div>`;
        
        if (this.currentPage === 'addLesson') return `<main class="main-content" style="height:85vh; display:flex; flex-direction:column; gap:10px;"><button class="hero-btn" data-action="goHome" style="background:#64748b; flex-shrink:0;">← ${this.t('رجوع للرئيسية', 'Back to Home')}</button><div class="reading-card" style="flex-grow:1; display:flex; flex-direction:column; gap:10px; overflow:hidden;"><h3 style="flex-shrink:0;">📸 ${this.t('إضافة نص ذكي', 'Add Smart Text')}</h3><div style="background:#f8fafc; padding:8px; border-radius:8px; border:1px dashed #6366f1; flex-shrink:0;"><input type="file" id="fileInput" accept="image/*" onchange="appInstance.processOCR(this)" style="width:100%;"></div><input id="newLessonTitle" placeholder="${this.t('عنوان النص', 'Text Title')}" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:8px; flex-shrink:0;"><textarea id="ocrText" placeholder="${this.t('النص سيظهر هنا...', 'Text will appear here...')}" style="width:100%; flex-grow:1; padding:8px; border:1px solid #ddd; border-radius:8px; font-size:0.85rem; line-height:1.4; resize:none;"></textarea><button class="hero-btn" onclick="appInstance.saveNewCustomLesson()" style="width:100%; background:#10b981; padding:10px; font-size:0.9rem; flex-shrink:0;">💾 ${this.t('حفظ النص', 'Save Text')}</button></div></main>`;
        
        if (this.currentPage === 'gapfill') { if (!this.gapFillUnlocked[this.selectedLessonId]) return `<div class="reading-card" style="text-align: center;"><h3>📝 ${this.t('ملء الفراغ', 'Gap Fill')}</h3><p>${this.t('لفتح هذا التمرين تحتاج 75 💎 لؤلؤة (مرة واحدة فقط للدرس).', 'To unlock this exercise you need 75 💎 pearls (one-time per lesson).')}</p><p>${this.t('رصيدك الحالي:', 'Your balance:')} ${this.userCoins} 💎</p><button class="hero-btn" onclick="appInstance.unlockGapFill('${this.selectedLessonId}')" style="background: #8b5cf6;">${this.t('فتح (75 💎)', 'Unlock (75 💎)')}</button></div>`; if (!this.gapFillCurrentQuestion) { this.prepareGapFill(); return `<div class="reading-card"><p>${this.t('جاري تحضير السؤال...', 'Preparing question...')}</p></div>`; } const q = this.gapFillCurrentQuestion; return `<div class="reading-card"><h3>📝 ${this.t('اختر الكلمة المناسبة لملء الفراغ', 'Choose the correct word to fill the blank')}</h3><div class="gapfill-sentence" style="font-size:1.1rem; margin:20px 0; padding:15px; background:${this.theme === 'dark' ? '#2d2d2d' : '#f8fafc'}; border-radius:12px;">${q.text}</div><div class="quiz-options">${this.gapFillOptions.map(opt => `<button class="quiz-opt-btn gapfill-opt-btn" data-action="gapfillAnswer" data-english="${opt}">${opt}</button>`).join('')}</div>${this.gapFillResult !== null ? `<div class="spelling-feedback ${this.gapFillResult === 'correct' ? 'correct-feedback' : 'wrong-feedback'}" style="text-align:center; margin:12px 0;">${this.gapFillResult === 'correct' ? this.t('✅ إجابة صحيحة!', '✅ Correct answer!') : this.t('❌ إجابة خاطئة!', '❌ Wrong answer!')}</div><div style="display:flex; justify-content:center; gap:8px; margin:8px 0;"><button class="hero-btn" data-action="gapfillShowExplanation" style="background:#6366f1;">💡 ${this.t('شرح مفصل', 'Detailed Explanation')}</button></div>${this.gapFillExplanationVisible ? `<div class="gapfill-explanation" style="margin:12px 0; padding:10px; background:${this.theme === 'dark' ? '#2d2d2d' : '#eef2ff'}; border-radius:8px; font-size:0.8rem; max-height:300px; overflow-y:auto;"><div style="font-weight:bold; margin-bottom:5px;">📖 ${this.t('معنى الجملة:', 'Full sentence:')}</div><div>${q.originalSentence || q.text.replace('______', q.correct)}</div><div style="font-weight:bold; margin:8px 0 4px;">🌐 ${this.t('الترجمة:', 'Translation:')}</div><div>${q.originalSentenceArabic || this.t('جاري التحميل...', 'Loading...')}</div><div style="font-weight:bold; margin:8px 0 4px;">📚 ${this.t('معاني الخيارات:', 'Meanings:')}</div><div style="display:flex; flex-direction:column; gap:3px;">${this.gapFillOptionsMeanings.map(opt => `<div>• <strong>${opt.english}</strong> : ${opt.arabic}</div>`).join('')}</div><div style="margin-top:6px; font-weight:bold;">✅ ${this.t('الإجابة الصحيحة:', 'Correct answer:')} ${q.correct} (${q.arabic})</div></div>` : ''}<div class="gapfill-controls"><button class="hero-btn" data-action="gapfillNext" style="background:#3b82f6;">➡️ ${this.t('التالي', 'Next')}</button></div>` : ''}</div>`; }
        
        return `<div style="text-align:center; padding:40px;">${this.t('جاري التحميل...', 'Loading...')}</div>`;         
    }

    toggleTheme() { this.theme = this.theme === 'light' ? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', this.theme); localStorage.setItem('theme', this.theme); this.render(); }
    resetPlacement() { this.placementTestActive = false; this.currentPage = 'home'; this.render(); }
    
    async processOCR(input) { 
        const file = input.files[0]; 
        if (!file) return; 
        const textArea = document.getElementById('ocrText'); 
        if (!textArea) return; 
        textArea.value = this.t("⏳ جاري استخراج النص... انتظر قليلاً", "⏳ Extracting text... Please wait"); 
        try { 
            const worker = await Tesseract.createWorker('eng'); 
            const ret = await worker.recognize(file); 
            textArea.value = ret.data.text; 
            await worker.terminate(); 
        } catch (e) { 
            textArea.value = this.t("❌ خطأ في المعالجة، حاول مرة أخرى", "❌ Processing error, please try again"); 
            console.error(e); 
        } 
    }
    
    saveNewCustomLesson() { 
        const titleInput = document.getElementById('newLessonTitle'); 
        const contentInput = document.getElementById('ocrText'); 
        if (!titleInput || !contentInput) return; 
        const title = titleInput.value.trim() || (this.t("نص مخصص ", "Custom text ") + new Date().toLocaleDateString()); 
        const content = contentInput.value.trim(); 
        if (content) { 
            const id = 'c' + Date.now(); 
            const newL = { id, title, content, terms: [] }; 
            this.customLessons[id] = newL; 
            window.lessonsData[id] = newL; 
            this.saveUserData(); 
            titleInput.value = ''; 
            contentInput.value = ''; 
            this.currentPage = 'custom_lessons_view'; 
            this.render(); 
        } 
    }
    
    editLessonTitle(id) { 
        const newTitle = prompt(this.t("العنوان الجديد:", "New title:"), this.customLessons[id].title); 
        if (newTitle && newTitle.trim()) { 
            this.customLessons[id].title = newTitle.trim(); 
            if (window.lessonsData[id]) window.lessonsData[id].title = newTitle.trim(); 
            this.saveUserData(); 
            this.render(); 
        } 
    }
    
    editLessonContent(id) { 
        const newC = prompt(this.t("تعديل نص الموضوع:", "Edit text content:"), this.customLessons[id].content); 
        if (newC && newC.trim()) { 
            this.customLessons[id].content = newC.trim(); 
            if (window.lessonsData[id]) window.lessonsData[id].content = newC.trim(); 
            this.saveUserData(); 
            this.render(); 
        } 
    }
    
    deleteCustomLesson(id) { 
        this.showConfirmModal(this.t('هل أنت متأكد من حذف هذا النص نهائياً؟', 'Are you sure you want to permanently delete this text?'), () => { 
            delete this.customLessons[id]; 
            delete window.lessonsData[id]; 
            this.userVocabulary = this.userVocabulary.filter(v => v.lessonId !== String(id)); 
            this.saveUserData(); 
            this.render(); 
        }); 
    }
    
    init() { 
        this.addThemeStyles(); 
        document.documentElement.setAttribute('data-theme', this.theme); 
        if (typeof auth === 'undefined' || typeof db === 'undefined') { 
            setTimeout(() => this.init(), 500); 
            return; 
        } 
        if (!window.levels || !window.lessonsData || !window.placementBank || !window.lessonsList) { 
            setTimeout(() => this.init(), 500); 
            return; 
        } 
        this.audioCtx = null;
        this.setupGlobalEvents(); 
        onAuthStateChanged(auth, async (user) => { 
            if (this.isProcessingAuth) return; 
            if (user) { 
                this.currentUser = user; 
                this.userData = { name: user.displayName || '', email: user.email, uid: user.uid }; 
                this.loadingData = true; 
                this.isDataLoaded = false; 
                this.canSave = false; 
                this.currentPage = 'home'; 
                this.render(); 
                try { 
                    await this.loadUserData(user.uid); 
                } catch (err) { 
                    console.error(err); 
                } finally { 
                    this.loadingData = false; 
                    this.render(); 
                } 
            } else { 
                this.currentUser = null; 
                this.currentPage = 'auth'; 
                this.loadingData = false; 
                this.isDataLoaded = false; 
                this.canSave = false; 
                this.render(); 
            } 
        }); 
    }
}
const appInstance = new App();
