import React from "react";
import "./projects.css";
import ProjectCard from "./ProjectCard"; // adjust path if needed

export default function ProjectsGrid({ projects = [], onNew, onOpenProject, onEdit, onAddMember }) {
  return (
    <div className="projects-wrapper">
      <div className="projects-header">
        <h2>Projects</h2>
        <div>
          <button className="btn btn-new" onClick={onNew}>+ New Project</button>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            id={p.id}
            title={p.title}
            tags={p.tags}
            image={p.image}
            deadline={p.deadline}
            daysLeft={p.daysLeft}
            members={p.members}
            tasksCount={p.tasksCount}
            onOpen={onOpenProject}
            onEdit={onEdit}
            onAddMember={onAddMember} // <-- forward handler
          />
        ))}

        {projects.length === 0 && (
          <div className="projects-empty-grid">
            No projects to show.
          </div>
        )}
      </div>
    </div>
  );
}
