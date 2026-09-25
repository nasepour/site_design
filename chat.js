/* =========================================================
   ARTIST CHAT — COMPLETE FINAL VERSION
   Shadow DOM + Knowledge Base + Fallback Styles
   ========================================================= */
(function () {
  'use strict';

  if (window.__ARTIST_CHAT_LOADED__) return;
  window.__ARTIST_CHAT_LOADED__ = true;

  console.log('🔵 Chat: شروع به کار');

  /* =========================================================
     1) KNOWLEDGE BASE
  ========================================================= */
  const KB = [
    {
      keys: ['سلام','درود','hi','hello','hey','صبح بخیر'],
      reply: 'سلام! 😊 چطور می‌تونم کمکتون کنم؟ درباره نقاشی‌ها، پرینت‌ها، کلاس‌ها یا هر چیز دیگه بپرسید.'
    },
    {
      keys: ['ممنون','مرسی','thanks','thank you','سپاس'],
      reply: 'خواهش می‌کنم! 🙏 اگه سوال دیگه‌ای دارید در خدمتم.'
    },
    {
      keys: ['نقاشی','نقاشي','painting','تابلو','اثر','آثار','گالری','gallery','collection'],
      reply: '<strong>🖼️ مجموعه نقاشی‌ها</strong><br><br>ما مجموعه‌ای از نقاشی‌های اصیل و دست‌ساز داریم:<ul><li>🎨 رنگ روغن</li><li>💧 آبرنگ</li><li>✏️ طراحی</li></ul><a href="paintings.html" target="_blank">مشاهده همه نقاشی‌ها →</a>'
    },
    {
      keys: ['قلم','قلم‌مو','brush','brushes','ابزار','tools'],
      reply: '<strong>🖌️ قلم‌موهای حرفه‌ای</strong><br><br>مجموعه <em>Fine Detail Professional Brush Set</em> برای کارهای دقیق.<br><br><a href="brushes.html" target="_blank">مشاهده قلم‌موها →</a>'
    },
    {
      keys: ['پرینت','چاپ','print','prints','limited','لیمیتد','خرید'],
      reply: '<strong>🖨️ پرینت‌های محدود</strong><br><br>هر پرینت با شماره سریال و امضای هنرمند.<br><br><a href="prints.html" target="_blank">خرید پرینت‌ها →</a>'
    },
    {
      keys: ['ویدیو','فیلم','video','process','پروسه'],
      reply: '<strong>🎬 ویدیوها</strong><br><br>فرآیند خلق آثار و تکنیک‌ها.<br><br><a href="videos.html" target="_blank">تماشای ویدیوها →</a>'
    },
    {
      keys: ['کلاس','classes','workshop','کارگاه','آموزش','دوره','learn','یادگیری'],
      reply: '<strong>🎓 کلاس‌های نقاشی</strong><br><br><ul><li>🟢 Beginner — آنلاین، ۴۹$</li><li>🔵 Advanced Oil — حضوری، ۷۹$</li><li>🟣 Watercolor — آنلاین، ۳۹$</li><li>🟡 Private — هیبرید، ۱۲۰$</li></ul><a href="contact.html" target="_blank">ثبت‌نام →</a>'
    },
    {
      keys: ['تماس','contact','ارتباط','ایمیل','email','شماره','phone'],
      reply: '📞 برای تماس به صفحه <a href="contact.html" target="_blank">Contact</a> مراجعه کنید.'
    },
    {
      keys: ['درباره','about','هنرمند','artist','بیوگرافی','bio'],
      reply: '👤 در صفحه <a href="about.html" target="_blank">About</a> داستان هنری رو بخونید.'
    },
    {
      keys: ['قیمت','price','هزینه','cost','چند','دلار'],
      reply: '<strong>💰 قیمت‌ها</strong><br><br><ul><li>پرینت‌ها: از ۳۹$</li><li>کلاس آنلاین: ۳۹-۴۹$</li><li>کلاس حضوری: ۷۹$</li><li>خصوصی: ۱۲۰$</li></ul>'
    },
    {
      keys: ['عکس','تصویر سایت','image','photo','picture','jpg','png','تصاویر'],
      reply: '<strong>🖼️ راهنمای تصاویر سایت</strong><br><br><ul><li><code>hero.jpg</code> — هدر</li><li><code>paintings.jpg</code> — نقاشی‌ها</li><li><code>brushes.jpg</code> — قلم‌موها</li><li><code>prints.jpg</code> — پرینت‌ها</li><li><code>video-01.jpg</code> — ویدیو</li><li><code>press-1.jpg</code> تا <code>press-4.jpg</code> — مطبوعات</li></ul>'
    }
  ];

  /* =========================================================
     2) SHADOW DOM SETUP
  ========================================================= */
  const host = document.createElement('div');
  host.id = 'artist-chat-root';
  document.body.appendChild(host);
  console.log('🔵 Host اضافه شد');

  const shadow = host.attachShadow({ mode: 'open' });
  console.log('🔵 Shadow DOM ساخته شد');

  /* --- CSS Link --- */
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  // ⚠️ اگه chat.css داخل پوشه chat/ هست، بنویسید: 'chat/chat.css'
  link.href = 'chat.css';
  link.onload = () => console.log('✅ CSS لود شد');
  link.onerror = () => console.warn('⚠️ CSS لود نشد - از استایل اضطراری استفاده می‌شه');
  shadow.appendChild(link);

  /* --- استایل اضطراری (در صورت لود نشدن chat.css) --- */
  const fallback = document.createElement('style');
  fallback.textContent = `
    .chat-toggle {
      position: fixed !important;
      bottom: 26px !important;
      right: 26px !important;
      width: 62px !important;
      height: 62px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #1a1410 0%, #2c1810 100%) !important;
      color: #fff !important;
      font-size: 28px !important;
      border: 2px solid #c9a227 !important;
      cursor: pointer !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 12px 35px rgba(0,0,0,0.4), 0 0 0 0 rgba(201,162,39,0.6) !important;
      pointer-events: auto !important;
      transition: all .35s ease !important;
      font-family: sans-serif !important;
    }
    .chat-toggle:hover {
      transform: scale(1.08) rotate(-6deg) !important;
      background: linear-gradient(135deg, #c9a227 0%, #8b6f1a 100%) !important;
    }
    .chat-badge {
      position: absolute !important;
      top: -4px !important;
      right: -4px !important;
      background: #e63946 !important;
      color: #fff !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      min-width: 22px !important;
      height: 22px !important;
      border-radius: 999px !important;
      display: grid !important;
      place-items: center !important;
      border: 2px solid #fff !important;
      padding: 0 5px !important;
    }
  `;
  shadow.appendChild(fallback);

  /* =========================================================
     3) HTML
  ========================================================= */
  const html = `
    <button class="chat-toggle" id="chatToggle" aria-label="Open chat">
      <span class="chat-icon-chat">💬</span>
      <span class="chat-icon-close" style="display:none">×</span>
      <span class="chat-badge" id="chatBadge">1</span>
    </button>

    <div class="chat-box" id="chatBox">
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
          <button class="chat-action-btn" id="chatClearBtn" title="پاک کردن" aria-label="Clear">🗑</button>
          <button class="chat-action-btn chat-close" id="chatClose" aria-label="Close">×</button>
        </div>
      </div>

      <div class="chat-suggestions" id="chatSuggestions">
        <button data-ask="نقاشی‌ها رو نشونم بده">🖼️ نقاشی‌ها</button>
        <button data-ask="پرینت‌ها چیه؟">🖨️ پرینت‌ها</button>
        <button data-ask="کلاس‌های نقاشی">🎓 کلاس‌ها</button>
        <button data-ask="قیمت‌ها چنده؟">💰 قیمت‌ها</button>
      </div>

      <div class="chat-messages" id="chatMessages"></div>

      <div class="chat-typing" id="chatTyping" hidden>
        <div class="chat-typing-bubble">
          <span></span><span></span><span></span>
        </div>
      </div>

      <form class="chat-form" id="chatForm" autocomplete="off">
        <div class="chat-input-wrap">
          <textarea id="chatInput" placeholder="سوالت رو بنویس..." rows="1" maxlength="1000"></textarea>
          <button type="submit" class="chat-send-btn" id="chatSendBtn" aria-label="Send">➤</button>
        </div>
      </form>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while (wrapper.firstChild) shadow.appendChild(wrapper.firstChild);
  console.log('🔵 HTML اضافه شد — تعداد فرزندان:', shadow.children.length);

  /* =========================================================
     4) LOGIC
  ========================================================= */
  const $ = id => shadow.getElementById(id);
  const chatToggle = $('chatToggle');
  const chatBox = $('chatBox');
  const chatClose = $('chatClose');
  const chatForm = $('chatForm');
  const chatInput = $('chatInput');
  const chatMessages = $('chatMessages');
  const chatTyping = $('chatTyping');
  const chatBadge = $('chatBadge');
  const suggestions = $('chatSuggestions');
  const chatClearBtn = $('chatClearBtn');

  if (!chatToggle || !chatBox) {
    console.error('❌ عناصر اصلی چت پیدا نشد');
    return;
  }
  console.log('✅ همه عناصر پیدا شدند');

  /* --- helpers --- */
  const timeNow = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };

  function addMessage(text, sender, isHTML) {
    sender = sender || 'bot';
    isHTML = isHTML || false;

    const wrap = document.createElement('div');
    wrap.className = 'chat-message ' + sender;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    if (isHTML) bubble.innerHTML = text;
    else bubble.textContent = text;

    const time = document.createElement('span');
    time.className = 'msg-time';
    time.textContent = timeNow();

    wrap.appendChild(bubble);
    wrap.appendChild(time);
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping(show) {
    chatTyping.hidden = !show;
    if (show) chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /* --- answer engine --- */
  function findAnswer(text) {
    const q = text.toLowerCase().trim();
    let best = null, bestScore = 0;
    for (let i = 0; i < KB.length; i++) {
      const item = KB[i];
      let score = 0;
      for (let j = 0; j < item.keys.length; j++) {
        if (q.indexOf(item.keys[j].toLowerCase()) !== -1) score += item.keys[j].length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }
    if (best && bestScore >= 2) return best.reply;
    return 'متوجه نشدم 🤔 ولی می‌تونم در این موارد کمکت کنم:<ul><li>🖼️ نقاشی‌ها</li><li>🖌️ قلم‌موها</li><li>🖨️ پرینت‌ها</li><li>🎬 ویدیوها</li><li>🎓 کلاس‌ها</li><li>💰 قیمت‌ها</li><li>📸 راهنمای تصاویر</li></ul>یا از دکمه‌های بالا استفاده کن.';
  }

  /* --- send --- */
  function sendMessage(text) {
    if (!text || !text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    showTyping(true);
    const delay = 500 + Math.random() * 600;
    setTimeout(function () {
      showTyping(false);
      addMessage(findAnswer(text), 'bot', true);
    }, delay);
  }

  /* --- events --- */
  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    sendMessage(chatInput.value);
  });

  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });

  chatInput.addEventListener('input', function () {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  if (suggestions) {
    suggestions.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      sendMessage(btn.dataset.ask || btn.textContent);
    });
  }

  chatToggle.addEventListener('click', function () {
    const isOpen = chatBox.classList.toggle('open');
    const iconChat = chatToggle.querySelector('.chat-icon-chat');
    const iconClose = chatToggle.querySelector('.chat-icon-close');
    if (iconChat && iconClose) {
      iconChat.style.display = isOpen ? 'none' : 'inline';
      iconClose.style.display = isOpen ? 'inline' : 'none';
    }
    if (isOpen) {
      if (chatBadge) chatBadge.style.display = 'none';
      setTimeout(function () { chatInput.focus(); }, 300);
    }
  });

  chatClose.addEventListener('click', function () {
    chatBox.classList.remove('open');
    const iconChat = chatToggle.querySelector('.chat-icon-chat');
    const iconClose = chatToggle.querySelector('.chat-icon-close');
    if (iconChat && iconClose) {
      iconChat.style.display = 'inline';
      iconClose.style.display = 'none';
    }
  });

  if (chatClearBtn) {
    chatClearBtn.addEventListener('click', function () {
      if (!confirm('تاریخچه چت پاک بشه؟')) return;
      chatMessages.innerHTML = '';
      addMessage('تاریخچه پاک شد. چطور می‌تونم کمکتون کنم؟ 😊', 'bot');
    });
  }

  /* --- welcome message --- */
  addMessage('سلام! 👋 من دستیار هنری شما هستم.<br>می‌تونم درباره <strong>نقاشی‌ها</strong>، <strong>پرینت‌ها</strong>، <strong>قلم‌موها</strong>، <strong>کلاس‌ها</strong> و هر بخش دیگه‌ای راهنماییتون کنم.', 'bot', true);

  /* --- badge hide after 4s --- */
  setTimeout(function () {
    if (!chatBox.classList.contains('open') && chatBadge) {
      chatBadge.style.display = 'grid';
    }
  }, 4000);

  console.log('✅ چت با موفقیت راه‌اندازی شد');

})();
