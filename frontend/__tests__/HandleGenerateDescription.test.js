import handleGenerateDescription from "../utils/HandleGenerateDescription";
import { generateProfileDescription } from "../utils/openai";

const setLoadingDesc = jest.fn();
const setProfileDescription = jest.fn();

jest.mock('../utils/openai', () => ({
    generateProfileDescription: jest.fn()
}))

describe("handleGenerateDescription test", () => {
    beforeEach(() => {
        global.alert = jest.fn();
    });
    it("should fail if traits is an empty string", async () => {
        await handleGenerateDescription({
            traits: "", 
            setLoadingDesc: setLoadingDesc, 
            setProfileDescription: setProfileDescription
        })
        expect(alert).toHaveBeenCalledWith("Please enter your traits first.");
    });
    it("should call generateProfileDescription", async () => {
        await handleGenerateDescription({
            traits: "Fat and Stupid", 
            setLoadingDesc: setLoadingDesc, 
            setProfileDescription: setProfileDescription
        })
        expect(generateProfileDescription).toHaveBeenCalledWith("Fat and Stupid");
    });
    it("should call setProfileDescription with generated description", async () => {
        const traits = "Pretty";
        const mockedProfileDescription = "Pretty girl who looks like a man";
        generateProfileDescription.mockResolvedValueOnce(mockedProfileDescription);
        await handleGenerateDescription({
            traits,
            setLoadingDesc,
            setProfileDescription
        });
        expect(setProfileDescription).toHaveBeenCalledWith(mockedProfileDescription);
    });
    it("should gracefully return error if generateProfileDescription fails", async () => {
        generateProfileDescription.mockRejectedValue(new Error("Hi I'm an Error"));    
        await handleGenerateDescription({
            traits: "Handsome and Muscular",
            setLoadingDesc,
            setProfileDescription
        })
        expect(alert).toHaveBeenCalledWith("Failed to generate description. Please try again.")
    });
})