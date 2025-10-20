import React from 'react';
import { Item, View } from '../../types';

interface ItemCardProps {
    item: Item;
    storeName: string;
    setView: (view: View) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, storeName, setView }) => (
    <button 
        onClick={() => setView({ page: 'item-detail', detailId: item.id })}
        className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden text-left w-full h-full flex flex-col hover:shadow-xl transition-shadow"
    >
        <div className="relative w-full h-32">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-3 flex flex-col flex-grow">
            <h4 className="font-semibold text-md truncate">{item.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{storeName}</p>
            <p className="text-teal-500 font-bold mt-auto pt-2">Rp {item.price.toLocaleString('id-ID')}</p>
        </div>
    </button>
);
