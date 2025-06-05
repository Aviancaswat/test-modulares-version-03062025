import { expect, Page } from "@playwright/test";
import { PageBase } from "../classes/page.abstract";
import { PlaywrightHelper } from "../helper/playwright.helper";
import { MESSAGES_PLAYWRIGHT as m } from "../global.variables";
import { copys } from "../utils/data/copys";

export class SeatsAvianca implements PageBase {

    private page: Page | undefined | any;
    private playwrightHelper: PlaywrightHelper;

    constructor(page: Page | undefined | any) {
        this.page = page;
        this.playwrightHelper = new PlaywrightHelper(page);
    }

    private async selectSeatsUsers(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            const lang = this.playwrightHelper.getLang();
            await this.page.waitForTimeout(12000);
            await this.playwrightHelper.takeScreenshot("Pagina-de-seleccion-asientos");
            const pasajeros = this.page.locator(".pax-selector_pax-avatar")

            for (const e of await pasajeros.all()) {
                await this.playwrightHelper.takeScreenshot("seleccion-asiento");
                await expect(this.page.locator(".seat-number").first()).toBeVisible();
                await this.page.locator('.seat-number').first().click({ delay: this.playwrightHelper.getRandomDelay() });
                await this.page.waitForTimeout(8000);
            }

            await this.page.waitForSelector(".next-flight-code");
            await expect(this.page.locator(".next-flight-code")).toBeVisible();
            await this.playwrightHelper.takeScreenshot("seleccion-asiento-vuelta");
            await this.page.locator('.next-flight-code').click({ delay: this.playwrightHelper.getRandomDelay() });

            const pasajerosVuelta = this.page.locator(".pax-selector_pax-avatar")

            for (const j of await pasajerosVuelta.all()) {
                await this.playwrightHelper.takeScreenshot("seleccion-asiento");
                await expect(this.page.locator(".seat-number").first()).toBeVisible();
                await this.page.locator('.seat-number').first().click({ delay: this.playwrightHelper.getRandomDelay() });
                await this.page.waitForTimeout(8000);
            }
        }
        catch (error) {
            console.error("SEATS => Ocurrió un error al seleccionar los asientos de los usuarios. Error: ", error);
            throw error;
        }
    }

    private async continueToPayment(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            const lang = this.playwrightHelper.getLang();
            await expect(this.page.getByRole('button', { name: copys[lang].pagar, exact: true })).toBeVisible()
            await this.page.getByRole('button', { name: copys[lang].pagar, exact: true }).click({ delay: this.playwrightHelper.getRandomDelay() });
        }
        catch (error) {
            console.error("SEATS => Ocurrió un error al darle click a continuar a pagos. Error: ", error);
            throw error;
        }
    }

    public async run(): Promise<void> {
        await this.selectSeatsUsers();
        await this.continueToPayment();
    }
}