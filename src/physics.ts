export interface BalloonItem {
  element: HTMLElement;
  shadowElement: HTMLElement | null;
  imgElement: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  phase: number;
  hoverFreqX: number;
  hoverFreqY: number;
  hoverAmpX: number;
  hoverAmpY: number;
  tiltAmp: number;
  mass: number;
  isDragging: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
}

export class BalloonPhysics {
  private balloons: BalloonItem[] = [];
  private container: HTMLElement;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private mouseX: number = -9999;
  private mouseY: number = -9999;
  private mousePrevX: number = -9999;
  private mousePrevY: number = -9999;
  private mouseVx: number = 0;
  private mouseVy: number = 0;

  constructor(container: HTMLElement, onBalloonTap?: (index: number) => void) {
    this.container = container;
    this.initBalloons(onBalloonTap);
    this.initEvents();
    this.start();
  }

  private initBalloons(onBalloonTap?: (index: number) => void): void {
    const items = this.container.querySelectorAll<HTMLElement>('.balloon-item');

    // Individual natural variations for each balloon
    const configs = [
      { phase: 0.0, freqX: 1.1, freqY: 1.5, ampX: 7, ampY: 12, tilt: 5.5, mass: 1.0 }, // I
      { phase: 1.8, freqX: 0.9, freqY: 1.3, ampX: 8, ampY: 14, tilt: 6.0, mass: 1.1 }, // S
      { phase: 3.5, freqX: 1.2, freqY: 1.6, ampX: 7, ampY: 11, tilt: 5.0, mass: 1.2 }, // H
      { phase: 5.1, freqX: 1.0, freqY: 1.4, ampX: 9, ampY: 13, tilt: 6.5, mass: 1.15 }  // A
    ];

    items.forEach((el, index) => {
      const img = el.querySelector<HTMLElement>('.balloon-img');
      const shadow = el.querySelector<HTMLElement>('.balloon-shadow');
      if (!img) return;

      const cfg = configs[index % configs.length];

      const balloon: BalloonItem = {
        element: el,
        shadowElement: shadow,
        imgElement: img,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rotation: 0,
        vRot: 0,
        phase: cfg.phase,
        hoverFreqX: cfg.freqX,
        hoverFreqY: cfg.freqY,
        hoverAmpX: cfg.ampX,
        hoverAmpY: cfg.ampY,
        tiltAmp: cfg.tilt,
        mass: cfg.mass,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0
      };

      this.balloons.push(balloon);

      // Tap / Click interaction
      el.addEventListener('pointerdown', (e) => {
        balloon.isDragging = true;
        const rect = el.getBoundingClientRect();
        balloon.dragOffsetX = e.clientX - (rect.left + rect.width / 2);
        balloon.dragOffsetY = e.clientY - (rect.top + rect.height / 2);
        el.setPointerCapture(e.pointerId);

        // Immediate tactile impulse
        this.applyImpulse(index, (Math.random() - 0.5) * 50, -120, (Math.random() - 0.5) * 40);

        if (onBalloonTap) {
          onBalloonTap(index);
        }
      });

      el.addEventListener('pointermove', (e) => {
        if (balloon.isDragging) {
          const containerRect = this.container.getBoundingClientRect();
          const targetGlobalX = e.clientX - balloon.dragOffsetX;
          const targetGlobalY = e.clientY - balloon.dragOffsetY;
          const anchorX = el.offsetLeft + el.offsetWidth / 2 + containerRect.left;
          const anchorY = el.offsetTop + el.offsetHeight / 2 + containerRect.top;

          // Clamp displacement to keep formation integrity
          const dx = Math.max(-60, Math.min(60, targetGlobalX - anchorX));
          const dy = Math.max(-60, Math.min(60, targetGlobalY - anchorY));

          balloon.x = dx;
          balloon.y = dy;
          balloon.vx = (e.movementX || 0) * 15;
          balloon.vy = (e.movementY || 0) * 15;
          balloon.rotation = Math.max(-20, Math.min(20, balloon.vx * 0.3));
        }
      });

      const releaseDrag = (e: PointerEvent) => {
        if (balloon.isDragging) {
          balloon.isDragging = false;
          try {
            el.releasePointerCapture(e.pointerId);
          } catch {
            // no-op if already released
          }
          // Slight spring release impulse
          balloon.vy -= 60;
        }
      };

      el.addEventListener('pointerup', releaseDrag);
      el.addEventListener('pointercancel', releaseDrag);
    });
  }

