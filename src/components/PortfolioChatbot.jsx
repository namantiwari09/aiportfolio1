import { useEffect, useMemo, useRef, useState } from 'react';

const quickPrompts = [
  'Tell me about Naman',
  'Show studies',
  'What projects has he built?',
  'What are his core skills?',
  'How can I contact him?'
];

const safeLinks = (items = []) =>
  items.filter((item) => typeof item?.url === 'string' && item.url.trim() && item.url !== '#');

const greetingMessage = (name) => ({
  id: 'assistant-welcome',
  role: 'assistant',
  text: `Hello, I am ${name}'s portfolio assistant. Ask me about studies, projects, skills, or contact details.`,
  timestamp: Date.now()
});

const getAboutReply = (data) =>
  `Here is a quick profile:\n${data.aboutParagraphs.join('\n')}`;

const getStudiesReply = (data) => {
  const lines = data.studies.map(
    (study) => `- ${study.degree} | ${study.institute} | ${study.period}`
  );
  return `Academic journey:\n${lines.join('\n')}`;
};

const getProjectsReply = (data) => {
  const lines = data.projects.map(
    (project) => `- ${project.title}: ${project.description} Impact: ${project.impact}`
  );
  return `Featured projects:\n${lines.join('\n')}`;
};

const getSkillsReply = (data) => {
  const lines = data.skills.map((group) => `- ${group.title}: ${group.items.join(', ')}`);
  return `Core skills and tools:\n${lines.join('\n')}`;
};

const getContactReply = (data) =>
  `You can reach ${data.name} at:\nEmail: ${data.email}\nPhone: ${data.phone}`;

const getSocialReply = (data) => {
  const links = safeLinks(data.socials);
  if (!links.length) {
    return 'Social links will be added soon. You can use email for now.';
  }

  const lines = links.map((item) => `- ${item.label}: ${item.url}`);
  return `Social profiles:\n${lines.join('\n')}`;
};

const getResumeReply = (data) => {
  if (!data.resumeUrl || data.resumeUrl === '#') {
    return 'Resume link is not published yet. Please request it through email.';
  }

  return `You can view the resume here: ${data.resumeUrl}`;
};

const isQuestionMatch = (question, keywords) =>
  keywords.some((keyword) => question.includes(keyword));

function resolveAssistantReply(input, data) {
  const query = input.toLowerCase().trim();

  if (!query) {
    return 'Please type a message and I will help right away.';
  }

  if (isQuestionMatch(query, ['hello', 'hi', 'hey', 'good morning', 'good evening'])) {
    return `Hi there. I can share details about ${data.name}'s profile, education, projects, and contact info.`;
  }

  if (isQuestionMatch(query, ['about', 'yourself', 'profile', 'who is', 'naman'])) {
    return getAboutReply(data);
  }

  if (
    isQuestionMatch(query, [
      'study',
      'studies',
      'education',
      'college',
      'school',
      'matriculation',
      'intermediate'
    ])
  ) {
    return getStudiesReply(data);
  }

  if (
    isQuestionMatch(query, [
      'project',
      'projects',
      'built',
      'mentor',
      'avatar',
      'holographic',
      'portfolio work'
    ])
  ) {
    return getProjectsReply(data);
  }

  if (isQuestionMatch(query, ['skill', 'skills', 'tech', 'stack', 'tools', 'technology'])) {
    return getSkillsReply(data);
  }

  if (isQuestionMatch(query, ['contact', 'email', 'phone', 'reach', 'connect'])) {
    return getContactReply(data);
  }

  if (isQuestionMatch(query, ['social', 'github', 'linkedin', 'instagram'])) {
    return getSocialReply(data);
  }

  if (isQuestionMatch(query, ['resume', 'cv'])) {
    return getResumeReply(data);
  }

  if (
    isQuestionMatch(query, [
      'hire',
      'internship',
      'opportunity',
      'collaborate',
      'available',
      'freelance'
    ])
  ) {
    return `${data.name} is open to meaningful opportunities. You can start with an email at ${data.email}.`;
  }

  if (isQuestionMatch(query, ['thank', 'thanks'])) {
    return 'Happy to help. Feel free to ask anything else about the portfolio.';
  }

  return 'I can help with About, Studies, Projects, Skills, Resume, and Contact. Try one of the quick prompts below.';
}

function PortfolioChatbot({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => [greetingMessage(data.name)]);
  const scrollRef = useRef(null);

  const canSend = useMemo(() => message.trim().length > 0 && !isTyping, [message, isTyping]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const content = text.trim();
    if (!content || isTyping) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    window.setTimeout(() => {
      const reply = resolveAssistantReply(content, data);
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: reply,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 450);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    sendMessage(message);
  };

  return (
    <div className="chatbot-root" aria-live="polite">
      <button
        type="button"
        className={`chatbot-launcher ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="portfolio-chatbot-panel"
      >
        {isOpen ? 'Close Chat' : 'Chat with Assistant'}
      </button>

      {isOpen ? (
        <section className="chatbot-panel" id="portfolio-chatbot-panel">
          <header className="chatbot-head">
            <div>
              <p className="chatbot-title">Portfolio Assistant</p>
              <p className="chatbot-subtitle">Ask anything about {data.name}</p>
            </div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              x
            </button>
          </header>

          <div className="chatbot-stream" ref={scrollRef}>
            {messages.map((item) => (
              <article
                key={item.id}
                className={`chat-msg ${item.role === 'assistant' ? 'assistant' : 'user'}`}
              >
                <p>{item.text}</p>
              </article>
            ))}

            {isTyping ? (
              <article className="chat-msg assistant is-typing">
                <p>Typing...</p>
              </article>
            ) : null}
          </div>

          <div className="chatbot-prompt-row">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chat-prompt"
                onClick={() => sendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="chatbot-form" onSubmit={onSubmit}>
            <label htmlFor="chat-input" className="sr-only">
              Type your question
            </label>
            <input
              id="chat-input"
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about projects, studies, skills..."
              autoComplete="off"
            />
            <button type="submit" disabled={!canSend}>
              Send
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}

export default PortfolioChatbot;
