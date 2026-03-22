import { test, expect } from '@playwright/test';

test.describe('Performance Budget Gate (A2)', () => {
  test('Initial PMTiles/Vite JS Heap should stay well under 100MB bound', async ({ page }) => {
    // Navigate home, wait for map shell to theoretically mount.
    await page.goto('/');

    // Let the canvas and WebGL context settle
    await page.waitForTimeout(4000);

    // Measure JS Heap size via Chrome DevTools Protocol
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');
    const metrics = await client.send('Performance.getMetrics');
    
    const jsHeapSizeMetric = metrics.metrics.find(m => m.name === 'JSHeapUsedSize');
    if (!jsHeapSizeMetric) {
      throw new Error('Could not retrieve JSHeapUsedSize from CDP');
    }

    const jsHeapUsedMB = jsHeapSizeMetric.value / 1024 / 1024;
    console.log(`[Gate A2] Initial JS Heap Used: ${jsHeapUsedMB.toFixed(2)} MB`);

    // The A2 Budget constraint: memory leaks / heavy payload failure
    // If it requires over 100MB just to load the initial Geopolitics layer, the pipeline fails.
    expect(jsHeapUsedMB).toBeLessThan(100);
  });
});
