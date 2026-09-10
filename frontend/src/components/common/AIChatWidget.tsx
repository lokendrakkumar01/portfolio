import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Mic, MicOff, Sparkles, Bot, User,
  Loader2, Volume2, VolumeX, Trash2
} from 'lucide-react';
import { assistantApi } from '../../api/assistant.api';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: '📂 Projects', query: 'Show Projects', route: '/projects' },
  { label: '📜 Certificates', query: 'Show Certificates', route: '/certificates' },
  { label: '🏆 Achievements', query: 'Show Achievements', route: '/achievements' },
  { label: '⚡ Skills', query: 'Show Skills', route: '/skills' },
  { label: '📄 Resume', query: 'View Resume', route: '/resume' },
  { label: '✉️ Contact Me', query: 'Contact Me', route: '/contact' },
  { label: '👤 About Me', query: 'About Me', route: '/about' },
  { label: '💼 Experience', query: 'My Experience', route: '/about' },
  { label: '🎓 Education', query: 'My Education', route: '/about' },
  { label: '🐙 Open GitHub', query: 'Open GitHub', external: 'https://github.com/lokendrakkumar01' },
  { label: '💼 Open LinkedIn', query: 'Open LinkedIn', external: 'https://linkedin.com' },
];

export default function AIChatWidget() {
  const navigate = useNavigate();
  const { data: socialData } = useSocialLinks();
  const socialLinks = socialData?.data ?? [];
  const githubLink = socialLinks.find(s => s.platform === 'github')?.url || 'https://github.com/lokendrakkumar01';
  const linkedinLink = socialLinks.find(s => s.platform === 'linkedin')?.url || 'https://linkedin.com';

  const [isOpen, setIsOpen] = useState(false);
  const [bodyLocked, setBodyLocked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: "Hi! 👋 I'm Lokendra Kumar's Portfolio Voice & Chat Assistant. Ask me anything or say 'show projects', 'view certificates', 'contact me', etc.!",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setBodyLocked(document.body.style.overflow === 'hidden');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Text-To-Speech (TTS)
  const speakText = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported in this browser');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\/\#\*\_\`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Process & execute navigation intent
  const handleNavigationIntent = (query: string): boolean => {
    const q = query.toLowerCase().trim();

    if (q.includes('github') || q.includes('git hub')) {
      window.open(githubLink, '_blank');
      toast.success('Opening GitHub profile');
      return true;
    }
    if (q.includes('linkedin') || q.includes('linked in')) {
      window.open(linkedinLink, '_blank');
      toast.success('Opening LinkedIn profile');
      return true;
    }
    if (q.includes('project') || q.includes('work') || q.includes('app')) {
      navigate('/projects');
      toast.success('Navigated to Projects');
      return true;
    }
    if (q.includes('certificate') || q.includes('cert') || q.includes('credential')) {
      navigate('/certificates');
      toast.success('Navigated to Certificates');
      return true;
    }
    if (q.includes('achievement') || q.includes('award') || q.includes('honor')) {
      navigate('/achievements');
      toast.success('Navigated to Achievements');
      return true;
    }
    if (q.includes('skill') || q.includes('tech stack') || q.includes('technology')) {
      navigate('/skills');
      toast.success('Navigated to Skills');
      return true;
    }
    if (q.includes('resume') || q.includes('cv') || q.includes('bio-data')) {
      navigate('/resume');
      toast.success('Navigated to Resume');
      return true;
    }
    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('message')) {
      navigate('/contact');
      toast.success('Navigated to Contact');
      return true;
    }
    if (q.includes('about') || q.includes('who is') || q.includes('profile')) {
      navigate('/about');
      toast.success('Navigated to About page');
      return true;
    }
    if (q.includes('experience') || q.includes('job') || q.includes('internship')) {
      navigate('/about');
      toast.success('Navigated to Experience section');
      return true;
    }
    if (q.includes('education') || q.includes('degree') || q.includes('college')) {
      navigate('/about');
      toast.success('Navigated to Education section');
      return true;
    }
    if (q.includes('gallery') || q.includes('photo') || q.includes('image')) {
      navigate('/gallery');
      toast.success('Navigated to Gallery');
      return true;
    }
    if (q.includes('home') || q.includes('main page')) {
      navigate('/');
      toast.success('Navigated to Home');
      return true;
    }

    return false;
  };

  const sendMessage = async (text: string, fromVoice = false) => {
    if (!text.trim() || isLoading) return;
    const userText = text.trim();
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText, timestamp: new Date() };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Trigger immediate route navigation if intent detected
    handleNavigationIntent(userText);

    try {
      const history = messages.filter((m) => m.id !== '0').map((m) => ({ role: m.role, text: m.text }));
      const res = await assistantApi.chat(userText, history);
      const aiReply = res.data?.reply || "Lokendra Kumar is a Full-Stack Developer proficient in React, Node.js, and MongoDB. Explore his work on the portfolio!";
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: aiReply, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);

      if (fromVoice) {
        speakText(aiMsg.id, aiReply);
      }
    } catch {
      const fallbackReply = "Lokendra Kumar is a Full-Stack Software Engineer specializing in modern web applications. You can explore his Projects (/projects), Skills (/skills), Certificates (/certificates), or Contact him (/contact)!";
      const errMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: fallbackReply, timestamp: new Date() };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        toast('Listening... Speak into your microphone!', { icon: '🎙️' });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          sendMessage(transcript, true);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const err = event?.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          toast.error('Microphone permission denied. Please allow mic access in your browser.');
        } else if (err === 'no-speech') {
          toast('No speech detected. Try speaking again!', { icon: '🎙️' });
        } else {
          toast('Voice input paused. You can type or try again.', { icon: '💡' });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setIsListening(false);
      toast.error('Could not access microphone. Please type your message.');
    }
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: '0',
        role: 'assistant',
        text: "Hi! 👋 Chat history cleared. How can I help you explore Lokendra's portfolio?",
        timestamp: new Date(),
      },
    ]);
    toast.success('Chat history cleared');
  };

  if (bodyLocked && !isOpen) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl hover:shadow-primary/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Chat with AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(540px, calc(100vh - 140px))' }}
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-border/80 px-4 py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-text text-sm truncate">Lokendra's AI Assistant</h3>
                  <p className="text-[11px] text-muted font-medium truncate">Full-Stack Portfolio Voice & Chat</p>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-xl hover:bg-card text-muted hover:text-error transition-colors"
                  title="Clear chat history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-card text-muted hover:text-text transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 py-2 bg-surface/50 border-b border-border/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => {
                    if (a.route) {
                      navigate(a.route);
                      toast.success(`Navigated to ${a.label}`);
                    } else if (a.external) {
                      window.open(a.external, '_blank');
                    }
                    sendMessage(a.query);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-card border border-border/70 text-muted hover:text-primary hover:border-primary/50 whitespace-nowrap transition-all flex-shrink-0 active:scale-95"
                >
                  {a.label}
                </button>
              ))}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5" style={{ minHeight: 160 }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className="relative group max-w-[82%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-xs font-medium shadow-md shadow-primary/20'
                          : 'bg-card border border-border text-text rounded-bl-xs shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Text-to-speech button for AI messages */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => speakText(msg.id, msg.text)}
                        className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-muted hover:text-primary transition-colors"
                        title="Read out loud"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3 text-primary animate-pulse" />
                            <span className="text-primary font-bold">Stop Speaking</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
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
                  <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-xs text-muted font-medium">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-3 bg-card/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoice}
                  className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                    isListening
                      ? 'bg-error text-white animate-pulse shadow-md shadow-error/30'
                      : 'bg-surface border border-border text-muted hover:text-primary hover:border-primary/50'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input (Speak)'}
                  aria-label="Voice Input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder={isListening ? 'Listening... Speak now!' : 'Ask or say "show projects"...'}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 text-sm bg-surface border border-border/80 rounded-xl text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner disabled:opacity-50"
                />

                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-30 transition-all flex-shrink-0 active:scale-95 shadow-md shadow-primary/20"
                  aria-label="Send message"
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
