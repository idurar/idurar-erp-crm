import React, { useEffect, useState, useRef } from 'react';

const Dropdown = ({ value, options, placeholder = 'Select', onChange }) => {
  const node = useRef();

  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setOpen(false);
  };

  const handleChange = (selectedValue) => {
    onChange(selectedValue);
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  return (
    <div ref={node} className="dropdown">
      <button className="dropdown-toggler" onClick={(e) => setOpen(!open)}>
        {value || placeholder}
      </button>
      {open && (
        <ul className="dropdown-menu">
          {options.map((opt) => (
            <li className="dropdown-menu-item" onClick={(e) => handleChange(opt)}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
