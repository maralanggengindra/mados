import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { DataContext, UserContext } from '../../App';
import { View, ChatMessage, Item, CommunityPost } from '../../types';

interface ChatViewProps {
    partnerId: string;
    setView: (view: View) => void;
    chatContext?: {
        prefilledMessage?: string;
        productContext?: Item | CommunityPost;
    }
}

const formatLastActive = (lastActive: Date): string => {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - lastActive.getTime()) / 1000);

    if (diffSeconds < 60) return "Online";
    if (diffSeconds < 3600) return `Aktif ${Math.floor(diffSeconds / 60)} menit lalu`;
    if (diffSeconds < 86400) return `Aktif ${Math.floor(diffSeconds / 3600)} jam lalu`;
    if (diffSeconds < 86400 * 2) return "Aktif kemarin";
    return `Aktif pada ${lastActive.toLocaleDateString('id-ID')}`;
};

const MessageStatusIcon: React.FC<{ status: ChatMessage['status'] }> = ({ status }) => {
    const SentIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
    const DeliveredIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M5 13l4 4L19 7" transform="translate(-5, 0)" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
    const ReadIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M5 13l4 4L19 7" transform="translate(-5, 0)" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    switch(status) {
        case 'sent': return <SentIcon />;
        case 'delivered': return <DeliveredIcon />;
        case 'read': return <ReadIcon />;
        default: return null;
    }
};

const ProductContextCard: React.FC<{
    product: Item | CommunityPost;
    messageText: string;
    isMyMessage: boolean;
    setView: (view: View) => void;
}> = ({ product, messageText, isMyMessage, setView }) => {
    
    const isItem = 'storeId' in product; // Type guard to differentiate Item from CommunityPost
    const name = isItem ? (product as Item).name : (product as CommunityPost).title;

    const handleCardClick = () => {
        if (isItem) {
            setView({ page: 'item-detail', detailId: product.id });
        } else {
            // There's no detail page for a community post, so navigate to the author's profile
            setView({ page: 'profile', detailId: (product as CommunityPost).userId });
        }
    };

    return (
        <div className={`max-w-xs md:max-w-xs rounded-2xl shadow-md overflow-hidden ${isMyMessage ? 'bg-teal-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 rounded-bl-none'}`}>
            <button 
                onClick={handleCardClick}
                className="w-full text-left"
            >
                <div className={`p-2 ${isMyMessage ? '' : 'text-gray-800 dark:text-gray-200'}`}>
                    <div className="flex items-start space-x-2">
                        <img src={product.imageUrl} alt={name} className="w-12 h-12 object-cover rounded-md flex-shrink-0 bg-gray-300" />
                        <div className="flex-grow">
                             <p className="font-semibold text-sm leading-tight">{name}</p>
                             <p className="text-xs opacity-90">{`Rp ${product.price.toLocaleString('id-ID')}`}</p>
                        </div>
                    </div>
                </div>
                <div className={`px-3 pb-3 pt-2 ${isMyMessage ? 'bg-teal-600' : 'bg-gray-50 dark:bg-gray-600'}`}>
                     <p className={`whitespace-pre-wrap break-words text-sm ${isMyMessage ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>{messageText}</p>
                </div>
            </button>
        </div>
    );
}

export const ChatView: React.FC<ChatViewProps> = ({ partnerId, setView, chatContext }) => {
    const { chats, users, sendMessage, toggleFollow, markMessagesAsRead } = useContext(DataContext);
    const { user: currentUser } = useContext(UserContext);
    const [newMessage, setNewMessage] = useState(chatContext?.prefilledMessage || '');
    const [productContext, setProductContext] = useState<Item | CommunityPost | undefined>(chatContext?.productContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const partner = useMemo(() => users.find(u => u.id === partnerId), [users, partnerId]);
    
    const chatSession = useMemo(() => {
        if (!currentUser) return null;
        return chats.find(c => c.participantIds.includes(currentUser.id) && c.participantIds.includes(partnerId));
    }, [chats, currentUser, partnerId]);

    useEffect(() => {
        // Mark messages from partner as read when opening the chat
        markMessagesAsRead(partnerId);
    }, [partnerId, chatSession?.messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [newMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [chatSession?.messages.length]);

    if (!currentUser || !partner) {
        return (
            <div>
                <button onClick={() => setView({ page: 'chats' })} className="p-4 text-teal-500 font-semibold">&larr; Kembali</button>
                <p className="text-center">Pengguna tidak ditemukan.</p>
            </div>
        );
    }

    const isFollowing = currentUser.following.includes(partnerId);
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(partnerId, newMessage, productContext);
            setNewMessage('');
            setProductContext(undefined); // Clear context after sending
             if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleDismissProductContext = () => {
        setProductContext(undefined);
        // If the message is the default one, clear it as well
        if (newMessage === chatContext?.prefilledMessage) {
            setNewMessage('');
        }
    };
    
    const isSendDisabled = newMessage.trim() === '';
    
    const contextProductName = productContext ? ('storeId' in productContext ? productContext.name : productContext.title) : '';

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={() => setView({ page: 'chats' })} className="text-teal-500 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => setView({ page: 'profile', detailId: partnerId })}
                        className="flex items-center text-left"
                    >
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 mr-3 flex-shrink-0">
                            {partner.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg hover:underline">{partner.name}</h2>
                            <p className="text-xs text-gray-500">{formatLastActive(partner.lastActive)}</p>
                        </div>
                    </button>
                </div>
                <button
                    onClick={() => toggleFollow(partnerId)}
                    className={`font-semibold py-1 px-4 rounded-full text-sm transition-colors flex-shrink-0 ml-2 ${
                        isFollowing 
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    }`}
                >
                    {isFollowing ? 'Mengikuti' : 'Ikuti'}
                </button>
            </header>
            <main className="flex-grow overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
                <div className="space-y-4">
                    {chatSession?.messages.map(message => {
                        const isMyMessage = message.senderId === currentUser.id;
                        if (message.productContext) {
                            return (
                                <div key={message.id} className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                                    <ProductContextCard 
                                        product={message.productContext}
                                        messageText={message.text}
                                        isMyMessage={isMyMessage}
                                        setView={setView}
                                    />
                                    {isMyMessage && (
                                        <div className="flex items-center space-x-1 mt-1">
                                            <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                                            <MessageStatusIcon status={message.status} />
                                        </div>
                                    )}
                                </div>
                            )
                        }
                        return (
                            <div key={message.id} className={`flex flex-col ${message.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                                    message.senderId === currentUser.id
                                    ? 'bg-teal-500 text-white rounded-br-none'
                                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                }`}>
                                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                                </div>
                                {message.senderId === currentUser.id && (
                                    <div className="flex items-center space-x-1 mt-1">
                                        <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                                        <MessageStatusIcon status={message.status} />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                {productContext && (
                    <div className="relative flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mb-2">
                        <img src={productContext.imageUrl} alt={contextProductName} className="w-12 h-12 object-cover rounded-md mr-3 flex-shrink-0" />
                        <div className="flex-grow overflow-hidden">
                            <p className="font-semibold text-sm truncate">{contextProductName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rp {productContext.price.toLocaleString('id-ID')}</p>
                        </div>
                        <button 
                            onClick={handleDismissProductContext} 
                            className="absolute top-1 right-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1"
                            aria-label="Tutup konteks produk"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="w-full p-3 border border-gray-300 rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-teal-500 focus:border-teal-500 resize-none overflow-y-auto max-h-28"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isSendDisabled}
                        className="bg-teal-500 text-white rounded-full p-3 hover:bg-teal-600 transition-colors flex-shrink-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};