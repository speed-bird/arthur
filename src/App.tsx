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
  const [isVanSelected, setIsVanSelected] = useState<boolean>(true); // Valeur par défaut : "van" sélectionné
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
        num1 = isVanSelected ? maxMultiplier : Math.floor(Math.random() * maxMultiplier) + 1; // num1 = maxMultiplier si "van", sinon entre 1 et maxMultiplier
        num2 = Math.floor(Math.random() * 20) + 1; // num2 entre 1 et 20
        newQuestions.push({ question: `${num1} x ${num2}`, answer: num1 * num2 });
      } else {
        num2 = Math.floor(Math.random() * maxMultiplier) + 1; // num2 entre 1 et maxMultiplier
        num1 = Math.floor(Math.random() * 20) + 1; // num1 entre 1 et 20

        const product = num1 * num2; // Calculer le produit à partir de num1 et num2
        if (num1 < num2) {
          newQuestions.push({ question: `${product} ÷ ${num1}`, answer: num2 });
        } else {
          newQuestions.push({ question: `${product} ÷ ${num2}`, answer: num1 });
        }
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
    if (userAnswer === '') {
      alert("Veuillez entrer une réponse.");
      return;
    }

    const currentAnswer = questions[currentQuestionIndex].answer;

    if (userAnswer === currentAnswer) {
      alert("Correct!");
      setScore(score + 1);
    } else {
      alert(`Incorrect. La bonne réponse est ${currentAnswer}.`);
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
      handleSubmitAnswer();
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
          <h1>Tafel :
            <select value={isVanSelected ? 'van' : 'tot'} onChange={(e) => setIsVanSelected(e.target.value === 'van')}>
              <option value="van">van</option>
              <option value="tot">tot</option>
            </select>
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
          <button onClick={handleExitQuiz} className="button-home">
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
            onKeyPress={handleKeyPress} 
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            score={score} 
            onExit={handleExitQuiz} 
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
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void; 
  currentQuestionIndex: number; 
  totalQuestions: number;
  score: number; 
  onExit: () => void;
}> = ({ question, onSubmit, userAnswer, onAnswerChange, onKeyPress, currentQuestionIndex, totalQuestions, score, onExit }) => {
  if (!question) return null;

  return (
    <div>
      <div>
        <h2>Vraag {currentQuestionIndex + 1} van {totalQuestions}</h2>
        <h2>[Score : {score} / {currentQuestionIndex}]</h2>
        <p className="question">{question.question}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <input 
            type="number" 
            value={userAnswer} 
            onChange={onAnswerChange} 
            onKeyPress={onKeyPress} 
            placeholder="Antwoord" 
            style={{ width: '100px', marginRight: '10px' }} // Champ de réponse moins large
            autoFocus // Met le focus directement sur ce champ à l'affichage
          />
        </div>
        <div>
          <button onClick={onSubmit} className="button-validate">
            <img src={validate} alt="Validate" />
          </button>
        </div>
        <div>
          <button onClick={onExit} className="button-home">
            <img src={logoHome} alt="Home"/>
          </button>
    </div>
</div>

    </div>
  );
}

const FinalMessage: React.FC<{ score: number, totalQuestions: number }> = ({ score, totalQuestions }) => {
  const percentage = (score / totalQuestions) * 100;
  return (
    <div>
      {percentage >= 80 ? (
        <div>
          <h2>Gefeliciteerd ! </h2>
          <h2>Je score is {score}/{totalQuestions} [{percentage}%]</h2>
          <img 
            src={trophy} 
            alt="Trophée" 
            style={{ maxWidth: '200px', marginBottom: '20px' }} 
          />
        </div>
      ) : (
        <div>
          <h2>Quiz voltooid ! </h2>
          <h2>Je score is {score}/{totalQuestions} [{percentage}%]</h2>
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
