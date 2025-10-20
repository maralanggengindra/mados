import React, { useContext, useState } from 'react';
import { DataContext } from '../App';
import { View } from '../types';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

interface TopNavProps {
    setView: (view: View) => void;
    view: View;
}


export const TopNav: React.FC<TopNavProps> = ({ setView, view }) => {
    const { notifications } = useContext(DataContext);
    const hasUnread = notifications.some(n => !n.read);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setView({ page: 'search', searchQuery });
            setSearchQuery('');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50 flex items-center px-4 py-3">
            <div className="w-full flex justify-between items-center">
                {view.page === 'home' ? (
                    <form onSubmit={handleSearchSubmit} className="flex-grow">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari di Mados..."
                                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    </form>
                ) : (
                    <h1 className="text-2xl font-bold text-teal-500">Mados</h1>
                )}

                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <button 
                        onClick={() => setView({ page: 'chats' })} 
                        className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Direct Messages"
                    >
                        <ChatIcon />
                    </button>
                    <button 
                        onClick={() => setView({ page: 'notifications' })} 
                        className="relative text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Notifications"
                    >
                        <NotificationIcon />
                        {hasUnread && (
                            <span className="absolute top-1.5 right-1.5 block w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};