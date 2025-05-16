import { useState, useEffect } from 'react';
import './RockPaperScissors.css';

const choices = [
  { id: 'rock', name: 'Rock', emoji: '✊', beats: 'scissors' },
  { id: 'paper', name: 'Paper', emoji: '✋', beats: 'rock' },
  { id: 'scissors', name: 'Scissors', emoji: '✌️', beats: 'paper' }
];

function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ user: 0, computer: 0, ties: 0 });
  const [gameState, setGameState] = useState('ready'); // ready, playing, result
  const [resultMessage, setResultMessage] = useState('');

  const handleChoice = (choice) => {
    if (gameState !== 'ready') return;
    
    setUserChoice(choice);
    setGameState('playing');
    
    // Simulate computer "thinking" with animation
    setTimeout(() => {
      const computerSelection = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(computerSelection);
      determineWinner(choice, computerSelection);
    }, 1000); // Longer delay for better animation effect
  };

  // Add function to handle random selection
  const handleRandomChoice = () => {
    if (gameState !== 'ready') return;
    
    const randomIndex = Math.floor(Math.random() * choices.length);
    const randomChoice = choices[randomIndex];
    
    // Use existing handleChoice to process the randomly selected choice
    handleChoice(randomChoice);
  };

  const determineWinner = (user, computer) => {
    let resultText = '';
    
    if (user.id === computer.id) {
      setResult('tie');
      resultText = "It's a tie!";
      setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
    } else if (user.beats === computer.id) {
      setResult('win');
      resultText = "You win!";
      setScore(prev => ({ ...prev, user: prev.user + 1 }));
    } else {
      setResult('lose');
      resultText = "Computer wins!";
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
    
    setResultMessage(resultText);
    setGameState('result');
  };

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
    setGameState('ready');
  };

  // Auto-reset game after showing results
  useEffect(() => {
    if (gameState === 'result') {
      const timer = setTimeout(() => {
        resetGame();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  return (
    <div className="rps-container">
      <h2>Rock Paper Scissors</h2>
      
      <div className="rps-score">
        <div className="score-card">You: {score.user}</div>
        <div className="score-card">Ties: {score.ties}</div>
        <div className="score-card">Computer: {score.computer}</div>
      </div>
      
      {gameState === 'ready' ? (
        <div className="rps-prompt">Make your choice:</div>
      ) : gameState === 'playing' ? (
        <div className="rps-prompt thinking">Computer is choosing...</div>
      ) : (
        <div className={`rps-result ${result}`}>{resultMessage}</div>
      )}
      
      <div className="rps-arena">
        <div className={`rps-player${userChoice ? ' selected' : ''}`}>
          {userChoice ? (
            <span className="choice-emoji animate-selection">{userChoice.emoji}</span>
          ) : (
            <span className="choice-placeholder">?</span>
          )}
          <span className="player-label">You</span>
        </div>
        
        <div className="rps-vs">VS</div>
        
        <div className={`rps-computer${computerChoice ? ' selected' : ''} ${gameState === 'playing' ? 'thinking' : ''}`}>
          {computerChoice ? (
            <span className="choice-emoji animate-selection">{computerChoice.emoji}</span>
          ) : (
            <span className={`choice-placeholder ${gameState === 'playing' ? 'thinking' : ''}`}>?</span>
          )}
          <span className="player-label">Computer</span>
        </div>
      </div>
      
      <div className="rps-choices">
        {choices.map(choice => (
          <button
            key={choice.id}
            className={`rps-choice-btn ${userChoice?.id === choice.id ? 'selected' : ''}`}
            onClick={() => handleChoice(choice)}
            disabled={gameState !== 'ready'}
          >
            <span className="choice-emoji">{choice.emoji}</span>
            <span className="choice-name">{choice.name}</span>
          </button>
        ))}
        
        {/* Add random button */}
        <button 
          className="rps-choice-btn random-btn"
          onClick={handleRandomChoice}
          disabled={gameState !== 'ready'}
        >
          <span className="choice-emoji">🎲</span>
          <span className="choice-name">Random</span>
        </button>
      </div>

      {gameState === 'result' && (
        <button className="rps-play-again animate-in" onClick={resetGame}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default RockPaperScissors;
