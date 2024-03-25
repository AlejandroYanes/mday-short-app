export default function InputHint(props) {
  const { text } = props;

  if (!text) return null;

  return (
    <div style={{ paddingLeft: '14px', marginTop: '4px' }}>
      <span style={{ fontSize: '14px' }}>
        {text}
      </span>
    </div>
  );
}
