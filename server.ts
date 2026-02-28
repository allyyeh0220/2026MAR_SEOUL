import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { itineraryData } from './src/data/itinerary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve uploads statically
app.use('/uploads', express.static('uploads'));

// Database Setup
const db = new Database('expenses.db'); // Using the same DB file for simplicity
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    paymentMethod TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    taxRefund TEXT
  );

  CREATE TABLE IF NOT EXISTS itinerary (
    id TEXT PRIMARY KEY,
    day INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    data TEXT NOT NULL
  );
`);

// Seed expenses if empty
const expenseCount = db.prepare('SELECT count(*) as count FROM expenses').get() as { count: number };
if (expenseCount.count === 0) {
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

// Seed itinerary if empty
const itineraryCount = db.prepare('SELECT count(*) as count FROM itinerary').get() as { count: number };
if (itineraryCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO itinerary (id, day, sort_order, data)
    VALUES (?, ?, ?, ?)
  `);

  itineraryData.forEach(daySchedule => {
    daySchedule.items.forEach((item, index) => {
      insert.run(item.id, daySchedule.day, index, JSON.stringify(item));
    });
  });
}

// API Routes - Upload
app.post('/api/upload', upload.array('photos', 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// API Routes - Expenses
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

// API Routes - Itinerary
app.get('/api/itinerary', (req, res) => {
  try {
    // Get all items ordered by day and sort_order
    const stmt = db.prepare('SELECT * FROM itinerary ORDER BY day ASC, sort_order ASC');
    const rows = stmt.all() as { id: string, day: number, sort_order: number, data: string }[];
    
    // Parse JSON data
    const items = rows.map(row => {
      const data = JSON.parse(row.data);
      return {
        ...data,
        day: row.day, // Ensure day is consistent
        sortOrder: row.sort_order
      };
    });
    
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});

app.post('/api/itinerary', (req, res) => {
  try {
    const { day, item } = req.body;
    // Get max sort_order for this day
    const maxOrderStmt = db.prepare('SELECT MAX(sort_order) as maxOrder FROM itinerary WHERE day = ?');
    const result = maxOrderStmt.get(day) as { maxOrder: number | null };
    const nextOrder = (result.maxOrder ?? -1) + 1;

    const stmt = db.prepare(`
      INSERT INTO itinerary (id, day, sort_order, data)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(item.id, day, nextOrder, JSON.stringify(item));
    res.status(201).json({ message: 'Itinerary item created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create itinerary item' });
  }
});

app.put('/api/itinerary/reorder', (req, res) => {
  try {
    const { day, itemIds } = req.body; // itemIds is array of strings in new order
    
    const updateStmt = db.prepare('UPDATE itinerary SET sort_order = ? WHERE id = ? AND day = ?');
    
    const transaction = db.transaction((ids: string[]) => {
      ids.forEach((id, index) => {
        updateStmt.run(index, id, day);
      });
    });
    
    transaction(itemIds);
    res.json({ message: 'Itinerary reordered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder itinerary' });
  }
});

app.put('/api/itinerary/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { item } = req.body; // Updated item object
    
    // We update the data blob. We assume day doesn't change via this endpoint usually, 
    // but if it did, we'd need to handle sort_order. For now, assume simple edit.
    
    const stmt = db.prepare(`
      UPDATE itinerary 
      SET data = ?
      WHERE id = ?
    `);
    
    stmt.run(JSON.stringify(item), id);
    res.json({ message: 'Itinerary item updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update itinerary item' });
  }
});

app.delete('/api/itinerary/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM itinerary WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Itinerary item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete itinerary item' });
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
