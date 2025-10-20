import React, { useContext } from 'react';
import { DataContext, UserContext } from '../../App';
import { calculateDistance } from '../../services/locationService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Item, Review, View } from '../../types';
import { StarRating } from '../common/StarRating';
import { ReviewForm } from '../common/ReviewForm';
import { ItemCard } from '../common/ItemCard';

interface StoreDetailPageProps {
    storeId: string;
    setView: (view: View) => void;
}

export const StoreDetailPage: React.FC<StoreDetailPageProps> = ({ storeId, setView }) => {
    const { stores, addReviewToStore } = useContext(DataContext);
    const { user } = useContext(UserContext);
    const { coordinates } = useGeolocation();

    const store = stores.find(s => s.id === storeId);

    if (!store) {
        return (
            <div className="p-4">
                <button onClick={() => setView({ page: 'home' })} className="text-teal-500 font-semibold mb-4">&larr; Kembali</button>
                <p>Toko tidak ditemukan.</p>
            </div>
        );
    }
    
    const distance = coordinates ? calculateDistance(coordinates, store.coordinates) : null;
    
    const handleReviewSubmit = (review: Omit<Review, 'id' | 'userId' | 'userName' | 'timestamp'>) => {
        if (!user) return;
        const newReview: Review = {
            ...review,
            id: `r-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            timestamp: new Date(),
        };
        addReviewToStore(store.id, newReview);
    };

    return (
        <div>
            <div className="p-4">
                <button onClick={() => setView({ page: 'home' })} className="text-teal-500 font-semibold mb-4">&larr; Kembali ke Beranda</button>
            </div>
            <div className="p-4 pt-0">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{store.address}</p>
                {distance !== null && (
                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">{distance.toFixed(0)} meter dari Anda</p>
                )}
                <button 
                  onClick={() => setView({ page: 'chats', chatPartnerId: store.ownerId })}
                  className="mt-4 w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition-colors"
                >
                    Chat dengan Penjual
                </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <h2 className="text-xl font-semibold mb-3">Katalog Produk & Jasa</h2>
                <div className="grid grid-cols-2 gap-4">
                    {store.items.map(item => <ItemCard key={item.id} item={item} storeName={store.name} setView={setView} />)}
                </div>
                 {store.items.length === 0 && <p className="text-center text-gray-500 py-8">Toko ini belum memiliki produk.</p>}
            </div>

             <div className="p-4">
                <h2 className="text-xl font-semibold">Ulasan Pelanggan</h2>
                 {store.reviews.length > 0 ? (
                    <div className="space-y-4 mt-3">
                        {store.reviews.map(review => (
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Belum ada ulasan.</p>
                )}
                {user && (
                    <ReviewForm 
                        targetCoordinates={store.coordinates} 
                        targetName={store.name} 
                        onSubmit={handleReviewSubmit}
                        existingReviews={store.reviews}
                        currentUserId={user.id} 
                    />
                )}
            </div>
        </div>
    );
};