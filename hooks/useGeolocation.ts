// FIX: Removed extraneous file markers.
import { useState, useEffect } from 'react';
import { GeolocationState, Coordinates } from '../types';

export const useGeolocation = (): GeolocationState => {
    const [state, setState] = useState<GeolocationState>({
        loading: true,
        coordinates: null,
        error: null,
    });

    useEffect(() => {
        const handleSuccess = (position: GeolocationPosition) => {
            setState({
                loading: false,
                coordinates: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                error: null,
            });
        };

        const handleError = (error: GeolocationPositionError) => {
            setState({
                loading: false,
                coordinates: null,
                error: error,
            });
        };

        if (!navigator.geolocation) {
            setState({
                loading: false,
                coordinates: null,
                error: {
                    code: 0,
                    message: "Geolocation is not supported by your browser",
                    PERMISSION_DENIED: 1,
                    POSITION_UNAVAILABLE: 2,
                    TIMEOUT: 3,
                },
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

        const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError);

        return () => {
            navigator.geolocation.clearWatch(watcher);
        };
    }, []);

    return state;
};