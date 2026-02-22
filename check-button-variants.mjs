import { chromium } from '@playwright/test';

async function checkButtonVariants() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:61000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    console.log('Looking for Button stories...');
    
    // Click on Button to expand it
    await page.click('text=Button');
    await page.waitForTimeout(1000);
    
    // Get all the button story links
    const _content = await page.content();
    console.log('Page loaded, looking for Variants link...');
    
    // Try to find the Variants link more carefully
    const variantsLink = await page.locator('a:has-text("Variants")').first();
    const isVisible = await variantsLink.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isVisible) {
      console.log('Found Variants link, clicking...');
      await variantsLink.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'verify-02-button-variants.png', fullPage: true });
      console.log('Screenshot saved: verify-02-button-variants.png');
    } else {
      console.log('Variants link not found. Available Button stories:');
      const buttonStories = await page.locator('a').allTextContents();
      buttonStories.forEach(story => {
        if (story.toLowerCase().includes('button') || story.toLowerCase().includes('variant')) {
          console.log('  -', story);
        }
      });
      
      // Just take a screenshot of what we have
      await page.screenshot({ path: 'verify-02-button-current.png', fullPage: true });
      console.log('Screenshot saved: verify-02-button-current.png');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkButtonVariants();
