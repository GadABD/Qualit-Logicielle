import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CustomWorld } from './world';
import { NikePage } from '../pages/NikePage';

setDefaultTimeout(90 * 1000);

Before(async function (this: CustomWorld) {
  const headless = process.env.HEADLESS !== '0';
  const slowMo = Number(process.env.SLOWMO ?? 0);

  this.browser = await chromium.launch({
    headless,
    slowMo,
    args: ['--start-maximized'],
  });

  this.page = await this.browser.newPage();

  // Optionnel : viewport "desktop" stable
  await this.page.setViewportSize({ width: 1440, height: 900 });

  this.nike = new NikePage(this.page);

  await this.nike.openHome();

  // Attendre que le site charge un minimum
  await this.page.waitForLoadState('domcontentloaded');

  // Cookies (robuste, avec fallback iframes dans NikePage)
  await this.nike.acceptCookiesIfPresent();

  // Petit buffer pour éviter des flakiness sur pages très dynamiques
  await this.page.waitForTimeout(300);
});

After(async function (this: CustomWorld) {
  await this.page?.close().catch(() => {});
  await this.browser?.close().catch(() => {});
});
