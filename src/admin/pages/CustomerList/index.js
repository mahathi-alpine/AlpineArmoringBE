import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import pushApiClient from '../../../utils/pushApiClient';
import {
  Box,
  ContentLayout,
  HeaderLayout,
  Layout,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
  Alert,
  Loader,
  Button,
  Flex,
  EmptyStateLayout
} from '@strapi/design-system';
import { Refresh } from '@strapi/icons';

const CustomerList = () => {
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);

    const result = await pushApiClient.getCustomers();

    setIsLoading(false);

    if (result.success) {
      setCustomers(result.data?.customers || []);
    } else {
      if (result.status === 401) {
        setError('Authentication failed - check credentials');
      } else if (result.status === 429) {
        setError('Rate limit exceeded - please wait and try again');
      } else {
        setError(result.message || 'Failed to load customers');
      }
    }
  };

  const handleRowClick = (customerCode) => {
    history.push(`/push-notifications/personalized?customerCode=${customerCode}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box background="neutral100">
      <Layout>
        <HeaderLayout
          title="Customer List"
          subtitle="View all registered customers"
          as="h2"
          primaryAction={
            <Button startIcon={<Refresh />} onClick={fetchCustomers} loading={isLoading} size="S">
              Refresh
            </Button>
          }
        />
        <ContentLayout>
          {error && (
            <Alert closeLabel="Close" variant="danger" onClose={() => setError(null)} marginBottom={4}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <Box padding={8} textAlign="center" background="neutral0" hasRadius>
              <Loader>Loading customers...</Loader>
            </Box>
          ) : customers.length === 0 ? (
            <Box background="neutral0" hasRadius padding={8}>
              <EmptyStateLayout content="No customers found. Generate a customer code to get started." />
            </Box>
          ) : (
            <Box background="neutral0" hasRadius>
              <Table colCount={5} rowCount={customers.length}>
                <Thead>
                  <Tr>
                    <Th>
                      <Typography variant="sigma">Customer Code</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Name</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Email</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Status</Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma">Created At</Typography>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {customers.map((customer) => (
                    <Tr
                      key={customer.customerCode}
                      onClick={() => handleRowClick(customer.customerCode)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Td>
                        <Typography fontWeight="bold">{customer.customerCode}</Typography>
                      </Td>
                      <Td>
                        <Typography>{customer.name}</Typography>
                      </Td>
                      <Td>
                        <Typography>{customer.email}</Typography>
                      </Td>
                      <Td>
                        <Typography textColor={customer.status === 'active' ? 'success600' : 'neutral600'}>
                          {customer.status || 'pending'}
                        </Typography>
                      </Td>
                      <Td>
                        <Typography variant="pi">{formatDate(customer.createdAt)}</Typography>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Box padding={4}>
                <Typography variant="pi" textColor="neutral600">
                  Click on a customer row to send them a personalized notification
                </Typography>
              </Box>
            </Box>
          )}
        </ContentLayout>
      </Layout>
    </Box>
  );
};

export default CustomerList;
