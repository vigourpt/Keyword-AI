import React from 'react';
import { Brain } from 'lucide-react';

const CTASection = () => {
  const scrollToAnalyzer = () => {
    const element = document.getElementById('keyword-analyzer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <Brain className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of successful entrepreneurs who are already using our AI-powered platform.
        </p>
        <button 
          onClick={scrollToAnalyzer}
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          Get Started Free
        </button>
      </div>
    </section>
  );
};

export default CTASection;