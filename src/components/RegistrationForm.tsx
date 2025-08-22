import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { firebaseService } from '../services/firebaseService';
import { RegistrationData } from '../types';
import { User, Mail, Phone, Building, Calendar, CheckCircle, XCircle, Loader } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

interface FormData {
  email: string;
  lastName: string;
  firstName: string;
  institution: string;
  designation: string;
  contactNumber: string;
  eventDays: {
    wedSept3: boolean;
    thursSept4: boolean;
    friSept5: boolean;
    satSept6: boolean;
    sunSept7: boolean;
    notAttending: boolean;
  };
}

const RegistrationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>({
    defaultValues: {
      eventDays: {
        wedSept3: false,
        thursSept4: false,
        friSept5: false,
        satSept6: false,
        sunSept7: false,
        notAttending: false
      }
    }
  });

  const watchedEventDays = watch('eventDays');

  // Check if any event day is selected
  const hasEventDaySelected = Object.values(watchedEventDays).some(day => day);
  
  // Check if "not attending" is selected
  const isNotAttending = watchedEventDays.notAttending;

  // Disable event days if "not attending" is selected
  const eventDaysDisabled = isNotAttending;
  
  // Disable "not attending" if any event day is selected
  const notAttendingDisabled = hasEventDaySelected && !isNotAttending;

  const onSubmit = async (data: FormData) => {
    // Validate CAPTCHA
    if (!captchaToken) {
      setCaptchaError('Please complete the CAPTCHA verification');
      toast.error('Please complete the CAPTCHA verification');
      return;
    }

    setIsSubmitting(true);
    setCaptchaError(null);
    
    try {
      // Validate that at least one event day is selected
      const selectedDays = Object.values(data.eventDays);
      if (!selectedDays.some(day => day)) {
        toast.error('Please select at least one event day or "Not Attending"');
        return;
      }

      const registrationData: Omit<RegistrationData, 'id' | 'registrationDate'> = {
        ...data
      };

      const registrationId = await firebaseService.addRegistration(registrationData);
      
      console.log('Registration successful:', registrationId);
      setIsSuccess(true);
      reset();
      setCaptchaToken(null);
      toast.success('Registration successful! Check your email for confirmation with QR code and short ID.');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    setCaptchaError(null);
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
    setCaptchaError('CAPTCHA expired. Please complete it again.');
  };

  if (isSuccess) {
    return (
      <div className="card text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for registering! You will receive a confirmation email with your unique QR code and registration ID shortly.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">📧 Check Your Email</h4>
          <p className="text-blue-700 text-sm">
            Your confirmation email contains a unique QR code that you'll need to present at the event entrance for verification.
          </p>
        </div>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn-primary"
        >
          Register Another Person
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold mb-2 mpx-text-blue">Register for the Event</h2>
        <p className="text-gray-600">Secure your spot at the Malikhaing Pinoy Expo 2025</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              {...register('contactNumber', { required: 'Contact number is required' })}
              className={`input-field ${errors.contactNumber ? 'border-red-500' : ''}`}
              placeholder="Enter your contact number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution/Organization *
            </label>
            <input
              type="text"
              {...register('institution', { required: 'Institution/Organization is required' })}
              className={`input-field ${errors.institution ? 'border-red-500' : ''}`}
              placeholder="Enter your institution or organization"
            />
            {errors.institution && (
              <p className="text-red-500 text-sm mt-1">{errors.institution.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation *
            </label>
            <input
              type="text"
              {...register('designation', { required: 'Designation is required' })}
              className={`input-field ${errors.designation ? 'border-red-500' : ''}`}
              placeholder="Enter your designation/position"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Days you will be joining *
          </label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('eventDays.wedSept3')}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                [Wed] September 3: Creative Domain Showcase
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('eventDays.thursSept4')}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                [Thurs] September 4: Opening Program
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('eventDays.friSept5')}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                [Fri] September 5: Creative Domain Showcase
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('eventDays.satSept6')}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                [Sat] September 6: Creative Domain Showcase
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('eventDays.sunSept7')}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                [Sun] September 7: Closing Program
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('eventDays.notAttending')}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                I will not be able to attend
              </label>
            </div>
          </div>
          
          {Object.values(watchedEventDays).every(day => !day) && (
            <p className="text-red-500 text-sm mt-2">
              Please select at least one option or indicate if you cannot attend.
            </p>
          )}
        </div>

        {/* reCAPTCHA */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Security Verification *
          </label>
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LdZy6orAAAAAL0AwF8IflXwqmO_YWHwFufmHzmk" // Replace with your actual reCAPTCHA site key
              onChange={handleCaptchaChange}
              onExpired={handleCaptchaExpired}
              theme="light"
            />
          </div>
          {captchaError && (
            <p className="text-red-500 text-sm mt-2 text-center">{captchaError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || Object.values(watchedEventDays).every(day => !day) || !captchaToken}
          className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            'Complete Registration'
          )}
        </button>

        <p className="text-sm text-gray-500 text-center">
          By registering, you agree to our terms and conditions and privacy policy.
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
