import { Button } from "@/components/ui/button";
import { SignIn, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, ChevronRight, Command, BarChart2, FileText, PieChart, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
};

const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white">
      <AnimatePresence>
        {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-gray-800/50"
      >
        <div className="container flex h-16 w-full items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2 text-white font-bold text-xl">
              <Command className="h-6 w-6" />
              TechtaTube
            </a>
          </div>
          
          <nav className="flex items-center gap-8">
            {["Home", "About", "Services", "Blog", "Contact"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative"
        >
          <div className="container max-w-6xl mx-auto px-4">
            <motion.div 
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <motion.div 
                variants={scaleIn}
                className="inline-flex items-center bg-white/5 rounded-full px-4 py-1.5 mb-8 border border-white/10"
              >
                <span className="text-sm">🚀 AI-Powered Content Creation</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
              >
                Smart Solutions,<span className="text-gray-400">And</span><br />
                Simple <span className="text-yellow-400">Interface</span>
              </motion.h1>
              
              <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
                The power of AI-driven content creation, providing intelligent insights and 
                predictive analytics to elevate your online presence.
              </p>

              <div className="flex items-center justify-center gap-6">
                <SignUpButton mode="modal">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-500 px-8">
                    Get Started
                  </Button>
                </SignUpButton>
                <Button variant="outline" className="border-gray-800 hover:bg-gray-800">
                  Try for Free
                </Button>
              </div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
            >
              {[
                {
                  title: "Content Management",
                  description: "Create, organize, and publish content across multiple platforms",
                  icon: FileText
                },
                {
                  title: "Performance Tracking",
                  description: "Monitor performance with real-time analytics",
                  icon: BarChart2
                },
                {
                  title: "Reporting & Analytics",
                  description: "Comprehensive reports for content optimization",
                  icon: PieChart
                },
                {
                  title: "Task & Activity",
                  description: "Integrated task management for content creators",
                  icon: CheckCircle
                }
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="bg-black/40 rounded-2xl p-6 border border-white/5 backdrop-blur-sm"
                >
                  <feature.icon className="h-6 w-6 text-yellow-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-20 bg-black/30"
        >
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={slideIn}
                className="space-y-6"
              >
                <div className="text-yellow-400 font-medium mb-4">TechtaTube Benefits</div>
                <h2 className="text-3xl font-bold mb-6">
                  Experience content creation like never before in your journey to audience growth.
                </h2>
                
                <div className="flex items-center mt-8">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">1.5K+</span>
                    <span className="text-gray-400">Active Users</span>
                  </div>
                  <div className="flex -space-x-3 ml-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full bg-gray-600 border-2 border-black ring-2 ring-yellow-400/20" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-400 mt-8">
                  Our application is intuitively crafted to streamline the way you create and manage content, 
                  enhancing engagement and saving you valuable time.
                </p>
              </motion.div>
              
              {/* Sign-in Form */}
              <motion.div
                variants={scaleIn}
                className="bg-black/40 rounded-2xl p-8 border border-white/5 backdrop-blur-sm"
              >
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2">Sign In to TechtaTube</h3>
                  <p className="text-sm text-gray-400">Access your dashboard and start creating</p>
                </div>
                
                <div className="space-y-4">
                  <SignIn />
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
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                          <div>
                            <div className="text-sm">User {i}</div>
                            <div className="text-xs text-gray-400">Active now</div>
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
                <h2 className="text-2xl font-bold">A Deep Dive into the TechtaTube Approach</h2>
                <Button variant="ghost" className="text-yellow-400 hover:text-yellow-500">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    title: "Exploring the Impact of TechtaTube on Content Creation",
                    description: "Discover how our AI-powered platform is revolutionizing the way creators produce engaging content."
                  },
                  {
                    title: "Taking Your Channel to New Heights",
                    description: "Learn strategies to grow your audience and increase engagement using TechtaTube's suite of tools."
                  },
                  {
                    title: "TechtaTube Insights: Redefining the Path to Content Excellence",
                    description: "Explore how data-driven insights can transform your content strategy and audience engagement."
                  }
                ].map((article) => (
                  <div key={article.title} className="flex justify-between items-start p-6 bg-black/40 rounded-xl border border-white/5">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <p className="text-gray-400 text-sm">{article.description}</p>
                    </div>
                    <Button variant="ghost" className="text-yellow-400 hover:text-yellow-500">
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
                  <span className="text-yellow-400 text-sm">Dashboard Analytics</span>
                </div>
                <h2 className="text-4xl font-bold">Powerful Insights<br />At Your Fingertips</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-yellow-400"></div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">80%</div>
                        <div className="text-sm text-gray-400">Engagement Rate</div>
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
                        <div className="text-sm text-gray-400">Satisfaction</div>
                      </div>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-purple-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="text-sm text-gray-400">Weekly Growth</div>
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
                    <h3 className="text-lg font-semibold">Real-time Analytics</h3>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-400"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { label: 'Content Views', value: '12.5k', growth: '+22%' },
                      { label: 'Engagement', value: '8.2k', growth: '+15%' },
                      { label: 'Subscribers', value: '2.4k', growth: '+18%' }
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <div className="text-sm text-gray-400">{stat.label}</div>
                          <div className="text-xl font-bold">{stat.value}</div>
                        </div>
                        <div className="text-green-400">{stat.growth}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium">Top Performing Content</h4>
                      <Button variant="ghost" size="sm" className="text-yellow-400">
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { title: 'AI in Content Creation', views: '5.2k' },
                        { title: 'Growth Strategies', views: '4.8k' },
                        { title: 'Engagement Tips', views: '3.9k' }
                      ].map((content, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-gradient-to-br from-yellow-400/20 to-purple-400/20 flex items-center justify-center">
                              {i + 1}
                            </div>
                            <span className="text-sm">{content.title}</span>
                          </div>
                          <span className="text-sm text-gray-400">{content.views} views</span>
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
                TechtaTube dashboard stands at the forefront of content creation solutions, offering a comprehensive 
                and intuitive platform designed to elevate creators&lsquo; interaction with their audience.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '200K+', label: 'Content Creators Worldwide', bgClass: 'bg-yellow-400/10', hoverClass: 'group-hover:bg-yellow-400/20' },
                { number: '150K+', label: 'Viewer Interactions Daily', bgClass: 'bg-purple-400/10', hoverClass: 'group-hover:bg-purple-400/20' },
                { number: '98%', label: 'Creator Satisfaction', bgClass: 'bg-green-400/10', hoverClass: 'group-hover:bg-green-400/20' },
                { number: '2B+', label: 'Views Generated Monthly', bgClass: 'bg-blue-400/10', hoverClass: 'group-hover:bg-blue-400/20' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 ${stat.bgClass} blur-xl ${stat.hoverClass} transition-all duration-300`}></div>
                  <div className="relative bg-black/40 rounded-2xl border border-white/5 p-6 h-full">
                    <div className="text-3xl font-bold mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="inline-flex items-center justify-center gap-2 bg-yellow-400/10 rounded-full px-4 py-2">
                <span className="text-yellow-400 font-semibold">10 Years</span>
                <span className="text-sm text-gray-400">Industry Excellence</span>
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
                  {['About Us', 'Our Mission', 'Services', 'Blog'].map((link) => (
                    <a 
                      key={link} 
                      href="#" 
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              {/* Platform */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Platform</h4>
                <div className="space-y-2">
                  {['Pricing', 'Features', 'Classroom', 'Careers'].map((link) => (
                    <a 
                      key={link} 
                      href="#" 
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Connect</h4>
                <div className="space-y-2">
                  {['Instagram', 'Twitter', 'Facebook', 'LinkedIn'].map((social) => (
                    <a 
                      key={social} 
                      href="#" 
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © 2024 TechtaTube. All rights reserved.
              </div>
              <div className="flex items-center gap-8">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </motion.footer>
      </main>
      </AnimatePresence>
    </div>
  );
}