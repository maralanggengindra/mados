import React, { useState, useContext } from 'react';
import { UserContext, DataContext } from '../../App';
import { Item, ItemCategory, Store } from '../../types';
import { fileToDataUrl } from '../../utils/fileUtils';
import { EditItemModal } from '../common/EditItemModal';

type SellerTab = 'analytics' | 'add' | 'catalog';

const SalesAnalytics: React.FC = () => {
    // ... (content remains the same)
    const analyticsData = {
        totalRevenue: 12540000,
        totalOrders: 182,
        bestSeller: 'Kopi Robusta Lokal',
        monthlySales: [5, 8, 12.5, 9, 11, 10] // in millions
    };
    const maxSales = Math.max(...analyticsData.monthlySales, 1);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    return (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Analisis Penjualan</h2>
            <div className="space-y-6 mb-8">
                <div className="bg-gray-100 dark:bg-gray-600 p-6 rounded-lg">
                    <p className="text-md text-gray-600 dark:text-gray-400">Total Pendapatan</p>
                    <p className="text-3xl font-bold mt-1">Rp {analyticsData.totalRevenue.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-600 p-6 rounded-lg">
                    <p className="text-md text-gray-600 dark:text-gray-400">Total Pesanan</p>
                    <p className="text-3xl font-bold mt-1">{analyticsData.totalOrders}</p>
                </div>
                 <div className="bg-gray-100 dark:bg-gray-600 p-6 rounded-lg">
                    <p className="text-md text-gray-600 dark:text-gray-400">Produk Terlaris</p>
                    <p className="text-3xl font-bold mt-1 truncate">{analyticsData.bestSeller}</p>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-4">Penjualan 6 Bulan Terakhir (Juta Rp)</h3>
                <div className="flex items-end h-40 space-x-4">
                    {analyticsData.monthlySales.map((sale, index) => (
                         <div key={index} className="flex-1 flex flex-col items-center justify-end">
                            <div 
                                className="w-full bg-teal-400 rounded-t-lg transition-colors hover:bg-teal-500"
                                style={{ height: `${(sale / maxSales) * 100}%` }}
                                title={`${months[index]}: ${sale} Juta`}
                            ></div>
                            <span className="text-sm mt-2 text-gray-500 dark:text-gray-400">{months[index]}</span>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AddItemForm: React.FC<{ store: Store, onAddItem: (storeId: string, item: Item) => void, onSwitchTab: (tab: SellerTab) => void }> = ({ store, onAddItem, onSwitchTab }) => {
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
                setFormError("Gagal memproses gambar.");
            }
        }
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!itemImagePreview) {
            setFormError('Gambar produk harus diupload.');
            return;
        }

        const newItem: Item = {
            id: `item-${Date.now()}`,
            storeId: store.id,
            name: itemName, description, price: Number(price),
            category, imageUrl: itemImagePreview, reviews: []
        };
        onAddItem(store.id, newItem);
        
        setItemName(''); setDescription(''); setPrice(''); setCategory('good'); setItemImagePreview(null);
        const fileInput = document.getElementById('itemImage') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
        onSwitchTab('catalog');
    };

    return (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Tambah Barang/Jasa Baru</h2>
            <form onSubmit={handleAddItem} className="space-y-5">
                 {formError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{formError}</p>}
                 {/* Form fields remain the same */}
                 <div>
                    <label htmlFor="itemName" className="block text-sm font-medium mb-1">Nama Barang/Jasa</label>
                    <input type="text" id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Deskripsi</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"></textarea>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium mb-1">Harga (Rp)</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"/>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Gambar Produk</label>
                    <div className="mt-1 flex items-center">
                        {itemImagePreview ? (
                            <img src={itemImagePreview} alt="Preview Produk" className="w-32 h-32 object-cover rounded-lg mr-4" />
                        ) : (
                            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-lg mr-4 flex items-center justify-center text-gray-400 text-sm text-center">
                                Pratinjau Gambar
                            </div>
                        )}
                        <label htmlFor="itemImage" className="cursor-pointer bg-white dark:bg-gray-800 py-2 px-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                            <span>Pilih File</span>
                            <input id="itemImage" name="itemImage" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <select value={category} onChange={e => setCategory(e.target.value as ItemCategory)} className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                        <option value="good">Barang</option>
                        <option value="service">Jasa</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-teal-500 text-white font-bold text-lg py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors">Tambah ke Toko</button>
            </form>
        </div>
    );
};

const CatalogView: React.FC<{ store: Store, onEdit: (item: Item) => void, onDelete: (itemId: string) => void }> = ({ store, onEdit, onDelete }) => (
    <div>
        <h2 className="text-3xl font-bold mb-6">Katalog Toko Anda</h2>
        {store.items.length > 0 ? (
            <div className="space-y-4">
            {store.items.map(item => (
                 <div key={item.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-start space-x-4">
                     <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                     <div className="flex-grow">
                         <h3 className="font-bold text-xl">{item.name}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.category === 'good' ? 'Barang' : 'Jasa'}</p>
                         <p className="font-bold text-lg mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                     </div>
                     <div className="flex flex-col space-y-2 flex-shrink-0">
                        <button onClick={() => onEdit(item)} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={() => onDelete(item.id)} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                        </button>
                     </div>
                 </div>
            ))}
            </div>
        ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <p>Toko Anda belum memiliki barang atau jasa.</p>
                <p className="text-sm">Gunakan tab 'Tambah Produk' untuk memulai.</p>
            </div>
        )}
    </div>
);

const SellerBottomNav: React.FC<{ activeTab: SellerTab, setActiveTab: (tab: SellerTab) => void }> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'analytics', label: 'Analisis', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
        { id: 'add', label: 'Tambah', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { id: 'catalog', label: 'Katalog', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
    ];
    return (
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id as SellerTab)} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${activeTab === item.id ? 'text-teal-500' : 'text-gray-500 dark:text-gray-400 hover:text-teal-500'}`}>
                        {item.icon}
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export const SellerDashboard: React.FC<{ onSwitchToUser: () => void }> = ({ onSwitchToUser }) => {
    const { user } = useContext(UserContext);
    const { stores, addItemToStore, deleteItemFromStore, updateItemInStore } = useContext(DataContext);
    const myStore = user?.storeId ? stores.find(s => s.id === user.storeId) : undefined;
    
    const [activeTab, setActiveTab] = useState<SellerTab>('analytics');
    const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

    const handleDeleteItem = (itemId: string) => {
        if (myStore && window.confirm('Anda yakin ingin menghapus produk ini?')) {
            deleteItemFromStore(myStore.id, itemId);
        }
    };

    const handleUpdateItem = (updatedItem: Item) => {
        if (myStore) {
            updateItemInStore(myStore.id, updatedItem);
            setItemToEdit(null); // Close modal
        }
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
            <header className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-lg flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Penjual</h1>
                    <p className="text-sm opacity-80">{myStore.name}</p>
                </div>
                <button onClick={onSwitchToUser} className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                    <span>Beranda</span>
                </button>
            </header>
            
            <main className="flex-grow overflow-y-auto p-6 pb-20">
                {activeTab === 'analytics' && <SalesAnalytics />}
                {activeTab === 'add' && <AddItemForm store={myStore} onAddItem={addItemToStore} onSwitchTab={setActiveTab} />}
                {activeTab === 'catalog' && <CatalogView store={myStore} onEdit={setItemToEdit} onDelete={handleDeleteItem} />}
            </main>
            
            {itemToEdit && (
                <EditItemModal 
                    item={itemToEdit}
                    onSave={handleUpdateItem}
                    onClose={() => setItemToEdit(null)}
                />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 max-w-md mx-auto">
                <SellerBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    );
};
