// ProjectsPage.jsx

import React, { useEffect, useState } from "react";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import "../components/projects/projects.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://192.168.137.3:3333/v1/projects";

/* ------------------ Static Images ------------------ */
const STATIC_IMAGES = [
  "/images/projects/project1.jpg",
  "/images/projects/project2.jpg",
  "/images/projects/project3.jpg",
];

/* ------------------ helper functions ------------------ */
function formatDateToDMY(dateInput) {
  if (!dateInput) return "";
  let d;
  if (typeof dateInput === "object" && dateInput._seconds) {
    d = new Date(dateInput._seconds * 1000);
  } else {
    d = new Date(dateInput);
  }
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function calcDaysLeft(deadline) {
  if (!deadline) return "";
  const now = new Date();
  let d;
  if (typeof deadline === "object" && deadline._seconds) {
    d = new Date(deadline._seconds * 1000);
  } else {
    d = new Date(deadline);
  }
  if (Number.isNaN(d.getTime())) return "";
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.ceil((dMid - nowMid) / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-0";
  return `D+${Math.abs(diffDays)}`;
}
function resolveImage(imageField, index, projectId) {
  if (typeof imageField === "string" && imageField.trim() !== "" && imageField !== "null" && imageField !== "undefined") {
    return imageField;
  }
  // Generate random but consistent fallback
  return `https://picsum.photos/seed/${encodeURIComponent(projectId || index)}/400/250`;
}
function normalizeTags(tagsField) {
  if (!tagsField) return [];
  if (Array.isArray(tagsField)) {
    return tagsField
      .map((t) => {
        if (!t) return "";
        if (typeof t === "string") return t;
        if (typeof t === "object") return t.name || t.title || t.value || JSON.stringify(t);
        return String(t);
      })
      .filter(Boolean);
  }
  if (typeof tagsField === "string")
    return tagsField.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function normalizeMembers(membersField) {
  if (!membersField || !Array.isArray(membersField)) return [];
  return membersField.map((m, i) => {
    if (!m) return { id: `m-${i}`, name: "Unknown", avatar: `https://i.pravatar.cc/40?img=${i + 1}` };
    return {
      id: m.id || m._id || m.userId || `m-${i}`,
      name: m.name || m.fullName || m.userId || "Member",
      role: m.role || "member",
      joinedAt: m.joinedAt && m.joinedAt._seconds ? new Date(m.joinedAt._seconds * 1000) : null,
      avatar:
        m.avatar ||
        `https://i.pravatar.cc/40?u=${encodeURIComponent(m.userId || m.name || `m-${i}`)}`,
    };
  });
}

/* ------------------ AddMemberModal ------------------ */
function AddMemberModal({ open, onClose, onSubmit, projectTitle }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setError(null);
      setSuccess(null);
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (ev) => {
      if (ev.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(email);
      setSuccess("Member added successfully.");
      setTimeout(() => {
        setSubmitting(false);
        setSuccess(null);
        onClose();
      }, 800);
    } catch (err) {
      console.error("Add member error:", err);
      setError(err?.message || "Failed to add member");
      setSubmitting(false);
    }
  };

  return (
    <div className="am-backdrop" role="dialog" aria-modal="true">
      <div className="am-modal">
        <h3 className="am-title">Add team member</h3>
        {projectTitle && (
          <div className="am-sub">
            Project: <strong>{projectTitle}</strong>
          </div>
        )}
        <form className="am-form" onSubmit={handleSubmit}>
          <label htmlFor="am-email" className="field-label">
            Member email
          </label>
          <input
            id="am-email"
            type="email"
            className="field-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            autoFocus
          />
          {error && <div className="am-error">{error}</div>}
          {success && <div className="am-success">{success}</div>}
          <div className="am-actions">
            <button type="button" className="btn discard" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn save" disabled={submitting}>
              {submitting ? "Adding..." : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------ ProjectsPage ------------------ */
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpenFor, setModalOpenFor] = useState(null);
  const [modalProjectTitle, setModalProjectTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No jwtToken found in localStorage");

        const res = await fetch(API_URL, {
          method: "GET",
          signal: controller.signal,
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error ${res.status}: ${text}`);
        }

        const data = await res.json();
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data.data)) list = data.data;
        else if (Array.isArray(data.projects)) list = data.projects;
        else if (data && typeof data === "object") list = [data];

        const mapped = list.map((p, idx) => {
          const id = p.id || p._id || `p-${idx}`;
          const title = p.name || p.title || "Untitled Project";
          const tags = normalizeTags(p.tags);
        const image = resolveImage(p.imageUrl || p.image, idx, id); // ✅ fixed
          const deadline = formatDateToDMY(p.deadline);
          const daysLeft = calcDaysLeft(p.deadline);
          const members = normalizeMembers(p.members || p.team);
          const tasksCount = Array.isArray(p.tasks) ? p.tasks.length : 0;
          const description =
            typeof p.description === "string"
              ? p.description
              : JSON.stringify(p.description || "");
          const priority = p.priority || "";
          return { id, title, tags, image, deadline, daysLeft, members, tasksCount, description, priority, raw: p };
        });
        if (isMounted) setProjects(mapped);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        if (isMounted) setError(err.message || "Failed to fetch projects");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProjects();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleNew = () => navigate("/dashboard/project/new");
  const handleOpen = (id) => navigate(`/dashboard/project/${id}`);
  const handleEdit = (id) => navigate(`/dashboard/project/${id}/edit`);

  const openAddMemberModal = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setModalProjectTitle(project ? project.title : "");
    setModalOpenFor(projectId);
  };
  const closeModal = () => setModalOpenFor(null);

  const submitAddMember = async (email) => {
    if (!modalOpenFor) throw new Error("No project selected");
    const projectId = modalOpenFor;
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}/${encodeURIComponent(projectId)}/team`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId, email }),
    });

    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.message || `Server error ${res.status}`);
      } catch {
        throw new Error(`Server error ${res.status}: ${text}`);
      }
    }

    const json = await res.json();
    const m = json.member || json.data || json;

    const memberUi = {
      id: m.userId || m.id || `u-${Date.now()}`,
      name: m.name || m.userId || "Member",
      role: m.role || "member",
      joinedAt: m.joinedAt || new Date().toISOString(),
      avatar: `https://i.pravatar.cc/40?u=${encodeURIComponent(m.userId || m.name || email)}`,
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, members: [...(p.members || []), memberUi] } : p
      )
    );

    return json;
  };

  return (
    <div className="projects-page-container">
      {loading && <div className="projects-loading">Loading projects…</div>}
      {error && <div className="projects-error"><p>{error}</p></div>}
      {!loading && !error && (
        <ProjectsGrid
          projects={projects}
          onNew={handleNew}
          onOpenProject={handleOpen}
          onEdit={handleEdit}
          onAddMember={openAddMemberModal}
        />
      )}
      {!loading && !error && projects.length === 0 && (
        <div className="projects-empty">
          <div className="alert alert-danger">No projects found.</div>
        </div>
      )}
      <AddMemberModal
        open={!!modalOpenFor}
        onClose={closeModal}
        onSubmit={submitAddMember}
        projectTitle={modalProjectTitle}
      />
    </div>
  );
}
