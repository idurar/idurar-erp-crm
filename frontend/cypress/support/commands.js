// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.visit('https://cloud.idurarapp.com/login');
  cy.wait(1000);

  cy.xpath(
    '/html/body/div/div/div/div[2]/main[2]/div[3]/div/div/form/div[1]/div[1]/div[1]/div[2]/div[1]/div/span/input'
  ).type('navarrrocmo@gmail.com');

  cy.get('input[id="normal_login_password"]').type('qa123456');
  cy.xpath(
    '/html/body/div/div/div/div[2]/main/div[3]/div/div/form/div[2]/div/div/div/div/button'
  ).click();
  cy.wait(1000);

  // Guarda las cookies
  cy.getCookies().then((cookies) => {
    cy.writeFile('cypress/fixtures/cookies.json', cookies);
  });
});
