import {
    geolocationMatch,
} from "../utils/matching/MatchingAlgorithms"

import {
  getDocs,
  updateDoc
} from "firebase/firestore";

const mockCurrentUser = {
  uid: "user1",
  gender: "Male",
  faculty: "Business",
  matchedWith: [],
  embedding: [0.1, 0.2, 0.3],
  location: { latitude: 1.3, longitude: 103.8 },
};

const mockUsers = [
  {
    uid: "user2",
    gender: "Male",
    faculty: "Business",
    matchedWith: [],
    embedding: [0.1, 0.2, 0.4],
    location: { latitude: 10.22, longitude: 103.81 },
  },
  {
    uid: "user3",
    gender: "Female",
    faculty: "Arts and Social Sciences",
    matchedWith: [],
    embedding: [0.5, 0.5, 0.5],
    location: { latitude: 1.305, longitude: 103.81 },
  },
];

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

getDocs.mockResolvedValue({
  forEach: (callback) => mockUsers.forEach((user) => callback({ data: () => user })),
  docs: mockUsers.map((user, index) => ({
    id: `doc${index}`,
    data: () => user,
  })),
});

describe("aiRomanticMatch Algorithm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a match of a user within 5km distance", async () => {
        const result = await geolocationMatch(mockCurrentUser);
        expect(result.uid).toBe("user3");
    });
    it("should update both users' matchedWith array", async () => {
        const result = await geolocationMatch(mockCurrentUser);
        expect(updateDoc).toHaveBeenCalledTimes(2);
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
            matchedWith: "user3"
        });
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
            matchedWith: "user1"
        });
    });
    it("should not return a match if there are no users within 5km distance of each other", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
                callback({ data: () => ({
                    uid: "user2",
                    gender: "Male",
                    faculty: "Computing",
                    matchedWith: [],
                    embedding: [0.1, 0.2, 0.4],
                    location: { latitude: 10.22, longitude: 103.81 },
                })})
            },
        })
        const result = await geolocationMatch(mockCurrentUser);
        expect(result).toBeNull();
    });
    it("should not return a user already matched with current user", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
                callback({ data: () => ({
                    uid: "user3",
                    gender: "Female",
                    faculty: "Arts and Social Sciences",
                    matchedWith: [mockCurrentUser.uid],
                    embedding: [0.5, 0.5, 0.5],
                    location: { latitude: 1.305, longitude: 103.81 },
                })});
            },
        });
        const result = await geolocationMatch(mockCurrentUser);
        expect(result).toBeNull();
    });
    it("should return the closest user among eligible users", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
                callback({ data: () => ({
                    uid: "user2",
                    gender: "Male",
                    faculty: "Computing",
                    matchedWith: [],
                    embedding: [0.1, 0.2, 0.4],
                    location: { latitude: 1.305, longitude: 103.81 },
                })}),
                callback({ data: () => ({
                    uid: "user3",
                    gender: "Male",
                    faculty: "Computing",
                    matchedWith: [],
                    embedding: [0.1, 0.2, 0.4],
                    location: { latitude: 1.350, longitude: 103.81 },
                })})
            },
        })
        const result = await geolocationMatch(mockCurrentUser);
        expect(result.uid).toBe("user2");
    });
    it("should ignore users without a location field", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
                callback({ data: () => ({
                    uid: "user6",
                    gender: "Female",
                    faculty: "Science",
                    matchedWith: [],
                    embedding: [0.1, 0.2, 0.4],
                })});
            },
        });

        const result = await geolocationMatch(mockCurrentUser);
        expect(result).toBeNull();
    });
    it("should return null if no users exist in the database", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: () => {},
            docs: [],
        });

        const result = await geolocationMatch(mockCurrentUser);
        expect(result).toBeNull();
    });
})