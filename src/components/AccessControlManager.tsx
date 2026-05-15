// AccessControlManager.tsx
import { useEffect, useState, useCallback } from "react";
import {
  Spinner,
  Box,
  useToast,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  Flex,
  Badge,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { 
  FiShield, 
  FiClock, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiRefreshCw,
  FiLock,
  FiInfo
} from "react-icons/fi";
import NDARequestModal from "./NDARequestModal";
import NDADocumentModal from "./NDADocumentModal";
import {
  acceptNda,
  checkAccessStatus,
  getNdaMetadata,
} from "../services/access/accessControlApi";

// Placeholder for the community page component
const CommunityPage: React.FC = () => {
  return (
    <Box p={4}>
      <h1>Welcome to the Community</h1>
      {/* Add dropdowns for funds, investors, etc. as needed */}
    </Box>
  );
};

interface AccessControlManagerProps {
  session: any;
}

const AccessControlManager: React.FC<AccessControlManagerProps> = ({ session }) => {
  const [accessStatus, setAccessStatus] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isNdaModalOpen, setIsNdaModalOpen] = useState(false);
  const [ndaMetadata, setNdaMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const loadAccessStatus = useCallback(async (isManualRefresh = false) => {
    if (!session?.access_token) return;
    
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await checkAccessStatus(session.access_token);
      console.log("Access Status:", res);
      setAccessStatus(res);

      if (res === "Not Applied") {
        setIsRequestModalOpen(true);
      } else if (res === "Pending: Waiting for NDA Process") {
        const ndaResponse = await getNdaMetadata(session.access_token);
        if (ndaResponse.status === "success") {
          setNdaMetadata(ndaResponse.metadata);
          setIsNdaModalOpen(true);
        } else {
          toast({
            title: "NDA Metadata Error",
            description: ndaResponse.message || "Error fetching NDA metadata.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } else if (res === "Rejected" && !isManualRefresh) {
        toast({
          title: "Access Restricted",
          description: "Your request was rejected. Please contact support or re-apply if eligible.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (res === "Approved" && isManualRefresh) {
        toast({
          title: "Access Granted",
          description: "Welcome to the community!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error("Error checking access status:", error);
      toast({
        title: "Connection Error",
        description: error.response?.data?.message || "Failed to sync with access control server.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session, toast]);

  // Check the current access status on component mount
  useEffect(() => {
    loadAccessStatus();
  }, [loadAccessStatus]);

  // Called when the user submits the request access form.
  const handleRequestSubmit = async (result: string) => {
    setAccessStatus(result);
    // If the response requires NDA processing, fetch and show NDA modal.
    if (result === "Pending: Waiting for NDA Process") {
      setLoading(true);
      try {
        const ndaResponse = await getNdaMetadata(session.access_token);
        if (ndaResponse.status === "success") {
          setNdaMetadata(ndaResponse.metadata);
          setIsNdaModalOpen(true);
        } else {
          toast({
            title: "Error",
            description: ndaResponse.message || "Error fetching NDA metadata.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } catch (error: any) {
        console.error("Error fetching NDA metadata:", error);
        toast({
          title: "Error",
          description: error.response?.data || "Error fetching NDA metadata.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Called when the user accepts the NDA in the NDA modal.
  const handleNdaAccept = async () => {
    setLoading(true);
    try {
      const response = await acceptNda(session.access_token);
      console.log("Accept NDA Response:", response);
      if (response === "Approved" || response === "Already Approved") {
        toast({
          title: "NDA Accepted",
          description: "Your NDA has been accepted. Welcome to the community!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setAccessStatus("Approved");
        setIsNdaModalOpen(false);
      } else {
        setAccessStatus(response);
      }
    } catch (error: any) {
      console.error("Error accepting NDA:", error);
      toast({
        title: "Error",
        description: error.response?.data || "Could not accept NDA.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <Flex direction="column" align="center" justify="center" minH="60vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} fontWeight="medium" color="gray.500">Verifying security credentials...</Text>
      </Flex>
    );
  }

  // If the access status is approved, show the community page.
  if (accessStatus === "Approved" || accessStatus === "Already Approved") {
    return <CommunityPage />;
  }

  const renderStatusUI = () => {
    let icon = FiClock;
    let iconColor = "blue.400";
    let statusText = "Processing Your Request";
    let description = "We are currently reviewing your profile and NDA. This usually takes 24-48 hours.";
    let badge = <Badge colorScheme="blue">Under Review</Badge>;

    if (accessStatus === "Not Applied") {
      icon = FiLock;
      iconColor = "gray.400";
      statusText = "Access Restricted";
      description = "This area is reserved for verified community members. Please complete your profile to request access.";
      badge = <Badge colorScheme="gray">Not Applied</Badge>;
    } else if (accessStatus === "Rejected") {
      icon = FiAlertCircle;
      iconColor = "red.400";
      statusText = "Application Status: Declined";
      description = "Your access request could not be approved at this time. Please re-apply after 2-3 days or contact support.";
      badge = <Badge colorScheme="red">Rejected</Badge>;
    } else if (accessStatus === "Pending: Waiting for NDA Process") {
      icon = FiInfo;
      iconColor = "orange.400";
      statusText = "NDA Action Required";
      description = "Your profile is approved, but we need you to sign the Non-Disclosure Agreement to continue.";
      badge = <Badge colorScheme="orange">Waiting for Signature</Badge>;
    }

    return (
      <Box
        maxW="600px"
        mx="auto"
        mt={10}
        p={8}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="2xl"
        boxShadow="xl"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Flex
            w={16}
            h={16}
            bg={`${iconColor.split('.')[0]}.50`}
            borderRadius="full"
            align="center"
            justify="center"
          >
            <Icon as={icon} w={8} h={8} color={iconColor} />
          </Flex>

          <VStack spacing={2}>
            <HStack>
              <Heading size="lg" fontWeight="semibold">{statusText}</Heading>
              {badge}
            </HStack>
            <Text color="gray.500" fontSize="lg">
              {description}
            </Text>
          </VStack>

          <VStack w="full" spacing={4}>
            {accessStatus === "Not Applied" && (
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={() => setIsRequestModalOpen(true)}
                leftIcon={<FiCheckCircle />}
              >
                Start Application
              </Button>
            )}
            
            {accessStatus === "Pending: Waiting for NDA Process" && (
              <Button
                colorScheme="orange"
                size="lg"
                w="full"
                onClick={() => setIsNdaModalOpen(true)}
                leftIcon={<FiInfo />}
              >
                Sign NDA Now
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              w="full"
              isLoading={refreshing}
              onClick={() => loadAccessStatus(true)}
              leftIcon={<FiRefreshCw />}
            >
              Check Status Update
            </Button>
          </VStack>

          <Box
            w="full"
            p={4}
            bg="blue.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="blue.100"
          >
            <HStack spacing={3}>
              <Icon as={FiShield} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="blue.700">Privacy & Safety Guaranteed</Text>
                <Text fontSize="xs" color="blue.600" textAlign="left">
                  Your sensitive data and NDA details are encrypted and handled with the highest security standards. We never share your private information.
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Box>
    );
  };

  return (
    <>
      {renderStatusUI()}

      {/* Request access modal */}
      <NDARequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        session={session}
        onSubmit={handleRequestSubmit}
      />

      {/* NDA document modal */}
      <NDADocumentModal
        session={session}
        isOpen={isNdaModalOpen}
        onClose={() => setIsNdaModalOpen(false)}
        ndaMetadata={ndaMetadata}
        onAccept={handleNdaAccept}
      />
    </>
  );
};

export default AccessControlManager;
