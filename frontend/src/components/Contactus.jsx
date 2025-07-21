import React, { useState } from 'react';

const Contactus = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    userType: 'Client', // default selected
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted: ', formData);
    // Here you can handle form submission, like sending to a server
  };

  return (

    <div id='contact' className="max-w-7xl mx-auto p-6 bg-[#ffffff]  shadow-lg rounded-lg mt-20">
      <h2 className="text-3xl font-bold text-center mb-10 mt-10">Contactez-nous</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
        {/* Form Section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="fullName" className="text-lg font-semibold text-gray-700">Nom complet</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className=" w-full p-3 border border-gray-300 rounded-md mt-2"
                  placeholder="Your Full Name"
                  required
                />
              </div>

              <div className="flex-1">
                <label htmlFor="phone" className="text-lg font-semibold text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                  placeholder="Your Phone Number"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-lg font-semibold text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                placeholder="Your Email Address"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="text-lg font-semibold text-gray-700">Objet</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                placeholder="Subject"
                required
              />
            </div>

            <div className="flex items-center gap-6">
              <div>
                <label className="text-lg font-semibold text-gray-700">Client ou Partenaire</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="Client"
                      checked={formData.userType === 'Client'}
                      onChange={handleChange}
                      className="mr-2 accent-[#3CD4AB] w-[30px] h-[20px] outline-none focus:outline-none"
                      required={true}
                    />
                    Client
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="Partner"
                      checked={formData.userType === 'Partner'}
                      onChange={handleChange}
                      className="mr-2 accent-[#3CD4AB] w-[30px] h-[20px]"
                      required={true}
                    />
                    Partner
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-lg font-semibold text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                placeholder="Your Message"
                rows="5"
                required
              />
            </div>

            <div className="flex justify-center">
              <button  type="submit" className="w-full cursor-pointer px-8 py-3 bg-[#3CD4AB] text-white font-semibold rounded-md hover:bg-[#3CD4AB]/40 transition-colors duration-300 focus:outline-none">
              Envoyer le message

              </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className=" md:flex hidden justify-center items-center">
          <img src="../../public/call.jpg" alt="Tawfirai support" className="w-[500px] h-[650px] rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
 

  );
};

export default Contactus;
