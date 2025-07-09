import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../config/firebaseConfig";

export default async function HandleImage() {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) return null;

    const uri = result.assets[0].uri;

    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `images/${Date.now()}-${uri.split('/').pop()}`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return { uri, downloadURL }
  } catch (error) {
    console.error("Upload error:", error);
    alert("Failed to upload image");
    return null;
  }
}