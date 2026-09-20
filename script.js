/* =====================================
MOBILE MENU
===================================== */

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileLinks = document.querySelectorAll(".mobile-nav a");

if (menuToggle && mobileNav) menuToggle.addEventListener("click", () => {

mobileNav.classList.toggle("active");

const isOpen = mobileNav.classList.contains("active");

menuToggle.setAttribute(
"aria-expanded",
isOpen
);

});

mobileLinks.forEach((link) => {

link.addEventListener("click", () => {


mobileNav.classList.remove("active");

menuToggle.setAttribute(
  "aria-expanded",
  "false"
);


});

});

/* =====================================
HEADER SCROLL EFFECT
===================================== */

const header = document.querySelector(".header");

if (header) window.addEventListener("scroll", () => {

if (window.scrollY > 50) {


header.classList.add("scrolled");


} else {


header.classList.remove("scrolled");


}

});

/* =====================================
SCROLL REVEAL ANIMATION
===================================== */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(

(entries) => {


entries.forEach((entry) => {

  if (entry.isIntersecting) {

    entry.target.classList.add("active");

    revealObserver.unobserve(entry.target);

  }

});


},

{
threshold: 0.15
}

);

revealElements.forEach((element) => {

revealObserver.observe(element);

});

/* =====================================
NEWSLETTER FORM
===================================== */

const newsletterForm =
document.querySelector(".newsletter-form");

const formMessage =
document.querySelector(".form-message");

if (newsletterForm && formMessage) newsletterForm.addEventListener("submit", (event) => {

event.preventDefault();

const email =
newsletterForm.querySelector("input").value;

if (!email) {


formMessage.textContent =
  "Please enter your email address.";

return;


}

formMessage.textContent =
"Thank you! Your subscription was successful.";

newsletterForm.reset();

});

/* =====================================
FOOTER YEAR
===================================== */

const yearElement =
document.getElementById("year");

if (yearElement) yearElement.textContent =
new Date().getFullYear();

/* =====================================
SMOOTH ACTIVE NAVIGATION
===================================== */

const sections =
document.querySelectorAll("section[id]");

const navLinks =
document.querySelectorAll(".desktop-nav a");

if (sections.length && navLinks.length) window.addEventListener("scroll", () => {

let currentSection = "";

sections.forEach((section) => {


const sectionTop =
  section.offsetTop - 200;

const sectionHeight =
  section.offsetHeight;


if (
  window.scrollY >= sectionTop &&
  window.scrollY <
  sectionTop + sectionHeight
) {

  currentSection =
    section.getAttribute("id");

}


});

navLinks.forEach((link) => {


link.style.opacity = "1";


if (
  link.getAttribute("href") ===
  `#${currentSection}`
) {

  link.style.opacity = "0.5";

}


});

});


/* =====================================
HOMEPAGE VIDEO PLAYER
===================================== */

const homepageVideosSection = document.querySelector(
  'section#videos.feature-section'
);

if (homepageVideosSection) {

  const videoFeature =
    homepageVideosSection.querySelector(".video-feature");

  const videoModal =
    document.getElementById("videoModal");

  const modalVideo =
    document.getElementById("modalVideo");

  const modalVideoSource =
    document.getElementById("modalVideoSource");

  const videoModalClose =
    document.getElementById("videoModalClose");

  const videoModalBackdrop =
    document.querySelector(".video-modal-backdrop");


  if (
    videoFeature &&
    videoModal &&
    modalVideo &&
    modalVideoSource
  ) {

    /* PLAY VIDEO */

    videoFeature.addEventListener("click", function () {

      const videoPath =
        videoFeature.getAttribute("data-video");

      if (!videoPath) return;

      modalVideoSource.src = videoPath;

      modalVideo.load();

      videoModal.classList.add("active");

      document.body.classList.add("video-open");

      modalVideo.play().catch(() => {});

    });


    /* CLOSE VIDEO */

    function closeHomepageVideo() {

      modalVideo.pause();

      modalVideo.currentTime = 0;

      modalVideoSource.src = "";

      videoModal.classList.remove("active");

      document.body.classList.remove("video-open");

    }


    if (videoModalClose) {

      videoModalClose.addEventListener(
        "click",
        closeHomepageVideo
      );

    }


    if (videoModalBackdrop) {

      videoModalBackdrop.addEventListener(
        "click",
        closeHomepageVideo
      );

    }


    /* ESC KEY */

    document.addEventListener("keydown", function (event) {

      if (
        event.key === "Escape" &&
        videoModal.classList.contains("active")
      ) {

        closeHomepageVideo();

      }

    });

  }

}
/* =========================
   CHAT BOX
========================== */

