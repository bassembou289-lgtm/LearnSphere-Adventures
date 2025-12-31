import React, { useState, useEffect, useRef } from 'react';
import { generateSelfLearningLesson, continueChat } from '../services/aiService';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';
import { TOPICS } from '../constants';
import { ChatMessage, User } from '../types';
import ReactMarkdown, { Components } from 'react-markdown';

interface SelfLearningProps {
  topic: string;
  user: User;
  onBack: () => void;
}

const SelfLearning: React.FC<SelfLearningProps> = ({ topic, user, onBack }) => {
  const [lesson, setLesson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { t, language, dir } = useTranslation();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const topicInfo = TOPICS.find(t => t.id === topic);
  const displayTopic = topicInfo ? `${t(topicInfo.labelKey)} ${topicInfo.emoji}` : topic;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let lessonContent = await generateSelfLearningLesson(topic, language, user.rank, user.level);
        
        // CLEANING LOGIC: Remove wrapping markdown code fences if present
        if (lessonContent.trim().startsWith('```')) {
          lessonContent = lessonContent
            .replace(/^```(?:markdown)?\s*/i, '') // Remove start fence
            .replace(/```\s*$/, '');               // Remove end fence
        }

        setLesson(lessonContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('assisted.error'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [topic, language, t, user.rank, user.level]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isChatLoading || !lesson) return;

    const userMessage: ChatMessage = { author: 'user', content: userInput };
    const updatedMessages: ChatMessage[] = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setUserInput('');
    setIsChatLoading(true);

    try {
        const reply = await continueChat(lesson, updatedMessages, language);
        const botMessage: ChatMessage = { author: 'bot', content: reply };
        setMessages(prev => [...prev, botMessage]);
    } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = { author: 'bot', content: error instanceof Error ? error.message : "Sorry, I'm having trouble connecting. Please try again in a moment." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const MarkdownComponents: Components = {
    h1: ({node, ...props}) => (
      <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mt-8 mb-6 pb-2 border-b-2 border-purple-100" {...props} />
    ),
    h2: ({node, ...props}) => (
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2" {...props} />
    ),
    h3: ({node, ...props}) => (
      <h3 className="text-xl font-bold text-purple-700 mt-6 mb-3" {...props} />
    ),
    p: ({node, ...props}) => (
      <p className="text-gray-700 text-lg leading-relaxed mb-6" {...props} />
    ),
    ul: ({node, ...props}) => (
      <ul className="space-y-3 mb-6 ml-4 list-disc marker:text-purple-500" {...props} />
    ),
    ol: ({node, ...props}) => (
      <ol className="list-decimal space-y-3 mb-6 ml-6 text-gray-700 text-lg font-medium marker:text-blue-500" {...props} />
    ),
    li: ({node, ...props}) => (
      <li className="text-gray-700 text-lg leading-relaxed pl-2" {...props}>
        {props.children}
      </li>
    ),
    strong: ({node, ...props}) => (
      <strong className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500" {...props} />
    ),
    em: ({node, ...props}) => (
      <em className="italic text-blue-600 font-medium" {...props} />
    ),
    blockquote: ({node, ...props}) => (
      <blockquote className="border-l-4 border-yellow-400 bg-yellow-50 rounded-r-xl p-4 my-6 italic text-gray-700 shadow-sm" {...props} />
    ),
    table: ({node, ...props}) => (
      <div className="overflow-x-auto my-6 rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200" {...props} />
      </div>
    ),
    thead: ({node, ...props}) => (
      <thead className="bg-gray-50" {...props} />
    ),
    th: ({node, ...props}) => (
      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider" {...props} />
    ),
    td: ({node, ...props}) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-white border-t border-gray-100" {...props} />
    ),
    code: ({node, className, children, ...props}: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const isInline = !match && !String(children).includes('\n');
      return isInline ? (
        <code className="bg-purple-100 text-purple-700 rounded px-2 py-1 text-sm font-mono font-bold" {...props}>
          {children}
        </code>
      ) : (
        <div className="bg-gray-900 rounded-xl p-4 my-6 shadow-lg overflow-x-auto">
          <code className="text-gray-100 font-mono text-sm leading-relaxed block" {...props}>
            {children}
          </code>
        </div>
      )
    },
    a: ({node, ...props}) => (
      <a className="text-blue-500 hover:text-blue-700 underline font-semibold transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    hr: ({node, ...props}) => (
      <hr className="my-8 border-t-2 border-gray-100" {...props} />
    )
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="mb-6 bg-white px-6 py-3 rounded-xl shadow-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:shadow-xl flex items-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('common.backToDashboard')}
        </button>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
            {t('self.title')}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white bg-purple-500 py-3 px-8 rounded-full shadow-lg inline-block transform -rotate-1">
            {displayTopic}
          </h2>
        </div>
        
        <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] shadow-2xl border border-white/50 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

          {isLoading && (
            <div className="text-center py-20 relative z-10">
              <LoadingSpinner />
              <p className="text-gray-600 mt-6 text-xl font-medium animate-pulse">{t('self.generatingLesson')}</p>
              <p className="text-gray-400 text-sm mt-2">Consulting the archives...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center bg-red-50 border-2 border-red-100 rounded-2xl p-8 relative z-10">
              <div className="text-5xl mb-4">🙈</div>
              <p className="text-red-600 text-xl font-bold mb-2">{t('common.error')}</p>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-lg hover:shadow-red-200"
              >
                {t('common.retry')}
              </button>
            </div>
          )}
          
          {lesson && (
            <div className="animate-fade-in-up relative z-10" dir={dir}>
              <ReactMarkdown components={MarkdownComponents}>
                {lesson}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {lesson && !isLoading && (
          <div className="mt-12 animate-fade-in-up">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-gray-800 mb-2">
                {t('self.chatTitle')} 
              </h3>
              <p className="text-gray-500 font-medium">{t('self.chatDescription')}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/40 h-[65vh] flex flex-col overflow-hidden">
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-6 sm:p-8 scroll-smooth">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8 opacity-60">
                    <div className="text-7xl mb-6">🤖</div>
                    <p className="text-2xl font-bold text-gray-600">{t('self.chatWelcome')}</p>
                    <p className="text-lg mt-2">{t('self.chatInstructions')}</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.author === 'bot' && (
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0 mb-1">
                          AI
                        </div>
                      )}
                      <div className={`max-w-[85%] sm:max-w-[75%] px-6 py-4 rounded-3xl shadow-sm whitespace-pre-wrap text-lg leading-relaxed ${
                        msg.author === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                      }`}>
                        {msg.content}
                      </div>
                      {msg.author === 'user' && (
                        <div className="w-10 h-10 bg-gradient-to-tr from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0 mb-1">
                          YOU
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {isChatLoading && (
                  <div className="flex justify-start items-end gap-3">
                     <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0 mb-1">
                        AI
                     </div>
                    <div className="bg-white text-gray-800 rounded-3xl rounded-bl-none px-6 py-4 border border-gray-100 shadow-sm">
                      <div className="flex space-x-2 items-center h-6">
                        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={t('self.chatPlaceholder')}
                    className="w-full pl-6 pr-14 py-4 bg-gray-50 border-2 border-gray-200 rounded-full focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 text-gray-700 text-lg shadow-inner"
                    disabled={isChatLoading}
                  />
                  <button 
                    type="submit" 
                    disabled={isChatLoading || !userInput.trim()} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-3 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfLearning;