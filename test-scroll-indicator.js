import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Checking for scroll indicator...');
  
  const scrollIndicator = await page.evaluate(() => {
    // Look for the scroll indicator
    const hero = document.querySelector('#hero, section:first-of-type');
    if (!hero) return { found: false, reason: 'Hero section not found' };
    
    // Look for arrow down icon or link with href="#about"
    const scrollLink = hero.querySelector('a[href="#about"]');
    if (!scrollLink) return { found: false, reason: 'Scroll link not found' };
    
    const rect = scrollLink.getBoundingClientRect();
    const styles = window.getComputedStyle(scrollLink);
    
    // Check for SVG icon inside
    const hasIcon = scrollLink.querySelector('svg') !== null;
    
    return {
      found: true,
      hasIcon,
      visible: styles.opacity !== '0' && styles.display !== 'none',
      position: {
        bottom: Math.round(window.innerHeight - rect.bottom),
        left: Math.round(rect.left)
      },
      classList: scrollLink.className
    };
  });
  
  console.log('Scroll indicator:', JSON.stringify(scrollIndicator, null, 2));
  
  await page.screenshot({ path: 'qa-screenshots/scroll-indicator-check.png' });

  await browser.close();
})();
