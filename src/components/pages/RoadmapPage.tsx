import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { LearningResources } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { BookOpen, Clock, ExternalLink, CheckCircle, Circle } from 'lucide-react';

export default function RoadmapPage() {
  const { member } = useMember();
  const { getSkillScores } = useAssessmentStore();
  const [resources, setResources] = useState<LearningResources[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { items: allResources } = await BaseCrudService.getAll<LearningResources>('learningresources');
      
      // Sort by difficulty level
      const sorted = allResources.sort((a, b) => {
        const difficultyOrder: Record<string, number> = {
          Beginner: 1,
          Intermediate: 2,
          Advanced: 3,
        };
        return (
          (difficultyOrder[a.difficultyLevel || 'Beginner'] || 1) -
          (difficultyOrder[b.difficultyLevel || 'Beginner'] || 1)
        );
      });
      
      setResources(sorted);
      
      // Load completed resources from localStorage
      const saved = localStorage.getItem('completedResources');
      if (saved) {
        setCompletedResources(new Set(JSON.parse(saved)));
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleResourceCompletion = (resourceId: string) => {
    const newCompleted = new Set(completedResources);
    if (newCompleted.has(resourceId)) {
      newCompleted.delete(resourceId);
    } else {
      newCompleted.add(resourceId);
    }
    setCompletedResources(newCompleted);
    localStorage.setItem('completedResources', JSON.stringify(Array.from(newCompleted)));
  };

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'Beginner':
        return 'text-primary';
      case 'Intermediate':
        return 'text-foreground';
      case 'Advanced':
        return 'text-destructive';
      default:
        return 'text-primary';
    }
  };

  const groupedResources = resources.reduce((acc, resource) => {
    const level = resource.difficultyLevel || 'Beginner';
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(resource);
    return acc;
  }, {} as Record<string, LearningResources[]>);

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
              Learning Roadmap
            </h1>

            {/* Progress Overview */}
            <div className="bg-primary p-8 lg:p-12 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">
                    Total Resources
                  </p>
                  <p className="font-heading text-5xl font-bold text-primary-foreground">
                    {resources.length}
                  </p>
                </div>
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">
                    Completed
                  </p>
                  <p className="font-heading text-5xl font-bold text-primary-foreground">
                    {completedResources.size}
                  </p>
                </div>
                <div>
                  <p className="font-paragraph text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">
                    Progress
                  </p>
                  <p className="font-heading text-5xl font-bold text-primary-foreground">
                    {resources.length > 0
                      ? Math.round((completedResources.size / resources.length) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </div>
              <div className="w-full h-3 bg-primary-foreground/20 mt-8">
                <div
                  className="h-full bg-primary-foreground transition-all duration-500"
                  style={{
                    width: `${
                      resources.length > 0
                        ? (completedResources.size / resources.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Learning Path */}
            <div className="space-y-12">
              {Object.entries(groupedResources).map(([level, levelResources], levelIndex) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: levelIndex * 0.1 }}
                >
                  <div className="mb-8">
                    <h2 className="font-heading text-4xl font-bold uppercase text-primary tracking-tight mb-2">
                      {level} Level
                    </h2>
                    <div className="w-24 h-1 bg-primary" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {levelResources.map((resource, index) => {
                      const isCompleted = completedResources.has(resource._id);
                      return (
                        <motion.div
                          key={resource._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className={`p-8 transition-all ${
                            isCompleted ? 'bg-primary' : 'bg-primary/5 hover:bg-primary/10'
                          }`}
                        >
                          <div className="flex items-start gap-4 mb-6">
                            <button
                              onClick={() => toggleResourceCompletion(resource._id)}
                              className="flex-shrink-0 mt-1"
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-8 h-8 text-primary-foreground" />
                              ) : (
                                <Circle className="w-8 h-8 text-primary hover:text-primary/70 transition-colors" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <BookOpen
                                  className={`w-5 h-5 ${
                                    isCompleted ? 'text-primary-foreground' : 'text-primary'
                                  }`}
                                />
                                <span
                                  className={`font-paragraph text-xs uppercase tracking-wider ${
                                    isCompleted
                                      ? 'text-primary-foreground/80'
                                      : 'text-foreground/60'
                                  }`}
                                >
                                  {resource.resourceType}
                                </span>
                              </div>
                              <h3
                                className={`font-heading text-2xl font-bold uppercase tracking-tight mb-3 ${
                                  isCompleted ? 'text-primary-foreground' : 'text-primary'
                                }`}
                              >
                                {resource.resourceName}
                              </h3>
                              <p
                                className={`font-paragraph text-sm leading-relaxed mb-4 ${
                                  isCompleted
                                    ? 'text-primary-foreground/80'
                                    : 'text-foreground/80'
                                }`}
                              >
                                {resource.description}
                              </p>
                              <div className="flex items-center gap-4 mb-4">
                                {resource.estimatedDurationMinutes && (
                                  <div className="flex items-center gap-2">
                                    <Clock
                                      className={`w-4 h-4 ${
                                        isCompleted
                                          ? 'text-primary-foreground/60'
                                          : 'text-foreground/60'
                                      }`}
                                    />
                                    <span
                                      className={`font-paragraph text-xs ${
                                        isCompleted
                                          ? 'text-primary-foreground/80'
                                          : 'text-foreground/80'
                                      }`}
                                    >
                                      {resource.estimatedDurationMinutes} min
                                    </span>
                                  </div>
                                )}
                                <span
                                  className={`font-paragraph text-xs uppercase tracking-wider ${
                                    isCompleted
                                      ? 'text-primary-foreground'
                                      : getDifficultyColor(resource.difficultyLevel)
                                  }`}
                                >
                                  {resource.difficultyLevel}
                                </span>
                              </div>
                              {resource.resourceURL && (
                                <a
                                  href={resource.resourceURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    variant={isCompleted ? 'outline' : 'default'}
                                    size="sm"
                                    className={
                                      isCompleted
                                        ? 'border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-paragraph text-xs uppercase tracking-wider'
                                        : 'bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph text-xs uppercase tracking-wider'
                                    }
                                  >
                                    Access Resource
                                    <ExternalLink className="w-3 h-3 ml-2" />
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {resources.length === 0 && (
              <div className="bg-primary/5 p-12 text-center">
                <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="font-heading text-3xl font-bold uppercase text-primary tracking-tight mb-4">
                  No Resources Available
                </h2>
                <p className="font-paragraph text-base text-foreground max-w-2xl mx-auto">
                  Complete your skill assessment to get personalized learning recommendations.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
