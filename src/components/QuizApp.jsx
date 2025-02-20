import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getQuizHistory, saveQuizResult } from "../utils/IndexDBhelper";

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [integerAnswer, setIntegerAnswer] = useState("");
  const [quizHistory, setQuizHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null); 

    const quizData = [
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      answer: 1,
      type: "mcq"
    },
    {
      question: "Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: 1,
      type: "mcq"
    },
    {
      question: "Which of the following is primarily used for structuring web pages?",
      options: ["Python", "Java", "HTML", "C++"],
      answer: 2,
      type: "mcq"
    },
    {
      question: "Which chemical symbol stands for Gold?",
      options: ["Au", "Gd", "Ag", "Pt"],
      answer: 0,
      type: "mcq"
    },
    {
      question: "Which of these processes is not typically involved in refining petroleum?",
      options: ["Fractional distillation", "Cracking", "Polymerization", "Filtration"],
      answer: 3,
      type: "mcq"
    },
    {
      question: "What is the value of 12 + 28?",
      answer: 40,
      type: "int"
    },
    {
      question: "How many states are there in the United States?",
      answer: 50,
      type: "int"
    },
    {
      question: "In which year was the Declaration of Independence signed?",
      answer: 1776,
      type: "int"
    },
    {
      question: "What is the value of pi rounded to the nearest integer?",
      answer: 3,
      type: "int"
    },
    {
      question: "If a car travels at 60 mph for 2 hours, how many miles does it travel?",
      answer: 120,
      type: "int"
    },
  ];

   useEffect(() => {
    let timer;
    if (!isQuizComplete && selectedAnswer === null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleNext();
            return 30; 
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, selectedAnswer, isQuizComplete]);

  const handleIntegerSubmit = () => {
    if (selectedAnswer !== null) return;
    
    const userAnswer = parseInt(integerAnswer);
    if (isNaN(userAnswer)) return;

    setSelectedAnswer(userAnswer);
    
    if (userAnswer === quizData[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }

    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === quizData[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }

    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIntegerAnswer("");
      setAnswerStatus(null);
      setTimeLeft(30);
    } else {
      setIsQuizComplete(true);
      const result = { date: new Date().toLocaleString(), score: score };
      if (typeof window !== 'undefined') {
        saveQuizResult(result).then(() => getQuizHistory().then(setQuizHistory));
      }
    }
  };

    const getButtonClassName = (index) => {
    let baseClass = "w-full p-4 mb-3 text-left rounded-lg transition-all duration-200 ";
    
    if (selectedAnswer === null) {
      baseClass += "bg-white hover:bg-blue-50 border border-gray-200";
    } else if (index === quizData[currentQuestion].answer) {
      baseClass += "bg-green-100 border border-green-500 text-green-700";
    } else if (index === selectedAnswer) {
      baseClass += "bg-red-100 border border-red-500 text-red-700";
    } else {
      baseClass += "bg-gray-50 border border-gray-200 opacity-50";
    }
    
    return baseClass;
  };
  
  return (
    <div className="min-h-screen  p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            {!isQuizComplete ? "🎯 Quiz Time!" : "🎉 Quiz Complete!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!isQuizComplete ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium px-4 py-1 bg-blue-50 rounded-full text-blue-600">
                    Question {currentQuestion + 1} of {quizData.length}
                  </span>
                  <span className={`text-sm font-medium px-4 py-1 rounded-full ${
                    timeLeft > 10 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-red-50 text-red-600 animate-pulse'
                  }`}>
                    ⏱️ {timeLeft}s
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      timeLeft > 10 ? 'bg-blue-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${(timeLeft/30)*100}%`,
                      transition: 'width 1s linear'
                    }}
                  />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium mb-4 text-gray-800">
                  {quizData[currentQuestion].question}
                </h3>
                
                {quizData[currentQuestion].type === "mcq" ? (
                  <div className="space-y-3">
                    {quizData[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        disabled={selectedAnswer !== null}
                        className={`${getButtonClassName(index)} transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200`}
                      >
                        <span className="flex items-center">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 mr-3 bg-gray-50">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="number"
                        value={integerAnswer}
                        onChange={(e) => setIntegerAnswer(e.target.value)}
                        placeholder="Enter your answer"
                        className={`w-full p-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                          selectedAnswer === null
                            ? "border-gray-200 hover:border-gray-300"
                            : answerStatus === "correct"
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                        }`}
                        disabled={selectedAnswer !== null}
                      />
                    </div>
                    <Button 
                      onClick={handleIntegerSubmit}
                      disabled={selectedAnswer !== null || integerAnswer === ""}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-lg transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </Button>
                    {selectedAnswer !== null && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-center p-4 rounded-lg ${
                          answerStatus === "correct" 
                            ? "bg-green-100 text-green-700 border border-green-200" 
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {answerStatus === "correct" 
                          ? "✨ Correct! Well done! 🎉" 
                          : `❌ Incorrect. The correct answer was ${quizData[currentQuestion].answer}`
                        }
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-5xl font-bold py-4 px-8 rounded-2xl shadow-lg">
                  {score} / {quizData.length}
                </div>
                <p className="text-xl text-gray-600">
                  {score === quizData.length 
                    ? "🏆 Perfect score! Amazing job! 🌟" 
                    : score >= quizData.length / 2 
                      ? "👏 Good effort! Keep practicing! 💪" 
                      : "💡 Don't give up! Try again! 🎯"
                  }
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <span className="text-blue-600">📊</span> Previous Attempts
                </h3>
                <div className="space-y-2">
                  {quizHistory.map((attempt, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="text-sm text-gray-600">📅 {attempt.date}</span>
                      <span className="font-medium bg-white px-4 py-1 rounded-full shadow-sm border border-gray-200">
                        Score: {attempt.score} / {quizData.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizApp;