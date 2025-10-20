import React, { useContext } from 'react';
import { DataContext, UserContext } from '../../App';
import { View, User } from '../../types';

interface FollowListPageProps {
    userId: string;
    listType: 'followers' | 'following';
    setView: (view: View) => void;
}

const UserRow: React.FC<{ user: User, currentUserId: string, isFollowing: boolean, onToggleFollow: (id: string) => void, setView: (view: View) => void }> = 
({ user, currentUserId, isFollowing, onToggleFollow, setView }) => {
    
    const handleUserClick = () => {
        if (user.id === currentUserId) {
            setView({ page: 'profile' });
        } else {
            setView({ page: 'profile', detailId: user.id });
        }
    };

    return (
        <div className="flex items-center p-3">
            <button onClick={handleUserClick} className="flex items-center flex-grow text-left">
                <img 
                    src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D9488&color=fff&size=64`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
            </button>
            {user.id !== currentUserId && (
                <button
                    onClick={() => onToggleFollow(user.id)}
                    className={`font-semibold py-1 px-4 rounded-full text-sm transition-colors flex-shrink-0 ml-2 ${
                        isFollowing 
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    }`}
                >
                    {isFollowing ? 'Mengikuti' : 'Ikuti'}
                </button>
            )}
        </div>
    );
};

export const FollowListPage: React.FC<FollowListPageProps> = ({ userId, listType, setView }) => {
    const { users, toggleFollow } = useContext(DataContext);
    const { user: currentUser } = useContext(UserContext);

    const userInView = users.find(u => u.id === userId);

    if (!currentUser || !userInView) {
        return <p className="p-4 text-center">Pengguna tidak ditemukan.</p>;
    }

    const listIds = listType === 'followers' ? userInView.followers : userInView.following;
    const userList = listIds.map(id => users.find(u => u.id === id)).filter((u): u is User => !!u);
    
    const pageTitle = listType === 'followers' ? `Pengikut ${userInView.name}` : `Mengikuti ${userInView.name}`;

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b dark:border-gray-700 flex items-center bg-white dark:bg-gray-800 sticky top-16 z-10">
                <button onClick={() => window.history.back()} className="text-teal-500 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold truncate">{pageTitle}</h1>
            </header>
            <main className="flex-grow overflow-y-auto">
                {userList.length > 0 ? (
                    <div className="divide-y dark:divide-gray-700">
                        {userList.map(user => (
                            <UserRow 
                                key={user.id}
                                user={user}
                                currentUserId={currentUser.id}
                                isFollowing={currentUser.following.includes(user.id)}
                                onToggleFollow={toggleFollow}
                                setView={setView}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10 text-gray-500">
                        <p>{listType === 'followers' ? 'Belum ada pengikut.' : 'Tidak mengikuti siapa pun.'}</p>
                    </div>
                )}
            </main>
        </div>
    );
};