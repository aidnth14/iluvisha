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

    // Subtle natural variations with 5-7px movement distance
    const configs = [
      { phase: 0.0, freqX: 0.9, freqY: 1.2, ampX: 3.5, ampY: 5.5, tilt: 2.2, mass: 1.0 }, // I
      { phase: 1.8, freqX: 0.8, freqY: 1.0, ampX: 4.0, ampY: 6.0, tilt: 2.6, mass: 1.05 }, // S
      { phase: 3.5, freqX: 1.0, freqY: 1.3, ampX: 3.2, ampY: 5.0, tilt: 2.0, mass: 1.1 }, // H
      { phase: 5.1, freqX: 0.85, freqY: 1.1, ampX: 4.0, ampY: 5.8, tilt: 2.5, mass: 1.08 }  // A
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

      // Tap / Click / Touch interaction
      el.addEventListener('pointerdown', (e) => {
        balloon.isDragging = true;
        const rect = el.getBoundingClientRect();
        balloon.dragOffsetX = e.clientX - (rect.left + rect.width / 2);
        balloon.dragOffsetY = e.clientY - (rect.top + rect.height / 2);
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          // pointer capture fallback
        }

        // Tactile impulse on touch / click
        this.applyImpulse(index, (Math.random() - 0.5) * 8, -16, (Math.random() - 0.5) * 6);

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

          // Clamp displacement to 5-7px
          const dx = Math.max(-6.0, Math.min(6.0, targetGlobalX - anchorX));
          const dy = Math.max(-6.0, Math.min(6.0, targetGlobalY - anchorY));

          balloon.x = dx;
          balloon.y = dy;
          balloon.vx = (e.movementX || 0) * 4;
          balloon.vy = (e.movementY || 0) * 4;
          balloon.rotation = Math.max(-3.5, Math.min(3.5, balloon.vx * 0.15));
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

    const resetMouse = () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
      this.mouseVx = 0;
      this.mouseVy = 0;
    };

    window.addEventListener('pointerleave', resetMouse);
    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') {
        resetMouse();
      }
    });
    window.addEventListener('touchend', resetMouse, { passive: true });
    window.addEventListener('touchcancel', resetMouse, { passive: true });
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
        (Math.random() - 0.5) * 8,
        -14,
        (Math.random() - 0.5) * 6
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
    const springK = 28.0;       // Stiff tether keeping 5-7px formation
    const damping = 4.5;        // Fluid air resistance
    const rotSpringK = 24.0;    // Rotational stiffness
    const rotDamping = 4.8;     // Rotational damping

    for (let i = 0; i < this.balloons.length; i++) {
      const b = this.balloons[i];

      if (b.isDragging) {
        this.renderBalloon(b);
        continue;
      }

      // 1. Natural buoyant harmonic floating & tilting (5-7px range)
      const targetHoverX = Math.sin(t * b.hoverFreqX + b.phase) * b.hoverAmpX;
      const targetHoverY = Math.cos(t * b.hoverFreqY + b.phase) * b.hoverAmpY;

      // Subtle tilt: base sway + tilt opposite to horizontal motion
      const baseTilt = Math.sin(t * b.hoverFreqY * 0.9 + b.phase) * b.tiltAmp;
      const velocityTilt = Math.max(-2.5, Math.min(2.5, b.vx * 0.03));
      const targetTilt = baseTilt + velocityTilt;

      // 2. Spring-Damper physics forces toward anchor
      let fx = -springK * (b.x - targetHoverX) - damping * b.vx;
      let fy = -springK * (b.y - targetHoverY) - damping * b.vy;
      let torque = -rotSpringK * (b.rotation - targetTilt) - rotDamping * b.vRot;

      // 3. Subtle ambient airflow on mouse proximity (tight range)
      if (this.mouseX !== -9999 && this.mouseY !== -9999) {
        const rect = b.imgElement.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dx = bx - this.mouseX;
        const dy = by - this.mouseY;
        const dist = Math.hypot(dx, dy);
        const influenceRadius = 100;

        if (dist < influenceRadius && dist > 1) {
          const normDist = 1 - dist / influenceRadius;
          const pushForce = normDist * normDist * 40;
          const angle = Math.atan2(dy, dx);

          fx += Math.cos(angle) * pushForce;
          fy += Math.sin(angle) * pushForce;

          torque += (dx > 0 ? 1 : -1) * pushForce * 0.02;

          fx += this.mouseVx * normDist * 8;
          fy += this.mouseVy * normDist * 8;
        }
      }

      // 4. Numerical integration
      const ax = fx / b.mass;
      const ay = fy / b.mass;
      const aRot = torque / b.mass;

      b.vx += ax * dt;
      b.vy += ay * dt;
      b.vRot += aRot * dt;

      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rotation += b.vRot * dt;

      // 5. Strict 5-7px formation bounds
      b.x = Math.max(-6.0, Math.min(6.0, b.x));
      b.y = Math.max(-6.5, Math.min(6.5, b.y));
      b.rotation = Math.max(-3.5, Math.min(3.5, b.rotation));

      // 6. Update CSS transform
      this.renderBalloon(b);
    }
  }

  private renderBalloon(b: BalloonItem): void {
    b.imgElement.style.transform = `translate3d(${b.x.toFixed(2)}px, ${b.y.toFixed(2)}px, 0) rotate(${b.rotation.toFixed(2)}deg)`;
  }
}
