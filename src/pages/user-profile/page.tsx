'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiFileText, FiEdit3 } from "react-icons/fi";
import { useState } from "react"; 

const UserProfilePage = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // State for inputs
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  
  // Mock user data (since user variable was missing)
  const user = { name: "John Doe", email: "john.doe@example.com" };

  const handlePasswordChange = () => {
    if (!passwords.new || passwords.new !== passwords.confirm) {
      return alert("Passwords do not match or are empty!");
    }
    console.log("Updating...", passwords);
    alert("Password change request submitted!");
  };

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={4} align="center" mb={{ base: 8, md: 10 }}>
        <Heading as="h1" size="2xl" fontWeight="light" color={headingColor}>
          Your{" "}
          <Text as="span" fontWeight="500" color="cyan.500">
            Profile
          </Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color={subTextColor} textAlign="center">
          Manage your personal information and account settings.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, md: 8 }} mb={{ base: 6, md: 8 }}>
        {/* Profile Information Card */}
        <Box p={{ base: 5, md: 7 }} borderWidth="1px" borderColor={borderColor} borderRadius="xl" bg={cardBg} boxShadow="md">
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h2" size="lg" fontWeight="medium" color={headingColor}>
              Profile Information
            </Heading>
            <Button size="sm" bg="black" color="white" _hover={{ bg: "yellow.500" }} leftIcon={<Icon as={FiEdit3} />}>
              Edit
            </Button>
          </Flex>
          <VStack spacing={5} align="stretch">
            <FormControl id="fullName">
              <FormLabel color={textColor} fontWeight="medium">Full Name</FormLabel>
              <Input type="text" isReadOnly value={user.name} borderColor={borderColor} _readOnly={{ bg: "gray.50" }}/>
            </FormControl>
            <FormControl id="emailAddress">
              <FormLabel color={textColor} fontWeight="medium">Email Address</FormLabel>
              <Input type="email" isReadOnly value={user.email} borderColor={borderColor} _readOnly={{ bg: "gray.50" }} />
            </FormControl>
          </VStack>
        </Box>

        {/* Change Password Card */}
        <Box p={{ base: 5, md: 7 }} borderWidth="1px" borderColor={borderColor} borderRadius="xl" bg={cardBg} boxShadow="md">
          <Heading as="h2" size="lg" fontWeight="medium" color={headingColor} mb={6}>
            Change Password
          </Heading>
          <VStack spacing={5} align="stretch">
            <FormControl id="currentPassword">
              <FormLabel color={textColor} fontWeight="medium">Current Password</FormLabel>
              <Input 
                type="password" 
                placeholder="Enter current password" 
                borderColor={borderColor}
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              />
            </FormControl>
            <FormControl id="newPassword">
              <FormLabel color={textColor} fontWeight="medium">New Password</FormLabel>
              <Input 
                type="password" 
                placeholder="Enter new password" 
                borderColor={borderColor}
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
            </FormControl>
            <FormControl id="confirmNewPassword">
              <FormLabel color={textColor} fontWeight="medium">Confirm New Password</FormLabel>
              <Input 
                type="password" 
                placeholder="Confirm new password" 
                borderColor={borderColor}
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
            </FormControl>
            <Button
              onClick={handlePasswordChange}
              color="white"
              background="linear-gradient(to right, #00A9E0, #6DD3EF)"
              _hover={{ background: "linear-gradient(to right, #0AADBC, #1CADBC)" }}
              size="lg"
              width="full"
              mt={3}
            >
              Change Password
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* NDA Information Card */}
      <Box p={{ base: 5, md: 7 }} borderWidth="1px" borderColor={borderColor} borderRadius="xl" bg={cardBg} boxShadow="md" textAlign="center">
        <Heading as="h2" size="lg" fontWeight="medium" color={headingColor} mb={6}>
          NDA Information
        </Heading>
        <VStack spacing={4}>
          <Icon as={FiFileText} w={16} h={16} color="cyan.500" />
          <Text color={subTextColor} fontSize="md">
            You haven't submitted an NDA application yet.
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default UserProfilePage;
