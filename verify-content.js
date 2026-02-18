import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const verifyDir = path.join(__dirname, 'content-verification');
  
  if (!fs.existsSync(verifyDir)) {
    fs.mkdirSync(verifyDir);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=== CONTENT VERIFICATION REPORT ===\n');

  const issues = [];

  // 1. HERO SECTION
  console.log('1. CHECKING HERO SECTION...');
  const heroContent = await page.evaluate(() => {
    const hero = document.querySelector('#hero, header, section:first-of-type');
    if (!hero) return null;
    
    const title = hero.querySelector('[class*="uppercase"], p:first-of-type');
    const heading = hero.querySelector('h1');
    const tagline = hero.querySelector('p:not([class*="uppercase"])');
    
    return {
      title: title ? title.textContent.trim() : null,
      heading: heading ? heading.textContent.trim() : null,
      tagline: tagline ? tagline.textContent.trim() : null,
      fullText: hero.textContent
    };
  });
  
  await page.screenshot({ path: path.join(verifyDir, '01-hero-section.png') });
  
  if (heroContent) {
    const hasBrandStrategy = heroContent.fullText.includes('Brand Strategy') || 
                             heroContent.fullText.includes('BRAND STRATEGY');
    const hasCompetitiveMarkets = heroContent.fullText.includes('competitive markets') ||
                                   heroContent.fullText.includes('Building brands that win');
    
    console.log(`   Title text: "${heroContent.title}"`);
    console.log(`   Heading: "${heroContent.heading}"`);
    console.log(`   Tagline: "${heroContent.tagline}"`);
    
    if (hasBrandStrategy && heroContent.fullText.includes('Marketing')) {
      console.log('   ✓ "Brand Strategy & Marketing" found');
    } else {
      console.log('   ❌ "Brand Strategy & Marketing" NOT found');
      issues.push('Hero: Missing "Brand Strategy & Marketing"');
    }
    
    if (hasCompetitiveMarkets) {
      console.log('   ✓ Tagline about competitive markets found');
    } else {
      console.log('   ❌ Tagline about competitive markets NOT found');
      issues.push('Hero: Missing "competitive markets" tagline');
    }
  } else {
    console.log('   ❌ Hero section not found');
    issues.push('Hero: Section not found');
  }

  // 2. ABOUT SECTION
  console.log('\n2. CHECKING ABOUT SECTION...');
  await page.evaluate(() => {
    const about = document.querySelector('[id="about"]');
    if (about) about.scrollIntoView();
  });
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: path.join(verifyDir, '02-about-section.png') });
  
  const aboutContent = await page.evaluate(() => {
    const about = document.querySelector('[id="about"]');
    if (!about) return null;
    
    const heading = about.querySelector('h2');
    const stats = Array.from(about.querySelectorAll('[class*="text"]')).map(el => el.textContent.trim());
    
    return {
      heading: heading ? heading.textContent.trim() : null,
      fullText: about.textContent,
      stats
    };
  });
  
  if (aboutContent) {
    console.log(`   Heading: "${aboutContent.heading}"`);
    
    if (aboutContent.heading && aboutContent.heading.includes('Strategy-first thinking')) {
      console.log('   ✓ Heading includes "Strategy-first thinking"');
    } else {
      console.log('   ❌ Heading missing "Strategy-first thinking"');
      issues.push('About: Heading not updated');
    }
    
    const stats = {
      years: aboutContent.fullText.includes('2+ Years') || aboutContent.fullText.includes('2+'),
      brands: aboutContent.fullText.includes('10+ Premium Brands') || aboutContent.fullText.includes('10+'),
      campaigns: aboutContent.fullText.includes('4+ National Campaigns') || aboutContent.fullText.includes('4+')
    };
    
    console.log(`   Stats found:`);
    console.log(`     - 2+ Years in Advertising: ${stats.years ? '✓' : '❌'}`);
    console.log(`     - 10+ Premium Brands: ${stats.brands ? '✓' : '❌'}`);
    console.log(`     - 4+ National Campaigns: ${stats.campaigns ? '✓' : '❌'}`);
    
    if (!stats.years) issues.push('About: Missing "2+ Years" stat');
    if (!stats.brands) issues.push('About: Missing "10+ Premium Brands" stat');
    if (!stats.campaigns) issues.push('About: Missing "4+ National Campaigns" stat');
  } else {
    console.log('   ❌ About section not found');
    issues.push('About: Section not found');
  }

  // 3. SKILLS SECTION
  console.log('\n3. CHECKING SKILLS SECTION...');
  await page.evaluate(() => {
    const skills = document.querySelector('[id="skills"]');
    if (skills) skills.scrollIntoView();
  });
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: path.join(verifyDir, '03-skills-section.png') });
  
  const skillsContent = await page.evaluate(() => {
    const skills = document.querySelector('[id="skills"]');
    if (!skills) return null;
    
    const categories = Array.from(skills.querySelectorAll('h3, [class*="text-xs"], [class*="text-sm"]')).map(el => el.textContent.trim());
    
    return {
      fullText: skills.textContent,
      categories
    };
  });
  
  if (skillsContent) {
    const expectedCategories = [
      'Strategic & Brand',
      'Digital & Content',
      'Client & Leadership',
      'Tools & Platforms'
    ];
    
    console.log('   Checking categories:');
    expectedCategories.forEach(category => {
      const found = skillsContent.fullText.includes(category) || 
                    skillsContent.categories.some(c => c.includes(category.split('&')[0].trim()));
      console.log(`     - ${category}: ${found ? '✓' : '❌'}`);
      if (!found) issues.push(`Skills: Missing "${category}" category`);
    });
  } else {
    console.log('   ❌ Skills section not found');
    issues.push('Skills: Section not found');
  }

  // 4. EXPERIENCE SECTION
  console.log('\n4. CHECKING EXPERIENCE SECTION...');
  await page.evaluate(() => {
    const exp = document.querySelector('[id="experience"]');
    if (exp) exp.scrollIntoView();
  });
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: path.join(verifyDir, '04-experience-section.png') });
  
  const experienceContent = await page.evaluate(() => {
    const exp = document.querySelector('[id="experience"]');
    if (!exp) return null;
    
    const roles = Array.from(exp.querySelectorAll('h3, [class*="font-bold"]')).map(el => el.textContent.trim());
    const bullets = Array.from(exp.querySelectorAll('li')).map(el => el.textContent.trim());
    
    return {
      fullText: exp.textContent,
      roles,
      bullets,
      hasImpactFocus: bullets.some(b => 
        b.includes('Delivered') || 
        b.includes('Led') || 
        b.includes('Drove') ||
        b.includes('Increased') ||
        b.includes('Achieved')
      )
    };
  });
  
  if (experienceContent) {
    console.log(`   Found ${experienceContent.roles.length} roles`);
    console.log(`   Found ${experienceContent.bullets.length} bullet points`);
    console.log(`   Impact-focused language: ${experienceContent.hasImpactFocus ? '✓' : '❌'}`);
    
    if (!experienceContent.hasImpactFocus) {
      issues.push('Experience: Bullet points not impact-focused');
    }
  } else {
    console.log('   ❌ Experience section not found');
    issues.push('Experience: Section not found');
  }

  // 5. CASE STUDIES SECTION (was Portfolio)
  console.log('\n5. CHECKING CASE STUDIES SECTION...');
  await page.evaluate(() => {
    const portfolio = document.querySelector('[id="portfolio"], [id="projects"], [id="case-studies"]');
    if (portfolio) portfolio.scrollIntoView();
  });
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: path.join(verifyDir, '05-case-studies-section.png') });
  
  const caseStudiesContent = await page.evaluate(() => {
    const section = document.querySelector('[id="portfolio"], [id="projects"], [id="case-studies"]');
    if (!section) return null;
    
    const heading = section.querySelector('h2');
    const label = section.querySelector('p:first-of-type, [class*="uppercase"]');
    
    return {
      sectionId: section.id,
      heading: heading ? heading.textContent.trim() : null,
      label: label ? label.textContent.trim() : null,
      fullText: section.textContent
    };
  });
  
  if (caseStudiesContent) {
    console.log(`   Section ID: ${caseStudiesContent.sectionId}`);
    console.log(`   Label: "${caseStudiesContent.label}"`);
    console.log(`   Heading: "${caseStudiesContent.heading}"`);
    
    const hasCaseStudies = caseStudiesContent.fullText.includes('Case Studies') ||
                           caseStudiesContent.fullText.includes('case studies');
    
    if (hasCaseStudies) {
      console.log('   ✓ "Case Studies" text found');
    } else {
      console.log('   ⚠️  "Case Studies" text not found (might still be "Portfolio")');
      issues.push('Case Studies: Section not renamed from "Portfolio"');
    }
  } else {
    console.log('   ❌ Case Studies/Portfolio section not found');
    issues.push('Case Studies: Section not found');
  }

  // 5b. TEST HINDWARE SUKOON MODAL
  console.log('\n5b. TESTING HINDWARE SUKOON MODAL...');
  
  const modalTest = await page.evaluate(() => {
    const section = document.querySelector('[id="portfolio"], [id="projects"], [id="case-studies"]');
    if (!section) return { found: false, reason: 'Section not found' };
    
    const buttons = Array.from(section.querySelectorAll('button'));
    const hindwareButton = buttons.find(btn => 
      btn.textContent.includes('Hindware') || 
      btn.textContent.includes('Sukoon')
    );
    
    if (!hindwareButton) return { found: false, reason: 'Hindware button not found' };
    
    hindwareButton.click();
    return { found: true, clicked: true };
  });
  
  if (modalTest.clicked) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    await page.screenshot({ path: path.join(verifyDir, '06-hindware-modal-open.png') });
    
    const modalContent = await page.evaluate(() => {
      const modal = document.querySelector('[class*="fixed"][class*="inset-0"], [role="dialog"]');
      if (!modal) return null;
      
      const text = modal.textContent;
      return {
        hasContent: modal.textContent.length > 100,
        hasBrandBackground: text.includes('Brand Background:') || text.includes('Brand Background'),
        hasChallenge: text.includes('Challenge:') || text.includes('Challenge'),
        hasStrategy: text.includes('Strategy:') || text.includes('Strategy'),
        hasExecution: text.includes('Execution:') || text.includes('Execution'),
        hasImpact: text.includes('Impact:') || text.includes('Impact'),
        hasLearning: text.includes('Learning:') || text.includes('Learning'),
        fullText: text.substring(0, 500)
      };
    });
    
    if (modalContent) {
      console.log('   ✓ Modal opened');
      console.log('   Checking structured content labels:');
      console.log(`     - Brand Background: ${modalContent.hasBrandBackground ? '✓' : '❌'}`);
      console.log(`     - Challenge: ${modalContent.hasChallenge ? '✓' : '❌'}`);
      console.log(`     - Strategy: ${modalContent.hasStrategy ? '✓' : '❌'}`);
      console.log(`     - Execution: ${modalContent.hasExecution ? '✓' : '❌'}`);
      console.log(`     - Impact: ${modalContent.hasImpact ? '✓' : '❌'}`);
      console.log(`     - Learning: ${modalContent.hasLearning ? '✓' : '❌'}`);
      
      if (!modalContent.hasBrandBackground) issues.push('Modal: Missing "Brand Background:" label');
      if (!modalContent.hasChallenge) issues.push('Modal: Missing "Challenge:" label');
      if (!modalContent.hasStrategy) issues.push('Modal: Missing "Strategy:" label');
      if (!modalContent.hasExecution) issues.push('Modal: Missing "Execution:" label');
      if (!modalContent.hasImpact) issues.push('Modal: Missing "Impact:" label');
      if (!modalContent.hasLearning) issues.push('Modal: Missing "Learning:" label');
      
      // Close modal
      await page.evaluate(() => {
        const closeButton = document.querySelector('button[aria-label="Close"]');
        if (closeButton) closeButton.click();
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log('   ❌ Modal did not open or content not found');
      issues.push('Modal: Did not open or missing content');
    }
  } else {
    console.log(`   ❌ ${modalTest.reason}`);
    issues.push(`Modal: ${modalTest.reason}`);
  }

  // 6. NAVIGATION CHECK
  console.log('\n6. CHECKING NAVIGATION...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.screenshot({ path: path.join(verifyDir, '07-navigation.png') });
  
  const navContent = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    if (!nav) return null;
    
    const links = Array.from(nav.querySelectorAll('a')).map(a => a.textContent.trim());
    
    return {
      links,
      fullText: nav.textContent
    };
  });
  
  if (navContent) {
    console.log(`   Navigation links: ${navContent.links.join(', ')}`);
    
    const hasCaseStudies = navContent.fullText.includes('Case Studies') || 
                           navContent.links.some(l => l.includes('Case Studies'));
    const hasPortfolio = navContent.fullText.includes('Portfolio') && 
                         !navContent.fullText.includes('Case Studies');
    
    if (hasCaseStudies) {
      console.log('   ✓ Navigation shows "Case Studies"');
    } else if (hasPortfolio) {
      console.log('   ❌ Navigation still shows "Portfolio" instead of "Case Studies"');
      issues.push('Navigation: Not updated to "Case Studies"');
    } else {
      console.log('   ⚠️  Could not determine nav link text');
    }
  } else {
    console.log('   ❌ Navigation not found');
    issues.push('Navigation: Not found');
  }

  // 7. TESTIMONIALS
  console.log('\n7. CHECKING TESTIMONIALS...');
  await page.evaluate(() => {
    const testimonials = document.querySelector('[id="testimonials"]');
    if (testimonials) testimonials.scrollIntoView();
  });
  await new Promise(resolve => setTimeout(resolve, 800));
  await page.screenshot({ path: path.join(verifyDir, '08-testimonials-section.png') });
  
  const testimonialsContent = await page.evaluate(() => {
    const testimonials = document.querySelector('[id="testimonials"]');
    if (!testimonials) return null;
    
    const quote = testimonials.querySelector('blockquote, p');
    
    return {
      quote: quote ? quote.textContent.trim() : null,
      fullText: testimonials.textContent
    };
  });
  
  if (testimonialsContent) {
    console.log(`   Current quote: "${testimonialsContent.quote ? testimonialsContent.quote.substring(0, 100) + '...' : 'Not found'}"`);
    
    const hasStrategicLanguage = testimonialsContent.fullText.includes('strategic') ||
                                  testimonialsContent.fullText.includes('strategy') ||
                                  testimonialsContent.fullText.includes('brand');
    
    if (hasStrategicLanguage) {
      console.log('   ✓ Testimonials include strategic language');
    } else {
      console.log('   ⚠️  Testimonials might not be updated with strategic focus');
    }
  } else {
    console.log('   ❌ Testimonials section not found');
    issues.push('Testimonials: Section not found');
  }

  // FINAL SUMMARY
  console.log('\n' + '='.repeat(60));
  console.log('=== CONTENT VERIFICATION SUMMARY ===');
  console.log('='.repeat(60));
  
  if (issues.length === 0) {
    console.log('\n✅ ALL CONTENT UPDATES VERIFIED!');
    console.log('The portfolio has been successfully updated with all requested changes.');
  } else {
    console.log(`\n⚠️  FOUND ${issues.length} ISSUE(S):\n`);
    issues.forEach((issue, idx) => {
      console.log(`${idx + 1}. ${issue}`);
    });
  }
  
  console.log(`\n📸 Verification screenshots saved to: ${verifyDir}`);
  console.log(`📊 Total screenshots: ${fs.readdirSync(verifyDir).length}`);

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues,
    sections: {
      hero: heroContent,
      about: aboutContent,
      skills: skillsContent,
      experience: experienceContent,
      caseStudies: caseStudiesContent,
      navigation: navContent,
      testimonials: testimonialsContent
    }
  };
  
  fs.writeFileSync(
    path.join(verifyDir, 'content-verification-report.json'),
    JSON.stringify(report, null, 2)
  );

  await browser.close();
})();
