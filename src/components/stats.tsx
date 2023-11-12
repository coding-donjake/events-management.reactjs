import React, { ReactNode } from "react";

interface StatProps {
  icon: ReactNode;
  title: string;
  text: ReactNode;
  desc: string;
}

export const Stat = ({ icon, title, text, desc }: StatProps) => {
  return (
    <div className="stat">
      <div className="stat-figure">{icon}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{text}</div>
      <div className="stat-desc">{desc}</div>
    </div>
  );
};
