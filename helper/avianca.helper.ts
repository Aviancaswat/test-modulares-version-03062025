import type { Browser, BrowserContext, Page, TestInfo } from "@playwright/test";
import { copys } from "../utils/data/copys";
import type { Lang } from "../types/copys.type";

export class AviancaHelper {

    private page: Page | undefined;
    private browser: Browser | undefined;
    private context: BrowserContext | undefined;
    private screenshotCounter: number;

    constructor() {
        this.page = undefined;
        this.browser = undefined;
        this.context = undefined;
        this.screenshotCounter = 0;
    }

    public getTimestamp() {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dd = pad(now.getDate());
        const mm = pad(now.getMonth() + 1);
        const yyyy = now.getFullYear();
        const hh = pad(now.getHours());
        const mi = pad(now.getMinutes());
        const ss = pad(now.getSeconds());
        return `fecha-${dd}-${mm}-${yyyy}_hora-${hh}-${mi}-${ss}`;
    }

    public async takeScreenshot(label: string) {
        if (!this.page) {
            throw new Error("El navegador no ha sido inicializado. Llama al método 'initializeBrowser'");
        }

        try {
            const timestamp = this.getTimestamp();
            const filename = `step${this.screenshotCounter++}-${label}-${timestamp}.png`;
            await this.page.screenshot({
                path: `test-results/${filename}-${Date.now()}.png`,
                fullPage: true
            });

        } catch (error) {
            console.error("Ocurrió un error al tomar la captura");
            throw error;
        }
    };

    public getLang(): Lang {
        return copys.getLang();
    }

    public async initializeBrowser() {
        try {

            const { chromium } = require("playwright-extra");
            this.browser = await chromium.launch({
                headless: true,
                args: [
                    '--disable-http2',
                    '--disable-blink-features=AutomationControlled',
                    '--enable-webgl',
                    '--use-gl=swiftshader',
                    '--enable-accelerated-2d-canvas'
                ]
            });

            this.context = await this.browser?.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                viewport: { width: 1280, height: 720 },
                locale: 'en-US',
                timezoneId: 'America/New_York',
                deviceScaleFactor: 1,
            });

            this.page = await this.context?.newPage();

            await this.page?.addInitScript(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false,
                });
            });

            return this.page;
        }
        catch (error) {
            console.error("Error al inicializar el navegador!", error);
            throw error;
        }
    }

    public async navigationTo() {

        if (!this.page) {
            throw new Error("El navegador no ha sido inicializado. Llama al método 'initializeBrowser'");
        }

        try {
            await this.page.goto('https://www.avianca.com/', {
                waitUntil: "domcontentloaded",
                timeout: 30000
            });
            await this.page.waitForSelector("#searchComponentDiv");
            await this.takeScreenshot("Avianca-home");
        } catch (error) {
            console.log("Ocurrió un error durante la navegación");
            throw error;
        }
    }

    public async closeBrowser() {
        try {
            if (this.page) {
                await this.page.close();
                this.page = undefined;
            }
            if (this.context) {
                await this.context.close();
                this.context = undefined;
            }
            if (this.browser) {
                await this.browser.close();
                this.browser = undefined;
            }
        } catch (error) {
            console.error('Ocurrió un error cerrando el navegador');
            throw error;
        }
    }

    public getPage() {
        if (!this.page) {
            throw new Error("El navegador no ha sido inicializado. Llama al método 'initializeBrowser'");
        }
        return this.page;
    }
}