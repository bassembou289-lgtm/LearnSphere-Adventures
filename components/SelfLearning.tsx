import React, { useState, useEffect, useRef } from 'react';
import { generateSelfLearningLesson, continueChat } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';
import { TOPICS } from '../constants';
import { ChatMessage, User } from '../types';

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
        const lessonContent = await generateSelfLearningLesson(topic, language, user.rank, user.level);
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

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="mb-6 bg-white px-4 py-2 rounded-lg shadow font-semibold text-gray-700 hover:bg-gray-100 transition" dangerouslySetInnerHTML={{ __html: t('common.backToDashboard') }}/>
        <h1 className="text-4xl font-black text-gray-800 mb-2">{t('self.title')}</h1>
        <h2 className="text-2xl font-bold text-purple-600 mb-6">{displayTopic}</h2>
        
        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-500 text-center bg-red-100 p-4 rounded-lg">{error}</p>}
            {lesson && (
                <div className="prose max-w-none animate-fade-in-up whitespace-pre-wrap" dir={dir}>
                    {lesson}
                </div>
            )}
        </div>

        {lesson && !isLoading && (
            <div className="mt-8 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">{t('self.chatTitle')} 🤖</h3>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl h-[60vh] flex flex-col">
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 p-4">
                        {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap ${
                            msg.author === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'
                            }`}>
                            {msg.content}
                            </div>
                        </div>
                        ))}
                        {isChatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-lg px-4 py-2">
                            <span className="animate-pulse">● ● ●</span>
                            </div>
                        </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center gap-2 sm:gap-4">
                        <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={t('self.chatPlaceholder')}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        disabled={isChatLoading}
                        />
                        <button type="submit" disabled={isChatLoading || !userInput.trim()} className="bg-purple-500 text-white rounded-full p-3 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default SelfLearning;