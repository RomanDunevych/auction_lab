const express = require('express');
const { sequelize, User, Category, LotStatus, Lot, Bid, BidHistory } = require('./models');
const seed = require('./seed');

const app = express();
app.use(express.json());
app.set('json spaces', 2);

app.get('/', (req, res) => res.send('Auction API works'));

app.get('/lots', async (req, res) => {
  const lots = await Lot.findAll({
    include: [
      { model: User, as: 'seller', attributes: ['id', 'username'] },
      { model: Category, as: 'category' },
      { model: LotStatus, as: 'status' },
      { model: Bid, as: 'bids', include: [{ model: User, as: 'bidder', attributes: ['id', 'username'] }] },
    ],
  });
  res.json(lots);
});

app.get('/bid-history', async (req, res) => {
  const history = await BidHistory.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'username'] },
      { model: Lot, as: 'lot', attributes: ['id', 'title'] },
    ],
    order: [['createdAt', 'ASC']],
  });
  res.json(history);
});

(async () => {
  await sequelize.sync({ force: true }); // перестворює таблиці при кожному запуску
  await seed();
  app.listen(3000, () => console.log('Server: http://localhost:3000'));
})();