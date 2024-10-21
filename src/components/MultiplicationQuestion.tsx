import React, { useState } from 'react';

const MultiplicationQuestion = () => {
  const [a, setA] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [b, setB] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const handleAnswer = () => {
    if (answer === a * b) {
      setFeedback("Bravo ! C'est correct.");
    } else {
      setFeedback(`Oups ! La bonne réponse était ${a * b}`);
    }
  };

  // Sauvegarder le score dans localStorage
const saveProgress = (score: number) => {
    localStorage.setItem('multiplication-score', JSON.stringify(score));
  };
  
  // Charger le score au démarrage
  const loadProgress = () => {
    const savedScore = localStorage.getItem('multiplication-score');
    return savedScore ? JSON.parse(savedScore) : 0;
  };
  

  return (
    <div>
      <h1>{a} x {b} = ?</h1>
      <input 
        type="number" 
        value={answer || ''} 
        onChange={(e) => setAnswer(Number(e.target.value))} 
      />
      <button onClick={handleAnswer}>Valider</button>
      <p>{feedback}</p>
    </div>
  );
};

export default MultiplicationQuestion;
