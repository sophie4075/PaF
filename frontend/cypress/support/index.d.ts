declare namespace Cypress {
    interface Chainable<Subject = any> {
        saveLocalStorage(): Chainable<any>;
        restoreLocalStorage(): Chainable<any>;
    }
}
