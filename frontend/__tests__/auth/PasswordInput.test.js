import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PasswordInput from "../../components/auth/PasswordInput";

jest.mock('@expo/vector-icons/Feather', () => jest.fn());

const defaultProps = {
    placeholder: "Enter Password",
    value: "",
    onChangeText: jest.fn(),
    hidePassword: true,
    setHidePassword: jest.fn(),
    checkPassword: true,
}

describe("passwordInput tests", () => {
    it("should display the correct placeholder", () => {
        const { getByPlaceholderText } = render(<PasswordInput {...defaultProps} />);
        expect(getByPlaceholderText("Enter Password")).toBeTruthy();
    });
    it("should call onChangeText when user types", () => {
        const mockOnChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <PasswordInput {...defaultProps} onChangeText={mockOnChangeText} />
        );
        fireEvent.changeText(getByPlaceholderText("Enter Password"), "myPassword");
        expect(mockOnChangeText).toHaveBeenCalledWith("myPassword");
    });
    it("should toggle password visibility on eye icon click", () => {
        const mockSetHidePassword = jest.fn();
        const { getByRole } = render(
            <PasswordInput {...defaultProps} setHidePassword={mockSetHidePassword} />
        );
        fireEvent.press(getByRole("button"));
        expect(mockSetHidePassword).toHaveBeenCalled();
    });
    it("should display error message if password is too short", () => {
        const { getByText } = render(
            <PasswordInput {...defaultProps} value="short" />
        );
        expect(getByText("Password too Short!")).toBeTruthy();
    });
    it("should not display error message otherwise", () => {
        const { getByText } = render(
            <PasswordInput {...defaultProps} value="longPassword" />
        );
        expect(() => getByText("Password too Short!")).toThrow();
    });
    it("should not display error message in sign in screen", () => {
        const { getByText } = render(
            <PasswordInput {...defaultProps} value="short" checkPassword={false}/>
        );
        expect(() => getByText("Password too Short!")).toThrow();
    });
})