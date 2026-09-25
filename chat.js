console.log('🔵 chat.js لود شد!');

window.addEventListener('DOMContentLoaded', function() {
  console.log('🔵 DOM آماده است');
  
  // یک دکمه قرمز ساده بساز
  const btn = document.createElement('button');
  btn.textContent = '💬 تست';
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: red;
    color: white;
    font-size: 16px;
    border: none;
    cursor: pointer;
    z-index: 9999999;
  `;
  btn.onclick = () => alert('کار می‌کنه!');
  document.body.appendChild(btn);
  
  console.log('🔵 دکمه قرمز اضافه شد');
});
