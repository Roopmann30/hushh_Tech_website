import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { careers } from '../../data/career';
import JobDetails from './JobDetails';
import './Career.css';
import { 
  Container, 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Icon, 
  Flex, 
  Divider, 
  SimpleGrid,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
  TagLabel,
  TagLeftIcon,
  AnimatePresence
} from "@chakra-ui/react";
import { MapPin, Clock, ChevronRight, Rocket, DollarSign, Star, Search, Filter } from "lucide-react";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const CareerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = useMemo(() => ['All', ...Object.keys(careers)], []);

  const filteredCareers = useMemo(() => {
    const result: any = {};
    Object.entries(careers).forEach(([dept, jobs]) => {
      if (selectedDept !== 'All' && dept !== selectedDept) return;
      
      const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredJobs.length > 0) {
        result[dept] = filteredJobs;
      }
    });
    return result;
  }, [searchTerm, selectedDept]);

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={10}>
      {/* Main Header */}
      <Flex 
        direction="column"
        align="center"
        justify="center" 
        minHeight="60vh"
        textAlign="center"
        mb={12}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading 
            as="h1" 
            lineHeight="1.1"
            fontWeight="600"
            mb={6}
          >
            <Text 
              as="span" 
              bgGradient="linear(to-r, #00A9E0, #6DD3EF)"
              bgClip="text"
              fontSize={{ base: "5xl", md: "8xl" }}
              letterSpacing="-0.04em"
            >
              Hushh Careers
            </Text>
            <br />
            <Text 
              as="span" 
              color="gray.900"
              fontSize={{ base: "4xl", md: "7xl" }}
              letterSpacing="-0.03em"
              fontWeight="400"
            >
              Shape the Future of AI
            </Text>
          </Heading>
          
          <Text 
            fontSize={{ base: "lg", md: "2xl" }} 
            maxW="3xl" 
            mx="auto" 
            color="gray.500"
            lineHeight="1.6"
            fontWeight="400"
          >
            We're building the next generation of investment intelligence. 
            Join a team of world-class engineers, quants, and visionaries.
          </Text>
        </MotionBox>
      </Flex>

      {/* Search and Filter Section */}
      <Box mb={16} maxW="container.lg" mx="auto">
        <VStack spacing={8}>
          <InputGroup size="lg" maxW="2xl" boxShadow="xl" borderRadius="2xl">
            <InputLeftElement pointerEvents="none" h="full" pl={4}>
              <Icon as={Search} color="gray.400" boxSize={5} />
            </InputLeftElement>
            <Input 
              placeholder="Search roles or locations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
              border="none"
              height="64px"
              pl={14}
              borderRadius="2xl"
              fontSize="lg"
              _focus={{ boxShadow: "0 0 0 2px #00A9E0" }}
            />
          </InputGroup>

          <HStack spacing={3} wrap="wrap" justify="center">
            {departments.map((dept) => (
              <Button
                key={dept}
                size="sm"
                variant={selectedDept === dept ? "solid" : "outline"}
                colorScheme={selectedDept === dept ? "cyan" : "gray"}
                onClick={() => setSelectedDept(dept)}
                borderRadius="full"
                px={6}
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                _hover={{ transform: "translateY(-1px)" }}
              >
                {dept}
              </Button>
            ))}
          </HStack>
        </VStack>
      </Box>

      {/* Career Departments */}
      <VStack spacing={16} align="stretch" maxW="container.lg" mx="auto">
        <AnimatePresence mode="popLayout">
          {Object.entries(filteredCareers).map(([department, jobs], index) => (
            <MotionBox 
              key={department}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <HStack mb={6} justify="space-between" align="center">
                <Heading as="h2" fontSize="2xl" color="gray.800" fontWeight="600">
                  {department}
                </Heading>
                <Tag variant="subtle" colorScheme="cyan" borderRadius="full" size="sm">
                  <TagLabel fontWeight="bold">{jobs.length} Positions</TagLabel>
                </Tag>
              </HStack>
              
              <VStack spacing={4} align="stretch">
                {jobs.map((job) => (
                  <MotionBox 
                    key={job.id} 
                    as={Link} 
                    to={`/career/${job.id}`}
                    p={8}
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="gray.100"
                    _hover={{ 
                      boxShadow: "2xl",
                      borderColor: "cyan.100",
                      transform: "scale(1.01)",
                      textDecoration: "none"
                    }}
                    transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Heading as="h3" fontSize="xl" fontWeight="600" color="gray.900" mb={3}>
                          {job.title}
                        </Heading>
                        <HStack spacing={6}>
                          <HStack spacing={2}>
                            <Icon as={MapPin} color="cyan.500" boxSize={4} />
                            <Text color="gray.500" fontSize="sm" fontWeight="500">{job.location}</Text>
                          </HStack>
                          <HStack spacing={2}>
                            <Icon as={Clock} color="orange.400" boxSize={4} />
                            <Text color="gray.500" fontSize="sm" fontWeight="500">Full-time</Text>
                          </HStack>
                        </HStack>
                      </Box>
                      <Box 
                        bg="gray.50" 
                        p={2} 
                        borderRadius="full" 
                        color="gray.400"
                        _groupHover={{ color: "cyan.500", bg: "cyan.50" }}
                      >
                        <Icon as={ChevronRight} boxSize={6} />
                      </Box>
                    </Flex>
                  </MotionBox>
                ))}
              </VStack>
            </MotionBox>
          ))}
        </AnimatePresence>

        {Object.keys(filteredCareers).length === 0 && (
          <Flex direction="column" align="center" py={20} textAlign="center">
            <Icon as={Filter} boxSize={12} color="gray.200" mb={4} />
            <Text fontSize="xl" color="gray.500">No positions found matching your criteria.</Text>
            <Button mt={4} variant="link" colorScheme="cyan" onClick={() => {setSearchTerm(''); setSelectedDept('All');}}>
              Clear all filters
            </Button>
          </Flex>
        )}
      </VStack>

      {/* Why Work at Hushh Technologies? Section */}
      <Box mt={24} mb={16}>
        <Heading 
          as="h2" 
          fontSize="3xl"
          color="gray.800" 
          mb={16} 
          textAlign="center"
          fontWeight="500"
          letterSpacing="-0.01em"
        >
          Why Work at Hushh Technologies?
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12} maxW="container.lg" mx="auto">
          {/* Benefit 1 */}
          <Box textAlign="center">
            <Flex 
              justifyContent="center" 
              alignItems="center" 
              mb={5}
            >
              <Icon as={Rocket} boxSize={12} color="#FF7171" />
            </Flex>
            <Heading 
              as="h3" 
              fontSize="xl"
              color="gray.800" 
              mb={3}
              fontWeight="500"
            >
              Cutting-Edge Technology
            </Heading>
            <Text 
              color="gray.600"
              fontSize="md"
              lineHeight="tall"
            >
              Work with the latest AI and machine learning technologies
            </Text>
          </Box>

          {/* Benefit 2 */}
          <Box textAlign="center">
            <Flex 
              justifyContent="center" 
              alignItems="center" 
              mb={5}
            >
              <Icon as={DollarSign} boxSize={12} color="#F8B76B" />
            </Flex>
            <Heading 
              as="h3" 
              fontSize="xl"
              color="gray.800" 
              mb={3}
              fontWeight="500"
            >
              Competitive Compensation
            </Heading>
            <Text 
              color="gray.600"
              fontSize="md"
              lineHeight="tall"
            >
              Top-tier salaries, equity, and comprehensive benefits
            </Text>
          </Box>

          {/* Benefit 3 */}
          <Box textAlign="center">
            <Flex 
              justifyContent="center" 
              alignItems="center" 
              mb={5}
            >
              <Icon as={Star} boxSize={12} color="#F8ED62" />
            </Flex>
            <Heading 
              as="h3" 
              fontSize="xl"
              color="gray.800" 
              mb={3}
              fontWeight="500"
            >
              Growth Opportunities
            </Heading>
            <Text 
              color="gray.600"
              fontSize="md"
              lineHeight="tall"
            >
              Learn from industry experts and advance your career
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Benefits Button */}
      <Flex justifyContent="center" mt={16} mb={10}>
        <Button
          as={Link}
          to="/benefits"
          bgGradient="linear-gradient(to right, #00A9E0, #6DD3EF)"
          color="white"
          px={8}
          py={5}
          fontSize="md"
          fontWeight="500"
          borderRadius="full"
          _hover={{ bgGradient: "linear-gradient(to right, #0098cc, #5BC0DC)" }}
          boxShadow="md"
          height="auto"
          className="benefits-button"
        >
          View Full Benefits Package
        </Button>
      </Flex>
    </Container>
  );
};

const Career = () => {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, '');
  
  // Only show the career list on the main career page
  if (normalizedPath === '/career') {
    return <CareerList />;
  }

  return (
    <Routes>
      <Route path="/:jobId" element={<JobDetails />} />
    </Routes>
  );
};

export default Career;