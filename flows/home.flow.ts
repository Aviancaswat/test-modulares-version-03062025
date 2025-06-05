import { expect, type Page } from "@playwright/test";
import { MESSAGES_PLAYWRIGHT as m } from "../global.variables";
import { PlaywrightHelper } from "../helper/playwright.helper";
import { copys } from "../utils/data/copys";
import { PageBase } from "../classes/page.abstract";

export class HomeAvianca implements PageBase {
    private page: Page | undefined | any;
    private playwrightHelper: PlaywrightHelper;

    constructor(page: Page | undefined | any) {
        this.page = page;
        this.playwrightHelper = new PlaywrightHelper(page);
    }
   
    private async verifyCookies(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        const consentBtn = this.page.locator('#onetrust-pc-btn-handler', { delay: this.playwrightHelper.getRandomDelay() });

        if (await consentBtn.isVisible()) {
            await this.page.waitForSelector("#onetrust-pc-btn-handler");
            await consentBtn.click();
            await this.page.locator('.save-preference-btn-handler.onetrust-close-btn-handler').click({ delay: this.playwrightHelper.getRandomDelay() });
        }
    }

    private async selectOriginOption(): Promise<void> {
        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            const lang = this.playwrightHelper.getLang();
            await expect(this.page.locator('.content-wrap')).toBeVisible();
            await this.page.waitForSelector("#originBtn");
            await expect(this.page.locator('#originBtn')).toBeVisible();
            const origen = this.page.getByPlaceholder((copys[lang]).origen);
            await this.page.locator('button#originBtn').click({ delay: this.playwrightHelper.getRandomDelay() });
            await origen.fill(copys['ciudad_origen'], { delay: this.playwrightHelper.getRandomDelay() });
            await origen.press('Enter');
            await (this.page.locator('id=' + copys['ciudad_origen'])).click({ delay: this.playwrightHelper.getRandomDelay() })
            await this.playwrightHelper.takeScreenshot('ciudad-origen');
            await this.page.waitForTimeout(2000);
        }
        catch (error) {
            console.error("HOME => Ocurrió un error al seleccionar la ciudad de origen ", error);
            throw error;
        }
    }

    private async selectReturnOption(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            const lang = this.playwrightHelper.getLang();
            await expect(this.page.getByPlaceholder(copys[lang].destino)).toBeVisible();
            const destino = this.page.getByPlaceholder(copys[lang].destino);
            await destino.click({ delay: this.playwrightHelper.getRandomDelay() });
            await destino.fill(copys['ciudad_destino'], { delay: this.playwrightHelper.getRandomDelay() });
            await destino.press('Enter');
            await (this.page.locator('id=' + copys['ciudad_destino'])).click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.playwrightHelper.takeScreenshot('04-ciudad-destino');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al selecionar la ciudad de destino ", error);
            throw error;
        }
    }

    private async selectDepartureDate(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            await this.page.waitForSelector("#departureInputDatePickerId");
            const fechaIda = await this.page.locator('id=departureInputDatePickerId');
            fechaIda.click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.page.locator('span').filter({ hasText: copys['fecha_salida'] }).click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.playwrightHelper.takeScreenshot('seleccion-fecha-ida');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al seleccionar la fecha de ida, Error: ", error)
            throw error;
        }
    }

    private async selectReturnDate(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            await this.page.waitForTimeout(3000);
            await this.page.locator('span').filter({ hasText: copys['fecha_llegada'] }).click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.playwrightHelper.takeScreenshot('seleccion-fecha-vuelta');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al seleccionar la fecha de regreso, Error: ", error);
            throw error;
        }
    }

    private async selectPassengers(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            await this.page.getByRole('button', { name: '' }).nth(1).click();
            await this.page.getByRole('button', { name: '' }).nth(2).click();
            await this.page.getByRole('button', { name: '' }).nth(3).click();
            const confirmar = await this.page.locator('div#paxControlSearchId > div > div:nth-of-type(2) > div > div > button')
            confirmar.click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.playwrightHelper.takeScreenshot('seleccion-pasajeros');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al seleccionar los pasajeros, Error: ", error);
            throw error;
        }
    }

    private async searchFlights(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            const lang = this.playwrightHelper.getLang();
            await expect(this.page.getByRole('button', { name: copys[lang].buscar, exact: true })).toBeVisible();
            await this.page.getByRole('button', { name: copys[lang].buscar, exact: true }).click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.playwrightHelper.takeScreenshot('busqueda-vuelos');
            await this.page.waitForSelector('#pageWrap');
        }
        catch (error) {
            console.error("Home => Ocurrió un error al buscar los vuelos, Error: ", error);
            throw error;
        }
    }

    public async run(): Promise<void> {
        await this.verifyCookies();
        await this.selectOriginOption()
        await this.selectReturnOption();
        await this.selectDepartureDate();
        await this.selectReturnDate();
        await this.selectPassengers();
        await this.searchFlights();
    }
}