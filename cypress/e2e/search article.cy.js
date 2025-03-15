describe('E2E Test für Produktsuche', () => {
  it('soll ein MacBook suchen, zur Detailseite navigieren und in den Einkaufswagen legen', () => {
    // Öffne die Seite
    cy.visit('http://localhost:4200');

    // Suche nach dem "Search Products" Button und klicke darauf
    cy.get('a[routerlink="/products"]').click();

    // Sucheingabe für "MacBook"
    cy.get('input[type="text"]').type('MacBook{enter}'); // {enter} simuliert Enter-Taste

    // Warte auf die Ergebnisse und wähle das MacBook aus
    cy.contains('h3', 'MacBook Pro').click();

    // Klicke auf das Kalender-Icon (angepasster Selector je nach Implementierung)
    cy.get('button[aria-label="Open calendar"]').click();

    // Heutigen Tag und anschließend zwei Tage später anklicken
    cy.get('.mat-calendar-body-today').click(); // Klickt auf das heutige Datum
    const today = new Date();
    const twoDaysLater = today.getDate() + 2;
    cy.get('.mat-calendar-body-cell-content').contains(twoDaysLater).click();

    // Add to cart anklicken
    cy.get('button').contains('Add to Cart').click();
  });
});
