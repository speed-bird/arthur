import React, { useState } from 'react';
import './App.css';
import logoHome from './home.png'; // Assurez-vous que le chemin est correct
import validate from './validate.png'; // Assurez-vous que le chemin est correct
import trophy from './trophy.png'; // Assurez-vous que le chemin est correct
import fail from './fail.png';
import logo from './logo.png'; // Remplace par le chemin correct de ton logo

const App: React.FC = () => {
  const [questionCount, setQuestionCount] = useState<number>(10); // Valeur par défaut : 10 questions
  const [maxMultiplier, setMaxMultiplier] = useState<number>(2); // Valeur par défaut : maxMultiplier = 2
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<{ question: string; answer: number }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<number | ''>('');
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const generateQuestions = (count: number) => {
    const newQuestions = [];
    for (let i = 0; i < count; i++) {
      const isMultiplication = Math.random() < 0.5; // Décider aléatoirement si c'est une multiplication ou une division
      let num1, num2;
  
      if (isMultiplication) {
        num1 = Math.floor(Math.random() * maxMultiplier) + 1; // num1 entre 1 et maxMultiplier
        num2 = Math.floor(Math.random() * 20) + 1; // num2 entre 1 et 20
        newQuestions.push({ question: `${num1} x ${num2}`, answer: num1 * num2 });
      } else {
        // Pour la division, on s'assure que num1 (numérateur) <= 20 et num2 (dénominateur) <= maxMultiplier
        num2 = Math.floor(Math.random() * maxMultiplier) + 1; // num2 entre 1 et maxMultiplier
        num1 = Math.floor(Math.random() * 20) + 1; // num1 entre 1 et 20
  
        // S'assurer que num1 est un multiple de num2 pour que la division soit entière
        const product = num1 * num2; // Calculer le produit à partir de num1 et num2
        newQuestions.push({ question: `${product} ÷ ${num1}`, answer: num2 });
      }
    }
    setQuestions(newQuestions);
  };
  
  
  
  
  

  const handleStartQuiz = () => {
    generateQuestions(questionCount);
    setIsQuizStarted(true);
    setScore(0);
    setQuizFinished(false);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserAnswer(value === '' ? '' : parseFloat(value));
  };

  const handleSubmitAnswer = () => {
    // Vérification si une réponse a été saisie
    if (userAnswer === '') {
      alert("Veuillez entrer une réponse.");
      return;
    }

    if (userAnswer === questions[currentQuestionIndex].answer) {
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitAnswer(); // Appel de la fonction pour valider la réponse
    }
  };

  const handleExitQuiz = () => {
    setIsQuizStarted(false);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScore(0);
    setQuestions([]);
    setQuizFinished(false);
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="app-logo" /> {/* Ajout du logo ici */}
      {!isQuizStarted ? (
        <div>
          <h1>Aantal vragen :
          <select value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}>
            {[...Array(50)].map((_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </select>
          </h1>
          <h1>Tafel van :
          <select value={maxMultiplier} onChange={(e) => setMaxMultiplier(parseInt(e.target.value, 10))}>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          </h1>
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleStartQuiz}>Start</button>
          </div>
        </div>
      ) : quizFinished ? (
        <div>
          <FinalMessage score={score} totalQuestions={questions.length} />
          <button onClick={handleExitQuiz} className="logo-button">
            <img src={logoHome} alt="Home" />
          </button>
        </div>
      ) : (
        <div>
          <Quiz 
            question={questions[currentQuestionIndex]} 
            onSubmit={handleSubmitAnswer} 
            userAnswer={userAnswer} 
            onAnswerChange={handleAnswerChange} 
            onKeyPress={handleKeyPress} // Ajoute cette ligne
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            score={score} 
            onExit={handleExitQuiz} // Passer la fonction à Quiz
          />
        </div>
      )}
    </div>
  );
};

const Quiz: React.FC<{ 
  question: { question: string; answer: number }; 
  onSubmit: () => void; 
  userAnswer: number | ''; 
  onAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void; // Ajoute cette ligne
  currentQuestionIndex: number; 
  totalQuestions: number;
  score: number; 
  onExit: () => void; // Ajoute onExit ici
}> = ({ question, onSubmit, userAnswer, onAnswerChange, onKeyPress, currentQuestionIndex, totalQuestions, score, onExit }) => {
  if (!question) return null;

  return (
    <div>
      <h2>Vraag {currentQuestionIndex + 1} van {totalQuestions} - Score: {score}</h2>
      <p className="question">{question.question}</p>
      <input 
        type="number" 
        value={userAnswer} 
        onChange={onAnswerChange} 
        onKeyPress={onKeyPress} // Ajoute cette ligne
        placeholder="Uw antwoord" 
      />
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={onSubmit} className="logo-button">
          <img src={validate} alt="Validate" />
        </button>
        <button onClick={onExit} className="logo-button">
          <img src={logoHome} alt="Home" />
        </button>
      </div>
    </div>
  );
};

const FinalMessage: React.FC<{ score: number, totalQuestions: number }> = ({ score, totalQuestions }) => {
  const percentage = (score / totalQuestions) * 100;
  return (
    <div>
      {percentage >= 80 ? (
        <div>
          <h2>{percentage}%</h2>
          <h2>Gefeliciteerd ! </h2>
          <h2>Je score is {score}/{totalQuestions}</h2>
          <img 
            src={trophy} 
            alt="Trophée" 
            style={{ maxWidth: '200px', marginBottom: '20px' }} 
          />
        </div>
      ) : (
        <div>
          <h2>Quiz voltooid ! Je score is {score}/{totalQuestions}.</h2>
          <img 
            src={fail} 
            alt="Échec" 
            style={{ maxWidth: '200px', marginBottom: '20px' }} 
          />
        </div>
      )}
    </div>
  );
};

export default App;
