// FIX: Removed extraneous file markers.
import React, { useState, useMemo, useContext, useEffect, useRef } from 'react';
import { findSimilarProductsFromImage } from '../../services/geminiService';
import { Item, Store, View } from '../../types';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance } from '../../services/locationService';
import { DataContext } from '../../App';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

interface FoundItem extends Item {
    storeName: string;
    storeDistance: number;
}

interface ImageSearchProps {
    setView: (view: View) => void;
    initialQuery?: string;
}

export const ImageSearch: React.FC<ImageSearchProps> = ({ setView, initialQuery }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
    const [searchedTerm, setSearchedTerm] = useState<string | null>(null);
    const [textQuery, setTextQuery] = useState(initialQuery || '');
    const { coordinates } = useGeolocation();
    const { stores } = useContext(DataContext);
    
    const handleTextSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!textQuery.trim() || !coordinates) {
             if (!coordinates) setError("Lokasi tidak ditemukan, tidak bisa mencari barang terdekat.");
             return;
        }

        setError(null);
        setFoundItems([]);
        setImagePreview(null);
        setIsLoading(true);
        setSearchedTerm(textQuery);
        
        // Simulate async search
        setTimeout(() => {
            const allItems: FoundItem[] = stores.flatMap(store =>
                store.items.map(item => ({
                    ...item,
                    storeName: store.name,
                    storeDistance: calculateDistance(coordinates, store.coordinates)
                }))
            );

            const matchingItems = allItems.filter(item =>
                item.name.toLowerCase().includes(textQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(textQuery.toLowerCase())
            ).sort((a, b) => a.storeDistance - b.storeDistance);

            setFoundItems(matchingItems);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        if (initialQuery) {
            // The textQuery state is already set from the prop, so we just trigger the search
            handleTextSearch();
        }
        // We only want this effect to run once when the component mounts with an initial query.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setError(null);
            setFoundItems([]);
            setSearchedTerm(null);
            setTextQuery('');
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setIsLoading(true);
            try {
                const base64Image = await fileToBase64(file);
                const result = await findSimilarProductsFromImage(base64Image, file.type);
                
                setSearchedTerm(result.itemName);

                if (result && coordinates) {
                    const allItems: FoundItem[] = stores.flatMap(store =>
                        store.items.map(item => ({
                            ...item,
                            storeName: store.name,
                            storeDistance: calculateDistance(coordinates, store.coordinates)
                        }))
                    );

                    // Simple search logic: filter items whose name contains the term from Gemini
                    const matchingItems = allItems.filter(item =>
                        item.name.toLowerCase().includes(result.itemName.toLowerCase().split(" ")[0]) ||
                        item.description.toLowerCase().includes(result.itemName.toLowerCase().split(" ")[0])
                    ).sort((a, b) => a.storeDistance - b.storeDistance);

                    setFoundItems(matchingItems);
                }

            } catch (err: any) {
                setError(err.message || 'Gagal memproses gambar.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-full">
            <h1 className="text-2xl font-bold mb-4">Cari Barang & Jasa</h1>

            <form onSubmit={handleTextSearch} className="mb-6 flex space-x-2">
                <input
                    type="text"
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    placeholder="Cari produk atau jasa..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button type="submit" className="bg-teal-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-teal-600 transition-colors">
                    Cari
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-gray-50 dark:bg-gray-800 px-2 text-sm text-gray-500">ATAU</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
                <h2 className="text-lg font-semibold mb-4">Cari dengan Gambar</h2>
                <div className="mb-4">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="max-h-60 w-auto mx-auto rounded-lg" />
                    ) : (
                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Pilih gambar untuk memulai</p>
                        </div>
                    )}
                </div>
                <label htmlFor="image-upload" className="cursor-pointer bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition-colors">
                    Upload Gambar
                </label>
                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {isLoading && (
                <div className="text-center mt-6">
                    <p className="text-lg">Mencari...</p>
                </div>
            )}
            {error && <p className="text-red-500 text-center mt-6">{error}</p>}
            
            {searchedTerm && !isLoading && (
                 <div className="mt-6">
                    <h2 className="text-xl font-semibold">Hasil Pencarian untuk "{searchedTerm}"</h2>
                    {foundItems.length > 0 ? (
                        <div className="mt-4 space-y-3">
                            {foundItems.map(item => (
                                <div key={item.id} className="flex items-center bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                                    <div className="flex-grow">
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{item.storeName}</p>
                                        <p className="text-sm text-teal-600 dark:text-teal-400 font-semibold">{item.storeDistance.toFixed(0)}m dari Anda</p>
                                        <p className="font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-center text-gray-500">Tidak ada hasil yang ditemukan untuk "{searchedTerm}".</p>
                    )}
                 </div>
            )}
        </div>
    );
};