import { BalloonPhysics } from './physics';

const app = document.querySelector<HTMLDivElement>('#app');

const playlist = [
  { title: 'Rex Orange County — Best Friend', src: '/assets/music.mp3' },
  { title: 'Mabel Matiz — Fırtınadayım', src: '/assets/mabel-matiz.mp3' },
];

let currentTrackIndex = 0;

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
    <div class="ambient-sound-indicator" id="sound-indicator">
      <button class="sound-ctrl-btn" id="sound-toggle-btn" aria-label="Toggle playback" title="Play / Pause">
        <span class="note-icon" id="sound-icon">🎵</span>
      </button>
      <span id="sound-text" class="sound-title" title="Current track">${playlist[0].title}</span>
      <button class="sound-ctrl-btn" id="sound-next-btn" aria-label="Next track" title="Next track">
        <span>⏭</span>
      </button>
    </div>
    <audio id="dinner-audio" src="${playlist[0].src}" preload="auto"></audio>
  `;

  const balloonStage = document.querySelector<HTMLElement>('#balloon-stage');
  const audio = document.querySelector<HTMLAudioElement>('#dinner-audio');
  const soundToggleBtn = document.querySelector<HTMLButtonElement>('#sound-toggle-btn');
  const soundNextBtn = document.querySelector<HTMLButtonElement>('#sound-next-btn');
  const soundText = document.querySelector<HTMLSpanElement>('#sound-text');
  const soundIcon = document.querySelector<HTMLSpanElement>('#sound-icon');

  if (audio) {
    audio.volume = 0.22; // Dimmed dinner ambiance volume

    const updateUI = (playing: boolean) => {
      if (soundIcon) soundIcon.textContent = playing ? '🎵' : '🔇';
      if (soundText) soundText.textContent = playlist[currentTrackIndex].title;
    };

    const loadAndPlayTrack = (index: number) => {
      currentTrackIndex = (index + playlist.length) % playlist.length;
      audio.src = playlist[currentTrackIndex].src;
      audio.load();
      audio.play().then(() => updateUI(true)).catch(() => updateUI(false));
    };

    const toggleAudio = () => {
      if (audio.paused) {
        audio.play().then(() => updateUI(true)).catch(() => {});
      } else {
        audio.pause();
        updateUI(false);
      }
    };

    const nextTrack = () => {
      loadAndPlayTrack(currentTrackIndex + 1);
    };

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAudio();
      });
    }

    if (soundText) {
      soundText.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAudio();
      });
    }

    if (soundNextBtn) {
      soundNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextTrack();
      });
    }

    // Auto-advance to next track when song finishes
    audio.addEventListener('ended', () => {
      nextTrack();
    });

    // Auto-play on first tap / click anywhere on the page
    const startOnInteract = () => {
      if (audio.paused) {
        audio.play().then(() => updateUI(true)).catch(() => {});
      }
      window.removeEventListener('pointerdown', startOnInteract);
      window.removeEventListener('keydown', startOnInteract);
    };

    window.addEventListener('pointerdown', startOnInteract);
    window.addEventListener('keydown', startOnInteract);

    // Initial play attempt
    audio.play().then(() => updateUI(true)).catch(() => {});
  }

  if (balloonStage) {
    new BalloonPhysics(balloonStage);
  }
}
