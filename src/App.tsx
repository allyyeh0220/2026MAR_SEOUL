import { ItineraryView } from './components/ItineraryView';

function App() {
  return (
    <div className="bg-k-cream h-[100dvh] w-full max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col font-sans text-k-coffee">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <ItineraryView />
      </main>
    </div>
  );
}

export default App;
