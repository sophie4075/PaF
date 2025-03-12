import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';
import {NgxCurrencyInputMode, provideEnvironmentNgxCurrency} from "ngx-currency";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(),
        { provide: LOCALE_ID, useValue: 'de-DE' },
        provideEnvironmentNgxCurrency({
            align: "right",
            allowNegative: false,
            decimal: ",",
            precision: 2,
            prefix: "",
            suffix: " €",
            thousands: ".",
            nullable: false,
            min: null,
            max: null,
            inputMode: NgxCurrencyInputMode.Financial
        })
    ]
};
