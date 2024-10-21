import React, { useState } from 'react';

const App: React.FC = () => {
  const [questionCount, setQuestionCount] = useState<number>(5); // Nombre de questions par défaut
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleQuestionCountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionCount(parseInt(event.target.value, 10));
  };

  return (
    <div>
      {!isQuizStarted ? (
        <div>
          <h1>Choisissez le nombre de questions</h1>
          <select value={questionCount} onChange={handleQuestionCountChange}>
            <option value={5}>5 questions</option>
            <option value={10}>10 questions</option>
            <option value={15}>15 questions</option>
            <option value={20}>20 questions</option>
          </select>
          <button onClick={handleStartQuiz}>Commencer le quiz</button>
        </div>
      ) : (
        <Quiz questionCount={questionCount} />
      )}
    </div>
  );
};

const Quiz: React.FC<{ questionCount: number }> = ({ questionCount }) => {
  // Logique du quiz ici, par exemple générer des questions

  return (
    <div>
      <h2>Quiz de {questionCount} questions</h2>
      {/* Afficher les questions ici */}
    </div>
  );
};

export default App;
