declare module "react-country-state-city" {
  export const CountrySelect: React.FC<{
    defaultValue?: { id: string; name: string } | number;
    onChange: (value: { id: string; name: string }) => void;
    placeHolder?: string;
  }>;

  export const StateSelect: React.FC<{
    countryid: string | number;
    defaultValue?: { id: string; name: string } | number;
    onChange: (value: { id: string; name: string }) => void;
    placeHolder?: string;
  }>;

  export const CitySelect: React.FC<{
    countryid: string | number;
    stateid: string | number;
    defaultValue?: { id: string; name: string } | number;
    onChange: (value: { id: string; name: string }) => void;
    placeHolder?: string;
  }>;
}
