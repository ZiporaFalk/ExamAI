import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../stylies/HomePage.css"
import imgWrites from "/images/homeWords.png"
import {
  FaTachometerAlt, FaChartBar, FaClipboardCheck, FaArrowRight, FaCheckCircle,
  FaFileAlt, FaChartLine, FaUsers, FaChevronDown
} from 'react-icons/fa';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [, setScrolled] = useState(false);
  const navigate = useNavigate()
  const heroTextVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3 } }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 8px 15px rgba(128, 224, 213, 0.4)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };
  ///////////
  const location = useLocation();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    if (location.state?.showLoginMessage) {
      setShowLoginMessage(true);
      // מסתיר את ההודעה אחרי 3 שניות
      setTimeout(() => setShowLoginMessage(false), 3000);
    }
  }, [location.state]);
  ///////////////
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      const icons = document.querySelectorAll('.floating-icon');
      icons.forEach(icon => {
        const randomY = Math.random() * 10 - 5;
        const randomX = Math.random() * 10 - 5;
        (icon as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px)`;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {showLoginMessage && (
        <div className='login-message'>  !אתה צריך להתחבר כדי לצפות בתוכן</div>
      )}
      <div className="hero-section">
        <motion.div
          className="floating-icon icon-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <FaClipboardCheck size={30} />
        </motion.div>

        <motion.div
          className="floating-icon icon-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <FaChartBar size={30} />
        </motion.div>

        <motion.div
          className="floating-icon icon-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <FaTachometerAlt size={30} />
        </motion.div>

        <div className="hero-content">
          <motion.h1
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
          >
            <img src={imgWrites} id="imgWrites"></img>
          </motion.h1>

          <motion.h2
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}>
            Streamline your exam process with our intelligent system. Upload, check, and analyze exams with ease.

          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.button
              className="get-started-btn"
              variants={buttonVariants}
              onClick={() => navigate('/tests')}
              whileHover="hover"
              whileTap="tap"
            >
              Get Started
              <motion.span
                initial={{ x: 0 }}
                animate={{
                  x: 10,
                  transition: {
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 0.5,
                  },
                }}>
                <FaArrowRight />
              </motion.span>
            </motion.button>
          </motion.div>

          <motion.div
            className="highlight-line"
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 1, delay: 1.2 }} />
        </div>
      </div>
      <AnimatePresence>

        <div className="scroll-indicator">
          <motion.div
            initial={{ y: 0 }}
            animate={{
              y: [0, 10, 0],
              transition: {
                repeat: Infinity,
                duration: 1.5
              }
            }}
          >
            <div className="scroll-content">
              <p>Scroll to explore</p>
              <FaChevronDown id="FaChevronDown" />
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <div className="features-section" id="features">
        <div className="section-header">
          <div className="section-pill">Our Features</div>
          <h2>Powerful Features</h2>
          <p>Our system provides everything you need to manage and grade exams efficiently</p>
        </div>

        <div className="features-container">
          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 153, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaFileAlt />
            </div>
            <h3>Automated Exam Grading</h3>
            <p>Upload scanned exams and let the system automatically analyze, grade.</p>
            <ul className="feature-list">
              <li><FaCheckCircle className="feature-check" /> Smart scan & recognition & providing immediate scoring</li>
              <li><FaCheckCircle className="feature-check" /> Grade storage in student database</li>
              <li><FaCheckCircle className="feature-check" /> Optional email notifications to students</li>
            </ul>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 153, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Detailed Analytics</h3>
            <p>Get comprehensive insights into student performance with our detailed analytics.</p>
            <ul className="feature-list">
              <li><FaCheckCircle className="feature-check" /> Visual reports</li>
              <li><FaCheckCircle className="feature-check" /> Performance tracking</li>
            </ul>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 153, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Student Management</h3>
            <p>Easily manage student information, classes, and exam results in one place.</p>
            <ul className="feature-list">
              <li><FaCheckCircle className="feature-check" /> Centralized database</li>
              <li><FaCheckCircle className="feature-check" /> Easy organization</li>
            </ul>
          </motion.div>


        </div>
      </div>

      <div className="about-section" id="about">
        <div className="about-content">
          <div className="section-pill">About Us</div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            About ExamAI
          </motion.h2>

          <motion.div
            className="about-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>ExamAI is an advanced exam management system designed to streamline the entire examination process, from creation to grading and analysis.</p>
            <p>Our system uses cutting-edge technology to automatically process and grade exams, providing detailed feedback to both teachers and students.</p>
            <p>With ExamAI, you can save time, reduce errors, and gain valuable insights into student performance.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="learn-more-btn">
              Learn More <FaArrowRight className="btn-icon" />
            </button>
          </motion.div>
        </div>

        <motion.div
          className="about-image"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="glowing-mouse">
            <div className="mouse-outline"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;


