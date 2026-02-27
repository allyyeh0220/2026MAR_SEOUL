import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const db = new Database('expenses.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    taxRefund TEXT
  )
`);

// Seed data if empty
const count = db.prepare('SELECT count(*) as count FROM expenses').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO expenses (id, title, date, paymentMethod, amount, currency, taxRefund)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const initialData = [
    { id: '1', title: 'AREX 機場快線', date: '2026-03-24', paymentMethod: '信用卡', amount: 13000, currency: 'KRW', taxRefund: '無' },
    { id: '2', title: '豬肉湯飯午餐', date: '2026-03-24', paymentMethod: '現金', amount: 25000, currency: 'KRW', taxRefund: '無' },
    { id: '3', title: '咖啡', date: '2026-03-24', paymentMethod: '行動支付', amount: 12000, currency: 'KRW', taxRefund: '無' },
    { id: '4', title: '行前保險', date: '2026-03-20', paymentMethod: '信用卡', amount: 1200, currency: 'TWD', taxRefund: '無' },
    { id: '5', title: 'Olive Young 採買', date: '2026-03-25', paymentMethod: '信用卡', amount: 150000, currency: 'KRW', taxRefund: '已退稅' },
  ];

  initialData.forEach(item => {
    insert.run(item.id, item.title, item.date, item.paymentMethod, item.amount, item.currency, item.taxRefund);
  });
}

// API Routes
app.get('/api/expenses', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM expenses ORDER BY date DESC');
    const expenses = stmt.all();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', (req, res) => {
  try {
    const { id, title, date, paymentMethod, amount, currency, taxRefund } = req.body;
    const stmt = db.prepare(`
      INSERT INTO expenses (id, title, date, paymentMethod, amount, currency, taxRefund)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, title, date, paymentMethod, amount, currency, taxRefund);
    res.status(201).json({ message: 'Expense created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.put('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, paymentMethod, amount, currency, taxRefund } = req.body;
    const stmt = db.prepare(`
      UPDATE expenses 
      SET title = ?, date = ?, paymentMethod = ?, amount = ?, currency = ?, taxRefund = ?
      WHERE id = ?
    `);
    stmt.run(title, date, paymentMethod, amount, currency, taxRefund, id);
    res.json({ message: 'Expense updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Vite Middleware (for development)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    // (This part is handled by the build system usually, but good to have for completeness if running node server.ts in prod)
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
