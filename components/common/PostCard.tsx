import React, { useState, useContext } from 'react';
import { CommunityPost, View } from '../../types';
import { UserContext, DataContext } from '../../App';
import { Comment } from './Comment';
import { fileToDataUrl } from '../../utils/fileUtils';

interface PostCardProps {
    post: CommunityPost;
    currentUserId: string;
    onLikeToggle: (postId: string) => void;
    setView: (view: View) => void;
}

const LikeIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${filled ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);
const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);
const ShareIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "t";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "b";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "j";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "d";
};


export const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onLikeToggle, setView }) => {
    const { user: currentUser } = useContext(UserContext);
    const { addCommentToCommunityPost } = useContext(DataContext);
    const [commentText, setCommentText] = useState('');
    const [commentImage, setCommentImage] = useState<string | null>(null);
    const [showComments, setShowComments] = useState(false);
    const commentFileInputRef = React.useRef<HTMLInputElement>(null);

    const isLiked = post.likes.includes(currentUserId);

    const handleCommentImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const dataUrl = await fileToDataUrl(file);
                setCommentImage(dataUrl);
            } catch (error) {
                console.error("Failed to convert file", error);
            }
        }
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim() || commentImage) {
            addCommentToCommunityPost(post.id, commentText, commentImage || undefined);
            setCommentText('');
            setCommentImage(null);
            if (commentFileInputRef.current) {
                commentFileInputRef.current.value = '';
            }
        }
    };
    
    const handleContactSeller = () => {
        setView({ 
            page: 'chats', 
            chatPartnerId: post.userId,
            chatContext: {
                productContext: post,
                prefilledMessage: `Halo, apakah "${post.title}" masih tersedia?`
            }
        });
    }

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
                <div className="flex items-center mb-3">
                    <button onClick={() => setView({ page: 'profile', detailId: post.userId })} className="flex items-center">
                        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mr-3">
                           {post.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold hover:underline">{post.userName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{timeSince(post.timestamp)}</p>
                        </div>
                    </button>
                </div>
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 my-2">{post.description}</p>
                 <p className="text-xl text-teal-500 font-bold mb-3">Rp {post.price.toLocaleString('id-ID')}</p>
            </div>
            
            <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
            
            <div className="p-4">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.likes.length} Suka</span>
                    <button onClick={() => setShowComments(prev => !prev)}>{post.comments.length} Komentar</button>
                </div>

                <div className="flex justify-around border-t border-b dark:border-gray-600 my-2 py-1">
                    <button onClick={() => onLikeToggle(post.id)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg w-full justify-center">
                        <LikeIcon filled={isLiked} />
                        <span className={`font-semibold ${isLiked ? 'text-red-500' : ''}`}>Suka</span>
                    </button>
                    <button onClick={() => setShowComments(true)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 p-2 rounded-lg w-full justify-center">
                        <CommentIcon />
                        <span className="font-semibold">Komentar</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 p-2 rounded-lg w-full justify-center">
                        <ShareIcon />
                        <span className="font-semibold">Bagikan</span>
                    </button>
                </div>
                 {currentUserId !== post.userId && (
                    <button
                        onClick={handleContactSeller}
                        className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition-colors"
                    >
                        Hubungi Penjual
                    </button>
                )}

                {showComments && (
                    <div className="mt-4 space-y-3">
                        {post.comments.map(comment => (
                           <Comment key={comment.id} comment={comment} postId={post.id} setView={setView} />
                        ))}
                    </div>
                )}

                 <form onSubmit={handleCommentSubmit} className="mt-4">
                    {commentImage && (
                        <div className="relative mb-2 w-28">
                            <img src={commentImage} alt="Preview" className="rounded-lg h-24 w-24 object-cover"/>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setCommentImage(null);
                                    if(commentFileInputRef.current) commentFileInputRef.current.value = '';
                                }} 
                                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 leading-none"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Tulis komentar..."
                            className="w-full bg-gray-100 dark:bg-gray-600 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={commentFileInputRef} 
                            onChange={handleCommentImageSelect} 
                        />
                        <button type="button" onClick={() => commentFileInputRef.current?.click()} className="text-gray-500 dark:text-gray-400 hover:text-teal-500 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                        </button>
                        <button type="submit" className="text-teal-500 font-semibold text-sm">Kirim</button>
                    </div>
                </form>

            </div>
        </div>
    );
};