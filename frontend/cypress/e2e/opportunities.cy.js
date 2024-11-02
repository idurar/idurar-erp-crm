

describe('template spec', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    // Bloque para loguearse
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

    // Aquí se ingresa al modulo de oportunidades
    cy.xpath('/html/body/div[1]/div/aside/div/ul/li[5]').click();
    cy.wait(1000);
    // Aquí se le clickea al botón de crear oportunidad
    cy.xpath('/html/body/div[1]/div/div/main/main/div[1]/div/span/div/div[3]/button').click();
  });


  it('Deberia Insertar la Oportunidad', () => {

    // Primer Campo - Branch
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[1]/div/div[2]/div/div/div/div/span[1]/input'
    ).click();
    cy.xpath('/html/body/div[4]/div/div/div[2]/div/div/div/div/div').click();

    // Segundo Campo - Tipo de Oportunidad
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[2]/div/div[2]/div/div/div/div/span[1]/input'
    ).click();
    cy.xpath('/html/body/div[5]/div/div/div[2]/div/div/div/div[1]/div').click();

    // Tercer Campo - Nombre
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[3]/div/div[2]/div/div/input'
    ).type('Ejemplo');

    // Cuarto Campo - Estado
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[4]/div/div[2]/div/div/div/div/span[1]/input'
    ).click();

    cy.wait(200);

    cy.xpath('/html/body/div[6]/div/div/div[2]/div[1]/div/div/div[1]/div').click();
    // cy.get('span').contains('Perdido').click();// Esto se puede cambiar por cualquier otro estado

    // Quinto Campo - Fuente
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[5]/div/div[2]/div/div/div/div/span[1]/input'
    ).click();

    cy.xpath('/html/body/div[7]/div/div/div[2]/div[1]/div/div/div[4]/div').click();

    // cy.get('span').contains('Ventas').click();

    // Sexto Campo - Pais
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[6]/div/div[2]/div/div/div/div/span[1]/input'
    ).click();
    // cy.get('div').contains('Andorra').click();

    cy.wait(200);
    cy.xpath('/html/body/div[8]/div/div/div[2]/div[1]/div/div/div[2]').click();

    // Septimo Campo - Telefono

    //Codigo de Area
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[7]/div/div[2]/div/div/div/div[1]/div/div/div/div/div/div/span[1]/input'
    ).click();

    // cy.xpath('/html/body/div[9]/div/div/div[2]/div[1]/div/div/div[3]/div').click();

    //buscar el codigo por texto
    cy.xpath('/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[7]/div/div[2]/div/div/div/div[1]/div/div/div/div/div/div/span[1]/input')
      .type('+506')

    cy.get('.ant-select-item-option-content').contains('+506').click();

    //Numero de Telefono
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[7]/div/div[2]/div/div/div/div[2]/div/div/div/div/input'
    ).type('85364610');

    // Octavo Campo - Email
    cy.xpath(
      '/html/body/div[3]/div/div[3]/div/div[2]/div/div[3]/div[3]/div/div/div/div/div/form/div[1]/div[8]/div/div[2]/div/div/input'
    ).type('navarrrocmo@gmail.com');

    cy.get('button').contains('Enviar').click();
  });
});
