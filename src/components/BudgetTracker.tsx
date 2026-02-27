import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Trash2, Wallet, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Expense {
  id: string;
  item: string;
  amount: number;
  currency: 'KRW' | 'TWD';
  category: string;
  date: any;
}

export function BudgetTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [currency, setCurrency] = useState<'KRW' | 'TWD'>('KRW');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if firebase config is present by checking a required env var
    if (!import.meta.env.VITE_FIREBASE_API_KEY) {
      setError("Firebase not configured. Please add API keys to .env to use the Budget Tracker.");
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      setExpenses(items);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("Could not connect to database.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem || !newAmount) return;

    try {
      await addDoc(collection(db, 'expenses'), {
        item: newItem,
        amount: parseFloat(newAmount),
        currency,
        category: 'General',
        date: new Date()
      });
      setNewItem('');
      setNewAmount('');
    } catch (err) {
      alert("Error adding expense. Check console.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
      await deleteDoc(doc(db, 'expenses', id));
    }
  };

  const totalKRW = expenses.filter(e => e.currency === 'KRW').reduce((sum, e) => sum + e.amount, 0);
  const totalTWD = expenses.filter(e => e.currency === 'TWD').reduce((sum, e) => sum + e.amount, 0);

  if (error) {
    return (
      <div className="p-6 text-center text-k-coffee/50 bg-white rounded-3xl border border-dashed border-k-coffee/20">
        <Wallet className="w-12 h-12 mx-auto mb-2 text-k-coffee/20" />
        <p>{error}</p>
        <p className="text-xs mt-2">請在 .env 設定 Firebase 以啟用此功能。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-k-coffee/5">
          <p className="text-[10px] text-k-coffee/50 uppercase tracking-widest font-bold">總支出 (韓元)</p>
          <p className="text-2xl font-bold text-k-coffee mt-1" style={{ fontFamily: '"Microsoft JhengHei", sans-serif' }}>₩{totalKRW.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-k-coffee/5">
          <p className="text-[10px] text-k-coffee/50 uppercase tracking-widest font-bold">總支出 (台幣)</p>
          <p className="text-2xl font-bold text-k-coffee mt-1" style={{ fontFamily: '"Microsoft JhengHei", sans-serif' }}>${totalTWD.toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-5 rounded-3xl shadow-sm border border-k-coffee/5 space-y-3">
        <h3 className="font-bold text-k-coffee">新增支出</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="項目 (例如: 午餐)"
            className="flex-1 px-4 py-3 bg-k-cream/30 rounded-2xl border-none focus:ring-1 focus:ring-k-coffee/20 text-k-coffee placeholder:text-k-coffee/30"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="金額"
            className="flex-1 px-4 py-3 bg-k-cream/30 rounded-2xl border-none focus:ring-1 focus:ring-k-coffee/20 text-k-coffee placeholder:text-k-coffee/30"
            value={newAmount}
            onChange={e => setNewAmount(e.target.value)}
          />
          <select
            className="px-3 py-2 bg-k-cream/30 rounded-2xl border-none text-k-coffee font-bold"
            value={currency}
            onChange={(e: any) => setCurrency(e.target.value)}
          >
            <option value="KRW">₩</option>
            <option value="TWD">$</option>
          </select>
          <button
            type="submit"
            className="bg-k-coffee text-white p-3 rounded-2xl hover:bg-k-coffee/90 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-k-coffee/30" /></div>
        ) : expenses.length === 0 ? (
          <p className="text-center text-k-coffee/30 py-8 text-sm">尚未有支出紀錄</p>
        ) : (
          expenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-k-coffee/5"
            >
              <div>
                <p className="font-bold text-k-coffee">{expense.item}</p>
                <p className="text-xs text-k-coffee/40">{new Date(expense.date.seconds * 1000).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-k-coffee" style={{ fontFamily: '"Microsoft JhengHei", sans-serif' }}>
                  {expense.currency === 'KRW' ? '₩' : '$'}{expense.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-k-coffee/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
