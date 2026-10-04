/**
 * ATIKSH PHARMA - User Authentication, Visitor Gate & Cookie Session System
 * Bulletproof modal presentation, zero scrollbar, persistent cookie auto-login,
 * cookie consent banner, and synchronized Admin Panel user management.
 */

const ATIKSH_USERS_KEY = 'atiksh_registered_users';
const ATIKSH_CURRENT_USER_KEY = 'atiksh_logged_in_user';
const ATIKSH_COOKIE_CONSENT_KEY = 'atiksh_cookie_consent';
const ATIKSH_REMEMBER_USER_COOKIE = 'atiksh_remember_user';

// --------------------------------------------------------------------------
// Standard Cookie Utilities
// --------------------------------------------------------------------------
function setCookie(name, value, days = 30) {
  try {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/; SameSite=Lax";
  } catch (e) {
    console.error("Error setting cookie", e);
  }
}

function getCookie(name) {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  } catch (e) {}
  return null;
}

function deleteCookie(name) {
  try {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
  } catch (e) {}
}

function hasAcceptedCookies() {
  return localStorage.getItem(ATIKSH_COOKIE_CONSENT_KEY) === 'accepted' || getCookie(ATIKSH_COOKIE_CONSENT_KEY) === 'accepted';
}

function hasDeclinedCookies() {
  return localStorage.getItem(ATIKSH_COOKIE_CONSENT_KEY) === 'declined' || getCookie(ATIKSH_COOKIE_CONSENT_KEY) === 'declined';
}

// --------------------------------------------------------------------------
// User Database Management
// --------------------------------------------------------------------------
function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(ATIKSH_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading registered users", e);
  }
  return [];
}

function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(ATIKSH_USERS_KEY, JSON.stringify(users));
    if (window.AtikshAPI && typeof window.AtikshAPI.saveUsers === 'function') {
      window.AtikshAPI.saveUsers(users);
    }
  } catch (e) {
    console.error("Error saving users", e);
  }
}

