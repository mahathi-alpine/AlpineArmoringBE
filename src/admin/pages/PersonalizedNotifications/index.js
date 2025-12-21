import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import pushApiClient from '../../../utils/pushApiClient';
import {
  Box,
  ContentLayout,
  Button,
  HeaderLayout,
  Layout,
  TextInput,
  Textarea,
  Stack,
  Alert,
  Typography,
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Card,
  CardBody
} from '@strapi/design-system';
import { User } from '@strapi/icons';

const PersonalizedNotifications = () => {
  const location = useLocation();
  const [customerCode, setCustomerCode] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [customerCodeError, setCustomerCodeError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    // Reason: Extract customerCode from URL query parameter when navigating from Customer List
    const params = new URLSearchParams(location.search);
    const code = params.get('customerCode');
    if (code) {
      setCustomerCode(code);
    }
  }, [location.search]);

  const validate = () => {
    let isValid = true;

    if (!customerCode || customerCode.trim().length === 0) {
      setCustomerCodeError('Customer code is required');
      isValid = false;
    } else {
      setCustomerCodeError('');
    }

    if (!title || title.length < 1 || title.length > 100) {
      setTitleError('Title must be between 1-100 characters');
      isValid = false;
    } else {
      setTitleError('');
    }

    if (!body || body.length < 1 || body.length > 500) {
      setBodyError('Body must be between 1-500 characters');
      isValid = false;
    } else {
      setBodyError('');
    }

    if (data) {
      try {
        JSON.parse(data);
        setDataError('');
      } catch (e) {
        setDataError('Must be valid JSON');
        isValid = false;
      }
    } else {
      setDataError('');
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await pushApiClient.sendPersonalizedNotification(customerCode, title, body, data);

    setIsLoading(false);

    if (result.success) {
      const deviceCount = result.data?.totalDevices || result.data?.deviceCount || 0;
      const successCount = result.data?.successCount || 0;
      setSuccess(`Notification sent successfully to ${successCount} of ${deviceCount} device(s)!`);
      setTitle('');
      setBody('');
      setData('');
      setTimeout(() => setSuccess(null), 5000);
    } else {
      if (result.status === 401) {
        setError('Authentication failed - check credentials');
      } else if (result.status === 400) {
        setError('Validation error - check your input');
      } else if (result.status === 404) {
        setError('Customer not found or has no linked devices');
      } else if (result.status === 429) {
        setError('Rate limit exceeded - please wait and try again');
      } else {
        setError(result.message || 'An error occurred');
      }
    }
  };

  return (
    <Box background="neutral100">
      <Layout>
        <HeaderLayout
          title="Personalized Notifications"
          subtitle="Send notifications to a specific customer"
          as="h2"
        />
        <ContentLayout>
          <Stack spacing={4}>
            {error && (
              <Alert closeLabel="Close" variant="danger" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert closeLabel="Close" variant="success" onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}

            {customerCode && (
              <Card>
                <CardBody>
                  <Flex direction="row" alignItems="center" gap={2}>
                    <User />
                    <div>
                      <Typography variant="pi" textColor="neutral600">
                        Sending to Customer:
                      </Typography>
                      <Typography fontWeight="bold" fontSize={4}>
                        {customerCode}
                      </Typography>
                    </div>
                  </Flex>
                </CardBody>
              </Card>
            )}

            <Box padding={4} background="neutral0" hasRadius>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <Alert variant="warning" title="Personalized Notification">
                    This notification will be sent only to the devices linked to the specified customer code.
                  </Alert>

                  <TextInput
                    label="Customer Code"
                    required
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                    error={customerCodeError}
                    hint="Enter the customer code (e.g., MEM-1930)"
                    placeholder="MEM-XXXX"
                  />

                  <TextInput
                    label="Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={titleError}
                    hint={`${title.length}/100 characters`}
                    placeholder="Enter notification title"
                  />

                  <Textarea
                    label="Body"
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    error={bodyError}
                    hint={`${body.length}/500 characters`}
                    placeholder="Enter notification message"
                  />

                  <Textarea
                    label="Data (optional)"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    error={dataError}
                    hint="Valid JSON object (e.g., {'key': 'value'})"
                    placeholder="{}"
                  />

                  <Button type="submit" loading={isLoading} disabled={isLoading} size="L" variant="success">
                    Send to Customer
                  </Button>
                </Stack>
              </form>
            </Box>
          </Stack>
        </ContentLayout>
      </Layout>

      {showConfirm && (
        <Dialog onClose={() => setShowConfirm(false)} title="Confirm Personalized Notification" isOpen={showConfirm}>
          <DialogBody>
            <Stack spacing={3}>
              <Flex direction="row" alignItems="center" gap={2}>
                <User width="24px" height="24px" />
                <Typography fontWeight="bold">
                  Are you sure you want to send this notification to customer {customerCode}?
                </Typography>
              </Flex>
              <Box padding={3} background="neutral100" hasRadius>
                <Stack spacing={2}>
                  <div>
                    <Typography fontWeight="bold">Customer Code:</Typography>
                    <Typography>{customerCode}</Typography>
                  </div>
                  <div>
                    <Typography fontWeight="bold">Title:</Typography>
                    <Typography>{title}</Typography>
                  </div>
                  <div>
                    <Typography fontWeight="bold">Body:</Typography>
                    <Typography>{body}</Typography>
                  </div>
                  {data && (
                    <div>
                      <Typography fontWeight="bold">Data:</Typography>
                      <Typography variant="pi">{data}</Typography>
                    </div>
                  )}
                </Stack>
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button onClick={() => setShowConfirm(false)} variant="tertiary">
                Cancel
              </Button>
            }
            endAction={
              <Button onClick={handleConfirm} variant="success">
                Send to Customer
              </Button>
            }
          />
        </Dialog>
      )}
    </Box>
  );
};

export default PersonalizedNotifications;
