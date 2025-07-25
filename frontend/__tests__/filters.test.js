import { filterUsersSmart } from "../utils/matching/MatchingAlgorithms"
import { getDocs } from "firebase/firestore";

const mockUsers = [
  {
    uid: "1",
    gender: "Male",
    faculty: "Computing",
    yearOfStudy: 2,
    dateOfBirth: "2001-01-01",
    zodiac: "Capricorn",
    stayOnCampus: true,
    hobbiesArray: ["coding", "gaming"],
    coursesArray: ["cs1010s", "cs2030s"],
  },
  {
    uid: "2",
    gender: "Female",
    faculty: "Business",
    yearOfStudy: 1,
    dateOfBirth: "2003-01-01",
    zodiac: "Aquarius",
    stayOnCampus: false,
    hobbiesArray: ["reading"],
    coursesArray: ["st2131"],
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

describe("filters test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("filters by gender", async () => {
        const result = await filterUsersSmart({ gender: "Female" });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("2");
    });

    it("filters by faculty", async () => {
        const result = await filterUsersSmart({ faculty: "Computing" });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("1");
    });

    it("filters by yearOfStudy", async () => {
        const result = await filterUsersSmart({ yearOfStudy: 1 });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("2");
    });

    it("filters by minAge", async () => {
        const result = await filterUsersSmart({ minAge: 23 });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("1"); 
    });

    it("filters by maxAge", async () => {
        const result = await filterUsersSmart({ maxAge: 23 });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("2"); 
    });

    it("filters by zodiac", async () => {
        const result = await filterUsersSmart({ zodiac: "Aquarius" });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("2");
    });

    it("filters by stayOnCampus", async () => {
        const result = await filterUsersSmart({ stayOnCampus: true });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("1");
    });

    it("filters by hobbies", async () => {
        const result = await filterUsersSmart({ hobbies: ["gaming"] });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("1");
    });

    it("filters by courses", async () => {
        const result = await filterUsersSmart({ courses: ["st2131"] });
        expect(result).toHaveLength(1);
        expect(result[0].uid).toBe("2");
    });

    it("returns both users if no filters are passed", async () => {
        const result = await filterUsersSmart();
        expect(result).toHaveLength(2);
    });
});
