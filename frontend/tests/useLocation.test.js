import React, { useState, useEffect } from "react";
import { render, waitFor } from "@testing-library/react-native";
import useLocation from "../hooks/useLocation"; 
import * as Location from "expo-location";

jest.mock("expo-location");

describe("useLocation test", () => {

  const TestComponent = ({ onSetLocation }) => {
    const [location, setLocation] = useState(null);
    useLocation({ setLocation });

    useEffect(() => {
      if (location) onSetLocation(location);
    }, [location]);

    return null;
  };

  it("useLocation requests permission correctly", async () => {
    const onSetLocation = jest.fn();

    render(<TestComponent onSetLocation={onSetLocation} />);

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    });
  })

  it("useLocation sets location correctly", async () => {
      const onSetLocation = jest.fn();

    render(<TestComponent onSetLocation={onSetLocation} />);

    await waitFor(() => {
      expect(onSetLocation).toHaveBeenCalledWith({
        latitude: 12.34,
        longitude: 56.78,
      });
    });
  })

  it("useLocation sets location with highest accuracy", async () => {
    const onSetLocation = jest.fn();

    render(<TestComponent onSetLocation={onSetLocation} />);

    await waitFor(() => {
      expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith({
        accuracy: Location.Accuracy.Highest,
      });
    });
  })
})
