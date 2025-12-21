import React, { useState, useEffect } from 'react';
import { quizService, assessmentService } from '../services/api';
import { Play, CheckCircle, Clock, Award, BookOpen, ChevronRight, Timer, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Navbar from '../components/ui/Navbar';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data } = await quizService.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Navbar role="Student" />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <AnimatePresence mode="wait">
          {activeQuiz ? (
            <motion.div
              key="portal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <QuizPortal quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                  Student <span className="text-emerald-500">Dashboard</span>
                </h1>
                <p className="text-slate-400 text-lg">Master your skills through Interactive assessments</p>
              </header>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { label: 'Available Quizzes', value: quizzes.length, icon: BookOpen, color: 'text-emerald-400' },
                  { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-indigo-400' },
                  { label: 'Certificates', value: '3', icon: Award, color: 'text-amber-400' },
                ].map((stat, i) => (
                  <Card key={i} className="flex items-center gap-5 p-5 !bg-white/5 border-white/5">
                    <div className={`p-4 rounded-2xl bg-slate-900/50 ${stat.color}`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Play className="text-emerald-500 fill-emerald-500/20" />
                  Recommended for You
                </h2>
                <div className="h-px flex-1 bg-white/5 mx-6" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map((quiz, idx) => (
                  <motion.div
                    key={quiz._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="group h-full flex flex-col hover:border-emerald-500/30 transition-all duration-300 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                      
                      <div className="flex-1 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                            Available
                          </span>
                          <div className="text-slate-500 flex items-center gap-1.5 text-xs font-medium">
                            <Clock size={14} /> 15 mins
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                          {quiz.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                          {quiz.description || "Challenge yourself with this comprehensive assessment designed to test your core knowledge."}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => setActiveQuiz(quiz)}
                        className="w-full !from-emerald-600 !to-teal-600 border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
                      >
                        Start Learning
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const QuizPortal = ({ quiz, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (option) => {
    const q = quiz.questions[currentIdx];
    const newAnswers = [...userAnswers];
    const existingIdx = newAnswers.findIndex(a => a.questionId === q._id);

    if (existingIdx !== -1) {
      newAnswers[existingIdx].selectedOptions = option;
    } else {
      newAnswers.push({ questionId: q._id, selectedOptions: option });
    }
    setUserAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await assessmentService.submitQuiz({
        userId: '65842823051412001bb0000a',
        quizId: quiz._id,
        answers: userAnswers
      });
      setScore(data.score);
    } catch (err) {
      alert('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (score !== null) {
    return (
      <Card className="max-w-xl mx-auto text-center p-12 !bg-slate-900/60 border-emerald-500/20">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: "spring", stiffness: 200, damping: 15 }}
           className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle size={48} className="text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tighter">Evaluation Complete</h1>
        <p className="text-slate-400 mb-8 border-b border-white/5 pb-8">Great job! You've successfully finished the assessment. Here's your final result.</p>
        
        <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-emerald-500 opacity-20 blur-3xl animate-pulse" />
          <div className="relative text-7xl font-black text-white">
            {score}<span className="text-3xl text-slate-500">/100</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={onClose} className="w-full py-4 text-lg">
            Return to Dashboard
          </Button>
          <button className="text-slate-500 hover:text-white text-sm font-semibold transition-colors uppercase tracking-widest">
            View Analysis
          </button>
        </div>
      </Card>
    );
  }

  const q = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;
  const selectedOption = userAnswers.find(a => a.questionId === q._id)?.selectedOptions;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">{quiz.title}</h2>
            <p className="text-slate-500 text-sm font-medium">Question {currentIdx + 1} of {quiz.questions.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-950/40 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
           <Timer className="text-emerald-500" size={20} />
           <span className="text-white font-mono text-lg font-bold">14:52</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-800 rounded-full mb-12 overflow-hidden border border-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <Card className="!bg-slate-900/40 border-slate-700/30 p-10 min-h-[500px] flex flex-col shadow-2xl">
        <div className="flex-1">
          <motion.h2 
            key={currentIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-12 leading-relaxed"
          >
            {q.text}
          </motion.h2>
          
          <div className="grid gap-4">
            {q.options.map((opt, idx) => {
              const isActive = selectedOption === opt;
              return (
                <motion.button
                  key={idx}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center gap-5 p-5 w-full text-left rounded-2xl border-2 transition-all duration-200 group ${
                    isActive 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' 
                      : 'bg-slate-900 border-slate-700 group-hover:border-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="font-semibold text-lg">{opt}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/5">
          <button 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="flex items-center gap-2 text-slate-500 hover:text-white disabled:opacity-0 transition-all font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={16} /> Previous Question
          </button>
          
          <div className="flex items-center gap-4">
            {currentIdx === quiz.questions.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                className="px-8 !from-emerald-600 !to-emerald-500 shadow-emerald-500/20"
                disabled={isSubmitting || !selectedOption}
              >
                {isSubmitting ? 'Evaluating...' : 'Complete Assessment'}
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="px-8 group"
                disabled={!selectedOption}
              >
                Next Question <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-slate-600 uppercase tracking-widest font-black">
        <ShieldCheck size={14} />
        Secure Academic Session In Progress
      </div>
    </div>
  );
};

export default StudentDashboard;
