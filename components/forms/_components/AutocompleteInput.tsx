import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import axios from "axios";
import { TextField } from "@mui/material";

interface AutocompleteInputProps {
  name: string;
  label: string;
  control: Control<any>;
  apiEndpoint: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  name,
  label,
  control,
  apiEndpoint,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(apiEndpoint, {
          params: { query: value },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          select
          SelectProps={{
            native: true,
          }}
          InputProps={{
            endAdornment: suggestions.length > 0 && (
              <datalist id="suggestions">
                {suggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            ),
          }}
          helperText="Start typing to get location suggestions"
        />
      )}
    />
  );
};

export default AutocompleteInput;
