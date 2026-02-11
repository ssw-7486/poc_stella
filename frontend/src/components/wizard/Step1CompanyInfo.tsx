import { useState, memo, type ChangeEvent } from 'react';
import { Input } from '../ui/Input';

interface Step1Data {
  companyName: string;
  industrySector: string;
  primaryRegion: string;
  country: string;
  linesOfBusiness: string;
  primaryContact1: {
    name: string;
    email: string;
    cell: string;
  };
  primaryContact2: {
    name: string;
    email: string;
    cell: string;
  };
  securedDropoffLocation: string;
  securePickupLocation: string;
}

interface Step1CompanyInfoProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
}

const INDUSTRY_OPTIONS = [
  'Banking & Finance',
  'Insurance',
  'Healthcare',
  'Government & Public Sector',
  'Legal Services',
  'Other'
];

const REGION_OPTIONS = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East & Africa'
];

// Countries grouped by region
const COUNTRIES_BY_REGION: Record<string, string[]> = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'Europe': ['United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Sweden', 'Belgium', 'Austria', 'Poland', 'Ireland'],
  'Asia Pacific': ['Japan', 'China', 'India', 'Singapore', 'South Korea', 'Australia', 'New Zealand', 'Thailand', 'Malaysia'],
  'Latin America': ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru'],
  'Middle East & Africa': ['United Arab Emirates', 'Saudi Arabia', 'South Africa', 'Israel', 'Egypt']
};

