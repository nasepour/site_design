/* =========================================================
   ARTIST CHAT — COMPLETE VERSION
   Shadow DOM + Knowledge Base + Image Gen
   ========================================================= */
(function () {
  'use strict';

  if (window.__ARTIST_CHAT_LOADED__) return;
  window.__ARTIST_CHAT_LOADED__ = true;

  console.log('🔵 Chat: شروع به کار');

  /* =========================================================
     1) KNOWLEDGE BASE — دانش‌نامه
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
      keys: ['قیمت','price','هزینه','cost','چند','دلار'],
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
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647;';
  document.body.appendChild(host);
  console.log('🔵 Host اضافه شد');

  const shadow = host.attachShadow({ mode: 'open' });
  console.log('🔵 Shadow DOM ساخته شد');

  /* --- CSS لود --- */
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  // ⚠️ اگه فایل داخل پوشه chat/ هست، این خط رو به 'chat/chat.css' تغییر بدید
  link.href = 'chat.css';
  link.onload = () => console.log('🔵 CSS لود شد:', link.href);
  link.onerror = () => console.error('❌ CSS لود نشد:', link.href);
  shadow.appendChild(link);

  /* --- استایل اضطراری (در صورت لود نشدن CSS) --- */
  const fallbackStyle = document.createElement('style');
  fallbackStyle.textContent = `
    .chat-toggle {
      position: fixed !important;
      bottom: 26px !important;
      right: 26px !important;
      width: 62px !important;
      height: 62px !important;
      border-radius: 50% !important;
      background: #0a0a0a !important;
      color: #fff !important;
      font-size: 26px !important;
      border: none !important;
      cursor: pointer !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 12px 35px rgba(0,0,0,0.35) !important;
      pointer-events: auto !important;
      transition: transform .3s, background .3s !important;
    }
    .chat-toggle:hover {
      transform: scale(1.08) !important;
      background: #c9a227 !important;
    }
  `;
  shadow.appendChild(fallbackStyle);

  /* =========================================================
     3) HTML چت
  ========================================================= */
  const html = `
    <button class="chat-toggle" id="chatToggle" aria-label="Open chat">
      <span class="chat-icon chat-icon-chat">💬</span>
      <span class="chat-icon chat-icon-close" style="display:none">×</span>
      <span class="chat-badge" id="chatBadge" style="
        position:absolute;top:-2px;right:-2px;
        background:#e63946;color:#fff;font-size:11px;font-weight:700;
        min-width:22px;height:22px;border-radius:999px;padding:0 6px;
        display:grid;place-items:center;border:2px solid #fff;
      ">1</span>
    </button>

    <div class="chat-box" id="chatBox" style="
      position:fixed;bottom:100px;right:26px;
      width:400px;max-width:calc(100vw - 32px);
      height:620px;max-height:calc(100vh - 130px);
      background:#fff;border-radius:22px;
      box-shadow:0 25px 70px rgba(0,0,0,0.28);
      display:flex;flex-direction:column;overflow:hidden;
      opacity:0;transform:translateY(30px) scale(.94);
      pointer-events:none;
      transition:opacity .35s ease, transform .45s cubic-bezier(.2,.9,.3,1.3);
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Vazirmatn',Tahoma,sans-serif;
      z-index:2147483647;color:#1a1a1a;
    ">
      <!-- Header -->
      <div class="chat-header" style="
        display:flex;justify-content:space-between;align-items:center;
        padding:14px 16px;background:linear-gradient(135deg,#0a0a0a 0%,#1f1f22 100%);
        color:#fff;flex-shrink:0;
      ">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="
            position:relative;width:44px;height:44px;border-radius:50%;
            background:linear-gradient(135deg,#c9a227,#8a6d15);
            display:grid;place-items:center;font-size:20px;
            box-shadow:0 0 0 3px rgba(201,162,39,0.25);
          ">
            <span>🎨</span>
            <span style="
              position:absolute;bottom:1px;right:1px;width:12px;height:12px;
              border-radius:50%;background:#22c55e;border:2px solid #0a0a0a;
            "></span>
          </div>
          <div>
            <strong style="display:block;font-size:14.5px;font-weight:700">دستیار هنری</strong>
            <span style="display:flex;align-items:center;gap:5px;font-size:11.5px;color:#a8e6a8;margin-top:2px">
              <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block"></span>
              آنلاین — پاسخ فوری
            </span>
          </div>
        </div>
        <div style="display:flex;gap:4px">
          <button class="chat-action-btn" id="chatClearBtn" title="پاک کردن" style="
            width:32px;height:32px;border-radius:50%;border:none;background:transparent;
            color:#fff;cursor:pointer;display:grid;place-items:center;font-size:16px;
          ">🗑</button>
          <button class="chat-close chat-action-btn" id="chatClose" aria-label="Close" style="
            width:32px;height:32px;border-radius:50%;border:none;background:transparent;
            color:#fff;cursor:pointer;display:grid;place-items:center;font-size:20px;
          ">×</button>
        </div>
      </div>

      <!-- Suggestions -->
      <div class="chat-suggestions" id="chatSuggestions" style="
        display:flex;gap:6px;padding:10px 12px;overflow-x:auto;
        border-bottom:1px solid #ebebeb;background:#fafafa;flex-shrink:0;
        scrollbar-width:none;
      ">
        <button data-ask="نقاشی‌ها رو نشونم بده" style="flex:0 0 auto;background:#fff;border:1px solid #ebebeb;border-radius:999px;padding:7px 14px;font-size:12.5px;cursor:pointer;white-space:nowrap;font-family:inherit">🖼️ نقاشی‌ها</button>
        <button data-ask="پرینت‌ها چیه؟" style="flex:0 0 auto;background:#fff;border:1px solid #ebebeb;border-radius:999px;padding:7px 14px;font-size:12.5px;cursor:pointer;white-space:nowrap;font-family:inherit">🖨️ پرینت‌ها</button>
        <button data-ask="کلاس‌های نقاشی" style="flex:0 0 auto;background:#fff;border:1px solid #ebebeb;border-radius:999px;padding:7px 14px;font-size:12.5px;cursor:pointer;white-space:nowrap;font-family:inherit">🎓 کلاس‌ها</button>
        <button data-ask="قیمت‌ها چنده؟" style="flex:0 0 auto;background:#fff;border:1px solid #ebebeb;border-radius:999px;padding:7px 14px;font-size:12.5px;cursor:pointer;white-space:nowrap;font-family:inherit">💰 قیمت‌ها</button>
      </div>

      <!-- Messages -->
      <div class="chat-messages" id="chatMessages" style="
        flex:1;overflow-y:auto;padding:18px 16px 8px;
        display:flex;flex-direction:column;gap:14px;
        background:#f7f7f8;scroll-behavior:smooth;
      "></div>

      <!-- Typing -->
      <div class="chat-typing" id="chatTyping" hidden style="padding:0 16px 10px;background:#f7f7f8">
        <div style="display:inline-flex;gap:5px;padding:12px 16px;background:#f1f1f3;border-radius:18px;border-bottom-left-radius:5px">
          <span style="width:8px;height:8px;border-radius:50%;background:#999;animation:typing 1.3s infinite"></span>
          <span style="width:8px;height:8px;border-radius:50%;background:#999;animation:typing 1.3s infinite .18s"></span>
          <span style="width:8px;height:8px;border-radius:50%;background:#999;animation:typing 1.3s infinite .36s"></span>
        </div>
      </div>

      <!-- Form -->
      <form class="chat-form" id="chatForm" autocomplete="off" style="
        padding:10px 12px;background:#fff;border-top:1px solid #ebebeb;flex-shrink:0;
      ">
        <div style="
          display:flex;align-items:flex-end;gap:6px;
          background:#fafafa;border:1px solid #ebebeb;border-radius:22px;padding:6px;
        ">
          <textarea id="chatInput" placeholder="سوالت رو بنویس..." rows="1" maxlength="1000" style="
            flex:1;border:none;background:transparent;resize:none;outline:none;
            font-family:inherit;font-size:13.5px;line-height:1.5;color:#1a1a1a;
            padding:8px 4px;max-height:120px;min-height:22px;
          "></textarea>
          <button type="submit" id="chatSendBtn" aria-label="Send" style="
            width:38px;height:38px;border-radius:50%;border:none;
            background:#0a0a0a;color:#fff;cursor:pointer;
            display:grid;place-items:center;flex-shrink:0;font-size:16px;
          ">➤</button>
        </div>
      </form>
    </div>

    <style>
      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); opacity: .45; }
        30% { transform: translateY(-7px); opacity: 1; }
      }
      .chat-box.open {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
        pointer-events: auto !important;
      }
      .chat-message {
        display: flex; flex-direction: column; max-width: 88%;
        animation: msgIn .4s cubic-bezier(.2,.9,.3,1.2);
        word-wrap: break-word;
      }
      @keyframes msgIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .chat-message.bot { align-self: flex-start; }
      .chat-message.user { align-self: flex-end; align-items: flex-end; }
      .msg-bubble {
        padding: 11px 15px; border-radius: 18px;
        font-size: 13.5px; line-height: 1.6; word-break: break-word;
      }
      .chat-message.bot .msg-bubble {
        background: #f1f1f3; color: #1a1a1a; border-bottom-left-radius: 5px;
      }
      .chat-message.user .msg-bubble {
        background: linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%);
        color: #fff; border-bottom-right-radius: 5px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      }
      .msg-time {
        font-size: 10px; color: #6b6b6b; margin-top: 4px;
        padding: 0 6px; opacity: 0; transition: opacity .3s;
      }
      .chat-message:hover .msg-time { opacity: 1; }
      .msg-bubble a { color: #c9a227; text-decoration: none; font-weight: 600; }
      .msg-bubble ul { margin: 6px 0; padding-inline-start: 20px; }
      .msg-bubble li { margin-bottom: 4px; }
      .msg-bubble code {
        background: rgba(0,0,0,0.08); padding: 1px 6px;
        border-radius: 4px; font-size: 12px; font-family: monospace;
      }
      .chat-suggestions::-webkit-scrollbar { display: none; }
      .chat-messages::-webkit-scrollbar { width: 6px; }
      .chat-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
    </style>
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
  console.log('🔵 همه عناصر پیدا شدند');

  /* --- helpers --- */
  const timeNow = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  };

  const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  function addMessage(text, sender = 'bot', isHTML = false) {
    const wrap = document.createElement('div');
    wrap.className = `chat-message ${sender}`;
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
    for (const item of KB) {
      let score = 0;
      item.keys.forEach(kw => {
        if (q.includes(kw.toLowerCase())) score += kw.length;
      });
      if (score > bestScore) { bestScore = score; best = item; }
    }
    if (best && bestScore >= 2) return best.reply;
    return `متوجه نشدم 🤔 ولی می‌تونم در این موارد کمکت کنم:
      <ul>
        <li>🖼️ نقاشی‌ها</li>
        <li>🖌️ قلم‌موها</li>
        <li>🖨️ پرینت‌ها</li>
        <li>🎬 ویدیوها</li>
        <li>🎓 کلاس‌ها</li>
        <li>💰 قیمت‌ها</li>
        <li>📸 راهنمای تصاویر</li>
      </ul>
      یا از دکمه‌های بالا استفاده کن.`;
  }

  /* --- send --- */
  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    showTyping(true);
    const delay = 500 + Math.random() * 600;
    setTimeout(() => {
      showTyping(false);
      addMessage(findAnswer(text), 'bot', true);
    }, delay);
  }

  /* --- events --- */
  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    sendMessage(chatInput.value);
  });

  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  if (suggestions) {
    suggestions.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      sendMessage(btn.dataset.ask || btn.textContent);
    });
  }

  chatToggle.addEventListener('click', () => {
    const isOpen = chatBox.classList.toggle('open');
    const iconChat = chatToggle.querySelector('.chat-icon-chat');
    const iconClose = chatToggle.querySelector('.chat-icon-close');
    if (iconChat && iconClose) {
      iconChat.style.display = isOpen ? 'none' : 'inline';
      iconClose.style.display = isOpen ? 'inline' : 'none';
    }
    if (isOpen) {
      if (chatBadge) chatBadge.style.display = 'none';
      setTimeout(() => chatInput.focus(), 300);
    }
  });

  chatClose.addEventListener('click', () => {
    chatBox.classList.remove('open');
    const iconChat = chatToggle.querySelector('.chat-icon-chat');
    const iconClose = chatToggle.querySelector('.chat-icon-close');
    if (iconChat && iconClose) {
      iconChat.style.display = 'inline';
      iconClose.style.display = 'none';
    }
  });

  if (chatClearBtn) {
    chatClearBtn.addEventListener('click', () => {
      if (!confirm('تاریخچه چت پاک بشه؟')) return;
      chatMessages.innerHTML = '';
      addMessage('تاریخچه پاک شد. چطور می‌تونم کمکتون کنم؟ 😊', 'bot');
    });
  }

  /* --- welcome message --- */
  addMessage(`سلام! 👋 من دستیار هنری شما هستم.
می‌تونم درباره <strong>نقاشی‌ها</strong>، <strong>پرینت‌ها</strong>، <strong>قلم‌موها</strong>، <strong>کلاس‌ها</strong> و هر بخش دیگه‌ای راهنماییتون کنم.`, 'bot', true);

  /* --- badge hide after 4s --- */
  setTimeout(() => {
    if (!chatBox.classList.contains('open') && chatBadge) {
      chatBadge.style.display = 'grid';
    }
  }, 4000);

  console.log('✅ چت با موفقیت راه‌اندازی شد');

})();
