const { calculatePartnerDiscount } = require('../business-core-development/discount');

function getPartnersWithDiscount(db) {
  const rows = db.prepare(`
    SELECT
      p.id,
      p.partner_type,
      p.name,
      p.director,
      p.phone,
      p.rating,
      COALESCE(SUM(s.quantity), 0) AS total_quantity
    FROM partners p
    LEFT JOIN sales_history s ON s.partner_id = p.id
    GROUP BY p.id
    ORDER BY p.id
  `).all();

  return rows.map((row) => ({
    id: row.id,
    partnerType: row.partner_type,
    name: row.name,
    director: row.director,
    phone: row.phone,
    rating: row.rating,
    totalQuantity: Number(row.total_quantity) || 0,
    discountPercent: calculatePartnerDiscount(Number(row.total_quantity) || 0),
  }));
}

function getPartnerWithDiscount(db, partnerId) {
  const row = db.prepare(`
    SELECT
      p.id,
      p.partner_type,
      p.name,
      p.director,
      p.phone,
      p.rating,
      COALESCE(SUM(s.quantity), 0) AS total_quantity
    FROM partners p
    LEFT JOIN sales_history s ON s.partner_id = p.id
    WHERE p.id = ?
    GROUP BY p.id
  `).get(partnerId);

  if (!row) return null;

  const totalQuantity = Number(row.total_quantity) || 0;
  return {
    id: row.id,
    partnerType: row.partner_type,
    name: row.name,
    director: row.director,
    phone: row.phone,
    rating: row.rating,
    totalQuantity,
    discountPercent: calculatePartnerDiscount(totalQuantity),
  };
}

module.exports = { getPartnersWithDiscount, getPartnerWithDiscount };
