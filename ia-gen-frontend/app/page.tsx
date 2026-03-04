'use client';

import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { Send, Bot, User, Sparkles, Copy, Check } from 'lucide-react';
import { useEffect, useRef, useState, ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-slate-200 text-slate-800 px-2 py-1 rounded font-mono text-sm">
        {children}
      </code>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 rounded-lg overflow-hidden my-3 border border-slate-700">
      <div className="flex justify-between items-center bg-slate-800 px-4 py-2 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">{language}</span>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-slate-700 transition-colors"
          title="Copiar código"
        >
          {copied ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-slate-400" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm leading-relaxed">{code}</code>
      </pre>
    </div>
  );
};

const getMessageText = (message: any): string => {
  if (typeof message.content === 'string') {
    return message.content;
  }
  if (Array.isArray(message.content)) {
    return message.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('');
  }
  
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('');
  }
  
  return '';
};

export default function ChatWindow() {
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    if (input.trim()) {
      sendMessage({
        role: 'user',
        content: [{ type: 'text', text: input.trim() }],
      } as any);
      setInput('');
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);



  return (
    <main className="flex flex-col h-screen bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden h-[80vh]">
        
        <div className="p-4 border-b bg-white flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">GenAI Assistant</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online | Llama 3.2
            </p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Sparkles size={40} className="opacity-20" />
              <p>¿En qué puedo ayudarte hoy?</p>
            </div>
          )}
          
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`mt-1 p-1.5 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  {m.role === 'user' ? (
                    getMessageText(m)
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:m-0 prose-p:my-1 prose-headings:my-2 prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 prose-a:underline prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1 prose-strong:font-bold prose-em:italic">
                      <ReactMarkdown
                        components={{
                          code: CodeBlock,
                        }}
                      >
                        {getMessageText(m)}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-3 rounded-2xl animate-pulse text-slate-400 text-xs">
                Escribiendo...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t bg-slate-50">
          <div className="relative flex items-center">
            <input
              className="w-full p-3 pr-12 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
              value={input}
              placeholder={isLoading ? 'Esperando respuesta...' : 'Escribe tu mensaje aquí...'}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2 italic">
            Potenciado por Ollama & FastAPI
          </p>
        </form>
      </div>
    </main>
  );
}