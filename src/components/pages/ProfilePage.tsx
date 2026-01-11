import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';

export default function ProfilePage() {
  const { member } = useMember();

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
              Your Profile
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-primary p-8 space-y-6">
                  <div className="w-24 h-24 bg-primary-foreground flex items-center justify-center mx-auto">
                    {member?.profile?.photo?.url ? (
                      <Image src={member.profile.photo.url} alt={member?.profile?.nickname || 'Profile'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-primary" />
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="font-heading text-2xl font-bold uppercase text-primary-foreground tracking-tight">
                      {member?.profile?.nickname || 'Student'}
                    </h2>
                    {member?.profile?.title && (
                      <p className="font-paragraph text-sm text-primary-foreground/80 mt-2">
                        {member.profile.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-primary/5 p-8 space-y-6">
                  <h3 className="font-heading text-2xl font-bold uppercase text-primary tracking-tight">
                    Account Information
                  </h3>

                  <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-start gap-4 pb-4 border-b border-primary/10">
                      <Mail className="w-5 h-5 text-primary mt-1" />
                      <div className="flex-1">
                        <p className="font-paragraph text-xs uppercase tracking-wider text-foreground/60 mb-1">
                          Email Address
                        </p>
                        <p className="font-paragraph text-base text-foreground">
                          {member?.loginEmail || 'Not provided'}
                        </p>
                        {member?.loginEmailVerified && (
                          <p className="font-paragraph text-xs text-primary mt-1">✓ Verified</p>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    {(member?.contact?.firstName || member?.contact?.lastName) && (
                      <div className="flex items-start gap-4 pb-4 border-b border-primary/10">
                        <User className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1">
                          <p className="font-paragraph text-xs uppercase tracking-wider text-foreground/60 mb-1">
                            Full Name
                          </p>
                          <p className="font-paragraph text-base text-foreground">
                            {[member?.contact?.firstName, member?.contact?.lastName]
                              .filter(Boolean)
                              .join(' ')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Member Since */}
                    {member?._createdDate && (
                      <div className="flex items-start gap-4 pb-4 border-b border-primary/10">
                        <Calendar className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1">
                          <p className="font-paragraph text-xs uppercase tracking-wider text-foreground/60 mb-1">
                            Member Since
                          </p>
                          <p className="font-paragraph text-base text-foreground">
                            {format(new Date(member._createdDate), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    {member?.status && (
                      <div className="flex items-start gap-4">
                        <Shield className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1">
                          <p className="font-paragraph text-xs uppercase tracking-wider text-foreground/60 mb-1">
                            Account Status
                          </p>
                          <p className="font-paragraph text-base text-foreground">
                            {member.status}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-primary p-8">
                  <h3 className="font-heading text-xl font-bold uppercase text-primary-foreground tracking-tight mb-4">
                    About Skill Navigator
                  </h3>
                  <p className="font-paragraph text-sm text-primary-foreground/80 leading-relaxed">
                    Your profile is the foundation of your personalized learning journey. As you complete assessments and progress through your roadmap, your profile will reflect your growing skills and achievements.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
