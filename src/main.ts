import { BalloonPhysics } from './physics';

interface AppState {
  count: number;
  message: string;
}

const state: AppState = {
  count: 0,
  message: 'Touch or move near the balloons to play with them ✨'
};

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <div class="card">
      <div class="content">
        <div class="badge">💖 For Isha</div>
        
        <!-- ISHA Balloon Letters Formation -->
        <div class="isha-balloon-stage" id="balloon-stage" title="Interactive 3D Balloons - hover, tap, or drag!">
          <div class="balloon-item" data-index="0" data-letter="I">
            <img src="/assets/balloon-i.png" alt="Letter I" class="balloon-img" draggable="false" />
            <div class="balloon-shadow"></div>
          </div>
          <div class="balloon-item" data-index="1" data-letter="S">
            <img src="/assets/balloon-s.png" alt="Letter S" class="balloon-img" draggable="false" />
            <div class="balloon-shadow"></div>
          </div>
          <div class="balloon-item" data-index="2" data-letter="H">
            <img src="/assets/balloon-h.png" alt="Letter H" class="balloon-img" draggable="false" />
            <div class="balloon-shadow"></div>
          </div>
          <div class="balloon-item" data-index="3" data-letter="A">
            <img src="/assets/balloon-a.png" alt="Letter A" class="balloon-img" draggable="false" />
            <div class="balloon-shadow"></div>
          </div>
        </div>

        <img src="/assets/heart.svg" alt="Heart Icon" width="48" height="48" style="margin-bottom: 0.75rem;" />
        <h1>iluvisha</h1>
        <p class="subtitle">Floating with realistic physics just for you. Tap, drag, or hover over each balloon!</p>

        <div class="letter-image" title="Hover or click to open letter">
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
          <span class="tag">Physics Simulation</span>
          <span class="tag">3D Balloons</span>
          <span class="tag">TypeScript 5+</span>
          <span class="tag">Vercel</span>
        </div>

        <div class="btn-container">
          <button id="counter" class="interactive-btn" type="button">Send Love 💖 (0)</button>
        </div>
        <p class="counter-text" id="status-text">${state.message}</p>
      </div>
    </div>
  `;

  const balloonStage = document.querySelector<HTMLElement>('#balloon-stage');
  const button = document.querySelector<HTMLButtonElement>('#counter');
  const statusText = document.querySelector<HTMLParagraphElement>('#status-text');
  const letters = ['I', 'S', 'H', 'A'];

  let physics: BalloonPhysics | null = null;
  if (balloonStage) {
    physics = new BalloonPhysics(balloonStage, (index) => {
      state.count += 5;
      if (button) button.textContent = `Send Love 💖 (${state.count})`;
      if (statusText) {
        statusText.textContent = `You tapped '${letters[index]}' balloon! Love bonus added: ${state.count} 💖`;
      }
    });
  }

  const letterImage = document.querySelector<HTMLDivElement>('.letter-image');
  if (letterImage) {
    letterImage.addEventListener('click', () => {
      letterImage.classList.toggle('active');
    });
  }

  if (button && statusText) {
    button.addEventListener('click', () => {
      state.count += 1;
      button.textContent = `Send Love 💖 (${state.count})`;
      statusText.textContent = `You've sent love ${state.count} time${state.count === 1 ? '' : 's'}!`;
      if (physics) {
        physics.bopAll();
      }
    });
  }
}


