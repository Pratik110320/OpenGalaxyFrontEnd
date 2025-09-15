import React, { useState, useEffect } from 'react';
import {
  Box, Heading, VStack, Text, SimpleGrid, Stat, StatLabel, StatNumber,
  Tabs, TabList, Tab, TabPanels, TabPanel, Avatar, Flex, Tag, Wrap, WrapItem,
  Spinner,
} from '@chakra-ui/react';

const BACKEND_URL = 'http://localhost:8080';

// A small component for a single list item
const InfoItem = ({ title, children }) => (
  <Box p={4} bg="gray.700" borderRadius="md" borderWidth="1px" borderColor="gray.600">
    <Heading size="sm" mb={2}>{title}</Heading>
    {children}
  </Box>
);

const Dashboard = ({ user }) => {
  const [data, setData] = useState({
    myProblems: [],
    mySolutions: [],
    savedProblems: [],
    myCertificates: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const endpoints = {
          myProblems: '/api/problems/me',
          mySolutions: '/api/solutions/me',
          savedProblems: '/api/problems/saved',
          myCertificates: '/api/certificates/my-certificates',
        };

        const requests = Object.values(endpoints).map(endpoint =>
          fetch(`${BACKEND_URL}${endpoint}`, { credentials: 'include' })
        );
        
        const responses = await Promise.all(requests);
        const jsonData = await Promise.all(responses.map(res => res.json()));

        setData({
          myProblems: jsonData[0] || [],
          mySolutions: jsonData[1] || [],
          savedProblems: jsonData[2] || [],
          myCertificates: jsonData[3]?.certificates || [],
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading) {
    return <Flex justify="center" align="center" h="200px"><Spinner size="lg" /></Flex>;
  }

  return (
    <VStack spacing={8} align="stretch">
      <Flex direction={{ base: "column", md: "row" }} align="center" bg="gray.700" p={6} borderRadius="lg">
        <Avatar size="xl" name={user.fullName} src={user.profilePicture} />
        <Box ml={{ md: 6 }} mt={{ base: 4, md: 0 }} textAlign={{ base: "center", md: "left" }}>
          <Heading size="lg">{user.fullName}</Heading>
          <Text color="gray.400">@{user.username}</Text>
        </Box>
      </Flex>
      
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
        <Stat bg="gray.700" p={4} borderRadius="lg" textAlign="center">
          <StatLabel>Points</StatLabel>
          <StatNumber>{user.points}</StatNumber>
        </Stat>
        <Stat bg="gray.700" p={4} borderRadius="lg" textAlign="center">
          <StatLabel>Problems Solved</StatLabel>
          <StatNumber>{user.points}</StatNumber>
        </Stat>
        <Stat bg="gray.700" p={4} borderRadius="lg" textAlign="center">
          <StatLabel>Badges</StatLabel>
          <StatNumber>{user.badges?.length || 0}</StatNumber>
        </Stat>
      </SimpleGrid>

      {user.badges?.length > 0 && (
        <Box>
            <Heading size="md" mb={3}>My Badges</Heading>
            <Wrap>
                {user.badges.map(badge => (
                    <WrapItem key={badge}>
                        <Tag size="lg" colorScheme="teal" variant="solid">{badge}</Tag>
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
      )}

      <Tabs isFitted variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>My Problems ({data.myProblems.length})</Tab>
          <Tab>My Solutions ({data.mySolutions.length})</Tab>
          <Tab>Saved ({data.savedProblems.length})</Tab>
          <Tab>Certificates ({data.myCertificates.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {data.myProblems.map(p => <InfoItem key={p.id} title={p.title}><Text noOfLines={2}>{p.description}</Text></InfoItem>)}
          </TabPanel>
          <TabPanel>
             {data.mySolutions.map(s => <InfoItem key={s.id} title={`Solution for Problem #${s.problemId.slice(-6)}...`}><Text noOfLines={2}>{s.content}</Text></InfoItem>)}
          </TabPanel>
          <TabPanel>
            {data.savedProblems.map(p => <InfoItem key={p.id} title={p.title}><Text noOfLines={2}>{p.description}</Text></InfoItem>)}
          </TabPanel>
          <TabPanel>
            {data.myCertificates.map(c => <InfoItem key={c.id} title={c.courseTitle}><Text>Issued: {c.issuedDate}</Text></InfoItem>)}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default Dashboard;