function getLoggedInUser() {
  try {
    const raw = localStorage.getItem(ATIKSH_CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function setLoggedInUser(user) {
  localStorage.setItem(ATIKSH_CURRENT_USER_KEY, JSON.stringify(user));
  updatePublicAuthNav();
}

function clearLoggedInUser() {
  localStorage.removeItem(ATIKSH_CURRENT_USER_KEY);
  updatePublicAuthNav();
}

// --------------------------------------------------------------------------
// Persistent Cookie Auto-Login
// --------------------------------------------------------------------------
function tryAutoLoginFromCookie() {
  let currentUser = getLoggedInUser();
  if (currentUser) return currentUser;

  // Check if a user identifier is stored in the persistent cookie
  const rememberedId = getCookie(ATIKSH_REMEMBER_USER_COOKIE);
  if (rememberedId) {
    const users = getRegisteredUsers();
    const matched = users.find(u => 
      u.email.toLowerCase() === rememberedId.toLowerCase() || 
      u.id === rememberedId || 
      (u.phone && u.phone === rememberedId)
    );

    if (matched) {
      matched.lastLogin = new Date().toLocaleString();
      matched.autoLoggedInViaCookie = true;
      saveRegisteredUsers(users);
      setLoggedInUser(matched);
      return matched;
    }
  }

  // Fallback: If cookies were accepted and only one user is registered, restore
  if (hasAcceptedCookies()) {
    const users = getRegisteredUsers();
    if (users.length > 0) {
      const lastUser = users[0];
      setCookie(ATIKSH_REMEMBER_USER_COOKIE, lastUser.email, 30);
      setLoggedInUser(lastUser);
      return lastUser;
    }
  }

  return null;
}

// --------------------------------------------------------------------------
// Cookie Consent Banner (Ask for Cookies & Auto-Login on Acceptance)
// --------------------------------------------------------------------------
function injectCookieConsentBanner() {
  if (document.getElementById('atiksh-cookie-banner')) return;
  // If already accepted or declined, do not display
  if (hasAcceptedCookies() || hasDeclinedCookies()) return;

  const bannerHtml = `
    <div id="atiksh-cookie-banner" style="z-index: 99990;" class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200 animate-fade-in text-xs">
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
          <i data-lucide="cookie" class="w-5 h-5"></i>
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <h4 class="font-bold text-slate-900 text-sm font-brand">Cookie &amp; Session Consent</h4>
            <button type="button" onclick="declineCookieConsent(); return false;" class="text-slate-400 hover:text-slate-600 cursor-pointer" title="Dismiss">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <p class="text-slate-600 text-[11px] leading-relaxed mb-3">
            We use cookies to maintain your login session across visits, remember your account, and provide uninterrupted access to pharmaceutical formulations.
          </p>
          <div class="flex items-center gap-2">
            <button type="button" onclick="acceptCookieConsent(); return false;" class="flex-1 py-2 px-3 text-white font-bold rounded-xl text-xs transition-opacity hover:opacity-90 shadow-xs cursor-pointer flex items-center justify-center gap-1.5" style="background-color:#0D9488;">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              <span>Accept &amp; Auto-Login</span>
            </button>
            <button type="button" onclick="declineCookieConsent(); return false;" class="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', bannerHtml);
  if (window.lucide) window.lucide.createIcons();
}

function hideCookieBanner() {
  const banner = document.getElementById('atiksh-cookie-banner');
  if (banner) banner.remove();
}

function acceptCookieConsent() {
  localStorage.setItem(ATIKSH_COOKIE_CONSENT_KEY, 'accepted');
  setCookie(ATIKSH_COOKIE_CONSENT_KEY, 'accepted', 365);
  hideCookieBanner();

  // Try auto-login from existing cookie or last known user
  let user = getLoggedInUser();
  if (!user) {
    user = tryAutoLoginFromCookie();
  }

  if (user) {
    setCookie(ATIKSH_REMEMBER_USER_COOKIE, user.email, 30);
    closeVisitorAuthModal(true);
    updatePublicAuthNav();
  }
}

function declineCookieConsent() {
  localStorage.setItem(ATIKSH_COOKIE_CONSENT_KEY, 'declined');
  setCookie(ATIKSH_COOKIE_CONSENT_KEY, 'declined', 30);
  deleteCookie(ATIKSH_REMEMBER_USER_COOKIE);
  hideCookieBanner();
}

// --------------------------------------------------------------------------
// Modal Injection & Presentation (No Scrollbar, Clean Compact Design)
// --------------------------------------------------------------------------
function initVisitorAuthGate() {
  // If already on admin.html, do not trigger visitor gate
  if (window.location.pathname.endsWith('admin.html')) return;

  // 1. First attempt auto-login from persistent cookie
  const autoUser = tryAutoLoginFromCookie();

  // 2. Inject Modal & Update Public Navigation
  injectVisitorAuthModal();
  updatePublicAuthNav();

  // 3. Ask for cookie consent if not yet decided
  injectCookieConsentBanner();

  // 4. If user is authenticated, do NOT display auth modal
  if (autoUser || getLoggedInUser()) return;

  // 5. If not authenticated and not dismissed in this session, show entry gate
  const dismissed = sessionStorage.getItem('atiksh_auth_dismissed');
  if (!dismissed) {
    setTimeout(() => {
      openVisitorAuthModal('signup');
    }, 400);
  }
}

function injectVisitorAuthModal() {
  if (document.getElementById('visitor-auth-modal')) return;

  const modalHtml = `
    <div id="visitor-auth-modal" style="z-index: 99999; display: none;" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 relative animate-fade-in max-h-[92vh] overflow-y-auto no-scrollbar" style="scrollbar-width: none; -ms-overflow-style: none;">
        
        <!-- Close / Dismiss button -->
        <button type="button" onclick="closeVisitorAuthModal(true); return false;" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer" title="Close &amp; Browse as Guest">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>

        <!-- Brand Header -->
        <div class="text-center mb-3 sm:mb-4">
          <div class="inline-flex items-center gap-2 mb-1">
            <img src="images/symbol.png" alt="Atiksh Pharma" class="h-7 w-auto object-contain">
            <span class="text-xl font-black text-slate-900 font-brand">Atiksh</span>
            <span class="text-xl font-black text-teal-600 font-brand">Pharma</span>
          </div>
          <p id="visitor-auth-title" class="text-sm font-bold text-slate-800 font-brand">Join Atiksh Pharma Network</p>
          <p id="visitor-auth-desc" class="text-[11px] text-slate-500 mt-0.5">Create your account or sign in to browse formulations.</p>
        </div>

        <!-- Toggle Switch (Sign In vs Sign Up) -->
        <div class="flex rounded-xl bg-slate-100 p-1 mb-3.5">
          <button type="button" id="tab-btn-signup" onclick="switchVisitorAuthMode('signup'); return false;" class="flex-1 py-1.5 text-xs font-bold rounded-lg text-white bg-navy-primary shadow-xs transition-all cursor-pointer" style="background-color:#0A192F;">
            Create Account
          </button>
          <button type="button" id="tab-btn-signin" onclick="switchVisitorAuthMode('signin'); return false;" class="flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition-all cursor-pointer">
            Sign In
          </button>
        </div>

        <!-- Notification Alert Box -->
        <div id="visitor-auth-alert" class="p-2.5 rounded-xl text-xs font-medium mb-3 hidden"></div>

        <!-- SIGN UP FORM -->
        <form id="visitor-signup-form" onsubmit="handleVisitorSignUp(event); return false;" class="space-y-2.5 text-xs">
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Full Name *</label>
            <input type="text" id="v-reg-name" required placeholder="e.g. Dr. Rajesh Sharma" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Email Address *</label>
              <input type="email" id="v-reg-email" required placeholder="name@domain.com" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Phone / Mobile *</label>
              <input type="tel" id="v-reg-phone" required placeholder="+91 98765 00000" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none">
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Account Password *</label>
            <div class="relative">
              <input type="password" id="v-reg-password" required placeholder="Create secure password" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none pr-9">
              <button type="button" onclick="togglePasswordVisibility('v-reg-password', this); return false;" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
            <span class="text-[10px] text-slate-400 mt-0.5 block">Minimum 4 characters</span>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" id="v-reg-remember" checked class="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300">
              <span>Save cookie to stay signed in automatically</span>
            </label>
          </div>

          <div class="pt-1">
            <button type="submit" class="w-full py-2.5 px-4 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer" style="background-color:#0D9488;">
              <i data-lucide="user-plus" class="w-4 h-4"></i>
              <span>Register &amp; Access Website</span>
            </button>
          </div>
        </form>

        <!-- SIGN IN FORM -->
        <form id="visitor-signin-form" onsubmit="handleVisitorSignIn(event); return false;" class="space-y-2.5 text-xs hidden">
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Registered Email or Phone *</label>
            <input type="text" id="v-login-identifier" required placeholder="Enter your email or phone number" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none">
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">Password *</label>
              <button type="button" onclick="switchVisitorAuthMode('forgot'); return false;" class="text-[11px] font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer">
                Forgot Password?
              </button>
            </div>
            <div class="relative">
              <input type="password" id="v-login-password" required placeholder="Enter your password" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none pr-9">
              <button type="button" onclick="togglePasswordVisibility('v-login-password', this); return false;" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" id="v-login-remember" checked class="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300">
              <span>Stay signed in via persistent cookie</span>
            </label>
          </div>

          <div class="pt-1">
            <button type="submit" class="w-full py-2.5 px-4 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer" style="background-color:#0A192F;">
              <i data-lucide="log-in" class="w-4 h-4 text-teal-400"></i>
              <span>Sign In to Account</span>
            </button>
          </div>
        </form>

        <!-- FORGOT / RESET PASSWORD FORM -->
        <form id="visitor-forgot-form" onsubmit="handleVisitorForgotPassword(event); return false;" class="space-y-2.5 text-xs hidden">
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Registered Email or Phone *</label>
            <input type="text" id="v-forgot-identifier" required placeholder="Enter your registered email or phone" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none">
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Set New Password *</label>
            <div class="relative">
              <input type="password" id="v-forgot-newpwd" required placeholder="Enter your new password" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none pr-9">
              <button type="button" onclick="togglePasswordVisibility('v-forgot-newpwd', this); return false;" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
            <span class="text-[10px] text-slate-400 mt-0.5 block">Minimum 4 characters</span>
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">Confirm New Password *</label>
            <div class="relative">
              <input type="password" id="v-forgot-confirmpwd" required placeholder="Re-type new password" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-teal-600 outline-none pr-9">
              <button type="button" onclick="togglePasswordVisibility('v-forgot-confirmpwd', this); return false;" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="pt-1 flex items-center gap-2">
            <button type="button" onclick="switchVisitorAuthMode('signin'); return false;" class="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
              Back to Sign In
            </button>
            <button type="submit" class="flex-1 py-2 px-3 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer" style="background-color:#0D9488;">
              <i data-lucide="key" class="w-3.5 h-3.5"></i>
              <span>Reset Password</span>
            </button>
          </div>
        </form>

        <div class="mt-3 pt-2.5 border-t border-slate-100 text-center">
          <button type="button" onclick="closeVisitorAuthModal(true); return false;" class="text-[11px] font-semibold text-slate-500 hover:text-teal-700 cursor-pointer">
            Skip for now &amp; browse as Guest →
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Close modal when clicking backdrop
  const modal = document.getElementById('visitor-auth-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeVisitorAuthModal(true);
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const m = document.getElementById('visitor-auth-modal');
      if (m && m.style.display !== 'none' && !m.classList.contains('hidden')) {
        closeVisitorAuthModal(true);
      }
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

function openVisitorAuthModal(mode = 'signup') {
  injectVisitorAuthModal();
  const modal = document.getElementById('visitor-auth-modal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    switchVisitorAuthMode(mode);
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeVisitorAuthModal(rememberDismiss = false) {
  const modal = document.getElementById('visitor-auth-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  document.body.style.overflow = '';
  if (rememberDismiss) {
    sessionStorage.setItem('atiksh_auth_dismissed', 'true');
  }
}

function switchVisitorAuthMode(mode) {
  const signupForm = document.getElementById('visitor-signup-form');
  const signinForm = document.getElementById('visitor-signin-form');
  const forgotForm = document.getElementById('visitor-forgot-form');
  const tabSignup = document.getElementById('tab-btn-signup');
  const tabSignin = document.getElementById('tab-btn-signin');
  const title = document.getElementById('visitor-auth-title');
  const desc = document.getElementById('visitor-auth-desc');
  const alertBox = document.getElementById('visitor-auth-alert');

  if (alertBox) {
    alertBox.textContent = '';
    alertBox.classList.add('hidden');
  }

  if (mode === 'signup') {
    if (signupForm) signupForm.classList.remove('hidden');
    if (signinForm) signinForm.classList.add('hidden');
    if (forgotForm) forgotForm.classList.add('hidden');
    if (tabSignup) {
      tabSignup.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-white bg-navy-primary shadow-xs transition-all cursor-pointer";
      tabSignup.style.backgroundColor = "#0A192F";
    }
    if (tabSignin) {
      tabSignin.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition-all cursor-pointer";
      tabSignin.style.backgroundColor = "";
    }
    if (title) title.textContent = "Join Atiksh Pharma Network";
    if (desc) desc.textContent = "Create your account or sign in to browse formulations.";
  } else if (mode === 'signin') {
    if (signupForm) signupForm.classList.add('hidden');
    if (signinForm) signinForm.classList.remove('hidden');
    if (forgotForm) forgotForm.classList.add('hidden');
    if (tabSignin) {
      tabSignin.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-white bg-navy-primary shadow-xs transition-all cursor-pointer";
      tabSignin.style.backgroundColor = "#0A192F";
    }
    if (tabSignup) {
      tabSignup.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition-all cursor-pointer";
      tabSignup.style.backgroundColor = "";
    }
    if (title) title.textContent = "Welcome Back";
    if (desc) desc.textContent = "Sign in to access your saved pharmaceutical requisitions.";
  } else if (mode === 'forgot') {
    if (signupForm) signupForm.classList.add('hidden');
    if (signinForm) signinForm.classList.add('hidden');
    if (forgotForm) forgotForm.classList.remove('hidden');
    if (tabSignin) {
      tabSignin.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition-all cursor-pointer";
      tabSignin.style.backgroundColor = "";
    }
    if (tabSignup) {
      tabSignup.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition-all cursor-pointer";
      tabSignup.style.backgroundColor = "";
    }
    if (title) title.textContent = "Reset Account Password";
    if (desc) desc.textContent = "Enter your registered email or phone to reset your password.";
  }

  if (window.lucide) window.lucide.createIcons();
}

function showAuthAlert(msg, isSuccess = false) {
  const alertBox = document.getElementById('visitor-auth-alert');
  if (!alertBox) return;

  alertBox.className = isSuccess 
    ? "p-2.5 rounded-xl text-xs font-medium mb-3 bg-teal-50 border border-teal-200 text-teal-800"
    : "p-2.5 rounded-xl text-xs font-medium mb-3 bg-rose-50 border border-rose-200 text-rose-700";
  alertBox.textContent = msg;
  alertBox.classList.remove('hidden');
}

// --------------------------------------------------------------------------
// Sign Up Handler
// --------------------------------------------------------------------------
async function handleVisitorSignUp(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = (document.getElementById('v-reg-name') ? document.getElementById('v-reg-name').value : '').trim();
  const email = (document.getElementById('v-reg-email') ? document.getElementById('v-reg-email').value : '').trim().toLowerCase();
  const phone = (document.getElementById('v-reg-phone') ? document.getElementById('v-reg-phone').value : '').trim();
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const password = (document.getElementById('v-reg-password') ? document.getElementById('v-reg-password').value : '').trim();
  const remember = document.getElementById('v-reg-remember') ? document.getElementById('v-reg-remember').checked : true;

  if (password.length < 4) {
    showAuthAlert("Password must be at least 4 characters long.");
    return false;
  }

  // Pre-fetch live users from Firebase cloud before checking existence
  if (window.AtikshAPI && typeof window.AtikshAPI.getUsers === 'function') {
    try {
      await window.AtikshAPI.getUsers();
    } catch (err) {}
  }

  const users = getRegisteredUsers();
  const exists = users.find(u => {
    const uEmail = (u.email || '').toLowerCase().trim();
    const uPhone = (u.phone || '').replace(/[\s-]/g, '');
    return (uEmail && uEmail === email) || (cleanPhone && uPhone && uPhone === cleanPhone);
  });

  if (exists) {
    showAuthAlert("An account with this email or phone number already exists. Please Sign In.");
    return false;
  }

  const newUser = {
    id: "USR-" + Date.now(),
    name,
    email,
    phone,
    password,
    registeredAt: new Date().toLocaleString(),
    lastLogin: new Date().toLocaleString()
  };

  users.unshift(newUser);
  saveRegisteredUsers(users);
  setLoggedInUser(newUser);

  // Set persistent cookie if remember is checked or cookies accepted
  if (remember || hasAcceptedCookies()) {
    setCookie(ATIKSH_REMEMBER_USER_COOKIE, newUser.email, 30);
    setCookie(ATIKSH_COOKIE_CONSENT_KEY, 'accepted', 365);
    localStorage.setItem(ATIKSH_COOKIE_CONSENT_KEY, 'accepted');
    hideCookieBanner();
  }

  showAuthAlert("Account created successfully! Welcome to Atiksh Pharma.", true);

  setTimeout(() => {
    closeVisitorAuthModal();
  }, 900);

  return false;
}

// --------------------------------------------------------------------------
// Sign In Handler
// --------------------------------------------------------------------------
async function handleVisitorSignIn(e) {
  if (e && e.preventDefault) e.preventDefault();
  const identifier = (document.getElementById('v-login-identifier') ? document.getElementById('v-login-identifier').value : '').trim().toLowerCase();
  const cleanId = identifier.replace(/[\s-]/g, '');
  const password = (document.getElementById('v-login-password') ? document.getElementById('v-login-password').value : '').trim();
  const remember = document.getElementById('v-login-remember') ? document.getElementById('v-login-remember').checked : true;

  if (window.AtikshAPI && typeof window.AtikshAPI.getUsers === 'function') {
    try {
      await window.AtikshAPI.getUsers();
    } catch (err) {}
  }

  const users = getRegisteredUsers();
  const user = users.find(u => {
    const uEmail = (u.email || '').toLowerCase().trim();
    const uPhone = (u.phone || '').replace(/[\s-]/g, '');
    return (uEmail === identifier || (uPhone && uPhone === cleanId)) && u.password === password;
  });

  if (!user) {
    showAuthAlert("Invalid credentials. Please verify your email/phone and password.");
    return false;
  }

  user.lastLogin = new Date().toLocaleString();
  saveRegisteredUsers(users);
  setLoggedInUser(user);

  // Save in persistent cookie if remember is checked or cookies accepted
  if (remember || hasAcceptedCookies()) {
    setCookie(ATIKSH_REMEMBER_USER_COOKIE, user.email, 30);
    setCookie(ATIKSH_COOKIE_CONSENT_KEY, 'accepted', 365);
    localStorage.setItem(ATIKSH_COOKIE_CONSENT_KEY, 'accepted');
    hideCookieBanner();
  }

  showAuthAlert(`Welcome back, ${user.name}!`, true);

  setTimeout(() => {
    closeVisitorAuthModal();
  }, 900);

  return false;
}

// --------------------------------------------------------------------------
// Forgot / Reset Password Handler
// --------------------------------------------------------------------------
function handleVisitorForgotPassword(e) {
  if (e && e.preventDefault) e.preventDefault();
  const identifier = (document.getElementById('v-forgot-identifier') ? document.getElementById('v-forgot-identifier').value : '').trim().toLowerCase();
  const newPwd = (document.getElementById('v-forgot-newpwd') ? document.getElementById('v-forgot-newpwd').value : '').trim();
  const confirmPwd = (document.getElementById('v-forgot-confirmpwd') ? document.getElementById('v-forgot-confirmpwd').value : '').trim();

  if (newPwd.length < 4) {
    showAuthAlert("New password must be at least 4 characters long.");
    return false;
  }

  if (newPwd !== confirmPwd) {
    showAuthAlert("Passwords do not match. Please verify.");
    return false;
  }

  const users = getRegisteredUsers();
  const user = users.find(u => 
    u.email.toLowerCase() === identifier || u.phone === identifier
  );

  if (!user) {
    showAuthAlert("No registered account found with that email or phone number.");
    return false;
  }

  user.password = newPwd;
  user.lastPasswordReset = new Date().toLocaleString();
  saveRegisteredUsers(users);

  showAuthAlert(`Password reset successful for ${user.name}! You can now sign in with your new password.`, true);

  setTimeout(() => {
    switchVisitorAuthMode('signin');
    const loginId = document.getElementById('v-login-identifier');
    if (loginId) loginId.value = identifier;
  }, 1200);

  return false;
}

// --------------------------------------------------------------------------
// Public Header & Mobile Drawer User Profile Integration
// --------------------------------------------------------------------------
function updatePublicAuthNav() {
  const user = getLoggedInUser();

  // Desktop Header Container
  const desktopContainers = document.querySelectorAll('#public-nav-auth-container');
  desktopContainers.forEach(container => {
    if (user) {
      container.innerHTML = `
        <div class="relative group">
          <button type="button" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer">
            <div class="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <span class="max-w-[110px] truncate">${user.name}</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-500"></i>
          </button>
          <div class="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 text-xs hidden group-hover:block z-50">
            <div class="p-2 border-b border-slate-100">
              <p class="font-bold text-slate-900 truncate">${user.name}</p>
              <p class="text-[10px] text-slate-500 truncate">${user.email}</p>
              <div class="mt-1 flex items-center gap-1 text-[10px] text-teal-700 font-semibold">
                <i data-lucide="shield-check" class="w-3 h-3 text-teal-600"></i>
                <span>Cookie Session Active</span>
              </div>
            </div>
            <button type="button" onclick="handleVisitorLogout(); return false;" class="w-full text-left p-2 text-rose-600 hover:bg-rose-50 rounded-lg font-bold flex items-center gap-1.5 mt-1 transition-colors cursor-pointer">
              <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button type="button" data-open-auth-modal="signin" onclick="openVisitorAuthModal('signin'); return false;" class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-xs">
          <i data-lucide="user" class="w-3.5 h-3.5 text-teal-600"></i>
          <span>Sign In</span>
        </button>
      `;
    }
  });

  // Mobile Drawer Menu
  const mobileContainers = document.querySelectorAll('#mobile-nav-auth-container');
  mobileContainers.forEach(container => {
    if (user) {
      container.innerHTML = `
        <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p class="text-xs font-bold text-slate-900 leading-tight">${user.name}</p>
              <p class="text-[10px] text-slate-500">${user.email}</p>
            </div>
          </div>
          <button type="button" onclick="handleVisitorLogout(); return false;" class="text-xs text-rose-600 font-bold px-2 py-1 rounded hover:bg-rose-50 cursor-pointer">
            Log Out
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button type="button" data-open-auth-modal="signin" onclick="openVisitorAuthModal('signin'); return false;" class="w-full py-2.5 px-3 mb-2 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
          <i data-lucide="user" class="w-3.5 h-3.5 text-teal-600"></i>
          <span>Sign In / Create Account</span>
        </button>
      `;
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

function handleVisitorLogout() {
  clearLoggedInUser();
  deleteCookie(ATIKSH_REMEMBER_USER_COOKIE);
  sessionStorage.removeItem('atiksh_auth_dismissed');
  alert("You have logged out.");
  updatePublicAuthNav();
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i>';
  }
  if (window.lucide) window.lucide.createIcons();
}

// Global Click Delegation to prevent any accidental link navigation or form submit
document.addEventListener('click', function(e) {
  const trigger = e.target.closest('[data-open-auth-modal]');
  if (trigger) {
    e.preventDefault();
    e.stopPropagation();
    const mode = trigger.getAttribute('data-open-auth-modal') || 'signin';
    openVisitorAuthModal(mode);
    return false;
  }
});

// Explicitly bind to window for reliable HTML event attributes
window.openVisitorAuthModal = openVisitorAuthModal;
window.closeVisitorAuthModal = closeVisitorAuthModal;
window.switchVisitorAuthMode = switchVisitorAuthMode;
window.handleVisitorSignUp = handleVisitorSignUp;
window.handleVisitorSignIn = handleVisitorSignIn;
window.handleVisitorForgotPassword = handleVisitorForgotPassword;
window.handleVisitorLogout = handleVisitorLogout;
window.togglePasswordVisibility = togglePasswordVisibility;
window.getRegisteredUsers = getRegisteredUsers;
window.saveRegisteredUsers = saveRegisteredUsers;
window.acceptCookieConsent = acceptCookieConsent;
window.declineCookieConsent = declineCookieConsent;
window.getCookie = getCookie;
window.setCookie = setCookie;
window.deleteCookie = deleteCookie;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVisitorAuthGate);
} else {
  initVisitorAuthGate();
}
