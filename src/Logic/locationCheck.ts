// this will get the user's location and check if it's within the delivery area

const LOCATIONS = {
    'WALSALL': { lat: 52.58538423585385, lng: -1.9832210521368572 },
    'BIRMINGHAM': { lat: 52.486243, lng: -1.890401 },
    'LONDON': { lat: 51.5074, lng: -0.1278 },
    'MANCHESTER': { lat: 53.4808, lng: -2.2426 },
}

export const findNearestLocation = async (): Promise<string | false> => {
    const customerLocation = await getUserLocation() as { lat: number, lng: number } | null
    if (!customerLocation) return false

    const nearestLocation = Object.entries(LOCATIONS).reduce((nearest, [locationName, locationCoords]) => {
        const distance = getDistanceFromLatLonInKm(
            customerLocation.lat,
            customerLocation.lng,
            locationCoords.lat,
            locationCoords.lng
        )
        if (distance < nearest.distance) {
            return { name: locationName, distance }
        }
        return nearest
    }, { name: '', distance: Infinity })


    // Check if the nearest location is within 10 km
    if (nearestLocation.distance <= 10) {
        const found = nearestLocation.name.at(0)?.toUpperCase() + nearestLocation.name.slice(1).toLowerCase()
        console.log(`Nearest location: ${found}, Distance: ${nearestLocation.distance.toFixed(2)} km`)
        return found

    } else {
        return false
    }
}


const getUserLocation = async (): Promise<{ lat: number, lng: number } | null> => {
    if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.')
        return null
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({ lat: position.coords.latitude, lng: position.coords.longitude })
            },
            (error) => {
                console.error('Error getting location:', error)
                resolve(null)
            }
        )
    })
}

// Helper function to calculate distance between two coordinates
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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