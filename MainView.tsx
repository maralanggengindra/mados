// FIX: Removed extraneous file markers.
import React, { useState, useContext } from 'react';
import { View } from '../types';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { Home } from './pages/Home';
import { ImageSearch } from './pages/ImageSearch';
import { MapView } from './pages/MapView';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { SellerDashboard } from './pages/SellerDashboard';
import { SellerRegistration } from './pages/SellerRegistration';
import { UserProfilePage } from './pages/UserProfilePage';
import { ChatsPage } from './pages/ChatsPage';
import { ChatView } from './pages/ChatView';
import { NotificationsPage } from './pages/NotificationsPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { PublicServiceRegistration } from './pages/PublicServiceRegistration';
import { UserContext } from '../App';
import { InterestSelectionPage } from './pages/InterestSelectionPage';
import { PublicServiceDetailPage } from './pages/PublicServiceDetailPage';
import { FollowListPage } from './pages/FollowListPage';
import { ItemDetailPage } from './pages/ItemDetailPage';


export const MainView: React.FC = () => {
    const [view, setView] = useState<View>({ page: 'home' });
    const { user } = useContext(UserContext);

    const renderPage = () => {
        // Onboarding Flow
        if (user) {
            // Step 1: Force profile completion
            if (!user.dateOfBirth || !user.gender || !user.address) {
                return <EditProfilePage setView={setView} onboardingMode={true} />;
            }
            // Step 2: Force interest selection
            if (!user.interests || user.interests.length === 0) {
                return <InterestSelectionPage setView={setView} />;
            }
        }

        // Regular Page Navigation
        if (view.page === 'home' && view.detailId) {
            return <StoreDetailPage storeId={view.detailId} setView={setView} />;
        }
        if (view.page === 'item-detail' && view.detailId) {
            return <ItemDetailPage itemId={view.detailId} setView={setView} />;
        }
        if (view.page === 'public-service-detail' && view.detailId) {
            return <PublicServiceDetailPage serviceId={view.detailId} setView={setView} />;
        }
        if (view.page === 'profile' && view.detailId) {
            return <UserProfilePage userId={view.detailId} setView={setView} />;
        }
         if (view.page === 'chats' && view.chatPartnerId) {
            return <ChatView partnerId={view.chatPartnerId} setView={setView} />;
        }
        if (view.page === 'follow-list' && view.detailId && view.listType) {
            return <FollowListPage userId={view.detailId} listType={view.listType} setView={setView} />;
        }

        switch (view.page) {
            case 'home':
                return <Home setView={setView} />;
            case 'search':
                return <ImageSearch setView={setView} initialQuery={view.searchQuery} />;
            case 'map':
                return <MapView setView={setView} />;
            case 'community':
                return <Community setView={setView} />;
            case 'profile':
                return <Profile setView={setView} />;
            case 'seller-dashboard':
                return <SellerDashboard onSwitchToUser={() => setView({ page: 'home' })} />;
            case 'seller-registration':
                return <SellerRegistration setView={setView} />;
            case 'public-service-registration':
                return <PublicServiceRegistration setView={setView} />;
            case 'chats':
                return <ChatsPage setView={setView} />;
            case 'notifications':
                return <NotificationsPage setView={setView} />;
            case 'edit-profile':
                return <EditProfilePage setView={setView} />;
            case 'interest-selection':
                 return <InterestSelectionPage setView={setView} />;
            default:
                return <Home setView={setView} />;
        }
    };

    const is_onboarding = user && (!user.dateOfBirth || !user.gender || !user.address || !user.interests || user.interests.length === 0);

    const showTopNav = !is_onboarding;
    const showBottomNav = !is_onboarding && !['seller-dashboard', 'edit-profile', 'public-service-registration', 'public-service-detail', 'follow-list', 'item-detail'].includes(view.page) && !view.chatPartnerId;
    
    // Adjust padding if top/bottom navs are hidden
    const mainClass = `flex-grow overflow-y-auto ${showTopNav ? 'pt-16' : ''} ${showBottomNav ? 'pb-16' : ''}`;


    return (
        <div className="h-screen flex flex-col">
            {showTopNav && <TopNav view={view} setView={setView} />}
            <main className={mainClass}>
                {renderPage()}
            </main>
            {showBottomNav && <BottomNav activePage={view.page} setView={setView} />}
        </div>
    );
};