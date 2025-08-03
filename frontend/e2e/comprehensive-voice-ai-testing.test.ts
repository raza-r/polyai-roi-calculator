describe('Comprehensive Voice AI ROI Calculator Testing', () => {
  const APP_URL = 'http://localhost:5173';

  beforeEach(async () => {
    await global.page.goto(APP_URL, { waitUntil: 'networkidle0' });
  });

  test('Scenario 1: Large Retail Customer (High Volume)', async () => {
    console.log('=== TESTING: Large Retail Customer Scenario ===');
    
    // Set high volume retail scenario
    await global.page.click('input[type="number"]'); // Annual calls
    await global.page.evaluate(() => {
      const input = document.querySelector('input[type="number"]') as HTMLInputElement;
      input.value = '2000000'; // 2M calls/year
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Capture key metrics
    const metrics = await global.page.evaluate(() => {
      const totalValue = document.querySelector('[data-testid="total-value"]')?.textContent || 
                        document.querySelector('.results-panel')?.textContent || '';
      const payback = document.querySelector('[data-testid="payback"]')?.textContent ||
                     document.querySelector('.results-panel')?.textContent || '';
      return { totalValue, payback };
    });

    console.log('Large Retail Metrics:', metrics);
    
    await global.page.screenshot({ 
      path: '/tmp/scenario-large-retail.png',
      fullPage: true 
    });
  });

  test('Scenario 2: Financial Services (Complex Intents)', async () => {
    console.log('=== TESTING: Financial Services Multi-Intent Scenario ===');
    
    // Try to add multiple intents for financial services
    const addIntentButton = await global.page.$('button');
    const buttonText = await addIntentButton?.evaluate(el => el.textContent);
    
    if (buttonText && buttonText.includes('Add')) {
      await addIntentButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Test with financial services volume (500k calls)
    await global.page.evaluate(() => {
      const input = document.querySelector('input[type="number"]') as HTMLInputElement;
      input.value = '500000';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await global.page.screenshot({ 
      path: '/tmp/scenario-financial-services.png',
      fullPage: true 
    });
  });

  test('Scenario 3: Healthcare/Hospital (High Agent Costs)', async () => {
    console.log('=== TESTING: Healthcare High Agent Cost Scenario ===');
    
    // Set healthcare scenario with higher agent costs
    await global.page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="number"]');
      // Assuming agent cost is one of the number inputs
      inputs.forEach((input: HTMLInputElement, index) => {
        if (index === 0) input.value = '300000'; // 300k calls
        if (index === 1) input.value = '1.20'; // Higher agent cost per minute
      });
      inputs.forEach(input => input.dispatchEvent(new Event('input', { bubbles: true })));
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await global.page.screenshot({ 
      path: '/tmp/scenario-healthcare.png',
      fullPage: true 
    });
  });

  test('Scenario 4: Telecom Provider (Ultra High Volume)', async () => {
    console.log('=== TESTING: Telecom Ultra High Volume Scenario ===');
    
    // Set telecom scenario - massive volume
    await global.page.evaluate(() => {
      const input = document.querySelector('input[type="number"]') as HTMLInputElement;
      input.value = '5000000'; // 5M calls/year
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if this breaks anything or shows extreme values
    const pageContent = await global.page.content();
    const hasError = pageContent.includes('error') || pageContent.includes('Error');
    console.log('Telecom scenario has errors:', hasError);

    await global.page.screenshot({ 
      path: '/tmp/scenario-telecom.png',
      fullPage: true 
    });
  });

  test('Edge Case: Invalid Volume Shares', async () => {
    console.log('=== TESTING: Invalid Volume Share Edge Case ===');
    
    // Try to set volume shares that don't sum to 100%
    const volumeInputs = await global.page.$$('input[step="0.01"]');
    
    if (volumeInputs.length > 0) {
      await volumeInputs[0].click({ clickCount: 3 });
      await volumeInputs[0].type('0.3'); // 30% instead of 100%
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check for error message
      const errorExists = await global.page.$('.error-message');
      const errorText = errorExists ? await global.page.$eval('.error-message', el => el.textContent) : 'No error shown';
      console.log('Volume share error handling:', errorText);
    }

    await global.page.screenshot({ 
      path: '/tmp/edge-case-volume-shares.png',
      fullPage: true 
    });
  });

  test('Export Functionality Test', async () => {
    console.log('=== TESTING: Export Functionality ===');
    
    // Wait for results to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find export buttons
    const exportButtons = await global.page.$$('button');
    let foundExports = [];
    
    for (const button of exportButtons) {
      const text = await button.evaluate(el => el.textContent);
      const disabled = await button.evaluate(el => el.disabled);
      
      if (text && (text.includes('Export') || text.includes('PDF') || text.includes('CSV') || text.includes('Excel'))) {
        foundExports.push({ text, disabled });
      }
    }
    
    console.log('Export buttons found:', foundExports);
    
    await global.page.screenshot({ 
      path: '/tmp/export-functionality.png',
      fullPage: true 
    });
  });

  test('Template Functionality Test', async () => {
    console.log('=== TESTING: Template Functionality ===');
    
    // Test template picker if it exists
    const templatePicker = await global.page.$('select');
    
    if (templatePicker) {
      const options = await global.page.$$eval('select option', options => 
        options.map(option => ({ value: option.value, text: option.textContent }))
      );
      
      console.log('Available templates:', options);
      
      // Try selecting different templates
      for (let i = 1; i < Math.min(options.length, 4); i++) {
        await global.page.select('select', options[i].value);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`Selected template: ${options[i].text}`);
        
        await global.page.screenshot({ 
          path: `/tmp/template-${i}.png`,
          fullPage: true 
        });
      }
    } else {
      console.log('No template picker found');
    }
  });

  test('Sensitivity Analysis Test', async () => {
    console.log('=== TESTING: Sensitivity Analysis ===');
    
    // Look for sensitivity analysis section
    const sensitivitySection = await global.page.$('.sensitivity');
    const sensitivityExists = !!sensitivitySection;
    
    console.log('Sensitivity analysis visible:', sensitivityExists);
    
    // Check if charts are rendered
    const charts = await global.page.$$('svg, canvas, .recharts');
    console.log(`Found ${charts.length} chart elements`);
    
    await global.page.screenshot({ 
      path: '/tmp/sensitivity-analysis.png',
      fullPage: true 
    });
  });

  test('Mobile Responsiveness Test', async () => {
    console.log('=== TESTING: Mobile Responsiveness ===');
    
    // Test mobile viewport
    await global.page.setViewport({ width: 375, height: 667 }); // iPhone dimensions
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await global.page.screenshot({ 
      path: '/tmp/mobile-view.png',
      fullPage: true 
    });
    
    // Test tablet viewport
    await global.page.setViewport({ width: 768, height: 1024 }); // iPad dimensions
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await global.page.screenshot({ 
      path: '/tmp/tablet-view.png',
      fullPage: true 
    });
    
    // Reset to desktop
    await global.page.setViewport({ width: 1280, height: 720 });
  });

  test('Performance Under Load Test', async () => {
    console.log('=== TESTING: Performance Under Rapid Input Changes ===');
    
    const startTime = Date.now();
    
    // Rapidly change inputs to test performance
    for (let i = 0; i < 10; i++) {
      await global.page.evaluate((iteration) => {
        const input = document.querySelector('input[type="number"]') as HTMLInputElement;
        input.value = String(100000 + iteration * 50000);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, i);
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Quick succession
    }
    
    const endTime = Date.now();
    console.log(`Performance test completed in ${endTime - startTime}ms`);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for final calculation
    
    await global.page.screenshot({ 
      path: '/tmp/performance-test.png',
      fullPage: true 
    });
  });
});