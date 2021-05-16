export default function Visibility({ isVisible, children }) {
  const show = isVisible
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };
  return <div style={show}>{children}</div>;
}
