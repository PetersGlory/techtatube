"use client";

import { Button } from "@/components/ui/button";
import {
  SignIn,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  ChevronRight,
  Command,
  BarChart2,
  FileText,
  PieChart,
  CheckCircle,
  Menu,
  Check,
  Youtube,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { clerkTheme } from "@/lib/clerk-theme";
import { useState } from "react";
import { AuthRedirect } from "@/components/auth-redirect";
import Link from "next/link";
import { routes } from "@/lib/navigation";
import { useRouter } from "next/navigation";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 },
};

const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 },
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useUser();
  const router = useRouter();

  const handleSelectPlan = async (plan: string) => {
    router.push(routes.pricing);
  };

  return (
    <>
      <AuthRedirect />
      <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white">
        <AnimatePresence>
          {/* Navigation */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-gray-800/50"
          >
            <div className="px-4 md:px-16 flex h-16 w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="flex items-center gap-2 text-white font-bold text-xl"
                >
                  <Command className="h-6 w-6" />
                  TechtaTube
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {["Home", "About", "Services", "Blog", "Contact"].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  )
                )}
              </nav>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-4">
                {!user.isSignedIn ? (
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                ) : (
                  <Link href={routes.dashboard}>
                    <Button
                      variant="ghost"
                      className="text-gray-400 bg-white/5 hover:text-white"
                    >
                      <UserButton /> Dashboard
                    </Button>
                  </Link>
                )}

                {!user.isSignedIn && (
                  <SignUpButton mode="modal">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                      Get Started
                    </Button>
                  </SignUpButton>
                )}
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden absolute top-16 left-0 right-0 bg-[#0A0A0A] border-b border-gray-800/50"
              >
                <div className="container py-4">
                  <nav className="flex flex-col gap-4">
                    {["Home", "About", "Services", "Blog", "Contact"].map(
                      (item) => (
                        <a
                          key={item}
                          href={`#${item.toLowerCase()}`}
                          className="text-gray-400 hover:text-white transition-colors px-4 py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item}
                        </a>
                      )
                    )}
                    <div className="flex flex-col gap-2 p-4 border-t border-gray-800/50">
                      {user.isSignedIn ? (
                        <Link href={routes.dashboard}>
                          <Button
                            variant="ghost"
                            className="text-gray-400 bg-white/5 hover:text-white"
                          >
                            <UserButton /> Dashboard
                          </Button>
                        </Link>
                      ) : (
                        <SignInButton mode="modal">
                          <Button
                            variant="ghost"
                            className="w-full text-gray-400 hover:text-white"
                          >
                            Sign In
                          </Button>
                        </SignInButton>
                      )}
                      {!user.isSignedIn && (
                        <SignUpButton mode="modal">
                          <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                            Get Started
                          </Button>
                        </SignUpButton>
                      )}
                    </div>
                  </nav>
                </div>
              </motion.div>
            )}
          </motion.header>

          <main className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent"></div>
            {/* Hero Section */}
            <motion.section
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="relative min-h-screen flex items-center justify-center overflow-hidden"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-purple-400/10 to-transparent" />

              {/* Animated Circles */}
              <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
              </div>

              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  variants={fadeInUp}
                  className="max-w-4xl mx-auto text-center"
                >
                  <motion.div
                    variants={scaleIn}
                    className="inline-flex items-center bg-white/5 rounded-full px-4 py-1.5 mb-8 border border-white/10"
                  >
                    <span className="text-sm">
                      🚀 AI-Powered Content Creation
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={fadeInUp}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
                  >
                    Smart Solutions,<span className="text-gray-400">And</span>
                    <br />
                    Simple <span className="text-yellow-400">Interface</span>
                  </motion.h1>

                  <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
                    The power of AI-driven content creation, providing
                    intelligent insights and predictive analytics to elevate
                    your online presence.
                  </p>

                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <SignUpButton mode="modal">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-yellow-400 to-purple-400 hover:from-yellow-500 hover:to-purple-500"
                      >
                        Get Started Free
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </SignUpButton>

                    <Link href={routes.pricing}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/20 hover:bg-white/10"
                      >
                        View Pricing
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1 h-1 bg-white rounded-full"
                  />
                </div>
              </motion.div>
            </motion.section>

            {/* Feature Cards */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="py-24 relative bg-black/30"
            >
              <div className="container mx-auto px-4">
                <motion.div
                  variants={fadeInUp}
                  className="text-center max-w-3xl mx-auto mb-16"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Powerful Features for Content Creators
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Everything you need to analyze and optimize your video
                    content
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {[
                    {
                      icon: <Youtube className="h-6 w-6" />,
                      title: "Video Processing",
                      description:
                        "Upload YouTube videos and get instant transcripts with AI-powered analysis",
                      gradient: "from-yellow-400 to-orange-500",
                    },
                    {
                      icon: <Sparkles className="h-6 w-6" />,
                      title: "AI Analysis",
                      description:
                        "Get intelligent insights, summaries, and key points from your video content",
                      gradient: "from-purple-400 to-pink-500",
                    },
                    {
                      icon: <BarChart2 className="h-6 w-6" />,
                      title: "Analytics",
                      description:
                        "Track performance metrics and engagement analytics in real-time",
                      gradient: "from-blue-400 to-cyan-500",
                    },
                    {
                      icon: <FileText className="h-6 w-6" />,
                      title: "Content Insights",
                      description:
                        "Understand sentiment analysis and content ratings automatically",
                      gradient: "from-green-400 to-emerald-500",
                    },
                    {
                      icon: <CheckCircle className="h-6 w-6" />,
                      title: "Smart Suggestions",
                      description:
                        "Receive AI-powered recommendations for content optimization",
                      gradient: "from-red-400 to-rose-500",
                    },
                    {
                      icon: <Command className="h-6 w-6" />,
                      title: "Easy Integration",
                      description:
                        "Seamlessly connect with your existing YouTube content workflow",
                      gradient: "from-indigo-400 to-violet-500",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: {
                          opacity: 1,
                          y: 0,
                          transition: { delay: i * 0.1 },
                        },
                      }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl -z-10" />
                      <div className="bg-black/40 border border-white/5 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
                        {/* Gradient Orb */}
                        <div
                          className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-r ${feature.gradient} rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300`}
                        />

                        <div
                          className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4`}
                        >
                          {feature.icon}
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Feature Cards */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="py-20 bg-black/30"
            >
              <div className="container max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div variants={slideIn} className="space-y-6">
                    <div className="text-yellow-400 font-medium mb-4">
                      TechtaTube Benefits
                    </div>
                    <h2 className="text-3xl font-bold mb-6">
                      Experience content creation like never before in your
                      journey to audience growth.
                    </h2>

                    <div className="flex items-center mt-8">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold">1.5K+</span>
                        <span className="text-gray-400">Active Users</span>
                      </div>
                      <div className="flex -space-x-3 ml-6">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-10 w-10 rounded-full bg-gray-600 border-2 border-black ring-2 ring-yellow-400/20"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-400 mt-8">
                      Our application is intuitively crafted to streamline the
                      way you create and manage content, enhancing engagement
                      and saving you valuable time.
                    </p>
                  </motion.div>

                  {/* Sign-in Form */}
                  <motion.div
                    variants={scaleIn}
                    className="bg-black/40 rounded-2xl p-8 border border-white/5 backdrop-blur-sm"
                  >
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-2">
                        Sign In to TechtaTube
                      </h3>
                      <p className="text-sm text-gray-400">
                        Access your dashboard and start creating
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SignIn
                        appearance={{
                          elements: {
                            ...clerkTheme.elements,
                            card: "w-full bg-black/40 border text-gray-200 border-white/5 backdrop-blur-sm shadow-xl",
                            headerTitle: "text-2xl font-bold text-white",
                            headerSubtitle: "text-gray-400 text-sm",
                            formButtonPrimary:
                              "w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium shadow-lg",
                            formFieldInput:
                              "bg-black/40 border-gray-800 text-white focus:border-yellow-400/50 rounded-lg",
                            socialButtonsBlockButton:
                              "w-full bg-black/40 border border-white/5 hover:bg-white/5 text-white rounded-lg",
                            footerActionLink:
                              "text-yellow-400 hover:text-yellow-500 font-medium",
                            dividerLine: "bg-gray-800",
                            dividerText: "text-gray-400 text-sm",
                          },
                        }}
                      />
                    </div>

                    {/* Customer List Preview */}
                    <div className="mt-8 pt-8 border-t border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Online Users</span>
                        </div>
                        <span className="text-xs text-gray-400">View All</span>
                      </div>

                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                              <div>
                                <div className="text-sm">User {i}</div>
                                <div className="text-xs text-gray-400">
                                  Active now
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-green-500">Online</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* Pricing Section */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="py-20"
            >
              <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <motion.div variants={fadeInUp}>
                    <div className="inline-flex items-center bg-yellow-400/10 rounded-full px-4 py-1.5 mb-8">
                      <span className="text-yellow-400 text-sm">
                        Pricing Plans
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">
                      Choose Your Perfect Plan
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                      Select the plan that best fits your needs. All plans
                      include our core features with different usage limits.
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  variants={staggerContainer}
                  className="grid md:grid-cols-3 gap-8"
                >
                  {/* Free Plan */}
                  <motion.div
                    variants={fadeInUp}
                    className="bg-black/40 rounded-2xl p-8 border border-white/5 backdrop-blur-sm relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Starter</h3>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-gray-400 ml-2">/month</span>
                      </div>
                      <p className="text-gray-400">
                        Perfect for trying out our features
                      </p>
                      <ul className="space-y-3 py-6">
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>5 videos per month</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>Basic analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>Community support</span>
                        </li>
                      </ul>
                      <Button
                        className="w-full text-gray-800 bg-white/90 hover:bg-white/80"
                        onClick={() => handleSelectPlan("starter")}
                      >
                        Get Started
                      </Button>
                    </div>
                  </motion.div>

                  {/* Pro Plan */}
                  <motion.div
                    variants={fadeInUp}
                    className="bg-yellow-400/5 rounded-2xl p-8 border border-yellow-400/20 backdrop-blur-sm relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Pro</h3>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">$29</span>
                        <span className="text-gray-400 ml-2">/month</span>
                      </div>
                      <p className="text-gray-400">
                        For content creators and small teams
                      </p>
                      <ul className="space-y-3 py-6">
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>50 videos per month</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>Custom branding</span>
                        </li>
                      </ul>
                      <Button
                        className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                        onClick={() => handleSelectPlan("pro")}
                      >
                        Start Pro Trial
                      </Button>
                    </div>
                  </motion.div>

                  {/* Enterprise Plan */}
                  <motion.div
                    variants={fadeInUp}
                    className="bg-black/40 rounded-2xl p-8 border border-white/5 backdrop-blur-sm relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Enterprise</h3>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">$99</span>
                        <span className="text-gray-400 ml-2">/month</span>
                      </div>
                      <p className="text-gray-400">
                        For large teams and organizations
                      </p>
                      <ul className="space-y-3 py-6">
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>Unlimited videos</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>Custom analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>24/7 Dedicated support</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>API access</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-5 w-5 text-yellow-400 mr-2" />
                          <span>Custom integrations</span>
                        </li>
                      </ul>
                      <Button
                        className="w-full text-gray-800 bg-white/90 hover:bg-white/80"
                        onClick={() => handleSelectPlan("enterprise")}
                      >
                        Contact Sales
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.section>

            {/* FAQ Section */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="py-20"
            >
              <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h3 className="text-2xl font-semibold mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8 mt-8 text-left max-w-4xl mx-auto">
                    {[
                      {
                        q: "How does the video limit work?",
                        a: "Video limits reset monthly. Unused videos don't roll over to the next month.",
                      },
                      {
                        q: "Can I upgrade or downgrade my plan?",
                        a: "Yes, you can change your plan at any time. Changes take effect on your next billing cycle.",
                      },
                      {
                        q: "Is there a free trial?",
                        a: "Yes, all paid plans come with a 14-day free trial. No credit card required.",
                      },
                      {
                        q: "What payment methods do you accept?",
                        a: "We accept all major credit cards, PayPal, and wire transfers for enterprise plans.",
                      },
                    ].map((faq, i) => (
                      <div
                        key={i}
                        className="bg-black/40 rounded-xl p-6 border border-white/5"
                      >
                        <h4 className="font-semibold mb-2">{faq.q}</h4>
                        <p className="text-gray-400 text-sm">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Info Section */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="py-20"
            >
              <div className="container max-w-6xl mx-auto px-4">
                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                      A Deep Dive into the TechtaTube Approach
                    </h2>
                    <Button
                      variant="ghost"
                      className="text-yellow-400 hover:text-yellow-500"
                    >
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {[
                      {
                        title:
                          "Exploring the Impact of TechtaTube on Content Creation",
                        description:
                          "Discover how our AI-powered platform is revolutionizing the way creators produce engaging content.",
                      },
                      {
                        title: "Taking Your Channel to New Heights",
                        description:
                          "Learn strategies to grow your audience and increase engagement using TechtaTube's suite of tools.",
                      },
                      {
                        title:
                          "TechtaTube Insights: Redefining the Path to Content Excellence",
                        description:
                          "Explore how data-driven insights can transform your content strategy and audience engagement.",
                      },
                    ].map((article) => (
                      <div
                        key={article.title}
                        className="flex justify-between items-start p-6 bg-black/40 rounded-xl border border-white/5"
                      >
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {article.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          className="text-yellow-400 hover:text-yellow-500"
                        >
                          Read More <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Dashboard Preview Section */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="py-24 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent"></div>
              <div className="container max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Engagement Stats */}
                  <div className="space-y-8">
                    <div className="inline-flex items-center px-4 py-1 bg-yellow-400/10 rounded-full">
                      <span className="text-yellow-400 text-sm">
                        Dashboard Analytics
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold">
                      Powerful Insights
                      <br />
                      At Your Fingertips
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-yellow-400"></div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">80%</div>
                            <div className="text-sm text-gray-400">
                              Engagement Rate
                            </div>
                          </div>
                        </div>
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full w-[80%] bg-yellow-400 rounded-full"></div>
                        </div>
                      </div>

                      <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-purple-400/20 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-purple-400"></div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">95%</div>
                            <div className="text-sm text-gray-400">
                              Satisfaction
                            </div>
                          </div>
                        </div>
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full w-[95%] bg-purple-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="text-sm text-gray-400">
                          Weekly Growth
                        </div>
                        <div className="flex items-end h-24 gap-1">
                          {[40, 70, 30, 85, 50, 65, 90].map((height, i) => (
                            <div
                              key={i}
                              style={{ height: `${height}%` }}
                              className="flex-1 bg-gradient-to-t from-yellow-400/50 to-yellow-400/20 rounded-t-lg"
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Mon</span>
                          <span>Sun</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Preview */}
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 blur-3xl"></div>
                    <div className="relative bg-black/40 rounded-2xl border border-white/5 p-8">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-semibold">
                          Real-time Analytics
                        </h3>
                        <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-400"></div>
                          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                          <div className="h-2 w-2 rounded-full bg-green-400"></div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {[
                          {
                            label: "Content Views",
                            value: "12.5k",
                            growth: "+22%",
                          },
                          {
                            label: "Engagement",
                            value: "8.2k",
                            growth: "+15%",
                          },
                          {
                            label: "Subscribers",
                            value: "2.4k",
                            growth: "+18%",
                          },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                          >
                            <div>
                              <div className="text-sm text-gray-400">
                                {stat.label}
                              </div>
                              <div className="text-xl font-bold">
                                {stat.value}
                              </div>
                            </div>
                            <div className="text-green-400">{stat.growth}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-medium">
                            Top Performing Content
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-400"
                          >
                            View All
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { title: "AI in Content Creation", views: "5.2k" },
                            { title: "Growth Strategies", views: "4.8k" },
                            { title: "Engagement Tips", views: "3.9k" },
                          ].map((content, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-gradient-to-br from-yellow-400/20 to-purple-400/20 flex items-center justify-center">
                                  {i + 1}
                                </div>
                                <span className="text-sm">{content.title}</span>
                              </div>
                              <span className="text-sm text-gray-400">
                                {content.views} views
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Statistics Section */}
            <motion.section
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="py-24 relative bg-black/50"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 via-purple-400/5 to-transparent"></div>
              <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                    TechtaTube dashboard stands at the forefront of content
                    creation solutions, offering a comprehensive and intuitive
                    platform designed to elevate creators&lsquo; interaction
                    with their audience.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    {
                      number: "200K+",
                      label: "Content Creators Worldwide",
                      bgClass: "bg-yellow-400/10",
                      hoverClass: "group-hover:bg-yellow-400/20",
                    },
                    {
                      number: "150K+",
                      label: "Viewer Interactions Daily",
                      bgClass: "bg-purple-400/10",
                      hoverClass: "group-hover:bg-purple-400/20",
                    },
                    {
                      number: "98%",
                      label: "Creator Satisfaction",
                      bgClass: "bg-green-400/10",
                      hoverClass: "group-hover:bg-green-400/20",
                    },
                    {
                      number: "2B+",
                      label: "Views Generated Monthly",
                      bgClass: "bg-blue-400/10",
                      hoverClass: "group-hover:bg-blue-400/20",
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      variants={scaleIn}
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      <div
                        className={`absolute inset-0 ${stat.bgClass} blur-xl ${stat.hoverClass} transition-all duration-300`}
                      ></div>
                      <div className="relative bg-black/40 rounded-2xl border border-white/5 p-6 h-full">
                        <div className="text-3xl font-bold mb-2">
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-400">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <div className="inline-flex items-center justify-center gap-2 bg-yellow-400/10 rounded-full px-4 py-2">
                    <span className="text-yellow-400 font-semibold">
                      10 Years
                    </span>
                    <span className="text-sm text-gray-400">
                      Industry Excellence
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-black/90 border-t border-white/5"
            >
              <div className="container max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  {/* Brand Column */}
                  <div className="space-y-4">
                    <a href="#" className="flex items-center gap-2">
                      <Command className="h-8 w-8 text-yellow-400" />
                      <span className="text-xl font-bold">TechtaTube</span>
                    </a>
                    <p className="text-sm text-gray-400">
                      Building enterprise level SaaS that people love to use.
                    </p>
                    <p className="text-lg font-medium">hello@techtaTube.com</p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Company</h4>
                    <div className="space-y-2">
                      {["About Us", "Our Mission", "Services", "Blog"].map(
                        (link) => (
                          <a
                            key={link}
                            href="#"
                            className="block text-gray-400 hover:text-white transition-colors"
                          >
                            {link}
                          </a>
                        )
                      )}
                    </div>
                  </div>

                  {/* Platform */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Platform</h4>
                    <div className="space-y-2">
                      {["Pricing", "Features", "Classroom", "Careers"].map(
                        (link) => (
                          <a
                            key={link}
                            href="#"
                            className="block text-gray-400 hover:text-white transition-colors"
                          >
                            {link}
                          </a>
                        )
                      )}
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Connect</h4>
                    <div className="space-y-2">
                      {["Instagram", "Twitter", "Facebook", "LinkedIn"].map(
                        (social) => (
                          <a
                            key={social}
                            href="#"
                            className="block text-gray-400 hover:text-white transition-colors"
                          >
                            {social}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-400">
                    © 2024 TechtaTube. All rights reserved.
                  </div>
                  <div className="flex items-center gap-8">
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </a>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </div>
                </div>
              </div>
            </motion.footer>
          </main>
        </AnimatePresence>
      </div>
    </>
  );
}