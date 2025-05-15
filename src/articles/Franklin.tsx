import GenericArticle from "../pages/GenericArticle";

import franklinScreenshot from "../assets/franklin-cad.png";

export default function FranklinArticle() {
  return (
    <>
      <GenericArticle
        title="Franklin"
        date="February 2024"
        description="All about Franklin: my 3D printed self-balancing robot"
        readTime="0 minutes"
        titleImage="https://polybrain.b-cdn.net/contribute-art.png"
      >
        <img src={franklinScreenshot} />

        <p className="centered">More information on Franklin coming soon.</p>
      </GenericArticle>
    </>
  );
}
