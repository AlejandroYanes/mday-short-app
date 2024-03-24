import { useState } from 'react';
import { TabList, Tab } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Link, Graph, Team } from 'monday-ui-react-core/icons';

import ComingSoon from './coming-soon';
import Links from '../pages/links';
import Users from '../pages/team';

const renderMap = {
  0: Links,
  1: ComingSoon,
  2: Users,
};

const Empty = () => null;

export default function MainView() {
  const [activeTab, setActiveTab] = useState(0);

  const Content = renderMap[activeTab] ?? Empty;

  return (
    <div className="app">
      <TabList className="nav-bar" activeTabId={activeTab} onTabChange={setActiveTab}>
        <Tab icon={Link}>Links</Tab>
        <Tab icon={Graph}>Analytics</Tab>
        <Tab icon={Team}>Team</Tab>
      </TabList>
      <Content/>
    </div>
  );
}
