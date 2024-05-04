export default function InputHint(props) {
  const { text, light } = props;

  if (!text) return null;

  return (
    <div style={{ paddingLeft: '14px', marginTop: '4px', color: light ? 'var(--secondary-text-color)' : 'inherit' }}>
      <span style={{ fontSize: '14px' }}>
        {text}
      </span>
    </div>
  );
}
