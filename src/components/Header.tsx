import "../styles/Header.css"

export default function Header() {
    return <div id="header">
        <div className="left">
            <a className="logo">K.T.</a>
        </div>
        <div className="right">
            <nav>
                <a className="averia-serif-libre-light">Contact</a>
                <a className="averia-serif-libre-light">Resume</a>
                <a className="averia-serif-libre-light">Projects</a>
                <a className="averia-serif-libre-light">Articles</a>
            </nav>
        </div>
    </div>
}