import React from 'react';

const Hero = () => {
  const scrollToAnalyzer = () => {
    const element = document.getElementById('keyword-analyzer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Unlock Hidden Money Opportunities with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Analyze keywords, generate tools, and uncover monetization strategies in minutes using AI.
        </p>
        <button 
          onClick={scrollToAnalyzer}
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          Start Analyzing Keywords
        </button>
        
        <div className="mt-12">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
            alt="AI Technology Visualization"
            className="rounded-xl shadow-2xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;