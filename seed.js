const { User, Category, LotStatus, Lot, Bid, BidHistory } = require('./models');

async function seed() {
  const [draft, active, sold] = await Promise.all(
    ['draft', 'active', 'sold'].map((name) => LotStatus.create({ name }))
  );
  await LotStatus.create({ name: 'expired' });
  await LotStatus.create({ name: 'cancelled' });

  const antiques = await Category.create({ name: 'Антикваріат', description: 'Старовинні речі' });
  const tech = await Category.create({ name: 'Техніка', description: 'Електроніка та гаджети' });

  const seller = await User.create({ username: 'seller1', email: 'seller@mail.com', passwordHash: 'hash1' });
  const bidder1 = await User.create({ username: 'ivan', email: 'ivan@mail.com', passwordHash: 'hash2' });
  const bidder2 = await User.create({ username: 'olena', email: 'olena@mail.com', passwordHash: 'hash3' });

  const lot = await Lot.create({
    title: 'Старовинний годинник',
    description: 'Настінний годинник, 1930-ті роки',
    startPrice: 100, currentPrice: 150, minStep: 10,
    startTime: new Date(), endTime: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    sellerId: seller.id, categoryId: antiques.id, statusId: active.id,
  });

  await Lot.create({
    title: 'MacBook Pro 2019',
    startPrice: 500, currentPrice: 500, minStep: 20,
    startTime: new Date(), endTime: new Date(Date.now() + 3 * 24 * 3600 * 1000),
    sellerId: seller.id, categoryId: tech.id, statusId: draft.id,
  });

  const bid1 = await Bid.create({ amount: 120, lotId: lot.id, userId: bidder1.id });
  await BidHistory.create({ eventType: 'PLACED', amount: 120, bidId: bid1.id, lotId: lot.id, userId: bidder1.id });

  const bid2 = await Bid.create({ amount: 150, lotId: lot.id, userId: bidder2.id });
  await BidHistory.create({ eventType: 'PLACED', amount: 150, bidId: bid2.id, lotId: lot.id, userId: bidder2.id });
  await BidHistory.create({ eventType: 'OUTBID', amount: 120, bidId: bid1.id, lotId: lot.id, userId: bidder1.id });
}

module.exports = seed;