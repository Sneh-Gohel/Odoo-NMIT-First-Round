// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../components/projects/projects.css";

const API_ROOT = "http://192.168.137.3:3333/v1/projects";
const DETAILS_ENDPOINT = `${API_ROOT}/details`;
const TASKS_ROOT = "http://192.168.137.3:3333/v1/tasks";

/* Helpers */
function firebaseTsToDate(ts) {
  if (!ts) return null;
  if (typeof ts === "object" && ts._seconds != null) return new Date(ts._seconds * 1000);
  if (typeof ts === "object" && ts.seconds != null) return new Date(ts.seconds * 1000);
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? null : d;
}
function shortDateIso(d) {
  if (!d) return "";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}
function avatarFor(m, i) {
  if (!m) return `https://i.pravatar.cc/40?img=${(i % 70) + 1}`;
  if (typeof m === "string") return m;
  return m.avatar || m.avatarUrl || `https://i.pravatar.cc/40?u=${encodeURIComponent(m.userId || m.id || i)}`;
}

/* --- AddMemberModal --- */
function AddMemberModal({ open, onClose, onSubmit, projectTitle }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  React.useEffect(() => {
    if (!open) {
      setEmail("");
      setErr(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;
  const validateEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!validateEmail(email)) {
      setErr("Please enter a valid email.");
      return;
    }
    try {
      setLoading(true);
      await onSubmit(email);
      onClose();
    } catch (error) {
      setErr(error?.message || "Failed to add member");
    } finally {
      setLoading(false);
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
        <form className="am-form" onSubmit={submit}>
          <label className="field-label">Email</label>
          <input
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            autoFocus
            disabled={loading}
          />
          {err && <div className="am-error">{err}</div>}
          <div className="am-actions">
            <button type="button" className="btn discard" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn save" disabled={loading}>
              {loading ? "Adding..." : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- AddTaskModal --- */
function AddTaskModal({ open, onClose, onSubmit, members = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setDueDate("");
      setPriority("Medium");
      setLoading(false);
      setErr(null);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!title.trim()) {
      setErr("Title is required");
      return;
    }
    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        assigneeId: assigneeId || null,
        dueDate: dueDate || null,
        status: "To-Do",
        priority,
      });
      onClose();
    } catch (error) {
      setErr(error?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="am-backdrop" role="dialog" aria-modal="true">
      <div className="am-modal">
        <h3 className="am-title">Add Task</h3>
        <form className="am-form" onSubmit={submit}>
          <label className="field-label">Title</label>
          <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <label className="field-label">Description</label>
          <textarea className="field-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label className="field-label">Assignee</label>
          <select className="field-input" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name || m.email || m.id}
              </option>
            ))}
          </select>
          <label className="field-label">Due date</label>
          <input className="field-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <label className="field-label">Priority</label>
          <select className="field-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          {err && <div className="am-error">{err}</div>}
          <div className="am-actions">
            <button type="button" className="btn discard" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn save" disabled={loading}>
              {loading ? "Adding..." : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- AssignModal --- */
function AssignModal({ open, onClose, task, members = [], onSave }) {
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  React.useEffect(() => {
    if (!open) {
      setAssigneeId(task?.assigneeId || "");
      setLoading(false);
      setErr(null);
    } else setAssigneeId(task?.assigneeId || "");
  }, [open, task]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      setLoading(true);
      await onSave(assigneeId || null);
      onClose();
    } catch (error) {
      setErr(error?.message || "Failed to assign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="am-backdrop" role="dialog" aria-modal="true">
      <div className="am-modal">
        <h3 className="am-title">Assign Task</h3>
        <form className="am-form" onSubmit={submit}>
          <label className="field-label">Assign to</label>
          <select className="field-input" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name || m.email || m.id}
              </option>
            ))}
          </select>
          {err && <div className="am-error">{err}</div>}
          <div className="am-actions">
            <button type="button" className="btn discard" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn save" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --- TaskRow --- */
function TaskRow({ t, members, onOpenAssign }) {
  const assignee = members.find((m) => (m.id || m.userId) === (t.assigneeId || t.assignee));
  return (
    <div className="task-row">
      <div className="task-left">
        <div className="task-title">{t.title}</div>
        <div className="task-desc">{t.description}</div>
        <div className="task-meta">
          <small>Due: {t.dueDate ? shortDateIso(t.dueDate) : "—"}</small>
          <small style={{ marginLeft: 12 }}>Priority: {t.priority}</small>
        </div>
      </div>
      <div className="task-right">
        <div className="task-assignee">
          {assignee ? (
            <img
              src={assignee.avatar}
              className="member-avatar"
              alt={assignee.name || assignee.email}
              title={assignee.name || assignee.email}
            />
          ) : (
            <div className="unassigned">—</div>
          )}
        </div>
        <div className="task-actions">
          {/* <button className="btn" onClick={() => onOpenAssign(t)} title="Assign / reassign">
            <i className="fa-solid fa-user-pen" /> Assign
          </button> */}
        </div>
      </div>
    </div>
  );
}

/* --- ProjectDetail --- */
export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [assignTask, setAssignTask] = useState(null);

  /* load project */
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function tryJson(res) {
      try {
        const json = await res.json();
        return json && json.data ? json.data : json;
      } catch {
        return null;
      }
    }

    async function load() {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("jwtToken") || "";
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        let rawProject = null;

        // try multiple endpoints
        try {
          const q = `${DETAILS_ENDPOINT}?id=${encodeURIComponent(id)}`;
          const res = await fetch(q, { headers, signal: controller.signal });
          if (res.ok) rawProject = await tryJson(res);
        } catch {}
        if (!rawProject) {
          try {
            const res = await fetch(DETAILS_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...headers },
              body: JSON.stringify({ id }),
              signal: controller.signal,
            });
            if (res.ok) rawProject = await tryJson(res);
          } catch {}
        }
        if (!rawProject) {
          try {
            const res = await fetch(`${API_ROOT}/${encodeURIComponent(id)}`, { headers, signal: controller.signal });
            if (res.ok) rawProject = await tryJson(res);
          } catch {}
        }

        if (!rawProject) {
          const resAll = await fetch(API_ROOT, { headers, signal: controller.signal });
          if (!resAll.ok) throw new Error(`Failed to fetch projects list: ${resAll.status}`);
          const listJson = await resAll.json();
          const arr = Array.isArray(listJson)
            ? listJson
            : listJson && Array.isArray(listJson.data)
            ? listJson.data
            : listJson.projects || [];
          rawProject = arr.find((p) => String(p.id || p._id || p.name) === String(id));
          if (!rawProject) throw new Error("Project not found");
        }

        // normalize
        const rawMembers = rawProject.team || rawProject.members || [];
        const members = (Array.isArray(rawMembers) ? rawMembers : []).map((m, i) => ({
          id: m.userId || m.id || m._id || `m-${i}`,
          name: m.name || m.fullName || m.email || null,
          email: m.email || null,
          avatar: avatarFor(m, i),
        }));
        const rawTasks = rawProject.tasks || [];
        const normalizedTasks = (Array.isArray(rawTasks) ? rawTasks : []).map((t, idx) => ({
          id: t.id || t._id || t.taskId || `task-${idx}-${Date.now()}`,
          title: t.title || t.name || "Untitled",
          description: t.description || t.desc || "",
          assigneeId: t.assigneeId || t.assignee || t.userId || null,
          dueDate: t.dueDate
            ? t.dueDate._seconds
              ? new Date(t.dueDate._seconds * 1000).toISOString()
              : new Date(t.dueDate).toISOString()
            : null,
          priority: t.priority || "Medium",
          status: t.status || "To-Do",
          raw: t,
        }));

        const proj = {
          id: rawProject.id || rawProject._id || id,
          title: rawProject.name || rawProject.title || "Project",
          description: rawProject.description || rawProject.desc || "",
          tags: rawProject.tags || [],
          deadline: firebaseTsToDate(rawProject.deadline) || null,
          priority: rawProject.priority || "",
          image: rawProject.imageUrl || rawProject.image || "",
          members,
          raw: rawProject,
        };

        if (!mounted) return;
        setProject(proj);
        setTasks(normalizedTasks);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to load project");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  /* Add team member */
  const handleAddMember = async (email) => {
    if (!project) throw new Error("No project loaded");
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_ROOT}/${encodeURIComponent(project.id)}/team`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId: project.id, email }), // ✅ include projectId
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to add member: ${res.status} ${text}`);
    }

    const json = await res.json();
    const m = json.member || json.data || json;
    const memberUi = {
      id: m.userId || m.id || m._id || `m-${Date.now()}`,
      name: m.name || null,
      email: m.email || null,
      avatar: m.avatar || `https://i.pravatar.cc/40?u=${encodeURIComponent(m.userId || m.id || m.name || email)}`,
      role: m.role || null,
      joinedAt: m.joinedAt || null,
    };
    setProject((prev) => (prev ? { ...prev, members: [...(prev.members || []), memberUi] } : prev));
    return memberUi;
  };

  /* Add task */
  const handleAddTask = async (payload) => {
    if (!project) throw new Error("No project loaded");
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("Not authenticated");

    const body = {
      projectId: project.id,
      title: payload.title,
      description: payload.description,
      assigneeId: payload.assigneeId,
      dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString() : null,
      priority: payload.priority,
      status: payload.status,
    };

    const res = await fetch(`${TASKS_ROOT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to create task: ${res.status} ${text}`);
    }
    const json = await res.json();
    const t = json.task || json.data || json;
    const taskUi = {
      id: t.id || t._id || `task-${Date.now()}`,
      title: t.title,
      description: t.description || "",
      assigneeId: t.assigneeId || null,
      dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
      priority: t.priority || "Medium",
      status: t.status || "To-Do",
      raw: t,
    };
    setTasks((old) => [...old, taskUi]);
  };

  /* Assign task */
  const handleAssignSave = async (assigneeId) => {
    if (!assignTask) return;
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${TASKS_ROOT}/${encodeURIComponent(assignTask.id)}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId: project.id, assigneeId }), // ✅ include projectId
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to assign task: ${res.status} ${text}`);
    }
    setTasks((old) => old.map((t) => (t.id === assignTask.id ? { ...t, assigneeId } : t)));
  };

  if (loading) return <div className="loader">Loading project…</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!project) return <div>No project found</div>;

  return (
    <div className="project-detail">
      <button className="btn back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>{project.title}</h2>
      {project.deadline && <div>Deadline: {shortDateIso(project.deadline)}</div>}
      {project.priority && <div>Priority: {project.priority}</div>}
      <p>{project.description}</p>

      <h3>Team Members</h3>
      <div className="members-row">
        {project.members.map((m, i) => (
          <img
            key={m.id || i}
            src={m.avatar}
            className="member-avatar"
            alt={m.name || m.email}
            title={m.name || m.email}
          />
        ))}
        <button className="btn add btn-dark text-white my-3" onClick={() => setAddMemberOpen(true)}>
          + Add member
        </button>
      </div>

      <h3>Tasks</h3>
      <div className="tasks-list">
        {tasks.map((t) => (
          <TaskRow key={t.id} t={t} members={project.members} onOpenAssign={setAssignTask} />
        ))}
        <button className="btn add btn-dark text-white my-3" onClick={() => setAddTaskOpen(true)}>
          + Add task
        </button>
      </div>

      {/* Modals */}
      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onSubmit={handleAddMember}
        projectTitle={project.title}
      />
      <AddTaskModal
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onSubmit={handleAddTask}
        members={project.members}
      />
      <AssignModal
        open={!!assignTask}
        onClose={() => setAssignTask(null)}
        task={assignTask}
        members={project.members}
        onSave={handleAssignSave}
      />
    </div>
  );
}
