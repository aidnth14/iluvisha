import { BalloonPhysics } from './physics';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <!-- ISHA Realistic Physics Balloon Letters Only -->
    <div class="isha-balloon-stage" id="balloon-stage" aria-label="ISHA">
      <div class="balloon-item" data-index="0" data-letter="I">
        <img src="/assets/balloon-i.png" alt="I" class="balloon-img" draggable="false" />
        <div class="balloon-shadow"></div>
      </div>
      <div class="balloon-item" data-index="1" data-letter="S">
        <img src="/assets/balloon-s.png" alt="S" class="balloon-img" draggable="false" />
        <div class="balloon-shadow"></div>
      </div>
      <div class="balloon-item" data-index="2" data-letter="H">
        <img src="/assets/balloon-h.png" alt="H" class="balloon-img" draggable="false" />
        <div class="balloon-shadow"></div>
      </div>
      <div class="balloon-item" data-index="3" data-letter="A">
        <img src="/assets/balloon-a.png" alt="A" class="balloon-img" draggable="false" />
        <div class="balloon-shadow"></div>
      </div>
    </div>

    <!-- Ambient Dinner Music Indicator (Dimmed) -->
    <div class="ambient-sound-indicator" id="sound-indicator" title="Click to toggle music">
      <span class="note-icon" id="sound-icon">🎵</span>
      <span id="sound-text">Rex Orange County — Best Friend</span>
    </div>
    <audio id="dinner-audio" src="/assets/music.mp3" loop preload="auto"></audio>
  `;

  const balloonStage = document.querySelector<HTMLElement>('#balloon-stage');
  const audio = document.querySelector<HTMLAudioElement>('#dinner-audio');
  const soundIndicator = document.querySelector<HTMLDivElement>('#sound-indicator');
  const soundIcon = document.querySelector<HTMLSpanElement>('#sound-icon');

  if (audio) {
    audio.volume = 0.22; // Dimmed dinner ambiance volume

    const updateAudioIcon = (playing: boolean) => {
      if (soundIcon) soundIcon.textContent = playing ? '🎵' : '🔇';
    };

    const toggleAudio = () => {
      if (audio.paused) {
        audio.play().then(() => updateAudioIcon(true)).catch(() => {});
      } else {
        audio.pause();
        updateAudioIcon(false);
      }
    };

    if (soundIndicator) {
      soundIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAudio();
      });
    }

    // Auto-play on first tap / click anywhere on the page
    const startOnInteract = () => {
      if (audio.paused) {
        audio.play().then(() => updateAudioIcon(true)).catch(() => {});
      }
      window.removeEventListener('pointerdown', startOnInteract);
      window.removeEventListener('keydown', startOnInteract);
    };

    window.addEventListener('pointerdown', startOnInteract);
    window.addEventListener('keydown', startOnInteract);

    // Initial play attempt
    audio.play().then(() => updateAudioIcon(true)).catch(() => {});
  }

  if (balloonStage) {
    new BalloonPhysics(balloonStage);
  }
}
