import { useState } from "react";
import { useInvoices } from "../../../context/InvoiceContext";
import "./FilterDropdown.css";

export function FilterDropdown() {
  const { filter, setFilter } = useInvoices();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    filter === "all"
      ? "Filter by status"
      : `Filter by ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;

  return (
    <div className="filter-dropdown-wrapper">
      <button
        className="filter-dropdown"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="filter-dropdown__label">{selectedLabel}</span>
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
          {[
            { label: "All", value: "all" },
            { label: "Draft", value: "draft" },
            { label: "Pending", value: "pending" },
            { label: "Paid", value: "paid" },
          ].map((option) => {
            const checked = filter === option.value;

            return (
              <label key={option.value} className="filter-dropdown__option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setFilter(
                      option.value as "all" | "draft" | "pending" | "paid",
                    );
                    setIsOpen(false);
                  }}
                />
                <span className="filter-dropdown__checkbox" />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
