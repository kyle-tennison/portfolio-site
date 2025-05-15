import "../styles/Header.css"

export default function Header() {
    return <div id="header">
        <div className="left">
            <a className="logo" href="/">K.T.</a>
        </div>
        <div className="right">
            <nav>
                <a href="/contact" className="averia-serif-libre-light">Contact</a>
                <a href="/resume" className="averia-serif-libre-light">Resume</a>
                <a href="/projects" className="averia-serif-libre-light">Projects</a>
                <a href="/articles" className="averia-serif-libre-light">Articles</a>
            </nav>
        </div>
    </div>
}