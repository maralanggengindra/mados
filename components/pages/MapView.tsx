// FIX: Removed extraneous file markers.
import React, { useState, useContext, useMemo } from 'react';
import { View, Store, Coordinates, PublicService } from '../../types';
import { DataContext } from '../../App';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance } from '../../services/locationService';

// A type for map points, can be a Store or a PublicService
type MapPoint = (Store | PublicService) & { distance?: number };

interface MapViewProps {
    setView: (view: View) => void;
}

export const MapView: React.FC<MapViewProps> = ({ setView }) => {
    const { stores, publicServices } = useContext(DataContext);
    const { coordinates, loading, error } = useGeolocation();
    const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const mapPoints = useMemo((): MapPoint[] => {
        let allPoints: MapPoint[] = [...stores, ...publicServices];

        if (coordinates) {
            allPoints = allPoints.map(p => ({ ...p, distance: calculateDistance(coordinates, p.coordinates) }));
        }
        
        if (searchQuery.trim() === '') {
            return allPoints;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        return allPoints.filter(p => 
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.address.toLowerCase().includes(lowercasedQuery) ||
            ('type' in p && p.type.toLowerCase().includes(lowercasedQuery)) // Also search by public service type
        );

    }, [stores, publicServices, coordinates, searchQuery]);

    // For simplicity, create a symbolic map view.
    // Define a bounding box based on the mock data to position the points.
    const boundingBox = {
        minLat: -7.3,
        maxLat: -6.1,
        minLon: 106.8,
        maxLon: 112.8
    };

    const getPosition = (pointCoords: Coordinates) => {
        const top = ((boundingBox.maxLat - pointCoords.latitude) / (boundingBox.maxLat - boundingBox.minLat)) * 100;
        const left = ((pointCoords.longitude - boundingBox.minLon) / (boundingBox.maxLon - boundingBox.minLon)) * 100;
        // Clamp values to prevent points from going off-screen
        return { top: `${Math.max(0, Math.min(100, top))}%`, left: `${Math.max(0, Math.min(100, left))}%` };
    };

    const handlePointClick = (point: MapPoint) => {
        setSelectedPoint(point);
    };

    const handleInfoClose = () => {
        setSelectedPoint(null);
    };

    return (
        <div className="p-4 h-full flex flex-col relative">
            <h1 className="text-2xl font-bold mb-4">Peta Sekitar</h1>
            
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, alamat, atau jenis layanan..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div className="relative h-2/5 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner">
                {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white"><p>Mencari lokasi Anda...</p></div>}
                {error && <div className="absolute inset-0 flex items-center justify-center bg-red-500/50 text-white p-4 text-center"><p>Error Lokasi: {error.message}</p></div>}
                
                {mapPoints.map(point => {
                    const { top, left } = getPosition(point.coordinates);
                    const isStore = 'items' in point;
                    const color = isStore ? 'bg-blue-500' : 'bg-green-500';

                    return (
                        <button
                            key={point.id}
                            style={{ top, left }}
                            onClick={() => handlePointClick(point)}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${color} rounded-full border-2 border-white dark:border-gray-800 shadow-lg z-10 hover:scale-150 transition-transform`}
                            title={point.name}
                        />
                    );
                })}
                
                {coordinates && (
                    <div 
                        style={getPosition(coordinates)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                        title="Lokasi Anda"
                    >
                         <div className="w-5 h-5 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-grow overflow-y-auto pt-4">
                {searchQuery ? (
                    mapPoints.length > 0 ? (
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold mb-2">Hasil Pencarian "{searchQuery}"</h2>
                            {mapPoints.map(point => (
                                <div 
                                    key={point.id} 
                                    onClick={() => handlePointClick(point)}
                                    className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <h3 className="font-bold">{point.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{point.address}</p>
                                    {point.distance !== undefined && (
                                        <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">{point.distance.toFixed(0)}m dari Anda</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center text-gray-500 dark:text-gray-400 pt-8">
                                <p>Tidak ada hasil yang ditemukan untuk "{searchQuery}".</p>
                            </div>
                        )
                    )
                ) : (
                     <div className="text-center text-gray-500 dark:text-gray-400 pt-8">
                        <p>Mulai cari nama atau alamat untuk melihat hasil di sini.</p>
                    </div>
                )}
            </div>

            {selectedPoint && (
                <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto p-4 z-30">
                     <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{selectedPoint.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPoint.address}</p>
                                {selectedPoint.distance !== undefined && (
                                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-1">{selectedPoint.distance.toFixed(0)}m dari Anda</p>
                                )}
                            </div>
                            <button onClick={handleInfoClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                        </div>
                        
                        {'items' in selectedPoint ? (
                             <button onClick={() => setView({ page: 'home', detailId: selectedPoint.id })} className="mt-3 w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition-colors text-sm">
                                Lihat Detail Toko
                            </button>
                        ) : (
                             <div className="mt-3 space-y-2">
                                <button onClick={() => setView({ page: 'public-service-detail', detailId: selectedPoint.id })} className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition-colors text-sm">
                                    Lihat Detail & Ulasan
                                </button>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.coordinates.latitude},${selectedPoint.coordinates.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block text-center bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm"
                                >
                                    Arahkan
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};