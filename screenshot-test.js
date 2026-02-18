import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  
  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });

  // Wait a bit for any animations
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Take full page screenshot first
  console.log('Taking full page screenshot...');
  await page.screenshot({ 
    path: path.join(screenshotsDir, '01-full-page.png'),
    fullPage: true 
  });

  // Define sections to capture
  const sections = [
    { name: '02-navbar-hero', selector: 'nav, header, [class*="hero"]', description: 'Navbar and Hero' },
    { name: '03-about', selector: '[id="about"], [class*="about"]', description: 'About Section' },
    { name: '04-skills', selector: '[id="skills"], [class*="skills"]', description: 'Skills Section' },
    { name: '05-experience', selector: '[id="experience"], [class*="experience"]', description: 'Experience Timeline' },
    { name: '06-projects', selector: '[id="projects"], [class*="projects"], [id="portfolio"]', description: 'Projects/Portfolio Section' },
    { name: '07-testimonials', selector: '[id="testimonials"], [class*="testimonials"]', description: 'Testimonials Carousel' },
    { name: '08-education', selector: '[id="education"], [class*="education"]', description: 'Education Cards' },
    { name: '09-contact', selector: '[id="contact"], [class*="contact"]', description: 'Contact Form' },
    { name: '10-footer', selector: 'footer', description: 'Footer' }
  ];

  // Capture viewport screenshots at each section
  for (const section of sections) {
    try {
      console.log(`Capturing ${section.description}...`);
      
      // Try to find the element
      const element = await page.$(section.selector);
      
      if (element) {
        // Scroll to element
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, section.selector);
        
        // Wait for scroll and animations
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot of viewport
        await page.screenshot({ 
          path: path.join(screenshotsDir, `${section.name}.png`)
        });
        
        console.log(`✓ Captured ${section.description}`);
      } else {
        console.log(`✗ Could not find ${section.description} with selector: ${section.selector}`);
      }
    } catch (error) {
      console.log(`✗ Error capturing ${section.description}: ${error.message}`);
    }
  }

  // Get page info for analysis
  const pageInfo = await page.evaluate(() => {
    const issues = [];
    
    // Check for broken images
    const images = Array.from(document.querySelectorAll('img'));
    images.forEach((img, idx) => {
      if (!img.complete || img.naturalHeight === 0) {
        issues.push(`Broken image: ${img.src || img.alt || 'unnamed'}`);
      }
    });
    
    // Check for console errors (we'll capture these separately)
    
    return {
      title: document.title,
      url: window.location.href,
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight,
      sections: Array.from(document.querySelectorAll('section, [id]')).map(el => ({
        tag: el.tagName,
        id: el.id,
        classes: el.className
      })),
      issues
    };
  });

  console.log('\n=== Page Analysis ===');
  console.log('Title:', pageInfo.title);
  console.log('Document Height:', pageInfo.documentHeight, 'px');
  console.log('Viewport Height:', pageInfo.viewportHeight, 'px');
  console.log('\nSections found:', pageInfo.sections.length);
  
  if (pageInfo.issues.length > 0) {
    console.log('\n⚠️  Issues detected:');
    pageInfo.issues.forEach(issue => console.log('  -', issue));
  } else {
    console.log('\n✓ No obvious issues detected');
  }

  console.log('\n✓ All screenshots saved to:', screenshotsDir);

  await browser.close();
})();
