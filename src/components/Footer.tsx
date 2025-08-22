import React from 'react';
import { Mail, Phone, MapPin, Facebook, Globe, Shield, Instagram } from 'lucide-react';
import dtiBP from '../assets/dti-bp-footer-logo.png';
import malikhaingPinoy from '../assets/malikhaing-pinoy-logo-footer.png';
import dtiLogo from '../assets/dti-footer.png';
import depEdLogo from '../assets/depEd-footer.png';
import dostLogo from '../assets/dost-footer.png';
import deped2Logo from '../assets/deped-2-footer.png';
import dotLogo from '../assets/dot-logo.png';
import ipophilLogo from '../assets/ipophil-footer.png';
import chedLogo from '../assets/ched-footer.png';
import dictLogo from '../assets/dict-footer.png';
import dilgLogo from '../assets/dilg-logo-footer.png';
import nccaLogo from '../assets/ncca-footer.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030e9c] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="sm:text-center">
            <img src={dtiBP} alt="DTI - Bagong Pilipinas" className="w-1/2 mb-4 mx-auto" />
            <img src={malikhaingPinoy} alt="Malikhaing Pinoy Expo" className="w-3/4 mb-8 mx-auto" />
            <div className="flex space-x-4 w-1/2 justify-center mx-auto">
              <a href="https://www.malikhaingpinoy.ph/" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Website</span>
                <Globe />
              </a>
              <a href="https://www.facebook.com/DTICIDO" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook />
              </a>
              <a href="https://www.instagram.com/dti.malikhaingpinoy/" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                <Instagram />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 montserrat-font">LINKS</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://mpx.malikhaingpinoy.ph/#page-1" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Program</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://mpx.malikhaingpinoy.ph/#page-2" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Exhibitors</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://mpx.malikhaingpinoy.ph/#partners" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Partners</span>
                </a>
              </li>
              <li>
                <a 
                  href="#registration" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>Register</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 montserrat-font">CONTACT US</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-8 h-8 text-primary-400" />
                <div className="info-content">
                  <span className="text-white-300 block bold">Address</span>
                  <span className="text-gray-300 block text-sm">GF, HPGV Bldg, 395 Sen. Gil J. Puyat Ave, Makati City</span>
                  <span className="text-gray-300 block text-sm">Metro Manila, Philippines</span>
                  <span className="text-gray-300 block text-sm">8:00 AM - 5:00 PM</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-8 h-8 text-primary-400" />
                <div className="info-content">
                  <span className="text-white-300 block bold">Call Us</span>
                  <span className="text-gray-300 block text-sm">7791-3295</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-8 h-8 text-primary-400" />
                <div className="info-content">
                  <span className="text-white-300 block bold">Mail Us</span>
                  <span className="text-gray-300 block text-sm">PCIDCSecretariat@dti.gov.ph</span>
                  <span className="text-gray-300 block text-sm">MalikhaingPinoy@dti.gov.ph</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-5 text-center">
              ©2025 The Philippine Creative Industries Development Council. All Rights Reserved. 
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 sm:flex-row flex-wrap">
              <a target="_blank" href="https://www.dti.gov.ph/">
                <img src={dtiLogo} alt="DTI - Bagong Pilipinas" className="w-20 mb-4" />
              </a>
              <a target="_blank" href="https://www.deped.gov.ph/">
                <img src={depEdLogo} alt="DTI - Bagong Pilipinas" className="w-20 mb-0" />
              </a>
              <a target="_blank" href="https://www.dost.gov.ph/">
                <img src={dostLogo} alt="DTI - Bagong Pilipinas" className="w-20 mb-0" />
              </a>
              <a target="_blank" href="https://depdev.gov.ph/">
                <img src={deped2Logo} alt="DTI - Bagong Pilipinas" className="w-20 mb-0" />
              </a>
              <a target="_blank" href="https://www.tourism.gov.ph/">
                <img src={dotLogo} alt="DTI - Bagong Pilipinas" className="w-20 mb-0" />
              </a>
              <a target="_blank" href="https://www.ipophil.gov.ph/">
                <img src={ipophilLogo} alt="DTI - Bagong Pilipinas" className="w-20 mb-0" />
              </a>
              <a target="_blank" href="https://ched.gov.ph/">
                <img src={chedLogo} alt="DTI - Bagong Pilipinas" className="w-20 mb-0" />
              </a>
              <a target="_blank" href="https://dict.gov.ph/">
                <img src={dictLogo} alt="DTI - Bagong Pilipinas" className="w-20 mb-0" />
              </a>
              <a target="_blank" href="https://dilg.gov.ph/">
                <img src={dilgLogo} alt="DTI - Bagong Pilipinas" className="w-20 mb-0" />
              </a>
              <a target="_blank" href="https://ncca.gov.ph/">
                <img src={nccaLogo} alt="DTI - Bagong Pilipinas" className="h-20 mb-0" />
              </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
