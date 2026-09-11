import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Mic, MicOff, Sparkles, Bot, User,
  Loader2, Volume2, VolumeX, Trash2, ExternalLink,
  Home, Info, Zap, FolderCode, Award, Trophy, FileText, Mail,
  Image, ArrowRight, CheckCircle
} from 'lucide-react';
import { assistantApi } from '../../api/assistant.api';
import { contactApi } from '../../api/contact.api';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  navLinks?: NavLink[];   // clickable navigation buttons inside message
  showContactForm?: boolean; // render inline contact form after this message
}

interface NavLink {
  label: string;
  to?: string;
  href?: string;
  icon?: React.ElementType;
}

// All navigable pages with icons
const PAGE_MAP: { keywords: string[]; to: string; label: string; icon: React.ElementType }[] = [
  { keywords: ['home', 'main page', 'start'], to: '/', label: 'Home', icon: Home },
  { keywords: ['about', 'who is', 'profile', 'bio'], to: '/about', label: 'About', icon: Info },
  { keywords: ['skill', 'tech stack', 'technology', 'language'], to: '/skills', label: 'Skills', icon: Zap },
  { keywords: ['project', 'work', 'app', 'portfolio work'], to: '/projects', label: 'Projects', icon: FolderCode },
  { keywords: ['certificate', 'cert', 'credential', 'course'], to: '/certificates', label: 'Certificates', icon: Award },
  { keywords: ['achievement', 'award', 'honor', 'hackathon'], to: '/achievements', label: 'Achievements', icon: Trophy },
  { keywords: ['resume', 'cv', 'bio-data', 'curriculum'], to: '/resume', label: 'Resume / CV', icon: FileText },
  { keywords: ['contact', 'hire', 'email', 'reach', 'connect'], to: '/contact', label: 'Contact', icon: Mail },
  { keywords: ['experience', 'job', 'internship', 'work history'], to: '/about', label: 'Experience', icon: Info },
  { keywords: ['education', 'degree', 'college', 'university'], to: '/about', label: 'Education', icon: Info },
  { keywords: ['gallery', 'photo', 'image', 'picture'], to: '/gallery', label: 'Gallery', icon: Image },
];

const QUICK_ACTIONS = [
  { label: '🏠 Home', to: '/', query: 'Home page' },
  { label: '📂 Projects', to: '/projects', query: 'Show Projects' },
  { label: '⚡ Skills', to: '/skills', query: 'Show Skills' },
  { label: '🏆 Achievements', to: '/achievements', query: 'Show Achievements' },
  { label: '📜 Certificates', to: '/certificates', query: 'Show Certificates' },
  { label: '📄 Resume', to: '/resume', query: 'View Resume' },
  { label: '👤 About Me', to: '/about', query: 'About Me' },
  { label: '✉️ Contact', action: 'contact', query: 'I want to contact Lokendra' },
];

/** Parse a query and return matching page nav links */
function detectNavLinks(query: string): NavLink[] {
  const q = query.toLowerCase();
  const found: NavLink[] = [];
  for (const page of PAGE_MAP) {
    if (page.keywords.some((kw) => q.includes(kw))) {
      found.push({ label: page.label, to: page.to, icon: page.icon });
    }
  }
  return found;
}

/** Whether query is asking to contact/connect */
function isContactIntent(query: string): boolean {
  const q = query.toLowerCase();
  return (
    q.includes('contact') ||
    q.includes('hire') ||
    q.includes('connect') ||
    q.includes('reach') ||
    q.includes('message lokendra') ||
    q.includes('send message') ||
    q.includes('email') ||
    q.includes('get in touch')
  );
}

