// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Brain, Sparkles, Upload, Mail, MessageSquare, Zap, CheckCircle, ArrowRight, Menu, X, AlertTriangle, Clock, Target } from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Instant Syllabus Scanning",
      description: "Upload PDFs, snap photos, or talk to AI. We extract every deadline instantly.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Crunch Week Detection",
      description: "AI identifies overwhelming weeks and alerts you before it's too late.",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Smart Email Monitoring",
      description: "Never miss critical updates. Auto-detect cancellations, extensions & extra credit.",
    }
  ];

  const capabilities = [
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "Smart Calendar Sync",
      details: ["PDF syllabus upload", "Photo deadline capture", "Voice-to-task entry", "Outlook integration"]
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
      title: "Proactive Alerts",
      details: ["Crunch week warnings", "Conflict detection", "Priority recommendations", "Daily/weekly summaries"]
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      title: "AI Email Scanner",
      details: ["Class cancellations", "Deadline extensions", "Exam changes", "Extra credit alerts"]
    },
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Smart Prioritization",
      details: ["Assignment weighting", "Auto calendar updates", "Impact analysis", "Action summaries"]
    }
  ];

  const painPoints = [
    {
      emoji: "😰",
      title: "Hours of Manual Entry",
      solution: "→ Automated in seconds"
    },
    {
      emoji: "📧",
      title: "Buried Important Emails",
      solution: "→ Instant priority alerts"
    },
    {
      emoji: "📅",
      title: "Forgotten Deadlines",
      solution: "→ Proactive reminders"
    },
    {
      emoji: "🤯",
      title: "Overwhelming Weeks",
      solution: "→ Early warning system"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                BAYMAX
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Benefits</a>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how" className="block text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#benefits" className="block text-gray-600 hover:text-gray-900">Benefits</a>
              <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Your Personal Academic Companion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Stop Drowning in
              <br />
              <span className="text-blue-600">
                Academic Chaos
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              BAYMAX transforms your syllabi, emails, and deadlines into an intelligent system that keeps you ahead—not behind.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-lg hover:border-gray-300 transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Rotating Feature Showcase */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex p-4 bg-blue-100 rounded-2xl mb-4">
                    {React.cloneElement(features[activeFeature].icon, { className: "w-8 h-8 text-blue-600" })}
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-gray-900">{features[activeFeature].title}</h3>
                  <p className="text-gray-600 text-lg">{features[activeFeature].description}</p>
                  
                  <div className="flex gap-2 mt-6">
                    {features.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFeature(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === activeFeature ? 'w-12 bg-blue-600' : 'w-1.5 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative h-64 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">
                      {activeFeature === 0 && '📄'}
                      {activeFeature === 1 && '⚠️'}
                      {activeFeature === 2 && '✉️'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            We Solve Your Biggest <span className="text-blue-600">Academic Headaches</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((pain, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="text-5xl mb-3">{pain.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{pain.title}</h3>
                <p className="text-blue-600 text-sm font-medium">{pain.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Powerful Features That <span className="text-blue-600">Work Together</span>
            </h2>
            <p className="text-gray-600 text-lg">Everything you need to stay organized and stress-free</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((cap, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    {cap.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{cap.title}</h3>
                  </div>
                </div>
                <ul className="space-y-2">
                  {cap.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Get Started in <span className="text-blue-600">3 Simple Steps</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "Upload Your Syllabi", desc: "Drop PDFs, snap photos, or connect your email", icon: <Upload /> },
              { num: "2", title: "AI Does the Work", desc: "We extract, organize, and prioritize everything", icon: <Brain /> },
              { num: "3", title: "Stay Ahead", desc: "Get alerts, summaries, and smart recommendations", icon: <Zap /> }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all">
                  <div className="text-6xl font-bold text-blue-100 mb-4">{step.num}</div>
                  <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
                    {React.cloneElement(step.icon, { className: "w-6 h-6 text-blue-600" })}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Take Control of Your Academic Life?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who've stopped stressing and started succeeding.
            </p>
            <button className="px-10 py-5 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all inline-flex items-center gap-3">
              Get BAYMAX Free
              <Sparkles className="w-5 h-5" />
            </button>
            <p className="text-sm text-blue-100 mt-4">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="mb-4">© 2024 BAYMAX. Your personal academic companion.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}