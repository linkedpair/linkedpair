export const getFirestore = jest.fn(() => ({}));
export const setDoc = jest.fn((docRef, data) => {
  // Store the last set data for verification
  setDoc.mockData = data;
  return Promise.resolve(data);
});
export const doc = jest.fn(() => "mockdocref");
export const serverTimestamp = jest.fn();