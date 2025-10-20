import React, { useState, useContext } from 'react';
import { DataContext } from '../../App';
import { View } from '../../types';

interface InterestSelectionPageProps {
    setView: (view: View) => void;
}

const INTEREST_CATEGORIES = [
    'Kuliner', 'Fashion', 'Elektronik', 'Kecantikan', 'Perabotan', 
    'Buku & Hobi', 'Olahraga', 'Otomotif', 'Kesehatan', 'Jasa'
];

export const InterestSelectionPage: React.FC<InterestSelectionPageProps> = ({ setView }) => {
    const { updateUserInterests } = useContext(DataContext);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev => 
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleSubmit = () => {
        updateUserInterests(selectedInterests);
        setView({ page: 'home' });
    };

    return (
        <div className="flex flex-col h-full p-6">
            <header className="text-center mb-8">
                <h1 className="text-2xl font-bold">Pilih Minat Anda</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Pilih beberapa kategori yang Anda sukai untuk membantu kami merekomendasikan produk yang tepat untuk Anda.</p>
            </header>
            
            <main className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {INTEREST_CATEGORIES.map(interest => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                             <button
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                className={`p-4 rounded-lg text-center font-semibold border-2 transition-all duration-200
                                    ${isSelected 
                                        ? 'bg-teal-500 text-white border-teal-500 shadow-lg scale-105'
                                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-teal-400 hover:text-teal-500'
                                    }`
                                }
                            >
                                {interest}
                            </button>
                        );
                    })}
                </div>
            </main>
            
            <footer className="mt-8">
                <button 
                    onClick={handleSubmit}
                    disabled={selectedInterests.length === 0}
                    className="w-full justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Selesai
                </button>
            </footer>
        </div>
    );
};