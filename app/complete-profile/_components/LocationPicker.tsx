import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Control, UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { completeProfileSchema } from "./completeProfileSchema";

const libraries: "places"[] = ["places"];

type FormType = z.infer<typeof completeProfileSchema>;

interface Props {
  control: Control<FormType>;
  setValue: UseFormSetValue<FormType>;
}

export default function LocationPicker({ setValue }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 6.5244, lng: 3.3792 },
      zoom: 10,
    });

    const marker = new google.maps.Marker({
      map,
      draggable: true,
      position: map.getCenter(),
    });

    const updateCoordinates = () => {
      const position = marker.getPosition();
      if (position) {
        setValue("location", {
          type: "Point",
          coordinates: [position.lng(), position.lat()],
        });
      }
    };

    google.maps.event.addListener(marker, "dragend", updateCoordinates);
    updateCoordinates();
  }, [isLoaded, setValue]);

  return (
    <div>
      <label className="block mb-2 text-green-300 font-medium">
        Set Your Location
      </label>
      <div
        ref={mapRef}
        style={{ height: "300px", width: "100%", borderRadius: "8px" }}
      />
    </div>
  );
}
