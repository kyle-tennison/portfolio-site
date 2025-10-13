import "../styles/Landing.css";
import Header from "../components/Header";
import ClickableCard from "../components/ClickableCard";

import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import carSimGif from "../articles/Navier2D/car-sim.gif";

export default function Landing() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onLoad = () => setLoaded(true);
    if (document.readyState === "complete") {
      setLoaded(true);
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return (
    <div id="landing-page" className="dots-bg">
      <Header />
      <div className="horiz-center">
        <div className="landing-container">
          <div className="title-text">
            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h2 className="averia-serif-libre-light">Hi, I'm</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="averia-serif-libre-light">Kyle Tennison</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.75 }}
            >
              <p className="averia-serif-libre-light">
                I'm a Mechanical Engineering undergraduate at Georgia Tech and a
                former Computer Science major. This website features everything
                I've been up to. Take a look around — you might find something
                cool.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.25 }}
            >
              <div className="title-buttons">
                <button
                  id="portfolio-button"
                  className="averia-serif-libre-light"
                  onClick={() => {
                    window.location.pathname = "/projects";
                  }}
                >
                  Portfolio
                </button>
                <button
                  id="contact-button"
                  className="averia-serif-libre-light"
                  onClick={() => {
                    window.location.pathname = "/articles/contact";
                  }}
                >
                  Contact
                </button>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="face-card"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.25 }}
          >
            <img src={"https://kyletennison.b-cdn.net/my-dumbass.webp"}></img>

            <div className="socials horiz-center">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://x.com/kyletennison"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/kyle-tennison/"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/kyle-tennison"
              >
                <i className="bi bi-github"></i>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="featured-container horiz-center" data-aos="fade-up">
        <h2>Featured Project</h2>

        <div className="featued-project-pane">
          <div className="left">
            <h2>Navider 2D</h2>
            <h3>2D CFD for Incompressible Newtonian Fluids</h3>
            <p>
              The{" "}
              <a
                href="https://github.com/kyle-tennison/navier-2d"
                target="_blank"
              >
                <code className="il">navier-2D</code>
              </a>{" "}
              project is a computational fluid dynamics simulation engine
              written 100% in the Rust programming language. I took on this
              project with the goal of learning more about fluids and numeric
              problem solving.
              <br />
              <br />
              An article detailing the inner-workings of the simulator can be{" "}
              <a href="https://kyletennison.com/articles/navier-2d">
                found here
              </a>
              . As always, the project's socurce code is also available on{" "}
              <a href="https://github.com/kyle-tennison">my GitHub</a>.
            </p>
          </div>

          <div className="right">
            <div className="featured-media">
              <img src={carSimGif}></img>
            </div>
            <div className="horiz-center">
              <button
                id="featured-action-btn"
                onClick={() => {
                  window.open(
                    "https://kyletennison.com/articles/navier-2d",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                Read the Article
              </button>
            </div>
          </div>
          <a
            className="aux-link"
            href="https://github.com/kyle-tennison/articles/navier-2d"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-github"></i>
          </a>
        </div>

        <div className="div-bar" />

        <div className="nav-card-container">
          <div data-aos="fade-right">
            <ClickableCard
              className="left"
              image={"https://kyletennison.b-cdn.net/kicad-screenshot.webp"}
              title={"Full Portfolio"}
              description={
                "More of my personal & team projects can be found here on my portfolio."
              }
              link={"projects"}
            />
          </div>
          <div data-aos="fade-left">
            <ClickableCard
              className="right"
              image={"https://kyletennison.b-cdn.net/paper-screenshot.webp"}
              title={"Articles and Papers"}
              description={
                "Self-authored papers, blogs, and miscellaneous articles can be found here."
              }
              link={"articles"}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
