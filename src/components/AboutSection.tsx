import React from 'react';
import { Calendar, MapPin, Clock, Users, Award, Coffee, Wifi, Camera, Building2, Globe } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About the Event</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            The Malikhaing Pinoy Expo 2025 is a five-day exposition showcasing the diverse and dynamic 
            Philippine creative industries. Held from September 3-7, 2025, at the SMX Convention Center, 
            SM Aura, Bonifacio Global City, the event is a flagship initiative of the Department of Trade 
            and Industry (DTI) and the Philippine Creative Industries Development Council.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Event Overview</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">DTI Initiative</h4>
                  <p className="text-gray-600">
                    A flagship initiative of the Department of Trade and Industry (DTI) and the Philippine Creative Industries Development Council.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">PCIM Part</h4>
                  <p className="text-gray-600">
                    A key part of the Philippine Creative Industries Month (PCIM) celebrating Filipino creativity and innovation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Economic Growth</h4>
                  <p className="text-gray-600">
                    Aims to elevate Filipino creativity and harness its power for inclusive economic growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Creative Domains</h3>
            <p className="text-gray-600 mb-4">
              The program is structured to feature different creative nine (9) domains each day, including:
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Audio-Visual Media</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Digital Interactive Media</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Design</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Visual Arts</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Performing Arts</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Creative Services</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Traditional Cultural Expressions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Cultural Sites</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-gray-700">Publishing and Printed Media</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Date & Time</h4>
            <p className="text-gray-600">September 3-7, 2025<br />Five-day exposition</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Location</h4>
            <p className="text-gray-600">SMX Convention Center<br />SM Aura, Bonifacio Global City</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-8 h-8 text-primary-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">What's Included</h4>
            <p className="text-gray-600">Expo access, creative domain showcases, networking opportunities, and cultural experiences</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Experience Filipino Creativity?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Don't miss out on this celebration of Philippine creative excellence. Register now and be part of the Malikhaing Pinoy Expo 2025!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-lg px-8 py-4"
            >
              Register Now
            </button>
            <button 
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
