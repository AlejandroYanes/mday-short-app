import { useState } from 'react';
import { Button, IconButton, Toast } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Attach } from 'monday-ui-react-core/icons';

import { BASE_URL } from '../utils/constants';

export default function CopyToClipboard(props) {
  const { link } = props;
  const [toastOpen, setToastOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${BASE_URL}/visit/${link.slug}`);
      setToastOpen(true);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  }

  return (
    <>
      <IconButton icon={Attach} size={Button.sizes.XS} kind={Button.kinds.SECONDARY} onClick={copyToClipboard} />
      <Toast
        open={toastOpen}
        type={Toast.types.POSITIVE}
        onClose={() => setToastOpen(false)}
        autoHideDuration={2500}
        className="monday-storybook-toast"
      >
        Short link copied to clipboard
      </Toast>
    </>
  );
}
