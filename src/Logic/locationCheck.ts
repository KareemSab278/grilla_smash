import { branch } from '../Helpers/branch';

type Branch = {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
};


const LOCATIONS: Branch[] = await branch.getBranches();

const MAX_RADIUS_KM = 10;

const GEOLOCATION_OPTIONS: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
}

type Coords = {
    latitude: number
    longitude: number
}

const formatLocationName = (name: string) =>
    name.at(0)?.toUpperCase() + name.slice(1).toLowerCase()

const getNearestLocation = (customerLocation: Coords) =>
    LOCATIONS.reduce((nearest, location) => {
        const locationName = location.name;
        const locationCoords = { latitude: location.latitude, longitude: location.longitude };
        const distance = getDistanceFromLatLonInKm(
            customerLocation.latitude,
            customerLocation.longitude,
            locationCoords.latitude,
            locationCoords.longitude,
        )
        if (distance < nearest.distance) {
            return { name: locationName, distance }
        }
        return nearest
    },
        { name: '', distance: Infinity },
    )

const getNearestDistance = (customerLocation: Coords) =>
    Object.values(LOCATIONS).reduce((minimum, locationCoords) => {
        const distance = getDistanceFromLatLonInKm(
            customerLocation.latitude,
            customerLocation.longitude,
            locationCoords.latitude,
            locationCoords.longitude,
        )
        return Math.min(minimum, distance)
    }, Infinity)

export const getNearestLocationAndDistance = async (): Promise<{ nearestLocation: string | false; distanceKm: number | null }> => {
    const customerLocation = await getUserLocation()
    if (!customerLocation) {
        return { nearestLocation: false, distanceKm: null }
    }

    const nearest = getNearestLocation(customerLocation)
    const distanceKm = getNearestDistance(customerLocation)

    const nearestLocation = nearest.distance <= MAX_RADIUS_KM
        ? formatLocationName(nearest.name)
        : false

    return {
        nearestLocation,
        distanceKm: Number.isFinite(distanceKm) ? distanceKm : null,
    }
}

export const findNearestLocation = async (): Promise<string | false> => {
    const { nearestLocation } = await getNearestLocationAndDistance()
    return nearestLocation
}

export const getDistanceToNearestLocationInKm = async (): Promise<number | null> => {
    const { distanceKm } = await getNearestLocationAndDistance()
    return distanceKm
}

const getUserLocation = async (): Promise<Coords | null> => {
    if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.')
        return null
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
            },
            (error) => {
                console.error('Error getting location:', error)
                resolve(null)
            },
            GEOLOCATION_OPTIONS,
        )
    })
}

// Helper function to calculate distance between two coordinates
export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
}

const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
}
