/* =========================================================
   ARTIST CHAT — FINAL WORKING VERSION
   بدون نیاز به API خارجی + تولید تصویر SVG محلی
   ========================================================= */
(function () {
  'use strict';

  if (window.__ARTIST_CHAT_LOADED__) return;
  window.__ARTIST_CHAT_LOADED__ = true;

  console.log('🔵 Chat: شروع');

  /* =========================================================
     دانش‌نامه داخلی
  ========================================================= */
  const KB = [
    {
      keys: ['سلام','درود','hi','hello','hey','صبح بخیر','شب بخیر'],
      reply: 'سلام! 😊 خوش آمدید به گالری هنری. چطور می‌تونم کمکتون کنم؟ درباره نقاشی‌ها، کلاس‌ها، پرینت‌ها یا هر چیز دیگه بپرسید.'
    },
    {
      keys: ['ممنون','مرسی','thanks','thank','سپاس'],
      reply: 'خواهش می‌کنم! 🙏 اگه سوال دیگه‌ای دارید در خدمتم.'
    },
    {
      keys: ['اسم','نام','کی هستی','who are you','تو کی'],
      reply: 'من دستیار هنری این گالری هستم 🎨<br>می‌تونم درباره نقاشی‌ها، کلاس‌ها، پرینت‌ها، قلم‌موها و هر بخش سایت راهنماییتون کنم.'
    },
    {
      keys: ['نقاشی','painting','تابلو','اثر','گالری','collection','آثار'],
      reply: '🖼️ <strong>مجموعه نقاشی‌ها</strong><br><br>ما نقاشی‌های اصیل دست‌ساز داریم:<ul><li>🎨 رنگ روغن</li><li>💧 آبرنگ</li><li>✏️ طراحی</li></ul><a href="paintings.html">مشاهده همه نقاشی‌ها →</a>'
    },
    {
      keys: ['قلم','brush','قلم‌مو','قلم مو'],
      reply: '🖌️ <strong>قلم‌موهای حرفه‌ای</strong><br><br>مجموعه <em>Fine Detail Professional Brush Set</em> برای کارهای دقیق.<br><br><a href="brushes.html">مشاهده قلم‌موها →</a>'
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
      keys: ['کلاس','class','workshop','آموزش','دوره','کارگاه'],
      reply: '🎓 <strong>کلاس‌های نقاشی</strong><br><br><ul><li>🟢 Beginner — آنلاین، ۴۹$</li><li>🔵 Advanced Oil — حضوری، ۷۹$</li><li>🟣 Watercolor — آنلاین، ۳۹$</li><li>🟡 Private — هیبرید، ۱۲۰$</li></ul><a href="contact.html">ثبت‌نام →</a>'
    },
    {
      keys: ['قیمت','price','هزینه','چند','دلار'],
      reply: '💰 <strong>قیمت‌ها</strong><br><br><ul><li>پرینت‌ها: از ۳۹$</li><li>کلاس آنلاین: ۳۹-۴۹$</li><li>کلاس حضوری: ۷۹$</li><li>خصوصی: ۱۲۰$</li></ul>'
    },
    {
      keys: ['تماس','contact','ارتباط','ایمیل','شماره'],
      reply: '📞 برای تماس به <a href="contact.html">صفحه Contact</a> مراجعه کنید.'
    },
    {
      keys: ['درباره','about','هنرمند','بیوگرافی'],
      reply: '👤 در <a href="about.html">صفحه About</a> داستان هنری رو بخونید.'
    },
    {
      keys: ['عکس','تصویر','image','photo'],
      reply: '🖼️ <strong>راهنمای تصاویر</strong><br><br><ul><li><code>hero.jpg</code> — هدر</li><li><code>paintings.jpg</code> — نقاشی‌ها</li><li><code>brushes.jpg</code> — قلم‌موها</li><li><code>prints.jpg</code> — پرینت‌ها</li><li><code>video-01.jpg</code> — ویدیو</li></ul>'
    },
    {
      keys: ['رنگ','color','پالت'],
      reply: '🎨 <strong>رنگ‌ها</strong><br><br>ما از پالت رنگی گرم و طبیعی استفاده می‌کنیم:<ul><li>🟤 قهوه‌ای چوبی</li><li>🟡 طلایی گرم</li><li>⚫ مشکی عمیق</li><li>⚪ کرم کاغذی</li></ul>'
    },
    {
      keys: ['کیفیت','quality','اندازه','size'],
      reply: '📐 <strong>اطلاعات فنی</strong><br><br><ul><li>نقاشی‌ها: ابعاد مختلف از ۳۰×۴۰ تا ۱۰۰×۱۵۰ سانتی‌متر</li><li>پرینت‌ها: A3, A2, A1</li><li>کیفیت: ۳۰۰ DPI</li></ul>'
    }
  ];

  /* =========================================================
     Shadow DOM
  ========================================================= */
  const host = document.createElement('div');
  host.id = 'artist-chat-root';
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  // CSS Link
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
        <button data-ask="یک گل بساز">🎨 ساخت تصویر</button>
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

  /* =========================================================
     Fallback Styles (اگه chat.css لود نشد)
  ========================================================= */
  const fallback = document.createElement('style');
  fallback.textContent = `
    .chat-toggle {
      position: fixed; bottom: 26px; right: 26px;
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #1a1410, #2c1810);
      color: #fff; font-size: 28px; border: 2px solid #c9a227;
      cursor: pointer; z-index: 2147483647;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 12px 35px rgba(0,0,0,0.4);
    }
    .chat-toggle:hover { transform: scale(1.08); background: #c9a227; }
    .chat-box {
      position: fixed; bottom: 105px; right: 26px;
      width: 420px; max-width: calc(100vw - 32px);
      height: 640px; max-height: calc(100vh - 140px);
      background: #fff; border-radius: 20px;
      box-shadow: 0 25px 70px rgba(0,0,0,0.3), 0 0 0 2px #c9a227;
      display: flex; flex-direction: column; overflow: hidden;
      opacity: 0; transform: translateY(30px) scale(.94);
      pointer-events: none;
      transition: opacity .3s, transform .4s;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
    }
    .chat-box.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
    .chat-header {
      background: linear-gradient(135deg, #0a0a0a, #1f1f22);
      color: #fff; padding: 14px 18px;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #c9a227;
    }
    .chat-messages { flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 14px; background: #fafafa; }
    .chat-message { display: flex; flex-direction: column; max-width: 88%; }
    .chat-message.bot { align-self: flex-start; }
    .chat-message.user { align-self: flex-end; align-items: flex-end; }
    .msg-bubble { padding: 11px 15px; border-radius: 18px; font-size: 13.5px; line-height: 1.6; word-wrap: break-word; }
    .chat-message.bot .msg-bubble { background: #f1f1f3; color: #1a1410; border-left: 3px solid #c9a227; }
    .chat-message.user .msg-bubble { background: #1a1410; color: #fff; }
    .msg-bubble a { color: #c9a227; }
    .msg-bubble ul { margin: 6px 0; padding-inline-start: 20px; }
    .chat-form { padding: 10px 12px; background: #fff; border-top: 1px solid #eee; }
    .chat-input-wrap { display: flex; gap: 6px; background: #fafafa; border: 1px solid #eee; border-radius: 22px; padding: 6px; }
    .chat-input-wrap textarea { flex: 1; border: none; background: transparent; resize: none; outline: none; padding: 8px; font-family: inherit; font-size: 13.5px; }
    .chat-send-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: #1a1410; color: #fff; cursor: pointer; font-size: 16px; }
    .chat-suggestions { display: flex; gap: 6px; padding: 10px 12px; overflow-x: auto; background: #fafafa; border-bottom: 1px solid #eee; }
    .chat-suggestions button { flex: 0 0 auto; padding: 7px 14px; border-radius: 999px; border: 1px solid #eee; background: #fff; cursor: pointer; font-size: 12px; font-family: inherit; }
    .chat-badge { position: absolute; top: -4px; right: -4px; background: #e63946; color: #fff; font-size: 11px; font-weight: 700; min-width: 22px; height: 22px; border-radius: 999px; padding: 0 6px; display: grid; place-items: center; border: 2px solid #fff; }
    .chat-typing { padding: 0 18px 12px; background: #fafafa; }
    .chat-typing-bubble { display: inline-flex; gap: 5px; padding: 12px 16px; background: #f1f1f3; border-radius: 18px; border-left: 3px solid #c9a227; }
    .chat-typing span { width: 8px; height: 8px; border-radius: 50%; background: #c9a227; animation: typing 1.3s infinite; }
    .chat-typing span:nth-child(2) { animation-delay: .18s; }
    .chat-typing span:nth-child(3) { animation-delay: .36s; }
    @keyframes typing { 0%,60%,100% { transform: translateY(0); opacity: .5; } 30% { transform: translateY(-7px); opacity: 1; } }
    @media (max-width: 480px) {
      .chat-box { right: 10px; left: 10px; bottom: 92px; width: auto; height: calc(100vh - 112px); }
      .chat-toggle { bottom: 18px; right: 18px; width: 60px; height: 60px; }
    }
  `;
  shadow.appendChild(fallback);

  /* =========================================================
     Logic
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
    time.style.cssText = 'font-size:10px;color:#999;margin-top:4px;padding:0 6px';
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return bubble;
  }

  function showTyping(show) {
    chatTyping.hidden = !show;
    if (show) chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /* =========================================================
     تولید تصویر SVG محلی (بدون نیاز به اینترنت)
  ========================================================= */
  function generateLocalImage(prompt) {
    const seed = prompt.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = (n) => ((seed * 9301 + 49297) % 233280) / 233280 * n;
    
    // پالت رنگی تصادفی
    const palettes = [
      ['#d4a574', '#8b5a3c', '#2c1810', '#f4ebe0'],
      ['#6b8cae', '#3a5a7a', '#1a2a3a', '#e8eef4'],
      ['#c9a227', '#8b6f1a', '#1a1410', '#faf6f0'],
      ['#a0522d', '#6b3410', '#2c1810', '#f5deb3'],
      ['#4a7c59', '#2c4a35', '#1a2a1f', '#e8f0e8']
    ];
    
    const palette = palettes[Math.floor(rand(palettes.length))];
    const [c1, c2, c3, c4] = palette;
    
    // اشکال تصادفی
    let shapes = '';
    const numShapes = 5 + Math.floor(rand(8));
    for (let i = 0; i < numShapes; i++) {
      const x = rand(800);
      const y = rand(800);
      const size = 80 + rand(200);
      const color = [c1, c2, c3][Math.floor(rand(3))];
      const opacity = 0.2 + rand(0.5);
      
      const shapeType = Math.floor(rand(3));
      if (shapeType === 0) {
        shapes += `<circle cx="${x}" cy="${y}" r="${size/2}" fill="${color}" opacity="${opacity}"/>`;
      } else if (shapeType === 1) {
        shapes += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}" opacity="${opacity}" transform="rotate(${rand(45)} ${x} ${y})"/>`;
      } else {
        shapes += `<ellipse cx="${x}" cy="${y}" rx="${size/2}" ry="${size/3}" fill="${color}" opacity="${opacity}" transform="rotate(${rand(180)} ${x} ${y})"/>`;
      }
    }
    
    // SVG کامل
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c4}"/>
            <stop offset="100%" stop-color="${c1}"/>
          </linearGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="2"/>
          </filter>
        </defs>
        <rect width="800" height="800" fill="url(#bg)"/>
        ${shapes}
        <text x="400" y="770" text-anchor="middle" font-family="Georgia, serif" 
              font-size="20" font-style="italic" fill="${c3}" opacity="0.7">
          "${prompt}"
        </text>
        <text x="400" y="795" text-anchor="middle" font-family="Georgia, serif" 
              font-size="14" fill="${c3}" opacity="0.5">
          — Artist AI —
        </text>
      </svg>
    `;
    
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }

  /* =========================================================
     پیدا کردن جواب
  ========================================================= */
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
    return 'متوجه نشدم 🤔 ولی می‌تونم در این موارد کمکت کنم:<ul><li>🖼️ نقاشی‌ها</li><li>🖌️ قلم‌موها</li><li>🖨️ پرینت‌ها</li><li>🎬 ویدیوها</li><li>🎓 کلاس‌ها</li><li>💰 قیمت‌ها</li><li>🎨 ساخت تصویر</li></ul>یا از دکمه‌های بالا استفاده کن.';
  }

  /* =========================================================
     ارسال پیام
  ========================================================= */
  function sendMessage(text) {
    if (!text || !text.trim()) return;
    
    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // چک درخواست تصویر
    const imageKeywords = /بساز|بکش|تولید کن|رسم کن|تصویر|عکس|generate|create|draw|paint/i;
    const isImage = imageKeywords.test(text) && /بساز|بکش|تولید|رسم|generate|create|draw|paint/i.test(text);

    if (isImage) {
      // پیام کاربر دوم (توضیح)
      showTyping(true);
      setTimeout(() => {
        showTyping(false);
        
        const cleanPrompt = text
          .replace(/بساز|بکش|تولید کن|رسم کن|generate|create|draw|paint/gi, '')
          .replace(/یک|یه|یه عکس|یک تصویر|image|picture/gi, '')
          .trim() || text;
        
        // تولید تصویر محلی
        const imageData = generateLocalImage(cleanPrompt);
        
        addMessage(`
          🎨 <strong>تصویر هنری شما آماده شد!</strong>
          <div style="margin-top:10px;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.15)">
            <img src="${imageData}" alt="${cleanPrompt}" style="width:100%;display:block" />
          </div>
          <div style="margin-top:10px;font-size:12px;color:#8b5a3c;font-style:italic">
            ✨ این یک تصویر هنری تولید شده به سبک انتزاعی است.
          </div>
        `, 'bot', true);
      }, 900);
      return;
    }

    // جواب متنی
    showTyping(true);
    setTimeout(() => {
      showTyping(false);
      addMessage(findAnswer(text), 'bot', true);
    }, 600);
  }

  /* =========================================================
     Events
  ========================================================= */
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

  addMessage('سلام! 👋 من دستیار هنری شما هستم.<br><br>می‌تونم درباره <strong>نقاشی‌ها</strong>، <strong>پرینت‌ها</strong>، <strong>قلم‌موها</strong>، <strong>کلاس‌ها</strong> راهنماییتون کنم.<br><br>🎨 یا بگید <em>"یک گل بساز"</em> تا براتون تصویر بسازم!', 'bot', true);

  setTimeout(function () {
    if (!chatBox.classList.contains('open') && chatBadge) {
      chatBadge.style.display = 'grid';
    }
  }, 4000);

  console.log('✅ چت راه‌اندازی شد');

})();
