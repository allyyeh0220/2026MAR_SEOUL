import { Plane, Hotel, Phone, Wallet, Copy } from 'lucide-react';
import { BudgetTracker } from './BudgetTracker';

export function ToolsView() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("已複製！");
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-6 pb-24 space-y-8 scrollbar-hide">
      <h1 className="text-2xl font-bold text-k-coffee mb-6 tracking-tight">旅行工具箱</h1>

      {/* Flight Info */}
      <section>
        <div className="flex items-center gap-2 mb-3 text-k-coffee font-bold">
          <Plane className="w-5 h-5" />
          <h2>航班資訊</h2>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-k-coffee/5 space-y-4">
          <div className="flex justify-between items-center border-b border-k-coffee/5 pb-4">
            <div>
              <p className="text-xs text-k-coffee/50 uppercase font-bold tracking-wider">去程 (TPE → ICN)</p>
              <p className="font-bold text-xl text-k-coffee mt-1">EVA Air BR170</p>
              <p className="text-sm text-k-coffee/70 mt-1 font-mono">07:05 - 10:30</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-k-blue/20 text-k-coffee text-xs rounded-lg font-bold">T2</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-k-coffee/50 uppercase font-bold tracking-wider">回程 (ICN → TPE)</p>
              <p className="font-bold text-xl text-k-coffee mt-1">EVA Air BR159</p>
              <p className="text-sm text-k-coffee/70 mt-1 font-mono">19:45 - 21:30</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-k-blue/20 text-k-coffee text-xs rounded-lg font-bold">T1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section>
        <div className="flex items-center gap-2 mb-3 text-k-coffee font-bold">
          <Hotel className="w-5 h-5" />
          <h2>住宿資訊</h2>
        </div>
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-k-coffee/5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-k-coffee text-lg">Le Seoul Hotel</h3>
                <p className="text-sm text-k-coffee/60 mt-1">明洞區域 (Myeongdong)</p>
              </div>
              <button onClick={() => copyToClipboard("Le Seoul Hotel address")} className="p-2 text-k-coffee/40 hover:text-k-coffee transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-k-coffee/5">
              <p className="text-xs text-k-coffee/40 font-bold tracking-wider">CHECK-IN: 15:00</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-k-coffee/5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-k-coffee text-lg">Dream House</h3>
                <p className="text-sm text-k-coffee/60 mt-1">弘大區域 (Hongdae)</p>
              </div>
              <button onClick={() => copyToClipboard("Dream House address")} className="p-2 text-k-coffee/40 hover:text-k-coffee transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-k-coffee/5">
              <p className="text-xs text-k-coffee/40 font-bold tracking-wider">CHECK-IN: 14:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section>
        <div className="flex items-center gap-2 mb-3 text-k-coffee font-bold">
          <Phone className="w-5 h-5" />
          <h2>緊急聯絡</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a href="tel:112" className="bg-[#FFE4E1] hover:bg-[#FFD1CC] transition-colors p-5 rounded-3xl text-center border border-transparent">
            <span className="block text-2xl font-bold text-[#D32F2F] mb-1 font-mono">112</span>
            <span className="text-xs text-[#D32F2F]/60 font-bold uppercase tracking-wider">警察局</span>
          </a>
          <a href="tel:119" className="bg-[#FFE4E1] hover:bg-[#FFD1CC] transition-colors p-5 rounded-3xl text-center border border-transparent">
            <span className="block text-2xl font-bold text-[#D32F2F] mb-1 font-mono">119</span>
            <span className="text-xs text-[#D32F2F]/60 font-bold uppercase tracking-wider">救護車</span>
          </a>
          <a href="tel:1330" className="col-span-2 bg-k-blue/20 hover:bg-k-blue/30 transition-colors p-5 rounded-3xl text-center flex items-center justify-center gap-4 border border-transparent">
            <div>
              <span className="block text-xl font-bold text-k-coffee font-mono">1330</span>
              <span className="text-xs text-k-coffee/60 font-bold uppercase tracking-wider">韓國旅遊諮詢熱線 (中文可)</span>
            </div>
          </a>
        </div>
      </section>

      {/* Budget */}
      <section>
        <div className="flex items-center gap-2 mb-3 text-k-coffee font-bold">
          <Wallet className="w-5 h-5" />
          <h2>記帳小幫手</h2>
        </div>
        <BudgetTracker />
      </section>
    </div>
  );
}
