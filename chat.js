/* =========================================================
   ARTIST CHAT — AI POWERED (Pollinations AI)
   هوش مصنوعی واقعی + تولید تصویر رایگان
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
    // API متنی رایگان Pollinations
    textAPI: 'https://text.pollinations.ai/openai',
    
    // API تصویری رایگان Pollinations
    imageAPI: 'https://image.pollinations.ai/prompt/',
    
    // دستور سیستمی — شخصیت دستیار
    systemPrompt: `تو "دستیار هنری" سایت Artist Portfolio هستی.
    
اطلاعات سایت:
- نقاشی‌ها: paintings.html — مجموعه‌ای از نقاشی‌های اصیل (رنگ روغن، آبرنگ، طراحی)
- قلم‌موها: brushes.html — مجموعه حرفه‌ای Fine Detail Professional Brush Set
- پرینت‌ها: prints.html — پرینت‌های محدود با امضای هنرمند (از ۳۹$)
- ویدیوها: videos.html — فرآیند خلق آثار و تکنیک‌ها
- درباره: about.html — بیوگرافی هنرمند
- تماس: contact.html — فرم تماس و سفارش
- کلاس‌ها: کلاس‌های آنلاین (۴۹$)، حضوری (۷۹$)، آبرنگ (۳۹$)، خصوصی (۱۲۰$)

قوانین پاسخ:
1. به فارسی و انگلیسی هر دو جواب بده (بر اساس زبان سوال کاربر)
2. کوتاه، دوستانه و هنری صحبت کن
3. اگه کسی سوال درباره سایت پرسید، لینک صفحه مربوطه رو بده
4. اگه کسی درخواست تولید تصویر کرد، بگو "در حال ساخت تصویر..." و کاربر باید دکمه 🎨 رو بزنه
5. از ایموجی‌های هنری استفاده کن (🎨🖌️🖼️✨)
6. اگه سوال ربطی به سایت نداشت، بازم کمکش کن ولی در پایان اشاره کن که دستیار هنری هستی`,

    // تنظیمات
    maxHistory: 10,
    model: 'openai'
  };

  /* =========================================================
     1) SHADOW DOM SETUP
  ========================================================= */
  const host = document.createElement('div');
  host.id = 'artist-chat-root';
  document.body.appendChild(host);
  console.log('🔵 Host اضافه شد');

  const shadow = host.attachShadow({ mode: 'open' });

  /* --- CSS --- */
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'chat.css';  // اگه داخل پوشه chat/ هست: 'chat/chat.css'
  link.onload = () => console.log('✅ CSS لود شد');
  link.onerror = () => console.warn('⚠️ CSS لود نشد');
  shadow.appendChild(link);

  /* --- استایل اضطراری --- */
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
      font-family: sans-serif !important;
      z-index: 2147483647 !important;
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
    }
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
    }
    .chat-suggestions button:hover {
      background: #1a1410 !important;
      color: #fff !important;
    }
  `;
  shadow.appendChild(fallback);

  /* =========================================================
     2) HTML
  ========================================================= */
  const html = `
    <button class="chat-toggle" id="chatToggle" aria-label="Open chat">
      <span class="chat-icon-chat">🎨</span>
      <span class="chat-icon-close" style="display:none">×</span>
      <span class="chat-badge" id="chatBadge" style="
        position:absolute;top:-4px;right:-4px;
        background:#e63946;color:#fff;font-size:11px;font-weight:700;
        min-width:22px;height:22px;border-radius:999px;padding:0 5px;
        display:grid;place-items:center;border:2px solid #fff;
      ">1</span>
    </button>

    <div class="chat-box" id="chatBox">
      <div class="chat-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="
            position:relative;width:44px;height:44px;border-radius:50%;
            background:linear-gradient(135deg,#c9a227,#8b6f1a);
            display:grid;place-items:center;font-size:20px;
            box-shadow:0 0 0 3px rgba(201,162,39,0.25);
          ">
            <span>🎨</span>
            <span style="
              position:absolute;bottom:1px;right:1px;width:12px;height:12px;
              border-radius:50%;background:#22c55e;border:2px solid #1a1410;
            "></span>
          </div>
          <div>
            <strong style="display:block;font-size:14.5px;font-weight:700;color:#f4ebe0">دستیار هوشمند</strong>
            <span style="display:flex;align-items:center;gap:5px;font-size:11.5px;color:#a8e6a8;margin-top:2px">
              <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block"></span>
              آنلاین — هوش مصنوعی
            </span>
          </div>
        </div>
        <div style="display:flex;gap:4px">
          <button id="chatClearBtn" title="پاک کردن" style="
            width:32px;height:32px;border-radius:50%;border:1px solid rgba(201,162,39,0.3);
            background:transparent;color:#f4ebe0;cursor:pointer;display:grid;place-items:center;font-size:15px;
          ">🗑</button>
          <button id="chatClose" aria-label="Close" style="
            width:32px;height:32px;border-radius:50%;border:1px solid rgba(201,162,39,0.3);
            background:transparent;color:#f4ebe0;cursor:pointer;display:grid;place-items:center;font-size:20px;
          ">×</button>
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
     3) LOGIC
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

  if (!chatToggle || !chatBox) return;

  // تاریخچه مکالمه برای AI
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
    wrap.className = 'chat-message ' + sender;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    if (isHTML) bubble.innerHTML = text;
    else bubble.textContent = text;
    const time = document.createElement('span');
    time.className = 'msg-time';
    time.textContent = timeNow();
    time.style.cssText = 'font-size:10px;color:#8b5a3c;margin-top:4px;padding:0 6px;opacity:0.7';
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
     4) AI TEXT — Pollinations API
  ========================================================= */
  async function askAI(userMessage) {
    // اضافه به تاریخچه
    conversationHistory.push({ role: 'user', content: userMessage });
    
    // محدود کردن تاریخچه
    if (conversationHistory.length > CONFIG.maxHistory * 2 + 1) {
      conversationHistory = [
        conversationHistory[0], // system prompt
        ...conversationHistory.slice(-CONFIG.maxHistory * 2)
      ];
    }

    try {
      const response = await fetch(CONFIG.textAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: CONFIG.model,
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) throw new Error('API error: ' + response.status);

      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || 'متوجه نشدم، لطفاً دوباره بپرسید.';

      // اضافه به تاریخچه
      conversationHistory.push({ role: 'assistant', content: aiReply });

      return aiReply;
    } catch (err) {
      console.error('❌ AI error:', err);
      return 'متأسفم، در ارتباط با هوش مصنوعی مشکلی پیش آمد. لطفاً دوباره تلاش کنید. 🙏';
    }
  }

  /* =========================================================
     5) AI IMAGE — Pollinations Image API
  ========================================================= */
  async function generateImage(prompt) {
    // پیام کاربر
    addMessage('🎨 در حال ساخت تصویر: ' + escapeHtml(prompt), 'user');

    // کارت لودینگ
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
      // ساخت URL تصویر
      const encodedPrompt = encodeURIComponent(prompt + ', oil painting style, artistic, masterpiece, high quality');
      const imageURL = `${CONFIG.imageAPI}${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

      // تست لود تصویر
      const testImg = new Image();
      testImg.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('timeout')), 45000);
        testImg.onload = () => { clearTimeout(timeout); resolve(); };
        testImg.onerror = () => { clearTimeout(timeout); reject(new Error('load failed')); };
        testImg.src = imageURL;
      });

      // حذف کارت لودینگ
      loadingBubble.parentElement.remove();

      // نمایش تصویر
      const imgBubble = addMessage(`
        🎨 <strong>تصویر ساخته شد!</strong>
        <div style="margin-top:10px;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.15)">
          <img src="${imageURL}" alt="${escapeHtml(prompt)}" style="width:100%;display:block" />
        </div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <button onclick="window.open('${imageURL}','_blank')" style="
            flex:1;background:#1a1410;color:#fff;border:none;
            padding:8px;border-radius:8px;cursor:pointer;font-size:12px;
          ">🔍 بزرگ‌نمایی</button>
          <a href="${imageURL}" download="artist-ai-${Date.now()}.jpg" target="_blank" style="
            flex:1;background:#c9a227;color:#1a1410;border:none;
            padding:8px;border-radius:8px;cursor:pointer;font-size:12px;
            text-align:center;text-decoration:none;font-weight:600;
          ">⬇ دانلود</a>
        </div>
      `, 'bot', true);

    } catch (err) {
      console.error('❌ Image error:', err);
      loadingBubble.parentElement.remove();
      addMessage('❌ متأسفم، ساخت تصویر با خطا مواجه شد. لطفاً دوباره تلاش کنید یا درخواست رو ساده‌تر بنویسید. 🎨', 'bot');
    }
  }

  /* =========================================================
     6) SEND MESSAGE
  ========================================================= */
  async function sendMessage(text, isImageRequest) {
    if (!text || !text.trim()) return;

    addMessage(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // چک کن آیا درخواست تصویره
    const imageKeywords = /بساز|بکش|تولید کن|رسم کن|تصویر.*بساز|عکس.*بساز|generate|create.*image|draw|paint/i;
    const isImage = isImageRequest || imageKeywords.test(text);

    if (isImage) {
      // حذف کلمات درخواست از پرامپت
      const cleanPrompt = text
        .replace(/بساز|بکش|تولید کن|رسم کن|generate|create|draw|paint/gi, '')
        .replace(/یک|یه|یه عکس|یک تصویر|image|picture/gi, '')
        .trim() || text;
      
      await generateImage(cleanPrompt);
      return;
    }

    // سوال متنی → AI
    showTyping(true);
    const reply = await askAI(text);
    showTyping(false);
    addMessage(reply, 'bot', true);
  }

  /* =========================================================
     7) EVENTS
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

  // دکمه تولید تصویر
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

  // پیشنهادات
  if (suggestions) {
    suggestions.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      const ask = btn.dataset.ask || btn.textContent;
      sendMessage(ask);
    });
  }

  // باز/بسته
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

  // پاک کردن
  if (chatClearBtn) {
    chatClearBtn.addEventListener('click', function () {
      if (!confirm('تاریخچه چت پاک بشه؟')) return;
      chatMessages.innerHTML = '';
      conversationHistory = [{ role: 'system', content: CONFIG.systemPrompt }];
      addMessage('تاریخچه پاک شد. چطور می‌تونم کمکتون کنم؟ 😊', 'bot');
    });
  }

  /* =========================================================
     8) WELCOME
  ========================================================= */
  addMessage(`
    سلام! 👋 من <strong>دستیار هوشمند هنری</strong> شما هستم.
    <br><br>
    می‌تونم:
    <ul>
      <li>💬 به هر سوالی جواب بدم</li>
      <li>🎨 براتون تصویر بسازم</li>
      <li>🖼️ درباره نقاشی‌ها، کلاس‌ها، پرینت‌ها راهنمایی کنم</li>
    </ul>
    <br>
    <em>مثلاً بپرسید: «یک نقاشی از غروب بساز» 🎨</em>
  `, 'bot', true);

  setTimeout(function () {
    if (!chatBox.classList.contains('open') && chatBadge) {
      chatBadge.style.display = 'grid';
    }
  }, 4000);

  console.log('✅ چت هوشمند با AI راه‌اندازی شد');

})();
