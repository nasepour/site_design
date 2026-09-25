/* =========================================================
   ARTIST CHAT — WORKING VERSION
   ========================================================= */
(function () {
  'use strict';

  if (window.__ARTIST_CHAT_LOADED__) return;
  window.__ARTIST_CHAT_LOADED__ = true;

  console.log('🔵 Chat: شروع');

  // =========================================================
  // دانش‌نامه هوشمند داخلی (بدون نیاز به اینترنت)
  // =========================================================
  const KB = [
    {
      keys: ['سلام','درود','hi','hello','hey'],
      reply: 'سلام! 😊 خوش آمدید به گالری هنری. چطور می‌تونم کمکتون کنم؟ درباره نقاشی‌ها، کلاس‌ها، پرینت‌ها یا هر چیز دیگه بپرسید.'
    },
    {
      keys: ['ممنون','مرسی','thanks','thank'],
      reply: 'خواهش می‌کنم! 🙏 اگه سوال دیگه‌ای دارید در خدمتم.'
    },
    {
      keys: ['اسم','نام','کی هستی','who are you'],
      reply: 'من دستیار هنری این گالری هستم 🎨 می‌تونم درباره نقاشی‌ها، کلاس‌ها، پرینت‌ها، قلم‌موها و هر بخش سایت راهنماییتون کنم.'
    },
    {
      keys: ['نقاشی','painting','تابلو','اثر','گالری','collection'],
      reply: '🖼️ <strong>مجموعه نقاشی‌ها</strong><br><br>ما نقاشی‌های اصیل دست‌ساز داریم:<ul><li>🎨 رنگ روغن</li><li>💧 آبرنگ</li><li>✏️ طراحی</li></ul><a href="paintings.html">مشاهده همه نقاشی‌ها →</a>'
    },
    {
      keys: ['قلم','brush','قلم‌مو'],
      reply: '🖌️ <strong>قلم‌موهای حرفه‌ای</strong><br><br>مجموعه <em>Fine Detail Professional Brush Set</em>.<br><br><a href="brushes.html">مشاهده قلم‌موها →</a>'
    },
    {
      keys: ['پرینت','print','چاپ','خرید'],
      reply: '🖨️ <strong>پرینت‌های محدود</strong><br><br>هر پرینت با شماره سریال و امضای هنرمند.<br><br><a href="prints.html">خرید پرینت‌ها →</a>'
    },
    {
      keys: ['ویدیو','video','فیلم'],
      reply: '🎬 <strong>ویدیوها</strong><br><br>فرآیند خلق آثار رو ببینید.<br><br><a href="videos.html">تماشای ویدیوها →</a>'
    },
    {
      keys: ['کلاس','class','workshop','آموزش','دوره'],
      reply: '🎓 <strong>کلاس‌های نقاشی</strong><br><br><ul><li>🟢 Beginner — آنلاین، ۴۹$</li><li>🔵 Advanced Oil — حضوری، ۷۹$</li><li>🟣 Watercolor — آنلاین، ۳۹$</li><li>🟡 Private — هیبرید، ۱۲۰$</li></ul><a href="contact.html">ثبت‌نام →</a>'
    },
    {
      keys: ['قیمت','price','هزینه','چند'],
      reply: '💰 <strong>قیمت‌ها</strong><br><br><ul><li>پرینت‌ها: از ۳۹$</li><li>کلاس آنلاین: ۳۹-۴۹$</li><li>کلاس حضوری: ۷۹$</li><li>خصوصی: ۱۲۰$</li></ul>'
    },
    {
      keys: ['تماس','contact','ارتباط','ایمیل'],
      reply: '📞 برای تماس به <a href="contact.html">صفحه Contact</a> مراجعه کنید.'
    },
    {
      keys: ['درباره','about','هنرمند'],
      reply: '👤 در <a href="about.html">صفحه About</a> داستان هنری رو بخونید.'
    },
    {
      keys: ['عکس','تصویر','image','photo'],
      reply: '🖼️ <strong>راهنمای تصاویر</strong><br><br><ul><li><code>hero.jpg</code> — هدر</li><li><code>paintings.jpg</code> — نقاشی‌ها</li><li><code>brushes.jpg</code> — قلم‌موها</li><li><code>prints.jpg</code> — پرینت‌ها</li></ul>'
    }
  ];

  // =========================================================
  // Shadow DOM
  // =========================================================
  const host = document.createElement('div');
  host.id = 'artist-chat-root';
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  // CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'chat.css';
  shadow.appendChild(link);

  // HTML
  const html = `
    <button class="chat-toggle" id="chatToggle" aria-label="Open chat">
      <span class="chat-icon-chat">🎨</span>
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
              <span>آنلاین</span>
            </span>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-action-btn chat-close" id="chatClose" aria-label="Close">×</button>
        </div>
      </div>

      <div class="chat-suggestions" id="chatSuggestions">
        <button data-ask="نقاشی‌ها">🖼️ نقاشی‌ها</button>
        <button data-ask="کلاس‌ها">🎓 کلاس‌ها</button>
        <button data-ask="پرینت‌ها">🖨️ پرینت‌ها</button>
        <button data-ask="قیمت‌ها">💰 قیمت‌ها</button>
      </div>

      <div class="chat-messages" id="chatMessages"></div>

      <div class="chat-typing" id="chatTyping" hidden>
        <div class="chat-typing-bubble">
          <span></span><span></span><span></span>
        </div>
      </div>

      <form class="chat-form" id="chatForm" autocomplete="off">
        <div class="chat-input-wrap">
          <textarea id="chatInput" placeholder="سوالت رو بنویس..." rows="1"></textarea>
          <button type="submit" class="chat-send-btn" aria-label="Send">➤</button>
        </div>
      </form>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while (wrapper.firstChild) shadow.appendChild(wrapper.firstChild);

  // =========================================================
  // استایل اضطراری (در صورت لود نشدن chat.css)
  // =========================================================
  const fallback = document.createElement('style');
  fallback.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .chat-toggle {
      position: fixed; bottom: 26px; right: 26px;
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #1a1410 0%, #2c1810 100%);
      color: #fff; font-size: 28px;
      border: 2px solid #c9a227; cursor: pointer;
      z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 12px 35px rgba(0,0,0,0.4);
      transition: all .3s;
      font-family: sans-serif;
    }
    .chat-toggle:hover { transform: scale(1.08); background: #c9a227; }
    .chat-badge {
      position: absolute; top: -4px; right: -4px;
      background: #e63946; color: #fff;
      font-size: 11px; font-weight: 700;
      min-width: 22px; height: 22px;
      border-radius: 999px; padding: 0 5px;
      display: grid; place-items: center;
      border: 2px solid #fff;
    }
    .chat-box {
      position: fixed; bottom: 105px; right: 26px;
      width: 400px; max-width: calc(100vw - 32px);
      height: 620px; max-height: calc(100vh - 130px);
      background: #faf6f0; border-radius: 12px;
      box-shadow: 0 30px 90px rgba(0,0,0,0.35), 0 0 0 2px #c9a227;
      display: flex; flex-direction: column; overflow: hidden;
      opacity: 0; transform: translateY(40px) scale(.94);
      pointer-events: none;
      transition: opacity .3s, transform .4s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
      z-index: 2147483647; color: #1a1410;
    }
    .chat-box.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
    .chat-header {
      background: linear-gradient(135deg, #2c1810 0%, #1a1410 100%);
      color: #fff; padding: 14px 18px;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #c9a227; flex-shrink: 0;
    }
    .chat-header-left { display: flex; align-items: center; gap: 12px; }
    .chat-avatar {
      position: relative; width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(135deg, #c9a227, #8b6f1a);
      display: grid; place-items: center; font-size: 20px;
    }
    .chat-avatar-status {
      position: absolute; bottom: 1px; right: 1px;
      width: 12px; height: 12px; border-radius: 50%;
      background: #22c55e; border: 2px solid #1a1410;
    }
    .chat-header-meta strong { display: block; font-size: 14px; color: #f4ebe0; }
    .chat-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #a8e6a8; margin-top: 2px; }
    .chat-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
    .chat-close {
      width: 32px; height: 32px; border-radius: 50%;
      border: 1px solid rgba(201,162,39,0.3); background: transparent;
      color: #f4ebe0; cursor: pointer; font-size: 20px; font-family: inherit;
    }
    .chat-suggestions {
      display: flex; gap: 6px; padding: 10px 12px;
      overflow-x: auto; border-bottom: 1px solid #ebebeb;
      background: #fafafa; flex-shrink: 0;
    }
    .chat-suggestions::-webkit-scrollbar { display: none; }
    .chat-suggestions button {
      flex: 0 0 auto; background: #fff;
      border: 1px solid #ebebeb; border-radius: 999px;
      padding: 7px 14px; font-size: 12px; cursor: pointer;
      white-space: nowrap; font-family: inherit; color: #1a1410;
    }
    .chat-suggestions button:hover { background: #1a1410; color: #fff; }
    .chat-messages {
      flex: 1; overflow-y: auto; padding: 18px;
      display: flex; flex-direction: column; gap: 14px;
      background: #f7f7f8;
    }
    .chat-message {
      display: flex; flex-direction: column; max-width: 88%;
      animation: msgIn .3s ease; word-wrap: break-word;
    }
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .chat-message.bot { align-self: flex-start; }
    .chat-message.user { align-self: flex-end; align-items: flex-end; }
    .msg-bubble {
      padding: 11px 15px; border-radius: 18px;
      font-size: 13.5px; line-height: 1.6; word-break: break-word;
    }
    .chat-message.bot .msg-bubble {
      background: #fffbf5; color: #1a1410;
      border-bottom-left-radius: 5px;
      border-left: 3px solid #c9a227;
      box-shadow: 0 2px 8px rgba(139,90,60,0.1);
    }
    .chat-message.user .msg-bubble {
      background: linear-gradient(135deg, #2c1810 0%, #0f0a07 100%);
      color: #f4ebe0; border-bottom-right-radius: 5px;
    }
    .msg-bubble a { color: #c9a227; font-weight: 600; }
    .msg-bubble ul { margin: 6px 0; padding-inline-start: 20px; }
    .msg-bubble li { margin-bottom: 4px; }
    .msg-bubble code {
      background: rgba(0,0,0,0.08); padding: 1px 6px;
      border-radius: 4px; font-size: 12px;
    }
    .msg-time { font-size: 10px; color: #8b5a3c; margin-top: 4px; padding: 0 6px; opacity: 0.7; }
    .chat-typing { padding: 0 18px 12px; background: #f7f7f8; }
    .chat-typing-bubble {
      display: inline-flex; gap: 5px; padding: 12px 16px;
      background: #fffbf5; border-radius: 18px;
      border-left: 3px solid #c9a227;
    }
    .chat-typing span {
      width: 8px; height: 8px; border-radius: 50%;
      background: #c9a227; animation: typing 1.3s infinite;
    }
    .chat-typing span:nth-child(2) { animation-delay: .18s; }
    .chat-typing span:nth-child(3) { animation-delay: .36s; }
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: .5; }
      30% { transform: translateY(-7px); opacity: 1; }
    }
    .chat-form { padding: 10px 12px; background: #fff; border-top: 1px solid #ebebeb; flex-shrink: 0; }
    .chat-input-wrap {
      display: flex; align-items: flex-end; gap: 6px;
      background: #fafafa; border: 1px solid #ebebeb;
      border-radius: 22px; padding: 6px;
    }
    .chat-input-wrap textarea {
      flex: 1; border: none; background: transparent;
      resize: none; outline: none; font-family: inherit;
      font-size: 13.5px; padding: 8px 4px;
      max-height: 120px; min-height: 22px; color: #1a1410;
    }
    .chat-send-btn {
      width: 38px; height: 38px; border-radius: 50%;
      border: none; background: #1a1410; color: #fff;
      cursor: pointer; display: grid; place-items: center;
      flex-shrink: 0; font-size: 16px;
    }
    .chat-send-btn:hover { background: #c9a227; color: #1a1410; }
    @media (max-width: 480px) {
      .chat-box { right: 10px; left: 10px; bottom: 92px; width: auto; height: calc(100vh - 112px); }
      .chat-toggle { bottom: 18px; right: 18px; width: 60px; height: 60px; }
    }
  `;
  shadow.appendChild(fallback);

  // =========================================================
  // LOGIC
  // =========================================================
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

  if (!chatToggle || !chatBox) return;

  const timeNow = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  };

  function addMessage(text, sender, isHTML) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-message ' + (sender || 'bot');
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

  function findAnswer(text) {
    const q = text.toLowerCase().trim();
    let best = null, bestScore = 0;
    for (const item of KB) {
      let score = 0;
      for (const kw of item.keys) {
        if (q.indexOf(kw.toLowerCase()) !== -1) score += kw.length;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    if (best && bestScore >= 2) return best.reply;
    return 'متوجه نشدم 🤔 ولی می‌تونم در این موارد کمکت کنم:<ul><li>🖼️ نقاشی‌ها</li><li>🖌️ قلم‌موها</li><li>🖨️ پرینت‌ها</li><li>🎬 ویدیوها</li><li>🎓 کلاس‌ها</li><li>💰 قیمت‌ها</li></ul>یا از دکمه‌های بالا استفاده کن.';
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    showTyping(true);
    setTimeout(function () {
      showTyping(false);
      addMessage(findAnswer(text), 'bot', true);
    }, 600);
  }

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
      setTimeout(() => chatInput.focus(), 300);
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

  addMessage('سلام! 👋 من دستیار هنری شما هستم.<br>می‌تونم درباره <strong>نقاشی‌ها</strong>، <strong>پرینت‌ها</strong>، <strong>قلم‌موها</strong>، <strong>کلاس‌ها</strong> و هر بخش دیگه‌ای راهنماییتون کنم.', 'bot', true);

  setTimeout(function () {
    if (!chatBox.classList.contains('open') && chatBadge) {
      chatBadge.style.display = 'grid';
    }
  }, 4000);

  console.log('✅ چت راه‌اندازی شد');

})();
