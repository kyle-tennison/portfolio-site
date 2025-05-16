import React, { useRef } from "react";
import { slide as Menu } from "react-burger-menu";
import "../styles/Header.css";

export const Header: React.FC = () => {
  const menuRef = useRef<any>(null);


  return (
    <header id="header">
      <div className="header-bar">
        <div className="left">
          <a className="logo" href="/">
            K.T.
          </a>
        </div>

        <div className="right">
          <nav className="desktop-nav">
            <a href="/articles/contact" className="averia-serif-libre-light">
              Contact
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              referrerPolicy="no-referrer"
              className="averia-serif-libre-light"
            >
              Resume
            </a>
            <a href="/projects" className="averia-serif-libre-light">
              Projects
            </a>
            <a href="/articles" className="averia-serif-libre-light">
              Articles
            </a>
          </nav>
        </div>
      </div>

      <Menu
        right
        customBurgerIcon={<i className="bi bi-list"></i>}
        noOverlay
        className="mobile-menu"
        ref={menuRef}
      >
        <a href="/articles/contact" className="menu-item">
          Contact
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          referrerPolicy="no-referrer"
          className="menu-item"
        >
          Resume
        </a>
        <a href="/projects" className="menu-item">
          Projects
        </a>
        <a href="/articles" className="menu-item">
          Articles
        </a>
      </Menu>
    </header>
  );
};

export default Header;
