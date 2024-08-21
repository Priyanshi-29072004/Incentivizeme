import React, { useState } from "react";
import axios from "axios";

const ProjectList = ({ projects }) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [markComplete, setMarkComplete] = useState(true);

  const handleSelectionChange = (projectId) => {
    setSelectedProjects((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  const handleMarkComplete = async () => {
    try {
      await axios.post("/project/mark-complete", {
        projectIds: selectedProjects,
        markComplete,
      });
      // Handle success (e.g., refresh project list)
    } catch (err) {
      console.error("Error marking projects:", err);
    }
  };

  return (
    <div>
      <button onClick={() => setMarkComplete(true)}>Mark Complete</button>
      <button onClick={() => setMarkComplete(false)}>Mark Open</button>
      <button onClick={handleMarkComplete}>Apply</button>

      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <input
              type="checkbox"
              checked={selectedProjects.includes(project._id)}
              onChange={() => handleSelectionChange(project._id)}
            />
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
