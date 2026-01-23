import { expect, type Page } from '@playwright/test';

export class NikePage {
  constructor(private page: Page) {}

  async openHome() {
    await this.page.goto('https://www.nike.com/fr/', { waitUntil: 'domcontentloaded' });
  }

  async acceptCookiesIfPresent() {
    const tryClickInContext = async (ctx: any) => {
      const acceptCandidates = [
        ctx.locator('button:has-text("Tout accepter")'),
        ctx.locator('#onetrust-accept-btn-handler'),
        ctx.getByRole?.('button', { name: /Tout accepter/i }) ?? null,
      ].filter(Boolean);

      const refuseCandidates = [
        ctx.locator('button:has-text("Tout refuser")'),
        ctx.locator('#onetrust-reject-all-handler'),
        ctx.getByRole?.('button', { name: /Tout refuser/i }) ?? null,
      ].filter(Boolean);

      const clickFirstVisible = async (arr: any[]) => {
        for (const loc of arr) {
          const el = loc.first();
          if (await el.isVisible().catch(() => false)) {
            await el.click({ force: true }).catch(async () => {
              await this.page.waitForTimeout(200);
              await el.click({ force: true });
            });
            return true;
          }
        }
        return false;
      };

      if (await clickFirstVisible(acceptCandidates)) return true;
      if (await clickFirstVisible(refuseCandidates)) return true;
      return false;
    };

    const maxWaitMs = 8000;
    const start = Date.now();

    while (Date.now() - start < maxWaitMs) {
      if (await tryClickInContext(this.page)) return;

      for (const frame of this.page.frames()) {
        if (frame === this.page.mainFrame()) continue;
        if (await tryClickInContext(frame)) return;
      }

      await this.page.waitForTimeout(250);
    }
  }

  async assertOnNike() {
    await expect(this.page).toHaveURL(/nike\.com\/fr/i);
  }

