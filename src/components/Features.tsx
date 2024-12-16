import React from 'react';
import { Search, Wrench, TrendingUp } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features to Grow Your Business
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Search}
            title="Keyword Analysis"
            description="Discover high-value niches and opportunities with our advanced AI-powered keyword analysis."
          />
          <FeatureCard
            icon={Wrench}
            title="AI-Generated Tools"
            description="Create custom solutions and automation tools tailored to your specific needs."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Monetization Strategies"
            description="Get actionable insights and strategies to maximize your revenue potential."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;