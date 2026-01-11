import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ProgressPage() {
  const { member } = useMember();
  const { answers, completedAt, getSkillScores } = useAssessmentStore();
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());
  const [skillData, setSkillData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    // Load completed resources
    const saved = localStorage.getItem('completedResources');
    if (saved) {
      setCompletedResources(new Set(JSON.parse(saved)));
    }

    // Prepare skill scores data
    const scores = getSkillScores();
    const skillArray = Object.entries(scores).map(([skill, score]) => ({
      skill,
      score,
    }));
    setSkillData(skillArray);

    // Prepare pie chart data
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter((a) => a.answer).length;
    setPieData([
      { name: 'Completed', value: correctAnswers },
      { name: 'Remaining', value: Math.max(0, 10 - totalQuestions) },
    ]);
  }, [answers, getSkillScores]);

  const COLORS = ['#004D25', '#DFFF00'];

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
              Progress Tracking
            </h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-primary p-8 space-y-4"
              >
                <Target className="w-10 h-10 text-primary-foreground" strokeWidth={1.5} />
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/80 mb-2">
                    Assessment Questions
                  </p>
                  <p className="font-heading text-4xl font-bold text-primary-foreground">
                    {answers.length}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-primary/5 p-8 space-y-4"
              >
                <Award className="w-10 h-10 text-primary" strokeWidth={1.5} />
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-foreground/60 mb-2">
                    Skills Assessed
                  </p>
                  <p className="font-heading text-4xl font-bold text-primary">
                    {skillData.length}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-primary/5 p-8 space-y-4"
              >
                <TrendingUp className="w-10 h-10 text-primary" strokeWidth={1.5} />
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-foreground/60 mb-2">
                    Resources Completed
                  </p>
                  <p className="font-heading text-4xl font-bold text-primary">
                    {completedResources.size}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-primary p-8 space-y-4"
              >
                <Calendar className="w-10 h-10 text-primary-foreground" strokeWidth={1.5} />
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/80 mb-2">
                    Last Assessment
                  </p>
                  <p className="font-heading text-xl font-bold text-primary-foreground">
                    {completedAt ? format(new Date(completedAt), 'MMM dd') : 'N/A'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Skill Scores Chart */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-primary/5 p-8"
              >
                <h2 className="font-heading text-3xl font-bold uppercase text-primary tracking-tight mb-8">
                  Skill Scores
                </h2>
                {skillData.length > 0 ? (
                  <div className="bg-background p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={skillData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#004D25" opacity={0.1} />
                        <XAxis
                          dataKey="skill"
                          tick={{ fill: '#004D25', fontFamily: 'azeret-mono', fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          tick={{ fill: '#004D25', fontFamily: 'azeret-mono', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#004D25',
                            border: 'none',
                            color: '#DFFF00',
                            fontFamily: 'azeret-mono',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#004D25"
                          strokeWidth={3}
                          dot={{ fill: '#DFFF00', r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="bg-background p-12 text-center">
                    <p className="font-paragraph text-sm text-foreground/60">
                      Complete the assessment to see your skill scores
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Assessment Completion */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-primary p-8"
              >
                <h2 className="font-heading text-3xl font-bold uppercase text-primary-foreground tracking-tight mb-8">
                  Assessment Progress
                </h2>
                <div className="bg-primary-foreground/10 p-6 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#004D25',
                          border: 'none',
                          color: '#DFFF00',
                          fontFamily: 'azeret-mono',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Skill Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-primary/5 p-8 lg:p-12"
            >
              <h2 className="font-heading text-3xl font-bold uppercase text-primary tracking-tight mb-8">
                Detailed Skill Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillData.map((skill, index) => (
                  <div key={index} className="bg-background p-6 space-y-4">
                    <h3 className="font-heading text-xl font-bold uppercase text-primary tracking-tight">
                      {skill.skill}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-paragraph text-xs uppercase tracking-wider text-foreground/60">
                          Score
                        </span>
                        <span className="font-heading text-2xl font-bold text-primary">
                          {skill.score}/10
                        </span>
                      </div>
                      <div className="w-full h-3 bg-primary/20">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${(skill.score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {skillData.length === 0 && (
                <div className="bg-background p-12 text-center">
                  <p className="font-paragraph text-base text-foreground/60">
                    No skill data available yet. Complete the assessment to see your progress.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Learning Activity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-primary p-8 lg:p-12 mt-8"
            >
              <h2 className="font-heading text-3xl font-bold uppercase text-primary-foreground tracking-tight mb-8">
                Learning Activity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60">
                    Total Study Time
                  </p>
                  <p className="font-heading text-4xl font-bold text-primary-foreground">
                    {completedResources.size * 30} min
                  </p>
                  <p className="font-paragraph text-xs text-primary-foreground/80">
                    Estimated based on completed resources
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60">
                    Completion Rate
                  </p>
                  <p className="font-heading text-4xl font-bold text-primary-foreground">
                    {answers.length > 0 ? Math.round((answers.length / 10) * 100) : 0}%
                  </p>
                  <p className="font-paragraph text-xs text-primary-foreground/80">
                    Assessment completion
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60">
                    Next Milestone
                  </p>
                  <p className="font-heading text-4xl font-bold text-primary-foreground">
                    {completedAt ? 'Retake' : 'Complete'}
                  </p>
                  <p className="font-paragraph text-xs text-primary-foreground/80">
                    {completedAt ? 'Assessment for updated scores' : 'Your first assessment'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