  async search(term: string) {
    const openSearchBtn = this.page.getByRole('button', { name: /Rechercher/i }).first();
    if (await openSearchBtn.isVisible().catch(() => false)) {
      await openSearchBtn.click().catch(() => {});
    }

    const searchInput = this.page
      .getByRole('searchbox')
      .first()
      .or(this.page.locator('input[type="search"]').first())
      .or(this.page.locator('input[placeholder*="Rechercher"]').first());

    await searchInput.waitFor({ state: 'visible', timeout: 20000 });
    await searchInput.fill(term);
    await searchInput.press('Enter');

    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertHasResults() {
    const firstProductLink = this.page.locator('a[href*="/t/"]').first();
    await firstProductLink.waitFor({ state: 'visible', timeout: 20000 });
  }

  async openFirstResult() {
    const firstProductLink = this.page.locator('a[href*="/t/"]').first();

    await firstProductLink.waitFor({ state: 'visible', timeout: 20000 });
    await firstProductLink.scrollIntoViewIfNeeded().catch(() => {});
    await this.page.waitForTimeout(300);

    const href = await firstProductLink.getAttribute('href');
    if (href) {
      const url = href.startsWith('http') ? href : `https://www.nike.com${href}`;
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      return;
    }

    await firstProductLink.click({ force: true, timeout: 20000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertProductTitleAndPrice() {
    const title = this.page.locator('h1').first();
    await expect(title).toBeVisible({ timeout: 20000 });

    const price = this.page.locator('text=/\\d+([\\.,]\\d{2})?\\s?€/').first();
    await expect(price).toBeVisible({ timeout: 20000 });
  }

  // --- LOGIN ---

  async openLoginPage() {
    await this.page.goto('https://www.nike.com/fr/login', { waitUntil: 'domcontentloaded' });
    await this.acceptCookiesIfPresent();
  }

  async fillEmail(email: string) {
    const emailInput = this.page
      .locator('input[type="email"]')
      .first()
      .or(this.page.locator('#username').first());

    await emailInput.waitFor({ state: 'visible', timeout: 20000 });
    await emailInput.fill(email);

    await emailInput.press('Tab').catch(() => {});
    await this.page.waitForTimeout(200);
  }

  async fillLogin(email: string, password: string) {
    const emailInput = this.page
      .locator('input[type="email"]')
      .first()
      .or(this.page.locator('input#username').first())
      .or(this.page.getByRole('textbox', { name: /e-?mail/i }).first());

    const passInput = this.page
      .locator('input[type="password"]')
      .first()
      .or(this.page.locator('input#password').first());

    await emailInput.waitFor({ state: 'visible', timeout: 20000 });
    await emailInput.fill(email);

    await passInput.waitFor({ state: 'visible', timeout: 20000 });
    await passInput.fill(password);
  }

  async clickButton(text: string) {
    const rx = new RegExp(text, 'i');

    const btn = this.page
      .getByRole('button', { name: rx })
      .first()
      .or(this.page.locator(`button:has-text("${text}")`).first())
      .or(this.page.locator(`input[type="submit"][value="${text}"]`).first());

    await btn.waitFor({ state: 'visible', timeout: 20000 });
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await this.page.waitForTimeout(150);

    if (await btn.isDisabled().catch(() => false)) {
      await this.page.waitForTimeout(500);
    }

    await btn.click({ timeout: 20000 }).catch(async () => {
      await btn.click({ timeout: 20000, force: true });
    });

    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertLoginFailed() {
    const msg = this.page.getByText(/Erreur lors de l'analyse de la réponse du serveur/i).first();

    const fallback = this.page.locator('text=/incorrect|invalide|erreur|impossible/i').first();

    if (await msg.isVisible().catch(() => false)) {
      await msg.waitFor({ state: 'visible', timeout: 20000 });
      return;
    }

    await fallback.waitFor({ state: 'visible', timeout: 20000 });
  }

  // --- PANIER ---

  async selectFirstAvailableSize(): Promise<boolean> {
  await this.page.waitForLoadState('domcontentloaded');

  const sizeRoot = this.page.locator('#size-selector, [data-testid="size-selector"]').first();
  const visible = await sizeRoot.isVisible().catch(() => false);

  // Pas de bloc tailles -> produit sans tailles (ballon, etc.)
  if (!visible) return false;

  const grid = sizeRoot.locator('[data-testid="pdp-grid-selector"]').first();
  const gridVisible = await grid.isVisible().catch(() => false);
  if (!gridVisible) return false;

  const buttons = grid.locator('button');
  const count = await buttons.count();

  for (let i = 0; i < Math.min(count, 80); i++) {
    const btn = buttons.nth(i);

    const isVisible = await btn.isVisible().catch(() => false);
    if (!isVisible) continue;

    const ariaDisabled = await btn.getAttribute('aria-disabled').catch(() => null);
    const disabled = ariaDisabled === 'true' || (await btn.isDisabled().catch(() => false));
    if (disabled) continue;

    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await btn.click({ force: true });
    await this.page.waitForTimeout(300);
    return true;
  }

  // Bloc tailles présent mais rien de cliquable
  return false;
}



  async addToCart() {
    const addBtn = this.page
      .getByRole('button', { name: /Ajouter au panier|Ajouter au sac/i })
      .first();

    await addBtn.waitFor({ state: 'visible', timeout: 20000 });

    await addBtn.click({ timeout: 20000 }).catch(async () => {
      await addBtn.click({ timeout: 20000, force: true });
    });

    await this.page.waitForTimeout(1200);
  }

  async assertCartHasAtLeastOneItem() {
    const bag = this.page
      .locator('a[href*="/cart"]')
      .first()
      .or(this.page.getByRole('link', { name: /Panier|Sac/i }).first());

    if (await bag.isVisible().catch(() => false)) {
      await bag.click().catch(() => {});
      await this.page.waitForLoadState('domcontentloaded');
    } else {
      await this.page.goto('https://www.nike.com/fr/cart', { waitUntil: 'domcontentloaded' });
    }

    const item = this.page
      .locator('[data-testid*="cart"], [class*="cart"], li:has(a[href*="/t/"])')
      .first();

    await item.waitFor({ state: 'visible', timeout: 20000 });
  }

  async selectFirstAvailableSizeIfPresent() {
  await this.page.waitForLoadState('domcontentloaded');

  // Le bloc tailles Nike (vu dans ton DevTools)
  const sizeRoot = this.page.locator('#size-selector, [data-testid="size-selector"]').first();
  const hasSize = await sizeRoot.isVisible().catch(() => false);

  // Si pas de taille demandée (ballon, accessoires, etc.) -> on ne fait rien
  if (!hasSize) return;

  const grid = sizeRoot.locator('[data-testid="pdp-grid-selector"]').first();
  const gridVisible = await grid.isVisible().catch(() => false);
  if (!gridVisible) return;

  const buttons = grid.locator('button');
  const count = await buttons.count();

  for (let i = 0; i < Math.min(count, 80); i++) {
    const btn = buttons.nth(i);

    const visible = await btn.isVisible().catch(() => false);
    if (!visible) continue;

    const ariaDisabled = await btn.getAttribute('aria-disabled').catch(() => null);
    const disabled = ariaDisabled === 'true' || (await btn.isDisabled().catch(() => false));
    if (disabled) continue;

    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await btn.click({ force: true });
    await this.page.waitForTimeout(300); // laisse Nike activer "Ajouter au panier"
    return;
  }
}
  async openCart() {
  // Essaye d’abord un lien direct s’il existe
  const cartLink = this.page.locator('a[href*="/cart"]').first();

  if (await cartLink.isVisible().catch(() => false)) {
    await cartLink.click().catch(() => {});
    await this.page.waitForLoadState('domcontentloaded');
    return;
  }

  // Sinon URL directe
  await this.page.goto('https://www.nike.com/fr/cart', { waitUntil: 'domcontentloaded' });
}


}
