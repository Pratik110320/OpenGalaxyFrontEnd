import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, Text, Avatar, Flex, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

const BACKEND_URL = 'http://localhost:8080';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/public/leaderboard`);
        if (res.ok) {
          setLeaderboard(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      }
    };
    fetchLeaderboard();
  }, []);

  const UserRow = ({ user, rank }) => (
    <Flex align="center" p={3} borderWidth="1px" borderRadius="md" bg="gray.700">
      <Text fontWeight="bold" mr={4}>#{rank}</Text>
      <Avatar size="md" src={user.profilePicture} name={user.fullName} />
      <Box ml={4}>
        <Text fontWeight="bold">{user.fullName}</Text>
        <Text fontSize="sm" color="gray.400">{user.points} Points</Text>
      </Box>
    </Flex>
  );

  return (
    <Box>
      <Heading size="lg" mb={6}>Leaderboard</Heading>
      {leaderboard ? (
        <Tabs isFitted variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab>Weekly</Tab>
            <Tab>Monthly</Tab>
            <Tab>Yearly</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {leaderboard.weekly.map((user, i) => <UserRow key={user.githubId} user={user} rank={i + 1} />)}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {leaderboard.monthly.map((user, i) => <UserRow key={user.githubId} user={user} rank={i + 1} />)}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {leaderboard.yearly.map((user, i) => <UserRow key={user.githubId} user={user} rank={i + 1} />)}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <Text>Loading leaderboard...</Text>
      )}
    </Box>
  );
};

export default Leaderboard;