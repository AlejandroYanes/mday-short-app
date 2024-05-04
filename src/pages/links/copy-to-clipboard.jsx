import { Button, IconButton, Tooltip } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Attach } from 'monday-ui-react-core/icons';

import { BASE_URL } from '../../utils/constants';
import { monday } from '../../utils/monday';

export default function CopyToClipboard(props) {
  const { link } = props;

  const copyToClipboard = async () => {
    try {
      const { slug, wslug, domain } = link;
      const url = domain ? `https://${domain}/${slug}` : `${BASE_URL}/${wslug}/${slug}`;
      await navigator.clipboard.writeText(url);
      monday.execute('notice', {
        message: 'Short link copied to clipboard',
        type: 'success', // or "error" (red), or "info" (blue)
        timeout: 2000,
      });
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  }

  return (
    <Tooltip content="Copy to clipboard" position={Tooltip.positions.LEFT} withMaxWidth>
      <IconButton
        icon={Attach}
        size={Button.sizes.XS}
        kind={Button.kinds.SECONDARY}
        onClick={copyToClipboard}
      />
    </Tooltip>
  );
}
