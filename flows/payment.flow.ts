import { expect, Page } from "@playwright/test";
import { PageBase } from "../classes/page.abstract";
import { PlaywrightHelper } from "../helper/playwright.helper";
import { MESSAGES_PLAYWRIGHT as m } from "../global.variables";

export class PaymentAvianca implements PageBase {

    private page: Page | undefined | any;
    private playwrightHelper: PlaywrightHelper;

    constructor(page: Page | undefined | any) {
        this.page = page;
        this.playwrightHelper = new PlaywrightHelper(page);
    }

    private async fillFormPayment(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            // Llenar datos de facturación
            await this.page.waitForSelector('.payment-button--3DSecure', { timeout: 300_000 });

            // Correo electrónico
            const emailInput = this.page.locator('input#email');
            await expect(emailInput).toBeVisible();
            await emailInput.fill('monitoreo.digital@avianca.com');

            // Dirección de residencia
            const addressInput = this.page.locator('input#address');
            await expect(addressInput).toBeVisible();
            await addressInput.fill('Calle 123 #45-67');

            // Ciudad
            const cityInput = this.page.locator('input#city');
            await expect(cityInput).toBeVisible();
            await cityInput.fill('Bogotá');

            // País
            const countryBtn = this.page.locator('button#country');
            await expect(countryBtn).toBeVisible();
            await countryBtn.click();

            // Esperar a que aparezcan las opciones
            await this.page.waitForSelector('div.ds-select-dropdown li button', { timeout: 5_000 });

            // Seleccionar “Colombia”
            const countryOption = this.page
                .locator('div.ds-select-dropdown li button')
                .filter({ hasText: 'Colombia' });
            await expect(countryOption).toBeVisible();
            await countryOption.click({ delay: this.playwrightHelper.getRandomDelay() });

            await this.playwrightHelper.takeScreenshot('19-country-seleccionado');

            // Aceptar Términos
            const termsCheckbox = this.page.locator('input#terms');
            await expect(termsCheckbox).toBeVisible();
            await termsCheckbox.check();
            await this.playwrightHelper.takeScreenshot('20-aceptar-terminos');

            // Captura final de facturación
            await this.playwrightHelper.takeScreenshot('21-datos-facturacion');
        }
        catch (error) {
            console.error("PAYMENT => Ocurrió un error al llenar los campos del formulario de pagos. Error: ", error);
            throw error;
        }
    }

    private continueToNext() {
        throw new Error("Not implemented method");
    }

    public async run(): Promise<void> {
        await this.fillFormPayment();
    }

}