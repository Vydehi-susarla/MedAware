import React, { useState, useRef, useEffect } from 'react';
import { api } from '../utils/api';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your MedAware disposal assistant. Ask me questions like:\n• \"How to dispose expired tablets?\"\n• \"Can I use expired syrup?\"\n• \"What is the flush list?\"\n\nHow can I help you safely handle medicines today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickChips = [
    "Dispose tablets?",
    "Can I use expired syrup?",
    "What is the flush list?",
    "Where is take-back?"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    setLoading(true);

    try {
      const data = await api.askChatbot(text);
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = { id: Date.now() + 1, sender: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="chatbot-toggle"
        title="Disposal Assistant Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Floating Chat Container */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Disposal Assistant</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>MedAware Safety Helper</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-bubble ${msg.sender === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span className="dot" style={{ animation: 'bounce 1.4s infinite both' }}>•</span>
                <span className="dot" style={{ animation: 'bounce 1.4s infinite both', animationDelay: '0.2s' }}>•</span>
                <span className="dot" style={{ animation: 'bounce 1.4s infinite both', animationDelay: '0.4s' }}>•</span>
                <style>{`
                  @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                  }
                `}</style>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply chips */}
          <div className="chatbot-chips">
            {quickChips.map((chip, idx) => (
              <button 
                key={idx} 
                className="chip"
                onClick={() => handleSendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
            className="chatbot-input-area"
          >
            <input
              type="text"
              placeholder="Ask about medicine disposal..."
              className="chatbot-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="chatbot-send">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
