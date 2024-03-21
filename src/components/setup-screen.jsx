// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { Button, TextField } from 'monday-ui-react-core';

export default function SetupScreen() {
  return (
    <div className="app">
      <div className="setup-screen">
        <div className="banner">
          <Heading>Welcome to</Heading>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
            <span className="banner__letters" style={{color: 'var(--negative-color)'}}>M</span>
            <span className="banner__letters" style={{color: 'var(--warning-color)'}}>S</span>
            <span className="banner__letters" style={{color: 'var(--positive-color)'}}>L</span>
          </div>
        </div>
        <p style={{textAlign: 'center'}}>
          It looks like you need to set up your workspace.
          All you need is to choose a short name to identify your links.
          <br />
          <br />
          This name will be used as part of the short links we will generate for you.
          <br />
          <br />
          For instance, if you choose the name <code>acme</code>,
          a short link would look like <code>https://mday.com/acme/my-first-link</code>.
        </p>
        <div className="setup-form">
          <TextField name="wslug" placeholder="acme" />
          <Button kind={Button.kinds.PRIMARY} type={Button.types.BUTTON}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}
