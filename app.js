// app-simple.js - نسخة مبسطة للاختبار
class App {
    constructor() {
        this.currentPage = 'auth';
        this.lang = localStorage.getItem('appLang') || 'ar';
        document.documentElement.setAttribute('dir', this.lang === 'ar' ? 'rtl' : 'ltr');
        this.theme = localStorage.getItem('theme') || 'light';
        this.userCoins = 0;
        this.currentUser = null;
        this.userData = null;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    t(ar, en) {
        return this.lang === 'en' ? en : ar;
    }

    async init() {
        console.log("App initializing...");
        
        // انتظر Firebase
        if (typeof auth === 'undefined' || typeof db === 'undefined') {
            console.log("Waiting for Firebase...");
            setTimeout(() => this.init(), 500);
            return;
        }
        
        console.log("Firebase ready!");
        this.addBasicStyles();
        this.setupEvents();
        
        onAuthStateChanged(auth, (user) => {
            console.log("Auth state:", user ? user.email : "No user");
            this.currentUser = user;
            if (user) {
                this.userData = { email: user.email, uid: user.uid };
                this.currentPage = 'home';
            } else {
                this.currentPage = 'auth';
            }
            this.render();
        });
    }

    addBasicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body { font-family: 'Cairo', sans-serif; background: #f5f7fb; margin: 0; padding: 0; }
            .main-content { max-width: 600px; margin: 0 auto; padding: 20px; }
            .reading-card { background: white; border-radius: 20px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            .hero-btn { padding: 12px 20px; background: #3b82f6; color: white; border: none; border-radius: 12px; cursor: pointer; width: 100%; font-size: 1rem; margin: 8px 0; }
            .auth-input { width: 100%; padding: 12px; margin: 8px 0; border-radius: 12px; border: 1px solid #ddd; font-size: 1rem; }
            .header { background: white; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
            .logo-container { display: flex; align-items: center; gap: 8px; cursor: pointer; }
            .logo-container img { width: 32px; height: 32px; }
            .logo-container h2 { margin: 0; font-size: 1.2rem; }
            .header-buttons { display: flex; gap: 8px; align-items: center; }
            .coin-display { background: #ffd700; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
            .lang-btn { background: #3b82f6; color: white; border: none; padding: 4px 12px; border-radius: 20px; cursor: pointer; }
        `;
        document.head.appendChild(style);
    }

    setupEvents() {
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            
            if (action === 'doAuth') {
                const name = document.getElementById('authName')?.value;
                const email = document.getElementById('authEmail')?.value;
                const pass = document.getElementById('authPass')?.value;
                if (!name || !email || !pass) {
                    alert('الرجاء إدخال جميع البيانات');
                    return;
                }
                try {
                    let userCredential;
                    try {
                        userCredential = await signInWithEmailAndPassword(auth, email, pass);
                    } catch (error) {
                        if (error.code === 'auth/user-not-found') {
                            userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                            await setDoc(doc(db, "users", userCredential.user.uid), {
                                name: name,
                                email: email,
                                userCoins: 100,
                                joinDate: new Date().toLocaleDateString('ar-EG')
                            });
                        } else {
                            throw error;
                        }
                    }
                    alert('تم تسجيل الدخول بنجاح!');
                    this.render();
                } catch (error) {
                    alert('فشل تسجيل الدخول: ' + error.message);
                }
            }
            
            if (action === 'logout') {
                await signOut(auth);
                this.render();
            }
            
            if (action === 'toggleLang') {
                this.lang = this.lang === 'ar' ? 'en' : 'ar';
                localStorage.setItem('appLang', this.lang);
                document.documentElement.setAttribute('dir', this.lang === 'ar' ? 'rtl' : 'ltr');
                this.render();
            }
            
            if (action === 'goHome') {
                this.currentPage = 'home';
                this.render();
            }
        });
    }

    getHeader() {
        if (this.currentPage === 'auth') return '';
        return `<header class="header">
            <div class="logo-container" data-action="goHome">
                <img src="wordwise_logo.png" alt="WordWise">
                <h2>WordWise</h2>
            </div>
            <div class="header-buttons">
                <button class="lang-btn" data-action="toggleLang">${this.lang === 'ar' ? 'EN' : 'عربي'}</button>
                <div class="coin-display">💎 ${this.userCoins}</div>
                <button data-action="logout" style="background:none; border:none; font-size:1.2rem;">🚪</button>
            </div>
        </header>`;
    }

    render() {
        const app = document.getElementById('app');
        if (!app) return;
        
        if (this.currentPage === 'auth') {
            app.innerHTML = `<main class="main-content">
                <div style="text-align:center; margin-bottom:30px;">
                    <img src="wordwise_logo.png" style="width:80px;">
                    <h1>WordWise</h1>
                    <p>${this.t('كن حكيماً في اختيار كلماتك', 'Be wise in choosing your words')}</p>
                </div>
                <div class="reading-card">
                    <h2>🚀 ${this.t('مرحباً بك', 'Welcome')}</h2>
                    <input id="authName" placeholder="${this.t('الاسم الكامل', 'Full Name')}" class="auth-input">
                    <input id="authEmail" placeholder="${this.t('البريد الإلكتروني', 'Email')}" class="auth-input">
                    <input type="password" id="authPass" placeholder="${this.t('كلمة المرور', 'Password')}" class="auth-input">
                    <button class="hero-btn" data-action="doAuth">${this.t('تسجيل الدخول / إنشاء حساب', 'Login / Sign Up')}</button>
                </div>
            </main>`;
        } else {
            app.innerHTML = this.getHeader() + `<main class="main-content">
                <div class="reading-card" style="text-align:center;">
                    <h2>✨ ${this.t('مرحباً بك في التطبيق', 'Welcome to the app')}</h2>
                    <p>${this.t('تم تسجيل الدخول بنجاح', 'You are logged in')}</p>
                    <p>${this.userData?.email || ''}</p>
                </div>
            </main>`;
        }
    }
}

const appInstance = new App();
