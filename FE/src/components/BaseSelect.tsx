import React from "react";
import ReactSelect, {
  Props as ReactSelectProps,
  StylesConfig,
  MenuPlacement,
} from "react-select";
import { cn } from "@/lib/utils";

const createBaseStyles = <
  Option,
  IsMulti extends boolean = false
>(): StylesConfig<Option, IsMulti> => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "color-mix(in oklab, var(--input) 30%, transparent)",
    borderColor: "var(--input)",
    borderWidth: 1,
    boxShadow: "none",
    "&:hover": { borderColor: "var(--input)" },
    minHeight: 38,
    borderRadius: 8,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--muted-foreground)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--foreground)",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "var(--secondary)",
    borderRadius: 6,
    padding: "2px 6px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "var(--foreground)",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "var(--popover)",
    borderRadius: 8,
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
      ? "var(--secondary)"
      : "var(--popover)",
    color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
    cursor: "pointer",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--muted-foreground)",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "var(--muted-foreground)",
  }),
});

type BaseSelectProps<Option, IsMulti extends boolean> = {
  options: ReactSelectProps<Option, IsMulti>["options"];
  value?: ReactSelectProps<Option, IsMulti>["value"];
  onChange?: ReactSelectProps<Option, IsMulti>["onChange"];
  placeholder?: string;
  isMulti?: IsMulti;
  className?: string;
  menuPlacement?: MenuPlacement;
} & Omit<ReactSelectProps<Option, IsMulti>, "styles">;

export function BaseSelect<Option, IsMulti extends boolean = false>({
  options,
  value,
  onChange,
  placeholder,
  isMulti,
  className,
  menuPlacement = "auto",
  ...rest
}: BaseSelectProps<Option, IsMulti>) {
  return (
    <ReactSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isMulti={isMulti}
      styles={createBaseStyles<Option, IsMulti>()}
      menuPlacement={menuPlacement} // 👈 dùng prop từ ngoài
      className={cn("text-sm", className)}
      {...rest}
    />
  );
}
