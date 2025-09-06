import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://192.168.137.3:3333/v1/projects";

export default function NewProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    projectName: "",
    tags: "",
    deadline: "",
    priority: "low",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const clearForm = () =>
    setForm({
      projectName: "",
      tags: "",
      deadline: "",
      priority: "low",
      description: "",
    });

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("You are not authenticated. Please login.");

      const payload = {
        name: form.projectName.trim(),
        description: form.description.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        deadline: form.deadline || null,
        priority:
          form.priority.charAt(0).toUpperCase() + form.priority.slice(1),
        imageUrl: "", // always blank for now
        isCustom: false,
      };

      console.log("Submitting payload:", payload);

      const res = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status >= 200 && res.status < 300) {
        const data = res.data;
        setSuccessMessage(data?.message || "Project created successfully!");
        clearForm();

        const created = data?.data || data?.project || data || null;
        const newId =
          (created && (created.id || created._id || created.projectId)) ||
          (data && data.id);

        setTimeout(() => {
          setSuccessMessage("");
          if (newId) navigate(`/dashboard/project/${newId}`);
        }, 900);
      } else {
        setServerError(res.data?.message || "Failed to create project.");
      }
    } catch (err) {
      console.error("Project creation error:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setServerError(
            err.response.data?.message ||
              `Server error: ${err.response.status}`
          );
        } else if (err.request) {
          setServerError("No response from server. Check backend connectivity.");
        } else {
          setServerError(err.message || "Unexpected error occurred.");
        }
      } else {
        setServerError(
          err?.message || "Unexpected error occurred. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-wrap">
      <section className="project-form-wrap">
        <form className="project-form-card" onSubmit={onSave}>
          <h2 className="form-title">New Project</h2>

          {serverError && (
            <div className="alert alert-danger" role="alert">
              {serverError}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="status">
              {successMessage}
            </div>
          )}

          <label className="field-label">Project Name:</label>
          <input
            className="field-input"
            name="projectName"
            value={form.projectName}
            onChange={onChange}
            placeholder="Enter Your Project Name"
            required
          />

          <label className="field-label">Tags (comma separated):</label>
          <input
            className="field-input"
            name="tags"
            value={form.tags}
            onChange={onChange}
            placeholder="marketing, q4, product-launch"
          />

          <label className="field-label">Deadline:</label>
          <input
            className="field-input"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={onChange}
          />

          <label className="field-label">Priority:</label>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                name="priority"
                value="low"
                checked={form.priority === "low"}
                onChange={onChange}
              />{" "}
              Low
            </label>
            <label>
              <input
                type="radio"
                name="priority"
                value="medium"
                checked={form.priority === "medium"}
                onChange={onChange}
              />{" "}
              Medium
            </label>
            <label>
              <input
                type="radio"
                name="priority"
                value="high"
                checked={form.priority === "high"}
                onChange={onChange}
              />{" "}
              High
            </label>
          </div>

          <label className="field-label">Description:</label>
          <textarea
            className="field-textarea"
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Enter Description"
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn discard"
              onClick={() => {
                clearForm();
                setServerError("");
                setSuccessMessage("");
              }}
              disabled={saving}
            >
              Discard
            </button>
            <button type="submit" className="btn save" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
