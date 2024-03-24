import { Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

export default function ComingSoon() {
  return (
    <div className="coming-soon">
      <Heading type={Heading.types.H1}>Hi there</Heading>
      <Text type={Text.types.TEXT1}>
        This feature is coming soon. Please check back later.
      </Text>
    </div>
  );
}
