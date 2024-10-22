import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [maxMultiplier, setMaxMultiplier] = useState<number>(10); // État pour le maxMultiplier
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<{ question: string; answer: number }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<number | ''>('');
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const generateQuestions = (count: number) => {
    const newQuestions = [];
    for (let i = 0; i < count; i++) {
        const num1 = Math.floor(Math.random() * (maxMultiplier)) + 1; // Premier opérateur entre 1 et maxMultiplier
        const num2 = Math.floor(Math.random() * 21); // Deuxième opérateur entre 0 et 20

        const isMultiplication = Math.random() < 0.5; // 50% de chance d'être une multiplication ou une division

        // On décide aléatoirement de l'ordre d'affichage
        const shouldInvert = Math.random() < 0.5; // 50% de chance d'inverser

        if (isMultiplication) {
            // Pour multiplication, on peut garder num1 comme <= maxMultiplier et num2 <= 20
            if (shouldInvert) {
                newQuestions.push({ question: `${num2} x ${num1}`, answer: num1 * num2 });
            } else {
                newQuestions.push({ question: `${num1} x ${num2}`, answer: num1 * num2 });
            }
        } else if (num2 !== 0) { // Évite la division par zéro
            const product = num1 * num2; // Produit
            if (shouldInvert) {
                newQuestions.push({ question: `${product} ÷ ${num2}`, answer: num1 });
            } else {
                newQuestions.push({ question: `${product} ÷ ${num1}`, answer: num2 });
            }
        } else {
            i--; // Ignore ce tour si num2 est 0 pour éviter une question invalide
        }
    }
    setQuestions(newQuestions);
};



  const handleStartQuiz = () => {
    generateQuestions(questionCount);
    setIsQuizStarted(true);
    setScore(0); // Réinitialiser le score
    setQuizFinished(false); // Remet à zéro l'état de fin du quiz
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserAnswer(value === '' ? '' : parseFloat(value));
  };

  const handleSubmitAnswer = () => {
    if (parseInt(userAnswer as string, 10) === questions[currentQuestionIndex].answer) {
      alert("Correct!");
      setScore(score + 1);
    } else {
      alert(`Onjuist. Het juiste antwoord is ${questions[currentQuestionIndex].answer}`);
    }
    setUserAnswer('');
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="container">
      {!isQuizStarted ? (
        <div>
          <h1>Kies het aantal vragen</h1>
          <select value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}>
            <option value={5}>5 vragen</option>
            <option value={10}>10 vragen</option>
            <option value={15}>15 vragen</option>
            <option value={20}>20 vragen</option>
          </select>
          <h2>Kies de maximale tafel (2 tot 10)</h2>
          <select value={maxMultiplier} onChange={(e) => setMaxMultiplier(parseInt(e.target.value, 10))}>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleStartQuiz}>Begin de quiz</button>
          </div>
        </div>
      ) : quizFinished ? (
        <FinalMessage score={score} totalQuestions={questions.length} />
      ) : (
        <Quiz 
          question={questions[currentQuestionIndex]} 
          onSubmit={handleSubmitAnswer} 
          userAnswer={userAnswer} 
          onAnswerChange={handleAnswerChange} 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          score={score} 
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
  score: number; 
}> = ({ question, onSubmit, userAnswer, onAnswerChange, currentQuestionIndex, totalQuestions, score }) => {
  if (!question) return null;

  return (
    <div>
      <h2>Vraag {currentQuestionIndex + 1} van {totalQuestions}</h2>
      <p className="question">{question.question}</p>
      <input 
        type="number" 
        value={userAnswer} 
        onChange={onAnswerChange} 
        placeholder="Uw antwoord" 
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={onSubmit}>Indienen</button>
      </div>
      <div className="score">Score: {score}/{currentQuestionIndex}</div>
    </div>
  );
};

const FinalMessage: React.FC<{ score: number, totalQuestions: number }> = ({ score, totalQuestions }) => {
  const percentage = (score / totalQuestions) * 100;
  return (
    <div>
      {percentage >= 80 ? (
        <div>
          <h2>Gefeliciteerd! Je hebt {percentage}% van de vragen goed beantwoord!</h2>
          <img 
            src="https://example.com/trophy.png" 
            alt="Trophy" 
            style={{ maxWidth: '200px', marginBottom: '20px' }} 
          />
        </div>
      ) : (
        <h2>Je hebt de quiz voltooid! Je score is {score} van de {totalQuestions}.</h2>
      )}
    </div>
  );
};

export default App;
