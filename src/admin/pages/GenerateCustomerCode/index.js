import React, { useState } from 'react';
import pushApiClient from '../../../utils/pushApiClient';
import {
  Box,
  ContentLayout,
  Button,
  HeaderLayout,
  Layout,
  TextInput,
  Stack,
  Alert,
  Typography,
  Card,
  CardBody,
  CardHeader,
  Flex
} from '@strapi/design-system';
import { Check } from '@strapi/icons';

const GenerateCustomerCode = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const validate = () => {
    let isValid = true;

    if (!name || name.length < 1 || name.length > 100) {
      setNameError('Name must be between 1-100 characters');
      isValid = false;
    } else {
      setNameError('');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 255) {
      setEmailError('Must be a valid email (max 255 characters)');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setGeneratedCode(null);

    const result = await pushApiClient.generateCustomerCode(name, email);

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setGeneratedCode(result.data);
    } else {
      if (result.status === 401) {
        setError('Authentication failed - check credentials');
      } else if (result.status === 400) {
        setError('Validation error - check your input');
      } else if (result.status === 429) {
        setError('Rate limit exceeded - please wait and try again');
      } else {
        setError(result.message || 'An error occurred');
      }
    }
  };

  const handleCopyCode = () => {
    if (generatedCode && generatedCode.customerCode) {
      navigator.clipboard.writeText(generatedCode.customerCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleGenerateAnother = () => {
    setName('');
    setEmail('');
    setSuccess(false);
    setGeneratedCode(null);
    setError(null);
  };

  return (
    <Box background="neutral100">
      <Layout>
        <HeaderLayout title="Generate Customer Code" subtitle="Create activation codes for customers" as="h2" />
        <ContentLayout>
          <Stack spacing={4}>
            {error && (
              <Alert closeLabel="Close" variant="danger" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && generatedCode && (
              <Box>
                <Alert closeLabel="Close" variant="success" onClose={() => setSuccess(false)}>
                  Customer Code Generated Successfully!
                </Alert>
                <Box marginTop={4}>
                  <Card>
                    <CardHeader>
                      <Flex direction="row" alignItems="center">
                        <Check />
                        <Typography variant="beta" marginLeft={2}>
                          Generated Code
                        </Typography>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Stack spacing={3}>
                        <Flex direction="row" justifyContent="space-between">
                          <Typography fontWeight="bold">Customer Code:</Typography>
                          <Typography variant="omega" fontWeight="bold" fontSize={5}>
                            {generatedCode.customerCode}
                          </Typography>
                        </Flex>
                        <Flex direction="row" justifyContent="space-between">
                          <Typography fontWeight="bold">Name:</Typography>
                          <Typography>{generatedCode.customer?.name || name}</Typography>
                        </Flex>
                        <Flex direction="row" justifyContent="space-between">
                          <Typography fontWeight="bold">Email:</Typography>
                          <Typography>{generatedCode.customer?.email || email}</Typography>
                        </Flex>
                        <Flex direction="row" justifyContent="space-between">
                          <Typography fontWeight="bold">Status:</Typography>
                          <Typography>Pending Activation</Typography>
                        </Flex>
                        <Box marginTop={4}>
                          <Typography variant="pi" textColor="neutral600">
                            Share this customer code with the customer. They can activate it through the mobile app.
                          </Typography>
                        </Box>
                        <Flex direction="row" gap={2} marginTop={4}>
                          <Button onClick={handleCopyCode} variant="secondary">
                            {copySuccess ? 'Copied!' : 'Copy Code'}
                          </Button>
                          <Button onClick={handleGenerateAnother} variant="tertiary">
                            Generate Another
                          </Button>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                </Box>
              </Box>
            )}

            {!success && (
              <Box padding={4} background="neutral0" hasRadius>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <TextInput
                      label="Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={nameError}
                      hint="1-100 characters"
                      placeholder="Enter customer name"
                    />

                    <TextInput
                      label="Email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={emailError}
                      hint="Valid email, max 255 characters"
                      placeholder="Enter customer email"
                    />

                    <Button type="submit" loading={isLoading} disabled={isLoading} size="L">
                      Generate Customer Code
                    </Button>
                  </Stack>
                </form>
              </Box>
            )}
          </Stack>
        </ContentLayout>
      </Layout>
    </Box>
  );
};

export default GenerateCustomerCode;
