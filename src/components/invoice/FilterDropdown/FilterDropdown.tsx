import "./FilterDropdown.css";

interface FilterDropdownProps {
  label?: string;
}

export function FilterDropdown({
  label = "Filter by status",
}: FilterDropdownProps) {
  return (
    <button className="filter-dropdown" type="button" aria-haspopup="true">
      <span className="filter-dropdown__label">{label}</span>
      <span className="filter-dropdown__arrow" aria-hidden="true">
        ⌄
      </span>
    </button>
  );
}
