import { useEffect } from 'react';
import { portfolioData as data } from './content/portfolioData';
import PortfolioChatbot from './components/PortfolioChatbot';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Studies', href: '#studies' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' }
];

const isExternalLink = (url) =>
  typeof url === 'string' && url.trim() !== '' && url.trim() !== '#';

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const targets = document.querySelectorAll('[data-reveal]');
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />
      <div className="orb orb-three" aria-hidden="true" />

      <header className="masthead">
        <a className="brand" href="#home">
          <span className="brand-mark" aria-hidden="true" />
          {data.name}
        </a>

        <nav className="mast-nav">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="resume-pill" href={data.resumeUrl}>
          Resume
        </a>
      </header>

      <main>
        <section className="hero section-frame" id="home" data-reveal>
          <div className="hero-copy reveal-card" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">{data.role}</p>
            <h1>{data.tagline}</h1>
            <p className="hero-lead">{data.shortBio}</p>

            <div className="button-row">
              <a className="btn btn-solid" href="#projects">
                Explore Projects
              </a>
              <a className="btn btn-outline" href={`mailto:${data.email}`}>
                Let&apos;s Connect
              </a>
            </div>
          </div>

          <aside className="hero-panel reveal-card" style={{ '--delay': '130ms' }}>
            <p className="panel-label">Profile Snapshot</p>
            <ul>
              <li>
                <span>Location</span>
                <strong>{data.location}</strong>
              </li>
              <li>
                <span>Email</span>
                <strong>{data.email}</strong>
              </li>
              <li>
                <span>Phone</span>
                <strong>{data.phone}</strong>
              </li>
            </ul>
            <p className="panel-note">
              Learning deeply, shipping consistently, and building with purpose.
            </p>
          </aside>
        </section>

        <section className="section-frame section-block" id="about" data-reveal>
          <div className="section-head">
            <p className="section-label">About Me</p>
            <h2>My journey in tech and intelligent systems</h2>
          </div>

          <div className="about-layout">
            <div className="about-copy">
              {data.aboutParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className="reveal-card about-para"
                  style={{ '--delay': `${index * 90}ms` }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="highlight-grid">
              {data.highlights.map((item, index) => (
                <article
                  key={item.label}
                  className="highlight-card reveal-card"
                  style={{ '--delay': `${index * 120}ms` }}
                >
                  <p>{item.label}</p>
                  <h3>{item.value}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-frame section-block" id="studies" data-reveal>
          <div className="section-head">
            <p className="section-label">Studies</p>
            <h2>Academic milestones</h2>
          </div>

          <ol className="timeline">
            {data.studies.map((study, index) => (
              <li
                key={study.degree + study.institute}
                className="timeline-item reveal-card"
                style={{ '--delay': `${index * 110}ms` }}
              >
                <article className="timeline-card">
                  <p className="timeline-period">{study.period}</p>
                  <h3>{study.degree}</h3>
                  <p className="timeline-institute">{study.institute}</p>
                  <p className="timeline-score">{study.score}</p>
                  <p>{study.details}</p>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-frame section-block" id="projects" data-reveal>
          <div className="section-head">
            <p className="section-label">Projects</p>
            <h2>What I have built</h2>
          </div>

          <div className="project-grid">
            {data.projects.map((project, index) => (
              <article
                key={project.title}
                className="project-card reveal-card"
                style={{ '--delay': `${index * 120}ms` }}
              >
                <p className="project-index">{String(index + 1).padStart(2, '0')}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p className="impact-line">{project.impact}</p>

                <div className="tag-row">
                  {project.stack.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  <a
                    href={project.liveUrl}
                    target={isExternalLink(project.liveUrl) ? '_blank' : undefined}
                    rel={isExternalLink(project.liveUrl) ? 'noreferrer' : undefined}
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.repoUrl}
                    target={isExternalLink(project.repoUrl) ? '_blank' : undefined}
                    rel={isExternalLink(project.repoUrl) ? 'noreferrer' : undefined}
                  >
                    Source Code
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-frame section-block" id="skills" data-reveal>
          <div className="section-head">
            <p className="section-label">Skills</p>
            <h2>My toolkit</h2>
          </div>

          <div className="skills-grid">
            {data.skills.map((group, index) => (
              <article
                key={group.title}
                className="skill-card reveal-card"
                style={{ '--delay': `${index * 100}ms` }}
              >
                <h3>{group.title}</h3>
                <div className="tag-row">
                  {group.items.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-frame contact-block" id="contact" data-reveal>
          <div className="section-head">
            <p className="section-label">Contact</p>
            <h2>Open to meaningful opportunities</h2>
          </div>

          <p className="contact-copy">
            If you are looking for a curious builder who enjoys AI, engineering,
            and practical impact, let&apos;s collaborate.
          </p>

          <div className="button-row">
            <a className="btn btn-solid" href={`mailto:${data.email}`}>
              Email Me
            </a>
            <a className="btn btn-outline" href={data.resumeUrl}>
              View Resume
            </a>
          </div>

          <div className="social-strip">
            {data.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target={isExternalLink(social.url) ? '_blank' : undefined}
                rel={isExternalLink(social.url) ? 'noreferrer' : undefined}
              >
                {social.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          {new Date().getFullYear()} {data.name}. Crafted with React.
        </p>
      </footer>

      <PortfolioChatbot data={data} />
    </div>
  );
}

export default App;
