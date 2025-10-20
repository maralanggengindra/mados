import React, { useState, useContext } from 'react';
import { UserContext, DataContext } from '../../App';
import { Item, ItemCategory, Store } from '../../types';
import { fileToDataUrl } from '../../utils/fileUtils';

interface SellerDashboardProps {
    onSwitchToUser: () => void;
}

const SalesAnalytics: React.FC = () => {
    const analyticsData = {
        totalRevenue: 12540000,
        totalOrders: 182,
        bestSeller: 'Kopi Robusta Lokal',
        monthlySales: [5, 8, 12.5, 9, 11, 10] // in millions
    };

    const maxSales = Math.max(...analyticsData.monthlySales);

    return (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Analisis Penjualan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Pendapatan</p>
                    <p className="text-lg font-bold">Rp {analyticsData.totalRevenue.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Pesanan</p>
                    <p className="text-lg font-bold">{analyticsData.totalOrders}</p>
                </div>
                 <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg col-span-2 md:col-span-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Produk Terlaris</p>
                    <p className="text-lg font-bold truncate">{analyticsData.bestSeller}</p>
                </div>
            </div>
            <div>
                <h3 className="text-md font-semibold mb-2">Penjualan 6 Bulan Terakhir (Juta Rp)</h3>
                <div className="flex items-end h-32 space-x-2">
                    {analyticsData.monthlySales.map((sale, index) => (
                         <div key={index} className="flex-1 flex flex-col items-center justify-end">
                            <div 
                                className="w-full bg-teal-400 rounded-t-md"
                                style={{ height: `${(sale / maxSales) * 100}%` }}
                                title={`${sale} Juta`}
                            ></div>
                            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{index + 1}</span>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onSwitchToUser }) => {
    const { user } = useContext(UserContext);
    const { stores, addItemToStore } = useContext(DataContext);
    
    const myStore = user?.storeId ? stores.find(s => s.id === user.storeId) : undefined;
    
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<ItemCategory>('good');
    const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
    const [formError, setFormError] = useState('');

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const dataUrl = await fileToDataUrl(file);
                setItemImagePreview(dataUrl);
            } catch (error) {
                console.error("Error converting file to data URL", error);
                setFormError("Gagal memproses gambar.");
            }
        }
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!myStore) return;
        setFormError('');
        if (!itemImagePreview) {
            setFormError('Gambar produk harus diupload.');
            return;
        }

        const newItem: Item = {
            id: `item-${Date.now()}`,
            storeId: myStore.id,
            name: itemName,
            description,
            price: Number(price),
            category,
            imageUrl: itemImagePreview,
            // FIX: Initialize reviews as an empty array to match the Item type.
            reviews: []
        };
        addItemToStore(myStore.id, newItem);
        
        // Reset form
        setItemName(''); 
        setDescription(''); 
        setPrice(''); 
        setCategory('good');
        setItemImagePreview(null);
        const fileInput = document.getElementById('itemImage') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    if (!user || !myStore) {
        return (
            <div className="p-6 text-center flex-grow flex flex-col justify-center items-center">
                <p>Memuat data penjual...</p>
                <button onClick={onSwitchToUser} className="mt-4 text-teal-500 font-semibold">Kembali ke Beranda</button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800">
            <header className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-lg flex justify-between items-center sticky top-0">
                <div>
                    <h1 className="text-xl font-bold">Dashboard Penjual</h1>
                    <p className="text-sm opacity-80">{myStore.name}</p>
                </div>
                <button onClick={onSwitchToUser} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Beranda</span>
                </button>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4">
                <SalesAnalytics />

                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Tambah Barang/Jasa Baru</h2>
                    <form onSubmit={handleAddItem}>
                        {formError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{formError}</p>}
                        <div className="mb-4">
                            <label htmlFor="itemName" className="block text-sm font-medium mb-1">Nama Barang/Jasa</label>
                            <input type="text" id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium mb-1">Deskripsi</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-sm font-medium mb-1">Harga (Rp)</label>
                            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Gambar Produk</label>
                            <div className="mt-1 flex items-center">
                                {itemImagePreview ? (
                                    <img src={itemImagePreview} alt="Preview Produk" className="w-20 h-20 object-cover rounded-md mr-4" />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-md mr-4 flex items-center justify-center text-gray-400 text-xs text-center">
                                        Pratinjau Gambar
                                    </div>
                                )}
                                <label htmlFor="itemImage" className="cursor-pointer bg-white dark:bg-gray-800 py-2 px-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                    <span>Pilih File</span>
                                    <input id="itemImage" name="itemImage" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Kategori</label>
                            <select value={category} onChange={e => setCategory(e.target.value as ItemCategory)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                                <option value="good">Barang</option>
                                <option value="service">Jasa</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-600 transition-colors">Tambah ke Toko</button>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Barang & Jasa di Toko Anda</h2>
                    {myStore.items.length > 0 ? (
                        <div className="space-y-3">
                        {myStore.items.map(item => (
                             <div key={item.id} className="flex items-center bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md">
                                 <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                 <div className="flex-grow">
                                     <h3 className="font-bold">{item.name}</h3>
                                     <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.category === 'good' ? 'Barang' : 'Jasa'}</p>
                                     <p className="font-semibold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                                 </div>
                             </div>
                        ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Toko Anda belum memiliki barang atau jasa.</p>
                    )}
                </div>
            </main>
        </div>
    );
};