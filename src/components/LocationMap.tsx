import React, { useState, useEffect } from "react";
import { Box, Button, Text, VStack, useToast } from "@chakra-ui/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinates } from "../types";

// Fix for default marker icon
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.375rem",
};

const defaultCenter = {
  lat: 13.7563, // Bangkok
  lng: 100.5018,
};

interface LocationMapProps {
  coordinates?: Coordinates;
  onLocationChange: (coords: Coordinates) => void;
}

function MapEvents({
  onLocationChange,
}: {
  onLocationChange: (coords: Coordinates) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationChange({ lat, lng });
    },
  });
  return null;
}

// Component to handle map center updates
function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const LocationMap: React.FC<LocationMapProps> = ({
  coordinates,
  onLocationChange,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [hasAttemptedLocation, setHasAttemptedLocation] = useState(false);
  const toast = useToast();
  const position = coordinates || defaultCenter;

  // Detect macOS/iOS Safari (where CoreLocation errors are common)
  const isMacOrIOS = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  // Cleanup watch position on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const fallbackToManualLocation = () => {
    setIsLocating(false);
    setLocationError("กรุณาคลิกที่แผนที่เพื่อเลือกตำแหน่งของคุณ");
    toast({
      title: "โปรดเลือกตำแหน่งด้วยตนเอง",
      description: "คลิกที่แผนที่เพื่อเลือกตำแหน่งของคุณ",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleGetCurrentLocation = () => {
    // If we've already tried and failed on macOS/iOS, just show manual selection
    if (isMacOrIOS && hasAttemptedLocation) {
      fallbackToManualLocation();
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setHasAttemptedLocation(true);

    if (!navigator.geolocation) {
      fallbackToManualLocation();
      return;
    }

    // Clear existing watch
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const coords: Coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      onLocationChange(coords);
      setIsLocating(false);
      setLocationError(null);
      toast({
        title: "ระบุตำแหน่งสำเร็จ",
        description: "คุณสามารถปรับตำแหน่งได้โดยคลิกที่แผนที่",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      console.log("Geolocation error:", error.code, error.message);

      // On macOS/iOS, immediately show manual selection to avoid endless errors
      if (isMacOrIOS) {
        fallbackToManualLocation();
        return;
      }

      // For other platforms, one simplified retry with low accuracy
      const options: PositionOptions = {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000,
      };

      toast({
        title: "กำลังลองใหม่อีกครั้ง",
        description: "หากไม่สำเร็จ คุณสามารถคลิกที่แผนที่เพื่อเลือกตำแหน่งเอง",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Only one retry to avoid multiple errors
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          () => {
            // If still failing, show manual selection
            fallbackToManualLocation();
          },
          options
        );
      }, 1500);
    };

    // Simplified options focused on avoiding errors
    const initialOptions: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000, // Accept cached positions up to a minute old
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      initialOptions
    );
  };

  return (
    <VStack spacing={4} width="100%">
      <Button
        colorScheme="blue"
        onClick={handleGetCurrentLocation}
        isLoading={isLocating}
        loadingText="กำลังระบุตำแหน่ง..."
        width="100%"
        leftIcon={<LocationIcon />}
      >
        {isMacOrIOS && hasAttemptedLocation
          ? "ลองระบุตำแหน่งอีกครั้ง"
          : "ระบุตำแหน่งปัจจุบัน"}
      </Button>
      {locationError && (
        <Text fontSize="sm" color="blue.500" textAlign="center">
          {locationError}
        </Text>
      )}
      <Box height="300px" width="100%" borderRadius="md" overflow="hidden">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={containerStyle}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onLocationChange={onLocationChange} />
          <MapCenterUpdater center={[position.lat, position.lng]} />
          {coordinates && (
            <Marker position={[coordinates.lat, coordinates.lng]} />
          )}
        </MapContainer>
      </Box>
      <Text fontSize="sm" color="gray.500" textAlign="center">
        คลิกที่แผนที่เพื่อเลือกตำแหน่งที่ตั้งของคุณ
      </Text>
    </VStack>
  );
};

// Simple location icon component
const LocationIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.94 19.94A10 10 0 1 1 4.06 4.06a10 10 0 0 1 15.88 15.88" />
  </svg>
);

export default LocationMap;
