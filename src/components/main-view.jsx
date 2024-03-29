import { useState } from 'react';
import { Flex, Link, Tab, TabList } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Email, Graph, Link as LinkIcon, Team } from 'monday-ui-react-core/icons';

import ComingSoon from './coming-soon';
import Links from '../pages/links';
import Users from '../pages/team';
import { useAuth } from '../providers/auth';

const renderMap = {
  0: Links,
  1: ComingSoon,
  2: Users,
};

const Empty = () => null;

export default function MainView() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const Content = renderMap[activeTab] ?? Empty;

  const tabs = [
    <Tab key="links" icon={LinkIcon}>Links</Tab>,
    <Tab key="analytics" icon={Graph}>Analytics</Tab>,
  ]

  if (role === 'OWNER') {
    tabs.push(<Tab key="team" icon={Team}>Team</Tab>);
  }

  return (
    <div className="app">
      <Flex direction={Flex.directions.ROW} justify={Flex.justify.SPACE_BETWEEN} className="nav-bar">
        <TabList activeTabId={activeTab} onTabChange={setActiveTab}>
          {tabs}
        </TabList>
        <Flex>
          <Link href="mailto:contact@mndy.link" text="Contact Us" icon={Email} />
        </Flex>
      </Flex>
      <Content/>
    </div>
  );
}
