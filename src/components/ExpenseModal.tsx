import { db } from '../firebase'; // 根據您的目錄結構調整路徑
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";

const fetchExpenses = async () => {
  try {
    // ✅ 新增：從 Firestore 讀取資料
    const q = query(collection(db, "expenses"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setExpenses(data as Expense[]); // 假設您有定義 Expense 型別
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
  }
};

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Wallet, Plus, CreditCard, Banknote, Smartphone, Calendar, Trash2 } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Expense {
  id: string;
  title: string;
  date: string;
  paymentMethod: '信用卡' | '現金' | '行動支付';
  amount: number;
  currency: 'TWD' | 'KRW';
  taxRefund?: '已退稅' | '未退稅' | '無';
}

const EXCHANGE_RATE = 0.024; // 1 KRW = 0.024 TWD

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete, onEdit }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, -50], [1, 0]);
  const deleteButtonOpacity = useTransform(x, [-100, -50], [1, 0]);
  const [isDragging, setIsDragging] = useState(false);

  const amountTWD = expense.currency === 'TWD' ? expense.amount : Math.round(expense.amount * EXCHANGE_RATE);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case '信用卡': return <CreditCard className="w-3 h-3" />;
      case '現金': return <Banknote className="w-3 h-3" />;
      case '行動支付': return <Smartphone className="w-3 h-3" />;
      default: return <CreditCard className="w-3 h-3" />;
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center z-0">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(expense.id);
          }}
          className="w-full h-full flex items-center justify-center text-white"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, { offset, velocity }) => {
          setIsDragging(false);
          if (offset.x < -40 || velocity.x < -500) {
            x.set(-80);
          } else {
            x.set(0);
          }
        }}
        onClick={() => {
          if (!isDragging && x.get() === 0) {
            onEdit(expense);
          }
        }}
        className="relative z-10 bg-white flex items-center justify-between py-4 border-b border-k-coffee/10 cursor-pointer active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-k-cream rounded-full text-k-coffee shrink-0">
            {getPaymentIcon(expense.paymentMethod)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-bold text-k-coffee text-sm">{expense.title}</p>
              {expense.taxRefund === '已退稅' && (
                <span className="text-[9px] font-bold text-white bg-green-500 px-1.5 py-0.5 rounded-full">已退稅</span>
              )}
              {expense.taxRefund === '未退稅' && (
                <span className="text-[9px] font-bold text-white bg-orange-400 px-1.5 py-0.5 rounded-full">未退稅</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-k-coffee/40 font-bold bg-k-coffee/5 px-1.5 py-0.5 rounded-md">
                {expense.date.slice(5)}
              </span>
              <span className="text-[10px] text-k-coffee/50 font-bold tracking-wider">
                {expense.paymentMethod}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-k-coffee" style={{ fontFamily: '"Microsoft JhengHei", sans-serif' }}>NT$ {amountTWD.toLocaleString()}</p>
          {expense.currency === 'KRW' && (
            <p className="text-[10px] text-k-coffee/40 mt-0.5" style={{ fontFamily: '"Microsoft JhengHei", sans-serif' }}>
              (₩ {expense.amount.toLocaleString()})
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchExpenses();
    }
  }, [isOpen]);

  const fetchExpenses = async () => {
    try {
  
      if (res.ok) {
        
      
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-03-24');
  const [newMethod, setNewMethod] = useState<'信用卡' | '現金' | '行動支付'>('現金');
  const [newCurrency, setNewCurrency] = useState<'TWD' | 'KRW'>('KRW');
  const [newAmount, setNewAmount] = useState('');
  const [newTaxRefund, setNewTaxRefund] = useState<'已退稅' | '未退稅' | '無'>('無');

  // Derived Data
  const uniqueDates = useMemo(() => {
    const dates = Array.from(new Set(expenses.map(e => e.date))).sort();
    return ['All', ...dates];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (selectedDay === 'All') return expenses;
    return expenses.filter(e => e.date === selectedDay);
  }, [expenses, selectedDay]);

  const totalTWD = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => {
      const amountInTWD = curr.currency === 'TWD' ? curr.amount : curr.amount * EXCHANGE_RATE;
      return acc + amountInTWD;
    }, 0);
  }, [filteredExpenses]);

  const handleSaveExpense = async () => {
    if (!newTitle || !newAmount) return;
    
    const expenseData: Expense = {
      id: editingId || Date.now().toString(),
      title: newTitle,
      date: newDate,
      paymentMethod: newMethod,
      amount: parseFloat(newAmount),
      currency: newCurrency,
      taxRefund: newTaxRefund,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/expenses/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });
        if (res.ok) {
          setExpenses(prev => prev.map(e => e.id === editingId ? expenseData : e));
        }
      } else {
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });
        if (res.ok) {
          setExpenses(prev => [expenseData, ...prev]);
        }
      }
      resetForm();
      fetchExpenses(); // Refresh list to ensure sync
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setExpenses(prev => prev.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setNewTitle(expense.title);
    setNewDate(expense.date);
    setNewMethod(expense.paymentMethod);
    setNewAmount(expense.amount.toString());
    setNewCurrency(expense.currency);
    setNewTaxRefund(expense.taxRefund || '無');
    setEditingId(expense.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewTitle('');
    setNewAmount('');
    setNewTaxRefund('無');
    setNewDate('2026-03-24');
    setNewMethod('現金');
    setNewCurrency('KRW');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-k-coffee/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-[#FDFBF7] z-50 p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-bold text-k-coffee font-serif tracking-wide">
                {isAdding ? (editingId ? '編輯記帳' : '新增記帳') : '以路的旅行記帳'}
              </h3>
              <button onClick={onClose} className="p-2 bg-k-coffee/5 rounded-full hover:bg-k-coffee/10 transition-colors">
                <X className="w-5 h-5 text-k-coffee" />
              </button>
            </div>

            {!isAdding ? (
              <>
                {/* Total Card */}
                <div className="bg-k-coffee text-white p-6 shadow-lg mb-6 relative overflow-hidden shrink-0">
                  <div className="relative z-10">
                    <p className="text-white/60 text-xs font-bold tracking-widest mb-1">總花費 (TWD)</p>
                    <h2 className="text-3xl font-bold" style={{ fontFamily: '"Microsoft JhengHei", sans-serif' }}>NT$ {Math.round(totalTWD).toLocaleString()}</h2>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                    <Wallet className="w-32 h-32" />
                  </div>
                </div>

                {/* Date Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-2 shrink-0 scrollbar-hide">
                  {uniqueDates.map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDay(date)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                        selectedDay === date 
                          ? 'bg-k-blue text-k-coffee' 
                          : 'bg-k-coffee/5 text-k-coffee/60 hover:bg-k-coffee/10'
                      }`}
                    >
                      {date === 'All' ? '全部' : date.slice(5)}
                    </button>
                  ))}
                </div>

                {/* Expense List */}
                <div className="flex-1 overflow-y-auto min-h-0 pb-20">
                  {filteredExpenses.map((expense) => (
                    <ExpenseItem 
                      key={expense.id} 
                      expense={expense} 
                      onDelete={handleDeleteExpense}
                      onEdit={handleEditExpense}
                    />
                  ))}
                  
                  {filteredExpenses.length === 0 && (
                    <div className="text-center py-8 text-k-coffee/30 text-sm font-bold">
                      沒有記帳紀錄
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
                  <button 
                    onClick={() => {
                      resetForm();
                      setIsAdding(true);
                    }}
                    className="w-full py-3 bg-k-coffee text-white font-bold shadow-lg hover:bg-k-coffee/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    記一筆
                  </button>
                </div>
              </>
            ) : (
              /* Add/Edit Expense Form */
              <div className="flex-1 flex flex-col">
                <div className="flex-1 space-y-5 overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold text-k-coffee/60 mb-1.5 ml-1">項目名稱</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="例如：午餐、地鐵"
                      className="w-full p-3 bg-white border border-k-coffee/10 rounded-[15px] text-k-coffee font-bold focus:outline-none focus:border-k-coffee/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-k-coffee/60 mb-1.5 ml-1">花費日期</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full p-3 bg-white border border-k-coffee/10 rounded-[15px] text-k-coffee font-bold focus:outline-none focus:border-k-coffee/30"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-k-coffee/30 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-k-coffee/60 mb-1.5 ml-1">付款方式</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['信用卡', '現金', '行動支付'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setNewMethod(method)}
                          className={`py-2.5 rounded-[12px] text-xs font-bold border transition-all ${
                            newMethod === method
                              ? 'bg-k-coffee text-white border-k-coffee'
                              : 'bg-white text-k-coffee/60 border-k-coffee/10 hover:bg-k-coffee/5'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-k-coffee/60 mb-1.5 ml-1">退稅狀態</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['無', '未退稅', '已退稅'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setNewTaxRefund(status)}
                          className={`py-2.5 rounded-[12px] text-xs font-bold border transition-all ${
                            newTaxRefund === status
                              ? 'bg-k-coffee text-white border-k-coffee'
                              : 'bg-white text-k-coffee/60 border-k-coffee/10 hover:bg-k-coffee/5'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-k-coffee/60 mb-1.5 ml-1">金額</label>
                    <div className="flex gap-2">
                      <select
                        value={newCurrency}
                        onChange={(e) => setNewCurrency(e.target.value as 'TWD' | 'KRW')}
                        className="p-3 bg-white border border-k-coffee/10 rounded-[15px] text-k-coffee font-bold focus:outline-none focus:border-k-coffee/30"
                      >
                        <option value="KRW">KRW (₩)</option>
                        <option value="TWD">TWD (NT$)</option>
                      </select>
                      <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="0"
                        className="flex-1 p-3 bg-white border border-k-coffee/10 rounded-[15px] text-k-coffee font-bold focus:outline-none focus:border-k-coffee/30"
                        style={{ fontFamily: '"Microsoft JhengHei", sans-serif' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={resetForm}
                    className="flex-1 py-3 bg-k-coffee/5 text-k-coffee font-bold rounded-[15px] hover:bg-k-coffee/10 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveExpense}
                    disabled={!newTitle || !newAmount}
                    className="flex-1 py-3 bg-k-coffee text-white font-bold rounded-[15px] shadow-lg hover:bg-k-coffee/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingId ? '更新' : '儲存'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
