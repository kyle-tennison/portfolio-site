import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Landing from "./pages/Landing";
import Articles from "./pages/Articles";
import Projects from "./pages/Projects";
import FranklinArticle from "./articles/Franklin/Franklin";
import ContactArticle from "./articles/Contact/Contact";
import Navier2DArticle from "./articles/Navier2D/Navier2D";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  window.alert = (msg) => toast(msg); // override alert
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    AOS.init({
      duration: 500,
      offset: isMobile ? 50 : 200,
    });
  }, []);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/projects" element={<Projects />} />

          {/* Article Routes */}
          <Route path="/articles/franklin" element={<FranklinArticle />} />
          <Route path="/articles/navier-2d" element={<Navier2DArticle />} />
          <Route path="/articles/contact" element={<ContactArticle />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
