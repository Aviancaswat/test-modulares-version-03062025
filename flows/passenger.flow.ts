import { expect, type Page } from "@playwright/test";
import { PageBase } from "../classes/page.abstract";
import { PlaywrightHelper } from "../helper/playwright.helper";
import { MESSAGES_PLAYWRIGHT as m } from "../global.variables";

export class PassengerAvianca implements PageBase {
    private page: Page | undefined | any;
    private playwrightHelper: PlaywrightHelper;

    constructor(page: Page | undefined | any) {
        this.page = page;
        this.playwrightHelper = new PlaywrightHelper(page);
    }

    private async fillFormValuesDefaults(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            await this.page.waitForSelector(".passenger_data_group");
            await this.playwrightHelper.takeScreenshot("inicio-llenado-form-pasajeros");
            await this.page.evaluate(() => {
                const userNamesData: Array<string> = [
                    "john doe",
                    "jane smith",
                    "alexander wilson",
                    "maria gomez",
                    "roberto perez",
                    "lucia martinez",
                    "david hernandez",
                    "carla jones",
                    "luis vega",
                    "susan brown"
                ];

                const lastNamesData: Array<string> = [
                    "Doe",
                    "Smith",
                    "Wilson",
                    "Gomez",
                    "Perez",
                    "Martinez",
                    "Hernandez",
                    "Jones",
                    "Vega",
                    "Brown"
                ];

                const emailsData: Array<string> = [
                    "monitoreo.digital@avianca.com"
                ];

                const phoneNumbersData: Array<string> = [
                    "123456",
                    "987654",
                    "654321",
                    "321654",
                    "987123",
                    "456789",
                    "102938",
                    "112233",
                    "778899",
                    "334455"
                ];

                const getDataRandom = (data: Array<string> = []): string => {
                    return data[Math.floor(Math.random() * data.length)];
                }

                const getValueElement = (element: HTMLInputElement): string => {
                    let value: string | null = null;
                    if (element.name === "email" || element.name === "confirmEmail") {
                        value = getDataRandom(emailsData);
                    }
                    else if (element.name === "phone_phoneNumberId") {
                        value = getDataRandom(phoneNumbersData);
                    }
                    else if (element.id.includes("IdFirstName")) {
                        value = getDataRandom(userNamesData);
                    }
                    else {
                        value = getDataRandom(lastNamesData);
                    }
                    return value;
                }

                const getButtonAndClickItem = () => {
                    const listOptions = document.querySelector(".ui-dropdown_list");
                    const buttonElement = listOptions?.querySelector(".ui-dropdown_item>button") as HTMLButtonElement;
                    buttonElement.click();
                }

                const setValuesDefaultAutoForm = async () => {
                    const elements = document.querySelectorAll('.ui-input');
                    Array.from(elements).forEach((element) => {
                        if (element.tagName === "BUTTON") {
                            const elementButton = element as HTMLButtonElement;
                            elementButton.click();
                            const listOptions = document.querySelector(".ui-dropdown_list");
                            (listOptions?.querySelector(".ui-dropdown_item>button") as HTMLButtonElement)?.click();

                            if (element.id === "passengerId") {
                                elementButton.click();
                                setTimeout(() => {
                                    getButtonAndClickItem();
                                }, 1000);
                            }
                            else if (element.id === 'phone_prefixPhoneId') {
                                setTimeout(() => {
                                    elementButton.click();
                                    getButtonAndClickItem();
                                }, 1000);
                            }
                            else {
                                const checkAccept = document.querySelector('#acceptNewCheckbox') as HTMLButtonElement;
                                checkAccept.click();
                                elementButton.click();
                                getButtonAndClickItem();
                            }
                        }
                        else if (element.tagName === "INPUT") {
                            const elementInput = element as HTMLInputElement;
                            const containers = document.querySelectorAll(".ui-input-container");
                            Array.from(containers).forEach(e => { e.classList.add("is-focused") });
                            let eventBlur: Event = new Event("blur");
                            let eventFocus: Event = new Event("focus");
                            elementInput.value = getValueElement(elementInput);
                            ['change', 'input'].forEach(event => {
                                let handleEvent = new Event(event, { bubbles: true, cancelable: false });
                                element.dispatchEvent(handleEvent);
                            });

                            element.dispatchEvent(eventFocus);
                            setTimeout(() => {
                                element.dispatchEvent(eventBlur);
                                Array.from(containers).forEach(e => { e.classList.remove("is-focused") });
                            }, 1000);
                        }
                    });

                    await this.page.waitForSelector("id=acceptNewCheckbox");
                    await expect(this.page.locator('id=acceptNewCheckbox')).toBeVisible();
                    await (this.page.locator('id=acceptNewCheckbox')).click()

                }
                setValuesDefaultAutoForm();
            });
            await this.playwrightHelper.takeScreenshot("fin-llenado-form-pasajeros");
        }
        catch (error) {
            console.error("PASSENGER => Ocurrió un error al generar los datos aleatorios en formulario de pasajeros. Error: ", error);
            throw error;
        }
    }

    private async continueToServices(): Promise<void> {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {

            await this.page.waitForTimeout(2000);
            await expect(this.page.locator(".button.page_button.btn-action").last()).toBeVisible();
            await this.page.locator(".button.page_button.btn-action").last().click({ delay: this.playwrightHelper.getRandomDelay() });
            await this.page.waitForSelector(".main-banner--section-offer", { timeout: 100_000 });
        }
        catch (error) {
            console.error("PASSENGER => Ocurrió un error al click en continuar en servicios. Error: ", error);
            throw error;
        }
    }

    public async run(): Promise<void> {
        await this.fillFormValuesDefaults();
        await this.continueToServices();
    }
}