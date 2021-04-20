import './switch.styles.css'
import React from 'react'

const noop = () => {}

function Switch({
  on,
  className = '',
  'aria-label': ariaLabel,
  onClick,
  ...props
}) {
  const btnClassName = [
    className,
    'toggle-btn',
    on ? 'toggle-btn-on' : 'toggle-btn-off',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <label aria-label={ariaLabel || 'Toggle'} style={{display: 'block'}}>
      <input
        className="toggle-input"
        type="checkbox"
        checked={on}
        onChange={noop}
        onClick={onClick}
        data-testid="toggle-input"
      />
      <span className={btnClassName} {...props} />
    </label>
  )
}

export default Switch
