import { chromium } from '@playwright/test';

async function completeVerification() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('=== COMPLETE VERIFICATION WITH CORRECT URLs ===\n');
    
    // 4. StatusBadge - try different URL formats
    console.log('4. StatusBadge > AllStatuses');
    const statusUrls = [
      'components--statusbadge--all-statuses',
      'components--status-badge--all-statuses',
    ];
    
    let statusFound = false;
    for (const storyId of statusUrls) {
      try {
        await page.goto(`http://localhost:61000/?story=${storyId}`, { waitUntil: 'networkidle', timeout: 5000 });
        await page.waitForTimeout(1000);
        
        // Check if we got "Story not found"
        const notFound = await page.locator('text=Story not found').isVisible({ timeout: 1000 }).catch(() => false);
        
        if (!notFound) {
          await page.screenshot({ path: 'COMPLETE-04-statusbadge.png', fullPage: true });
          console.log(`   ✓ Found with URL: ${storyId}\n`);
          statusFound = true;
          break;
        }
      } catch {
        // Try next URL
      }
    }
    
    if (!statusFound) {
      console.log('   ✗ StatusBadge story not found with any URL format\n');
    }
    
    // 7. NavItem - try different formats
    console.log('7. NavItem > Default');
    const navUrls = [
      'navigation--navitem--default',
      'navigation--nav-item--default',
    ];
    
    let navFound = false;
    for (const storyId of navUrls) {
      try {
        await page.goto(`http://localhost:61000/?story=${storyId}`, { waitUntil: 'networkidle', timeout: 5000 });
        await page.waitForTimeout(1000);
        
        const notFound = await page.locator('text=Story not found').isVisible({ timeout: 1000 }).catch(() => false);
        
        if (!notFound) {
          await page.screenshot({ path: 'COMPLETE-07-navitem.png', fullPage: true });
          console.log(`   ✓ Found with URL: ${storyId}\n`);
          navFound = true;
          break;
        }
      } catch {
        // Try next URL
      }
    }
    
    if (!navFound) {
      console.log('   ✗ NavItem story not found with any URL format\n');
    }
    
    // 8. Design Tokens > Semantic Colors
    console.log('8. Design Tokens > Semantic Colors');
    const tokenUrls = [
      'design-tokens--semantic-colors',
      'designtokens--semantic-colors',
    ];
    
    let tokenFound = false;
    for (const storyId of tokenUrls) {
      try {
        await page.goto(`http://localhost:61000/?story=${storyId}`, { waitUntil: 'networkidle', timeout: 5000 });
        await page.waitForTimeout(1000);
        
        const notFound = await page.locator('text=Story not found').isVisible({ timeout: 1000 }).catch(() => false);
        
        if (!notFound) {
          await page.screenshot({ path: 'COMPLETE-08-semantic-colors.png', fullPage: true });
          console.log(`   ✓ Found with URL: ${storyId}\n`);
          tokenFound = true;
          break;
        }
      } catch {
        // Try next URL
      }
    }
    
    if (!tokenFound) {
      console.log('   ✗ Semantic Colors story not found with any URL format\n');
    }
    
    console.log('=== VERIFICATION COMPLETE ===');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

completeVerification();
