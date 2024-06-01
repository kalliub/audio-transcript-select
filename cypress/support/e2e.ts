// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      downloadFile(
        url: string,
        folder: string,
        filename: string,
      ): Chainable<void>;
    }
  }
}

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-fixture-faker";
import "cypress-real-events";
require("cypress-downloadfile/lib/downloadFileCommand");

// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.on("uncaught:exception", (err) => {
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #423/.test(err.message)
  ) {
    return false;
  }
  return true;
  // Enable uncaught exception failures for other errors
});
