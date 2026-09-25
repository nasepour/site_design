/* =========================================================
   ARTIST CHAT — AI POWERED (Multi-Service Fallback)
   هوش مصنوعی واقعی + تولید تصویر رایگان + چند سرویس جایگزین
   ========================================================= */
(function () {
  'use strict';

  if (window.__ARTIST_CHAT_LOADED__) return;
  window.__ARTIST_CHAT_LOADED__ = true;

  console.log('🔵 Chat AI: شروع به کار');

  /* =========================================================
     CONFIG — تنظیمات
  ========================================================= */
  const CONFIG = {
    // دستور سیستمی — شخصیت دستیار
    systemPrompt: `تو "دستیار هنری" سایت Artist Portfolio هستی.

اطلاعات سایت:
- نقاشی‌ها: paintings.html — مجموعه‌ای از نقاشی‌های اصیل (رنگ روغن، آبرنگ، طراحی)
- قلم‌موها: brushes.html — مجموعه حرفه‌ای Fine Detail Professional Brush Set
- پرینت‌ها: prints.html — پرینت‌های محدود با امضای هنرمند (از ۳۹$)
- ویدیوها: videos.html — فرآیند خلق آثار و تکنیک‌ها
- درباره: about.html — بیوگرافی هنرمند
- تماس: contact.html — فرم تماس و سفارش
- کلاس‌ها: آنلاین (۴۹$)، حضوری (۷۹$)، آبرنگ (۳۹$)، خصوصی (۱۲۰$)

قوانین پاسخ:
1. به فارسی و انگلیسی هر دو جواب بده (بر اساس زبان سوال کاربر)
2. کوتاه، دوستانه و هنری صحبت کن
3. اگه کسی سوال درباره سایت پرسید، لینک صفحه مربوطه رو بده
4. اگه کسی درخواست تولید تصویر کرد، بگو "دکمه 🎨 رو بزنید" یا خودت تصویر بساز
5. از ایموجی‌های هنری استفاده کن (🎨🖌️🖼️✨)
6. اگه سوال ربطی به سایت نداشت، بازم کمکش کن ولی در پایان اشاره کن که دستیار هنری هستی
7. مختصر و مفید جواب بده (زیر ۱۵۰ کلمه)`,

    maxHistory: 10,
    timeout: 20000
  };

  /* =========================================================
     1) SHADOW DOM SETUP
  ========================================================= */
  const host = document.createElement('div');
  host.id = 'artist-chat-root';
  document.body.appendChild(host);
  console.log('🔵 Host اضافه شد');

  const shadow = host.attachShadow({ mode: 'open' });

  /* --- CSS Link --- */
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'chat.css'; // اگه داخل پوشه chat/ هست: 'chat/chat.css'
  link.onload = () => console.log('✅ CSS لود شد');
  link.onerror = () => console.warn('⚠️ CSS لود نشد - استایل اضطراری استفاده می‌شه');
  shadow.appendChild(link);

  /* =========================================================
     2) HTML
  ========================================================= */
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
            <strong>دستیار هوشمند</strong>
            <span class="chat-status">
              <span class="chat-status-dot"></span>
              <span>آنلاین — هوش مصنوعی</span>
            </span>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-action-btn" id="chatClearBtn" title="پاک کردن" aria-label="Clear">🗑</button>
          <button class="chat-action-btn chat-close" id="chatClose" aria-label="Close">×</button>
        </div>
      </div>

      <div class="chat-suggestions" id="chatSuggestions">
        <button data-ask="نقاشی‌ها رو معرفی کن">🖼️ نقاشی‌ها</button>
        <button data-ask="کلاس‌های نقاشی چیه؟">🎓 کلاس‌ها</button>
        <button data-ask="قیمت پرینت‌ها چنده؟">🖨️ پرینت‌ها</button>
        <button data-ask="یک نقاشی از گل رز بساز">🎨 ساخت تصویر</button>
      </div>

      <div class="chat-messages" id="chatMessages"></div>

      <div class="chat-typing" id="chatTyping" hidden>
        <div class="chat-typing-bubble">
          <span></span><span></span><span></span>
        </div>
      </div>

      <form class="chat-form" id="chatForm" autocomplete="off">
        <div class="chat-input-wrap">
          <textarea id="chatInput" placeholder="سوالت رو بنویس یا درخواست تصویر بده..." rows="1" maxlength="1000"></textarea>
          <button type="button" class="chat-gen-btn" id="chatGenBtn" title="ساخت تصویر">🎨</button>
          <button type="submit" class="chat-send-btn" id="chatSendBtn" aria-label="Send">➤</button>
        </div>
      </form>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  while (wrapper.firstChild) shadow.appendChild(wrapper.firstChild);

  /* =========================================================
     3) FALLBACK STYLES
  ========================================================= */
  const fallback = document.createElement('style');
  fallback.textContent = `
    .chat-toggle {
      position: fixed !important;
      bottom: 26px !important;
      right: 26px !important;
      width: 64px !important;
      height: 64px !important;
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
      box-shadow: 0 12px 35px rgba(0,0,0,0.4) !important;
      pointer-events: auto !important;
      transition: all .35s ease !important;
    }
    .chat-toggle:hover {
      transform: scale(1.08) rotate(-6deg) !important;
      background: linear-gradient(135deg, #c9a227 0%, #8b6f1a 100%) !important;
    }
    .chat-toggle .chat-icon-close {
      position: absolute;
      font-size: 32px;
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
    .chat-box {
      position: fixed !important;
      bottom: 105px !important;
      right: 26px !important;
      width: 420px !important;
      max-width: calc(100vw - 32px) !important;
      height: 640px !important;
      max-height: calc(100vh - 130px) !important;
      background: #faf6f0 !important;
      border-radius: 8px !important;
      box-shadow: 0 30px 90px rgba(0,0,0,0.35), 0 0 0 1px #2c1810, 0 0 0 12px #f4ebe0, 0 0 0 13px #8b5a3c !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      opacity: 0 !important;
      transform: translateY(40px) scale(.94) !important;
      pointer-events: none !important;
      transition: opacity .4s ease, transform .5s cubic-bezier(.2,.9,.3,1.3) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif !important;
      z-index: 2147483647 !important;
      color: #1a1410 !important;
    }
    .chat-box.open {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
      pointer-events: auto !important;
    }
    .chat-header {
      background: linear-gradient(135deg, #2c1810 0%, #1a1410 100%) !important;
      color: #fff !important;
      padding: 14px 18px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      border-bottom: 2px solid #c9a227 !important;
      flex-shrink: 0 !important;
    }
    .chat-header-left { display: flex !important; align-items: center !important; gap: 12px !important; }
    .chat-avatar {
      position: relative !important;
      width: 44px !important; height: 44px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #c9a227, #8b6f1a) !important;
      display: grid !important; place-items: center !important;
      font-size: 20px !important;
      box-shadow: 0 0 0 3px rgba(201,162,39,0.25) !important;
    }
    .chat-avatar-status {
      position: absolute !important;
      bottom: 1px !important; right: 1px !important;
      width: 12px !important; height: 12px !important;
      border-radius: 50% !important;
      background: #22c55e !important;
      border: 2px solid #1a1410 !important;
    }
    .chat-header-meta strong { display: block !important; font-size: 14.5px !important; font-weight: 700 !important; color: #f4ebe0 !important; }
    .chat-status { display: flex !important; align-items: center !important; gap: 5px !important; font-size: 11.5px !important; color: #a8e6a8 !important; margin-top: 2px !important; }
    .chat-status-dot { width: 6px !important; height: 6px !important; border-radius: 50% !important; background: #22c55e !important; display: inline-block !important; }
    .chat-header-actions { display: flex !important; gap: 4px !important; }
    .chat-action-btn {
      width: 32px !important; height: 32px !important;
      border-radius: 50% !important;
      border: 1px solid rgba(201,162,39,0.3) !important;
      background: transparent !important;
      color: #f4ebe0 !important;
      cursor: pointer !important;
      display: grid !important; place-items: center !important;
      font-size: 15px !important;
      font-family: inherit !important;
    }
    .chat-action-btn:hover { background: rgba(201,162,39,0.2) !important; }
    .chat-close { font-size: 20px !important; }
    .chat-messages {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 18px !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 14px !important;
      background: #f7f7f8 !important;
    }
    .chat-message {
      display: flex !important;
      flex-direction: column !important;
      max-width: 88% !important;
      animation: msgIn .4s ease !important;
    }
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .chat-message.bot { align-self: flex-start !important; }
    .chat-message.user { align-self: flex-end !important; align-items: flex-end !important; }
    .msg-bubble {
      padding: 11px 15px !important;
      border-radius: 18px !important;
      font-size: 13.5px !important;
      line-height: 1.6 !important;
      word-break: break-word !important;
    }
    .chat-message.bot .msg-bubble {
      background: #fffbf5 !important;
      color: #1a1410 !important;
      border-bottom-left-radius: 5px !important;
      border-left: 3px solid #c9a227 !important;
      box-shadow: 0 2px 8px rgba(139,90,60,0.1) !important;
    }
    .chat-message.user .msg-bubble {
      background: linear-gradient(135deg, #2c1810 0%, #0f0a07 100%) !important;
      color: #f4ebe0 !important;
      border-bottom-right-radius: 5px !important;
    }
    .msg-bubble a { color: #c9a227 !important; font-weight: 600 !important; }
    .msg-bubble ul { margin: 6px 0 !important; padding-inline-start: 20px !important; }
    .msg-bubble li { margin-bottom: 4px !important; }
    .msg-bubble img { max-width: 100% !important; border-radius: 10px !important; margin-top: 8px !important; display: block !important; }
    .msg-bubble code { background: rgba(0,0,0,0.08) !important; padding: 1px 6px !important; border-radius: 4px !important; font-size: 12px !important; }
    .msg-time {
      font-size: 10px !important;
      color: #8b5a3c !important;
      margin-top: 4px !important;
      padding: 0 6px !important;
      opacity: 0.7 !important;
    }
    .chat-form {
      padding: 10px 12px !important;
      background: #fff !important;
      border-top: 1px solid #ebebeb !important;
      flex-shrink: 0 !important;
    }
    .chat-input-wrap {
      display: flex !important;
      align-items: flex-end !important;
      gap: 6px !important;
      background: #fafafa !important;
      border: 1px solid #ebebeb !important;
      border-radius: 22px !important;
      padding: 6px !important;
    }
    .chat-input-wrap textarea {
      flex: 1 !important;
      border: none !important;
      background: transparent !important;
      resize: none !important;
      outline: none !important;
      font-family: inherit !important;
      font-size: 13.5px !important;
      padding: 8px 4px !important;
      max-height: 120px !important;
      min-height: 22px !important;
      color: #1a1410 !important;
      line-height: 1.5 !important;
    }
    .chat-input-wrap textarea::placeholder { color: #999 !important; }
    .chat-send-btn, .chat-gen-btn {
      width: 38px !important;
      height: 38px !important;
      border-radius: 50% !important;
      border: none !important;
      background: #1a1410 !important;
      color: #fff !important;
      cursor: pointer !important;
      display: grid !important;
      place-items: center !important;
      flex-shrink: 0 !important;
      font-size: 16px !important;
      transition: all .25s !important;
    }
    .chat-gen-btn { background: #c9a227 !important; color: #1a1410 !important; }
    .chat-send-btn:hover, .chat-gen-btn:hover { transform: scale(1.08) !important; }
    .chat-typing { padding: 0 18px 12px !important; background: #f7f7f8 !important; }
    .chat-typing-bubble {
      display: inline-flex !important;
      gap: 5px !important;
      padding: 12px 16px !important;
      background: #fffbf5 !important;
      border-radius: 18px !important;
      border-left: 3px solid #c9a227 !important;
    }
    .chat-typing span {
      width: 8px !important; height: 8px !important;
      border-radius: 50% !important;
      background: #c9a227 !important;
      animation: typing 1.3s infinite !important;
    }
    .chat-typing span:nth-child(2) { animation-delay: .18s !important; }
    .chat-typing span:nth-child(3) { animation-delay: .36s !important; }
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: .5; }
      30% { transform: translateY(-7px); opacity: 1; }
    }
    .chat-suggestions {
      display: flex !important;
      gap: 6px !important;
      padding: 10px 12px !important;
      overflow-x: auto !important;
      border-bottom: 1px solid #ebebeb !important;
      background: #fafafa !important;
      flex-shrink: 0 !important;
    }
    .chat-suggestions button {
      flex: 0 0 auto !important;
      background: #fff !important;
      border: 1px solid #ebebeb !important;
      border-radius: 999px !important;
      padding: 7px 14px !important;
      font-size: 12px !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      font-family: inherit !important;
      color: #1a1410 !important;
      transition: all .25s !important;
    }
    .chat-suggestions button:hover {
      background: #1a1410 !important;
      color: #fff !important;
    }
    .chat-suggestions::-webkit-scrollbar { display: none !important; }
    .chat-messages::-webkit-scrollbar { width: 6px !important; }
    .chat-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15) !important; border-radius: 3px !important; }

    @media (max-width: 480px) {
      .chat-box {
        right: 10px !important;
        left: 10px !important;
        bottom: 92px !important;
        width: auto !important;
        height: calc(100vh - 112px) !important;
        max-height: none !important;
      }
      .chat-toggle { bottom: 18px !important; right: 18px !important; width: 60px !important; height: 60px !important; }
    }
  `;
  shadow.appendChild(fallback);

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
  const chatGenBtn = $('chatGenBtn');

  if (!chatToggle || !chatBox) {
    console.error('❌ عناصر اصلی چت پیدا نشد');
    return;
  }
  console.log('✅ همه عناصر پیدا شدند');

  // تاریخچه مکالمه
  let conversationHistory = [
    { role: 'system', content: CONFIG.systemPrompt }
  ];

  /* --- helpers --- */
  const timeNow = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

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
     5) MULTI-SERVICE AI TEXT
  ========================================================= */
  
  // سرویس ۱: Pollinations POST
  async function askPollinationsPOST(messages) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
    
    try {
      const res = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error('empty reply');
      return reply;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  }

  // سرویس ۲: Pollinations GET
  async function askPollinationsGET(messages) {
    const lastUser = messages.filter(m => m.role === 'user').pop();
    const sys = messages.find(m => m.role === 'system');
    const prompt = encodeURIComponent(
      (sys ? sys.content + '\n\n---\n\n' : '') + (lastUser ? lastUser.content : 'سلام')
    );
    const url = `https://text.pollinations.ai/${prompt}?model=openai`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
    
    try {
      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      if (!text || text.length < 2) throw new Error('empty reply');
      return text;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  }

  // سرویس ۳: Hugging Face (Mistral)
  async function askHuggingFace(messages) {
    const lastUser = messages.filter(m => m.role === 'user').pop();
    const url = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: lastUser ? lastUser.content : 'سلام',
          parameters: { max_new_tokens: 400, temperature: 0.7 }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text;
      }
      throw new Error('bad format');
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  }

  // سرویس ۴: Groq-like via Pollinations (fallback)
  async function askGroqProxy(messages) {
    const lastUser = messages.filter(m => m.role === 'user').pop();
    const url = `https://text.pollinations.ai/${encodeURIComponent(lastUser ? lastUser.content : 'سلام')}?model=openai-fast`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
    
    try {
      const res = await fetch(url, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      if (!text || text.length < 2) throw new Error('empty');
      return text;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  }

  // تابع اصلی: امتحان همه سرویس‌ها به ترتیب
  async function askAI(userMessage) {
    conversationHistory.push({ role: 'user', content: userMessage });

    // محدود کردن تاریخچه
    if (conversationHistory.length > CONFIG.maxHistory * 2 + 1) {
      conversationHistory = [
        conversationHistory[0],
        ...conversationHistory.slice(-CONFIG.maxHistory * 2)
      ];
    }

    const services = [
      { name: 'Pollinations-POST', fn: askPollinationsPOST },
      { name: 'Pollinations-GET', fn: askPollinationsGET },
      { name: 'Groq-Proxy', fn: askGroqProxy },
      { name: 'HuggingFace', fn: askHuggingFace }
    ];

    for (const service of services) {
      try {
        console.log('🔄 تلاش با:', service.name);
        const reply = await service.fn(conversationHistory);
        if (reply && reply.length > 0) {
          console.log('✅ پاسخ از:', service.name);
          conversationHistory.push({ role: 'assistant', content: reply });
          return reply;
        }
      } catch (e) {
        console.warn('❌', service.name, 'خطا:', e.message);
      }
    }

    // همه fail شدند
    return 'متأسفم، در حال حاضر نمی‌تونم به هوش مصنوعی وصل بشم. 🙏<br><br>لطفاً:<ul><li>فیلترشکن رو چک کنید</li><li>چند دقیقه دیگه دوباره تلاش کنید</li><li>یا با <a href="contact.html">Contact</a> تماس بگیرید</li></ul>';
  }

  /* =========================================================
     6) AI IMAGE GENERATION
  ========================================================= */
  async function generateImage(prompt) {
    addMessage('🎨 در حال ساخت تصویر: ' + escapeHtml(prompt), 'user');

    const loadingBubble = addMessage(`
      <div style="text-align:center;padding:15px">
        <div style="
          width:28px;height:28px;border:3px solid rgba(201,162,39,0.2);
          border-top-color:#c9a227;border-radius:50%;
          margin:0 auto 10px;animation:spin 0.9s linear infinite;
        "></div>
        <div style="font-size:12px;color:#8b5a3c">در حال نقاشی کردن... ✨</div>
        <div style="font-size:11px;color:#aaa;margin-top:4px">(۱۵-۳۰ ثانیه)</div>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `, 'bot', true);

    try {
      const encodedPrompt = encodeURIComponent(
        prompt + ', oil painting style, artistic, masterpiece, high quality, detailed'
      );
      
      const seed = Math.floor(Math.random() * 1000000);
      const imageServices = [
        `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`,
        `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true&seed=${seed}`,
        `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}`
      ];

      let imageURL = null;
      
      for (const url of imageServices) {
        try {
          console.log('🔄 تلاش تصویر...');
          const testImg = new Image();
          testImg.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('timeout')), 35000);
            testImg.onload = () => { clearTimeout(timeout); resolve(); };
            testImg.onerror = () => { clearTimeout(timeout); reject(new Error('failed')); };
            testImg.src = url;
          });
          
          imageURL = url;
          console.log('✅ تصویر ساخته شد');
          break;
        } catch (e) {
          console.warn('❌ این سرویس کار نکرد:', e.message);
        }
      }

      loadingBubble.parentElement.remove();

      if (!imageURL) {
        addMessage('❌ متأسفم، ساخت تصویر با خطا مواجه شد.<br><br>لطفاً:<ul><li>فیلترشکن رو چک کنید</li><li>درخواست رو ساده‌تر بنویسید</li><li>دوباره تلاش کنید</li></ul>', 'bot', true);
        return;
      }

      addMessage(`
        🎨 <strong>تصویر ساخته شد!</strong>
        <div style="margin-top:10px;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.15)">
          <img src="${imageURL}" alt="${escapeHtml(prompt)}" style="width:100%;display:block" />
        </div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <button onclick="window.open('${imageURL}','_blank')" style="
            flex:1;background:#1a1410;color:#fff;border:none;
            padding:8px;border-radius:8px;cursor:pointer;font-size:12px;
            font-family:inherit;
          ">🔍 بزرگ‌نمایی</button>
          <a href="${imageURL}" download="artist-ai-${Date.now()}.jpg" target="_blank" style="
            flex:1;background:#c9a227;color:#1a1410;border:none;
            padding:8px;border-radius:8px;cursor:pointer;font-size:12px;
            text-align:center;text-decoration:none;font-weight:600;
            font-family:inherit;
          ">⬇ دانلود</a>
        </div>
      `, 'bot', true);

    } catch (err) {
      console.error('❌ Image error:', err);
      loadingBubble.parentElement.remove();
      addMessage('❌ متأسفم، ساخت تصویر با خطا مواجه شد. لطفاً دوباره تلاش کنید.', 'bot');
    }
  }

  /* =========================================================
     7) SEND MESSAGE
  ========================================================= */
  async function sendMessage(text, isImageRequest) {
    if (!text || !text.trim()) return;

    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    const imageKeywords = /بساز|بکش|تولید کن|رسم کن|تصویر.*بساز|عکس.*بساز|generate|create.*image|draw|paint/i;
    const isImage = isImageRequest || imageKeywords.test(text);

    if (isImage) {
      const cleanPrompt = text
        .replace(/بساز|بکش|تولید کن|رسم کن|generate|create|draw|paint/gi, '')
        .replace(/یک|یه|یه عکس|یک تصویر|image|picture/gi, '')
        .trim() || text;
      
      await generateImage(cleanPrompt);
      return;
    }

    showTyping(true);
    const reply = await askAI(text);
    showTyping(false);
    addMessage(reply, 'bot', true);
  }

  /* =========================================================
     8) EVENTS
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

  if (chatGenBtn) {
    chatGenBtn.addEventListener('click', function () {
      const text = chatInput.value.trim();
      if (!text) {
        chatInput.focus();
        chatInput.placeholder = 'توصیف تصویری که می‌خوای بسازی رو بنویس...';
        return;
      }
      sendMessage(text, true);
    });
  }

  if (suggestions) {
    suggestions.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      sendMessage(btn.dataset.ask || btn.textContent);
    });
  }

  chatToggle
