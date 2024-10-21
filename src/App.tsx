import React, { useState } from 'react';

const App: React.FC = () => {
  const [questionCount, setQuestionCount] = useState<number>(5); // Nombre de questions par défaut
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<{ question: string; answer: number }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<number | ''>('');

  const generateQuestions = (count: number) => {
    const newQuestions = [];
    for (let i = 0; i < count; i++) {
      const multiplier = Math.floor(Math.random() * 10) + 1;
      const divisor = Math.floor(Math.random() * 10) + 1;
      newQuestions.push({
        question: `Combien fait ${multiplier} x ${divisor} ?`,
        answer: multiplier * divisor,
      });
    }
    setQuestions(newQuestions);
  };

  const handleStartQuiz = () => {
    generateQuestions(questionCount);
    setIsQuizStarted(true);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmitAnswer = () => {
    if (parseInt(userAnswer, 10) === questions[currentQuestionIndex].answer) {
      alert("Correct !");
    } else {
      alert(`Incorrect. La bonne réponse est ${questions[currentQuestionIndex].answer}`);
    }
    setUserAnswer('');
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div>
      {!isQuizStarted ? (
        <div>
          <h1>Choisissez le nombre de questions</h1>
          <select value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}>
            <option value={5}>5 questions</option>
            <option value={10}>10 questions</option>
            <option value={15}>15 questions</option>
            <option value={20}>20 questions</option>
          </select>
          <button onClick={handleStartQuiz}>Commencer le quiz</button>
        </div>
      ) : (
        <Quiz 
          question={questions[currentQuestionIndex]} 
          onSubmit={handleSubmitAnswer} 
          userAnswer={userAnswer} 
          onAnswerChange={handleAnswerChange} 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
      )}
    </div>
  );
};

const Quiz: React.FC<{ 
  question: { question: string; answer: number }; 
  onSubmit: () => void; 
  userAnswer: number | ''; 
  onAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  currentQuestionIndex: number; 
  totalQuestions: number;
}> = ({ question, onSubmit, userAnswer, onAnswerChange, currentQuestionIndex, totalQuestions }) => {
  if (!question) return null; // Si la question n'est pas encore disponible

  return (
    <div>
      <h2>Question {currentQuestionIndex + 1} sur {totalQuestions}</h2>
      <p>{question.question}</p>
      <input 
        type="number" 
        value={userAnswer} 
        onChange={onAnswerChange} 
        placeholder="Votre réponse" 
      />
      <button onClick={onSubmit}>Soumettre</button>
      {currentQuestionIndex >= totalQuestions - 1 && <h3>Quiz terminé !</h3>}
    </div>
  );
};

export default App;
