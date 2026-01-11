import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { SkillAssessmentQuestions, Careers } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

export default function AssessmentPage() {
  const { member } = useMember();
  const navigate = useNavigate();
  const { answers, selectedCareer, addAnswer, setSelectedCareer, completeAssessment } = useAssessmentStore();
  
  const [questions, setQuestions] = useState<SkillAssessmentQuestions[]>([]);
  const [careers, setCareers] = useState<Careers[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'career' | 'questions'>('career');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { items: allQuestions } = await BaseCrudService.getAll<SkillAssessmentQuestions>('skillassessmentquestions');
      const { items: allCareers } = await BaseCrudService.getAll<Careers>('careers');
      
      setQuestions(allQuestions.slice(0, 10));
      setCareers(allCareers);
      
      if (selectedCareer) {
        setStep('questions');
      }
      
      setLoading(false);
    };

    fetchData();
  }, [selectedCareer]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const existingAnswer = answers.find(
        (a) => a.questionId === questions[currentQuestionIndex]._id
      );
      if (existingAnswer) {
        setCurrentAnswer(existingAnswer.answer);
      } else {
        setCurrentAnswer('');
      }
    }
  }, [currentQuestionIndex, questions, answers]);

  const handleCareerSelect = (careerId: string) => {
    setSelectedCareer(careerId);
    setStep('questions');
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer || !questions[currentQuestionIndex]) return;

    const question = questions[currentQuestionIndex];
    addAnswer({
      questionId: question._id,
      answer: currentAnswer,
      skillArea: question.skillArea || 'General',
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      completeAssessment();
      navigate('/gap-analysis');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const parseOptions = (optionsString?: string): string[] => {
    if (!optionsString) return [];
    return optionsString.split(',').map((opt) => opt.trim());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-primary leading-tight tracking-tighter mb-12">
              Skill Assessment
            </h1>

            {step === 'career' ? (
              <div className="space-y-8">
                <div className="bg-primary/5 p-8">
                  <h2 className="font-heading text-3xl font-bold uppercase text-primary tracking-tight mb-4">
                    Select Your Target Career
                  </h2>
                  <p className="font-paragraph text-base text-foreground leading-relaxed">
                    Choose the career path you're interested in pursuing. This will help us tailor the assessment to your goals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careers.map((career) => (
                    <motion.div
                      key={career._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => handleCareerSelect(career._id)}
                      className={`cursor-pointer p-8 transition-all ${
                        selectedCareer === career._id
                          ? 'bg-primary'
                          : 'bg-primary/5 hover:bg-primary/10'
                      }`}
                    >
                      <h3
                        className={`font-heading text-2xl font-bold uppercase tracking-tight mb-3 ${
                          selectedCareer === career._id ? 'text-primary-foreground' : 'text-primary'
                        }`}
                      >
                        {career.careerName}
                      </h3>
                      <p
                        className={`font-paragraph text-sm leading-relaxed line-clamp-3 ${
                          selectedCareer === career._id
                            ? 'text-primary-foreground/80'
                            : 'text-foreground/80'
                        }`}
                      >
                        {career.careerDescription}
                      </p>
                      {career.averageSalary && (
                        <p
                          className={`font-paragraph text-xs uppercase tracking-wider mt-4 ${
                            selectedCareer === career._id
                              ? 'text-primary-foreground'
                              : 'text-primary'
                          }`}
                        >
                          Avg. Salary: ${career.averageSalary.toLocaleString()}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-paragraph text-sm uppercase tracking-wider text-foreground/60">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    <p className="font-paragraph text-sm uppercase tracking-wider text-primary">
                      {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                    </p>
                  </div>
                  <div className="w-full h-2 bg-primary/20">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                {questions[currentQuestionIndex] && (
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-primary p-8 lg:p-12 space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <span className="font-heading text-4xl font-black text-primary-foreground">
                          {String(currentQuestionIndex + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1">
                          <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60 mb-3">
                            {questions[currentQuestionIndex].skillArea}
                          </p>
                          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-primary-foreground leading-tight">
                            {questions[currentQuestionIndex].questionText}
                          </h2>
                        </div>
                      </div>
                    </div>

                    {/* Answer Options */}
                    <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
                      <div className="space-y-4">
                        {parseOptions(questions[currentQuestionIndex].options).map((option, index) => (
                          <div
                            key={index}
                            className={`flex items-center space-x-4 p-6 transition-all cursor-pointer ${
                              currentAnswer === option
                                ? 'bg-primary-foreground'
                                : 'bg-primary-foreground/10 hover:bg-primary-foreground/20'
                            }`}
                            onClick={() => setCurrentAnswer(option)}
                          >
                            <RadioGroupItem
                              value={option}
                              id={`option-${index}`}
                              className={
                                currentAnswer === option
                                  ? 'border-primary text-primary'
                                  : 'border-primary-foreground text-primary-foreground'
                              }
                            />
                            <Label
                              htmlFor={`option-${index}`}
                              className={`flex-1 font-paragraph text-base cursor-pointer ${
                                currentAnswer === option ? 'text-primary' : 'text-primary-foreground'
                              }`}
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-paragraph text-sm uppercase tracking-wider disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!currentAnswer}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph text-sm uppercase tracking-wider disabled:opacity-50"
                  >
                    {currentQuestionIndex === questions.length - 1 ? (
                      <>
                        Complete
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
