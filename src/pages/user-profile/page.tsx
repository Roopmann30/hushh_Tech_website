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
  HStack,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { FiFileText, FiEdit3, FiSave, FiX, FiLock } from "react-icons/fi";
import { useAuthSession } from "../../auth/AuthSessionProvider";
import { useState, useEffect } from "react";

const UserProfilePage = () => {
  const { user } = useAuthSession();
  const toast = useToast();
  
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Hushh User",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated.",
      description: "We've updated your profile information locally.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password Change Requested",
      description: "In a real app, this would trigger a password reset flow.",
      status: "info",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={4} align="center" mb={{ base: 8, md: 10 }}>
        <Avatar size="xl" name={profileData.fullName} mb={2} boxSize="100px" border="4px solid" borderColor="cyan.400" />
        <Heading as="h1" size="2xl" fontWeight="light" color={headingColor} textAlign="center">
          Your{" "}
          <Text as="span" fontWeight="500" className="blue-gradient-text" bgClip="text">
            Profile
          </Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color={subTextColor} textAlign="center" maxW="600px">
          Manage your personal information and account settings to keep your Hushh experience secure.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, md: 8 }} mb={{ base: 6, md: 8 }}>
        {/* Profile Information Card */}
        <Box
          p={{ base: 5, md: 7 }}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="2xl"
          bg={cardBg}
          boxShadow="xl"
          transition="transform 0.2s"
          _hover={{ transform: "translateY(-2px)" }}
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h2" size="lg" fontWeight="semibold" color={headingColor}>
              Information
            </Heading>
            {!isEditing ? (
              <Button
                size="sm"
                bg="black"
                color="white"
                _hover={{ bg: "yellow.500", transform: "scale(1.05)" }}
                leftIcon={<Icon as={FiEdit3} />}
                onClick={() => setIsEditing(true)}
                borderRadius="full"
                px={6}
              >
                Edit
              </Button>
            ) : (
              <HStack spacing={2}>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  leftIcon={<Icon as={FiX} />}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  colorScheme="cyan"
                  leftIcon={<Icon as={FiSave} />}
                  onClick={handleSaveProfile}
                  borderRadius="full"
                  px={6}
                >
                  Save
                </Button>
              </HStack>
            )}
          </Flex>
          <VStack spacing={5} align="stretch">
            <FormControl id="fullName">
              <FormLabel color={textColor} fontWeight="medium" fontSize="sm">Full Name</FormLabel>
              <Input 
                type="text" 
                placeholder="Your full name" 
                readOnly={!isEditing} 
                value={profileData.fullName} 
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                borderColor={borderColor} 
                _readOnly={{ bg: "gray.50", cursor: "default", border: "none" }}
                borderRadius="lg"
                focusBorderColor="cyan.400"
              />
            </FormControl>
            <FormControl id="emailAddress">
              <FormLabel color={textColor} fontWeight="medium" fontSize="sm">Email Address</FormLabel>
              <Input 
                type="email" 
                placeholder="Your email address" 
                isReadOnly 
                value={profileData.email} 
                borderColor={borderColor} 
                _readOnly={{ bg: "gray.50", cursor: "default", border: "none" }} 
                borderRadius="lg"
              />
              <Text fontSize="xs" color="gray.400" mt={1}>Email cannot be changed directly.</Text>
            </FormControl>
          </VStack>
        </Box>

        {/* Change Password Card */}
        <Box
          p={{ base: 5, md: 7 }}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="2xl"
          bg={cardBg}
          boxShadow="xl"
          transition="transform 0.2s"
          _hover={{ transform: "translateY(-2px)" }}
        >
          <Heading as="h2" size="lg" fontWeight="semibold" color={headingColor} mb={6}>
            Security
          </Heading>
          <VStack spacing={5} align="stretch">
            <FormControl id="currentPassword">
              <FormLabel color={textColor} fontWeight="medium" fontSize="sm">Current Password</FormLabel>
              <Input type="password" placeholder="••••••••" borderColor={borderColor} borderRadius="lg" focusBorderColor="cyan.400" />
            </FormControl>
            <FormControl id="newPassword">
              <FormLabel color={textColor} fontWeight="medium" fontSize="sm">New Password</FormLabel>
              <Input type="password" placeholder="••••••••" borderColor={borderColor} borderRadius="lg" focusBorderColor="cyan.400" />
            </FormControl>
            <Button
              color="white"
              background="linear-gradient(to right, #00A9E0, #6DD3EF)"
              _hover={{ background: "linear-gradient(to right, #0AADBC, #1CADBC)", transform: "scale(1.01)" }}
              _active={{ transform: "scale(0.98)" }}
              size="lg"
              width="full"
              mt={3}
              borderRadius="full"
              leftIcon={<Icon as={FiLock} />}
              onClick={handlePasswordChange}
            >
              Update Password
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* NDA Information Card */}
      <Box
        p={{ base: 5, md: 7 }}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="2xl"
        bg={cardBg}
        boxShadow="xl"
        textAlign="center"
        transition="transform 0.2s"
        _hover={{ transform: "translateY(-2px)" }}
      >
        <Heading as="h2" size="lg" fontWeight="semibold" color={headingColor} mb={6}>
          NDA Verification
        </Heading>
        <VStack spacing={6}>
          <Box position="relative">
            <Icon as={FiFileText} w={16} h={16} color="cyan.400" />
            <Box position="absolute" top="-2" right="-2" bg="orange.400" w={4} h={4} borderRadius="full" border="2px solid white" />
          </Box>
          <VStack spacing={2}>
            <Text color={textColor} fontSize="lg" fontWeight="medium">
              NDA Status: Not Started
            </Text>
            <Text color={subTextColor} fontSize="md" maxW="500px">
              To access sensitive business intelligence and investment opportunities, you need to have a signed Non-Disclosure Agreement on file.
            </Text>
          </VStack>
          <Button 
            colorScheme="cyan" 
            variant="outline" 
            size="lg" 
            borderRadius="full" 
            px={10}
            _hover={{ bg: "cyan.50" }}
          >
            Start NDA Process
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default UserProfilePage;