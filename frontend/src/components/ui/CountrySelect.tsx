import Select from 'react-select';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'BE', label: 'Belgium' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AU', label: 'Australia' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'ZA', label: 'South Africa' },
];

export function CountrySelect({ value, onChange, placeholder = 'Select a country' }: CountrySelectProps) {
  const selectedOption = COUNTRIES.find(c => c.value === value) || null;

  return (
    <Select
      value={selectedOption}
      onChange={(option) => onChange(option?.value || '')}
      options={COUNTRIES}
      placeholder={placeholder}
      isClearable
      isSearchable
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '44px',
          borderColor: state.isFocused ? '#12AEBF' : '#0B6873',
          borderRadius: '6px',
          boxShadow: state.isFocused ? '0 0 0 2px rgba(18, 174, 191, 0.1)' : 'none',
          '&:hover': {
            borderColor: '#12AEBF',
          },
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? '#12AEBF'
            : state.isFocused
            ? '#A0DFE5'
            : 'white',
          color: state.isSelected ? 'white' : '#07464C',
          cursor: 'pointer',
        }),
      }}
    />
  );
}
