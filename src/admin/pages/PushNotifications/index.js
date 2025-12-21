import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { Box, Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system';

import GenerateCustomerCode from '../GenerateCustomerCode';
import CustomerList from '../CustomerList';
import GlobalNotifications from '../GlobalNotifications';
import PersonalizedNotifications from '../PersonalizedNotifications';

const PushNotifications = () => {
  const history = useHistory();
  const location = useLocation();

  // Reason: Determine active tab from URL to keep tabs in sync with browser navigation
  const getActiveTab = () => {
    if (location.pathname.includes('generate-code')) return 0;
    if (location.pathname.includes('customers')) return 1;
    if (location.pathname.includes('global')) return 2;
    if (location.pathname.includes('personalized')) return 3;
    return 0;
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const handleTabChange = (index) => {
    const routes = ['generate-code', 'customers', 'global', 'personalized'];
    history.push(`/push-notifications/${routes[index]}`);
  };

  // Redirect to generate-code if on base path
  if (location.pathname === '/push-notifications' || location.pathname === '/push-notifications/') {
    return <Redirect to="/push-notifications/generate-code" />;
  }

  return (
    <Box background="neutral100">
      <TabGroup
        label="Push Notification Management"
        id="tabs"
        variant="simple"
        selectedTabIndex={activeTab}
        onTabChange={handleTabChange}
      >
        <Tabs>
          <Tab>Generate Code</Tab>
          <Tab>Customers</Tab>
          <Tab>Global</Tab>
          <Tab>Personalized</Tab>
        </Tabs>
        <TabPanels>
          <TabPanel>
            <GenerateCustomerCode />
          </TabPanel>
          <TabPanel>
            <CustomerList />
          </TabPanel>
          <TabPanel>
            <GlobalNotifications />
          </TabPanel>
          <TabPanel>
            <PersonalizedNotifications />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Box>
  );
};

export default PushNotifications;
