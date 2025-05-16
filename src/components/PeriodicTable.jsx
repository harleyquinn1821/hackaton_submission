import { useState, useEffect } from 'react';
import './PeriodicTable.css';
import { elements } from './periodicTableData';

function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Elements' },
    { value: 'metal', label: 'Metals' },
    { value: 'nonmetal', label: 'Non-metals' },
    { value: 'metalloid', label: 'Metalloids' },
    { value: 'noble-gas', label: 'Noble Gases' },
    { value: 'alkali-metal', label: 'Alkali Metals' },
    { value: 'alkaline-earth', label: 'Alkaline Earth Metals' },
    { value: 'transition-metal', label: 'Transition Metals' },
    { value: 'solid', label: 'Solid at STP' },
    { value: 'liquid', label: 'Liquid at STP' },
    { value: 'gas', label: 'Gas at STP' }
  ];

  // Filter elements based on selected category and search term
  const filteredElements = elements.filter(element => {
    const matchesCategory = filter === 'all' || element.category === filter || 
                           (filter === 'metal' && element.type === 'metal') ||
                           (filter === 'nonmetal' && element.type === 'nonmetal') ||
                           (filter === 'metalloid' && element.type === 'metalloid') ||
                           (filter === 'solid' && element.phase === 'solid') ||
                           (filter === 'liquid' && element.phase === 'liquid') ||
                           (filter === 'gas' && element.phase === 'gas');
    
    const matchesSearch = searchTerm === '' || 
                         element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         element.number.toString().includes(searchTerm);
    
    return matchesCategory && matchesSearch;
  });

  // Function to handle element hover with boundary checking
  const handleElementHover = (element, e) => {
    setSelectedElement(element);
    
    // Don't set position - we'll use CSS to center the popup in the table
    // The popup will automatically center itself using CSS
  };

  // Helper function to get the element's color based on category
  const getElementColor = (category) => {
    const colorMap = {
      'alkali-metal': '#ff6b6b',
      'alkaline-earth': '#feca57',
      'transition-metal': '#48dbfb',
      'post-transition-metal': '#1dd1a1',
      'metalloid': '#c8d6e5',
      'nonmetal': '#54a0ff',
      'noble-gas': '#a29bfe',
      'lanthanoid': '#5f27cd',
      'actinoid': '#341f97',
      'unknown': '#ced6e0'
    };
    return colorMap[category] || '#ced6e0';
  };

  // Generate the periodic table grid
  const renderPeriodicTable = () => {
    const table = [];
    
    // Create empty grid with placeholders
    for (let row = 1; row <= 7; row++) {
      for (let col = 1; col <= 18; col++) {
        // Find element at this position - exclude lanthanides/actinides except La and Ac
        const element = elements.find(e => {
          // Only show La (57) and Ac (89) in main grid, move others to separate rows
          if ((e.number > 57 && e.number <= 71) || (e.number > 89 && e.number <= 103)) {
            return false;
          }
          
          return e.xpos === col && e.ypos === row;
        });
        
        if (element) {
          const isFiltered = filteredElements.includes(element);
          table.push(
            <div 
              key={element.symbol} 
              className={`element ${element.category} ${isFiltered ? 'visible' : 'filtered'}`}
              style={{ gridRow: row, gridColumn: col }}
              onMouseEnter={(e) => handleElementHover(element, e)}
              onMouseLeave={() => setSelectedElement(null)}
            >
              <div className="element-number">{element.number}</div>
              <div className="element-symbol">{element.symbol}</div>
              <div className="element-name">{element.name}</div>
              <div className="element-mass">{element.atomic_mass.toFixed(2)}</div>
            </div>
          );
        } else if ((row === 6 && col >= 4 && col <= 17) || (row === 7 && col >= 4 && col <= 17)) {
          // Empty placeholder for lanthanides/actinides spaces starting at column 4
          table.push(
            <div 
              key={`empty-${row}-${col}`} 
              className="element empty-element"
              style={{ gridRow: row, gridColumn: col }}
            ></div>
          );
        } else {
          // Other empty cells
          table.push(
            <div key={`empty-${row}-${col}`} style={{ gridRow: row, gridColumn: col }} className="element-empty"></div>
          );
        }
      }
    }
    
    // Add lanthanides row (elements 58-71)
    for (let i = 0; i < 14; i++) {
      const lanthanide = elements.find(e => e.number === 58 + i);
      if (lanthanide) {
        const isFiltered = filteredElements.includes(lanthanide);
        table.push(
          <div 
            key={lanthanide.symbol} 
            className={`element ${lanthanide.category} ${isFiltered ? 'visible' : 'filtered'} lanthanide`}
            style={{ gridRow: 8.5, gridColumn: 4 + i }}
            onMouseEnter={(e) => handleElementHover(lanthanide, e)}
            onMouseLeave={() => setSelectedElement(null)}
          >
            <div className="element-number">{lanthanide.number}</div>
            <div className="element-symbol">{lanthanide.symbol}</div>
            <div className="element-name">{lanthanide.name}</div>
            <div className="element-mass">{lanthanide.atomic_mass.toFixed(2)}</div>
          </div>
        );
      }
    }
    
    // Add actinides row (elements 90-103)
    for (let i = 0; i < 14; i++) {
      const actinide = elements.find(e => e.number === 90 + i);
      if (actinide) {
        const isFiltered = filteredElements.includes(actinide);
        table.push(
          <div 
            key={actinide.symbol} 
            className={`element ${actinide.category} ${isFiltered ? 'visible' : 'filtered'} actinide`}
            style={{ gridRow: 9.5, gridColumn: 4 + i }}
            onMouseEnter={(e) => handleElementHover(actinide, e)}
            onMouseLeave={() => setSelectedElement(null)}
          >
            <div className="element-number">{actinide.number}</div>
            <div className="element-symbol">{actinide.symbol}</div>
            <div className="element-name">{actinide.name}</div>
            <div className="element-mass">{actinide.atomic_mass.toFixed(2)}</div>
          </div>
        );
      }
    }
    
    // Add labels for lanthanides and actinides
    table.push(
      <div key="lanthanide-label" className="lanthanide-label">Lanthanides</div>
    );
    table.push(
      <div key="actinide-label" className="actinide-label">Actinides</div>
    );

    return table;
  };

  return (
    <div className="periodic-table-container">
      <h2>Periodic Table of Elements</h2>
      
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, symbol or number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.value}
              className={`category-btn ${filter === category.value ? 'active' : ''}`}
              onClick={() => setFilter(category.value)}
              data-category={category.value} // Add this attribute to use in CSS
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="periodic-table">
        {renderPeriodicTable()}
      </div>
      
      {selectedElement && (
        <div 
          className="element-popup"
          style={{
            borderColor: getElementColor(selectedElement.category)
          }}
        >
          <h3>{selectedElement.name} <span className="popup-symbol">{selectedElement.symbol}</span></h3>
          <div className="popup-details">
            <div><span>Atomic Number:</span> {selectedElement.number}</div>
            <div><span>Atomic Mass:</span> {selectedElement.atomic_mass.toFixed(2)}</div>
            <div><span>Category:</span> {selectedElement.category.replace('-', ' ')}</div>
            <div><span>Phase at STP:</span> {selectedElement.phase}</div>
            <div><span>Discovered by:</span> {selectedElement.discovered_by || 'Unknown'}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PeriodicTable;
