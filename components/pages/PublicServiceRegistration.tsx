import React, { useState, useContext } from 'react';
import { UserContext, DataContext } from '../../App';
import { PublicService, View } from '../../types';
import { useGeolocation } from '../../hooks/useGeolocation';

interface PublicServiceRegistrationProps {
    setView: (view: View) => void;
}

interface PendingServiceData {
    serviceName: string;
    serviceType: string;
    address: string;
}

const SERVICE_TYPES = [
    "Kantor Pemerintahan", "Bank", "ATM", "SPBU", "PLN", "PDAM", "Minimarket", 
    "Obyek Wisata", "Puskesmas", "Rumah Sakit", "Tempat Ibadah", "Transportasi", "Lainnya"
];

const RegisterServiceView: React.FC<{ onRegister: (data: PendingServiceData) => void }> = ({ onRegister }) => {
    const { coordinates, loading, error } = useGeolocation();
    const [serviceName, setServiceName] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [address, setAddress] = useState('');
    const [formError, setFormError] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!serviceName || !serviceType || !address) {
            setFormError('Semua kolom harus diisi.');
            return;
        }
        if (!coordinates) {
            setFormError('Tidak bisa mendapatkan lokasi Anda. Pastikan izin lokasi diberikan dan aktif.');
            return;
        }
        onRegister({ serviceName, serviceType, address });
    };

    return (
        <div className="p-6 flex flex-col justify-center flex-grow">
            <h1 className="text-2xl font-bold mb-2">Daftar Layanan Publik</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Tambahkan lokasi layanan publik Anda ke peta agar mudah ditemukan oleh masyarakat sekitar.</p>

            <form onSubmit={handleRegister} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                {formError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{formError}</p>}
                <div className="mb-4">
                    <label htmlFor="serviceName" className="block text-sm font-medium mb-1">Nama Lokasi</label>
                    <input type="text" id="serviceName" value={serviceName} onChange={e => setServiceName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-teal-500 focus:border-teal-500"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="serviceType" className="block text-sm font-medium mb-1">Jenis Layanan</label>
                    <select id="serviceType" value={serviceType} onChange={e => setServiceType(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-teal-500 focus:border-teal-500">
                        <option value="" disabled>Pilih jenis layanan...</option>
                        {SERVICE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium mb-1">Alamat Lengkap</label>
                    <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-teal-500 focus:border-teal-500"></textarea>
                </div>
                <div className="mb-6 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                    <h4 className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Titik Peta Lokasi</h4>
                    {loading && <p className="text-gray-500">Mencari lokasi Anda...</p>}
                    {error && <p className="text-red-500">Gagal mendapatkan lokasi: {error.message}</p>}
                    {coordinates && <p className="text-green-600 dark:text-green-400">Lokasi Anda saat ini akan digunakan. Pastikan Anda berada di lokasi yang benar.</p>}
                </div>

                <button type="submit" disabled={loading || !coordinates} className="w-full bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Daftarkan Lokasi
                </button>
            </form>
        </div>
    );
};

const PendingApprovalView: React.FC<{ onSimulateApproval: () => void, onCancel: () => void }> = ({ onSimulateApproval, onCancel }) => {
    return (
        <div className="p-6 text-center flex-grow flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">Pendaftaran Sedang Ditinjau</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
                Terima kasih telah mendaftar. Tim kami akan meninjau pendaftaran lokasi Anda.
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

export const PublicServiceRegistration: React.FC<PublicServiceRegistrationProps> = ({ setView }) => {
    const { user, setUser } = useContext(UserContext);
    const { addPublicService } = useContext(DataContext);
    const { coordinates } = useGeolocation();
    
    const [pendingData, setPendingData] = useState<PendingServiceData | null>(null);
    
    const handleRegistrationSubmit = (data: PendingServiceData) => {
        if (!user) return;
        setPendingData(data);
        const updatedUser = { ...user, publicServiceStatus: 'pending' as const };
        setUser(updatedUser);
    };

    const handleSimulateApproval = () => {
        if (!user || !pendingData || !coordinates) {
             console.error("Missing data for approval:", {user, pendingData, coordinates});
             return;
        }
        
        // FIX: Initialize reviews as an empty array to match the PublicService type.
        const newService: PublicService = {
            id: `ps-${Date.now()}`,
            ownerId: user.id,
            name: pendingData.serviceName,
            type: pendingData.serviceType,
            coordinates: coordinates,
            address: pendingData.address,
            reviews: [],
        };
        addPublicService(newService);

        const updatedUser = { 
            ...user, 
            publicServiceStatus: 'approved' as const, 
            publicServiceId: newService.id 
        };
        setUser(updatedUser);
        setPendingData(null);
        setView({ page: 'profile' });
    };

    if (!user) return null;

    switch (user.publicServiceStatus) {
        case 'none':
            return <RegisterServiceView onRegister={handleRegistrationSubmit} />;
        case 'pending':
            return <PendingApprovalView onSimulateApproval={handleSimulateApproval} onCancel={() => setView({ page: 'profile' })} />;
        case 'approved':
            return (
                <div className="p-6 text-center">
                    <p>Anda sudah terdaftar sebagai perwakilan layanan publik.</p>
                     <button onClick={() => setView({ page: 'profile' })} className="mt-4 text-teal-500 font-semibold">Kembali ke Profil</button>
                </div>
            );
        default:
            return <div className="p-6 text-center"><p>Status tidak diketahui.</p></div>;
    }
};