import React, { useState } from 'react';

import "../styles/Landing.css"
import Header from '../components/Header';
import ClickableCard from '../components/ClickableCard';

import portrait from "../assets/my-dumbass.png"
import kicadScreenshot from "../assets/kicad-screenshot.png"
import paperScreenshot from "../assets/paper-screenshot.png"
import Footer from '../components/Footer';

export default function Landing() {

    const [isMobile, setIsMobile] = useState(false);



    return <div id="landing-page">
    <Header />
    <div className='horiz-center'>

        <div className='landing-container'>
            <div className="title-text">
                <h2 className="averia-serif-libre-light">Hi, I'm</h2>
                <h1 className="averia-serif-libre-light">Kyle Tennison</h1>
                <p className="averia-serif-libre-light">I'm a Mechanical Engineering undergraduate at Georgia Tech and a former Computer Science major. This website features everything I've been up to. Take a look around — you might find something cool.</p>
                <div className='title-buttons'>
                    <button id="portfolio-button" className="averia-serif-libre-light">Portfolio</button>
                    <button id="contact-button" className="averia-serif-libre-light">Contact</button>
                </div>
            </div>
            <div className='face-card'>
                <img src={portrait}></img>
                { !isMobile && <>
                    
                    <div className='socials horiz-center'>
                        <a target="_blank" rel="noopener noreferrer" href="https://x.com/kyletennison"><i className="bi bi-twitter-x"></i></a>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/kyle-tennison/"><i className="bi bi-linkedin"></i></a>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/kyle-tennison"><i className="bi bi-github"></i></a>
                    </div>
                
                
                    </> }
            </div>
        </div>


    </div>
    <div className="featured-container horiz-center">
        <h2>Featured Project</h2>

        <div className="featued-project-pane">

            <div className='left'>
                <h2>Ragposium</h2>
                <h3>A RAG powered search engine</h3>
                <p>
                Ragposium is a RAG-based academic paper search engine aimed at providing users with academic research that is related to a certain topic. <br/><br/>

                To try it out, go to <a href="https://ragposium.com" target="_blank" rel="noopener noreferrer">ragposium.com</a>, enter a statement that you would like supporting research about. For example, try something like: <br/><br/>

                “Under the Montreal Protocol, CFCs were replaced by HCFCs and subsequently by HFCs and HFOs, each exhibiting progressively lower ozone-depletion potentials.”
                </p>
            </div>

            <div className='right'>
            <iframe className='youtube'
                src="https://www.youtube.com/embed/sunjmzSDeiw?rel=0"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
            <div className='horiz-center'>
                <button id="featured-action-btn">Try it yourself</button>
            </div>
            </div>
            <a className="aux-link">
                <i className="bi bi-github"></i>
            </a>
        </div>

    <div className='div-bar' />

    <div className='nav-card-container'>
        <ClickableCard className="left" image={kicadScreenshot} title={'Full Portfolio'} description={'More of my personal & team projects can be found here on my portfolio.'} link={'google.com'} />
        <ClickableCard className="right" image={paperScreenshot} title={'Articles and Papers'} description={'Self-authored papers, blogs, and miscellaneous articles can be found here.'} link={'google.com'} />

    </div>
    </div>

    <Footer />

    
    </div>;
}