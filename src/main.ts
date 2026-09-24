interface AppState {
  count: number;
  message: string;
}

const state: AppState = {
  count: 0,
  message: 'Welcome to iluvisha ✨'
};

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <div class="card">
      <div class="content">
        <div class="badge">🚀 Powered by TypeScript & Vite</div>
        <div class="hero-character-container">
          <img src="/assets/letter-i.png" alt="Glossy 3D Letter I" class="hero-letter-img" title="Click or tap me!" />
        </div>
        <img src="/assets/heart.svg" alt="Heart Icon" width="56" height="56" style="margin-bottom: 1.25rem;" />
        <h1>iluvisha</h1>
        <p class="subtitle">A fast, modern TypeScript project configured with custom assets and deployed seamlessly to Vercel.</p>
        <div class="letter-image" title="Hover or click to open">
          <div class="animated-mail">
            <div class="back-fold"></div>
            <div class="letter">
              <div class="letter-border"></div>
              <div class="letter-title"></div>
              <div class="letter-context"></div>
              <div class="letter-stamp">
                <div class="letter-stamp-inner"></div>
              </div>
            </div>
            <div class="top-fold"></div>
            <div class="body"></div>
            <div class="left-fold"></div>
          </div>
          <div class="shadow"></div>
        </div>
        <div class="tags">
          <span class="tag">TypeScript 5+</span>
          <span class="tag">Vite</span>
          <span class="tag">Vercel</span>
          <span class="tag">Assets</span>
        </div>
        <div class="btn-container">
          <button id="counter" class="interactive-btn" type="button">Send Love 💖 (0)</button>
        </div>
        <p class="counter-text" id="status-text">${state.message}</p>
      </div>
    </div>
  `;

  const letterImage = document.querySelector<HTMLDivElement>('.letter-image');
  if (letterImage) {
    letterImage.addEventListener('click', () => {
      letterImage.classList.toggle('active');
    });
  }

  const button = document.querySelector<HTMLButtonElement>('#counter');
  const statusText = document.querySelector<HTMLParagraphElement>('#status-text');
  const heroLetter = document.querySelector<HTMLImageElement>('.hero-letter-img');

  if (heroLetter && statusText) {
    heroLetter.addEventListener('click', () => {
      state.count += 5;
      if (button) button.textContent = `Send Love 💖 (${state.count})`;
      statusText.textContent = `You tapped the 3D 'I'! Bonus love added: ${state.count}! 💖`;
      heroLetter.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.28) rotate(-12deg)' },
        { transform: 'scale(0.9) rotate(12deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 500,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      });
    });
  }

  if (button && statusText) {
    button.addEventListener('click', () => {
      state.count += 1;
      button.textContent = `Send Love 💖 (${state.count})`;
      statusText.textContent = `You've sent love ${state.count} time${state.count === 1 ? '' : 's'}!`;
    });
  }
}

