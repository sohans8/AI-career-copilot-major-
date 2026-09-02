import React, { useState } from 'react';
import { MessageSquareText, Send, Sparkles, Bot, User } from 'lucide-react';

export default function CareerAssistantView() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Career Copilot Assistant. Ask me anything about streams, subject combinations, or future career opportunities after Class 10!'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      let reply = "Based on your Career Copilot profile, Science (PCM) and Commerce with Mathematics offer strong quantitative and technology pathways after Class 10.";
      if (userMsg.toLowerCase().includes('pcm') || userMsg.toLowerCase().includes('science')) {
        reply = "Science PCM requires Mathematics, Physics, and Chemistry. It opens doors to Software Engineering, Data Science, Aerospace, Robotics, and Civil Engineering!";
      } else if (userMsg.toLowerCase().includes('commerce') || userMsg.toLowerCase().includes('ca')) {
        reply = "Commerce with Math prepares you for Chartered Accountancy, Financial Analysis, Investment Banking, Actuarial Science, and Data Analytics!";
      } else if (userMsg.toLowerCase().includes('biology') || userMsg.toLowerCase().includes('pcb')) {
        reply = "Science PCB focuses on Biology, Chemistry, and Physics. It leads to MBBS Medicine, Dentistry, Biotechnology, Clinical Psychology, and Pharmacy!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          💬 AI Career Assistant
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ask questions about streams, subjects, and future career opportunities.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none font-medium'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about streams, PCM, PCB, CA, Engineering..."
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
