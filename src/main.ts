import { BalloonPhysics } from './physics';

const app = document.querySelector<HTMLDivElement>('#app');

const playlist = [
  { title: 'Rex Orange County — Best Friend', src: '/assets/music.mp3' },
  { title: 'Mabel Matiz — Fırtınadayım', src: '/assets/mabel-matiz.mp3' },
];

let currentTrackIndex = 0;

if (app) {
  app.innerHTML = `
    <!-- Darkened Welcome Curtain for Physical Touch / Sound Activation -->
    <div id="welcome-curtain" class="welcome-curtain" role="button" tabindex="0" aria-label="Tap anywhere on the screen to enter">
      <div class="curtain-content">
        <div class="curtain-heart">💖</div>
        <div class="curtain-loading" id="curtain-loading">
          <span class="curtain-dots">Preparing something special for you...</span>
        </div>
        <div class="curtain-prompt hidden" id="curtain-prompt">
          <h2 class="curtain-title">Tap anywhere on the screen</h2>
          <p class="curtain-subtitle">🎵 Turn your sound on for the best experience</p>
          <div class="curtain-pulse-ring"></div>
        </div>
      </div>
    </div>

    <!-- Dimmed Background Overlay when Note Pops Out -->
    <div class="note-backdrop" id="note-backdrop" aria-hidden="true"></div>

    <!-- Hero / Landing Section: Full focus on ISHA balloon letters -->
    <section class="hero-landing-section snap-section" id="hero-landing">
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
          <div class="sorry-text" id="sorry-text">Im sorry baby</div>
        </div>
      </div>

      <!-- Subtle scroll cue pointing down to the photo grid -->
      <a href="#grid-section" class="scroll-cue" aria-label="Scroll down to photos">
        <span class="scroll-arrow">↓</span>
      </a>
    </section>

    <!-- Photo Section: 3x3 square grid with sharp square edges & 2px gap -->
    <section class="photo-grid-section snap-section" id="grid-section">
      <div class="portrait-grid-container" id="portrait-grid">
        <svg viewBox="0 0 546 546" class="portrait-grid-svg" aria-label="Isha portrait in 3x3 square grid" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="sq-clip-0"><rect x="0" y="0" width="180" height="180" /></clipPath>
            <clipPath id="sq-clip-1"><rect x="182" y="0" width="180" height="180" /></clipPath>
            <clipPath id="sq-clip-2"><rect x="364" y="0" width="180" height="180" /></clipPath>

            <clipPath id="sq-clip-3"><rect x="0" y="182" width="180" height="180" /></clipPath>
            <clipPath id="sq-clip-4"><rect x="182" y="182" width="180" height="180" /></clipPath>
            <clipPath id="sq-clip-5"><rect x="364" y="182" width="180" height="180" /></clipPath>

            <clipPath id="sq-clip-6"><rect x="0" y="364" width="180" height="180" /></clipPath>
            <clipPath id="sq-clip-7"><rect x="182" y="364" width="180" height="180" /></clipPath>
            <clipPath id="sq-clip-8"><rect x="364" y="364" width="180" height="180" /></clipPath>
          </defs>

          <!-- 9 Square Cells with 2px gap -->
          <g class="grid-cells-group">
            <!-- Row 1 -->
            <g class="grid-cell" data-cell="0">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-0)" />
              <rect x="0" y="0" width="180" height="180" class="grid-frame" />
            </g>
            <g class="grid-cell" data-cell="1">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-1)" />
              <rect x="182" y="0" width="180" height="180" class="grid-frame" />
            </g>
            <g class="grid-cell" data-cell="2">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-2)" />
              <rect x="364" y="0" width="180" height="180" class="grid-frame" />
            </g>

            <!-- Row 2 -->
            <g class="grid-cell" data-cell="3">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-3)" />
              <rect x="0" y="182" width="180" height="180" class="grid-frame" />
            </g>
            <g class="grid-cell" data-cell="4">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-4)" />
              <rect x="182" y="182" width="180" height="180" class="grid-frame" />
            </g>
            <g class="grid-cell" data-cell="5">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-5)" />
              <rect x="364" y="182" width="180" height="180" class="grid-frame" />
            </g>

            <!-- Row 3 -->
            <g class="grid-cell" data-cell="6">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-6)" />
              <rect x="0" y="364" width="180" height="180" class="grid-frame" />
            </g>
            <g class="grid-cell" data-cell="7">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-7)" />
              <rect x="182" y="364" width="180" height="180" class="grid-frame" />
            </g>
            <g class="grid-cell" data-cell="8">
              <image href="/assets/IMG_5496.jpg" x="-34" y="-35" width="614" height="832" preserveAspectRatio="none" clip-path="url(#sq-clip-8)" />
              <rect x="364" y="364" width="180" height="180" class="grid-frame" />
            </g>
          </g>
        </svg>
      </div>

      <!-- Subtle scroll cue pointing down to envelope hero -->
      <a href="#envelope-section" class="scroll-cue grid-scroll-cue" id="cue-to-envelope" aria-label="Scroll down to love letter">
        <span class="scroll-arrow">↓</span>
      </a>
    </section>

    <!-- Envelope Hero Section: Full screen dedicated hero for love letter -->
    <section class="envelope-hero-section snap-section" id="envelope-section">
      <!-- Animated Love Letter Envelope with Message & Flowing Hearts -->
      <div class="envelope-wrapper" id="envelope-wrapper">
        <!-- Floating Hearts Layer -->
        <div class="hearts-container" id="hearts-container" aria-hidden="true"></div>

        <div class="letter-image" id="letter-image" role="button" tabindex="0" aria-label="Open love letter">
          <div class="animated-mail">
            <div class="back-fold"></div>
            <div class="letter" id="letter-note">
              <div class="letter-border"></div>
              <div class="letter-inner-content">
                <div class="letter-salutation">My Dearest Isha,</div>
                <div class="letter-message">
                  I'm truly sorry for everything baby. Every moment with you is precious, and my heart will always belong to you.
                </div>
                <div class="letter-signoff">Forever yours ❤️</div>
                <div class="letter-dismiss-hint">tap background to fold back</div>
              </div>
              <div class="letter-stamp" aria-hidden="true">
                <span class="letter-stamp-inner">🌸</span>
              </div>
            </div>
            <div class="top-fold"></div>
            <div class="left-fold"></div>
            <div class="right-fold"></div>
            <div class="body"></div>
          </div>
        </div>
      </div>
    </section>

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
    <audio id="dinner-audio" src="${playlist[0].src}" preload="auto" playsinline></audio>
  `;

  const balloonStage = document.querySelector<HTMLElement>('#balloon-stage');
  const audio = document.querySelector<HTMLAudioElement>('#dinner-audio');
  const soundToggleBtn = document.querySelector<HTMLButtonElement>('#sound-toggle-btn');
  const soundNextBtn = document.querySelector<HTMLButtonElement>('#sound-next-btn');
  const soundText = document.querySelector<HTMLSpanElement>('#sound-text');
  const soundIcon = document.querySelector<HTMLSpanElement>('#sound-icon');
  const scrollCue = document.querySelector<HTMLAnchorElement>('.scroll-cue');
  const cueToEnvelope = document.querySelector<HTMLAnchorElement>('#cue-to-envelope');
  const envelopeWrapper = document.querySelector<HTMLElement>('#envelope-wrapper');
  const letterImage = document.querySelector<HTMLElement>('#letter-image');
  const noteBackdrop = document.querySelector<HTMLElement>('#note-backdrop');
  const envelopeSection = document.querySelector<HTMLElement>('#envelope-section');
  const heartsContainer = document.querySelector<HTMLElement>('#hearts-container');

  if (scrollCue) {
    scrollCue.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#grid-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (cueToEnvelope) {
    cueToEnvelope.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#envelope-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Hearts flowing upwards animation system
  let heartInterval: number | null = null;
  const heartIcons = ['❤️', '💖', '💕', '💗', '💓', '💝'];

  const spawnHeart = (burst = false) => {
    if (!heartsContainer) return;
    const heart = document.createElement('span');
    heart.className = 'flowing-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

    const startX = (Math.random() - 0.5) * 140;
    const driftX = (Math.random() - 0.5) * 130;
    const duration = 2.0 + Math.random() * 1.2;
    const size = 16 + Math.random() * 14;
    const rotation = (Math.random() - 0.5) * 50;

    heart.style.left = `calc(50% + ${startX}px)`;
    heart.style.setProperty('--drift-x', `${driftX}px`);
    heart.style.setProperty('--target-rot', `${rotation}deg`);
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    if (burst) {
      heart.style.animationDelay = `${Math.random() * 0.35}s`;
    }

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000 + 400);
  };

  const startHeartFlow = () => {
    if (heartInterval !== null) return;
    for (let i = 0; i < 7; i++) {
      spawnHeart(true);
    }
    heartInterval = window.setInterval(() => {
      spawnHeart(false);
    }, 240);
  };

  const stopHeartFlow = () => {
    if (heartInterval !== null) {
      clearInterval(heartInterval);
      heartInterval = null;
    }
  };

  // The envelope WON'T open unless clicked
  const openEnvelope = () => {
    if (!envelopeWrapper?.classList.contains('open')) {
      envelopeWrapper?.classList.add('open');
      envelopeSection?.classList.add('is-open');
      noteBackdrop?.classList.add('active');
      startHeartFlow();
    }
  };

  const closeEnvelope = () => {
    if (envelopeWrapper?.classList.contains('open')) {
      envelopeWrapper?.classList.remove('open');
      envelopeSection?.classList.remove('is-open');
      noteBackdrop?.classList.remove('active');
      stopHeartFlow();
    }
  };

  if (letterImage) {
    letterImage.addEventListener('click', (e) => {
      if (!envelopeWrapper?.classList.contains('open')) {
        e.stopPropagation();
        openEnvelope();
      }
    });

    letterImage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (envelopeWrapper?.classList.contains('open')) {
          closeEnvelope();
        } else {
          openEnvelope();
        }
      }
    });
  }

  // When clicked on the background, the note folds right back into the envelope
  if (noteBackdrop) {
    noteBackdrop.addEventListener('click', () => {
      closeEnvelope();
    });
  }

  if (envelopeSection) {
    envelopeSection.addEventListener('click', (e) => {
      if (envelopeWrapper?.classList.contains('open')) {
        const target = e.target as HTMLElement;
        if (!target.closest('#letter-note')) {
          closeEnvelope();
        }
      }
    });
  }

  const welcomeCurtain = document.querySelector<HTMLElement>('#welcome-curtain');
  const curtainLoading = document.querySelector<HTMLElement>('#curtain-loading');
  const curtainPrompt = document.querySelector<HTMLElement>('#curtain-prompt');

  const updateUI = (playing: boolean) => {
    if (soundIcon) soundIcon.textContent = playing ? '🎵' : '🔇';
    if (soundText) soundText.textContent = playlist[currentTrackIndex].title;
  };

  if (audio) {
    audio.muted = false;
    audio.volume = 0.55;

    const loadAndPlayTrack = (index: number) => {
      currentTrackIndex = (index + playlist.length) % playlist.length;
      audio.src = playlist[currentTrackIndex].src;
      audio.load();
      audio.muted = false;
      audio.play().then(() => updateUI(true)).catch(() => updateUI(false));
    };

    const toggleAudio = () => {
      if (audio.paused) {
        audio.muted = false;
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
  }

  // After 3 seconds, inform the user to tap anywhere on the screen
  let curtainTimer: number | null = window.setTimeout(() => {
    if (curtainLoading) curtainLoading.style.display = 'none';
    if (curtainPrompt) curtainPrompt.classList.remove('hidden');
  }, 3000);

  let curtainDismissed = false;
  const dismissCurtainAndPlay = () => {
    if (curtainDismissed) return;
    curtainDismissed = true;

    if (curtainTimer !== null) {
      clearTimeout(curtainTimer);
      curtainTimer = null;
    }

    if (audio) {
      audio.muted = false;
      audio.volume = 0.55;
      audio.play().then(() => updateUI(true)).catch((err) => {
        console.warn('Physical touch play attempt:', err);
      });
    }

    if (welcomeCurtain) {
      welcomeCurtain.classList.add('curtain-fade-out');
      setTimeout(() => {
        welcomeCurtain.remove();
      }, 850);
    }

    window.removeEventListener('pointerdown', dismissCurtainAndPlay);
    window.removeEventListener('keydown', dismissCurtainAndPlay);
    window.removeEventListener('touchstart', dismissCurtainAndPlay);
  };

  if (welcomeCurtain) {
    welcomeCurtain.addEventListener('click', dismissCurtainAndPlay);
    welcomeCurtain.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismissCurtainAndPlay();
      }
    });
  }

  window.addEventListener('pointerdown', dismissCurtainAndPlay);
  window.addEventListener('keydown', dismissCurtainAndPlay);
  window.addEventListener('touchstart', dismissCurtainAndPlay, { passive: true });

  if (balloonStage) {
    new BalloonPhysics(balloonStage);
  }
}
