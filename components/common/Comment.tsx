import React, { useState, useContext, useRef } from 'react';
import { CommunityPostComment, View } from '../../types';
import { DataContext } from '../../App';
import { fileToDataUrl } from '../../utils/fileUtils';

interface CommentProps {
    comment: CommunityPostComment;
    postId: string;
    setView: (view: View) => void;
    isReply?: boolean;
}

export const Comment: React.FC<CommentProps> = ({ comment, postId, setView, isReply = false }) => {
    const { addReplyToComment } = useContext(DataContext);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyImage, setReplyImage] = useState<string | null>(null);
    const replyFileInputRef = useRef<HTMLInputElement>(null);

    const handleReplyImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const dataUrl = await fileToDataUrl(file);
                setReplyImage(dataUrl);
            } catch (error) {
                console.error("Failed to convert file for reply", error);
            }
        }
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyText.trim() || replyImage) {
            addReplyToComment(postId, comment.id, replyText, comment.userName, replyImage || undefined);
            setReplyText('');
            setReplyImage(null);
            setShowReplyForm(false);
            if (replyFileInputRef.current) {
                replyFileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={`flex items-start space-x-2 ${isReply ? 'ml-6' : ''}`}>
            <button onClick={() => setView({ page: 'profile', detailId: comment.userId })}>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {comment.userName.charAt(0).toUpperCase()}
                </div>
            </button>
            <div className="flex-grow">
                <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-2">
                    <button onClick={() => setView({ page: 'profile', detailId: comment.userId })} className="font-semibold hover:underline text-sm">{comment.userName}</button>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                        {comment.replyingTo && (
                            <button 
                                onClick={() => { /* In a real app, find user by name and go to profile */}}
                                className="text-teal-500 font-semibold mr-1"
                            >
                                @{comment.replyingTo}
                            </button>
                        )}
                        {comment.text}
                    </p>
                    {comment.imageUrl && (
                        <img src={comment.imageUrl} alt="Comment attachment" className="mt-2 rounded-lg max-h-40" />
                    )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                    <button onClick={() => setShowReplyForm(prev => !prev)} className="font-semibold hover:underline">Balas</button>
                </div>

                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="mt-2">
                        {replyImage && (
                            <div className="relative mb-2 w-24">
                                <img src={replyImage} alt="Reply Preview" className="rounded-lg h-20 w-20 object-cover"/>
                                <button type="button" onClick={() => { setReplyImage(null); if (replyFileInputRef.current) replyFileInputRef.current.value = ''; }} className="absolute -top-1 -right-1 bg-gray-700 text-white rounded-full p-0.5 text-xs leading-none">&times;</button>
                            </div>
                        )}
                        <div className="flex space-x-2 items-center">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Balas kepada ${comment.userName}...`}
                                className="w-full bg-gray-100 dark:bg-gray-500 rounded-full py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                autoFocus
                            />
                            <input type="file" accept="image/*" className="hidden" ref={replyFileInputRef} onChange={handleReplyImageSelect} />
                            <button type="button" onClick={() => replyFileInputRef.current?.click()} className="text-gray-500 hover:text-teal-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg></button>
                            <button type="submit" className="text-teal-500 font-semibold text-sm">Kirim</button>
                        </div>
                    </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 space-y-2">
                        {comment.replies.map(reply => (
                            <Comment key={reply.id} comment={reply} postId={postId} setView={setView} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
