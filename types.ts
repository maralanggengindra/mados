export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    timestamp: Date;
}

export type ItemCategory = 'good' | 'service';

export interface Item {
    id: string;
    storeId: string;
    name: string;
    description: string;
    price: number;
    category: ItemCategory;
    imageUrl: string;
    reviews: Review[];
}

export interface Store {
    id: string;
    name: string;
    ownerId: string;
    coordinates: Coordinates;
    address: string;
    items: Item[];
    reviews: Review[];
}

export interface PublicService {
    id: string;
    ownerId: string;
    name: string;
    type: string;
    coordinates: Coordinates;
    address: string;
    reviews: Review[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    phoneNumber?: string;
    address?: string;
    gender?: 'Laki-laki' | 'Perempuan' | 'Lainnya';
    dateOfBirth?: string;
    interests: string[];
    sellerStatus: 'none' | 'pending' | 'approved';
    storeId?: string;
    publicServiceStatus?: 'none' | 'pending' | 'approved';
    publicServiceId?: string;
    followers: string[];
    following: string[];
    lastActive: Date;
}

export interface Promo {
    id: string;
    imageUrl: string;
    caption: string;
    storeId?: string;
}

export interface CommunityPostComment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: Date;
    imageUrl?: string;
    replies?: CommunityPostComment[];
    replyingTo?: string;
}

export interface CommunityPost {
    id: string;
    userId: string;
    userName: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    timestamp: Date;
    likes: string[];
    comments: CommunityPostComment[];
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    productContext?: Item | CommunityPost;
}

export interface ChatSession {
    id: string;
    participantIds: string[];
    messages: ChatMessage[];
}

export interface Notification {
    id: string;
    type: 'follow' | 'like' | 'comment' | 'message';
    fromUserId: string;
    fromUserName: string;
    read: boolean;
    timestamp: Date;
    targetSummary?: string;
}

export interface GeolocationState {
    loading: boolean;
    coordinates: Coordinates | null;
    error: GeolocationPositionError | {
        code: 0;
        message: string;
        PERMISSION_DENIED: 1;
        POSITION_UNAVAILABLE: 2;
        TIMEOUT: 3;
    } | null;
}

export type Page = 
    | 'home'
    | 'search'
    | 'map'
    | 'community'
    | 'profile'
    | 'seller-dashboard'
    | 'seller-registration'
    | 'public-service-registration'
    | 'chats'
    | 'notifications'
    | 'edit-profile'
    | 'interest-selection'
    | 'public-service-detail'
    | 'item-detail'
    | 'follow-list';
    
export interface View {
    page: Page;
    detailId?: string;
    searchQuery?: string;
    chatPartnerId?: string;
    listType?: 'followers' | 'following';
    chatContext?: {
        prefilledMessage?: string;
        productContext?: Item | CommunityPost;
    };
}

export interface DataContextType {
    users: User[];
    stores: Store[];
    communityPosts: CommunityPost[];
    chats: ChatSession[];
    notifications: Notification[];
    publicServices: PublicService[];
    
    // Actions
    updateUserProfile: (updatedUser: User) => void;
    updateUserInterests: (interests: string[]) => void;
    addStore: (store: Store) => void;
    addItemToStore: (storeId: string, item: Item) => void;
    addCommunityPost: (postData: Omit<CommunityPost, 'id' | 'userId' | 'userName' | 'timestamp' | 'likes' | 'comments'>) => void;
    toggleCommunityPostLike: (postId: string) => void;
    addCommentToCommunityPost: (postId: string, commentText: string, imageUrl?: string) => void;
    addReplyToComment: (postId: string, parentCommentId: string, replyText: string, replyingTo: string, imageUrl?: string) => void;
    toggleFollow: (targetUserId: string) => void;
    sendMessage: (partnerId: string, text: string, productContext?: Item | CommunityPost) => void;
    markMessagesAsRead: (partnerId: string) => void;
    markNotificationsAsRead: () => void;
    addReviewToStore: (storeId: string, review: Review) => void;
    addReviewToItem: (storeId: string, itemId: string, review: Review) => void;
    addPublicService: (service: PublicService) => void;
    addReviewToPublicService: (serviceId: string, review: Review) => void;
    deleteItemFromStore: (storeId: string, itemId: string) => void;
    updateItemInStore: (storeId: string, updatedItem: Item) => void;
}
