import type { Page } from "@playwright/test";
import type { Lang } from "../types/copys.type";
import { copys } from "../utils/data/copys";

export class PlaywrightHelper {

    private page: Page | undefined;
    private screenshotCounter: number;

    constructor(page: Page) {
        this.page = page;
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
            console.error("Ocurrió un error al tomar el screenshot con nombre ", label);
            throw error;
        }
    };

    public getLang(): Lang {
        return copys.getLang();
    }

    public getRandomDelay(): number {
        return Math.random() * (200 - 50) + 50;
    }
}