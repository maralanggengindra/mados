import React, { useContext } from 'react';
import { DataContext, UserContext } from '../../App';
import { View } from '../../types';
import { PostCard } from '../common/PostCard';

interface UserProfilePageProps {
    userId: string;
    setView: (view: View) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId, setView }) => {
    // FIX: The `PostCard` component gets `addCommentToCommunityPost` from the context directly,
    // so it doesn't need to be passed as a prop.
    const { users, communityPosts, toggleCommunityPostLike, toggleFollow } = useContext(DataContext);
    const { user: currentUser } = useContext(UserContext);

    const userToShow = users.find(u => u.id === userId);
    
    const userPosts = communityPosts.filter(post => post.userId === userId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (!userToShow || !currentUser) {
        return (
            <div className="p-4">
                 <button onClick={() => setView({ page: 'home' })} className="text-teal-500 font-semibold mb-4">&larr; Kembali</button>
                <p>Pengguna tidak ditemukan.</p>
            </div>
        );
    }

    const isFollowing = currentUser.following.includes(userToShow.id);
    const isOwnProfile = currentUser.id === userToShow.id;

    return (
        <div>
            <div className="p-4">
                <button onClick={() => window.history.back()} className="text-teal-500 font-semibold mb-4">&larr; Kembali</button>
            </div>
            <div className="p-4 pt-0">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                    <div className="flex items-center space-x-4 mb-4">
                        <img 
                            src={userToShow.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userToShow.name)}&background=0D9488&color=fff&size=128`} 
                            alt={userToShow.name}
                            className="w-20 h-20 bg-teal-500 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{userToShow.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{userToShow.email}</p>
                        </div>
                    </div>
                    <div className="flex justify-around text-center border-t pt-4 dark:border-gray-600 mb-4">
                        <button onClick={() => setView({ page: 'follow-list', detailId: userToShow.id, listType: 'followers' })} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg">
                            <p className="font-bold text-lg">{userToShow.followers.length}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pengikut</p>
                        </button>
                         <button onClick={() => setView({ page: 'follow-list', detailId: userToShow.id, listType: 'following' })} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg">
                            <p className="font-bold text-lg">{userToShow.following.length}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mengikuti</p>
                        </button>
                    </div>
                     {!isOwnProfile && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => toggleFollow(userToShow.id)}
                                className={`w-full font-bold py-2 px-4 rounded-lg transition-colors ${
                                    isFollowing 
                                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300'
                                    : 'bg-teal-500 text-white hover:bg-teal-600'
                                }`}
                            >
                                {isFollowing ? 'Berhenti Mengikuti' : 'Ikuti'}
                            </button>
                            <button
                                onClick={() => setView({ page: 'chats', chatPartnerId: userToShow.id })}
                                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span>Pesan</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Postingan Komunitas</h3>
                <div className="space-y-4">
                    {userPosts.length > 0 ? (
                        userPosts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLikeToggle={toggleCommunityPostLike}
                                currentUserId={currentUser.id}
                                setView={setView}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                            <p className="text-gray-500 dark:text-gray-400">Pengguna ini belum memiliki postingan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};