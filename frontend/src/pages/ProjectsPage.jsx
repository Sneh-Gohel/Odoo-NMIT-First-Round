// Replace/Add this inside your ProjectsPage.jsx (or replace the whole file)
// Only changed part is AddMemberModal hook ordering; rest is the same integration.

import React, { useEffect, useState } from "react";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import "../components/projects/projects.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://192.168.137.3:3333/v1/projects";

/* --- helper fns (format, normalize...) kept as before --- */
// ... (keep your existing helper functions: formatDateToDMY, calcDaysLeft, resolveImage, normalizeTags, normalizeMembers) ...
// For brevity, assume they are present above exactly as in your working file.
function formatDateToDMY(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return String(dateInput);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function calcDaysLeft(deadline) {
  if (!deadline) return "";
  const now = new Date();
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return "";
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.ceil((dMid - nowMid) / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-0";
  return `D+${Math.abs(diffDays)}`;
}

function resolveImage(imageField, fallbackSeed) {
  if (!imageField)
    return `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/400/200`;
  if (typeof imageField === "string" && imageField.trim() !== "") return imageField;
  if (typeof imageField === "object") {
    if (imageField.url) return imageField.url;
    if (imageField.path) return imageField.path;
    if (imageField.src) return imageField.src;
    if (imageField.data && imageField.data.url) return imageField.data.url;
  }
  return `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/400/200`;
}

function normalizeTags(tagsField) {
  if (!tagsField) return [];
  if (Array.isArray(tagsField)) {
    return tagsField
      .map((t) => {
        if (!t && t !== 0) return "";
        if (typeof t === "string") return t;
        if (typeof t === "object") {
          return t.name || t.title || t.tag || t.label || t.value || JSON.stringify(t);
        }
        return String(t);
      })
      .filter(Boolean);
  }
  if (typeof tagsField === "string")
    return tagsField.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function normalizeMembers(membersField) {
  if (!membersField) return [];
  if (!Array.isArray(membersField)) return [];
  return membersField.map((m, i) => {
    if (!m)
      return { id: `m-${i}`, avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}` };
    if (typeof m === "string")
      return { id: m, avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}` };
    return {
      id: m.id || m._id || m.userId || `m-${i}`,
      avatar:
        m.avatar ||
        m.avatarUrl ||
        m.photo ||
        m.profilePic ||
        `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
      name: m.name || m.fullName || null,
    };
  });
}
/* ------------------ AddMemberModal (fixed hook order) ------------------ */
function AddMemberModal({ open, onClose, onSubmit, projectTitle }) {
  // ---- ALL hooks must be defined unconditionally at top ----
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Reset local modal state whenever modal is closed/opened
  useEffect(() => {
    if (!open) {
      setEmail("");
      setError(null);
      setSuccess(null);
      setSubmitting(false);
    }
  }, [open]);

  // Keyboard escape handler — also unconditional hook
  useEffect(() => {
    if (!open) return; // still ok to early-return inside effect body
    const onKey = (ev) => {
      if (ev.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // ---- now it's safe to short-circuit render if not open ----
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
      // onSubmit is provided by parent and returns a Promise
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
    <div className="am-backdrop" role="dialog" aria-modal="true" aria-label="Add team member">
      <div className="am-modal">
        <h3 className="am-title">Add team member</h3>
        {projectTitle && <div className="am-sub">Project: <strong>{projectTitle}</strong></div>}

        <form className="am-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="am-email">Member email</label>
          <input
            id="am-email"
            className="field-input"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            autoFocus
          />

          {error && <div className="am-error" role="alert">{error}</div>}
          {success && <div className="am-success" role="status">{success}</div>}

          <div className="am-actions">
            <button type="button" className="btn discard" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn save" disabled={submitting}>
              {submitting ? <span className="spinner" aria-hidden /> : null}
              {submitting ? "Adding..." : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------ ProjectsPage (same integration) ------------------ */
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
        if (!token) {
          throw new Error("No jwtToken found in localStorage");
        }

        const res = await fetch(API_URL, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error ${res.status}: ${text}`);
        }

        const data = await res.json();

        let list = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.data)) list = data.data;
        else if (data && data.data && typeof data.data === "object") list = [data.data];
        else if (data && Array.isArray(data.items)) list = data.items;
        else if (data && Array.isArray(data.projects)) list = data.projects;
        else if (data && typeof data === "object" && (data.name || data.tags || data.deadline || data.imageUrl)) list = [data];
        else list = [];

        const mapped = list
          .filter((p) => !!p && typeof p === "object")
          .map((p, idx) => {
            const id = p.id || p._id || p._idString || p._id || `p-${idx}`;
            const title = p.name || p.title || p.projectName || "Untitled Project";
            const tags = normalizeTags(p.tags || p.tagList || p.categories || p.category);
            const image = resolveImage(p.imageUrl || p.image || p.thumbnail || (p.cover && p.cover.url), id);
            const rawDeadline = p.deadline || p.dueDate || p.deadlineAt || null;
            const deadline = formatDateToDMY(rawDeadline);
            const daysLeft = calcDaysLeft(rawDeadline);
            const members = normalizeMembers(p.members || p.team || p.participants);
            const tasksCount = Array.isArray(p.tasks) ? p.tasks.length : typeof p.tasksCount === "number" ? p.tasksCount : p.taskCount || 0;
            const description = p.description || p.desc || "";
            const priority = p.priority || p.priorityLevel || "";
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
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
    const newMember = json.member;

    const memberUi = {
      id: newMember.userId || `u-${Date.now()}`,
      name: newMember.name || newMember.userId || "Member",
      role: newMember.role || "member",
      joinedAt: newMember.joinedAt || new Date().toISOString(),
      avatar: `https://i.pravatar.cc/40?u=${encodeURIComponent(newMember.userId || newMember.name || email)}`,
    };

    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, members: [...(p.members || []), memberUi] } : p)));

    return json;
  };

  return (
    <div className="projects-page-container">
      {loading && <div className="projects-loading">Loading projects…</div>}

      {error && (
        <div className="projects-error">
          <p>Could not load projects: {error}</p>
        </div>
      )}

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
          No projects found. Click{" "}
          <button onClick={handleNew} className="link-like">
            New Project
          </button>{" "}
          to create one.
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
