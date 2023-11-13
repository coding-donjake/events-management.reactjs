import React, { ChangeEvent, ReactNode } from "react";

interface Option {
  label: string;
  value: string;
}

interface InputProps {
  topLeftLabel?: ReactNode;
  topRightLabel?: ReactNode;
  bottomLeftLabel?: ReactNode;
  bottomRightLabel?: ReactNode;
  type?: "text" | "password" | "email" | "number" | "date" | "datetime-local";
  id?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: Option[];
  value?: string;
  filterValue?: string;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly?: boolean;
}

export const Input = ({
  topLeftLabel,
  topRightLabel,
  bottomLeftLabel,
  bottomRightLabel,
  type = "text",
  id,
  min,
  max,
  placeholder,
  value,
  onChange,
  readonly,
}: InputProps) => {
  return (
    <div className="form-control flex-1">
      {topLeftLabel || topRightLabel ? (
        <label className="label">
          <span className="label-text">{topLeftLabel}</span>
          <span className="label-text-alt">{topRightLabel}</span>
        </label>
      ) : null}
      <input
        className="input input-bordered w-full"
        type={type}
        id={id}
        name={id}
        min={min}
        max={max}
        placeholder={placeholder}
        defaultValue={value}
        onChange={onChange}
        readOnly={readonly}
      />
      {bottomLeftLabel || bottomRightLabel ? (
        <label className="label">
          <span className="label-text-alt">{bottomLeftLabel}</span>
          <span className="label-text-alt">{bottomRightLabel}</span>
        </label>
      ) : null}
    </div>
  );
};

export const Select = ({
  topLeftLabel,
  topRightLabel,
  bottomLeftLabel,
  bottomRightLabel,
  id,
  placeholder,
  options,
  value,
  onChange,
}: InputProps) => {
  return (
    <div className="form-control flex-1">
      {topLeftLabel || topRightLabel ? (
        <label className="label">
          <span className="label-text">{topLeftLabel}</span>
          <span className="label-text-alt">{topRightLabel}</span>
        </label>
      ) : null}
      <select
        className="select select-bordered w-full"
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      >
        {options?.map((child) => (
          <option value={child.value}>{child.label}</option>
        ))}
      </select>
      {bottomLeftLabel || bottomRightLabel ? (
        <label className="label">
          <span className="label-text-alt">{bottomLeftLabel}</span>
          <span className="label-text-alt">{bottomRightLabel}</span>
        </label>
      ) : null}
    </div>
  );
};

export const Search = ({
  placeholder,
  options,
  value,
  filterValue,
  onChange,
  onClick,
}: InputProps) => {
  return (
    <div className="join">
      <div>
        <div>
          <input
            className="input input-bordered join-item"
            id="key"
            name="key"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
      <select
        className="select select-bordered join-item"
        id="filterKey"
        name="filterKey"
        value={filterValue}
        onChange={onChange}
      >
        {options?.map((child) => (
          <option value={child.value}>{child.label}</option>
        ))}
      </select>
      <div className="indicator">
        <button className="btn join-item" onClick={onClick}>
          Search
        </button>
      </div>
    </div>
  );
};
