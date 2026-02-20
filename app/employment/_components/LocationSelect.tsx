import React from "react";
import Select from "react-select";
import { Controller, Control, useFormContext } from "react-hook-form";
import { Country, State } from "country-state-city";

// Dark theme styles for react-select
const darkSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "rgb(30 41 59 / 0.6)",
    borderColor: state.isFocused ? "rgb(34 211 238)" : "rgba(255, 255, 255, 0.2)",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(34, 211, 238, 0.5)" : "none",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    minHeight: "48px",
    backdropFilter: "blur(8px)",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "rgb(15 23 42)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(8px)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgba(34, 211, 238, 0.3)"
      : state.isFocused
      ? "rgba(255, 255, 255, 0.1)"
      : "transparent",
    color: state.isSelected ? "white" : "rgb(226 232 240)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
    cursor: "pointer",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "rgb(156 163 175)",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "white",
  }),
  input: (base: any) => ({
    ...base,
    color: "white",
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover": {
      color: "white",
    },
  }),
};

interface LocationSelectProps {
  control: Control<any>;
  errorMessageCountry?: string;
  errorMessageState?: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  control,
  errorMessageCountry,
  errorMessageState,
}) => {
  const { setValue, getValues } = useFormContext(); // Use useFormContext to access setValue and getValues

  // Fetch countries and states using `country-state-city` library
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const getStateOptions = (countryCode: string) => {
    return State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
  };

  // Helper function to convert string value to option object for react-select
  const getCountryOption = (countryValue: string | { value: string; label: string } | null | undefined) => {
    if (!countryValue) return null;
    // If it's already an object, return it
    if (typeof countryValue === 'object' && countryValue !== null && 'value' in countryValue) {
      return countryValue;
    }
    // If it's a string, find the matching option
    if (typeof countryValue === 'string') {
      return countryOptions.find(opt => opt.value === countryValue) || null;
    }
    return null;
  };

  // Helper function to convert string value to option object for react-select
  const getStateOption = (stateValue: string | { value: string; label: string } | null | undefined) => {
    if (!stateValue) return null;
    // If it's already an object, return it
    if (typeof stateValue === 'object' && stateValue !== null && 'value' in stateValue) {
      return stateValue;
    }
    // If it's a string, find the matching option
    if (typeof stateValue === 'string') {
      const countryValue = getValues("country");
      const countryCode = typeof countryValue === 'object' && countryValue !== null && 'value' in countryValue 
        ? countryValue.value 
        : countryValue;
      if (countryCode) {
        const stateOptions = getStateOptions(countryCode);
        return stateOptions.find(opt => opt.value === stateValue) || null;
      }
    }
    return null;
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Country Select */}
      <div>
        <label className="block text-gray-200 font-semibold text-sm mb-2">Country</label>
        <Controller
          control={control}
          name="country"
          render={({ field }) => {
            const currentValue = getValues("country");
            return (
              <Select
                options={countryOptions}
                onChange={(selected) => {
                  // Store only the string value (isoCode) in the form
                  const countryValue = selected ? selected.value : "";
                  field.onChange(countryValue);
                  setValue("country", countryValue, { shouldValidate: true });
                  // Clear state selection if country changes
                  setValue("state", "", { shouldValidate: true });
                }}
                value={getCountryOption(currentValue)}
                placeholder="Select a country"
                className="w-full"
                styles={darkSelectStyles}
                classNamePrefix="react-select"
              />
            );
          }}
        />
        {errorMessageCountry && (
          <span className="text-red-400 text-sm font-medium mt-2 block">{errorMessageCountry}</span>
        )}
      </div>

      {/* State Select */}
      <div>
        <label className="block text-gray-200 font-semibold text-sm mb-2">State</label>
        <Controller
          control={control}
          name="state"
          render={({ field }) => {
            const currentCountry = getValues("country");
            const countryCode = typeof currentCountry === 'object' && currentCountry !== null && 'value' in currentCountry 
              ? currentCountry.value 
              : currentCountry;
            const currentState = getValues("state");
            return (
              <Select
                options={getStateOptions(countryCode || "")}
                onChange={(selected) => {
                  // Store only the string value (isoCode) in the form
                  const stateValue = selected ? selected.value : "";
                  field.onChange(stateValue);
                  setValue("state", stateValue, { shouldValidate: true });
                }}
                value={getStateOption(currentState)}
                placeholder="Select a state"
                isDisabled={!countryCode}
                className="w-full"
                styles={darkSelectStyles}
                classNamePrefix="react-select"
              />
            );
          }}
        />
        {errorMessageState && (
          <span className="text-red-400 text-sm font-medium mt-2 block">{errorMessageState}</span>
        )}
      </div>
    </div>
  );
};

export default LocationSelect;