  private initEvents(): void {
    window.addEventListener('pointermove', (e) => {
      if (this.mousePrevX !== -9999) {
        this.mouseVx = (e.clientX - this.mousePrevX) * 0.4;
        this.mouseVy = (e.clientY - this.mousePrevY) * 0.4;
      }
      this.mousePrevX = e.clientX;
      this.mousePrevY = e.clientY;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('pointerleave', () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
      this.mouseVx = 0;
      this.mouseVy = 0;
    });
  }

  public applyImpulse(index: number, fx: number, fy: number, fRot: number): void {
    if (this.balloons[index]) {
      const b = this.balloons[index];
      b.vx += fx / b.mass;
      b.vy += fy / b.mass;
      b.vRot += fRot / b.mass;
    }
  }

  public bopAll(): void {
    this.balloons.forEach((_, idx) => {
      this.applyImpulse(
        idx,
        (Math.random() - 0.5) * 70,
        -150 - Math.random() * 80,
        (Math.random() - 0.5) * 45
      );
    });
  }

  public start(): void {
    if (this.animFrameId !== null) return;
    this.lastTime = performance.now();
    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.033);
      this.lastTime = currentTime;

      this.update(currentTime / 1000, dt);

      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private update(t: number, dt: number): void {
    const springK = 22.0;       // Tether stiffness returning to formation anchor
    const damping = 3.6;        // Fluid air resistance damping
    const rotSpringK = 18.0;    // Rotational stiffness
    const rotDamping = 4.2;     // Rotational damping

    for (let i = 0; i < this.balloons.length; i++) {
      const b = this.balloons[i];

      if (b.isDragging) {
        // While dragging, directly render
        this.renderBalloon(b);
        continue;
      }

      // 1. Natural buoyant harmonic floating & tilting (realistic balloon air drift)
      const targetHoverX = Math.sin(t * b.hoverFreqX + b.phase) * b.hoverAmpX;
      const targetHoverY = Math.cos(t * b.hoverFreqY + b.phase) * b.hoverAmpY;

      // Realistic tilt: base sway + tilt opposite to horizontal motion (aerodynamic drag)
      const baseTilt = Math.sin(t * b.hoverFreqY * 0.9 + b.phase) * b.tiltAmp;
      const velocityTilt = Math.max(-12, Math.min(12, b.vx * 0.06));
      const targetTilt = baseTilt + velocityTilt;

      // 2. Spring-Damper physics forces toward anchor
      let fx = -springK * (b.x - targetHoverX) - damping * b.vx;
      let fy = -springK * (b.y - targetHoverY) - damping * b.vy;
      let torque = -rotSpringK * (b.rotation - targetTilt) - rotDamping * b.vRot;

      // 3. Ambient interactive airflow (mouse proximity repulsion)
      if (this.mouseX !== -9999 && this.mouseY !== -9999) {
        const rect = b.imgElement.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dx = bx - this.mouseX;
        const dy = by - this.mouseY;
        const dist = Math.hypot(dx, dy);
        const influenceRadius = 140;

        if (dist < influenceRadius && dist > 1) {
          const normDist = 1 - dist / influenceRadius;
          const pushForce = normDist * normDist * 320;
          const angle = Math.atan2(dy, dx);

          fx += Math.cos(angle) * pushForce;
          fy += Math.sin(angle) * pushForce;

          // Aerodynamic tilt from wind push
          torque += (dx > 0 ? 1 : -1) * pushForce * 0.05;

          // Add wind velocity transfer from fast cursor movement
          fx += this.mouseVx * normDist * 40;
          fy += this.mouseVy * normDist * 40;
        }
      }

      // 4. Numerical integration (Newton's 2nd Law)
      const ax = fx / b.mass;
      const ay = fy / b.mass;
      const aRot = torque / b.mass;

      b.vx += ax * dt;
      b.vy += ay * dt;
      b.vRot += aRot * dt;

      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rotation += b.vRot * dt;

      // 5. Formation safety bounds: ensure balloons never break formation
      b.x = Math.max(-45, Math.min(45, b.x));
      b.y = Math.max(-40, Math.min(40, b.y));
      b.rotation = Math.max(-25, Math.min(25, b.rotation));

      // 6. Update CSS transform
      this.renderBalloon(b);
    }
  }

  private renderBalloon(b: BalloonItem): void {
    // Translate and tilt balloon image
    b.imgElement.style.transform = `translate3d(${b.x.toFixed(2)}px, ${b.y.toFixed(2)}px, 0) rotate(${b.rotation.toFixed(2)}deg)`;

    // Dynamic depth shadow: shrinks and fades when balloon rises, darkens when close
    if (b.shadowElement) {
      const heightFactor = Math.max(0.6, Math.min(1.4, 1 - b.y * 0.012));
      const shadowX = b.x * 0.35;
      const shadowOpacity = Math.max(0.18, Math.min(0.55, 0.38 - b.y * 0.005));
      b.shadowElement.style.transform = `translate3d(${shadowX.toFixed(2)}px, 0, 0) scale(${heightFactor.toFixed(3)})`;
      b.shadowElement.style.opacity = shadowOpacity.toFixed(3);
    }
  }
}
