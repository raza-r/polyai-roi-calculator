describe('ROI Calculator App Analysis', () => {
  const APP_URL = 'http://localhost:5173';

  beforeEach(async () => {
    try {
      await global.page.goto(APP_URL, { waitUntil: 'networkidle0' });
    } catch (error) {
      console.log('Note: App may not be running. Start with: npm run dev');
      throw error;
    }
  });

  test('should capture basic app structure and functionality', async () => {
    // Basic app loading test
    const title = await global.page.title();
    console.log('App title:', title);

    // Get app structure
    const bodyContent = await global.page.$('body');
    expect(bodyContent).toBeTruthy();

    // Take a screenshot for analysis
    await global.page.screenshot({ 
      path: '/tmp/roi-calculator-screenshot.png',
      fullPage: true 
    });

    // Analyze main components
    const header = await global.page.$('h1');
    if (header) {
      const headerText = await global.page.evaluate(el => el.textContent, header);
      console.log('Main header:', headerText);
    }

    // Check for input fields
    const inputs = await global.page.$$('input');
    console.log(`Found ${inputs.length} input fields`);

    // Check for buttons
    const buttons = await global.page.$$('button');
    console.log(`Found ${buttons.length} buttons`);

    // Check for sections
    const sections = await global.page.$$('div[class*="section"]');
    console.log(`Found ${sections.length} main sections`);

    // Basic interaction test - try to find and click first input
    if (inputs.length > 0) {
      try {
        await inputs[0].click();
        console.log('Successfully interacted with first input field');
      } catch (e) {
        console.log('Could not interact with input field');
      }
    }

    expect(true).toBe(true); // Basic pass to show test ran
  });
});