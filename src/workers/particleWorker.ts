// sacred-flow: Cidance — Web Worker partículas 60fps
// Figma-style real-time: 10k+ partículas sem travar main thread
// Razorfish Blue Dot: 60k+ ambient particles + meteor trails

interface WorkerParticle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; maxLife: number;
  size: number;
  type: 'ambient' | 'meteor' | 'verdict' | 'data-flow';
}

const GOLDEN_MORABEZA = { r: 1.0, g: 0.702, b: 0.278 }; // #FFB347

let particles: WorkerParticle[] = [];
let frameCount = 0;

function spawnParticle(type: WorkerParticle['type'] = 'ambient'): WorkerParticle {
  const isMeteor = type === 'meteor';
  return {
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    z: (Math.random() - 0.5) * 200,
    vx: (Math.random() - 0.5) * (isMeteor ? 4 : 0.5),
    vy: (Math.random() - 0.5) * (isMeteor ? 4 : 0.5),
    vz: (Math.random() - 0.5) * (isMeteor ? 4 : 0.5),
    life: 1.0,
    maxLife: isMeteor ? 60 : 300 + Math.random() * 200,
    size: isMeteor ? 2 + Math.random() * 3 : 0.5 + Math.random() * 1.5,
    type,
  };
}

function updateParticles(delta: number, targetCount: number): Float32Array {
  // sacred-flow: spawn to maintain density
  while (particles.length < targetCount) {
    particles.push(spawnParticle(Math.random() < 0.05 ? 'meteor' : 'ambient'));
  }

  // sacred-flow: update physics
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.z += p.vz * delta;
    p.life -= delta / p.maxLife;

    // Gravity toward center — organismo atrai
    const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    if (dist > 1) {
      const force = 0.001 / (dist * 0.1);
      p.vx -= (p.x / dist) * force;
      p.vy -= (p.y / dist) * force;
      p.vz -= (p.z / dist) * force;
    }

    // Remove dead
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // sacred-flow: pack into Float32Array for zero-copy transfer
  // Format: [x, y, z, size, r, g, b, alpha] per particle
  const data = new Float32Array(particles.length * 8);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const idx = i * 8;
    const alpha = Math.min(1, p.life * 2);
    data[idx] = p.x;
    data[idx + 1] = p.y;
    data[idx + 2] = p.z;
    data[idx + 3] = p.size;
    data[idx + 4] = GOLDEN_MORABEZA.r;
    data[idx + 5] = GOLDEN_MORABEZA.g;
    data[idx + 6] = GOLDEN_MORABEZA.b;
    data[idx + 7] = alpha;
  }

  return data;
}

// sacred-flow: message handler
self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'init':
      particles = [];
      for (let i = 0; i < (payload?.count || 10000); i++) {
        particles.push(spawnParticle());
      }
      break;

    case 'update':
      frameCount++;
      const data = updateParticles(payload?.delta || 0.016, payload?.targetCount || 10000);
      // Transfer buffer — zero copy
      (self as unknown as Worker).postMessage(
        { type: 'frame', data: data.buffer, count: particles.length, frame: frameCount },
        [data.buffer]
      );
      break;

    case 'spawn-meteor':
      for (let i = 0; i < (payload?.count || 50); i++) {
        particles.push(spawnParticle('meteor'));
      }
      break;

    case 'spawn-verdict':
      for (let i = 0; i < 100; i++) {
        const p = spawnParticle('verdict');
        p.x = payload?.x || 0;
        p.y = payload?.y || 0;
        p.z = payload?.z || 0;
        particles.push(p);
      }
      break;
  }
};
