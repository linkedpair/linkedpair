export const getFirestore = jest.fn(() => ({}));
export const setDoc = jest.fn((docRef, data) => {
  // Store the last set data for verification
  setDoc.mockData = data;
  return Promise.resolve(data);
});
export const doc = jest.fn(() => "mockdocref");
export const serverTimestamp = jest.fn();
export const collection = jest.fn(() => "mockCollection");
export const updateDoc = jest.fn(() => Promise.resolve());
export const arrayUnion = jest.fn((uid) => uid);
export const getDocs = jest.fn();