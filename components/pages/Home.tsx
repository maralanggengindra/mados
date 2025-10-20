// FIX: Removed extraneous file markers.
import React, { useContext, useMemo } from 'react';
import { UserContext, DataContext } from '../../App';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance } from '../../services/locationService';
import { Store, Item, View } from '../../types';
import { Slideshow } from '../common/Slideshow';
import { MOCK_PROMOS } from '../../constants';
import { ItemCard } from '../common/ItemCard';

interface StoreWithDistance extends Store {
    distance: number;
}

interface HomeProps {
    setView: (view: View) => void;
}

const EmptyHome: React.FC = () => (
    <div className="text-center py-16 px-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Belum Ada Toko di Sekitar</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Coba periksa kembali nanti atau jelajahi halaman Peta untuk melihat direktori layanan publik.</p>
        <div className="mt-6">
            <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
                Lihat Peta
            </button>
        </div>
    </div>
);

export const Home: React.FC<HomeProps> = ({ setView }) => {
    const { user } = useContext(UserContext);
    const { coordinates, loading, error } = useGeolocation();
    const { stores } = useContext(DataContext);

    const sortedStores = useMemo((): StoreWithDistance[] => {
        if (!coordinates) return [];
        return stores
            .map(store => ({
                ...store,
                distance: calculateDistance(coordinates, store.coordinates)
            }))
            .sort((a, b) => a.distance - b.distance);
    }, [coordinates, stores]);

    const hasContent = !loading && sortedStores.length > 0;

    return (
        <div>
            <div className="mb-6">
                <Slideshow slides={MOCK_PROMOS} setView={setView} />
            </div>

            <div className="p-4">
                {loading && <p className="text-center py-10">Mencari lokasimu...</p>}
                {error && <p className="text-red-500 text-center py-10">Gagal mendapatkan lokasi: {error.message}</p>}
                
                {coordinates && (
                    <div>
                        {hasContent ? (
                            <>
                                <section>
                                    <h2 className="text-xl font-semibold mb-3">Toko & Jasa Terdekat</h2>
                                    <div className="space-y-4">
                                        {sortedStores.map(store => (
                                            <div 
                                                key={store.id} 
                                                onClick={() => setView({ page: 'home', detailId: store.id })}
                                                className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <h3 className="font-bold">{store.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{store.address}</p>
                                                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">{store.distance.toFixed(0)} meter dari Anda</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="mt-8">
                                    <h2 className="text-xl font-semibold mb-3">Produk Populer di Sekitar</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {sortedStores.slice(0, 2).flatMap(store => 
                                            store.items.slice(0, 2).map(item => <ItemCard key={item.id} item={item} storeName={store.name} setView={setView} />)
                                        )}
                                    </div>
                                </section>
                            </>
                        ) : (
                           !loading && <EmptyHome />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};