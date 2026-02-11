import type { ChangeEvent } from 'react';

interface SliderMark {
  value: number;
  label: string;
}

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  marks?: SliderMark[];
  step?: number;
  disabled?: boolean;
  id?: string;
}

export function Slider({
  min,
  max,
  value,
  onChange,
  label,
  unit = '',
  marks,
  step = 1,
  disabled = false,
  id
}: SliderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-sm font-medium text-navy-darkest"
          >
            {label}
          </label>
          <span className="text-lg font-bold text-navy-darkest">
            {value}{unit}
          </span>
        </div>
      )}

      <div className="relative pt-1">
        {/* Track */}
        <div className="relative h-2 bg-light-grey rounded-full overflow-hidden">
          {/* Filled portion */}
          <div
            className="absolute h-full bg-primary transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Range input */}
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={handleChange}
          disabled={disabled}
          className={`
            absolute top-0 w-full h-2 appearance-none bg-transparent cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:transition-transform
            [&::-moz-range-thumb]:hover:scale-110
          `}
        />
      </div>

      {/* Marks */}
      {marks && marks.length > 0 && (
        <div className="relative flex justify-between text-xs text-dark-grey pt-1">
          {marks.map((mark) => (
            <span key={mark.value} className="text-center">
              {mark.label}
            </span>
          ))}
        </div>
      )}

      {/* Min/Max labels if no marks */}
      {(!marks || marks.length === 0) && (
        <div className="flex justify-between text-xs text-dark-grey">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  );
}