// ────────────────────────────────────────────────────────────
// Inline Contact Form (inside chat bubble)
// ────────────────────────────────────────────────────────────
function InlineChatContactForm({ onSent }: { onSent: () => void }) {
  const [step, setStep] = useState<'name' | 'email' | 'message' | 'sending' | 'done'>('name');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => (inputRef.current as HTMLInputElement | null)?.focus(), 100);
  }, [step]);

  const next = async () => {
    setError('');
    if (step === 'name') {
      if (!name.trim()) return setError('Please enter your name');
      setStep('email');
    } else if (step === 'email') {
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setError('Enter a valid email');
      setStep('message');
    } else if (step === 'message') {
      if (!message.trim()) return setError('Please write a message');
      setStep('sending');
      try {
        await contactApi.submit({ name, email, subject: 'Portfolio Chat Message', message });
        setStep('done');
        setTimeout(onSent, 1800);
      } catch {
        setError('Failed to send. Please try again.');
        setStep('message');
      }
    }
  };

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <CheckCircle className="w-8 h-8 text-green-500" />
        <p className="text-sm font-bold text-text">Message Sent! ✅</p>
        <p className="text-xs text-muted text-center">Lokendra will get back to you soon.</p>
      </div>
    );
  }

  if (step === 'sending') {
    return (
      <div className="flex items-center gap-2 py-3">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="text-sm text-muted">Sending your message...</span>
      </div>
    );
  }

  const labels: Record<string, string> = {
    name: '👋 Your Name',
    email: '📧 Your Email',
    message: '💬 Your Message',
  };
  const placeholders: Record<string, string> = {
    name: 'e.g. John Doe',
    email: 'e.g. john@example.com',
    message: 'Write your message here...',
  };

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-semibold text-primary">{labels[step]}</p>
      {step === 'message' ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholders[step]}
          rows={3}
          className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={step === 'name' ? name : email}
          onChange={(e) => (step === 'name' ? setName(e.target.value) : setEmail(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && next()}
          placeholder={placeholders[step]}
          type={step === 'email' ? 'email' : 'text'}
          className="w-full text-xs px-3 py-2 rounded-xl border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      )}
      {error && <p className="text-[10px] text-error font-semibold">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={next}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/20"
        >
          {step === 'message' ? (
            <>Send Message <Send className="w-3 h-3" /></>
          ) : (
            <>Next <ArrowRight className="w-3 h-3" /></>
          )}
        </button>
      </div>
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 pt-1">
        {['name', 'email', 'message'].map((s) => (
          <div
            key={s}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              s === step ? 'bg-primary w-3' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Widget
// ────────────────────────────────────────────────────────────
export default function AIChatWidget() {
  const navigate = useNavigate();
  const { data: socialData } = useSocialLinks();
  const socialLinks = socialData?.data ?? [];
  const githubLink = socialLinks.find((s) => s.platform === 'github')?.url || 'https://github.com/lokendrakkumar01';
  const linkedinLink = socialLinks.find((s) => s.platform === 'linkedin')?.url || 'https://linkedin.com';

  const [isOpen, setIsOpen] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: "Hi! 👋 I'm Lokendra's AI Assistant. Ask me about his projects, skills, experience — or tap a quick button below. I can also connect you with him directly! 📬",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [contactFormDone, setContactFormDone] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Watch body scroll lock (hide widget when mobile sidebar open)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setBodyLocked(document.body.style.overflow === 'hidden');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  // ── TTS ──
  const speakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported');
      return;
    }
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[/#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // ── Navigate by keyword ──
  const triggerNavigation = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('github')) { window.open(githubLink, '_blank'); return; }
    if (q.includes('linkedin')) { window.open(linkedinLink, '_blank'); return; }
    const match = PAGE_MAP.find((p) => p.keywords.some((kw) => q.includes(kw)));
    if (match) navigate(match.to);
  };

  // ── Send message ──
  const sendMessage = async (text: string, fromVoice = false) => {
    if (!text.trim() || isLoading) return;
    const userText = text.trim();

    const navLinksFound = detectNavLinks(userText);
    const showContact = isContactIntent(userText);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Immediate navigation on intent
    triggerNavigation(userText);

    try {
      const history = messages.filter((m) => m.id !== '0').map((m) => ({ role: m.role, text: m.text }));
      const res = await assistantApi.chat(userText, history);
      const aiReply = res.data?.reply || 'Lokendra Kumar is a Full-Stack Developer. Explore his portfolio!';
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: aiReply,
        timestamp: new Date(),
        navLinks: navLinksFound.length > 0 ? navLinksFound : undefined,
        showContactForm: showContact && !contactFormDone,
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (fromVoice) speakText(aiMsg.id, aiReply);
    } catch {
      const fallback = "I couldn't reach my brain right now 😅 But you can explore Lokendra's portfolio directly — tap the buttons below!";
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: fallback,
        timestamp: new Date(),
        navLinks: navLinksFound.length > 0 ? navLinksFound : [
          { label: 'Projects', to: '/projects', icon: FolderCode },
          { label: 'Contact', to: '/contact', icon: Mail },
        ],
        showContactForm: showContact && !contactFormDone,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Quick action chip click ──
  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    if (action.action === 'contact') {
      // Directly trigger a contact intent message
      sendMessage(action.query);
    } else if (action.to) {
      navigate(action.to);
      sendMessage(action.query);
    }
  };

  // ── Voice ──
  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error('Speech recognition not supported. Please type.'); return; }
    if (isListening) {
      try { recognitionRef.current?.stop(); } catch {}
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => { setIsListening(true); toast('Listening... Speak now!', { icon: '🎙️' }); };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) { setInput(transcript); sendMessage(transcript, true); }
      };
      recognition.onerror = (event: any) => {
        setIsListening(false);
        const err = event?.error;
        if (err === 'not-allowed') toast.error('Microphone permission denied.');
        else if (err === 'no-speech') toast('No speech detected. Try again!', { icon: '🎙️' });
        else toast('Voice input paused. Type instead.', { icon: '💡' });
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setIsListening(false);
      toast.error('Could not access microphone. Please type.');
    }
  };

  // ── Clear ──
  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setContactFormDone(false);
    setMessages([{
      id: '0',
      role: 'assistant',
      text: "Chat cleared! 👋 How can I help you explore Lokendra's portfolio?",
      timestamp: new Date(),
    }]);
    toast.success('Chat cleared');
  };

  if (bodyLocked && !isOpen) return null;

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl hover:shadow-primary/30 flex items-center justify-center transition-all border border-white/20"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Chat with AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(580px, calc(100vh - 140px))' }}
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-border/80 px-4 py-3.5 flex items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-text text-sm truncate">Lokendra's AI Assistant</h3>
                  <p className="text-[11px] text-muted font-medium">Ask anything · Navigate · Connect</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={clearChat} className="p-1.5 rounded-xl hover:bg-card text-muted hover:text-error transition-colors" title="Clear chat">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl hover:bg-card text-muted hover:text-text transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="px-3 py-2 bg-surface/50 border-b border-border/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => handleQuickAction(a)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-card border border-border/70 text-muted hover:text-primary hover:border-primary/50 whitespace-nowrap transition-all flex-shrink-0 active:scale-95"
                >
                  {a.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5" style={{ minHeight: 160 }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}

                  <div className="relative group max-w-[84%]">
                    {/* Bubble */}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-none font-medium shadow-md shadow-primary/20'
                          : 'bg-card border border-border text-text rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.text}

                      {/* Inline nav link buttons */}
                      {msg.role === 'assistant' && msg.navLinks && msg.navLinks.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {msg.navLinks.map((nl) =>
                            nl.to ? (
                              <Link
                                key={nl.to}
                                to={nl.to}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold hover:bg-primary hover:text-white transition-all active:scale-95"
                              >
                                {nl.icon && <nl.icon className="w-3 h-3" />}
                                {nl.label}
                                <ArrowRight className="w-2.5 h-2.5" />
                              </Link>
                            ) : nl.href ? (
                              <a
                                key={nl.href}
                                href={nl.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold hover:bg-primary hover:text-white transition-all"
                              >
                                {nl.label}
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : null
                          )}
                        </div>
                      )}

                      {/* Inline contact form */}
                      {msg.role === 'assistant' && msg.showContactForm && !contactFormDone && (
                        <InlineChatContactForm
                          onSent={() => {
                            setContactFormDone(true);
                            toast.success('Message sent to Lokendra!');
                          }}
                        />
                      )}
                    </div>

                    {/* TTS for assistant */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => speakText(msg.id, msg.text)}
                        className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-muted hover:text-primary transition-colors"
                      >
                        {speakingId === msg.id ? (
                          <><VolumeX className="w-3 h-3 text-primary animate-pulse" /><span className="text-primary font-bold">Stop</span></>
                        ) : (
                          <><Volume2 className="w-3 h-3" /><span>Listen</span></>
                        )}
                      </button>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-xs text-muted font-medium">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-border p-3 bg-card/60 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoice}
                  className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                    isListening
                      ? 'bg-error text-white animate-pulse shadow-md shadow-error/30'
                      : 'bg-surface border border-border text-muted hover:text-primary hover:border-primary/50'
                  }`}
                  aria-label="Voice input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
                  }}
                  placeholder={isListening ? 'Listening... speak now!' : 'Ask anything or say "show projects"...'}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 text-sm bg-surface border border-border/80 rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-30 transition-all flex-shrink-0 active:scale-95 shadow-md shadow-primary/20"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
