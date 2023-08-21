"use client";

import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
}

export interface LocationContextProp {
  location: LocationState;
  setLocation: Dispatch<SetStateAction<LocationState>>;
}

const defaultLocationState = {
  latitude: null,
  longitude: null,
};

const LocationContext = createContext<LocationContextProp | undefined>(
  undefined
);

export const LocationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>(defaultLocationState);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        console.log(position)
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return (
    <>
      <LocationContext.Provider value={{ location, setLocation }}>
        {children}
      </LocationContext.Provider>
    </>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};