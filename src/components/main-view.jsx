import { useState } from 'react';
import { TabList, Tab } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Link, Graph, Team } from 'monday-ui-react-core/icons';

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
    <Tab key="links" icon={Link}>Links</Tab>,
    <Tab key="analytics" icon={Graph}>Analytics</Tab>,
  ]

  if (role === 'OWNER') {
    tabs.push(<Tab key="team" icon={Team}>Team</Tab>);
  }

  return (
    <div className="app">
      <TabList className="nav-bar" activeTabId={activeTab} onTabChange={setActiveTab}>
        {tabs}
      </TabList>
      <Content/>
    </div>
  );
}
