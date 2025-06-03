import { test } from '@playwright/test';
import { AviancaHelper } from '../helper/avianca.helper';

test.describe('End to End in Avianca', () => {

    let aviancaHelper: AviancaHelper;

    test.beforeEach(async () => {
        aviancaHelper = new AviancaHelper();
        await aviancaHelper.initializeBrowser();
    });

    test.afterEach(async () => {
        await aviancaHelper.closeBrowser();
    });

    test('Home => Payments', async ({ }) => {
        await aviancaHelper.navigationTo();
    });
});