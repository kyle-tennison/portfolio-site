import React from "react";
import "../styles/ProjectCard.css";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  link: string;
  disable?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  title,
  description,
  buttonText,
  buttonIcon,
  link,
  disable = false,
}) => {
  return (
    <div className="project-card" data-aos="fade-up">
      <img
        className="project-card-image"
        src={image}
        alt={title}
      />
      <div className="project-card-content">
        <h2 className="project-card-title">{title}</h2>
        <p className="project-card-description">{description}</p>
        <button
          className="project-card-button"
          type="button"
          onClick={() => {
            if (!disable) {
              window.open(link, "_blank", "noopener,noreferrer");
            }
          }}
          disabled={disable}
        >
          {buttonText}
          <div className="project-card-icon">{buttonIcon}</div>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
