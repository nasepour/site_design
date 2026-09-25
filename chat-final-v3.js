/* =========================================================
   ARTIST CHAT — FINAL v3
   کاملاً محلی + تولید تصویر SVG + بدون نیاز به API خارجی
   ========================================================= */
(function () {
  'use strict';

  if (window.__ARTIST_CHAT_LOADED__) return;
  window.__ARTIST_CHAT_LOADED__ = true;

  console.log('✅ Chat v3: شروع');

  /* =========================================================
     دانش‌نامه داخلی
  ========================================================= */
  const KB = [
    {
      keys: ['سلام', 'درود', 'hi', 'hello', 'hey', 'صبح بخیر', 'شب بخیر'],
      reply: 'سلام! 😊 خوش آمدید به گالری هنری. چطور می‌تونم کمکتون کنم؟ درباره نقاشی‌ها، کلاس‌ها، پرینت‌ها یا هر چیز دیگه بپرسید.'
    },
    {
      keys: ['ممنون', 'مرسی', 'thanks', 'thank', 'سپاس'],
      reply: 'خواهش می‌کنم! 🙏 اگه سوال دیگه‌ای دارید در خدمتم.'
    },
    {
      keys: ['اسم', 'نام', 'کی هستی', 'who are you', 'تو کی'],
      reply: 'من دستیار هنری این گالری هستم 🎨<br>می‌تونم درباره نقاشی‌ها، کلاس‌ها، پرینت‌ها، قلم‌موها و هر بخش سایت راهنماییتون کنم.<br><br>🎨 یا بگید <em>"یک گل بساز"</em> تا تصویر بسازم!'
    },
    {
      keys: ['نقاشی', 'painting', 'تابلو', 'اثر', 'گالری', 'collection', 'آثار'],
      reply: '🖼️ <strong>مجموعه نقاشی‌ها</strong><br><br>ما نقاشی‌های اصیل دست‌ساز داریم:<ul><li>🎨 رنگ روغن</li><li>💧 آبرنگ</li><li>✏️ طراحی</li></ul><a href="paintings.html">مشاهده همه نقاشی‌ها →</a>'
    },
    {
      keys: ['قلم', 'brush', 'قلم‌مو', 'قلم مو'],
      reply: '🖌️ <strong>قلم‌موهای حرفه‌ای</strong><br><br>مجموعه <em>Fine Detail Professional Brush Set</em>.<br><br><a href="brushes.html">مشاهده قلم‌موها →</a>'
    },
    {
      keys: ['پرینت', 'print', 'چاپ', 'خرید'],
      reply: '🖨️ <strong>پرینت‌های محدود</strong><br><br>هر پرینت با شماره سریال و امضای هنرمند.<br><br><a href="prints.html">خرید پرینت‌ها →</a>'
    },
    {
      keys: ['ویدیو', 'video', 'فیلم'],
      reply: '🎬 <strong>ویدیوها</strong><br><br>فرآیند خلق آثار رو ببینید.<br><br><a href="videos.html">تماشای ویدیوها →</a>'
    },
    {
      keys: ['کلاس', 'class', 'workshop', 'آموزش', 'دوره', 'کارگاه'],
      reply: '🎓 <strong>کلاس‌های نقاشی</strong><br><br><ul><li>🟢 Beginner — آنلاین، ۴۹$</li><li>🔵 Advanced Oil — حضوری، ۷۹$</li><li>🟣 Watercolor — آنلاین، ۳۹$</li><li>🟡 Private — هیبرید، ۱۲۰$</li></ul><a href="contact.html">ثبت‌نام →</a>'
    },
    {
      keys: ['قیمت', 'price', 'هزینه', 'چند', 'دلار'],
      reply: '💰 <strong>قیمت‌ها</strong><br><br><ul><li>پرینت‌ها: از ۳۹$</li><li>کلاس آنلاین: ۳۹-۴۹$</li><li>کلاس حضوری: ۷۹$</li><li>خصوصی: ۱۲۰$</li></ul>'
    },
    {
      keys: ['تماس', 'contact', 'ارتباط', 'ایمیل', 'شماره'],
      reply: '📞 برای تماس به <a href="contact.html">صفحه Contact</a> مراجعه کنید.'
    },
    {
      keys: ['درباره', 'about', 'هنرمند', 'بیوگرافی'],
      reply: '👤 در <a href="about.html">صفحه About</a> داستان هنری رو بخونید.'
    },
    {
      keys: ['عکس', 'تصویر', 'image', 'photo'],
      reply: '🖼️ <strong>راهنمای تصاویر</strong><br><br><ul><li><code>hero.jpg</code> — هدر</li><li><code>paintings.jpg</code> — نقاشی‌ها</li><li><code>brushes.jpg</code> — قلم‌موها</li><li><code>prints.jpg</code> — پرینت‌ها</li></ul>'
    }
  ];

  /* =========================================================
     Shadow DOM
  ========================================================= */
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
          <textarea id="chatInput" placeholder="سوالت رو بنویس یا بگو «یک گل بساز»..." rows="1"></textarea>
          <button type="submit" class="chat-send-btn" aria-label="Send">➤</button>
        </div>
      </form>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while (wrapper.firstChild) shadow.appendChild(wrapper.firstChild);

  /* =========================================================
     Fallback Styles
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
      font-family: sans-serif;
    }
    .chat-toggle:hover { transform: scale(1.08); }
    .chat-box {
      position: fixed; bottom: 105px; right: 26px;
      width: 420px; max-width: calc(100vw - 32px);
      height: 640px; max-height: calc(100vh - 140px);
      background: #fff; border-radius: 20px;
      box-shadow: 0 25px 70px rgba(0,0,0,0.3), 0 0 0 2px #c9a227;
      display: flex; flex-direction: column; overflow: hidden;
      opacity: 0; transform: translateY(30px) scale(.94);
      pointer-events: none; transition: opacity .3s, transform .4s;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;
      color: #1a1410;
    }
    .chat-box.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
    .chat-header {
      background: linear-gradient(135deg, #0a0a0a, #1f1f22);
      color: #fff; padding: 14px 18px;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #c9a227; flex-shrink: 0;
    }
    .chat-header-left { display: flex; align-items: center; gap: 12px; }
    .chat-avatar {
      position: relative; width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #c9a227, #8b6f1a);
      display: grid; place-items: center; font-size: 20px;
    }
    .chat-avatar-status {
      position: absolute; bottom: 1px; right: 1px;
      width: 12px; height: 12px; border-radius: 50%;
      background: #22c55e; border: 2px solid #1a1410;
    }
    .chat-header-meta strong { display: block; font-size: 14.5px; color: #f4ebe0; }
    .chat-status { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: #a8e6a8; margin-top: 2px; }
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
    }
    .chat-message.user .msg-bubble {
      background: linear-gradient(135deg, #2c1810, #0f0a07);
      color: #f4ebe0; border-bottom-right-radius: 5px;
    }
    .msg-bubble a { color: #c9a227; font-weight: 600; }
    .msg-bubble ul { margin: 6px 0; padding-inline-start: 20px; }
    .msg-bubble li { margin-bottom: 4px; }
    .msg-bubble img { max-width: 100%; border-radius: 10px; margin-top: 8px; display: block; }
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
      line-height: 1.5;
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
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
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
    return bubble;
  }

  function showTyping(show) {
    chatTyping.hidden = !show;
    if (show) chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /* =========================================================
     🎨 تولید تصویر SVG محلی — بدون API
  ========================================================= */
  function generateLocalImage(prompt) {
    console.log('🎨 شروع تولید تصویر برای:', prompt);
    
    try {
      // هش از متن برای تصادفی‌سازی
      let hash = 0;
      for (let i = 0; i < prompt.length; i++) {
        hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
      }
      hash = Math.abs(hash);
      
      // رنگ‌های HSL بر اساس هش
      const h1 = hash % 360;
      const h2 = (h1 + 60) % 360;
      const h3 = (h1 + 180) % 360;
      const h4 = (h1 + 240) % 360;
      
      const c1 = 'hsl(' + h1 + ', 65%, 65%)';
      const c2 = 'hsl(' + h2 + ', 60%, 45%)';
      const c3 = 'hsl(' + h3 + ', 55%, 30%)';
      const c4 = 'hsl(' + h4 + ', 40%, 92%)';
      const c5 = 'hsl(' + h1 + ', 50%, 20%)';
      
      // ساخت اشکال تصادفی
      let shapes = '';
      const numShapes = 10;
      
      for (let i = 0; i < numShapes; i++) {
        const s1 = (hash * (i + 1) * 13) % 1000;
        const s2 = (hash * (i + 1) * 17) % 1000;
        const s3 = (hash * (i + 1) * 23) % 1000;
        
        const x = 50 + (s1 % 700);
        const y = 50 + (s2 % 700);
        const size = 60 + (s3 % 200);
        const rot = s1 % 360;
        const opacity = 0.15 + (s2 % 50) / 100;
        
        const colors = [c1, c2, c3, c5];
        const color = colors[i % colors.length];
        
        const type = i % 4;
        if (type === 0) {
          // دایره
          shapes += '<circle cx="' + x + '" cy="' + y + '" r="' + (size/2) + '" fill="' + color + '" opacity="' + opacity + '"/>';
        } else if (type === 1) {
          // مربع چرخیده
          shapes += '<rect x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" fill="' + color + '" opacity="' + opacity + '" transform="rotate(' + rot + ' ' + x + ' ' + y + ')"/>';
        } else if (type === 2) {
          // بیضی
          shapes += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (size/2) + '" ry="' + (size/3) + '" fill="' + color + '" opacity="' + opacity + '" transform="rotate(' + rot + ' ' + x + ' ' + y + ')"/>';
        } else {
          // مثلث
          shapes += '<polygon points="' + x + ',' + (y-size/2) + ' ' + (x-size/2) + ',' + (y+size/2) + ' ' + (x+size/2) + ',' + (y+size/2) + '" fill="' + color + '" opacity="' + opacity + '" transform="rotate(' + rot + ' ' + x + ' ' + y + ')"/>';
        }
      }
      
      // متن امن (حذف کاراکترهای مشکل‌دار)
      const safePrompt = prompt
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .substring(0, 30);
      
      // SVG
      const svg = 
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">' +
          '<defs>' +
            '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
              '<stop offset="0%" stop-color="' + c4 + '"/>' +
              '<stop offset="100%" stop-color="' + c1 + '"/>' +
            '</linearGradient>' +
            '<filter id="blur">' +
              '<feGaussianBlur stdDeviation="3"/>' +
            '</filter>' +
          '</defs>' +
          '<rect width="800" height="800" fill="url(#bg)"/>' +
          '<g filter="url(#blur)">' + shapes + '</g>' +
          '<rect x="0" y="700" width="800" height="100" fill="' + c5 + '" opacity="0.88"/>' +
          '<text x="400" y="745" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-style="italic" fill="' + c4 + '">' + safePrompt + '</text>' +
          '<text x="400" y="778" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="' + c4 + '" opacity="0.7">— Artist AI —</text>' +
        '</svg>';
      
      // تبدیل به base64 با پشتیبانی UTF-8
      const base64 = btoa(unescape(encodeURIComponent(svg)));
      const result = 'data:image/svg+xml;base64,' + base64;
      
      console.log('✅ تصویر ساخته شد، طول:', result.length);
      return result;
      
    } catch (err) {
      console.error('❌ خطا در تولید تصویر:', err);
      return null;
    }
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
    return 'متوجه نشدم 🤔 ولی می‌تونم در این موارد کمکت کنم:<ul><li>🖼️ نقاشی‌ها</li><li>🖌️ قلم‌موها</li><li>🖨️ پرینت‌ها</li><li>🎬 ویدیوها</li><li>🎓 کلاس‌ها</li><li>💰 قیمت‌ها</li><li>🎨 ساخت تصویر</li></ul>برای ساخت تصویر بنویسید: <strong>"یک گل بساز"</strong>';
  }

  /* =========================================================
     ارسال پیام
  ========================================================= */
  function sendMessage(text) {
    if (!text || !text.trim()) return;
    
    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // تشخیص درخواست تصویر — ساده و قوی
    const wantsImage = /بساز|بکش|تولید|رسم|طراحی کن|generate|create|draw|paint/i.test(text);

    console.log('📝 پیام:', text, '| درخواست تصویر؟', wantsImage);

    if (wantsImage) {
      showTyping(true);
      
      setTimeout(() => {
        showTyping(false);
        
        // پاکسازی پرامپت
        let cleanPrompt = text
          .replace(/بساز|بکش|تولید کن|تولید|رسم کن|رسم|طراحی کن|generate|create|draw|paint/gi, '')
          .replace(/یک|یه|لطفا|لطفاً|می‌خوام|میخوام|می‌خواهم|image|picture/gi, '')
          .trim();
        
        if (!cleanPrompt || cleanPrompt.length < 2) {
          cleanPrompt = text;
        }
        
        console.log('🎨 پرامپت نهایی:', cleanPrompt);
        
        const imageData = generateLocalImage(cleanPrompt);
        
        if (!imageData) {
          addMessage('❌ متأسفم، در تولید تصویر خطایی رخ داد.<br>لطفاً دوباره تلاش کنید.', 'bot', true);
          return;
        }
        
        addMessage(
          '🎨 <strong>تصویر هنری شما آماده شد!</strong>' +
          '<div style="margin-top:10px;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.15);background:#fff">' +
            '<img src="' + imageData + '" alt="' + cleanPrompt + '" style="width:100%;display:block" />' +
          '</div>' +
          '<div style="margin-top:10px;font-size:12px;color:#8b5a3c;font-style:italic">' +
            '✨ سبک: انتزاعی هنری — موضوع: "' + cleanPrompt + '"' +
          '</div>',
          'bot',
          true
        );
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

  // پیام خوش‌آمد
  addMessage(
    'سلام! 👋 من دستیار هنری شما هستم.<br><br>' +
    'می‌تونم درباره <strong>نقاشی‌ها</strong>، <strong>پرینت‌ها</strong>، <strong>قلم‌موها</strong>، <strong>کلاس‌ها</strong> راهنماییتون کنم.<br><br>' +
    '🎨 یا بگید <em>"یک گل بساز"</em> تا براتون تصویر بسازم!',
    'bot',
    true
  );

  setTimeout(function () {
    if (!chatBox.classList.contains('open') && chatBadge) {
      chatBadge.style.display = 'grid';
    }
  }, 4000);

  console.log('✅ Chat v3 آماده است');

})();
