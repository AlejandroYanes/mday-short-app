import { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { Button, TextField, Text, Flex } from 'monday-ui-react-core';
import { z } from 'zod';

import { authAPI } from '../../api/auth';
import { useAuth } from '../../providers/auth';
import { APP_STATUS, KEBAB_CASE_REGEX } from '../../utils/constants';
import { Logo } from '../../components/logo';

const slugValidator = z.object({
  name: z.string().min(1).max(50),
  wslug: z.string().min(1).max(20).regex(KEBAB_CASE_REGEX),
});

export default function SetupScreen() {
  const { user, name: userName, email, workspace, sessionToken, updateStore } = useAuth();

  const [name, setName] = useState('');
  const [wslug, setWslug] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [globalError, setGlobalError] = useState('');

  const handleSubmit = async () => {
    const parse = slugValidator.safeParse({ name, wslug });

    if (!parse.success) {
      setGlobalError('Please provide a valid workspace name and short name.');
      return;
    }

    const slots = wslug.split('-');
    if (slots.length > 3) {
      setError('Please keep the short name to a maximum of 3 words.');
      return;
    }

    setError('');
    setGlobalError('');

    try {
      setLoading(true);
      const response = await authAPI.setup({
        user: { id: user, name: userName, email },
        workspace: { id: workspace, ...parse.data },
        token: sessionToken,
      });

      if (response.ok) {
        const { sessionToken, role } = await response.json();
        updateStore({ status: APP_STATUS.NEEDS_BILLING, token: sessionToken, role });
      } else {
        const { status } = await response.json();

        switch (status) {
          case 'workspace-slug-exists':
            setError('This short name is already taken.');
            break;
          case 'workspace-exists':
            setGlobalError('This workspace has already been set up. Please contact support to find out more.');
            break;
          default:
            setGlobalError('An error occurred while trying to set up your workspace. Please try again later.');
            break;
        }
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setGlobalError('An error occurred while trying to set up your workspace. Please try again later.');
    }
  };

  return (
    <div className="app">
      <div className="setup-screen">
        <Flex direction={Flex.directions.COLUMN} align={Flex.align.CENTER} className="banner">
          <Logo width={120} height={120} />
          <Heading>Welcome to
            <span className="banner__letters" style={{color: '#15dec4'}}>Short Links</span>
            <span className="banner__letters" style={{color: '#2D3D5D'}}>for</span>
            <span className="banner__letters" style={{color: '#FF2E83'}}>monday.com</span>
          </Heading>
        </Flex>
        <Text type={Text.types.TEXT1} align={Text.align.CENTER} element="p">
          It looks like you need to set up your workspace.
          We need a few details to get you started.
          Please provide a name and a short name for your workspace.
          <br/>
          <br/>
          The short name will be used as part of the short links we will generate for you.
          <br/>
          <br/>
          For instance, if you choose the name <code>acme</code>,
          a short link would look like <code>https://mndy.link/acme/my-first-link</code>.
        </Text>
        <div className="setup-form">
          <TextField
            required
            requiredAsterisk
            name="name"
            title="Workspace Name"
            placeholder="Acme Inc."
            onChange={setName}
          />
          <div>
            <TextField
              required
              requiredAsterisk
              name="wslug"
              title="Short Name"
              placeholder="acme-inc"
              onChange={setWslug}
              validation={{
                status: error ? 'error' : undefined,
                text: error,
              }}
            />
            <Text type={Text.types.TEXT2} element="p">
              <ul style={{ paddingLeft: '14px' }}>
                <li>Use only lowercase letters, numbers, and dashes.</li>
                <li>Do not use spaces or special characters.</li>
                <li>Keep it to a maximum of 3 words and 20 characters.</li>
              </ul>
            </Text>
          </div>
          {globalError ? (
            <Text type={Text.types.TEXT1} align={Text.align.CENTER} element="p" style={{ color: 'var(--negative-color)' }}>
              {globalError}
            </Text>
          ) : null}
          <Button
            loading={loading}
            onClick={handleSubmit}
            type={Button.types.BUTTON}
            kind={Button.kinds.PRIMARY}
          >
            Confirm
          </Button>
          <Text type={Text.types.TEXT2} align={Text.align.CENTER} element="p">
            The user who sets up the workspace will be considered the owner and will have full control of the workspace,
            as well as handle future join requests.
          </Text>
        </div>
      </div>
    </div>
  );
}
