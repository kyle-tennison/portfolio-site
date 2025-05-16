import "../styles/Landing.css";
import Header from "../components/Header";
import ClickableCard from "../components/ClickableCard";

import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
            <h2>Ragposium</h2>
            <h3>A RAG powered search engine</h3>
            <p>
              Ragposium is a RAG-based academic paper search engine aimed at
              providing users with academic research that is related to a
              certain topic. <br />
              <br />
              To try it out, go to{" "}
              <a
                href="https://ragposium.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                ragposium.com
              </a>
              , enter a statement that you would like supporting research about.
              For example, try something like: <br />
              <br />
              “Under the Montreal Protocol, CFCs were replaced by HCFCs and
              subsequently by HFCs and HFOs, each exhibiting progressively lower
              ozone-depletion potentials.”
            </p>
          </div>

          <div className="right">
            <iframe
              className="youtube"
              src="https://www.youtube.com/embed/hQI-8Ccv2nw?si=IRNwOBEsqSRRqJPh?rel=0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="horiz-center">
              <button
                id="featured-action-btn"
                onClick={() => {
                  window.open(
                    "https://ragposium.com",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                Try it yourself
              </button>
            </div>
          </div>
          <a
            className="aux-link"
            href="https://github.com/kyle-tennison/ragposium"
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