const chatToggle   = document.getElementById('chatToggle');
const chatBox      = document.getElementById('chatBox');
const chatClose    = document.getElementById('chatClose');
const chatForm     = document.getElementById('chatForm');
const chatInput    = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

/* باز و بسته کردن */
chatToggle.addEventListener('click', () => {
  chatBox.classList.toggle('open');
  if (chatBox.classList.contains('open')) {
    setTimeout(() => chatInput.focus(), 300);
  }
});

chatClose.addEventListener('click', () => {
  chatBox.classList.remove('open');
});

/* بستن با کلید Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatBox.classList.contains('open')) {
    chatBox.classList.remove('open');
  }
});

/* پاسخ هوشمند بر اساس کلمات کلیدی */
function getBotReply(message) {
  const msg = message.toLowerCase().trim();

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! 👋 Welcome to Artist Portfolio. How can I help you?";
  }
  if (msg.includes('price') || msg.includes('cost') || msg.includes('buy')) {
    return "Our limited edition prints start at $49. Visit the Prints page for details. 🎨";
  }
  if (msg.includes('brush') || msg.includes('brushes')) {
    return "We offer a Fine Detail Professional Brush Set — perfect for precision work. Check the Brushes page!";
  }
  if (msg.includes('painting')) {
    return "All original paintings are in the Paintings section. Take a look! 🖼️";
  }
  if (msg.includes('print')) {
    return "Yes! Limited edition prints are available. Head to the Prints page to invest and enjoy.";
  }
  if (msg.includes('video')) {
    return "You can watch the creative process in our Videos section. 🎬";
  }
  if (msg.includes('contact') || msg.includes('email')) {
    return "You can reach us via the Contact page. We'd love to hear from you!";
  }
  if (msg.includes('thank')) {
    return "You're welcome! 😊 Enjoy exploring the collection.";
  }

  return "Thanks for your message! Feel free to explore our Paintings, Brushes, Prints or Videos sections. 🎨";
}

/* افزودن پیام به چت */
function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('chat-message', sender);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ارسال پیام */
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';

  /* پاسخ خودکار بعد از ۷۰۰ میلی‌ثانیه */
  setTimeout(() => {
    const reply = getBotReply(text);
    addMessage(reply, 'bot');
  }, 700);
});
/* =========================
   FLOATING CTA
========================== */
.floating-cta {
  position: fixed;
  bottom: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #c9a227;
  color: #111;
  padding: 12px 18px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(201, 162, 39, 0.4);
  z-index: 998;
  transition: all 0.3s ease;
  animation: ctaPulse 2.5s ease-in-out infinite;
}

.floating-cta:hover {
  background: #111;
  color: #c9a227;
  transform: translateY(-3px) scale(1.04);
}

.floating-cta-icon {
  font-size: 18px;
  line-height: 1;
}

@keyframes ctaPulse {
  0%, 100% { box-shadow: 0 10px 30px rgba(201, 162, 39, 0.4); }
  50%      { box-shadow: 0 10px 42px rgba(201, 162, 39, 0.85); }
}

/* =========================
   CLASSES SECTION
========================== */
.classes-section {
  background: #f7f5f0;
  overflow: hidden;
}

.section-subtitle {
  max-width: 560px;
  margin: 12px auto 0;
  text-align: center;
  color: #666;
  font-size: 15px;
  line-height: 1.7;
}

/* فیلتر */
.classes-filter {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 40px 0 40px;
  flex-wrap: wrap;
  padding: 0 24px;
}

.filter-btn {
  background: transparent;
  border: 1px solid rgba(17, 17, 17, 0.15);
  color: #111;
  padding: 8px 18px;
  border-radius: 40px;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.filter-btn:hover { border-color: #111; }

.filter-btn.active {
  background: #111;
  color: #fff;
  border-color: #111;
}

/* گرید */
.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 26px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* کارت */
.class-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.35s ease;
  display: flex;
  flex-direction: column;
}

.class-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.13);
}

.class-card.hidden { display: none; }

/* =========================
   بخش هنری (بدون عکس!)
========================== */
.class-art {
  position: relative;
  height: 170px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
}

.class-number {
  position: absolute;
  font-size: 130px;
  font-weight: 800;
  font-family: 'Georgia', serif;
  line-height: 1;
  color: rgba(255, 255, 255, 0.18);
  letter-spacing: -8px;
  z-index: 1;
  user-select: none;
}

