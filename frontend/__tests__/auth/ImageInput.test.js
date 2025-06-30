import ImageInput from "../../components/auth/ImageInput";

import { render, fireEvent } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../firebaseConfig"

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn()
}))

global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve('mockBlob'),
  })
);

describe("image picker test", () => {
  it("should render image picker button if no image is selected", () => {
    const { getByText } = render(
      <ImageInput 
        image={null}
        setImage={jest.fn()}
        setDownloadURL={jest.fn()}
      />
    )
      expect(getByText("Pick an image from camera roll")).toBeTruthy()
  })
})