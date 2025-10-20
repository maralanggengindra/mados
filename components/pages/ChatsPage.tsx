import React, { useContext, useMemo } from 'react';
import { DataContext, UserContext } from '../../App';
import { View, ChatSession } from '../../types';

interface ChatsPageProps {
    setView: (view: View) => void;
}

export const ChatsPage: React.FC<ChatsPageProps> = ({ setView }) => {
    const { chats, users } = useContext(DataContext);
    const { user: currentUser } = useContext(UserContext);

    const myChats = useMemo(() => {
        if (!currentUser) return [];
        return chats
            .filter(chat => chat.participantIds.includes(currentUser.id))
            .map(chat => {
                const lastMessage = chat.messages[chat.messages.length - 1];
                const partnerId = chat.participantIds.find(id => id !== currentUser.id);
                const partner = users.find(u => u.id === partnerId);
                return {
                    ...chat,
                    lastMessage,
                    partner,
                };
            })
            .sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime());
    }, [chats, users, currentUser]);

    if (!currentUser) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b dark:border-gray-700">
                <h1 className="text-2xl font-bold">Pesan Langsung</h1>
            </div>
            <div className="flex-grow overflow-y-auto">
                {myChats.length > 0 ? (
                    myChats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setView({ page: 'chats', chatPartnerId: chat.partner?.id })}
                            className="flex items-center p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 mr-4 flex-shrink-0">
                                {chat.partner?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-grow truncate">
                                <div className="flex justify-between">
                                    <p className="font-bold">{chat.partner?.name}</p>
                                    <p className="text-xs text-gray-500">{chat.lastMessage.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-10 text-gray-500">
                        <p>Belum ada percakapan.</p>
                        <p className="text-sm">Mulai chat dengan pemilik toko atau pengguna lain.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
