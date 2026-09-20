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
