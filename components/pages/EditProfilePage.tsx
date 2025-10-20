import React, { useState, useContext, useRef } from 'react';
import { UserContext, DataContext } from '../../App';
import { View, User } from '../../types';
import { fileToDataUrl } from '../../utils/fileUtils';

interface EditProfilePageProps {
    setView: (view: View) => void;
    onboardingMode?: boolean;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ setView, onboardingMode = false }) => {
    const { user } = useContext(UserContext);
    const { updateUserProfile } = useContext(DataContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        gender: user?.gender || '',
        dateOfBirth: user?.dateOfBirth || '',
    });
    const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePictureUrl || null);
    
    if (!user) {
        setView({ page: 'home' });
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const dataUrl = await fileToDataUrl(file);
                setProfilePicPreview(dataUrl);
            } catch (error) {
                console.error("Error converting file to data URL", error);
            }
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUser: User = {
            ...user,
            ...formData,
            profilePictureUrl: profilePicPreview || user.profilePictureUrl,
            gender: formData.gender as User['gender'] || undefined,
        };
        updateUserProfile(updatedUser);

        if (onboardingMode) {
            setView({ page: 'interest-selection' });
        } else {
            setView({ page: 'profile' });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className={`p-4 border-b dark:border-gray-700 flex items-center bg-white dark:bg-gray-800 ${!onboardingMode ? 'sticky top-16' : ''} z-10`}>
                {!onboardingMode && (
                    <button onClick={() => setView({ page: 'profile' })} className="text-teal-500 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <h1 className="text-xl font-bold">{onboardingMode ? 'Lengkapi Profil Anda' : 'Edit Profil'}</h1>
            </header>
            <main className="flex-grow p-4">
                 {onboardingMode && (
                    <p className="text-center text-gray-600 dark:text-gray-300 bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg mb-6">
                        Selamat datang di Mados! Mohon lengkapi data diri Anda untuk melanjutkan.
                    </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <img 
                            src={profilePicPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D9488&color=fff&size=128`} 
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover mb-4"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleProfilePicChange}
                            className="hidden"
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-teal-600 font-semibold hover:underline">
                            Ubah Foto Profil
                        </button>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Nama Lengkap</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email Terverifikasi</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium">Nomor Handphone</label>
                        <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium">Alamat</label>
                        <textarea name="address" id="address" value={formData.address} onChange={handleChange} required rows={3} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 resize-none" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium">Jenis Kelamin</label>
                            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                                <option value="">Pilih...</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium">Tanggal Lahir</label>
                            <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                        {!onboardingMode && (
                            <button type="button" onClick={() => setView({ page: 'profile' })} className="w-full justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
                                Batal
                            </button>
                        )}
                         <button type="submit" className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
                            {onboardingMode ? 'Lanjutkan' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};
