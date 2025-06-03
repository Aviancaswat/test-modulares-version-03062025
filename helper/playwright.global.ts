import { Page, TestInfo } from "@playwright/test";
import type { Lang } from "../types/copys.type";
import { copys } from "../utils/data/copys";

export class PlaywrightGlobal {

    private page: Page;
    private testInfo: TestInfo;
    private numberStep: number;

    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.numberStep = 0;
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
        this.numberStep++;
        const timestamp = this.getTimestamp();
        const name = `step${this.numberStep}-${label}-${timestamp}.png`;
        const buffer = await this.page.screenshot({ path: name });
        await this.testInfo.attach(`${label} (${timestamp})`, {
            body: buffer,
            contentType: 'image/png',
        });
    };

    public getLang(): Lang {
        return copys.getLang();
    }
}