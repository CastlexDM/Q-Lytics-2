// Quick quiz start
function startQuiz() {
  const quizCode = document.getElementById('quizCode').value.trim();
  if (!quizCode) {
    alert('Please enter a quiz password.');
    return;
  }
  // placeholder behavior - normally you'd verify with backend
  alert('Starting quiz with code: ' + quizCode);
  // Example redirect: window.location.href = '/quiz.html?code=' + encodeURIComponent(quizCode);
}

// Redirect to login (simulated)
function redirectLogin(userType) {
  if (userType === 'teacher') {
    alert('Redirecting to Teacher Login...');
    // window.location.href = '/teacher-login.html';
  } else if (userType === 'student') {
    alert('Redirecting to Student OTP Login...');
    // window.location.href = '/student-login.html';
  }
}

// Contact form submission
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        alert('Please fill all fields.');
        return;
      }
      // replace with actual API call later
      alert(`Thanks ${name}! Your message has been sent.`);
      contactForm.reset();
    });
  }

  // Smooth scrolling for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if (t) t.scrollIntoView({behavior:'smooth', block: 'start'});
    });
  });
});

(function() {
  'use strict';
  const targets = [/older logos/i, /new logos/i];

  function removeMatching() {
    // Search through likely heading and container elements
    const candidates = document.querySelectorAll('h1,h2,h3,h4,h5,legend,span,div,li');
    candidates.forEach(el => {
      const text = (el.textContent || '').trim();
      if (!text) return;
      for (const re of targets) {
        if (re.test(text)) {
          // Find a reasonable container to remove (section, article, div.card, li, etc.)
          const container = el.closest('section, article, .card, .pack-item, .pack-section, li, .collection, .row') || el.parentElement;
          if (container && container.parentElement) {
            container.remove();
            console.log('[hide-fa-slab] Removed element containing text:', text);
          } else {
            el.remove();
            console.log('[hide-fa-slab] Removed small element containing text:', text);
          }
          break;
        }
      }
    });
  }

  // Run once and observe for dynamic loading
  function tryRemoveSafely() {
    try {
      removeMatching();
    } catch (e) {
      console.error('[hide-fa-slab] error while removing:', e);
    }
  }

  window.addEventListener('load', tryRemoveSafely);
  setTimeout(tryRemoveSafely, 1200);

  const mo = new MutationObserver(() => tryRemoveSafely());
  mo.observe(document.documentElement, { childList: true, subtree: true });

})();
// Toast helper
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 2500);
}

// Start Quiz
function startQuiz(){
  const quizCode = document.getElementById("quizCode").value.trim();
  if(!quizCode){ showToast("Enter quiz password"); return; }
  alert("Quiz starting with password: " + quizCode);
}

// Modal Elements
const modalBackdrop = document.getElementById("studentModalBackdrop");
let _currentOtp = null;

// Open Modal
function openStudentLogin(e){
  if(e) e.preventDefault();
  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden","false");
  document.getElementById("stuName").focus();
}
// Close Modal
function closeStudentLogin(){
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden","true");
  _currentOtp = null;
  document.getElementById("stuName").value = "";
  document.getElementById("stuEmail").value = "";
  document.getElementById("otpInput").value = "";
}

// Generate demo OTP
function generateOtp(){ return Math.floor(100000 + Math.random()*900000).toString(); }

function maskEmail(email){
  const parts = email.split('@');
  if(parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  const masked = name.length <= 2 ? name.charAt(0) + "*" : name.substring(0,2) + "***";
  return masked + "@" + domain;
}

// Send OTP
function sendOtp(){
  const email = document.getElementById("stuEmail").value.trim();
  const name = document.getElementById("stuName").value.trim();
  if(!name || !email) return showToast("Enter name & email first");

  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("Invalid email");

  _currentOtp = generateOtp();
  console.log("[demo OTP]", _currentOtp);
  showToast("OTP sent to " + maskEmail(email));
  document.getElementById("otpInput").focus();
}

// Verify OTP
function verifyAndProceed(){
  const entered = document.getElementById("otpInput").value.trim();
  const name = document.getElementById("stuName").value.trim();
  const email = document.getElementById("stuEmail").value.trim();

  if(!name || !email) return showToast("Enter all fields");
  if(!_currentOtp) return showToast("Send OTP first");
  if(entered.length < 6) return showToast("Enter full OTP");

  if(entered === _currentOtp){
    closeStudentLogin();
    showToast("Verified — joining quiz...");
    setTimeout(() => alert("Welcome, " + name + "! (demo)"), 500);
  } else showToast("Incorrect OTP");
}

// Backdrop click closes modal
modalBackdrop.addEventListener("click", e => {
  if(e.target === modalBackdrop) closeStudentLogin();
});

// ESC key closes modal
window.addEventListener("keydown", e => {
  if(e.key === "Escape" && modalBackdrop.classList.contains("open"))
    closeStudentLogin();
});