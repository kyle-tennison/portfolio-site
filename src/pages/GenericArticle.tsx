// src/components/GenericArticle.tsx
import React from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/GenericArticle.css";

interface ArticleProps {
  title: string;
  date: string;
  description: string;
  readTime: string;
  titleImage: string;
  children?: React.ReactNode;
}

const mathConfig = {
  loader: { load: ["[tex]/ams"] },
  tex: { packages: { "[+]": ["ams"] } },
} as const;

const GenericArticle: React.FC<ArticleProps> = ({
  title,
  date,
  description,
  readTime,
  titleImage,
  children,
}) => (
  <MathJaxContext config={mathConfig}>
    <div id="generic-article">
      <Header />

      <div className="title-text">
        <h1>{title}</h1>
        <p>{description}</p>
        <p>{`${readTime} read • ${date}`}</p>
        <div
          className="background"
          style={{ backgroundImage: `url(${titleImage})` }}
        ></div>
      </div>

      <div className="article-body">
        <MathJax dynamic style={{width: "100%"}}>
          {typeof children === "string" ? children : <>{children}</>}
        </MathJax>
      </div>

      <Footer />
    </div>
  </MathJaxContext>
);

export default GenericArticle;
