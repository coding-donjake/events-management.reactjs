import React, { ReactNode } from "react";

interface CardProps {
  image?: ReactNode;
  titleBarActions?: ReactNode[];
  title?: string;
  titleBadges?: ReactNode[];
  content?: ReactNode;
  badges?: ReactNode[];
  actions?: ReactNode[];
}

export const Card = ({
  image,
  titleBarActions,
  title,
  titleBadges,
  content,
  badges,
  actions,
}: CardProps) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      {image ? <figure>{image}</figure> : null}
      <div className="card-body">
        {titleBarActions ? (
          <div className="card-actions justify-end">
            {titleBarActions.map((child, index) => (
              <span key={index}>{child}</span>
            ))}
          </div>
        ) : null}
        {title ? (
          <h2 className="card-title">
            {title}
            {titleBadges
              ? titleBadges.map((child, index) => (
                  <div className="flex items-center" key={index}>
                    {child}
                  </div>
                ))
              : null}
          </h2>
        ) : null}
        {content ? <p>{content}</p> : null}
        {badges ? (
          <div className="card-actions justify-end">
            {badges.map((child, index) => (
              <span key={index}>{child}</span>
            ))}
          </div>
        ) : null}
        {actions ? (
          <div className="card-actions justify-end">
            {actions.map((child, index) => (
              <span key={index}>{child}</span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
