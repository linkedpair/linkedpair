import {
    aiRomanticMatch,
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

    it("should return a match of a different gender", async () => {
        const result = await aiRomanticMatch(mockCurrentUser);
        expect(result.match.gender).toBe("Female")
    });
    it("should return a match of a different faculty", async () => {
        const result = await aiRomanticMatch(mockCurrentUser);
        expect(result.match.faculty).toBe("Arts and Social Sciences")
    });
    it("should update both users' matchedWith array", async () => {
        const result = await aiRomanticMatch(mockCurrentUser);
        expect(updateDoc).toHaveBeenCalledTimes(2);
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
            matchedWith: "user3"
        });
        expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
            matchedWith: "user1"
        });
    });
    it("should not return a match if there are no users of a different gender", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
                callback({ data: () => ({
                    uid: "user2",
                    gender: "Male",
                    faculty: "Computing",
                    matchedWith: [],
                    embedding: [0.1, 0.2, 0.4],
                })})
            },
        })
        const result = await aiRomanticMatch(mockCurrentUser);
        expect(result).toBeNull();
    });
    it("should not return a match if there are no users of a different faculty", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
                callback({ data: () => ({
                    uid: "user2",
                    gender: "Female",
                    faculty: "Business",
                    matchedWith: [],
                    embedding: [0.1, 0.2, 0.4],
                })})
            },
        })
        const result = await aiRomanticMatch(mockCurrentUser);
        expect(result).toBeNull();
    });
    it("should not return a user already matched with current user", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
            callback({ data: () => ({
                uid: "user2",
                gender: "Male",
                faculty: "Business",
                matchedWith: [mockCurrentUser.uid],
                embedding: [0.1, 0.2, 0.4],
            })});
            },
        });
        const result = await aiRomanticMatch(mockCurrentUser);
        expect(result).toBeNull();
    });
    it("should return a match with the highest similarity", async () => {
        const candidate1 = {
            uid: "user2",
            gender: "Female",
            faculty: "Computing",
            matchedWith: [],
            embedding: [0.1, 0.2, 0.4], 
        };

        const candidate2 = {
            uid: "user3",
            gender: "Female",
            faculty: "Computing",
            matchedWith: [],
            embedding: [0.1, 0.2, 0.35],
        };

        getDocs.mockResolvedValueOnce({
            forEach: (callback) => {
                callback({ data: () => candidate1 });
                callback({ data: () => candidate2 });
            },
        });

        const result = await aiRomanticMatch(mockCurrentUser);
        expect(result.match.uid).toBe("user3");
    });
    it("should return null if no users exist in the database", async () => {
        getDocs.mockResolvedValueOnce({
            forEach: () => {},
            docs: [],
        });

        const result = await aiRomanticMatch(mockCurrentUser);
        expect(result).toBeNull();
    });
})