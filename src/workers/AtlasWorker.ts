// sacred-flow: Cidance
// Gerencia 60k+ partículas (Meteoro Spawning) e Adaptive LOD a 60fps usando buffers

interface ParticleMetrics {
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  lifespan: Float32Array;
}

let particles: ParticleMetrics;
let isRunning = false;
let currentLOD = 1.0;

self.onmessage = (e: MessageEvent) => {
  const { type, payload, particleCount } = e.data;

  if (type === 'INIT') {
    const count = particleCount || 60000;
    
    // Aloca buffers fortemente tipados para performance extrema
    particles = {
      x: new Float32Array(count),
      y: new Float32Array(count),
      z: new Float32Array(count),
      lifespan: new Float32Array(count)
    };
    
    // Seed initial meteors over the globe
    for (let i = 0; i < count; i++) {
        particles.x[i] = (Math.random() - 0.5) * 10000000;
        particles.y[i] = (Math.random() - 0.5) * 10000000;
        particles.z[i] = (Math.random() - 0.5) * 10000000;
        particles.lifespan[i] = Math.random() * 100;
    }
    
    isRunning = true;
    requestAnimationFrame(simulationLoop);
  }

  if (type === 'UPDATE_CAMERA_ALTITUDE') {
    // Adaptive LOD calculation based on altitude
    const altitude = payload;
    if (altitude < 50000) currentLOD = 1.0; // Street/City - Full Physics
    else if (altitude < 500000) currentLOD = 0.5; // Regional - Skip details
    else currentLOD = 0.1; // Orbital - Minimal computation
  }
};

function simulationLoop() {
  if (!isRunning) return;
  
  const count = particles.x.length;
  // Adaptive particle iteration
  const activeCount = Math.floor(count * currentLOD);
  
  for (let i = 0; i < activeCount; i++) {
    // Gravitational pull / meteor descent velocity
    particles.y[i] -= 25.0 * currentLOD;
    particles.lifespan[i] -= 0.1;

    // Respawn meteor when dead
    if (particles.lifespan[i] <= 0) {
      particles.x[i] = (Math.random() - 0.5) * 10000000;
      particles.y[i] = 10000000 + Math.random() * 500000; // Drop from higher alt
      particles.z[i] = (Math.random() - 0.5) * 10000000;
      particles.lifespan[i] = 100;
    }
  }

  // Send typed arrays back to main thread (avoiding structured cloning overhead via Transferables if needed, or structured clone for simplicity)
  self.postMessage({
    type: 'FRAME_UPDATE',
    positions: { x: particles.x, y: particles.y, z: particles.z }
  });

  requestAnimationFrame(simulationLoop);
}
