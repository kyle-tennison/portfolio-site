import React from "react";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h3>Kyle Tennison’s Portfolio</h3>
        <p>
          Built with TypeScript React; website source available on{" "}
          <a
            href="http://github.com/kyle-tennison/portfolio-site"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          .<br />
          Code License MIT
        </p>
      </div>

      <div className="footer-center">
        <a
          href="https://twitter.com/kyletennison"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="icon-link"
        >
          <i className="bi bi-twitter-x"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/kyle-tennison"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="icon-link"
        >
          <i className="bi bi-linkedin"></i>
        </a>
        <a
          href="https://github.com/kyle-tennison"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="icon-link"
        >
          <i className="bi bi-github"></i>
        </a>
      </div>

      <nav className="footer-right" aria-label="Footer navigation">
        <h3>Navigation</h3>
        <ul>
          <li>
            <a href="/resume.pdf" className="footer-link">
              Resume
            </a>
          </li>
          <li>
            <a href="/articles/contact" className="footer-link">
              Contact
            </a>
          </li>
          <li>
            <a href="/articles" className="footer-link">
              Articles
            </a>
          </li>
          <li>
            <a href="/projects" className="footer-link">
              Projects
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
