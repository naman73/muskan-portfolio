import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const qaDir = path.join(__dirname, 'qa-screenshots');
  
  if (!fs.existsSync(qaDir)) {
    fs.mkdirSync(qaDir);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const issues = [];
  const consoleMessages = [];
  const consoleErrors = [];
  const consoleWarnings = [];

  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    
    if (type === 'error') {
      consoleErrors.push(text);
    } else if (type === 'warning') {
      consoleWarnings.push(text);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    consoleErrors.push(`Page Error: ${error.message}`);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    consoleErrors.push(`Failed request: ${request.url()} - ${request.failure().errorText}`);
  });

  console.log('=== QA AUDIT STARTING ===\n');

  // ============================================
  // 1. DESKTOP VIEW - CONSOLE ERRORS
  // ============================================
  console.log('1. CHECKING CONSOLE ERRORS/WARNINGS (Desktop)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await page.screenshot({ path: path.join(qaDir, '01-desktop-initial.png') });
  
  if (consoleErrors.length > 0) {
    console.log('   ❌ CONSOLE ERRORS FOUND:');
    consoleErrors.forEach(err => console.log(`      - ${err}`));
    issues.push({ section: 'Console Errors', errors: consoleErrors });
  } else {
    console.log('   ✓ No console errors');
  }
  
  if (consoleWarnings.length > 0) {
    console.log('   ⚠️  CONSOLE WARNINGS FOUND:');
    consoleWarnings.forEach(warn => console.log(`      - ${warn}`));
    issues.push({ section: 'Console Warnings', warnings: consoleWarnings });
  } else {
    console.log('   ✓ No console warnings');
  }

  // ============================================
  // 2. MOBILE RESPONSIVE TEST
  // ============================================
  console.log('\n2. TESTING MOBILE RESPONSIVE (375x812 - iPhone X)...');
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check for horizontal scrollbar
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  
  if (hasHorizontalScroll) {
    const scrollInfo = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    console.log(`   ❌ HORIZONTAL SCROLLBAR DETECTED! Overflow: ${scrollInfo.overflow}px`);
    issues.push({ 
      section: 'Mobile Responsive', 
      issue: 'Horizontal scrollbar present',
      details: scrollInfo
    });
  } else {
    console.log('   ✓ No horizontal scrollbar');
  }
  
  await page.screenshot({ path: path.join(qaDir, '02-mobile-hero.png') });
  
  // Scroll through each section on mobile
  const sections = [
    { name: 'Hero', selector: 'header, [class*="hero"]' },
    { name: 'About', selector: '[id="about"]' },
    { name: 'Skills', selector: '[id="skills"]' },
    { name: 'Experience', selector: '[id="experience"]' },
    { name: 'Portfolio', selector: '[id="projects"], [id="portfolio"]' },
    { name: 'Testimonials', selector: '[id="testimonials"]' },
    { name: 'Education', selector: '[id="education"]' },
    { name: 'Contact', selector: '[id="contact"]' },
    { name: 'Footer', selector: 'footer' }
  ];
  
  for (const section of sections) {
    try {
      const element = await page.$(section.selector);
      if (element) {
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, section.selector);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check for overflow in this section
        const sectionOverflow = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          
          const rect = el.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(el);
          
          return {
            width: rect.width,
            overflowX: computedStyle.overflowX,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            hasOverflow: el.scrollWidth > el.clientWidth
          };
        }, section.selector);
        
        if (sectionOverflow && sectionOverflow.hasOverflow) {
          console.log(`   ❌ ${section.name} section has horizontal overflow`);
          issues.push({ 
            section: `Mobile - ${section.name}`, 
            issue: 'Horizontal overflow detected',
            details: sectionOverflow
          });
        }
        
        await page.screenshot({ 
          path: path.join(qaDir, `03-mobile-${section.name.toLowerCase()}.png`) 
        });
        
        console.log(`   ✓ ${section.name} section checked`);
      }
    } catch (error) {
      console.log(`   ⚠️  Could not check ${section.name}: ${error.message}`);
    }
  }

  // ============================================
  // 3. MOBILE HAMBURGER MENU TEST
  // ============================================
  console.log('\n3. TESTING MOBILE HAMBURGER MENU...');
  
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Look for hamburger menu button
  const hamburgerSelectors = [
    'button[aria-label*="menu"]',
    'button[class*="hamburger"]',
    'button[class*="menu"]',
    '.mobile-menu-button',
    '[class*="MenuButton"]',
    'nav button',
    'button[aria-expanded]'
  ];
  
  let hamburgerButton = null;
  for (const selector of hamburgerSelectors) {
    hamburgerButton = await page.$(selector);
    if (hamburgerButton) {
      console.log(`   ✓ Found hamburger button: ${selector}`);
      break;
    }
  }
  
  if (hamburgerButton) {
    await page.screenshot({ path: path.join(qaDir, '04-mobile-menu-closed.png') });
    
    // Click hamburger
    await hamburgerButton.click();
    await new Promise(resolve => setTimeout(resolve, 800));
    await page.screenshot({ path: path.join(qaDir, '05-mobile-menu-open.png') });
    
    // Check if menu is visible
    const menuVisible = await page.evaluate(() => {
      const menu = document.querySelector('[class*="mobile"], [class*="Menu"], nav [class*="menu"]');
      if (!menu) return false;
      const style = window.getComputedStyle(menu);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    
    if (menuVisible) {
      console.log('   ✓ Menu opened successfully');
      
      // Try clicking a nav link
      const navLink = await page.$('nav a[href*="#about"], nav a[href="#about"]');
      if (navLink) {
        await navLink.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.screenshot({ path: path.join(qaDir, '06-mobile-menu-after-click.png') });
        
        // Check if menu closed
        const menuClosedAfterClick = await page.evaluate(() => {
          const menu = document.querySelector('[class*="mobile"], [class*="Menu"], nav [class*="menu"]');
          if (!menu) return true;
          const style = window.getComputedStyle(menu);
          return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
        });
        
        if (menuClosedAfterClick) {
          console.log('   ✓ Menu closed after clicking nav link');
        } else {
          console.log('   ❌ Menu did NOT close after clicking nav link');
          issues.push({ section: 'Mobile Menu', issue: 'Menu does not close after clicking nav link' });
        }
      } else {
        console.log('   ⚠️  Could not find nav link to test');
      }
    } else {
      console.log('   ❌ Menu did NOT open');
      issues.push({ section: 'Mobile Menu', issue: 'Menu does not open when hamburger clicked' });
    }
  } else {
    console.log('   ⚠️  Hamburger menu button not found (might not be implemented)');
    issues.push({ section: 'Mobile Menu', issue: 'Hamburger menu button not found' });
  }

  // ============================================
  // 4. PROJECT MODAL TEST
  // ============================================
  console.log('\n4. TESTING PROJECT MODAL...');
  
  // Navigate to projects section
  await page.evaluate(() => {
    const projectsSection = document.querySelector('[id="projects"], [id="portfolio"]');
    if (projectsSection) projectsSection.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find project card or "View Details" link
  const projectCardSelectors = [
    '[class*="project"] a[href*="#"]',
    '[class*="project"] button',
    'a[href*="View Details"]',
    '[class*="ProjectCard"]',
    '.project-card',
    '[id*="project"]'
  ];
  
  let projectCard = null;
  for (const selector of projectCardSelectors) {
    try {
      projectCard = await page.$(selector);
      if (projectCard) {
        console.log(`   ✓ Found project card: ${selector}`);
        break;
      }
    } catch (e) {
      // Continue to next selector
    }
  }
  
  // Try finding by text content
  if (!projectCard) {
    projectCard = await page.evaluateHandle(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.find(link => link.textContent.includes('View Details'));
    });
    
    const element = projectCard ? projectCard.asElement() : null;
    if (element) {
      console.log('   ✓ Found project card by text content');
      projectCard = element;
    } else {
      projectCard = null;
    }
  }
  
  if (projectCard) {
    await page.screenshot({ path: path.join(qaDir, '07-before-modal.png') });
    
    try {
      await projectCard.click();
    } catch (e) {
      // Try clicking via evaluate
      await page.evaluate(() => {
        const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('View Details'));
        if (link) link.click();
      });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: path.join(qaDir, '08-modal-open.png') });
    
    // Check if modal is visible
    const modalVisible = await page.evaluate(() => {
      const modal = document.querySelector('[class*="modal"], [class*="Modal"], [role="dialog"]');
      if (!modal) return false;
      const style = window.getComputedStyle(modal);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    
    if (modalVisible) {
      console.log('   ✓ Modal opened successfully');
      
      // Try closing with X button
      const closeButtonSelectors = [
        'button[aria-label*="close"]',
        'button[class*="close"]',
        '[class*="modal"] button:first-of-type',
        '[role="dialog"] button'
      ];
      
      let closeButton = null;
      for (const selector of closeButtonSelectors) {
        try {
          closeButton = await page.$(selector);
          if (closeButton) {
            console.log(`   ✓ Found close button: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue
        }
      }
      
      if (!closeButton) {
        closeButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => btn.textContent.includes('×') || btn.textContent.includes('Close'));
        });
        const element = closeButton ? closeButton.asElement() : null;
        if (element) {
          closeButton = element;
        } else {
          closeButton = null;
        }
      }
      
      if (closeButton) {
        try {
          await closeButton.click();
        } catch (e) {
          await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('×') || b.textContent.includes('Close'));
            if (btn) btn.click();
          });
        }
        await new Promise(resolve => setTimeout(resolve, 800));
        await page.screenshot({ path: path.join(qaDir, '09-modal-closed.png') });
        
        const modalClosedAfterClick = await page.evaluate(() => {
          const modal = document.querySelector('[class*="modal"], [class*="Modal"], [role="dialog"]');
          if (!modal) return true;
          const style = window.getComputedStyle(modal);
          return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
        });
        
        if (modalClosedAfterClick) {
          console.log('   ✓ Modal closed successfully with X button');
        } else {
          console.log('   ❌ Modal did NOT close with X button');
          issues.push({ section: 'Project Modal', issue: 'Modal does not close when X button clicked' });
        }
      } else {
        console.log('   ⚠️  Close button not found in modal');
        issues.push({ section: 'Project Modal', issue: 'Close button not found' });
      }
    } else {
      console.log('   ❌ Modal did NOT open');
      issues.push({ section: 'Project Modal', issue: 'Modal does not open when project card clicked' });
    }
  } else {
    console.log('   ⚠️  Project card not found');
    issues.push({ section: 'Project Modal', issue: 'Project card not found' });
  }

  // ============================================
  // 5. TESTIMONIAL CAROUSEL TEST
  // ============================================
  console.log('\n5. TESTING TESTIMONIAL CAROUSEL...');
  
  await page.evaluate(() => {
    const testimonialsSection = document.querySelector('[id="testimonials"]');
    if (testimonialsSection) testimonialsSection.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: path.join(qaDir, '10-testimonials-initial.png') });
  
  // Get initial testimonial content
  const initialContent = await page.evaluate(() => {
    const testimonialText = document.querySelector('[id="testimonials"] p, [class*="testimonial"] p');
    return testimonialText ? testimonialText.textContent : null;
  });
  
  // Try clicking next arrow
  const nextArrowSelectors = [
    'button[aria-label*="next"]',
    'button[class*="next"]',
    '[class*="testimonial"] button:last-of-type'
  ];
  
  let nextButton = null;
  for (const selector of nextArrowSelectors) {
    try {
      nextButton = await page.$(selector);
      if (nextButton) break;
    } catch (e) {}
  }
  
  if (!nextButton) {
    const buttons = await page.$$('[id="testimonials"] button, [class*="testimonial"] button');
    if (buttons.length >= 2) {
      nextButton = buttons[1]; // Assume second button is next
    }
  }
  
  if (nextButton) {
    console.log('   ✓ Found next arrow button');
    await nextButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: path.join(qaDir, '11-testimonials-after-next.png') });
    
    const newContent = await page.evaluate(() => {
      const testimonialText = document.querySelector('[id="testimonials"] p, [class*="testimonial"] p');
      return testimonialText ? testimonialText.textContent : null;
    });
    
    if (newContent && newContent !== initialContent) {
      console.log('   ✓ Next arrow works - content changed');
    } else {
      console.log('   ⚠️  Next arrow clicked but content may not have changed (or only one testimonial)');
    }
  } else {
    console.log('   ⚠️  Next arrow button not found');
  }
  
  // Try clicking prev arrow
  const prevArrowSelectors = [
    'button[aria-label*="prev"]',
    'button[class*="prev"]',
    '[class*="testimonial"] button:first-of-type'
  ];
  
  let prevButton = null;
  for (const selector of prevArrowSelectors) {
    try {
      prevButton = await page.$(selector);
      if (prevButton) break;
    } catch (e) {}
  }
  
  if (!prevButton) {
    const buttons = await page.$$('[id="testimonials"] button, [class*="testimonial"] button');
    if (buttons.length >= 2) {
      prevButton = buttons[0]; // Assume first button is prev
    }
  }
  
  if (prevButton) {
    console.log('   ✓ Found prev arrow button');
    await prevButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: path.join(qaDir, '12-testimonials-after-prev.png') });
    console.log('   ✓ Prev arrow clicked');
  } else {
    console.log('   ⚠️  Prev arrow button not found');
  }
  
  // Try clicking dots
  const dots = await page.$$('[id="testimonials"] button[class*="dot"], [class*="testimonial"] button[class*="dot"]');
  if (dots.length > 0) {
    console.log(`   ✓ Found ${dots.length} pagination dots`);
    if (dots.length > 1) {
      await dots[1].click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.screenshot({ path: path.join(qaDir, '13-testimonials-dot-click.png') });
      console.log('   ✓ Clicked pagination dot');
    }
  } else {
    console.log('   ⚠️  Pagination dots not found');
  }

  // ============================================
  // 6. CONTACT FORM TEST
  // ============================================
  console.log('\n6. TESTING CONTACT FORM...');
  
  await page.evaluate(() => {
    const contactSection = document.querySelector('[id="contact"]');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: path.join(qaDir, '14-contact-form-initial.png') });
  
  // Try submitting empty form
  let submitButton = await page.$('form button[type="submit"]');
  if (!submitButton) {
    submitButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('form button'));
      return buttons.find(btn => btn.textContent.includes('Send') || btn.type === 'submit');
    });
    const element = submitButton ? submitButton.asElement() : null;
    submitButton = element;
  }
  
  if (submitButton) {
    console.log('   ✓ Found submit button');
    
    // Click submit with empty fields
    try {
      await submitButton.click();
    } catch (e) {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('form button')).find(b => b.textContent.includes('Send') || b.type === 'submit');
        if (btn) btn.click();
      });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ path: path.join(qaDir, '15-contact-form-empty-submit.png') });
    
    // Check for validation messages
    const validationMessages = await page.evaluate(() => {
      const messages = [];
      
      // Check HTML5 validation
      const inputs = document.querySelectorAll('form input, form textarea');
      inputs.forEach(input => {
        if (input.validationMessage) {
          messages.push({ field: input.name || input.id, message: input.validationMessage });
        }
      });
      
      // Check for custom validation messages
      const errorElements = document.querySelectorAll('[class*="error"], [class*="invalid"]');
      errorElements.forEach(el => {
        if (el.textContent.trim()) {
          messages.push({ type: 'custom', message: el.textContent.trim() });
        }
      });
      
      return messages;
    });
    
    if (validationMessages.length > 0) {
      console.log('   ✓ Form validation working - errors shown for empty fields');
      validationMessages.forEach(msg => {
        console.log(`      - ${msg.field || 'Field'}: ${msg.message}`);
      });
    } else {
      console.log('   ⚠️  No validation messages detected (might be using browser default or no validation)');
    }
    
    // Fill form with test data
    const nameInput = await page.$('input[name="name"], input[id="name"], input[placeholder*="name" i]');
    const emailInput = await page.$('input[name="email"], input[id="email"], input[type="email"]');
    const messageInput = await page.$('textarea[name="message"], textarea[id="message"]');
    
    if (nameInput && emailInput && messageInput) {
      await nameInput.type('Test User');
      await emailInput.type('test@example.com');
      await messageInput.type('This is a test message for QA purposes.');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.screenshot({ path: path.join(qaDir, '16-contact-form-filled.png') });
      console.log('   ✓ Form filled with test data');
      
      // Try submitting filled form
      await submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await page.screenshot({ path: path.join(qaDir, '17-contact-form-submitted.png') });
      
      // Check for success message or form reset
      const formSubmitted = await page.evaluate(() => {
        const successMessages = document.querySelectorAll('[class*="success"], [class*="thank"]');
        const hasSuccess = Array.from(successMessages).some(el => 
          el.textContent.toLowerCase().includes('success') || 
          el.textContent.toLowerCase().includes('thank')
        );
        
        const nameInput = document.querySelector('input[name="name"], input[id="name"]');
        const formReset = nameInput && nameInput.value === '';
        
        return { hasSuccess, formReset };
      });
      
      if (formSubmitted.hasSuccess) {
        console.log('   ✓ Success message displayed after submission');
      } else if (formSubmitted.formReset) {
        console.log('   ✓ Form reset after submission');
      } else {
        console.log('   ⚠️  Form submission result unclear (no success message or reset detected)');
      }
    } else {
      console.log('   ⚠️  Could not find all form fields');
      issues.push({ section: 'Contact Form', issue: 'Could not locate all form fields' });
    }
  } else {
    console.log('   ⚠️  Submit button not found');
    issues.push({ section: 'Contact Form', issue: 'Submit button not found' });
  }

  // ============================================
  // 7. HERO SCROLL INDICATOR TEST
  // ============================================
  console.log('\n7. TESTING HERO SCROLL INDICATOR...');
  
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: path.join(qaDir, '18-hero-scroll-indicator.png') });
  
  const scrollIndicator = await page.evaluate(() => {
    const indicators = document.querySelectorAll('[class*="scroll"], [class*="arrow-down"], svg[class*="animate"]');
    
    for (const indicator of indicators) {
      const rect = indicator.getBoundingClientRect();
      const style = window.getComputedStyle(indicator);
      
      // Check if it's in the hero section (top portion of page)
      if (rect.top < window.innerHeight && rect.top > 0) {
        const hasAnimation = style.animation !== 'none' || 
                            style.transform !== 'none' ||
                            indicator.classList.toString().includes('animate');
        
        return {
          found: true,
          hasAnimation,
          position: { top: rect.top, left: rect.left },
          animation: style.animation,
          transform: style.transform
        };
      }
    }
    
    return { found: false };
  });
  
  if (scrollIndicator.found) {
    console.log('   ✓ Scroll indicator found in hero section');
    if (scrollIndicator.hasAnimation) {
      console.log('   ✓ Scroll indicator has animation');
    } else {
      console.log('   ⚠️  Scroll indicator might not be animated');
    }
  } else {
    console.log('   ⚠️  Scroll indicator not found in hero section');
  }

  // ============================================
  // 8. OVERALL CHECKS (MOBILE)
  // ============================================
  console.log('\n8. OVERALL CHECKS (Mobile 375x812)...');
  
  await page.setViewport({ width: 375, height: 812 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const overallIssues = await page.evaluate(() => {
    const issues = [];
    
    // Check for horizontal scrollbar
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
      issues.push({
        type: 'Horizontal Scrollbar',
        details: `Page width: ${document.documentElement.scrollWidth}px, Viewport: ${document.documentElement.clientWidth}px`
      });
    }
    
    // Check for text overflow
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      
      // Check if element extends beyond viewport
      if (rect.right > window.innerWidth + 10) { // 10px tolerance
        const tagInfo = `${el.tagName}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ')[0] : ''}`;
        issues.push({
          type: 'Element Overflow',
          element: tagInfo,
          details: `Extends ${Math.round(rect.right - window.innerWidth)}px beyond viewport`
        });
      }
      
      // Check for text overflow
      if (style.overflow === 'hidden' && el.scrollWidth > el.clientWidth) {
        const tagInfo = `${el.tagName}${el.id ? '#' + el.id : ''}`;
        issues.push({
          type: 'Text Truncation',
          element: tagInfo,
          details: 'Content is truncated'
        });
      }
    });
    
    return issues;
  });
  
  if (overallIssues.length > 0) {
    console.log('   ❌ Issues found:');
    overallIssues.forEach(issue => {
      console.log(`      - ${issue.type}: ${issue.element || ''} ${issue.details}`);
    });
    issues.push({ section: 'Overall Mobile', issues: overallIssues });
  } else {
    console.log('   ✓ No horizontal scrollbar or overflow issues detected');
  }

  // ============================================
  // 9. DESKTOP VIEW VERIFICATION
  // ============================================
  console.log('\n9. SWITCHING TO DESKTOP (1440x900) - FINAL VERIFICATION...');
  
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: path.join(qaDir, '19-desktop-final-hero.png') });
  
  // Check desktop horizontal scroll
  const desktopHasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  
  if (desktopHasHorizontalScroll) {
    console.log('   ❌ Desktop has horizontal scrollbar');
    issues.push({ section: 'Desktop View', issue: 'Horizontal scrollbar present' });
  } else {
    console.log('   ✓ No horizontal scrollbar on desktop');
  }
  
  // Scroll through sections on desktop
  for (const section of sections) {
    try {
      const element = await page.$(section.selector);
      if (element) {
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, section.selector);
        
        await new Promise(resolve => setTimeout(resolve, 600));
        await page.screenshot({ 
          path: path.join(qaDir, `20-desktop-${section.name.toLowerCase()}.png`) 
        });
      }
    } catch (error) {
      // Continue
    }
  }
  
  console.log('   ✓ Desktop view verification complete');

  // ============================================
  // FINAL REPORT
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('=== QA AUDIT COMPLETE ===');
  console.log('='.repeat(60));
  
  if (issues.length === 0) {
    console.log('\n🎉 NO ISSUES FOUND! The website passed all QA checks.');
  } else {
    console.log(`\n⚠️  TOTAL ISSUES FOUND: ${issues.length}\n`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.section}`);
      if (issue.issue) console.log(`   Issue: ${issue.issue}`);
      if (issue.errors) issue.errors.forEach(err => console.log(`   Error: ${err}`));
      if (issue.warnings) issue.warnings.forEach(warn => console.log(`   Warning: ${warn}`));
      if (issue.details) console.log(`   Details: ${JSON.stringify(issue.details, null, 2)}`);
      if (issue.issues) {
        issue.issues.forEach(i => console.log(`   - ${i.type}: ${i.element || ''} ${i.details}`));
      }
      console.log('');
    });
  }
  
  console.log(`\n📸 Screenshots saved to: ${qaDir}`);
  console.log(`📊 Total screenshots captured: ${fs.readdirSync(qaDir).length}`);
  
  // Save issues to JSON file
  fs.writeFileSync(
    path.join(qaDir, 'qa-report.json'),
    JSON.stringify({ 
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      issues,
      consoleMessages: consoleMessages.slice(0, 50) // Limit to first 50
    }, null, 2)
  );
  
  console.log(`📄 Full report saved to: ${path.join(qaDir, 'qa-report.json')}`);

  await browser.close();
})();
