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

  if (button && statusText) {
    button.addEventListener('click', () => {
      state.count += 1;
      button.textContent = `Send Love 💖 (${state.count})`;
      statusText.textContent = `You've sent love ${state.count} time${state.count === 1 ? '' : 's'}!`;
    });
  }
}
