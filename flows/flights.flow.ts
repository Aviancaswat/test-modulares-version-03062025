import { expect, type Page } from "@playwright/test";
import { PlaywrightHelper } from "../helper/playwright.helper";
import { MESSAGES_PLAYWRIGHT as m } from "../global.variables";
import { AviancaBase } from "../classes/flows.abstract";

export class FlightsAvianca implements AviancaBase {
    private page: Page | undefined | any;
    private playwrightHelper: PlaywrightHelper;

    constructor(page: Page | undefined | any) {
        this.page = page;
        this.playwrightHelper = new PlaywrightHelper(page);
    }

    private async selectFlightOutbound() {
        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            await this.page.waitForSelector('#pageWrap');
            await this.page.waitForSelector('.journey_price_fare-select_label-text');
            await expect(this.page.locator(".journey_price_fare-select_label-text").first()).toBeVisible();
            await this.page.locator('.journey_price_fare-select_label-text').first().click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.page.waitForSelector(".journey_fares");
            await this.page.locator('.journey_fares').first().locator('.light-basic.cro-new-basic-button').click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.playwrightHelper.takeScreenshot('flight-seleccion-vuelo-ida');
        }
        catch (error) {
            console.error("FLIGHTS => Ocurrió un error al seleccionar el vuelo de ida. Error: ", error);
            throw error;
        }
    }

    private async selectFlightReturn() {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            await this.page.waitForSelector("#journeysContainerId_1", { timeout: 15000 });
            const containerReturn = this.page.locator("#journeysContainerId_1");
            await expect(containerReturn).toBeVisible();
            await containerReturn.locator(".journey_price_fare-select_label-text").first().click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.playwrightHelper.takeScreenshot('13-seleccion-vuelo-regreso');
            await containerReturn.locator('.journey_fares').first().locator('.light-basic.cro-new-basic-button').click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.page.waitForTimeout(1500);
        }
        catch (error) {
            console.error("FLIGHTS => Ocurrió un error al seleccionar el vuelo de regreso. Error: ", error);
            throw error;
        }
    }

    private async validateModalFlight() {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            await this.page.waitForTimeout(1500);
            const isVisibleModal = await this.page.locator("#FB310").first().isVisible();
            if (isVisibleModal) {
                await expect(this.page.locator(".cro-button.cro-no-accept-upsell-button")).toBeVisible();
                await this.page.locator(".cro-button.cro-no-accept-upsell-button").first().click({ delay: this.playwrightHelper.getRandomDelay() });
            }
        }
        catch (error) {
            console.error("FLIGHTS => Ocurrió un error");
            throw error;
        }
    }

    private async continueToPassenger() {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            await this.page.waitForSelector(".trip-summary");
            const buttonConfirmResumen = this.page.locator(".button.page_button.btn-action");
            await expect(buttonConfirmResumen).toBeVisible();
            buttonConfirmResumen.scrollIntoViewIfNeeded();
            await buttonConfirmResumen.click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.page.waitForSelector(".passenger_data_group");
        }
        catch (error) {
            console.error("FLIGHTS => Ocurrió un error en click a continuar a flujo de pasajeros. Error: ", error);
            throw error;
        }
    }

    public async run() {
        await this.selectFlightOutbound();
        await this.validateModalFlight();
        await this.selectFlightReturn();
        await this.validateModalFlight();
        await this.playwrightHelper.takeScreenshot("resumen-seleccion-vuelos");
        await this.continueToPassenger();
    }
}