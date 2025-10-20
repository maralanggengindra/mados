import React, { useContext, useMemo } from 'react';
import { DataContext, UserContext } from '../../App';
import { Item, Review, Store, View } from '../../types';
import { StarRating } from '../common/StarRating';
import { ReviewForm } from '../common/ReviewForm';

interface ItemDetailPageProps {
    itemId: string;
    setView: (view: View) => void;
}

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ itemId, setView }) => {
    const { stores, addReviewToItem } = useContext(DataContext);
    const { user } = useContext(UserContext);

    const { item, store } = useMemo(() => {
        let foundItem: Item | null = null;
        let foundStore: Store | null = null;
        for (const s of stores) {
            const item = s.items.find(i => i.id === itemId);
            if (item) {
                foundItem = item;
                foundStore = s;
                break;
            }
        }
        return { item: foundItem, store: foundStore };
    }, [stores, itemId]);

    if (!item || !store) {
        return (
            <div className="p-4">
                <button onClick={() => window.history.back()} className="text-teal-500 font-semibold mb-4">&larr; Kembali</button>
                <p>Produk tidak ditemukan.</p>
            </div>
        );
    }
    
    const handleReviewSubmit = (review: Omit<Review, 'id' | 'userId' | 'userName' | 'timestamp'>) => {
        if (!user) return;
        const newReview: Review = {
            ...review,
            id: `r-item-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            timestamp: new Date(),
        };
        addReviewToItem(store.id, item.id, newReview);
    };

    return (
        <div>
             <div className="p-4">
                <button onClick={() => setView({ page: 'home', detailId: store.id })} className="text-teal-500 font-semibold mb-4">&larr; Kembali ke Toko</button>
            </div>
            <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover bg-gray-200 dark:bg-gray-700"/>
            <div className="p-4">
                <h1 className="text-3xl font-bold">{item.name}</h1>
                <p className="text-2xl text-teal-500 font-bold my-2">Rp {item.price.toLocaleString('id-ID')}</p>
                <button onClick={() => setView({ page: 'home', detailId: store.id })} className="text-md font-semibold text-gray-600 dark:text-gray-300 hover:underline">
                    Dijual oleh: {store.name}
                </button>
                <p className="text-gray-600 dark:text-gray-400 mt-4">{item.description}</p>
                 <button 
                  onClick={() => setView({ 
                      page: 'chats', 
                      chatPartnerId: store.ownerId,
                      chatContext: {
                          productContext: item,
                          prefilledMessage: `Apakah produk "${item.name}" ini ready?`
                      }
                  })}
                  className="mt-6 w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-600 transition-colors"
                >
                    Tanya Penjual
                </button>
            </div>

            <div className="p-4 border-t dark:border-gray-700">
                <h2 className="text-xl font-semibold">Ulasan Produk</h2>
                 {item.reviews.length > 0 ? (
                    <div className="space-y-4 mt-3">
                        {item.reviews.map(review => (
                            <div key={review.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                     <button onClick={() => setView({ page: 'profile', detailId: review.userId })} className="font-semibold hover:underline">{review.userName}</button>
                                    <StarRating rating={review.rating} size="sm" />
                                </div>
                                <p className="text-sm mt-1">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Belum ada ulasan untuk produk ini.</p>
                )}
                {user && (
                    <ReviewForm 
                        targetName={item.name} 
                        onSubmit={handleReviewSubmit}
                        existingReviews={item.reviews}
                        currentUserId={user.id}
                        requireLocationProximity={false} // Users can review a product without being at the store
                    />
                )}
            </div>
        </div>
    );
};