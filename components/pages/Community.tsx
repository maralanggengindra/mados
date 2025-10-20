import React, { useState, useContext } from 'react';
import { CommunityPost, View } from '../../types';
import { UserContext, DataContext } from '../../App';
import { PostCard } from '../common/PostCard';
import { fileToDataUrl } from '../../utils/fileUtils';

interface CommunityProps {
    setView: (view: View) => void;
}

const CreatePostForm: React.FC<{ onAddPost: (post: Omit<CommunityPost, 'id' | 'userId' | 'userName' | 'timestamp' | 'likes' | 'comments'>) => void }> = ({ onAddPost }) => {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    if (!user) return null;

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const dataUrl = await fileToDataUrl(file);
                setImagePreview(dataUrl);
            } catch (error) {
                console.error("Error converting file to data URL", error);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !price || !imagePreview) {
            alert('Judul, harga, dan gambar tidak boleh kosong.');
            return;
        }

        const newPostData = {
            title,
            description,
            price: Number(price),
            imageUrl: imagePreview,
        };

        onAddPost(newPostData);

        // Reset form
        setTitle('');
        setDescription('');
        setPrice('');
        setImagePreview(null);
        const fileInput = document.getElementById('post-image-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border-b dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:border-teal-500"
                        placeholder={`Apa yang Anda jual, ${user.name}?`}
                    />
                </div>
            </div>
            <div className="mt-3 pl-13">
                 <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full p-2 text-sm border-none dark:bg-gray-700 focus:outline-none resize-none"
                    placeholder="Tambahkan deskripsi singkat..."
                />
            </div>
            {imagePreview && (
                <div className="mt-3 pl-13">
                    <img src={imagePreview} alt="Pratinjau" className="max-h-40 rounded-lg" />
                </div>
            )}
            <div className="mt-3 pt-3 border-t dark:border-gray-600 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <label htmlFor="post-image-upload" className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-green-500 flex items-center space-x-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Foto</span>
                    </label>
                    <input id="post-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <input 
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-32 p-1 border rounded-md dark:bg-gray-600 dark:border-gray-500 text-sm"
                        placeholder="Harga (Rp)"
                    />
                </div>
                <button type="submit" className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors text-sm">
                    Posting
                </button>
            </div>
        </form>
    );
};

const EmptyCommunity: React.FC = () => (
    <div className="text-center py-16 px-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Komunitas Masih Sepi</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Jadilah yang pertama untuk memulai jual beli di komunitas sekitar Anda.</p>
    </div>
);


export const Community: React.FC<CommunityProps> = ({ setView }) => {
    const { user } = useContext(UserContext);
    // FIX: The `PostCard` component gets `addCommentToCommunityPost` from the context directly,
    // so it doesn't need to be passed as a prop.
    const { communityPosts, addCommunityPost, toggleCommunityPostLike } = useContext(DataContext);
    
    if (!user) return null;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Komunitas Jual Beli</h1>
            
            <CreatePostForm onAddPost={addCommunityPost} />
            
            {communityPosts.length > 0 ? (
                <div className="space-y-4">
                    {communityPosts.map(post => (
                       <PostCard 
                            key={post.id} 
                            post={post}
                            onLikeToggle={toggleCommunityPostLike}
                            currentUserId={user.id}
                            setView={setView}
                        />
                    ))}
                </div>
            ) : (
                <EmptyCommunity />
            )}
        </div>
    );
};