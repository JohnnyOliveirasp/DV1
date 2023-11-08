import React from 'react';

const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label htmlFor={label}>{label}</label>
      <select id={label} value={value} onChange={onChange}>
        <option value="">Todos</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
