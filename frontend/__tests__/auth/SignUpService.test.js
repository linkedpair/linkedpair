import SignUpService from "../../services/SignUpService";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { generateEmbeddingFromProfile } from "../../utils/openai";

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

jest.mock("../../firebaseConfig", () => ({
  auth: "mockAuthObject",
}));
jest.mock('../../utils/openai', () => ({
    generateEmbeddingFromProfile: jest.fn(() => Promise.resolve([0.1, 0.2, 0.3]))
}));

const maleUserData = {
    firstName: "Shanda",
    lastName: "Lear",
    email: "test1@gmail.com",
    password: "password",
    male: true,
    username: "chandelier",
    major: "Computer Science",
    image: "img.png",
    date: new Date("2000-01-01"),
    profileDescription: "funny and smart",
    traits: "fun, smart",
    location: {lat: "1.23", long: "4.56"},
    downloadURL: "http://image.url",
};

const femaleUserData = {
    firstName: "Shanda",
    lastName: "Lear",
    email: "test1@gmail.com",
    password: "password",
    male: false,
    username: "chandelier",
    major: "Computer Science",
    image: "img.png",
    date: new Date("2000-01-01"),
    profileDescription: "funny and smart",
    traits: "fun, smart",
    location: {lat: "1.23", long: "4.56"},
    downloadURL: "http://image.url",
}

describe("sign up service", () => {
    it("should call createUserWithEmailAndPassword", async () => {
        const user = await SignUpService({
            email: "test1@gmail.com",
            password: "password"
        });
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(), 
            "test1@gmail.com",
            "password"
        )});
    it("should return correct user email", async () => {
        const user = await SignUpService({
            email: "test1@gmail.com",
            password: "password"
        });
        expect(user.email).toBe("test1@gmail.com")
    });
    it("should return correct user password", async () => {
        const user = await SignUpService({
            email: "test1@gmail.com",
            password: "password"
        });
        expect(user.password).toBe("password")
    });
    it("should call setDoc", async () => {
        const user = await SignUpService({
            firstName: "Shanda",
            lastName: "Lear",
        });
        expect(setDoc).toHaveBeenCalled();
    })
    it("embedding is called", async () => {
        const result = await generateEmbeddingFromProfile("test");
        expect(result).toEqual([0.1, 0.2, 0.3]);
    });
    it("embedding is called with correct traits", async () => {
        await SignUpService(maleUserData);
        expect(generateEmbeddingFromProfile).toHaveBeenLastCalledWith(
            expect.stringContaining("traits: fun, smart")
        );
    });
    it("should call setDoc with correct inputs which match what was keyed in by user", async () => {
        await SignUpService(maleUserData);
        expect(setDoc).toHaveBeenLastCalledWith("mockdocref", expect.objectContaining({
            firstName: "Shanda",
            lastName: "Lear",
            email: "test1@gmail.com",
            gender: "Male",
            username: "chandelier",
            major: "Computer Science",
            image: "img.png",
            dateOfBirth: expect.stringContaining("2000-01-01"),
            profileDescription: "funny and smart",
            traits: "fun, smart",
            embedding: expect.anything(),
            location: {lat: "1.23", long: "4.56"},
            downloadURL: "http://image.url",
        }))
    });
    it("should return the correct user object", async () => {
        const user = await SignUpService(maleUserData);
        expect(user).toEqual({ uid: "abc123", email: "test1@gmail.com", password: "password" })
    });
    it("should call serverTimestamp correctly", async () => {
        await SignUpService(maleUserData);
        expect(serverTimestamp).toHaveBeenCalled();
    });
    it("should call doc with correct arguments", async () => {
        await SignUpService(maleUserData);
        expect(doc).toHaveBeenCalledWith(db, "users", "abc123");
    });
    describe("test of gender field", () => {
        it("should set gender to male if male field is true", async () => {
            await SignUpService(maleUserData);
            expect(setDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ gender: "Male" })
            );
        });
        it("should set gender to female if male field is false", async () => {
            await SignUpService(femaleUserData);
            expect(setDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ gender: "Female" })
            );
        });
    })
    it("should gracefully return error if createUserWithEmailAndPassword fails", async () => {
        createUserWithEmailAndPassword.mockRejectedValue(new Error("Email is already in use."))
        await expect(SignUpService(maleUserData)).rejects.toThrow("Email is already in use.")
    });
    it("should gracefully return error if setDoc fails", async () => {
        createUserWithEmailAndPassword.mockResolvedValue({
            user: { uid: "abc123", email: "test1@gmail.com", password: "password" }
        });
        setDoc.mockRejectedValue(new Error("failed to send data to firebase"))
        await expect(SignUpService(maleUserData))
        .rejects
        .toThrow("failed to send data to firebase")
    });
})
