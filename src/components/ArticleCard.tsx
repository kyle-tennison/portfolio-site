import React from "react";
import "../styles/ArticleCard.css";

interface ArticleCardProps {
  title: string;
  date: string;
  description: string;
  link: string;
  newTab?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  date,
  description,
  link,
  newTab = false,
}) => {
  return (
    <a
      href={link}
      {...(newTab && { target: "_blank", referrerPolicy: "no-referrer" })}
      className="article-card"
      data-aos="fade-up"
      data-aos-offset="20"
    >
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
