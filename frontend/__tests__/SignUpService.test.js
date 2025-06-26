import SignUpService from "../services/SignUpService";
import { createUserWithEmailAndPassword } from "firebase/auth";

jest.mock('firebase/auth');
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
jest.mock('../utils/openai');

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
    })
})