const test = require('node:test');
const assert = require('node:assert/strict');
const { calculatePartnerDiscount } = require('./discount');

test('below 10000 gives no discount', () => {
  assert.equal(calculatePartnerDiscount(0), 0);
  assert.equal(calculatePartnerDiscount(9999), 0);
});

test('10000 to 49999 gives 5 percent', () => {
  assert.equal(calculatePartnerDiscount(10000), 5);
  assert.equal(calculatePartnerDiscount(49999), 5);
});

test('50000 to 299999 gives 10 percent', () => {
  assert.equal(calculatePartnerDiscount(50000), 10);
  assert.equal(calculatePartnerDiscount(299999), 10);
});

test('300000 and above gives 15 percent', () => {
  assert.equal(calculatePartnerDiscount(300000), 15);
  assert.equal(calculatePartnerDiscount(1000000), 15);
});

test('rejects negative values', () => {
  assert.throws(() => calculatePartnerDiscount(-1), RangeError);
});

test('rejects non numeric input', () => {
  assert.throws(() => calculatePartnerDiscount(NaN), TypeError);
  assert.throws(() => calculatePartnerDiscount('10000'), TypeError);
});
