import React from 'react';
// import { Calendar, MapPin, Users } from 'lucide-react';
import bannerLogo1 from '../assets/banner-logo-1.webp';
import bannerLogo2 from '../assets/banner-logo-2.webp';
import bannerLogo3 from '../assets/banner-logo-3.webp';
import bannerLogo4 from '../assets/banner-logo-4.webp';
import smokeBg from '../assets/SmokeBG.mp4';
import headerPattern from '../assets/header-pcim.webp';
import headerQR from '../assets/qrheader.webp';

const Header: React.FC = () => {
  return (
    <header className="bg-white text-primary relative h-70">
      <video
      playsInline
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <source src={smokeBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center">
          <div>
            <img src={bannerLogo1} alt="DTI and Bagong Pilipinas" className="w-1/2 md:w-1/6 mx-auto mb-2 md:mb-4 bannerAnimate1" />
            <img src={bannerLogo2} alt="Malikhaing" className="w-3/4 md:w-1/3 mx-auto mb-2 md:mb-4 bannerAnimate2" />
            <img src={bannerLogo3} alt="Pinoy Creative Expo" className="w-3/4 md:w-1/3 mx-auto mb-2 md:mb-4 bannerAnimate3" />
            <img src={bannerLogo4} alt="Malikhaing Pinoy Expo 2025" className="w-2/4 md:w-1/6 mx-auto mb-2 md:mb-4 bannerAnimate4" />
          </div>

        </div>
      </div>
      <div className="flex justify-between items-end absolute bottom-0 left-0 right-0 z-10 mb-3 mx-5">
        <img src={headerPattern} alt="Header Pattern" className="w-[10rem] md:w-[20rem]" />
        <img src={headerQR} alt="Header QR" className="w-[5rem] md:w-[8rem]" />
      </div>
    </header>
  );
};

export default Header;
