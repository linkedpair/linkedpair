export const requestForegroundPermissionsAsync = jest.fn(() =>
  Promise.resolve({ status: "granted" })
);

export const getCurrentPositionAsync = jest.fn(() =>
  Promise.resolve({
    coords: {
      latitude: 12.34,
      longitude: 56.78,
    },
  })
);

export const Accuracy = {
  Highest: 3,
};