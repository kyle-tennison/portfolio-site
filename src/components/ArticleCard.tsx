import React from "react";
import "../styles/ArticleCard.css";

interface ArticleCardProps {
  title: string;
  date: string;
  description: string;
  link: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  date,
  description,
  link,
}) => {
  return (
    <a href={link} className="article-card">
      <div className="article-card-content">
        <p className="article-card-title">
          <strong>{title}</strong> &bull; <em>{date}</em>
        </p>
        <p className="article-card-description">{description}</p>
      </div>
      <i className="bi bi-box-arrow-in-up-right"></i>
    </a>
  );
};

export default ArticleCard;
