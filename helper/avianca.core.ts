import type { Browser, BrowserContext, Page } from "@playwright/test";
import { GLOBAL_PLAYWRIGHT as g, MESSAGES_PLAYWRIGHT as m} from "../global.variables";
import { PlaywrightHelper } from "./playwright.helper";

export class AviancaCore {

    private page: Page | undefined;
    private browser: Browser | undefined;
    private context: BrowserContext | undefined;
    private playwrightHelper: PlaywrightHelper;

    constructor() {
        this.page = undefined;
        this.browser = undefined;
        this.context = undefined;
    }

    public async initializeBrowser() {

        try {

            const { chromium } = require("playwright-extra");
            this.browser = await chromium.launch({
                headless: g.headless,
                args: [
                    '--disable-http2',
                    '--enable-webgl',
                    '--use-gl=swiftshader',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1280,720',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-features=VizDisplayCompositor',
                    '--disable-ipc-flooding-protection',
                    '--disable-renderer-backgrounding',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-field-trial-config',
                    '--disable-back-forward-cache',
                    '--enable-features=NetworkService,NetworkServiceLogging',
                    '--disable-extensions',
                    '--force-color-profile=srgb',
                    '--metrics-recording-only',
                    '--no-first-run',
                    '--enable-automation=false',
                    '--password-store=basic',
                    '--use-mock-keychain'
                ]
            });

            this.context = await this.browser?.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                viewport: { width: 1280, height: 720 },
                locale: 'en-US',
                timezoneId: 'America/New_York',
                deviceScaleFactor: 1,
                hasTouch: false,
                isMobile: false,
                javaScriptEnabled: true,
                permissions: [],
                extraHTTPHeaders: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Cache-Control': 'max-age=0'
                }
            });

            this.page = await this.context?.newPage();

            await this.page?.addInitScript(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false,
                });

                delete (window as any).chrome.runtime.onConnect;

                (window as any).chrome = {
                    runtime: {},
                    loadTimes: function () {
                        return {
                            commitLoadTime: Date.now() - Math.random() * 1000,
                            finishDocumentLoadTime: Date.now() - Math.random() * 1000,
                            finishLoadTime: Date.now() - Math.random() * 1000,
                            firstPaintAfterLoadTime: Date.now() - Math.random() * 1000,
                            firstPaintTime: Date.now() - Math.random() * 1000,
                            navigationType: 'navigate',
                            wasFetchedViaSpdy: false,
                            wasNpnNegotiated: false
                        };
                    },
                    csi: function () {
                        return {
                            startE: Date.now() - Math.random() * 1000,
                            onloadT: Date.now() - Math.random() * 1000,
                            pageT: Date.now() - Math.random() * 1000
                        };
                    }
                };

                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5],
                });

                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en'],
                });
            });

            if (this.page) {
                this.playwrightHelper = new PlaywrightHelper(this.page);
            }

            return this.page;
        }
        catch (error) {
            console.error("Error al inicializar el navegador!", error);
            throw error;
        }
    }

    public async navigationTo() {

        if (!this.page) {
            throw new Error(m.errors.initializated);
        }

        try {
            await this.page.goto('https://www.avianca.com/', {
                waitUntil: "domcontentloaded",
                timeout: 60000
            });
            await this.page.waitForSelector("#searchComponentDiv");
            await this.playwrightHelper.takeScreenshot("Avianca-home");
        } catch (error) {
            console.log("Ocurrió un error durante la navegación: ", error);
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