import opportunities from '../data/opportunities.json';

describe('template spec', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    // Bloque para loguearse
    cy.visit('https://cloud.idurarapp.com/login');
    cy.wait(2000);

    cy.xpath(
      '/html/body/div/div/div/div[2]/main[2]/div[3]/div/div/form/div[1]/div[1]/div[1]/div[2]/div[1]/div/span/input'
    ).type('navarrrocmo@gmail.com');

    cy.get('input[id="normal_login_password"]').type('qa123456');
    cy.xpath(
      '/html/body/div/div/div/div[2]/main/div[3]/div/div/form/div[2]/div/div/div/div/button'
    ).click();
    cy.wait(1000);
  });

  opportunities.forEach((opportunity, index) => {
    it(`Deberia Insertar la Oportunidad ${index + 1}`, () => {
      cy.visit('https://cloud.idurarapp.com/lead');
      // Aquí se ingresa al modulo de oportunidades
      cy.xpath('/html/body/div[1]/div/aside/div/ul/li[5]').click();
      // T cy.wait(1000);
      // Aquí se le clickea al botón de crear oportunidad
      cy.contains('button.ant-btn-primary', 'Agregar nueva oportunidad').click();

      // Primer Campo - Branch
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[1]/div/div[2]/div/div/div/div/span[1]/input'
      ).click();

      cy.get('div.ant-select-item-option-content')
        .find('span.ant-tag.ant-tag-borderless.css-ax9tsx')
        .contains(opportunity.Branch)
        .click();

      // Segundo Campo - Tipo de Oportunidad
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[2]/div/div[2]/div/div/div/div/span[1]/input'
      ).click();

      cy.get('div.ant-select-item-option-content')
        .find('span.ant-tag.ant-tag-borderless')
        .contains(opportunity.Tipo)
        .click();

      // Tercer Campo - Nombre
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[3]/div/div[2]/div/div/input'
      ).type(opportunity.Nombre);

      // Cuarto Campo - Estado
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[4]/div/div[2]/div/div/div/div/span[1]/input'
      ).click();

      // cy.wait(200);

      cy.get('div.ant-select-item-option-content')
        .find('span.ant-tag.ant-tag-borderless.css-ax9tsx')
        .contains(opportunity.Estado)
        .click();

      // cy.wait(200);

      // Quinto Campo - Fuente
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[5]/div/div[2]/div/div/div/div/span[1]/input'
      ).click();

      cy.get('div.ant-select-item-option-content')
        .find('span.ant-tag.ant-tag-borderless.css-ax9tsx')
        .contains(opportunity.Fuente)
        .click();

      // Sexto Campo - Pais
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[6]/div/div[2]/div/div/div/div/span[1]/input'
      ).click();


      // cy.wait(200);
      cy.get('div.ant-select-item-option-content').contains(opportunity.Pais).click();



      // Septimo Campo - Telefono

      //Codigo de Area
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[7]/div/div[2]/div/div/div/div[1]/div/div/div/div/div/div/span[1]/input'
      ).click();
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[7]/div/div[2]/div/div/div/div[1]/div/div/div/div/div/div/span[1]/input'
      ).type(opportunity.CodigoTelefono);

      cy.get('.ant-select-item-option-content')
        .contains('+' + opportunity.CodigoTelefono)
        .click();

      //Numero de Telefono
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[7]/div/div[2]/div/div/div/div[2]/div/div/div/div/input'
      ).type(opportunity.Telefono);

      // Octavo Campo - Email
      cy.xpath(
        '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[8]/div/div[2]/div/div/input'
      ).type(opportunity.Correo);

      if (opportunity.Status === 'ok') {
        cy.get('button').contains('Enviar').click();
        cy.xpath(
          '/html/body/div[3]/div/div[3]/div/div[2]/div/div[2]/div/div/div/div[2]/div[3]/div[3]/p'
        ).should('have.text', opportunities.Nombre);
      } else {
        cy.get('button').contains('Enviar').click();
        cy.xpath(
          '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[2]/div/div/div/div/button'
        ).should('exist');
      }
    });
  });
});