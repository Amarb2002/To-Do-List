import React from "react";
import "../styles/footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <h3>
                    {/* <span className="icon" role="img" aria-label="footer-logo">📋</span> */}
                    Employee Training Tracker
                </h3>
                {/* <p>
                    <span className="icon" role="img" aria-label="partner">🤝</span>
                    Your partner in employee development.
                </p> */}
            </div>
            <div className="footer-links">
                <a href="#privacy"><span className="icon" role="img" aria-label="privacy">🔒</span> Privacy Policy</a>
                <a href="#terms"><span className="icon" role="img" aria-label="terms">📄</span> Terms of Service</a>
                <a href="#contact"><span className="icon" role="img" aria-label="contact">✉️</span> Contact Us</a>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} Employee Training Tracker. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;