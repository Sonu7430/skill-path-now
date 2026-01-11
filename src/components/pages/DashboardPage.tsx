import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Careers, LearningResources } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { Target, TrendingUp, BookOpen, Award, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { member } = useMember();
  const { answers, completedAt, selectedCareer } = useAssessmentStore();
  const [career, setCareer] = useState<Careers | null>(null);
  const [resources, setResources] = useState<LearningResources[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { items: allResources } = await BaseCrudService.getAll<LearningResources>('learningresources');
      setResources(allResources.slice(0, 3));

      if (selectedCareer) {
        const careerData = await BaseCrudService.getById<Careers>('careers', selectedCareer);
        setCareer(careerData);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedCareer]);

  const assessmentProgress = answers.length > 0 ? Math.min((answers.length / 10) * 100, 100) : 0;
  const hasCompletedAssessment = completedAt !== null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-primary leading-tight tracking-tighter mb-4">
              Dashboard
            </h1>
            <p className="font-paragraph text-lg text-foreground">
              Welcome back, {member?.profile?.nickname || 'Student'}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-primary p-8 space-y-4"
            >
              <Target className="w-10 h-10 text-primary-foreground" strokeWidth={1.5} />
              <div>
                <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/80 mb-2">
                  Assessment Status
                </p>
                <p className="font-heading text-3xl font-bold text-primary-foreground">
                  {hasCompletedAssessment ? 'Complete' : 'In Progress'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-primary/5 p-8 space-y-4"
            >
              <TrendingUp className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <div>
                <p className="font-paragraph text-xs uppercase tracking-wider text-foreground/60 mb-2">
                  Questions Answered
                </p>
                <p className="font-heading text-3xl font-bold text-primary">
                  {answers.length}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-primary/5 p-8 space-y-4"
            >
              <BookOpen className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <div>
                <p className="font-paragraph text-xs uppercase tracking-wider text-foreground/60 mb-2">
                  Resources Available
                </p>
                <p className="font-heading text-3xl font-bold text-primary">
                  {resources.length}+
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-primary p-8 space-y-4"
            >
              <Award className="w-10 h-10 text-primary-foreground" strokeWidth={1.5} />
              <div>
                <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/80 mb-2">
                  Target Career
                </p>
                <p className="font-heading text-xl font-bold text-primary-foreground">
                  {career?.careerName || 'Not Set'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <h2 className="font-heading text-3xl font-bold uppercase text-primary tracking-tight">
                Quick Actions
              </h2>

              <div className="space-y-4">
                {!hasCompletedAssessment && (
                  <Link to="/assessment">
                    <div className="bg-primary p-8 hover:bg-primary/90 transition-colors group cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="font-heading text-2xl font-bold uppercase text-primary-foreground tracking-tight">
                            Continue Assessment
                          </h3>
                          <p className="font-paragraph text-sm text-primary-foreground/80">
                            {assessmentProgress}% complete
                          </p>
                          <div className="w-full max-w-xs h-2 bg-primary-foreground/20 mt-4">
                            <div
                              className="h-full bg-primary-foreground transition-all"
                              style={{ width: `${assessmentProgress}%` }}
                            />
                          </div>
                        </div>
                        <ArrowRight className="w-8 h-8 text-primary-foreground group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )}

                {hasCompletedAssessment && (
                  <Link to="/gap-analysis">
                    <div className="bg-primary p-8 hover:bg-primary/90 transition-colors group cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="font-heading text-2xl font-bold uppercase text-primary-foreground tracking-tight">
                            View Skill Gap Analysis
                          </h3>
                          <p className="font-paragraph text-sm text-primary-foreground/80">
                            See how your skills compare to your target career
                          </p>
                        </div>
                        <ArrowRight className="w-8 h-8 text-primary-foreground group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )}

                <Link to="/roadmap">
                  <div className="bg-primary/5 p-8 hover:bg-primary/10 transition-colors group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-heading text-2xl font-bold uppercase text-primary tracking-tight">
                          Learning Roadmap
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/80">
                          Follow your personalized learning path
                        </p>
                      </div>
                      <ArrowRight className="w-8 h-8 text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>

                <Link to="/progress">
                  <div className="bg-primary/5 p-8 hover:bg-primary/10 transition-colors group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-heading text-2xl font-bold uppercase text-primary tracking-tight">
                          Track Progress
                        </h3>
                        <p className="font-paragraph text-sm text-foreground/80">
                          Monitor your skill development over time
                        </p>
                      </div>
                      <ArrowRight className="w-8 h-8 text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Recent Resources */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl font-bold uppercase text-primary tracking-tight">
                Learning Resources
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-primary/5 p-6 animate-pulse">
                      <div className="h-4 bg-primary/20 w-3/4 mb-3" />
                      <div className="h-3 bg-primary/20 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div key={resource._id} className="bg-primary/5 p-6 space-y-3">
                      <h3 className="font-heading text-lg font-bold uppercase text-primary tracking-tight">
                        {resource.resourceName}
                      </h3>
                      <p className="font-paragraph text-xs text-foreground/80 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="font-paragraph text-xs uppercase tracking-wider text-primary">
                          {resource.resourceType}
                        </span>
                        {resource.estimatedDurationMinutes && (
                          <span className="font-paragraph text-xs text-foreground/60">
                            {resource.estimatedDurationMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <Link to="/roadmap">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-paragraph text-xs uppercase tracking-wider"
                    >
                      View All Resources
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
