require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const storeOwnerRoutes = require('./routes/storeOwner');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', userRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

// Generic error handler (catches anything thrown that wasn't handled inline)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // sync({ alter: true }) will create/update tables to match your models.
    // Fine for development. For production you'd normally use migrations
    // instead, but alter:true is OK for a deadline-driven challenge.
    await sequelize.sync({ alter: true });
    console.log('Models synced.');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();