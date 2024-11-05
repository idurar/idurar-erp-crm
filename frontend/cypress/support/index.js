beforeEach(() => {
    cy.readFile('cypress/fixtures/cookies.json').then(cookies => {
      cookies.forEach(cookie => {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expiry,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure
        });
      });
    });
  });