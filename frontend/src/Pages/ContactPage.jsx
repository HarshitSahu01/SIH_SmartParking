import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-custom-gradient flex items-center justify-center">
      <div className="max-w-4xl mx-auto py-10 px-5 md:px-8 lg:px-16">
      <h1 className="text-4xl font-bold text-center text-white mb-6">

          Contact & Assistance
        </h1>

        <p className="text-lg text-white-700 mb-4 text-center">
          To get assistance with road accidents, driving issues, or parking help in India, MyGov and associated platforms provide the following resources:
        </p>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Emergency Helpline Numbers
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li><strong>112</strong>: For immediate emergency services (police, ambulance, or fire).</li>
            <li><strong>108</strong>: Dedicated to emergency ambulance services in many states.</li>
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Accident and Road Safety Resources
          </h2>
          <p className="text-gray-700">
            MyGov's <strong>Road Safety Hackathon</strong> initiative emphasizes emergency tools and applications for accident help, including quick ambulance coordination and financial aid for victims.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Parking Assistance and Traffic Management
          </h2>
          <p className="text-gray-700">
            MyGov highlights tech innovations for smoother parking and driving experiences. Solutions may include navigation apps, parking space locators, or real-time traffic updates.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Additional Support
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>
              For vehicle or road-related complaints, connect with the Ministry of Road Transport and Highways (MoRTH). Visit their grievance redressal portal at:
              <a 
                href="https://parivahan.gov.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 underline ml-1">
                MoRTH Grievance System
              </a>.
            </li>
            <li>
              State-specific traffic police websites often have hotlines and tools for resolving local issues.
            </li>
          </ul>
        </div>

        <p className="text-center text-gray-700">
          For further details or direct participation in relevant initiatives, visit:
          <a 
            href="https://www.mygov.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 underline ml-1">
            MyGov
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;