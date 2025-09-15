import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';

const Navbar = ({ user, backendUrl }) => {
  return (
    <Box bg="gray.900" px={8} py={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading as="h1" size="lg" color="white">
          OpenGalaxy
        </Heading>
        {!user && (
          <Button
            as="a"
            href={`${backendUrl}/oauth2/authorization/github`}
            colorScheme="teal"
          >
            Login with GitHub
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;