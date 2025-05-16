import { useState } from 'react'
import './App.css'
// Only import components we're actually using
import RockPaperScissors from './components/RockPaperScissors'
import PeriodicTable from './components/PeriodicTable'

function App() {
  const [tab, setTab] = useState("rps"); // Set default to Rock Paper Scissors since habits is commented out

  // Determine container class based on selected tab
  const containerClass = tab === "periodic" ? "app-container full-width" : "app-container";

  return (
    <div className={containerClass}>
      <div className="tab-bar">
        <button className={tab === "rps" ? "active" : ""} onClick={() => setTab("rps")}>Rock Paper Scissors</button>
        <button className={tab === "periodic" ? "active" : ""} onClick={() => setTab("periodic")}>Periodic Table</button>
      </div>
      
      {tab === "rps" ? <RockPaperScissors /> : <PeriodicTable />}
    </div>
  );
}

export default App
