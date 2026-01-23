import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('je suis sur la page Nike', async function (this: CustomWorld) {
  await this.nike!.assertOnNike();
});



When("je recherche {string}", async function (this: CustomWorld, term: string) {
  await this.nike!.search(term);
});

Then("je vois des résultats", async function (this: CustomWorld) {
  await this.nike!.assertHasResults();
});

When("j'ouvre le premier résultat", async function (this: CustomWorld) {
  await this.nike!.openFirstResult();
});

Then("je vois le titre et le prix du produit", async function (this: CustomWorld) {
  await this.nike!.assertProductTitleAndPrice();
});


Given('je suis sur la page de connexion Nike', async function (this: CustomWorld) {
  await this.nike!.openLoginPage();
});

When("je renseigne l'email {string}", async function (this: CustomWorld, email: string) {
  await this.nike!.fillEmail(email);
});



When('je clique sur {string}', async function (this: CustomWorld, btnText: string) {
  await this.nike!.clickButton(btnText);
});

Then("je vois un message d'erreur de connexion", async function (this: CustomWorld) {
  await this.nike!.assertLoginFailed();
});

When("je sélectionne une taille disponible", async function (this: CustomWorld) {
  try {
    await this.nike!.selectFirstAvailableSize();
  } catch (e) {
    // Si pas de tailles sur ce produit (ex: ballon), on ignore
    return;
  }
});


When("j'ajoute le produit au panier", async function (this: CustomWorld) {
  await this.nike!.addToCart();
});

Then('le panier doit contenir au moins 1 article', async function (this: CustomWorld) {
  await this.nike!.assertCartHasAtLeastOneItem();
});

When("si une taille est demandée, je sélectionne la première disponible", async function (this: CustomWorld) {
  await this.nike!.selectFirstAvailableSizeIfPresent();
});

When("j'ouvre le panier", async function (this: CustomWorld) {
  await this.nike!.openCart();
});



