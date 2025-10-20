// FIX: Removed extraneous file markers.
import { Coordinates } from '../types';

/**
 * Calculates the distance between two coordinates in meters using the Haversine formula.
 * @param coord1 - The first coordinate.
 * @param coord2 - The second coordinate.
 * @returns The distance in meters.
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371e3; // metres
    const φ1 = (coord1.latitude * Math.PI) / 180; // φ, λ in radians
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
};