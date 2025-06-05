import { test } from '@playwright/test';
import { AviancaCore } from '../helper/avianca.core';
import { HomeAvianca } from '../flows/home.flow';
import { FlightsAvianca } from '../flows/flights.flow';
import { PassengerAvianca } from '../flows/passenger.flow';
import { ServicesAvianca } from '../flows/services.flow';
import { SeatsAvianca } from '../flows/seat.flows';
import { PaymentAvianca } from '../flows/payment.flow';

test.describe('End to End in Avianca', () => {

    let aviancaCore: AviancaCore;
    let homeAvianca: HomeAvianca | null;
    let flightsAvianca: FlightsAvianca | null;
    let passengerAvianca: PassengerAvianca | null;
    let servicesAvianca: ServicesAvianca | null;
    let seatAvianca: SeatsAvianca | null;
    let paymentAvianca: PaymentAvianca | null;

    test.beforeEach(async () => {
        aviancaCore = new AviancaCore();
        await aviancaCore.initializeBrowser();
        const page = aviancaCore.getPage();

        if (page) {
            homeAvianca = new HomeAvianca(page);
            flightsAvianca = new FlightsAvianca(page);
            passengerAvianca = new PassengerAvianca(page);
            servicesAvianca = new ServicesAvianca(page);
            seatAvianca = new SeatsAvianca(page);
            // paymentAvianca = new PaymentAvianca(page);
        }
    });

    test.afterEach(async () => {
        await aviancaCore.closeBrowser();
        homeAvianca = null;
        flightsAvianca = null;
        passengerAvianca = null;
        servicesAvianca = null;
        seatAvianca = null;
        // paymentAvianca = null;
    });

    test('Home => Payments', async ({ }) => {
        await aviancaCore.initTests();
        await homeAvianca?.run();
        await flightsAvianca?.run();
        await passengerAvianca?.run();
        await servicesAvianca?.run();
        await seatAvianca?.run();
        // await paymentAvianca?.run();
    });
});