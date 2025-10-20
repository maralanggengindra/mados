// FIX: Removed extraneous file markers.
import React, { useState, useContext } from 'react';
import { UserContext, DataContext } from '../../App';
import { Store, Page, View } from '../../types';
import { useGeolocation } from '../../hooks/useGeolocation';

interface SellerRegistrationProps {
    setView: (view: View) => void;
}

// This interface is for the data we need to hold while pending
interface PendingStoreData {
    storeName: string;
    address: string;
}

const RegisterSellerView: React.FC<{ onRegister: (data: PendingStoreData) => void }> = ({ onRegister }) => {
    const { coordinates, loading, error } = useGeolocation();
    const [storeName, setStoreName] = useState('');
    const [address, setAddress] = useState('');
    const [formError, setFormError] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!storeName || !address) {
            setFormError('Nama toko dan alamat harus diisi.');
            return;
        }
        if (!coordinates) {
            setFormError('Tidak bisa mendapatkan lokasi Anda. Pastikan izin lokasi diberikan dan aktif.');
            return;
        }
        onRegister({ storeName, address });
    };

    return (
        <div className="p-6 flex flex-col justify-center flex-grow">
            <h1 className="text-2xl font-bold mb-2">Daftar Jadi Mitra Toko</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Buat tokomu, pasang lokasinya di peta, dan mulai jangkau pelanggan di sekitarmu.</p>

            <form onSubmit={handleRegister} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                {formError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{formError}</p>}
                <div className="mb-4">
                    <label htmlFor="storeName" className="block text-sm font-medium mb-1">Nama Toko Anda</label>
                    <input type="text" id="storeName" value={storeName} onChange={e => setStoreName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-teal-500 focus:border-teal-500"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium mb-1">Alamat Lengkap Toko</label>
                    <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-teal-500 focus:border-teal-500"></textarea>
                </div>
                <div className="mb-6 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                    <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Titik Peta Lokasi Toko</h4>
                    {loading && <p className="text-gray-500">Mencari lokasi Anda...</p>}
                    {error && <p className="text-red-500">Gagal mendapatkan lokasi: {error.message}</p>}
                    {coordinates && <p className="text-green-600 dark:text-green-400">Lokasi Anda saat ini akan digunakan sebagai titik peta toko. Pastikan Anda berada di lokasi toko saat mendaftar.</p>}
                </div>

                <button type="submit" disabled={loading || !coordinates} className="w-full bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Daftarkan Toko
                </button>
            </form>
        </div>
    );
};

const PendingApprovalView: React.FC<{ onSimulateApproval: () => void, onCancel: () => void }> = ({ onSimulateApproval, onCancel }) => 
{
    return (
        <div className="p-6 text-center flex-grow flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">Pendaftaran Sedang Ditinjau</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
                Terima kasih telah mendaftar. Tim Mados akan meninjau pendaftaran Anda. Anda akan diberitahu jika pendaftaran disetujui.
            </p>
            <button 
                onClick={onSimulateApproval}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mb-4"
            >
                (Simulasikan Persetujuan Admin)
            </button>
            <button 
                onClick={onCancel}
                className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
            >
                Kembali ke Profil
            </button>
        </div>
    );
};

export const SellerRegistration: React.FC<SellerRegistrationProps> = ({ setView }) => {
    const { user, setUser } = useContext(UserContext);
    const { addStore } = useContext(DataContext);
    const { coordinates } = useGeolocation();
    
    // This local state holds the submitted data while status is 'pending'
    const [pendingData, setPendingData] = useState<PendingStoreData | null>(null);
    
    const handleRegistrationSubmit = (data: PendingStoreData) => {
        if (!user) return;
        setPendingData(data);
        const updatedUser = { ...user, sellerStatus: 'pending' as const };
        // This is a workaround since setUser expects a User object or null
        // A better architecture would use a dedicated function to update parts of the user
        setUser(updatedUser);
    };

    const handleSimulateApproval = () => {
        if (!user || !pendingData || !coordinates) {
             console.error("Missing data for approval:", {user, pendingData, coordinates});
             return;
        }
        
        const newStore: Store = {
            id: `store-${Date.now()}`,
            name: pendingData.storeName,
            ownerId: user.id,
            coordinates: coordinates,
            address: pendingData.address,
            items: [],
            reviews: [],
        };
        addStore(newStore);

        const updatedUser = { 
            ...user, 
            sellerStatus: 'approved' as const, 
            storeId: newStore.id 
        };
        setUser(updatedUser);
        setPendingData(null);
        setView({ page: 'profile' }); // Redirect to profile to see the new status
    };

    if (!user) return null;

    switch (user.sellerStatus) {
        case 'none':
            return <RegisterSellerView onRegister={handleRegistrationSubmit} />;
        case 'pending':
            return <PendingApprovalView onSimulateApproval={handleSimulateApproval} onCancel={() => setView({ page: 'profile' })} />;
        