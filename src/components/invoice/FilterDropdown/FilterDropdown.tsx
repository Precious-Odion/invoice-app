import { useState } from "react";
import { useInvoices } from "../../../context/InvoiceContext";
import "./FilterDropdown.css";

export function FilterDropdown() {
  const { selectedFilters, toggleFilter, clearFilters } = useInvoices();
  const [isOpen, setIsOpen] = useState(false);

  const label =
    selectedFilters.length === 0
      ? "Filter by status"
      : `Filter (${selectedFilters.length})`;

  return (
    <div className="filter-dropdown-wrapper">
      <button
        className="filter-dropdown"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="filter-dropdown__label">{label}</span>
        <span
          className={`filter-dropdown__arrow ${
            isOpen ? "filter-dropdown__arrow--open" : ""
          }`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>

      {isOpen ? (
        <div className="filter-dropdown__menu">
          {(["draft", "pending", "paid"] as const).map((option) => {
            const checked = selectedFilters.includes(option);

            return (
              <label key={option} className="filter-dropdown__option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFilter(option)}
                />
                <span className="filter-dropdown__checkbox" />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            );
          })}

          <button
            type="button"
            className="filter-dropdown__clear"
            onClick={() => {
              clearFilters();
              setIsOpen(false);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
