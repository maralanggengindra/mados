// FIX: Removed extraneous file markers.
import React, { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance } from '../../services/locationService';
import { Coordinates, Review } from '../../types';
import { StarRating } from './StarRating';

interface ReviewFormProps {
    targetCoordinates?: Coordinates;
    targetName: string;
    onSubmit: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'timestamp'>) => void;
    existingReviews: Review[];
    currentUserId: string;
    requireLocationProximity?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ targetCoordinates, targetName, onSubmit, existingReviews, currentUserId, requireLocationProximity = true }) => {
    const { coordinates: userCoordinates, error: geoError, loading: geoLoading } = useGeolocation();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [distance, setDistance] = useState<number | null>(null);

    const hasReviewed = useMemo(() => {
        return existingReviews.some(review => review.userId === currentUserId);
    }, [existingReviews, currentUserId]);

    const isWithinDistance = distance !== null && distance <= 20;

    useEffect(() => {
        if (requireLocationProximity && userCoordinates && targetCoordinates) {
            const dist = calculateDistance(userCoordinates, targetCoordinates);
            setDistance(dist);
        }
    }, [userCoordinates, targetCoordinates, requireLocationProximity]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ( (requireLocationProximity && !isWithinDistance) || hasReviewed || rating === 0) return;
        onSubmit({ rating, comment });
        setRating(0);
        setComment('');
    };

    const getStatusMessage = () => {
        if (hasReviewed) return `Anda sudah memberikan ulasan untuk ${targetName}.`;
        
        if (requireLocationProximity) {
            if (geoLoading) return 'Mencari lokasi Anda...';
            if (geoError) return `Error lokasi: ${geoError.message}`;
            if (distance === null) return 'Menghitung jarak...';
            if (!isWithinDistance) {
                return `Anda harus berada dalam radius 20m dari ${targetName} untuk memberi ulasan. Jarak Anda: ${distance.toFixed(0)}m.`;
            }
            return `Anda berada ${distance.toFixed(0)}m dari lokasi. Silakan beri ulasan.`;
        }
        
        return `Bagikan pendapat Anda tentang ${targetName}.`;
    };

    const canSubmit = !hasReviewed && (!requireLocationProximity || isWithinDistance);

    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <h3 className="text-lg font-semibold mb-2">Beri Ulasan untuk {targetName}</h3>
            <div className={`p-3 rounded-lg text-sm mb-4 ${canSubmit ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {getStatusMessage()}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating Anda</label>
                    <StarRating rating={rating} onRatingChange={hasReviewed ? undefined : setRating} />
                </div>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium mb-2">Komentar</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-200 dark:disabled:bg-gray-800"
                        placeholder={hasReviewed ? 'Anda sudah memberi ulasan.' : 'Bagikan pengalaman Anda...'}
                        disabled={hasReviewed}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!canSubmit || rating === 0}
                    className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors"
                >
                    {hasReviewed ? 'Ulasan Terkirim' : 'Kirim Ulasan'}
                </button>
            </form>
        </div>
    );
};