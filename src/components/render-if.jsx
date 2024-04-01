/**
 * This component renders the children if the condition is true. Otherwise, it renders the fallback.
 *
 * @param {Object} props
 * @param {boolean} props.condition
 * @param {ReactNode} props.children
 * @param {ReactNode} props.fallback
 * @returns {ReactNode} Either the children or the fallback based on the condition.
 */
export default function RenderIf(props) {
  const {
    children,
    condition,
    fallback = null,
  } = props;

  if (condition) {
    return children;
  }

  return fallback;
};
