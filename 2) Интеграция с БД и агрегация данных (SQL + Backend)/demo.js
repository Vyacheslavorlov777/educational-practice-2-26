const { openDatabase, seedIfEmpty } = require('./db');
const { getPartnersWithDiscount } = require('./partnerService');

const db = openDatabase();
seedIfEmpty(db);

const partners = getPartnersWithDiscount(db);
console.log(partners);

db.close();
