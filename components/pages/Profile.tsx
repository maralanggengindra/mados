import React, { useContext } from 'react';
import { UserContext, DataContext } from '../../App';
import { View } from '../../types';

interface ProfileProps {
    setView: (view: View) => void;
}

// FIX: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const ProfileInfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-4 py-3">
        <div className="text-gray-400 mt-1">{icon}</div>
        <div className="flex-grow">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold">{value || 'Belum diatur'}</p>
        </div>
    </div>
);

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const AddressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const GenderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const BirthdayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;

export const Profile: React.FC<ProfileProps> = ({ setView }) => {
    const { user, setUser } = useContext(UserContext);
    const { users } = useContext(DataContext);
    
    const currentUserData = users.find(u => u.id === user?.id);

    if (!user || !currentUserData) {
        return <div className="p-4 text-center">Memuat profil...</div>;
    }

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="pb-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-b-lg shadow-md">
                <div className="flex flex-col items-center text-center mb-4">
                    <img 
                        src={currentUserData.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserData.name)}&background=0D9488&color=fff&size=128`} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-teal-500" 
                    />
                    <h2 className="text-2xl font-bold">{currentUserData.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{currentUserData.email}</p>
                </div>
                <div className="flex justify-around text-center border-y py-4 dark:border-gray-700 mb-6">
                    <button onClick={() => setView({ page: 'follow-list', detailId: currentUserData.id, listType: 'followers' })} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg">
                        <p className="font-bold text-lg">{currentUserData.followers.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pengikut</p>
                    </button>
                    <button onClick={() => setView({ page: 'follow-list', detailId: currentUserData.id, listType: 'following' })} className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg">
                        <p className="font-bold text-lg">{currentUserData.following.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Mengikuti</p>
                    </button>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => setView({ page: 'edit-profile' })}
                        className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                        Edit Profil
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Keluar
                    </button>
                </div>
            </div>

            <div className="p-4 mt-4">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Detail Pribadi</h3>
                    <div className="divide-y dark:divide-gray-700">
                        <ProfileInfoRow icon={<PhoneIcon />} label="Nomor Handphone" value={currentUserData.phoneNumber} />
                        <ProfileInfoRow icon={<AddressIcon />} label="Alamat" value={currentUserData.address} />
                        <ProfileInfoRow icon={<GenderIcon />} label="Jenis Kelamin" value={currentUserData.gender} />
                        <ProfileInfoRow icon={<BirthdayIcon />} label="Tanggal Lahir" value={currentUserData.dateOfBirth ? new Date(currentUserData.dateOfBirth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'}) : undefined} />
                    </div>
                 </div>
            </div>

             <div className="p-4 mt-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Kemitraan</h3>
                    <div className="space-y-4">
                        {/* Seller Partnership */}
                        <div>
                            <h4 className="font-medium mb-2">Mitra Toko</h4>
                            {user.sellerStatus === 'approved' && (
                                <button onClick={() => setView({ page: 'seller-dashboard' })} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">Buka Dashboard Penjual</button>
                            )}
                            {user.sellerStatus === 'pending' && (
                                <button disabled className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed">Pendaftaran Toko Ditinjau</button>
                            )}
                            {(user.sellerStatus === 'none' || !user.sellerStatus) && (
                                <button onClick={() => setView({ page: 'seller-registration' })} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Daftar Jadi Mitra Toko</button>
                            )}
                        </div>
                        
                        {/* Public Service Partnership */}
                        <div>
                             <h4 className="font-medium mb-2">Mitra Layanan Publik</h4>
                             {(user.publicServiceStatus === 'approved' && user.publicServiceId) ? (
                                <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md">
                                    <p className="font-semibold">Layanan Publik Terdaftar</p>
                                    <button onClick={() => setView({ page: 'public-service-detail', detailId: user.publicServiceId })} className="text-sm text-green-700 dark:text-green-400 hover:underline font-bold">Lihat Detail</button>
                                </div>
                             ) : user.publicServiceStatus === 'pending' ? (
                                <button disabled className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed">Pendaftaran Ditinjau</button>
                             ) : (
                                <button onClick={() => setView({ page: 'public-service-registration' })} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Daftar Layanan Publik</button>
                             )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};