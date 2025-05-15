import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';

import "../styles/Projects.css"

import magentiteImage from "../assets/magnetite-updated.png"
import onpyImage from "../assets/onpy-logo.png"
import pyriteImage from "../assets/pyrite.png"
import polybrainImage from "../assets/polybrain.jpeg"
import franklinImage from "../assets/franklin.png"
import me2110Image from "../assets/me2110-robot.png"
import climberImage from "../assets/climber-screenshot.jpeg"
import ragposiumImage from "../assets/ragposium.png"
import avarokScreenshot from "../assets/avarok-screenshot.jpeg"

export default function Projects() {
  return <div id="projects-page">
    <Header />

    <div className='title-text'>
      <h1>Projects</h1>
      <p>The following are individual and team projects that I’ve worked on over the years.</p>
    </div>


    <div className='projects-container'>


    <ProjectCard
      image={polybrainImage}
      title="Polybrain"
      description="An experimental tool for generating parametric OnShape CAD using AI."
      buttonText="View Site"
      buttonIcon={<i className="bi bi-box-arrow-up-right"></i>}
      link="https://github.com/kyle-tennison/pyrite"
    />


    <ProjectCard
      image={magentiteImage}
      title="Magnetite FEA"
      description="A 2D finite-element, linear elastic simulation program for isotropic materials—written in Rust."
      buttonText="See GitHub"
      buttonIcon={<i className="bi bi-github"></i>}
      link="https://github.com/kyle-tennison/magnetite"
    />

    <ProjectCard
      image={onpyImage}
      title="OnPy"
      description="A 3rd party Python API for building 3D models in OnShape."
      buttonText="See GitHub"
      buttonIcon={<i className="bi bi-github"></i>}
      link="https://github.com/kyle-tennison/onpy"
    />


    <ProjectCard
      image={me2110Image}
      title="ME2110 Robot"
      description="My team's Georgia Tech ME2110 robot. 1st place design winner."
      buttonText="Watch Video"
      buttonIcon={<i className="bi bi-youtube"></i>}
      link="https://www.youtube.com/watch?v=kVI6bqQ7p38"
    />

    <ProjectCard
      image={ragposiumImage}
      title="Ragposium"
      description="A free, open-source RAG-powered research paper search engine."
      buttonText="View Site"
      buttonIcon={<i className="bi bi-box-arrow-up-right"></i>}
      link="https://ragposium.com"
    />

    <ProjectCard
      image={franklinImage}
      title="Franklin"
      description="A self-balancing, 3D printed robot friend."
      buttonText="See GitHub"
      buttonIcon={<i className="bi bi-github"></i>}
      link="https://github.com/kyle-tennison/franklin"
    />

    <ProjectCard
      image={climberImage}
      title="FRC5940 Climber"
      description="Climber Subsystem for FRC Team 5940's 2023 robot."
      buttonText="View Cad"
      buttonIcon={<i className="bi bi-boxes"></i>}
      link="https://cad.onshape.com/documents/f24fe5dbb9a6ebea2bf3693f/w/32dcdf3aae6546aabd9e5cf0/e/dd5e99181b503ee08b3ac657"
    />

    <ProjectCard
      image={pyriteImage}
      title="Pyrite"
      description="Another 2D finite-element simulator, written in Python with NumPy."
      buttonText="See GitHub"
      buttonIcon={<i className="bi bi-github"></i>}
      link="https://github.com/kyle-tennison/pyrite"
    />

    <ProjectCard
      image={avarokScreenshot}
      title="Avarok Work"
      description="Front end development for Avarok cybersecurity during an internship."
      buttonText="View Website"
      buttonIcon={<i className="bi bi-github"></i>}
      link="https://avarok.net/"
    />




    </div>

    <Footer />
  </div>;
}