import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Careers } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export default function GapAnalysisPage() {
  const { member } = useMember();
  const { selectedCareer, getSkillScores, completedAt } = useAssessmentStore();
  const [career, setCareer] = useState<Careers | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      if (selectedCareer) {
        const careerData = await BaseCrudService.getById<Careers>('careers', selectedCareer);
        setCareer(careerData);

        // Get user's skill scores
        const userSkills = getSkillScores();

        // Parse required skills from career
        const requiredSkillsArray = careerData.requiredSkills
          ? careerData.requiredSkills.split(',').map((s) => s.trim())
          : [];

        // Create chart data
        const data = requiredSkillsArray.map((skill) => ({
          skill,
          current: userSkills[skill] || 0,
          required: 10, // Normalized to 10 for visualization
          gap: Math.max(0, 10 - (userSkills[skill] || 0)),
        }));

        setChartData(data);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [selectedCareer, getSkillScores]);

  if (!completedAt) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 pb-16">
          <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
            <div className="bg-primary/5 p-12 text-center space-y-6">
              <AlertCircle className="w-16 h-16 text-primary mx-auto" />
              <h2 className="font-heading text-3xl font-bold uppercase text-primary tracking-tight">
                Complete Assessment First
              </h2>
              <p className="font-paragraph text-base text-foreground max-w-2xl mx-auto">
                You need to complete the skill assessment before viewing your gap analysis.
              </p>
              <Link to="/assessment">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph text-sm uppercase tracking-wider">
                  Start Assessment
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              Skill Gap Analysis
            </h1>

            {/* Career Info */}
            {career && (
              <div className="bg-primary p-8 lg:p-12 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60">
                      Target Career
                    </p>
                    <h2 className="font-heading text-4xl font-bold uppercase text-primary-foreground tracking-tight">
                      {career.careerName}
                    </h2>
                    <p className="font-paragraph text-base text-primary-foreground/80 leading-relaxed">
                      {career.careerDescription}
                    </p>
                  </div>
                  <div className="space-y-6">
                    {career.industry && (
                      <div>
                        <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">
                          Industry
                        </p>
                        <p className="font-paragraph text-lg text-primary-foreground">
                          {career.industry}
                        </p>
                      </div>
                    )}
                    {career.averageSalary && (
                      <div>
                        <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">
                          Average Salary
                        </p>
                        <p className="font-heading text-3xl font-bold text-primary-foreground">
                          ${career.averageSalary.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Chart Section */}
            <div className="bg-primary/5 p-8 lg:p-12 mb-12">
              <div className="mb-8">
                <h2 className="font-heading text-3xl font-bold uppercase text-primary tracking-tight mb-4">
                  Skills Comparison
                </h2>
                <p className="font-paragraph text-base text-foreground leading-relaxed">
                  Compare your current skill levels with the requirements for your target career.
                </p>
              </div>

              <div className="bg-background p-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#004D25" opacity={0.1} />
                    <XAxis
                      dataKey="skill"
                      tick={{ fill: '#004D25', fontFamily: 'azeret-mono', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis
                      tick={{ fill: '#004D25', fontFamily: 'azeret-mono', fontSize: 12 }}
                      domain={[0, 10]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#004D25',
                        border: 'none',
                        color: '#DFFF00',
                        fontFamily: 'azeret-mono',
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontFamily: 'azeret-mono',
                        fontSize: 12,
                        textTransform: 'uppercase',
                      }}
                    />
                    <Bar dataKey="current" fill="#004D25" name="Your Level" />
                    <Bar dataKey="required" fill="#DFFF00" name="Required Level" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Gaps List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-primary p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                  <h3 className="font-heading text-2xl font-bold uppercase text-primary-foreground tracking-tight">
                    Skills to Develop
                  </h3>
                </div>
                <div className="space-y-4">
                  {chartData
                    .filter((item) => item.gap > 0)
                    .map((item, index) => (
                      <div key={index} className="bg-primary-foreground/10 p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-paragraph text-sm uppercase tracking-wider text-primary-foreground">
                            {item.skill}
                          </p>
                          <p className="font-paragraph text-xs text-primary-foreground/60">
                            Gap: {item.gap}/10
                          </p>
                        </div>
                        <div className="w-full h-2 bg-primary-foreground/20">
                          <div
                            className="h-full bg-primary-foreground"
                            style={{ width: `${(item.current / item.required) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  {chartData.filter((item) => item.gap > 0).length === 0 && (
                    <p className="font-paragraph text-sm text-primary-foreground/80">
                      Great job! You meet all the skill requirements.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-primary/5 p-8 space-y-6">
                <h3 className="font-heading text-2xl font-bold uppercase text-primary tracking-tight">
                  Next Steps
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-heading text-xs text-primary-foreground">1</span>
                    </div>
                    <p className="font-paragraph text-sm text-foreground leading-relaxed">
                      Review your personalized learning roadmap with targeted resources
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-heading text-xs text-primary-foreground">2</span>
                    </div>
                    <p className="font-paragraph text-sm text-foreground leading-relaxed">
                      Focus on skills with the largest gaps first for maximum impact
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-heading text-xs text-primary-foreground">3</span>
                    </div>
                    <p className="font-paragraph text-sm text-foreground leading-relaxed">
                      Track your progress and retake assessments to measure improvement
                    </p>
                  </li>
                </ul>
                <Link to="/roadmap">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph text-sm uppercase tracking-wider mt-6">
                    View Learning Roadmap
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
