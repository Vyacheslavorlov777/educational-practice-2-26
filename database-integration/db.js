const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'partners.db');

function openDatabase() {
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partner_type TEXT NOT NULL,
      name TEXT NOT NULL,
      director TEXT,
      phone TEXT,
      rating INTEGER DEFAULT 0
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS sales_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partner_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      sold_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    )
  `);

  return db;
}

function seedIfEmpty(db) {
  const row = db.prepare('SELECT COUNT(*) AS total FROM partners').get();
  if (row.total > 0) return;

  const insertPartner = db.prepare(
    'INSERT INTO partners (partner_type, name, director, phone, rating) VALUES (?, ?, ?, ?, ?)'
  );
  const insertSale = db.prepare(
    'INSERT INTO sales_history (partner_id, quantity) VALUES (?, ?)'
  );

  const partners = [
    { type: 'Дистрибьютор', name: 'Северный Альянс', director: 'Ковалёв А.П.', phone: '+7 223 322 22 32', rating: 9, sales: [120000, 90000, 95000] },
    { type: 'Дилер', name: 'ТоргСервис', director: 'Мельникова О.И.', phone: '+7 495 111 22 33', rating: 7, sales: [8000, 1500] },
    { type: 'Розница', name: 'Кофе Плюс', director: 'Захаров Д.С.', phone: '+7 812 555 44 66', rating: 8, sales: [] },
    { type: 'Дистрибьютор', name: 'ВостокТрейд', director: 'Юсупова Л.Н.', phone: '+7 343 777 88 99', rating: 10, sales: [150000, 160000, 40000] },
  ];

  for (const partner of partners) {
    const result = insertPartner.run(partner.type, partner.name, partner.director, partner.phone, partner.rating);
    const partnerId = Number(result.lastInsertRowid);
    for (const quantity of partner.sales) {
      insertSale.run(partnerId, quantity);
    }
  }
}

module.exports = { openDatabase, seedIfEmpty };
