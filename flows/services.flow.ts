import { expect, type Page } from "@playwright/test";
import { PageBase } from "../classes/page.abstract";
import { PlaywrightHelper } from "../helper/playwright.helper";
import { MESSAGES_PLAYWRIGHT as m } from "../global.variables";

export class ServicesAvianca implements PageBase {

    private page: Page | undefined | any;
    private playwrightHelper: PlaywrightHelper;

    constructor(page: Page | undefined | any) {
        this.page = page;
        this.playwrightHelper = new PlaywrightHelper(page);
    }

    private async continueToSeats(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            await expect(this.page.locator(".button_label").last()).toBeVisible();
            await this.page.locator('.button_label').last().click({ delay: this.playwrightHelper.getRandomDelay() });
        }
        catch (error) {
            console.error("SERVICES => Ocurrión un error al darle clic en continuar a asientos: ", error);
            throw error;
        }
    }

    private async validateModalServices(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            const upsellService = await this.page.locator('.terciary-button').last().isVisible()
            if (upsellService) {
                await this.page.locator('.terciary-button').last().click({ delay: this.playwrightHelper.getRandomDelay() })
            }
        }
        catch (error) {
            console.error("SERVICES => Ocurrió un error al validar el modal de servicios despues del click. Error: ", error);
            throw error;
        }
    }

    public async run(): Promise<void> {
        await this.continueToSeats();
        await this.validateModalServices();
    }
}