import React from 'react';
import { Calendar, MapPin, Building2, Users } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Malikhaing Pinoy Expo 2025
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            A five-day exposition showcasing the diverse and dynamic Philippine creative industries. 
            Experience the power of Filipino creativity and innovation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-6 h-6 text-primary-200" />
              <span className="text-lg">September 3-7, 2025</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Building2 className="w-6 h-6 text-primary-200" />
              <span className="text-lg">SMX Convention Center, SM Aura</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <MapPin className="w-6 h-6 text-primary-200" />
              <span className="text-lg">Bonifacio Global City</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-lg px-8 py-4"
            >
              Register Now
            </button>
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-6 text-primary-100">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Philippine Creative Industries</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>9 Creative Domains</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>DTI Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
