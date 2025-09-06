import React from "react";
import "./projects.css";

/** Robust avatar resolver */
function resolveAvatar(m, idx) {
  if (!m) return `/images/avatars/avatar${(idx % 6) + 1}.png`;
  if (typeof m === "string") return m;
  if (typeof m === "object") {
    if (typeof m.avatar === "string" && m.avatar.trim()) return m.avatar;
    if (typeof m.avatarUrl === "string" && m.avatarUrl.trim()) return m.avatarUrl;
    if (typeof m.photo === "string" && m.photo.trim()) return m.photo;
    if (typeof m.url === "string" && m.url.trim()) return m.url;
    if (typeof m.image === "string" && m.image.trim()) return m.image;
    if (typeof m.profilePic === "string" && m.profilePic.trim()) return m.profilePic;
    if (typeof m.picture === "string" && m.picture.trim()) return m.picture;

    if (m.avatar && typeof m.avatar === "object" && typeof m.avatar.url === "string") return m.avatar.url;
    if (m.avatar && typeof m.avatar === "object" && typeof m.avatar.path === "string") return m.avatar.path;
    if (m.avatar && typeof m.avatar === "object" && typeof m.avatar.src === "string") return m.avatar.src;

    if (m.profile && typeof m.profile === "object") {
      if (typeof m.profile.url === "string" && m.profile.url.trim()) return m.profile.url;
      if (m.profile.image && typeof m.profile.image === "object" && typeof m.profile.image.url === "string")
        return m.profile.image.url;
    }

    if (m.user && typeof m.user === "object") {
      if (typeof m.user.avatar === "string" && m.user.avatar.trim()) return m.user.avatar;
      if (m.user.avatarUrl && typeof m.user.avatarUrl === "string") return m.user.avatarUrl;
      if (m.user.profile && typeof m.user.profile === "object" && typeof m.user.profile.url === "string")
        return m.user.profile.url;
    }

    if (m.data && typeof m.data === "object") {
      if (typeof m.data.url === "string") return m.data.url;
      if (typeof m.data.avatar === "string") return m.data.avatar;
    }

    if (m.id && typeof m.id === "string") return `/images/avatars/avatar${(idx % 6) + 1}.png`;

    return `/images/avatars/avatar${(idx % 6) + 1}.png`;
  }
  return `/images/avatars/avatar${(idx % 6) + 1}.png`;
}

/** Safely get member name for tooltip */
function resolveMemberName(m) {
  if (!m) return "Member";
  if (typeof m === "string") return m;
  if (typeof m === "object") {
    return (
      m.name ||
      m.fullName ||
      (m.user && (m.user.name || m.user.fullName)) ||
      m.username ||
      (m.email ? m.email.split("@")[0] : null) ||
      JSON.stringify(m).slice(0, 60)
    );
  }
  return String(m);
}

function normalizeTag(t) {
  if (t == null) return "";
  if (typeof t === "string") return t;
  if (typeof t === "object") {
    return t.name || t.title || t.label || t.value || JSON.stringify(t);
  }
  return String(t);
}

export default function ProjectCard({
  id,
  title,
  tags = [],
  image,
  deadline,
  daysLeft,
  members = [],
  tasksCount = 0,
  onAddMember = () => {},
  onOpen = () => {},
  onEdit = () => {},
}) {
  const handleCardClick = () => onOpen(id);

  // ✅ Always provide fallback project image
  const fallbackImage = "/images/projects/default.jpg";
  const displayImage = image && image.trim() !== "" ? image : fallbackImage;

  return (
    <div
      className="card ps-card h-100"
      role="article"
      aria-labelledby={`ps-title-${id}`}
    >
      <div
        className="position-relative ps-thumb-wrap"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
      >
        <img
          src={displayImage}
          className="ps-thumb-img"
          alt={`${title} cover`}
        />

        <button
          type="button"
          className="btn btn-sm ps-edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(id);
          }}
          aria-label={`Edit ${title}`}
        >
          <i className="fa-solid fa-pen-to-square" aria-hidden></i>
        </button>
      </div>

      <div className="card-body d-flex flex-column">
        <div className="ps-tags mb-2" aria-hidden>
          {Array.isArray(tags) &&
            tags.map((t, i) => (
              <span key={i} className={`ps-tag ps-tag-${i % 4}`}>
                {normalizeTag(t)}
              </span>
            ))}
        </div>

        <h6
          id={`ps-title-${id}`}
          className="card-title ps-title"
          onClick={handleCardClick}
        >
          {title}
        </h6>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center text-muted small">
              <i className="fa-solid fa-flag me-2" aria-hidden></i>
              <span>{deadline}</span>
            </div>
            <div className="ps-days text-muted small">{daysLeft}</div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {Array.isArray(members) &&
                members.slice(0, 3).map((m, idx) => {
                  const src = resolveAvatar(m, idx);
                  const title = resolveMemberName(m);
                  return (
                    <img
                      key={(m && (m.id || m._id)) || idx}
                      src={src}
                      alt={title}
                      title={title}
                      className="rounded-circle ps-avatar"
                    />
                  );
                })}

              {Array.isArray(members) && members.length > 3 && (
                <span className="text-muted small ms-2">
                  +{members.length - 3}
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                className="btn ps-tasks-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(id);
                }}
              >
                {tasksCount} Tasks
              </button>

              <button
                type="button"
                className="btn ps-add-member"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddMember(id);
                }}
                title="Assign team member"
                style={{ padding: "6px 10px", borderRadius: 8 }}
              >
                <i className="fa-solid fa-user-plus" aria-hidden></i>
                <span style={{ marginLeft: 8 }}>Assign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
