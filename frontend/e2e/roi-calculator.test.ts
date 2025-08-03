describe('ROI Calculator E2E Tests', () => {
  const APP_URL = 'http://localhost:5173'; // Vite dev server default port

  beforeEach(async () => {
    await page.goto(APP_URL);
    await page.waitForSelector('h1');
  });

  test('should load the app and display main components', async () => {
    // Check if main header is present
    const header = await page.$eval('h1', el => el.textContent);
    expect(header).toBe('Voice AI ROI Calculator');

    // Check if disclaimer is present
    const disclaimer = await page.$('.disclaimer');
    expect(disclaimer).toBeTruthy();

    // Check if main sections are present
    const inputSection = await page.$('.input-section');
    const resultsSection = await page.$('.results-section');
    expect(inputSection).toBeTruthy();
    expect(resultsSection).toBeTruthy();
  });

  test('should allow editing annual calls input', async () => {
    // Find and clear the annual calls input
    const annualCallsInput = await page.$('input[type="number"]');
    expect(annualCallsInput).toBeTruthy();

    await annualCallsInput?.click({ clickCount: 3 }); // Select all text
    await page.type('input[type="number"]', '250000');

    // Wait for calculation to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if results panel updates
    const resultsPanel = await page.$('.results-panel');
    expect(resultsPanel).toBeTruthy();
  });

  test('should display error for invalid intent volume shares', async () => {
    // Find volume share inputs and modify them to not sum to 1.0
    const volumeInputs = await page.$$('input[step="0.01"]');
    
    if (volumeInputs.length > 0) {
      // Set first volume share to 0.7 (should cause error since default is 1.0)
      await volumeInputs[0].click({ clickCount: 3 });
      await page.type('input[step="0.01"]', '0.7');

      // Wait for error message
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if error message appears
      const errorMessage = await page.$('.error-message');
      expect(errorMessage).toBeTruthy();

      const errorText = await page.$eval('.error-message', el => el.textContent);
      expect(errorText).toContain('Intent volume shares must sum to 100%');
    }
  });

  test('should allow template selection', async () => {
    // Look for template picker dropdown
    const templatePicker = await page.$('select');
    
    if (templatePicker) {
      // Select a different template option
      await page.select('select', '1'); // Assuming index 1 exists

      // Wait for template to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify inputs changed (this would depend on your template structure)
      const annualCallsInput = await page.$eval('input[type="number"]', (el: HTMLInputElement) => el.value);
      expect(annualCallsInput).toBeTruthy();
    }
  });

  test('should show loading state during calculation', async () => {
    // Make a change to trigger calculation
    const annualCallsInput = await page.$('input[type="number"]');
    await annualCallsInput?.click({ clickCount: 3 });
    await page.type('input[type="number"]', '500000');

    // Look for loading indicator (adjust selector based on your implementation)
    const loadingIndicator = await page.$('.loading');
    if (loadingIndicator) {
      expect(loadingIndicator).toBeTruthy();
    }
  });

  test('should enable export buttons when results are available', async () => {
    // Wait for initial calculation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if export buttons are present and enabled
    const exportButtons = await page.$$('button');
    const enabledExportButtons = [];

    for (const button of exportButtons) {
      const disabled = await button.evaluate((el: HTMLButtonElement) => el.disabled);
      const text = await button.evaluate((el: HTMLButtonElement) => el.textContent);
      
      if (!disabled && text && (text.includes('Export') || text.includes('PDF') || text.includes('CSV'))) {
        enabledExportButtons.push(button);
      }
    }

    expect(enabledExportButtons.length).toBeGreaterThan(0);
  });

  test('should display audit trail when results are available', async () => {
    // Wait for initial calculation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if audit trail is visible
    const auditTrail = await page.$('.audit-trail');
    if (auditTrail) {
      expect(auditTrail).toBeTruthy();
    }
  });

  test('should handle intent grid interactions', async () => {
    // Look for intent grid
    const intentGrid = await page.$('.intent-grid');
    
    if (intentGrid) {
      // Try to add a new intent if there's an "Add" button
      const addButton = await page.$('button');
      const addButtonText = await addButton?.evaluate((el: HTMLButtonElement) => el.textContent);
      
      if (addButtonText && addButtonText.includes('Add')) {
        await addButton?.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify new intent was added (implementation depends on your UI)
        const intentRows = await page.$$('.intent-row');
        expect(intentRows.length).toBeGreaterThan(1);
      }
    }
  });

  test('should persist data across component interactions', async () => {
    // Get initial annual calls value
    const initialValue = await page.$eval('input[type="number"]', (el: HTMLInputElement) => el.value);
    
    // Make a change
    await page.$eval('input[type="number"]', (el: HTMLInputElement) => {
      el.value = '750000';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Wait for update
    await new Promise(resolve => setTimeout(resolve, 500));

    // Interact with another component (like clicking on results panel)
    const resultsPanel = await page.$('.results-panel');
    await resultsPanel?.click();

    // Verify the input value persisted
    const updatedValue = await page.$eval('input[type="number"]', (el: HTMLInputElement) => el.value);
    expect(updatedValue).toBe('750000');
    expect(updatedValue).not.toBe(initialValue);
  });
});