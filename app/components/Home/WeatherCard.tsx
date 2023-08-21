"use client";

import { toastStyle } from "@/utils/toastStyle";
import axios from "axios";
import React, { FC, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SearchInputBox from "./SearchInputBox";
import { BASE_URL } from "@/utils/API";
import { useLocation } from "@/context/LocationContext";

const WeatherCard: FC = () => {
  const { location } = useLocation();
  const [initialWeatherData, setInitialData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLocation, setWeatherLocation] = useState<any>(null);
  const [unit, setUnit] = useState("C"); // metric for Celsius, imperial for Fahrenheit
  const [loading, setLoading] = useState(false);

  const fetchDataFromLocation = async () => {
    try {
      setLoading(true);
      console.log(`${BASE_URL}/current.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${location.latitude,location.longitude}&aqi=no`);
      const response = await axios.get(
        `${BASE_URL}/current.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${location.latitude},${location.longitude}&aqi=no`
      );

      console.log(response.data);
      console.log(response.data.location);
      setWeatherData(response.data.current);
      setWeatherLocation(response.data.location)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Error fetching weather data", { style: toastStyle });
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDataFromLocation();
  }, [location])

  const handleUnitToggle = () => {
    setUnit(unit === "C" ? "F" : "C");
  };
  return (
    <>
      <div className="max-w-3xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Weather Forecasting App
        </h5>

        <SearchInputBox
          weatherData={weatherData}
          setWeatherData={setWeatherData}
          setLoading={setLoading}
          setWeatherLocation={setWeatherLocation}
        />

        {weatherData && weatherLocation && (
          <div className="bg-white p-6  flex flex-col items-center">
            <h2 className="text-3xl font-semibold mb-4">
              {weatherLocation.name}
            </h2>
            <div className="flex-col items-center justify-center">
              
                <img
                  src={weatherData.condition.icon}
                  alt="Weather icon"
                  className="w-20 h-20"
                />
             
              <p className="text-3xl font-semibold">
                {unit === 'C' && (
                  <>
                  
                  {weatherData.temp_c}°{unit}
                  </>
                )}
                {unit === 'F' && (
                  <>
                  {weatherData.temp_f}°{unit}
                  </>
                )}
              </p>
            </div>
            <p className="text-lg mt-2">
              Condition: {weatherData.condition.text}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300"
              onClick={handleUnitToggle}
            >
              Toggle Unit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherCard;
