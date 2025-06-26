import SignUpService from "../services/SignUpService";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { generateEmbeddingFromProfile } from "../utils/openai";

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
jest.mock("../firebaseConfig", () => ({
  auth: "mockAuthObject",
}));
jest.mock('../utils/openai', () => ({
    generateEmbeddingFromProfile: jest.fn(() => Promise.resolve([0.1, 0.2, 0.3]))
}));


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
        )
    });
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
    it("embedding mock works", async () => {
        const result = await generateEmbeddingFromProfile("test");
        expect(result).toEqual([0.1, 0.2, 0.3]);
    });
    it("should call setDoc with correct inputs which match what was keyed in by user", async () => {
        await SignUpService({
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
        });
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
    })
})