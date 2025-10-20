import React, { useContext } from 'react';
import { DataContext, UserContext } from '../../App';
import { calculateDistance } from '../../services/locationService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Review, View } from '../../types';
import { StarRating } from '../common/StarRating';
import { ReviewForm } from '../common/ReviewForm';

interface PublicServiceDetailPageProps {
    serviceId: string;
    setView: (view: View) => void;
}

export const PublicServiceDetailPage: React.FC<PublicServiceDetailPageProps> = ({ serviceId, setView }) => {
    const { publicServices, addReviewToPublicService } = useContext(DataContext);
    const { user } = useContext(UserContext);
    const { coordinates } = useGeolocation();

    const service = publicServices.find(s => s.id === serviceId);

    if (!service) {
        return (
            <div className="p-4">
                <button onClick={() => setView({ page: 'map' })} className="text-teal-500 font-semibold mb-4">&larr; Kembali ke Peta</button>
                <p>Layanan publik tidak ditemukan.</p>
            </div>
        );
    }
    
    const distance = coordinates ? calculateDistance(coordinates, service.coordinates) : null;
    
    const handleReviewSubmit = (review: Omit<Review, 'id' | 'userId' | 'userName' | 'timestamp'>) => {
        if (!user) return;
        const newReview: Review = {
            ...review,
            id: `r-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            timestamp: new Date(),
        };
        addReviewToPublicService(service.id, newReview);
    };

    const isSystemOwned = service.ownerId === 'system';

    return (
        <div>
            <div className="p-4">
                <button onClick={() => setView({ page: 'map' })} className="text-teal-500 font-semibold mb-4">&larr; Kembali ke Peta</button>
            </div>
            <div className="p-4 pt-0">
                <h1 className="text-3xl font-bold">{service.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{service.address}</p>
                 <p className="text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full inline-block mt-2">{service.type}</p>
                {distance !== null && (
                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-2">{distance.toFixed(0)} meter dari Anda</p>
                )}
                {!isSystemOwned && (
                    <button 
                      onClick={() => setView({ page: 'chats', chatPartnerId: service.ownerId })}
                      className="mt-4 w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition-colors"
                    >
                        Hubungi Pengelola
                    </button>
                )}
                 <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${service.coordinates.latitude},${service.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full block text-center bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Arahkan
                </a>
            </div>

             <div className="p-4 border-t dark:border-gray-700">
                <h2 className="text-xl font-semibold">Ulasan Masyarakat</h2>
                 {service.reviews.length > 0 ? (
                    <div className="space-y-4 mt-3">
                        {service.reviews.map(review => (
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
                        targetCoordinates={service.coordinates} 
                        targetName={service.name} 
                        onSubmit={handleReviewSubmit}
                        existingReviews={service.reviews}
                        currentUserId={user.id} 
                    />
                )}
            </div>
        </div>
    );
};