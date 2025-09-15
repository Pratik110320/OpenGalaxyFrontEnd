import React, { useState } from 'react';
import { Box, Heading, Text, Button, VStack, Textarea, Collapse, useColorModeValue, HStack } from '@chakra-ui/react';

const ProblemItem = ({ problem, onSolve, onLike, onSave }) => {
  const [showSolve, setShowSolve] = useState(false);
  const [solutionText, setSolutionText] = useState('');
  const cardBg = useColorModeValue('gray.700', 'gray.700');
  const hoverBg = useColorModeValue('gray.600', 'gray.600');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSolve(problem.id, solutionText);
    setShowSolve(false);
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderColor="gray.600" borderRadius="lg" bg={cardBg} transition="background 0.2s" _hover={{ bg: hoverBg }}>
      <Heading size="md">{problem.title}</Heading>
      <Text mt={2} color="gray.400">{problem.description}</Text>
      <Text mt={2} fontSize="sm"><em>Posted by: {problem.postedBy?.fullName || 'Unknown'}</em></Text>
      
      <HStack mt={4}>
        <Button colorScheme="teal" onClick={() => setShowSolve(!showSolve)}>
          {showSolve ? 'Cancel' : 'Solve'}
        </Button>
        <Button onClick={() => onLike(problem.id)}>Like ({problem.likes?.length || 0})</Button>
        <Button onClick={() => onSave(problem.id)}>Save</Button>
      </HStack>

      <Collapse in={showSolve} animateOpacity>
        <Box as="form" mt={4} pt={4} borderTopWidth="1px" borderColor="gray.600" onSubmit={handleSubmit}>
          <VStack spacing={3}>
            <Textarea placeholder="Explain your solution here..." value={solutionText} onChange={(e) => setSolutionText(e.target.value)} bg="gray.800" />
            <Button type="submit" colorScheme="green" alignSelf="flex-end">Submit & Accept</Button>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ProblemItem;