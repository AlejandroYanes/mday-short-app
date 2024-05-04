import { useState } from 'react';
import { Flex, Link, Tab, TabList } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Email, Graph, Link as LinkIcon, Team, LearnMore, CreditCard, Globe } from 'monday-ui-react-core/icons';

import { useAuth } from '../providers/auth';
import Links from '../pages/links';
import Users from '../pages/team';
import BillingPage from '../pages/billing';
import DomainsPage from '../pages/domains';
import ComingSoon from './coming-soon';

const Empty = () => null;

const premiumTabs = {
  0: Links,
  1: ComingSoon,
  2: Users,
  3: DomainsPage,
  4: BillingPage,
};

const basicTabs = {
  0: Links,
  1: ComingSoon,
  2: Users,
  3: BillingPage,
}

export default function MainView() {
  const { role, isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const renderMap = isPremium ? premiumTabs : basicTabs;

  const Content = renderMap[activeTab] ?? Empty;

  const tabs = [
    <Tab key="links" icon={LinkIcon}>Links</Tab>,
    <Tab key="analytics" icon={Graph}>Analytics</Tab>,
  ]

  if (role === 'OWNER') {
    tabs.push(<Tab key="team" icon={Team}>Team</Tab>);

    if (isPremium) {
      tabs.push(<Tab key="domains" icon={Globe}>Domains</Tab>);
    }

    // TODO: uncomment when billing is ready
    // tabs.push(<Tab key="billing" icon={CreditCard}>Billing</Tab>);
  }

  return (
    <div className="app">
      <Flex direction={Flex.directions.ROW} justify={Flex.justify.SPACE_BETWEEN} className="nav-bar">
        <TabList activeTabId={activeTab} onTabChange={setActiveTab}>
          {tabs}
        </TabList>
        <Flex gap={Flex.gaps.MEDIUM}>
          <Link href="https://mndy.link/how-to-use" target="_blank" rel="noreferrer" text="How to use" icon={LearnMore} />
          <Link href="mailto:contact@mndy.link" text="Contact Us" icon={Email} />
        </Flex>
      </Flex>
      <Content/>
    </div>
  );
}
