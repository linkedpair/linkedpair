import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EmailInput from "../../components/auth/EmailInput";

const defaultProps = {
  placeholder: "Enter Email",
  value: "",
  onChangeText: jest.fn(),
  checkEmail: true,
}

describe("emailInput tests", () => {
    it("should display the correct placeholder", () => {
        const { getByPlaceholderText } = render(<EmailInput {...defaultProps} />);
        expect(getByPlaceholderText("Enter Email")).toBeTruthy();
    });
    it("should call onChangeText when user types", () => {
        const mockOnChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <EmailInput {...defaultProps} onChangeText={mockOnChangeText} />
        );
        fireEvent.changeText(getByPlaceholderText("Enter Email"), "myEmail");
        expect(mockOnChangeText).toHaveBeenCalledWith("myEmail");
    });
    it("should display error message if email is invalid", () => {
        const { getByText } = render(
            <EmailInput {...defaultProps} value="invalidEmail" />
        );
        expect(getByText("Please Enter a Valid Email!")).toBeTruthy();
    });
    it("should not display error message otherwise", () => {
        const { getByText } = render(
            <EmailInput {...defaultProps} value="validEmail@example.com" />
        );
        expect(() => getByText("Please Enter a Valid Email!")).toThrow();
    });
})