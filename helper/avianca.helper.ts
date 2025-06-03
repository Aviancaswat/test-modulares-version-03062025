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

            // Scripts más avanzados para evitar detección
            await this.page?.addInitScript(() => {
                // Eliminar webdriver property
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined,
                });

                // Eliminar automation flags
                delete (window as any).chrome.runtime.onConnect;
                
                // Mock chrome object
                (window as any).chrome = {
                    runtime: {},
                    loadTimes: function() {
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
                    csi: function() {
                        return {
                            startE: Date.now() - Math.random() * 1000,
                            onloadT: Date.now() - Math.random() * 1000,
                            pageT: Date.now() - Math.random() * 1000
                        };
                    }
                };

                // Override plugins
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5],
                });

                // Override languages
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en'],
                });

                // Override permissions
                // const originalQuery = window.navigator.permissions.query;
                // window.navigator.permissions.query = (parameters) => (
                //     parameters.name === 'notifications' ?
                //         Promise.resolve({ state: Notification.permission }) :
                //         originalQuery(parameters)
                // );
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