import React from "react";

const ContactPage = () => {
  const emergencyContacts = [
    { name: "Police", number: "100", icon: "🚓" },
    { name: "Ambulance", number: "102", icon: "🚑" },
    { name: "Fire Brigade", number: "101", icon: "🔥" },
    { name: "Women Helpline", number: "1091", icon: "👩" },
    { name: "Highway Helpline", number: "1033", icon: "🛣" },
  ];

  const usefulLinks = [
    {
      name: "Traffic Rules and Guidelines",
      url: "https://morth.nic.in",
    },
    {
      name: "National Highway Authority of India",
      url: "https://nhai.gov.in",
    },
    {
      name: "MyGov Official Website",
      url: "https://www.mygov.in",
    },
    {
      name: "Road Safety Awareness",
      url: "https://roadsafety.nic.in",
    },
  ];

  return (
    <div className="min-h-screen bg-custom-gradient p-5 flex flex-col space-y-5">
      {/* Header Section */}
      <header className="text-center text-white">
        <h1 className="text-2xl font-bold mb-2">Contact & Assistance</h1>
        <p className="text-sm">
          Get immediate help for emergencies on the road. Stay safe!
        </p>
      </header>

      {/* Emergency Contacts Section */}
      <section className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Emergency Numbers</h2>
        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.name}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{contact.icon}</span>
                <div>
                  <p className="font-medium text-gray-700">{contact.name}</p>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
              </div>
              <a
                href={`tel:${contact.number}`}

                className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-600"
              >
                Call {contact.number}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Useful Links Section */}
      <section className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Useful Links</h2>
        <ul className="space-y-3">
          {usefulLinks.map((link) => (
            <li key={link.name} className="flex items-center space-x-3">
              <img
                src="https://via.placeholder.com/50"
                alt="Link Icon"
                className="w-10 h-10 rounded-full shadow-sm"
              />
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 font-medium hover:underline"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer Section */}
      <footer className="text-center text-white text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Parking Assistance. All rights reserved.</p>
        <p>
          Powered by{" "}
          <a
            href="https://www.mygov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline"
          >
            MyGov
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ContactPage;