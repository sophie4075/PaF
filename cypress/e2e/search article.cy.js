describe('E2E Test for Product Search', () => {
  it('should search for a MacBook, navigate to the detail page, and add it to the cart', () => {
    // Open the page
    cy.visit('http://localhost:4200');

    // Find the "Search Products" button and click on it
    cy.get('a[routerlink="/products"]').click();

    // Enter "MacBook" in the search input
    cy.get('input[type="text"]').type('MacBook{enter}'); // {enter} simulates pressing Enter

    // Wait for the results and select the MacBook
    cy.contains('h3', 'MacBook Pro').click();

    // Click on the calendar icon (adjust selector as needed)
    cy.get('button[aria-label="Open calendar"]').click();

    // Select today's date and then two days later
    cy.get('.mat-calendar-body-today').click(); // Clicks on today's date
    const today = new Date();
    const twoDaysLater = today.getDate() + 2;
    cy.get('.mat-calendar-body-cell-content').contains(twoDaysLater).click();

    // Click "Add to Cart"
    cy.get('button').contains('Add to Cart').click();
  });
});
