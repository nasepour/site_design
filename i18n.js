// ==========================================
// i18n.js — سیستم دوزبانه کردن سایت
// ==========================================

const DEFAULT_LANG = 'en';

async function setLanguage(lang) {
  try {
    const response = await fetch('translations.json');
    if (!response.ok) throw new Error('translations.json not found');
    const translations = await response.json();
    const texts = translations[lang];

    if (!texts) return;

    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.getAttribute('data-lang-key');
      if (!texts[key]) return;

      if (el.hasAttribute('placeholder')) {
        el.setAttribute('placeholder', texts[key]);
      } else if (el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', texts[key]);
      } else {
        el.textContent = texts[key];
      }
    });

    localStorage.setItem('siteLang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

  } catch (error) {
    console.error('Translation error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('siteLang')
    || (navigator.language.startsWith('fa') ? 'fa' : 'en');

  setLanguage(savedLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setLanguage(btn.dataset.lang);
    });
  });
});
