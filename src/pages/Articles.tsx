import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/Articles.css";
import ArticleCard from "../components/ArticleCard";

export default function Articles() {
  return (
    <div id="articles-page">
      <Header />

      <div className="title-text">
        <h1>Articles</h1>
        <p>
          This page serves as a spot to self-publish my miscellaneous articles,
          blogs, papers, etc.
        </p>
      </div>

      <div className="card-container">
        <ArticleCard
          title={"Franklin"}
          date={"February 2024"}
          description={
            "An overview of how my self-balancing robot, Franklin, was designed, fabricated, and trained. I go into depth about the Onshape model, my KiCAD PCB, and more."
          }
          link={"articles/franklin"}
        />


      </div>

      <Footer />
    </div>
  );
}
