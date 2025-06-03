import { FaRegLightbulb, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';


const Footer = () => {
    return (
        <>
            <footer className="app-footer">
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
            </footer>
        </>
    )
}
export default Footer