import React from 'react';
import { Box, FormControl, FormLabel, Input, Textarea, Button, VStack, Heading } from '@chakra-ui/react';

const PostProblemForm = ({ onPost, title, setTitle, description, setDescription }) => {
  return (
    <Box as="form" onSubmit={onPost} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.700">
      <VStack spacing={4}>
        <Heading size="md">Post a New Problem</Heading>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="e.g., Fix the CSS layout"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <Button type="submit" colorScheme="purple" alignSelf="flex-end">
          Post Problem
        </Button>
      </VStack>
    </Box>
  );
};

export default PostProblemForm;