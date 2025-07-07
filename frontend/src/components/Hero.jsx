import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.section
      id="home"
      className="relative bg-primary-bg text-white py-20 px-6 md:px-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold leading-tight mb-4"
          variants={itemVariants}
        >
          Découvrez l'avenir de l'épargne et des investissements intelligents
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-6"
          variants={itemVariants}
        >
          Donnez de l'élan à votre avenir financier grâce à des recommandations d'investissement personnalisées en fonction de vos objectifs et préférences.
        </motion.p>

        <motion.a
          href="#start-simulation"
          className="px-8 py-3 bg-white text-primary-bg rounded-full text-lg hover:bg-gray-200 transition-all"
          variants={itemVariants}
        >
          Commencez votre voyage dès aujourd'hui
        </motion.a>
      </div>
    </motion.section>
  );
};

export default HeroSection;