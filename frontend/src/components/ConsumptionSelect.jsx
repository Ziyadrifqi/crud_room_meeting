export default function ConsumptionSelect({ options, selected, onChange }) {
  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="checkbox-grid">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label key={option} className={`checkbox-tile${checked ? ' checked' : ''}`}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(option)}
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}
