import React from 'react';
import { Box, Avatar, Text, Button, useToast, Flex } from '@chakra-ui/react';

const UserProfile = ({ user, onGenerate, onDownload, hasAchievement, certificateId }) => {
  const toast = useToast();

  const handleGenerate = () => {
    onGenerate();
    toast({
      title: 'Generating Certificate...',
      description: "This might take a moment.",
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="gray.700"
      align="center"
      justify="space-between"
    >
      <Flex align="center">
        <Avatar size="lg" src={user.profilePicture} name={user.fullName} />
        <Box ml={4}>
          <Text fontWeight="bold" fontSize="xl">{user.fullName}</Text>
          <Text fontSize="sm" color="gray.400">{user.points} Points</Text>
        </Box>
      </Flex>
      <Box>
        <Button
          colorScheme="blue"
          onClick={handleGenerate}
          isDisabled={!hasAchievement}
          mr={3}
        >
          Generate Certificate
        </Button>
        <Button
          colorScheme="green"
          onClick={onDownload}
          isDisabled={!certificateId}
        >
          Download Certificate
        </Button>
      </Box>
    </Flex>
  );
};

export default UserProfile;