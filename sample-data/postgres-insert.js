const { listings, reservations, dailyPrices } = require('./generator');
const {
  insertListing,
  insertReservation,
  insertPrice,
  closeConnection,
} = require('./insert-helpers');

// insert into Postgres database
listings.forEach(listing => insertListing(listing));
console.log(`${listings.length} listings loaded!`);

reservations.forEach(reservation => insertReservation(reservation));
console.log(`${reservations.length} reservations loaded!`);

dailyPrices.forEach((price, index) => {
  insertPrice(price);
  if (index === dailyPrices.length - 1) {
    closeConnection();
  }
});
console.log(`${dailyPrices.length} daily prices loaded!`);
console.log('all sample data generated');

// setTimeout(insertHelpers.closeConnection, 3000);