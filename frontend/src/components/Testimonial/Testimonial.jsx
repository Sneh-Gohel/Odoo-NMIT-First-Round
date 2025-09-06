import React from "react";
import "./Testimonial.css";

/**
 * props:
 *  - testimonials: array of { id, image, name, company, text }
 *  - speed: number (seconds it takes to scroll the full set once) default 24
 *  - gap: spacing between cards in px default 20
 */
export default function TestimonialsMarquee({
  testimonials = [],
  speed = 24,
  gap = 20,
}) {
  // if less than 1 item, return nothing
  if (!testimonials || testimonials.length === 0) return null;

  // split into two alternating lists to create visual difference
  const rowA = testimonials.filter((_, i) => i % 2 === 0);
  const rowB = testimonials.filter((_, i) => i % 2 !== 0);

  // helper to render one track (duplicated content for seamless loop)
  const renderTrack = (items, reverse = false, idx = 0) => {
    const customStyle = {
      // speed controls animation-duration
      animationDuration: `${speed}s`,
      gap: `${gap}px`,
    };

    return (
      <>
        
        <div
          className={`marquee-track-wrapper ${reverse ? "reverse" : ""}`}
          key={idx}
          // store duration on the wrapper for easier pause-on-hover via CSS
          style={{
            "--marquee-duration": `${speed}s`,
            "--card-gap": `${gap}px`,
          }}
        >
          <div
            className="marquee-track"
            style={customStyle}
            aria-hidden="true" // duplicate track is decorative for continuity
          >
            {items.map((t) => (
              <article key={t.id} className="testimonial-card">
                <div className="avatar-wrap">
                  <img
                    src={t.image}
                    alt={`${t.name} — ${t.company}`}
                    className="avatar"
                  />
                </div>
                <div className="testimonial-body">
                  <p className="testimonial-text">“{t.text}”</p>
                  <p className="testimonial-meta">
                    <span className="name">{t.name}</span>
                    <span className="company"> — {t.company}</span>
                  </p>
                </div>
              </article>
            ))}
            {/* duplicate once for smooth infinite scroll */}
            {items.map((t) => (
              <article key={`${t.id}-dup`} className="testimonial-card">
                <div className="avatar-wrap">
                  <img
                    src={t.image}
                    alt={`${t.name} — ${t.company}`}
                    className="avatar"
                  />
                </div>
                <div className="testimonial-body">
                  <p className="testimonial-text">“{t.text}”</p>
                  <p className="testimonial-meta">
                    <span className="name">{t.name}</span>
                    <span className="company"> — {t.company}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="testimonials-marquee" aria-label="Testimonials">
        <h1 className="logo__gradient testimonial-title">Testimonials</h1>
      {renderTrack(rowA.length ? rowA : testimonials, false, 0)}
      {renderTrack(rowB.length ? rowB : testimonials, true, 1)}
    </section>
  );
}
