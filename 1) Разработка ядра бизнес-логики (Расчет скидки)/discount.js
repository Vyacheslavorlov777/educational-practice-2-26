function calculatePartnerDiscount(totalQuantity) {
  if (!Number.isFinite(totalQuantity)) throw new TypeError('totalQuantity must be a finite number');
  if (totalQuantity < 0) throw new RangeError('totalQuantity cannot be negative');
  if (totalQuantity < 10000) return 0;
  if (totalQuantity < 50000) return 5;
  if (totalQuantity < 300000) return 10;
  return 15;
}

module.exports = { calculatePartnerDiscount };
