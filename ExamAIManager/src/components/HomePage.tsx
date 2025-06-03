import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../stylies/HomePage.css"
import imgWrites from "/images/homeWords.png"
import {
  FaTachometerAlt, FaChartBar, FaClipboardCheck, FaArrowRight, FaCheckCircle,
  FaFileAlt, FaChartLine, FaUsers, FaChevronDown
} from 'react-icons/fa';
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

  // const showLoginModal = () => {
  //   setIsLoginModalOpen(true);
  // };

  // const handleLoginCancel = () => {
  //   setIsLoginModalOpen(false);
  // };

  // const responseGoogle = (response: any) => {
  //   console.log("Google login response:", response);
  //   setIsLoginModalOpen(false);
  //   api.success({
  //     message: 'התחברת בהצלחה עם Google',
  //     description: 'ברוך הבא למערכת ExamAI!',
  //     placement: 'topRight',
  //     className: 'rtl-notification',
  //   });
  // };

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
      {/* <img src={myImg} id="imgBackground" alt="background"></img> */}
      {/* {contextHolder}

      <motion.div
        className={`nav-container ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="logo-container">
          <div className="logo-glow"></div>
          <motion.div
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaRegLightbulb className="logo-icon" />
            ExamAI
          </motion.div>
        </div>

        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="main-nav"
        >
          <ul>
            <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }} onClick={() => navigate('/dashboard')}
            >
              <FaTachometerAlt className="nav-icon" />
              Dashboard
            </motion.li>

            <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }}>
              <FaChartBar className="nav-icon" />
              Statistics
            </motion.li>
            <motion.li whileHover={{ scale: 1.1, color: "#64ffda" }}>
              <FaClipboardCheck className="nav-icon" />
              Tests
            </motion.li>
          </ul>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-buttons"
        >
          <motion.button
            className="sign-in-btn"
            onClick={showLoginModal}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Sign In
          </motion.button>
        </motion.div>
      </motion.div> */}

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
        {/* .................................... */}
        {/* {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={handleLoginCancel}
            onSuccessLogin={(email, messageType, message) => {
              setIsLoginModalOpen(false);
              messageType === 'success' ?
                api.success({
                  message: "You have successfully connected!",
                  description: 'ברוך הבא למערכת! ' + { email },
                  placement: 'topRight',
                  className: 'rtl-notification',
                })
                : api.error({
                  message: 'Login failed!',
                  description: message,
                  placement: 'topRight',
                  className: 'rtl-notification',
                });
            }
            }
          />
        )} */}
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
              {/* <li><FaCheckCircle className="feature-check" /> Instant grading and scoring</li> */}
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

      {/* Footer component similar to the one in the first image */}
      {/* <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-logo-section">
            <div className="footer-logo">
              <FaRegLightbulb className="footer-logo-icon" />
              ExamAI
            </div>
            <p className="footer-description">
              Advanced exam management system for educational institutions and organizations.
            </p>
          </div>

          <div className="footer-links-section">
            <div className="footer-links-column">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Tutorials</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3>Contact</h3>
              <ul className="contact-list">
                <li>
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:info@examai.com">info@examai.com</a>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <a href="tel:+11234567890">+1 (123) 456-7890</a>
                </li>
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>123 Education St, Learning City</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 ExamAI. All rights reserved.</p>
          <div className="footer-policies">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;


