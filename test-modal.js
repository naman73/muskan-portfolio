import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Testing project modal...');
  
  // Navigate to portfolio section
  await page.evaluate(() => {
    const portfolioSection = document.querySelector('[id="portfolio"]');
    if (portfolioSection) portfolioSection.scrollIntoView();
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find and click project button
  const projectButtons = await page.$$('button');
  console.log(`Found ${projectButtons.length} buttons on page`);
  
  // Look for buttons in the portfolio section
  const projectButton = await page.evaluate(() => {
    const portfolioSection = document.querySelector('[id="portfolio"]');
    if (!portfolioSection) return null;
    
    const buttons = Array.from(portfolioSection.querySelectorAll('button'));
    console.log('Portfolio buttons:', buttons.length);
    
    // Click the first project button
    if (buttons.length > 0) {
      buttons[0].click();
      return true;
    }
    return false;
  });
  
  if (projectButton) {
    console.log('✓ Clicked project button');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: 'qa-screenshots/modal-test-open.png' });
    
    // Check if modal is visible
    const modalVisible = await page.evaluate(() => {
      const modal = document.querySelector('[class*="fixed"][class*="inset-0"]');
      return modal !== null;
    });
    
    console.log('Modal visible:', modalVisible);
    
    if (modalVisible) {
      // Try closing it
      await page.evaluate(() => {
        const closeButton = document.querySelector('button[aria-label="Close"]');
        if (closeButton) closeButton.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      await page.screenshot({ path: 'qa-screenshots/modal-test-closed.png' });
      
      const modalClosed = await page.evaluate(() => {
        const modal = document.querySelector('[class*="fixed"][class*="inset-0"]');
        return modal === null;
      });
      
      console.log('Modal closed:', modalClosed);
    }
  } else {
    console.log('✗ Could not find project button');
  }

  await browser.close();
})();
