import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  useToast,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import PostProblemForm from './components/PostProblemForm';
import ProblemItem from './components/ProblemItem';

const BACKEND_URL = 'http://localhost:8080';

function App() {
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestCertificateId, setLatestCertificateId] = useState(null);
  const [hasNewAchievement, setHasNewAchievement] = useState(false);
  const [newProblemTitle, setNewProblemTitle] = useState('');
  const [newProblemDescription, setNewProblemDescription] = useState('');
  const toast = useToast();

  const fetchProblems = useCallback(async () => {
    const res = await fetch(`${BACKEND_URL}/api/problems`, { credentials: 'include' });
    if (res.ok) setProblems(await res.json());
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/me`, { credentials: 'include' });
        if (res.ok) {
          setUser(await res.json());
          await fetchProblems();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [fetchProblems]);

  const handlePostProblem = async (e) => {
    e.preventDefault();
    if (!newProblemTitle || !newProblemDescription) return;
    const problemData = { title: newProblemTitle, description: newProblemDescription, repoLink: "..." };
    const res = await fetch(`${BACKEND_URL}/api/problems`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(problemData) });
    if (res.ok) {
      toast({ title: "Problem Posted!", status: 'success', duration: 3000, isClosable: true, position: 'top-right' });
      setNewProblemTitle('');
      setNewProblemDescription('');
      await fetchProblems();
    } else {
      toast({ title: "Error", description: "Failed to post problem.", status: 'error', duration: 3000, isClosable: true, position: 'top-right' });
    }
  };

  const handleSolve = async (problemId, solutionText) => {
    if (!solutionText) return;
    const solutionData = { content: solutionText, repoLink: "..." };
    const res = await fetch(`${BACKEND_URL}/api/solutions/${problemId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(solutionData) });
    if (res.ok) {
      const newSolution = await res.json();
      const acceptRes = await fetch(`${BACKEND_URL}/api/solutions/${newSolution.id}/accept`, { method: 'PUT', credentials: 'include' });
      if (acceptRes.ok) {
        toast({ title: "Achievement Unlocked!", description: "You can now generate a certificate.", status: 'success', duration: 5000, isClosable: true, position: 'top-right' });
        setHasNewAchievement(true);
      } else {
        toast({ title: "Error", description: "Could not accept solution.", status: 'error', duration: 3000, isClosable: true, position: 'top-right' });
      }
    } else {
      toast({ title: "Error", description: "Failed to submit solution.", status: 'error', duration: 3000, isClosable: true, position: 'top-right' });
    }
  };
  
  const handleGenerateCertificate = async () => {
    const response = await fetch(`${BACKEND_URL}/api/certificates/generate`, { method: 'POST', credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      setLatestCertificateId(data.certificateId);
      toast({ title: "Certificate Generated!", status: 'success', duration: 3000, isClosable: true, position: 'top-right' });
      setHasNewAchievement(false);
    } else {
      toast({ title: "Error", description: "Failed to generate certificate.", status: 'error', duration: 3000, isClosable: true, position: 'top-right' });
    }
  };

  const handleDownloadCertificate = async () => {
    if (!latestCertificateId) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/certificates/download/${latestCertificateId}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Download failed!');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${latestCertificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
       toast({ title: "Error", description: "Failed to download certificate.", status: 'error', duration: 3000, isClosable: true, position: 'top-right' });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh" bg="gray.800">
        <Spinner size="xl" color="teal.300" />
      </Flex>
    );
  }

  return (
    <Box bg="gray.800" minH="100vh" color="white">
      <Navbar user={user} backendUrl={BACKEND_URL} />
      
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
        gap={8}
        p={8}
      >
        <GridItem colSpan={{ base: 5, md: 3 }}>
          <VStack spacing={6} align="stretch">
            <Heading size="lg">Problems</Heading>
            {problems.length > 0 ? (
              problems.map((p) => <ProblemItem key={p.id} problem={p} onSolve={handleSolve} />)
            ) : (
              <Text>No problems posted yet. Be the first!</Text>
            )}
          </VStack>
        </GridItem>
        
        <GridItem colSpan={{ base: 5, md: 2 }}>
          {user ? (
            <VStack spacing={8} align="stretch">
              <UserProfile
                user={user}
                onGenerate={handleGenerateCertificate}
                onDownload={handleDownloadCertificate}
                hasAchievement={hasNewAchievement}
                certificateId={latestCertificateId}
              />
              <PostProblemForm
                onPost={handlePostProblem}
                title={newProblemTitle}
                setTitle={setNewProblemTitle}
                description={newProblemDescription}
                setDescription={setNewProblemDescription}
              />
            </VStack>
          ) : (
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.700" textAlign="center">
              <Text>Please log in to participate.</Text>
            </Box>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
}

export default App;