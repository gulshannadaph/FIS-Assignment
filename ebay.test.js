const { test, expect } = require('@playwright/test');

test('Scenario 1 – Verify item can be added to Cart', async ({ page, context }) => {

  await page.goto('https://www.ebay.com');
  await expect(page).toHaveURL(/.*ebay.com/);
  console.log('Visited eBay homepage');


  const searchTerm = 'books';
  const searchInput = page.locator('input[aria-label="Search for anything"]');
  await searchInput.type(searchTerm);
  await searchInput.press('Enter');
  await expect(page).toHaveURL(/.*sch.*/);
  console.log(`Searched for ${searchTerm}`);


  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('#srp-river-results .s-item__link').first().click({ force: true })
  ]);
  await newPage.waitForLoadState();
  console.log('New tab opened and loaded');


  const addToCartLink = newPage.locator('a[href*="https://cart.payments.ebay.com/sc/add"]');
  await addToCartLink.waitFor({ state: 'visible', timeout: 60000 });
  await addToCartLink.scrollIntoViewIfNeeded();
  await expect(addToCartLink).toBeVisible();
  await addToCartLink.click({ force: true });
  console.log('Clicked the "Add to cart" link');


  await newPage.waitForLoadState('networkidle');
  console.log('Cart page loaded');


  const cartIcon = await newPage.locator('.gh-cart__icon');
  await cartIcon.waitFor({ state: 'visible', timeout: 60000 });
  const badge = await newPage.locator('.gh-cart__icon .badge');
  const badgeText = await badge.textContent();
  console.log('Cart badge text:', badgeText);
  await expect(badgeText).not.toBe('');
  console.log('Verified the cart has been updated');
});