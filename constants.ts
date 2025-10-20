// FIX: Removed extraneous file markers.
import { User, Store, Promo, CommunityPost, ChatSession, Notification, Item } from './types';

const USER_1: User = { 
    id: 'user-1', 
    name: 'Budi Santoso', 
    email: 'budi.s@example.com', 
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200',
    phoneNumber: '081234567890',
    address: 'Jl. Jenderal Sudirman No. 12, Jakarta Pusat, DKI Jakarta',
    gender: 'Laki-laki',
    dateOfBirth: '1990-05-15',
    interests: ['Kuliner', 'Elektronik', 'Olahraga'],
    sellerStatus: 'approved', 
    storeId: 'store-1', 
    followers: ['user-2'], 
    following: ['user-2', 'user-3'], 
    lastActive: new Date(Date.now() - 1000 * 60 * 5) 
};
const USER_2: User = { 
    id: 'user-2', 
    name: 'Citra Lestari', 
    email: 'citra.l@example.com', 
    profilePictureUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=200',
    phoneNumber: '082345678901',
    address: 'Jl. Asia Afrika No. 8, Bandung, Jawa Barat',
    gender: 'Perempuan',
    dateOfBirth: '1995-11-20',
    interests: ['Fashion', 'Buku & Hobi'],
    sellerStatus: 'none', 
    followers: ['user-1', 'user-3'], 
    following: ['user-1'], 
    lastActive: new Date(Date.now() - 1000 * 60 * 65) 
};
const USER_3: User = { 
    id: 'user-3', 
    name: 'Agus Wijaya', 
    email: 'agus.w@example.com',
    interests: [],
    sellerStatus: 'approved', 
    storeId: 'store-2', 
    followers: ['user-1'], 
    following: [], 
    lastActive: new Date(Date.now() - 1000 * 3600 * 25) 
};


export const MOCK_USERS: User[] = [USER_1, USER_2, USER_3];

const STORE_1_ITEMS: Item[] = [
    { id: 'item-1', storeId: 'store-1', name: 'Kopi Robusta Lokal', description: 'Biji kopi robusta asli dari petani lokal, diroasting dengan sempurna.', price: 55000, category: 'good', imageUrl: 'https://images.unsplash.com/photo-1511920183353-3c2c58a0a6a3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', reviews: [] },
    { id: 'item-2', storeId: 'store-1', name: 'Jasa Seduh V60', description: 'Nikmati kopi seduhan manual V60 oleh barista berpengalaman kami.', price: 25000, category: 'service', imageUrl: 'https://images.unsplash.com/photo-1559305469-7de4a4701986?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', reviews: [] },
];

const STORE_2_ITEMS: Item[] = [
    { id: 'item-3', storeId: 'store-2', name: 'Nasi Goreng Spesial', description: 'Nasi goreng legendaris dengan bumbu rahasia dan topping melimpah.', price: 35000, category: 'good', imageUrl: 'https://images.unsplash.com/photo-1607318491242-841f357b98a3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', reviews: [] },
];

export const MOCK_STORES: Store[] = [
    { id: 'store-1', name: "Kopi'in Aja", ownerId: 'user-1', coordinates: { latitude: -6.2088, longitude: 106.8456 }, address: 'Jl. Merdeka No. 10, Jakarta Pusat', items: STORE_1_ITEMS, reviews: [
        { id: 'rev-1', userId: 'user-2', userName: 'Citra Lestari', rating: 5, comment: 'Kopinya mantap, baristanya ramah!', timestamp: new Date() }
    ]},
    { id: 'store-2', name: 'Warung Makan Pak Agus', ownerId: 'user-3', coordinates: { latitude: -7.2575, longitude: 112.7521 }, address: 'Jl. Pahlawan No. 5, Surabaya', items: STORE_2_ITEMS, reviews: []},
];

export const MOCK_PROMOS: Promo[] = [
    { id: 'promo-1', imageUrl: 'https://images.unsplash.com/photo-1551024709-8f237c2045e5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', caption: "Diskon Kopi Spesial", storeId: 'store-1' },
    { id: 'promo-2', imageUrl: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200', caption: "Promo Makan Hemat", storeId: 'store-2' },
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
    { 
        id: 'cp-1', userId: 'user-2', userName: 'Citra Lestari', title: 'Dijual: Headphone Gaming Bekas',
        description: 'Jual headphone gaming merk Rexus, kondisi 90% mulus, jarang dipakai. Suara masih jernih. COD sekitaran Bandung.',
        price: 250000, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
        timestamp: new Date(Date.now() - 1000 * 3600 * 2),
        likes: ['user-1', 'user-3'],
        comments: [
            { id: 'cmt-1', userId: 'user-1', userName: 'Budi Santoso', text: 'Masih ada barangnya?', timestamp: new Date(Date.now() - 1000 * 3600 * 1) }
        ]
    }
];

export const MOCK_CHATS: ChatSession[] = [
    {
        id: 'chat-1',
        participantIds: ['user-1', 'user-2'],
        messages: [
            { id: 'msg-1', senderId: 'user-2', text: 'Halo, selamat datang di toko kami!', timestamp: new Date(Date.now() - 1000 * 60 * 10), status: 'read' },
            { id: 'msg-2', senderId: 'user-1', text: 'Halo, mau tanya soal kopi robusta', timestamp: new Date(Date.now() - 1000 * 60 * 9), status: 'read' },
            { id: 'msg-3', senderId: 'user-2', text: 'Iya, ada yang bisa dibantu?', timestamp: new Date(Date.now() - 1000 * 60 * 8), status: 'sent' },
        ]
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif-1', type: 'follow', fromUserId: 'user-2', fromUserName: 'Citra Lestari', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 3) },
    { id: 'notif-2', type: 'like', fromUserId: 'user-3', fromUserName: 'Agus Wijaya', targetSummary: 'Dijual: Headphone Gaming Bekas', read: true, timestamp: new Date(Date.now() - 1000 * 3600 * 4) },
    { id: 'notif-3', type: 'comment', fromUserId: 'user-1', fromUserName: 'Budi Santoso', targetSummary: 'Dijual: Headphone Gaming Bekas', read: false, timestamp: new Date(Date.now() - 1000 * 3600 * 1) }
];