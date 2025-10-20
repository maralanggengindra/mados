import React, { useState, useEffect } from 'react';
import { Item, ItemCategory } from '../../types';
import { fileToDataUrl } from '../../utils/fileUtils';

interface EditItemModalProps {
    item: Item;
    onSave: (updatedItem: Item) => void;
    onClose: () => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
    });
    const [imagePreview, setImagePreview] = useState<string>(item.imageUrl);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category,
        });
        setImagePreview(item.imageUrl);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const dataUrl = await fileToDataUrl(file);
                setImagePreview(dataUrl);
            } catch (error) {
                console.error("Error converting file", error);
                setFormError("Gagal memproses gambar.");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!imagePreview) {
            setFormError('Gambar produk tidak boleh kosong.');
            return;
        }

        const updatedItem: Item = {
            ...item,
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            category: formData.category as ItemCategory,
            imageUrl: imagePreview,
        };
        onSave(updatedItem);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Edit Produk</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         {formError && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{formError}</p>}
                        <div>
                            <label htmlFor="editItemName" className="block text-sm font-medium mb-1">Nama Barang/Jasa</label>
                            <input type="text" id="editItemName" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"/>
                        </div>
                        <div>
                            <label htmlFor="editDescription" className="block text-sm font-medium mb-1">Deskripsi</label>
                            <textarea id="editDescription" name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"></textarea>
                        </div>
                        <div>
                            <label htmlFor="editPrice" className="block text-sm font-medium mb-1">Harga (Rp)</label>
                            <input type="number" id="editPrice" name="price" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gambar Produk</label>
                            <div className="mt-1 flex items-center">
                                <img src={imagePreview} alt="Preview Produk" className="w-24 h-24 object-cover rounded-lg mr-4" />
                                <label htmlFor="editItemImage" className="cursor-pointer bg-white dark:bg-gray-800 py-2 px-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <span>Ganti File</span>
                                    <input id="editItemImage" name="editItemImage" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="editCategory" className="block text-sm font-medium mb-1">Kategori</label>
                            <select id="editCategory" name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                                <option value="good">Barang</option>
                                <option value="service">Jasa</option>
                            </select>
                        </div>
                        <div className="flex space-x-2 pt-2">
                             <button type="button" onClick={onClose} className="w-full justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
                                Batal
                            </button>
                            <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors">Simpan Perubahan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
