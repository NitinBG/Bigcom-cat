'use client';

import { useState, useEffect, useMemo, ChangeEvent } from 'react';

interface RangeSliderOption {
  label: string;
  value: string;
  disabled: boolean;
}

interface RangeSliderProps {
  filter: {
    type: string;
    paramName: string;
    label: string;
    options: RangeSliderOption[];
  };
  getRangeFromSlider: (selected: string[], filter: any) => void;
}

export default function RangeSlider({ filter, getRangeFromSlider, value }: RangeSliderProps) {
  const numericOptions = useMemo(() => filter.options.map(opt => Number(opt.value)), [filter.options]);
  const minValue = Math.min(0, ...value) || Math.min(0, ...numericOptions);
  const maxValue = Math.max(...numericOptions);
  const maxParam = Math.max(0, ...value) || Math.max(...numericOptions);
  const [range, setRange] = useState({ start: minValue, end: maxParam ||  maxValue});

  const selectedOptions =() => {
    const { start, end } = range;
    const lower = Math.min(start, end);
    const upper = Math.max(start, end);
    return filter.options
      .filter(opt => {
        const numValue = Number(opt.value);
        return numValue >= lower && numValue <= upper;
      })
      .map(opt => opt.value);
  }



  const getPercent = (value: number) =>
    ((value - minValue) / (maxValue - minValue)) * 100;

  const handleRangeChange = (key: 'start' | 'end') => (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setRange(prev => {
      const newStart = key === 'start' ? Math.min(value, prev.end) : prev.start;
      const newEnd = key === 'end' ? Math.max(value, prev.start) : prev.end;
      return { start: newStart, end: newEnd };
    });
    setTimeout(() => {
      const arr = selectedOptions();
      getRangeFromSlider(arr, filter);
    })
  };

  const sliderThumbClasses = `
    absolute w-full h-[40px] -mt-1 appearance-none bg-transparent pointer-events-none
    [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md
    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[hsl(var(--contrast-400))]
    [&::-webkit-slider-thumb]:transform [&::-webkit-slider-thumb]:transition [&::-webkit-slider-thumb]:duration-100
    [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:cursor-pointer
  `;

  const lowerPercent = getPercent(range.start);
  const upperPercent = getPercent(range.end);

  const getLabel = (value: number) =>
    filter.options.find(opt => Number(opt.value) === value)?.label || value;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-xl shadow-sm border border-[hsl(var(--contrast-200))]">
      <div className="relative w-full h-8 mt-8 mb-10">
        {/* Track */}
        <div className="absolute inset-0 bg-[hsl(var(--contrast-200))] rounded-full" />
        {/* Selected Range */}
        <div
          className="absolute bg-[hsl(var(--contrast-300))] rounded-full h-full"
          style={{
            left: `${Math.min(lowerPercent, upperPercent)}%`,
            width: `${Math.abs(upperPercent - lowerPercent)}%`,
          }}
        />
        {/* Start Thumb */}
        <input
          type="range"
          min={minValue}
          max={maxValue}
          value={range.start}
          onChange={handleRangeChange('start')}
          step="1"
          className={sliderThumbClasses}
        />
        {/* End Thumb */}
        <input
          type="range"
          min={minValue}
          max={maxValue}
          value={range.end}
          onChange={handleRangeChange('end')}
          step="1"
          className={sliderThumbClasses}
        />
      </div>

      {/* Tick Marks & Labels */}
      {/* <div className="relative w-full mt-2 h-10">
        {filter.options.map((opt, index) => {
          const percent = (index / (filter.options.length - 1)) * 100;
          return (
            <div
              key={opt.value}
              className="absolute flex flex-col items-center"
              style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-px h-3 bg-[hsl(var(--contrast-400))] mb-1"></div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {opt.label}
              </span>
            </div>
          );
        })}
      </div> */}

      {/* Selected Range Values */}
      <div className="flex justify-between mt-6 px-2">
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-muted-foreground">From</span>
          <span className="text-base font-medium text-foreground">{getLabel(Math.min(range.start, range.end))}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-muted-foreground">To</span>
          <span className="text-base font-medium text-foreground">{getLabel(Math.max(range.start, range.end))}</span>
        </div>
      </div>

      {/* Debug */}
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Selected: {selectedOptions()?.join(', ')}</p>
      </div>
    </div>
  );
}
