/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': "linear-gradient(163deg, rgba(203,140,197,1) 1%, rgba(97,89,183,1) 57%)",
      },
    },
  },
 
  // theme: {
  //   extend: {
  //     backgroundImage: {
  //       'custom-gradient': 'linear-gradient(163deg, rgba(126,64,193,1) 5%, rgba(5,0,54,1) 61%)',
  //     },
  //   },
  // },
  // theme: {
  //   extend: {
  //     backgroundImage: {
  //       'custom-gradient': 'linear-gradient(170deg, rgba(122,247,247,1) 0%, rgba(19,134,135,0.89) 65%)',
  //     },
  //   },
  // },

  plugins: [
    require('tailwindcss-motion'),
  ], 
}
