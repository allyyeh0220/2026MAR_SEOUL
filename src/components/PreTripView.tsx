import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Edit2 } from 'lucide-react';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
}

interface ChecklistSectionProps {
  title: string;
  cardTitle?: string;
  items: ListItem[];
  categories?: string[];
  defaultCategory?: string;
  onUpdate: (items: ListItem[]) => void;
  isSubSection?: boolean;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ title, cardTitle, items, categories, defaultCategory, onUpdate, isSubSection, hideAddButton }) => {
  const [newItemText, setNewItemText] = useState('');
  const [newCategory, setNewCategory] = useState(categories ? categories[0] : (defaultCategory || ''));
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
    };

    if (categories) {
      newItem.category = newCategory;
    } else if (defaultCategory) {
      newItem.category = defaultCategory;
    }

    onUpdate([...items, newItem]);
    setNewItemText('');
    setIsAdding(false);
  };

  const handleToggle = (id: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdate(newItems);
  };

  const handleDelete = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    onUpdate(newItems);
  };

  const startEditing = (item: ListItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (!editingId || !editText.trim()) return;
    const newItems = items.map(item => 
      item.id === editingId ? { ...item, text: editText.trim() } : item
    );
    onUpdate(newItems);
    setEditingId(null);
    setEditText('');
  };

  const renderListItems = (itemsToRender: ListItem[]) => (
    <div className="space-y-3">
      {itemsToRender.map(item => (
        <div key={item.id} className="flex items-center gap-3 bg-white/80 p-3 rounded-xl shadow-sm group hover:bg-white transition-colors">
          <button 
            onClick={() => handleToggle(item.id)}
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
              item.completed ? 'bg-gray-400 border-gray-400' : 'border-gray-400 bg-transparent'
            }`}
          >
            {item.completed && <Check className="w-3.5 h-3.5 text-white" />}
          </button>
          
          {editingId === item.id ? (
            <div className="flex-1 flex gap-2">
              <input 
                type="text" 
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 bg-white px-2 py-1 rounded border border-k-coffee/20 focus:outline-none focus:border-k-coffee"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              />
              <button onClick={saveEdit} className="text-green-600"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditingId(null)} className="text-red-500"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <span 
              className={`flex-1 font-sans text-sm text-gray-700 ${item.completed ? 'text-gray-400 line-through' : ''}`}
              onDoubleClick={() => startEditing(item)}
            >
              {item.text}
            </span>
          )}

          {!editingId && (
            <button 
              onClick={() => handleDelete(item.id)} 
              className="text-gray-300 hover:text-[#C08586] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Section Header - Only for main sections */}
      {!isSubSection && (
        <div className="flex items-center justify-between mb-4 pl-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full bg-[#A98467]" />
            <h3 className="text-xl font-bold text-gray-800 tracking-wide">{title}</h3>
          </div>
          {!hideAddButton && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-[#afd0e9] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:brightness-95 transition-all shadow-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> 新增
            </button>
          )}
        </div>
      )}

      {/* Card Container */}
      <div className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-white/50 shadow-sm">
        {/* Title for SubSections (inside card, no bar) */}
        {isSubSection && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 tracking-wide">{title}</h3>
            {!hideAddButton && (
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-[#afd0e9] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:brightness-95 transition-all shadow-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> 新增
              </button>
            )}
          </div>
        )}

        {cardTitle && (
          <div className="mb-4 pb-2 border-b border-[#C08586]/30">
            <h4 className="text-lg font-bold text-[#C08586]">{cardTitle}</h4>
          </div>
        )}

        {categories ? (
          <div className="space-y-6">
            {categories.map(category => {
              const categoryItems = items.filter(item => (item.category || '其他') === category);
              return (
                <div key={category}>
                  <h5 className="text-sm font-bold text-gray-500 mb-3 px-1 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    {category}
                  </h5>
                  {categoryItems.length > 0 ? (
                    renderListItems(categoryItems)
                  ) : (
                    <p className="text-xs text-gray-400 italic pl-4">No items</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          renderListItems(items)
        )}

        {isAdding && (
          <div className="mt-4 flex flex-col gap-3 bg-white p-4 rounded-xl animate-in fade-in slide-in-from-top-2 shadow-md border border-[#afd0e9]/50">
            <div className="flex items-center gap-2">
              {categories && (
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#afd0e9] focus:border-[#afd0e9] block p-2 outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              <input 
                type="text" 
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="輸入項目名稱..."
                className="flex-1 bg-transparent border-b border-gray-200 focus:border-[#afd0e9] focus:outline-none text-sm py-2 px-1"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-gray-500 text-sm hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={handleAddItem} className="px-3 py-1 bg-[#afd0e9] text-white text-sm rounded hover:brightness-95 font-medium">Add Item</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ListData {
  todo: ListItem[];
  packing: ListItem[];
}

const initialData: ListData = {
  todo: [
    { id: '1', text: 'Check passport expiry', completed: false },
    { id: '2', text: 'Buy travel insurance', completed: false },
    { id: '3', text: 'Exchange currency', completed: false },
  ],
  packing: [
    { id: '1', text: 'Passport', completed: false, category: '文件' },
    { id: '2', text: 'Phone charger', completed: false, category: '3C產品' },
    { id: '3', text: 'Universal adapter', completed: false, category: '3C產品' },
  ]
};

const PACKING_CATEGORIES = ['文件', '3C產品', '盥洗/化妝品', '衣物', '其他'];

export function PreTripView() {
  const [data, setData] = useState<ListData>(initialData);
  const [loading, setLoading] = useState(true);
  
  // State for global packing list adder
  const [isAddingPacking, setIsAddingPacking] = useState(false);
  const [newPackingItemText, setNewPackingItemText] = useState('');
  const [newPackingCategory, setNewPackingCategory] = useState(PACKING_CATEGORIES[0]);

  useEffect(() => {
    const docRef = doc(db, 'pre_trip_data', 'lists');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as ListData);
      } else {
        // Initialize if not exists
        setDoc(docRef, initialData);
        setData(initialData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateList = async (listType: 'todo' | 'packing', newItems: ListItem[]) => {
    const newData = { ...data, [listType]: newItems };
    // Optimistic update
    setData(newData);
    
    // Sanitize items to remove undefined values which Firestore rejects
    const sanitizedItems = newItems.map(item => {
      const cleanItem = { ...item };
      Object.keys(cleanItem).forEach(key => {
        if (cleanItem[key as keyof ListItem] === undefined) {
          delete cleanItem[key as keyof ListItem];
        }
      });
      return cleanItem;
    });

    try {
      await setDoc(doc(db, 'pre_trip_data', 'lists'), {
        [listType]: sanitizedItems
      }, { merge: true });
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const updateCategoryList = (category: string, newCategoryItems: ListItem[]) => {
    // Filter out items that belong to this category (or are undefined if category is '其他')
    const otherItems = (data.packing || []).filter(item => {
      const itemCat = item.category || '其他';
      return itemCat !== category;
    });

    // Combine other items with the new items for this category
    const updatedList = [...otherItems, ...newCategoryItems];
    updateList('packing', updatedList);
  };

  const handleAddPackingItem = () => {
    if (!newPackingItemText.trim()) return;
    
    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newPackingItemText.trim(),
      completed: false,
      category: newPackingCategory
    };
    
    const updatedList = [...(data.packing || []), newItem];
    updateList('packing', updatedList);
    
    setNewPackingItemText('');
    setIsAddingPacking(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-k-cream">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A98467]"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-k-cream font-sans overflow-y-auto scrollbar-hide pb-24">
      <div className="px-6 py-8 max-w-5xl mx-auto w-full">
        
        <div className="mt-4">
          <ChecklistSection 
            title="行前檢查" 
            items={data.todo || []} 
            onUpdate={(items) => updateList('todo', items)} 
          />
        </div>

        <div className="h-8" />

        {/* Main Header for Packing List */}
        <div className="flex items-center justify-between mb-6 pl-2">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#A98467] rounded-full" />
             <h3 className="text-xl font-bold text-gray-800 tracking-wide">行李清單</h3>
           </div>
           <button 
             onClick={() => setIsAddingPacking(true)}
             className="bg-[#afd0e9] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:brightness-95 transition-all shadow-sm flex items-center gap-1"
           >
             <Plus className="w-4 h-4" /> 新增
           </button>
        </div>

        {/* Global Packing List Adder */}
        {isAddingPacking && (
          <div className="mb-6 flex flex-col gap-3 bg-white p-4 rounded-xl animate-in fade-in slide-in-from-top-2 shadow-md border border-[#afd0e9]/50">
            <div className="flex items-center gap-2">
              <select
                value={newPackingCategory}
                onChange={(e) => setNewPackingCategory(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#afd0e9] focus:border-[#afd0e9] block p-2 outline-none"
              >
                {PACKING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input 
                type="text" 
                value={newPackingItemText}
                onChange={(e) => setNewPackingItemText(e.target.value)}
                placeholder="輸入行李項目..."
                className="flex-1 bg-transparent border-b border-gray-200 focus:border-[#afd0e9] focus:outline-none text-sm py-2 px-1"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddPackingItem()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAddingPacking(false)} className="px-3 py-1 text-gray-500 text-sm hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={handleAddPackingItem} className="px-3 py-1 bg-[#afd0e9] text-white text-sm rounded hover:brightness-95 font-medium">Add Item</button>
            </div>
          </div>
        )}

        <div className="grid gap-8">
          {PACKING_CATEGORIES.map(category => {
            // Filter items for this category
            // For '其他', include items with '其他' or undefined/null category
            const categoryItems = (data.packing || []).filter(item => {
              const itemCat = item.category || '其他';
              return itemCat === category;
            });

            return (
              <ChecklistSection 
                key={category}
                title={category}
                items={categoryItems}
                defaultCategory={category}
                onUpdate={(items) => updateCategoryList(category, items)}
                isSubSection={true}
                hideAddButton={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
