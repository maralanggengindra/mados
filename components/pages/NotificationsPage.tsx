import React, { useContext, useEffect } from 'react';
import { DataContext, UserContext } from '../../App';
import { View } from '../../types';

interface NotificationsPageProps {
    setView: (view: View) => void;
}

const FollowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a3 3 0 100-6 3 3 0 000 6zM16 13a5 5 0 015 5h-2a3 3 0 00-3-3v-2z" />
  </svg>
);

const LikeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
);

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ setView }) => {
    const { notifications, markNotificationsAsRead } = useContext(DataContext);
    const { user } = useContext(UserContext);

    useEffect(() => {
        // Mark notifications as read when the component mounts
        markNotificationsAsRead();
    }, []);

    const getNotificationMessage = (notif: typeof notifications[0]) => {
        switch (notif.type) {
            case 'follow':
                return <><strong>{notif.fromUserName}</strong> mulai mengikuti Anda.</>;
            case 'like':
                return <><strong>{notif.fromUserName}</strong> menyukai postingan Anda: "{notif.targetSummary}".</>;
            case 'comment':
                 return <><strong>{notif.fromUserName}</strong> mengomentari postingan Anda: "{notif.targetSummary}".</>;
            case 'message':
                return <><strong>{notif.fromUserName}</strong> mengirimi Anda pesan baru.</>;
            default:
                return 'Notifikasi baru.';
        }
    };
    
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'follow': return <FollowIcon />;
            case 'like': return <LikeIcon />;
            case 'comment': return <CommentIcon />;
            default: return <div className="w-6 h-6 bg-gray-400 rounded-full" />;
        }
    }

    const handleNotificationClick = (notif: typeof notifications[0]) => {
        switch (notif.type) {
            case 'follow':
                setView({ page: 'profile', detailId: notif.fromUserId });
                break;
            case 'like':
            case 'comment':
                // In a real app, you'd navigate to the post detail view.
                // For now, we just go to the community page.
                setView({ page: 'community' }); 
                break;
             case 'message':
                setView({ page: 'chats', chatPartnerId: notif.fromUserId });
                break;
        }
    };


    if (!user) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b dark:border-gray-700">
                <h1 className="text-2xl font-bold">Notifikasi</h1>
            </div>
            <div className="flex-grow overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`flex items-start p-4 border-b dark:border-gray-700 cursor-pointer transition-colors ${!notif.read ? 'bg-teal-50 dark:bg-teal-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <div className="mr-4 mt-1">{getNotificationIcon(notif.type)}</div>
                            <div className="flex-grow">
                                <p className="text-gray-800 dark:text-gray-200">{getNotificationMessage(notif)}</p>
                                <p className="text-xs text-gray-500 mt-1">{notif.timestamp.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-10 text-gray-500">
                        <p>Tidak ada notifikasi baru.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
