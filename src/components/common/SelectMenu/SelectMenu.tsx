import { useEffect, useMemo, useRef, useState } from "react";
import "./SelectMenu.css";

interface SelectOption {
  label: string;
  value: number;
}

interface SelectMenuProps {
  id: string;
  value: number;
  options: SelectOption[];
  onChange: (value: number) => void;
  hasError?: boolean;
  onBlur?: () => void;
}

export function SelectMenu({
  id,
  value,
  options,
  onChange,
  hasError = false,
  onBlur,
}: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBlur]);

  return (
    <div className="select-menu" ref={wrapperRef}>
      <button
        id={id}
        type="button"
        className={`select-menu__trigger ${
          hasError ? "select-menu__trigger--error" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="select-menu__value">{selectedOption.label}</span>
        <span
          className={`select-menu__arrow ${
            isOpen ? "select-menu__arrow--open" : ""
          }`}
          aria-hidden="true"
        >
          ›
        </span>
      </button>

      {isOpen ? (
        <div className="select-menu__menu" role="listbox">
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                className={`select-menu__option ${
                  selected ? "select-menu__option--selected" : ""
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  onBlur?.();
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
