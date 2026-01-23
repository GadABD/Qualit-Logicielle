import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import type { Browser, Page } from '@playwright/test';
import { NikePage } from '../pages/NikePage';

export class CustomWorld extends World {
  browser?: Browser;
  page?: Page;
  nike?: NikePage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
