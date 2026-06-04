(function() {
  const container = document.getElementById('particles');
  if (!container) return;

  function createParticle() {
    const p = document.createElement('div');
    const size = Math.random() * 5 + 3;
    p.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.8), transparent);
      border-radius: 50%;
      animation: floatUp ${Math.random() * 9 + 8}s linear forwards;
      pointer-events: none;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 17000);
  }

  if (!document.getElementById('particle-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = `
      @keyframes floatUp {
        0% { transform: translateY(0) scale(0); opacity: 0; }
        10% { opacity: 0.8; }
        80% { opacity: 0.2; }
        100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setInterval(() => {
    if (!document.hidden) createParticle();
  }, 350);

  for (let i = 0; i < 22; i++) {
    setTimeout(createParticle, i * 200);
  }
})();