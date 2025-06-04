import { test } from '@playwright/test';
import { AviancaCore } from '../helper/avianca.core';
import { HomeAvianca } from '../flows/home.flow';
import { FlightsAvianca } from '../flows/flights.flow';

test.describe('End to End in Avianca', () => {

    let aviancaCore: AviancaCore;
    let homeAvianca: HomeAvianca;
    let flightsAvianca: FlightsAvianca;

    test.beforeEach(async () => {
        aviancaCore = new AviancaCore();
        await aviancaCore.initializeBrowser();
        const page = aviancaCore.getPage();
        if (page) {
            homeAvianca = new HomeAvianca(page);
            flightsAvianca = new FlightsAvianca(page);
        }
    });

    test.afterEach(async () => {
        await aviancaCore.closeBrowser();
    });

    test('Home => Payments', async ({ }) => {
        await aviancaCore.navigationTo();
        await homeAvianca.run();
        await flightsAvianca.run();
    });
});