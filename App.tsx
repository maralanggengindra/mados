import React, { useState, createContext, useMemo } from 'react';
import { AuthView } from './components/AuthView';
import { MainView } from './components/MainView';
import { User, Store, CommunityPost, ChatSession, Notification, PublicService, Item, ChatMessage, Review, CommunityPostComment, DataContextType } from './types';
import { MOCK_USERS, MOCK_STORES, MOCK_COMMUNITY_POSTS, MOCK_CHATS, MOCK_NOTIFICATIONS } from './constants';
import { Toast } from './components/common/Toast';

// FIX: Added mock data for public services to be used in DataContext
const MOCK_PUBLIC_SERVICES: PublicService[] = [
    { id: 'ps-1', ownerId: 'system', name: 'Puskesmas Kecamatan', type: 'Puskesmas', coordinates: { latitude: -6.21, longitude: 106.84 }, address: 'Jl. Kesehatan No. 1, Jakarta', reviews: [] },
    { id: 'ps-2', ownerId: 'system', name: 'Kantor Polisi Sektor', type: 'Kantor Pemerintahan', coordinates: { latitude: -7.26, longitude: 112.75 }, address: 'Jl. Aman No. 1, Surabaya', reviews: [] },
];

type ToastMessage = { message: string; type: 'success' | 'error' };

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({ user: null, setUser: () => {} });
export const DataContext = createContext<DataContextType>({} as DataContextType);


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [stores, setStores] = useState<Store[]>(MOCK_STORES);
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
    const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
    const [publicServices, setPublicServices] = useState<PublicService[]>(MOCK_PUBLIC_SERVICES);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        showToast(`Selamat datang kembali, ${loggedInUser.name}!`);
    };

    const handleSignUp = (userInfo: { name: string; email: string }) => {
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: userInfo.name,
            email: userInfo.email,
            interests: [],
            sellerStatus: 'none',
            followers: [],
            following: [],
            lastActive: new Date(),
        };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
        showToast('Pendaftaran berhasil! Silakan lengkapi profil Anda.');
    };

    const dataContextValue = useMemo((): DataContextType => ({
        users, stores, communityPosts, chats, notifications, publicServices,
        updateUserProfile: (updatedUser: User) => {
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            if (user?.id === updatedUser.id) {
                setUser(updatedUser);
            }
            showToast('Profil berhasil diperbarui.');
        },
        updateUserInterests: (interests: string[]) => {
            if (user) {
                const updatedUser = { ...user, interests };
                setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
                setUser(updatedUser);
            }
        },
        addStore: (store: Store) => {
            setStores(prev => [...prev, store]);
        },
        addItemToStore: (storeId: string, item: Item) => {
            setStores(prev => prev.map(s => s.id === storeId ? { ...s, items: [...s.items, item] } : s));
            showToast(`"${item.name}" berhasil ditambahkan ke toko.`);
        },
        addCommunityPost: (postData) => {
            if (!user) return;
            const newPost: CommunityPost = {
                ...postData,
                id: `cp-${Date.now()}`,
                userId: user.id,
                userName: user.name,
                timestamp: new Date(),
                likes: [],
                comments: [],
            };
            setCommunityPosts(prev => [newPost, ...prev]);
        },
        toggleCommunityPostLike: (postId: string) => {
            if (!user) return;
            setCommunityPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    const isLiked = p.likes.includes(user.id);
                    const newLikes = isLiked ? p.likes.filter(id => id !== user.id) : [...p.likes, user.id];
                    return { ...p, likes: newLikes };
                }
                return p;
            }));
        },
        addCommentToCommunityPost: (postId: string, text: string, imageUrl?: string) => {
            if (!user) return;
            const newComment: CommunityPostComment = {
                id: `cmt-${Date.now()}`,
                userId: user.id,
                userName: user.name,
                text,
                imageUrl,
                timestamp: new Date(),
                replies: [],
            };
            setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
        },
        addReplyToComment: (postId, parentCommentId, replyText, replyingTo, imageUrl) => {
            if (!user) return;

            const newReply: CommunityPostComment = {
                id: `cmt-${Date.now()}`,
                userId: user.id,
                userName: user.name,
                text: replyText,
                timestamp: new Date(),
                replyingTo: replyingTo,
                imageUrl: imageUrl,
                replies: [],
            };

            const addReplyRecursively = (comments: CommunityPostComment[], parentId: string, reply: CommunityPostComment): CommunityPostComment[] => {
                return comments.map(comment => {
                    if (comment.id === parentId) {
                        return { ...comment, replies: [...(comment.replies || []), reply] };
                    }
                    if (comment.replies && comment.replies.length > 0) {
                        return { ...comment, replies: addReplyRecursively(comment.replies, parentId, reply) };
                    }
                    return comment;
                });
            };

            setCommunityPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === postId) {
                        const updatedComments = addReplyRecursively(post.comments, parentCommentId, newReply);
                        return { ...post, comments: updatedComments };
                    }
                    return post;
                })
            );
        },
        toggleFollow: (targetUserId: string) => {
            if (!user) return;
            const currentUserId = user.id;
            // Update current user's following list
            const isFollowing = user.following.includes(targetUserId);
            const updatedCurrentUser = {
                ...user,
                following: isFollowing ? user.following.filter(id => id !== targetUserId) : [...user.following, targetUserId]
            };
            setUser(updatedCurrentUser);

            // Update both users in the main users list
            setUsers(prevUsers => prevUsers.map(u => {
                if (u.id === currentUserId) return updatedCurrentUser;
                if (u.id === targetUserId) {
                    return {
                        ...u,
                        followers: isFollowing ? u.followers.filter(id => id !== currentUserId) : [...u.followers, currentUserId]
                    };
                }
                return u;
            }));
        },
        sendMessage: (partnerId, text, productContext) => {
            if (!user) return;
            const newMessage: ChatMessage = {
                id: `msg-${Date.now()}`,
                senderId: user.id,
                text,
                timestamp: new Date(),
                status: 'sent', // Simulate 'sent' status
                productContext,
            };
            setChats(prev => {
                const existingChatIndex = prev.findIndex(c => c.participantIds.includes(user.id) && c.participantIds.includes(partnerId));
                if (existingChatIndex > -1) {
                    const updatedChats = [...prev];
                    updatedChats[existingChatIndex].messages.push(newMessage);
                    return updatedChats;
                } else {
                    const newChat: ChatSession = {
                        id: `chat-${Date.now()}`,
                        participantIds: [user.id, partnerId],
                        messages: [newMessage],
                    };
                    return [...prev, newChat];
                }
            });
        },
        markMessagesAsRead: (partnerId) => {
             if (!user) return;
             setChats(prev => prev.map(chat => {
                if(chat.participantIds.includes(user.id) && chat.participantIds.includes(partnerId)) {
                    return {
                        ...chat,
                        messages: chat.messages.map(msg => msg.senderId === partnerId ? { ...msg, status: 'read' } : msg)
                    }
                }
                return chat;
             }));
        },
        markNotificationsAsRead: () => {
             setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        },
        addReviewToStore: (storeId: string, review: Review) => {
            setStores(prev => prev.map(s => s.id === storeId ? { ...s, reviews: [review, ...s.reviews] } : s));
            showToast('Ulasan Anda telah ditambahkan.');
        },
        addReviewToItem: (storeId: string, itemId: string, review: Review) => {
             setStores(prev => prev.map(s => {
                if (s.id === storeId) {
                    return { ...s, items: s.items.map(i => i.id === itemId ? { ...i, reviews: [review, ...i.reviews] } : i) };
                }
                return s;
             }));
             showToast('Ulasan produk Anda telah ditambahkan.');
        },
        addPublicService: (service: PublicService) => {
            setPublicServices(prev => [...prev, service]);
        },
        addReviewToPublicService: (serviceId: string, review: Review) => {
            setPublicServices(prev => prev.map(s => s.id === serviceId ? { ...s, reviews: [review, ...s.reviews] } : s));
            showToast('Ulasan Anda untuk layanan publik telah ditambahkan.');
        },
        deleteItemFromStore: (storeId, itemId) => {
            setStores(prev => prev.map(s => {
                if (s.id === storeId) {
                    return { ...s, items: s.items.filter(i => i.id !== itemId) };
                }
                return s;
            }));
            showToast('Produk berhasil dihapus.');
        },
        updateItemInStore: (storeId, updatedItem) => {
            setStores(prev => prev.map(s => {
                if (s.id === storeId) {
                    return { ...s, items: s.items.map(i => i.id === updatedItem.id ? updatedItem : i) };
                }
                return s;
            }));
            showToast('Produk berhasil diperbarui.');
        }
    }), [users, stores, communityPosts, chats, notifications, publicServices, user]);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            <DataContext.Provider value={dataContextValue}>
                <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans h-screen overflow-hidden relative">
                   {user ? <MainView /> : <AuthView onLogin={handleLogin} onSignUp={handleSignUp} />}
                   <Toast toast={toast} onClose={() => setToast(null)} />
                </div>
            </DataContext.Provider>
        </UserContext.Provider>
    );
}

export default App;