const DROPDOWN_ARROW_SVG = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2307464C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`;

const selectStyles = {
  backgroundImage: DROPDOWN_ARROW_SVG,
  backgroundPosition: 'right 0.75rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1.25em 1.25em',
};

export const Step1CompanyInfo = memo(function Step1CompanyInfo({ data, onChange }: Step1CompanyInfoProps) {
  const [showContact2, setShowContact2] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  const validatePhone = (phone: string): string => {
    if (!phone) return '';
    const phoneRegex = /^[\d\s()+-]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
      ? ''
      : 'Please enter a valid phone number';
  };

  const handleChange = (field: string, value: string) => {
    // Handle nested fields
    if (field.startsWith('primaryContact1.')) {
      const contactField = field.split('.')[1];
      onChange({
        ...data,
        primaryContact1: {
          ...data.primaryContact1,
          [contactField]: value
        }
      });
    } else if (field.startsWith('primaryContact2.')) {
      const contactField = field.split('.')[1];
      onChange({
        ...data,
        primaryContact2: {
          ...data.primaryContact2,
          [contactField]: value
        }
      });
    } else {
      onChange({
        ...data,
        [field]: value
      });
    }

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    let error = '';

    if (field === 'primaryContact1.email') {
      error = validateEmail(value);
    } else if (field === 'primaryContact1.cell') {
      error = validatePhone(value);
    } else if (field === 'primaryContact2.email' && value) {
      error = validateEmail(value);
    } else if (field === 'primaryContact2.cell' && value) {
      error = validatePhone(value);
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  // Get available countries based on selected region
  const availableCountries = data.primaryRegion
    ? COUNTRIES_BY_REGION[data.primaryRegion] || []
    : Object.values(COUNTRIES_BY_REGION).flat();

  return (
    <div className="space-y-8">
      {/* COMPANY DETAILS Section */}
      <div>
        <h2 className="text-sm font-semibold text-navy-dark uppercase tracking-wide mb-4">
          COMPANY DETAILS
        </h2>
        <div className="space-y-4">
          <Input
            label="Company Name"
            required
            value={data.companyName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('companyName', e.target.value)}
            placeholder="Enter your company name"
          />

          <div>
            <label className="block text-sm text-navy-darkest mb-1">
              Industry Sector <span className="text-red-500">*</span>
            </label>
            <select
              value={data.industrySector}
              onChange={(e) => handleChange('industrySector', e.target.value)}
              className="w-full px-4 py-2 bg-primary-lighter border border-navy-dark rounded-[5px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              style={selectStyles}
            >
              <option value="">Select industry</option>
              {INDUSTRY_OPTIONS.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-navy-darkest mb-1">
              Primary Region <span className="text-red-500">*</span>
            </label>
            <select
              value={data.primaryRegion}
              onChange={(e) => {
                // Update region and reset country in a single onChange call to avoid race condition
                onChange({
                  ...data,
                  primaryRegion: e.target.value,
                  country: '' // Reset country when region changes
                });
              }}
              className="w-full px-4 py-2 bg-primary-lighter border border-navy-dark rounded-[5px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              style={selectStyles}
            >
              <option value="">Select region</option>
              {REGION_OPTIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-navy-darkest mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={data.country}
              onChange={(e) => handleChange('country', e.target.value)}
              disabled={!data.primaryRegion}
              className="w-full px-4 py-2 bg-primary-lighter border border-navy-dark rounded-[5px] focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={selectStyles}
            >
              <option value="">
                {data.primaryRegion ? 'Select country' : 'Select a region first'}
              </option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {data.primaryRegion && (
              <p className="text-xs text-dark-grey mt-1">
                Showing countries in {data.primaryRegion}
              </p>
            )}
          </div>

          <div>
            <Input
              label="No. of Lines of Business Being Processed"
              required
              type="number"
              min={1}
              max={100}
              value={data.linesOfBusiness}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('linesOfBusiness', e.target.value)}
              placeholder="e.g., 3"
            />
            <p className="text-xs text-dark-grey mt-1">
              How many different business lines or departments will process documents?
            </p>
          </div>
        </div>
      </div>

      {/* PRIMARY CONTACTS Section */}
      <div>
        <h2 className="text-sm font-semibold text-navy-dark uppercase tracking-wide mb-4">
          PRIMARY CONTACTS
        </h2>
        <div className="space-y-4">
          <Input
            label="Primary Contact 1 - Name"
            required
            value={data.primaryContact1.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('primaryContact1.name', e.target.value)}
            placeholder="John Doe"
          />

          <Input
            label="Primary Contact 1 - Email"
            required
            type="email"
            value={data.primaryContact1.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('primaryContact1.email', e.target.value)}
            onBlur={() => handleBlur('primaryContact1.email', data.primaryContact1.email)}
            error={errors['primaryContact1.email']}
            placeholder="john.doe@company.com"
          />

          <Input
            label="Primary Contact 1 - Cell"
            required
            type="tel"
            value={data.primaryContact1.cell}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('primaryContact1.cell', e.target.value)}
            onBlur={() => handleBlur('primaryContact1.cell', data.primaryContact1.cell)}
            error={errors['primaryContact1.cell']}
            placeholder="+1 (555) 123-4567"
          />

          {/* Add another contact link */}
          {!showContact2 && (
            <button
              type="button"
              onClick={() => setShowContact2(true)}
              className="text-primary hover:text-primary-medium text-sm font-medium"
            >
              + Add another contact
            </button>
          )}

          {/* Contact 2 fields (shown when link is clicked) */}
          {showContact2 && (
            <div className="space-y-4 pt-4 border-t border-light-grey">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-navy-darkest">Contact 2 (Optional)</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowContact2(false);
                    // Clear Contact 2 data
                    onChange({
                      ...data,
                      primaryContact2: { name: '', email: '', cell: '' }
                    });
                  }}
                  className="text-primary hover:text-primary-medium text-sm font-medium"
                >
                  − Remove contact 2
                </button>
              </div>

              <Input
                label="Primary Contact 2 - Name"
                value={data.primaryContact2.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('primaryContact2.name', e.target.value)}
                placeholder="Jane Smith"
              />

              <Input
                label="Primary Contact 2 - Email"
                type="email"
                value={data.primaryContact2.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('primaryContact2.email', e.target.value)}
                onBlur={() => handleBlur('primaryContact2.email', data.primaryContact2.email)}
                error={errors['primaryContact2.email']}
                placeholder="jane.smith@company.com"
              />

              <Input
                label="Primary Contact 2 - Cell"
                type="tel"
                value={data.primaryContact2.cell}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('primaryContact2.cell', e.target.value)}
                onBlur={() => handleBlur('primaryContact2.cell', data.primaryContact2.cell)}
                error={errors['primaryContact2.cell']}
                placeholder="+1 (555) 987-6543"
              />
            </div>
          )}
        </div>
      </div>

      {/* FILE LOCATIONS Section */}
      <div>
        <h2 className="text-sm font-semibold text-navy-dark uppercase tracking-wide mb-4">
          FILE LOCATIONS
        </h2>
        <div className="space-y-4">
          <div>
            <Input
              label="Secured Drop-off Location (Files)"
              required
              value={data.securedDropoffLocation}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('securedDropoffLocation', e.target.value)}
              placeholder="/data/customers/customer1/drop-off/ or s3://bucket-name/drop-off/"
            />
            <p className="text-xs text-dark-grey mt-1">
              File system path or S3 bucket name where documents will be uploaded
            </p>
          </div>

          <div>
            <Input
              label="Secure Pick-up Location (Files)"
              required
              value={data.securePickupLocation}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('securePickupLocation', e.target.value)}
              placeholder="/data/customers/customer1/pickup/ or s3://bucket-name/pickup/"
            />
            <p className="text-xs text-dark-grey mt-1">
              File system path or S3 bucket name where processed documents will be delivered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
