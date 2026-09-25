/* =========================================================
   ARTIST CHAT — ALL IN ONE (Shadow DOM + Image Gen)
   ترکیب Playground AI + Pollinations برای تولید تصویر
   ========================================================= */
(function () {
  'use strict';

  if (window.__ARTIST_CHAT_LOADED__) return;
  window.__ARTIST_CHAT_LOADED__ = true;

  /* =========================================================
     1) KNOWLEDGE BASE
  ========================================================= */
  const KB = [
    {
      keys: ['سلام','درود','hi','hello','hey'],
      reply: 'سلام! 😊 چطور می‌تونم کمکتون کنم؟ درباره نقاشی‌ها، پرینت‌ها، کلاس‌ها یا هر چیز دیگه بپرسید.'
    },
    {
      keys: ['ممنون','مرسی','thanks','thank you','سپاس'],
      reply: 'خواهش می‌کنم! 🙏 اگه سوال دیگه‌ای دارید در خدمتم.'
    },
    {
      keys: ['نقاشی','نقاشي','painting','تابلو','اثر','آثار','گالری','gallery','collection'],
      reply: `<strong>🖼️ مجموعه نقاشی‌ها</strong><br><br>
        ما مجموعه‌ای از نقاشی‌های اصیل و دست‌ساز داریم:
        <ul>
          <li>🎨 رنگ روغن (Oil)</li>
          <li>💧 آبرنگ (Watercolor)</li>
          <li>✏️ طراحی و اسکچ</li>
        </ul>
        <a href="paintings.html" target="_blank">مشاهده همه نقاشی‌ها →</a>`
    },
    {
      keys: ['قلم','قلم‌مو','brush','brushes','ابزار','tools'],
      reply: `<strong>🖌️ قلم‌موهای حرفه‌ای</strong><br><br>
        مجموعه <em>Fine Detail Professional Brush Set</em> برای کارهای دقیق طراحی شده.
        <br><br><a href="brushes.html" target="_blank">مشاهده قلم‌موها →</a>`
    },
    {
      keys: ['پرینت','چاپ','print','prints','limited','لیمیتد','خرید'],
      reply: `<strong>🖨️ پرینت‌های محدود</strong><br><br>
        هر پرینت با شماره سریال و امضای هنرمند ارائه می‌شه.
        <br><br><a href="prints.html" target="_blank">خرید پرینت‌ها →</a>`
    },
    {
      keys: ['ویدیو','فیلم','video','process','پروسه'],
      reply: `<strong>🎬 ویدیوها</strong><br><br>
        فرآیند خلق آثار و تکنیک‌ها رو از نزدیک ببینید.
        <br><br><a href="videos.html" target="_blank">تماشای ویدیوها →</a>`
    },
    {
      keys: ['کلاس','classes','workshop','کارگاه','آموزش','دوره','learn','یادگیری'],
      reply: `<strong>🎓 کلاس‌های نقاشی</strong><br><br>
        <ul>
          <li>🟢 <strong>Beginner</strong> — آنلاین، شنبه‌ها، ۴۹$</li>
          <li>🔵 <strong>Advanced Oil</strong> — حضوری، ۷۹$</li>
          <li>🟣 <strong>Watercolor</strong> — آنلاین، ۳۹$</li>
          <li>🟡 <strong>Private</strong> — هیبرید، ۱۲۰$</li>
        </ul>
        <a href="contact.html" target="_blank">ثبت‌نام →</a>`
    },
    {
      keys: ['تماس','contact','ارتباط','ایمیل','email','شماره','phone'],
      reply: `📞 برای تماس به صفحه <a href="contact.html" target="_blank">Contact</a> مراجعه کنید.`
    },
    {
      keys: ['درباره','about','هنرمند','artist','بیوگرافی','bio'],
      reply: `👤 در صفحه <a href="about.html" target="_blank">About</a> می‌تونید داستان هنری رو بخونید.`
    },
    {
      keys: ['قیمت','price','هزینه','cost','چند','دلار','$'],
      reply: `<strong>💰 قیمت‌ها</strong><br><br>
        <ul>
          <li>پرینت‌ها: از ۳۹$</li>
          <li>کلاس آنلاین: ۳۹$ - ۴۹$</li>
          <li>کلاس حضوری: ۷۹$</li>
          <li>کلاس خصوصی: ۱۲۰$</li>
        </ul>`
    },
    {
      keys: ['عکس','تصویر سایت','image','photo','picture','jpg','png','تصاویر'],
      reply: `<strong>🖼️ راهنمای تصاویر سایت</strong><br><br>
        <ul>
          <li><code>hero.jpg</code> — هدر</li>
          <li><code>paintings.jpg</code> — نقاشی‌ها</li>
          <li><code>brushes.jpg</code> — قلم‌موها</li>
          <li><code>prints.jpg</code> — پرینت‌ها</li>
          <li><code>video-01.jpg</code> — پیش‌نمایش ویدیو</li>
          <li><code>press-1.jpg</code> تا <code>press-4.jpg</code> — مطبوعات</li>
        </ul>`
    }
  ];

  /* =========================================================
     2) SHADOW DOM SETUP
  ========================================================= */
  const host = document.createElement('div');
  host.id = 'artist-chat-root';
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999999;';
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  const BASE = (function () {
    const s = document.currentScript || document.querySelector('script[src*="chat/chat.js"]');
    if (!s) return 'chat/';
    return s.src.replace(/chat\.js.*$/, '');
  })();

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = BASE + 'chat.css';
  shadow.appendChild(link);

  /* =========================================================
     3) HTML
  ========================================================= */
  const html = `
    <button class="chat-toggle" id="chatToggle" aria-label="Open chat">
      <svg class="chat-icon chat-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg class="chat-icon chat-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span class="chat-badge" id="chatBadge">1</span>
    </button>

    <div class="chat-box" id="chatBox" role="dialog" aria-hidden="true">
      <div class="chat-header">
        <div class="chat-header-left">
          <div class="chat-avatar">
            <span>🎨</span>
            <span class="chat-avatar-status"></span>
          </div>
          <div class="chat-header-meta">
            <strong>دستیار هنری</strong>
            <span class="chat-status">
              <span class="chat-status-dot"></span>
              <span>آنلاین — پاسخ فوری</span>
            </span>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-action-btn" id="chatClearBtn" title="پاک کردن" aria-label="Clear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/>
            </svg>
          </button>
          <button class="chat-action-btn" id="chatDownloadBtn" title="دانلود" aria-label="Download">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          <button class="chat-action-btn" id="chatThemeBtn" title="تغییر تم" aria-label="Theme">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </button>
          <button class="chat-close chat-action-btn" id="chatClose" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="chat-suggestions" id="chatSuggestions">
        <button data-ask="نقاشی‌ها رو نشونم بده">🖼️ نقاشی‌ها</button>
        <button data-ask="پرینت‌ها چیه؟">🖨️ پرینت‌ها</button>
        <button data-ask="کلاس‌های نقاشی">🎓 کلاس‌ها</button>
        <button data-ask="راهنمای تصاویر سایت">📸 راهنمای عکس</button>
        <button data-ask="قیمت‌ها چنده؟">💰 قیمت‌ها</button>
      </div>

      <div class="chat
