import React from "react";
import "../styles/ClickableCard.css";

interface CardProps {
  image: string;
  title: string;
  description: string;
  link: string;
  className: string;
}

const ClickableCard: React.FC<CardProps> = ({
  image,
  title,
  description,
  link,
  className,
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      id="card"
      className={`${className}`}
    >
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
      </div>
    </a>
  );
};

export default ClickableCard;
