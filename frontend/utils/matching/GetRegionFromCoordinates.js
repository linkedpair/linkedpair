import * as Location from 'expo-location';

const GetRegionFromCoordinates = async (location, setCity) => {
  try {
    const { latitude, longitude } = location;
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (results.length > 0) {
      const place = results[0];
      setCity(place.city || place.region || place.country || "Unknown")
    }
  } catch (error) {
    alert(error);
  }
}

export default GetRegionFromCoordinates