.art-shape {
  position: absolute;
  z-index: 2;
  transition: all 0.5s ease;
}

/* کارت ۱ — گرادیانت گرم + دایره */
.art-1 {
  background: linear-gradient(135deg, #1a1a1a 0%, #3a2e1f 60%, #c9a227 140%);
}
.art-1 .art-shape {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: radial-gradient(circle at 30% 30%, rgba(201, 162, 39, 0.9), transparent 70%);
}
.class-card:hover .art-1 .art-shape {
  transform: scale(1.15) rotate(15deg);
  border-color: rgba(255, 255, 255, 0.6);
}

/* کارت ۲ — مشکی عمیق + مربع چرخیده */
.art-2 {
  background: linear-gradient(135deg, #0d0d0d 0%, #2b2b2b 100%);
}
.art-2 .art-shape {
  width: 70px;
  height: 70px;
  border: 2px solid #c9a227;
  transform: rotate(45deg);
  background: rgba(201, 162, 39, 0.08);
}
.class-card:hover .art-2 .art-shape {
  transform: rotate(135deg) scale(1.1);
  background: rgba(201, 162, 39, 0.18);
}

/* کارت ۳ — آبی هنری + موج */
.art-3 {
  background: linear-gradient(160deg, #1e3a4c 0%, #2d5a6b 60%, #7fb5b5 130%);
}
.art-3 .art-shape {
  width: 120px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, transparent 70%);
  filter: blur(2px);
}
.class-card:hover .art-3 .art-shape {
  transform: scale(1.25) translateY(-6px);
}

/* کارت ۴ — طلایی لوکس + حلقه */
.art-4 {
  background: linear-gradient(135deg, #c9a227 0%, #8b6f1a 100%);
}
.art-4 .art-shape {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.15);
}
.class-card:hover .art-4 .art-shape {
  transform: scale(1.15);
  border-color: #fff;
}

/* برچسب */
.class-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 6px 14px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  border-radius: 20px;
  backdrop-filter: blur(6px);
  z-index: 3;
}

.class-badge.online { background: rgba(255, 255, 255, 0.92); color: #111; }
.class-badge.in-person { background: rgba(17, 17, 17, 0.85); color: #fff; }
.class-badge.hybrid { background: rgba(255, 255, 255, 0.92); color: #111; border: 1px solid rgba(17, 17, 17, 0.15); }

/* بدنه کارت */
.class-body {
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.class-body h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #111;
}

.class-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 14px;
}

.class-info {
  list-style: none;
  padding: 14px 0 0;
  margin: 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  border-top: 1px solid #eee;
}

.class-info li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  color: #333;
}

.class-info li span {
  font-size: 14px;
  width: 18px;
  text-align: center;
}

/* دکمه */
.button-dark {
  display: inline-block;
  background: #111;
  color: #fff;
  padding: 11px 20px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-decoration: none;
  text-align: center;
  margin-top: auto;
  transition: all 0.25s ease;
}

.button-dark:hover {
  background: #c9a227;
  color: #111;
}

/* =========================
   NEXT SESSION COUNTDOWN
========================== */
.next-session {
  max-width: 720px;
  margin: 70px auto 0;
  padding: 34px 28px;
  background: #111;
  color: #fff;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.next-session::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #c9a227, transparent);
}

.next-session-label {
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #c9a227;
  margin-bottom: 18px;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 68px;
  padding: 14px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(201, 162, 39, 0.25);
  transition: all 0.25s ease;
}

.countdown-item:hover {
  background: rgba(201, 162, 39, 0.08);
  border-color: #c9a227;
}

.countdown-item span {
  font-size: 28px;
  font-weight: 700;
  color: #c9a227;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.countdown-item small {
  font-size: 10px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #999;
  margin-top: 6px;
}

.next-session-name {
  font-size: 14px;
  color: #ddd;
  margin-bottom: 22px;
}

/* ریسپانسیو */
@media (max-width: 768px) {
  .floating-cta {
    bottom: 80px;
    left: 16px;
    padding: 10px 14px;
    font-size: 12px;
  }

  .floating-cta-text { display: none; }
  .floating-cta-icon { font-size: 20px; }

  .classes-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 16px;
  }

  .class-number { font-size: 100px; }

  .next-session {
    margin: 40px 16px 0;
    padding: 26px 18px;
  }

  .countdown-item {
    min-width: 58px;
    padding: 10px 6px;
  }

  .countdown-item span { font-size: 20px; }
}
