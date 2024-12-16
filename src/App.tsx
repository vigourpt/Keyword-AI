import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import KeywordAnalyzer from './components/KeywordAnalyzer';
import Features from './components/Features';
import CTASection from './components/CTASection';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="keyword-analyzer">
          <KeywordAnalyzer />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="cta">
          <CTASection />
        </section>
      </main>
    </div>
  );
};

export default App;