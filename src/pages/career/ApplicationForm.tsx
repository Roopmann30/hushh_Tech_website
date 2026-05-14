import React, { useCallback, useMemo, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Button, VStack, Text, useToast, Box, Select,
  InputGroup, InputLeftElement, Icon, HStack
} from '@chakra-ui/react';
import { FiUser, FiMail, FiPhone, FiLink, FiMapPin, FiSend } from 'react-icons/fi';
import { useAuthSession } from '../../auth/AuthSessionProvider';
import { useEffect } from 'react';

interface ApplicationFormProps {
  jobTitle: string;
  jobLocation: string;
  onClose: () => void;
}

type ApplicationFormState = {
  firstName: string;
  lastName: string;
  email: string;
  collegeEmail: string;
  officialEmail: string;
  phone: string;
  resumeLink: string;
  college: string; // value (LPU/MIT)
};

const ALLOWED_COLLEGES = [
  { value: 'LPU', label: 'Lovely Professional University (LPU)' },
  { value: 'MIT', label: 'Manipal Institute of Technology (MIT)' },
];

const initialState: ApplicationFormState = {
  firstName: '', lastName: '', email: '',
  collegeEmail: '', officialEmail: '', phone: '',
  resumeLink: '', college: '',
};

const ApplicationForm = ({ jobTitle, jobLocation, onClose }: ApplicationFormProps) => {
  const { user } = useAuthSession();
  const [formData, setFormData] = useState<ApplicationFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Pre-fill user data when available
  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.full_name || "";
      const nameParts = fullName.split(" ");
      const first = nameParts[0] || "";
      const last = nameParts.slice(1).join(" ") || "";
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || first || "",
        lastName: prev.lastName || last || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const allowedCollegeValues = useMemo(
    () => new Set(ALLOWED_COLLEGES.map(({ value }) => value)), []
  );

  const updateFormField = useCallback(
    <K extends keyof ApplicationFormState>(field: K, value: ApplicationFormState[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    }, []
  );

  const isValidUrl = (url: string) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sanitized: ApplicationFormState = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        collegeEmail: formData.collegeEmail.trim(),
        officialEmail: formData.officialEmail || 'not required', // Fallback for commented UI
        phone: formData.phone.trim(),
        resumeLink: formData.resumeLink.trim(),
        college: formData.college.trim(),
      };

      // Validation
      const required: (keyof ApplicationFormState)[] = [
        'firstName', 'lastName', 'email', 'collegeEmail', 'phone', 'resumeLink', 'college'
      ];

      const missing = required.find(f => !sanitized[f]);
      if (missing) throw new Error('Please complete all required fields');

      if (sanitized.phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      if (!allowedCollegeValues.has(sanitized.college)) {
        throw new Error('Please select a valid college option');
      }

      if (!isValidUrl(sanitized.resumeLink)) {
        throw new Error('Please enter a valid resume link');
      }

      const selectedCollege =
        ALLOWED_COLLEGES.find(({ value }) => value === sanitized.college)?.label ?? sanitized.college;

      const applicationData = {
        ...sanitized,
        college: selectedCollege,           // label
        collegeValue: sanitized.college,    // value (LPU/MIT)
        jobTitle,
        jobLocation,
        submittedAt: new Date().toISOString(),
      };

      const appsScriptUrl = (import.meta as any).env.VITE_APPS_SCRIPT_URL as string;
      if (!appsScriptUrl) throw new Error('Apps Script URL not configured');

      const resp = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, // avoids CORS preflight
        body: JSON.stringify(applicationData),
      });

      const text = await resp.text();
      let data: any = null; try { data = text ? JSON.parse(text) : null; } catch { }

      if (!resp.ok || !data?.success) {
        throw new Error(data?.error || text || 'Submission failed');
      }

      toast({ title: 'Application submitted successfully!', status: 'success', duration: 5000, isClosable: true });
      setFormData(initialState);
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      toast({
        title: 'Application failed',
        description: err instanceof Error ? err.message : 'Error submitting application.',
        status: 'error', duration: 6000, isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg" isCentered motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl" mx={4} boxShadow="2xl" overflow="hidden">
        <ModalHeader borderBottomWidth="1px" py={5} px={6}>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">Apply for {jobTitle}</Text>
            <HStack color="gray.500" fontSize="xs" fontWeight="normal">
              <Icon as={FiMapPin} />
              <Text>{jobLocation}</Text>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton top={4} />
        <ModalBody pb={8} pt={6} px={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500">First Name</FormLabel>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiUser} color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      placeholder="First Name"
                      value={formData.firstName} 
                      onChange={(e) => updateFormField('firstName', e.target.value)} 
                      borderRadius="lg"
                      focusBorderColor="cyan.400"
                      bg="gray.50"
                      _hover={{ bg: "gray.100" }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500">Last Name</FormLabel>
                  <Input 
                    placeholder="Last Name"
                    value={formData.lastName} 
                    onChange={(e) => updateFormField('lastName', e.target.value)} 
                    borderRadius="lg"
                    focusBorderColor="cyan.400"
                    bg="gray.50"
                    _hover={{ bg: "gray.100" }}
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500">Personal Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    type="email" 
                    placeholder="you@example.com"
                    value={formData.email} 
                    onChange={(e) => updateFormField('email', e.target.value)} 
                    borderRadius="lg"
                    focusBorderColor="cyan.400"
                    bg="gray.50"
                    _hover={{ bg: "gray.100" }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500">College Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    type="email" 
                    placeholder="college-id@university.edu"
                    value={formData.collegeEmail} 
                    onChange={(e) => updateFormField('collegeEmail', e.target.value)} 
                    borderRadius="lg"
                    focusBorderColor="cyan.400"
                    bg="gray.50"
                    _hover={{ bg: "gray.100" }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500">Phone Number</FormLabel>
                <Box
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  p={1}
                  bg="gray.50"
                  transition="all 0.2s"
                  _hover={{ bg: "gray.100", borderColor: "gray.300" }}
                  _focusWithin={{ bg: "white", borderColor: "cyan.400", boxShadow: "0 0 0 1px #4FD1C5" }}
                >
                  <PhoneInput
                    country="in"
                    value={formData.phone}
                    onChange={(phone) => updateFormField('phone', phone)}
                    inputStyle={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', background: 'transparent' }}
                    containerStyle={{ border: 'none' }}
                    buttonStyle={{ border: 'none', background: 'none', paddingLeft: '8px' }}
                  />
                </Box>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500">College / Institution</FormLabel>
                <Select
                  placeholder="Select your college"
                  value={formData.college}
                  onChange={(e) => updateFormField('college', e.target.value)}
                  borderRadius="lg"
                  focusBorderColor="cyan.400"
                  bg="gray.50"
                  _hover={{ bg: "gray.100" }}
                >
                  {ALLOWED_COLLEGES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500">Resume Link</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLink} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="url"
                    value={formData.resumeLink}
                    onChange={(e) => updateFormField('resumeLink', e.target.value)}
                    placeholder="https://drive.google.com/..."
                    borderRadius="lg"
                    focusBorderColor="cyan.400"
                    bg="gray.50"
                    _hover={{ bg: "gray.100" }}
                  />
                </InputGroup>
                <Text fontSize="10px" color="gray.500" mt={1}>Ensure the link is viewable by anyone with the link</Text>
              </FormControl>

              <Button 
                type="submit" 
                size="lg" 
                isLoading={loading} 
                w="100%" 
                mt={3}
                borderRadius="full"
                background="linear-gradient(to right, #00A9E0, #6DD3EF)"
                color="white"
                _hover={{ background: "linear-gradient(to right, #0AADBC, #1CADBC)", transform: "translateY(-1px)", boxShadow: "xl" }}
                _active={{ transform: "translateY(0)" }}
                leftIcon={<Icon as={FiSend} />}
                fontSize="sm"
                fontWeight="bold"
                letterSpacing="wide"
              >
                SUBMIT APPLICATION
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ApplicationForm;