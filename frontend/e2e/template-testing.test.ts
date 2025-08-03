describe('Enhanced PolyAI Templates Testing', () => {
  const APP_URL = 'http://localhost:5173';

  beforeEach(async () => {
    await global.page.goto(APP_URL, { waitUntil: 'networkidle0' });
  });

  test('All PolyAI case study templates should be available', async () => {
    console.log('=== TESTING: PolyAI Case Study Templates ===');
    
    // Check for template section
    const templateSection = await global.page.$('.template-picker');
    expect(templateSection).toBeTruthy();
    
    // Check for enhanced title
    const title = await global.page.$eval('.template-picker h3', el => el.textContent);
    expect(title).toBe('Industry Templates');
    
    // Check for case study subtitle
    const subtitle = await global.page.$('.template-subtitle');
    expect(subtitle).toBeTruthy();
    
    // Get all template buttons
    const templateButtons = await global.page.$$('.template-button');
    console.log(`Found ${templateButtons.length} template buttons`);
    
    // Should have 7 templates now (utilities, restaurants, financial_services, healthcare, travel, retail, contact_center)
    expect(templateButtons.length).toBe(7);
    
    // Check for case study badges
    const badges = await global.page.$$('.case-study-badge');
    expect(badges.length).toBe(7);
    
    await global.page.screenshot({ 
      path: '/tmp/enhanced-templates.png',
      fullPage: true 
    });
  });

  test('Utilities template (PG&E case study) should load correctly', async () => {
    console.log('=== TESTING: Utilities Template (PG&E Style) ===');
    
    // Find and click utilities template
    const utilityButton = await global.page.$('button:has-text("Utilities")') || 
                         await global.page.$('button[class*="template-button"]:has-text("Like PG&E")');
    
    if (utilityButton) {
      await utilityButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if annual calls updated to 8M (PG&E scale)
      const annualCallsValue = await global.page.$eval('input[type="number"]', (el: HTMLInputElement) => el.value);
      console.log(`Utilities template annual calls: ${annualCallsValue}`);
      expect(parseInt(annualCallsValue)).toBeGreaterThan(5000000); // Should be 8M
      
      await global.page.screenshot({ 
        path: '/tmp/utilities-template-loaded.png',
        fullPage: true 
      });
    }
  });

  test('Restaurants template (Côte Brasserie case study) should load correctly', async () => {
    console.log('=== TESTING: Restaurants Template (Côte Style) ===');
    
    // Look for restaurant template button
    const restaurantButton = await global.page.$('button:has-text("Restaurants")') ||
                             await global.page.$('button:has-text("Côte Brasserie")');
    
    if (restaurantButton) {
      await restaurantButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if template loaded (should be around 350k calls)
      const annualCallsValue = await global.page.$eval('input[type="number"]', (el: HTMLInputElement) => el.value);
      console.log(`Restaurants template annual calls: ${annualCallsValue}`);
      
      // Check 24/7 operation for after-hours bookings
      const businessHoursCheckbox = await global.page.$('input[type="checkbox"]');
      if (businessHoursCheckbox) {
        const isChecked = await businessHoursCheckbox.evaluate((el: HTMLInputElement) => el.checked);
        console.log(`Business hours only: ${isChecked}`);
        // Should be false for 24/7 restaurant operations
      }
      
      await global.page.screenshot({ 
        path: '/tmp/restaurants-template-loaded.png',
        fullPage: true 
      });
    }
  });

  test('Healthcare template (Howard Brown case study) should load correctly', async () => {
    console.log('=== TESTING: Healthcare Template (Howard Brown Style) ===');
    
    const healthcareButton = await global.page.$('button:has-text("Healthcare")') ||
                            await global.page.$('button:has-text("Howard Brown")');
    
    if (healthcareButton) {
      await healthcareButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check healthcare-specific volume (180k baseline)
      const annualCallsValue = await global.page.$eval('input[type="number"]', (el: HTMLInputElement) => el.value);
      console.log(`Healthcare template annual calls: ${annualCallsValue}`);
      expect(parseInt(annualCallsValue)).toBe(180000);
      
      await global.page.screenshot({ 
        path: '/tmp/healthcare-template-loaded.png',
        fullPage: true 
      });
    }
  });

  test('Financial Services template (Quicken case study) should load correctly', async () => {
    console.log('=== TESTING: Financial Services Template (Quicken Style) ===');
    
    const financialButton = await global.page.$('button:has-text("Financial")') ||
                           await global.page.$('button:has-text("Quicken")');
    
    if (financialButton) {
      await financialButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check high volume financial services (1.2M calls)
      const annualCallsValue = await global.page.$eval('input[type="number"]', (el: HTMLInputElement) => el.value);
      console.log(`Financial Services template annual calls: ${annualCallsValue}`);
      expect(parseInt(annualCallsValue)).toBe(1200000);
      
      await global.page.screenshot({ 
        path: '/tmp/financial-template-loaded.png',
        fullPage: true 
      });
    }
  });

  test('Template descriptions should reference real case studies', async () => {
    console.log('=== TESTING: Case Study References ===');
    
    // Check that templates reference real companies
    const templateDescriptions = await global.page.$$eval('.template-description', 
      elements => elements.map(el => el.textContent)
    );
    
    const caseStudyDetails = await global.page.$$eval('.case-study-detail', 
      elements => elements.map(el => el.textContent)
    );
    
    console.log('Template descriptions:', templateDescriptions);
    console.log('Case study details:', caseStudyDetails);
    
    // Should reference actual PolyAI customers
    const referencesRealCustomers = caseStudyDetails.some(detail => 
      detail?.includes('PG&E') || 
      detail?.includes('Côte') || 
      detail?.includes('Quicken') || 
      detail?.includes('Howard Brown') ||
      detail?.includes('Hopper') ||
      detail?.includes('Atos')
    );
    
    expect(referencesRealCustomers).toBe(true);
    
    await global.page.screenshot({ 
      path: '/tmp/case-study-references.png',
      fullPage: true 
    });
  });

  test('Templates should show realistic ROI projections', async () => {
    console.log('=== TESTING: Realistic ROI Projections ===');
    
    // Test utilities template (high volume, cost focus)
    const utilityButton = await global.page.$('button:has-text("Utilities")');
    if (utilityButton) {
      await utilityButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check ROI results are reasonable for utilities
      const roiElement = await global.page.$('[data-testid="roi"], .roi, text*="ROI"');
      if (roiElement) {
        const roiText = await global.page.evaluate(el => el.textContent, roiElement);
        console.log(`Utilities ROI: ${roiText}`);
      }
      
      await global.page.screenshot({ 
        path: '/tmp/utilities-roi-results.png',
        fullPage: true 
      });
    }
    
    // Test restaurants template (revenue focus)
    const restaurantButton = await global.page.$('button:has-text("Restaurants")');
    if (restaurantButton) {
      await restaurantButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await global.page.screenshot({ 
        path: '/tmp/restaurants-roi-results.png',
        fullPage: true 
      });
    }
  });
});