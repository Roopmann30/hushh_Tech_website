import React from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";

const TermsOfServicePage: React.FC = () => {
  // Navigation for the Sidebar Table of Contents
  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "license", label: "2. Use License" },
    { id: "disclaimer", label: "3. Investment Disclaimer" },
    { id: "account", label: "4. Account Terms" },
    { id: "prohibited", label: "5. Prohibited Uses" },
    { id: "intellectual", label: "6. Intellectual Property" },
    { id: "liability", label: "7. Limitation of Liability" },
    { id: "disclaimer-8", label: "8. Disclaimer" },
    { id: "modifications", label: "9. Modifications" },
    { id: "governing", label: "10. Governing Law" },
    { id: "contact", label: "11. Contact Information" },
  ];

  return (
    <Box bg="#FBFBFD" minH="100vh">
      {/* Header Section */}
      <Box textAlign="center" pt={{ md: '8rem', base: '4rem' }} pb={10}>
        <Heading
          as="h1"
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="500"
          fontFamily="'Playfair Display', serif"
          className="blue-gradient-text"
          mb={4}
        >
          Terms of Service
        </Heading>
        <Text fontSize="sm" color="gray.500" letterSpacing="wide">
          LAST UPDATED: MAY 6, 2026
        </Text>
      </Box>

      <Container maxW="container.xl" pb={20}>
        <HStack align="start" spacing={12}>

          {/* Sidebar Navigation - Sticky for Desktop */}
          <Box
            display={{ base: 'none', lg: 'block' }}
            position="sticky"
            top="100px"
            w="300px"
          >
            <Text fontWeight="600" mb={4} fontSize="xs" color="gray.400" textTransform="uppercase">
              Table of Contents
            </Text>
            <List spacing={3}>
              {sections.map((sec) => (
                <ListItem key={sec.id}>
                  <Link
                    href={`#${sec.id}`}
                    fontSize="sm"
                    color="gray.600"
                    _hover={{ color: "#0AADBC", textDecoration: "none" }}
                    transition="all 0.2s"
                  >
                    {sec.label}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Main Content Area */}
          <VStack
            spacing={12}
            align="stretch"
            flex="1"
            bg="white"
            p={{ base: 6, md: 12 }}
            borderRadius="2xl"
            boxShadow="0 4px 20px rgba(0,0,0,0.03)"
          >
            {/* 1. Acceptance of Terms */}
            <Box id="acceptance" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                1. Acceptance of Terms
              </Heading>
              <Text color="gray.700" lineHeight="1.8">
                By accessing and using Hushh Technologies LLC's ("Hushh") website and services (collectively, the "Services"), you accept and agree to be bound by the terms and provisions of this agreement ("Terms of Service" or "Terms"). If you do not agree to these Terms, please do not use our Services.
              </Text>
              <Text mt={4} color="gray.700" lineHeight="1.8">
                These Terms constitute a legally binding agreement between you and Hushh Technologies LLC. Your continued use of the Services constitutes your acceptance of any modifications to these Terms.
              </Text>
            </Box>

            <Divider />

            {/* 2. Use License */}
            <Box id="license" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                2. Use License
              </Heading>
              <Text mb={4} color="gray.700">
                Permission is granted to temporarily access the materials (information or software) on Hushh's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </Text>
              <List spacing={3} pl={4}>
                {[
                  "Modify or copy the materials;",
                  "Use the materials for any commercial purpose or for any public display (commercial or non-commercial);",
                  "Attempt to decompile or reverse engineer any software contained on Hushh's website;",
                  "Remove any copyright or other proprietary notations from the materials;",
                  "Transfer the materials to another person or \"mirror\" the materials on any other server."
                ].map((item, i) => (
                  <ListItem key={i} display="flex" alignItems="start" color="gray.600" fontSize="sm">
                    <ListIcon as={ChevronRight} color="#0AADBC" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
              <Text mt={4} color="gray.700" lineHeight="1.8">
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by Hushh at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
              </Text>
            </Box>

            <Divider />

            {/* 3. Investment Disclaimer */}
            <Box id="disclaimer" scrollMarginTop="120px" bg="orange.50" p={6} borderRadius="xl">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif" color="orange.800">
                3. Investment Disclaimer
              </Heading>
              <Text mb={4} color="orange.900" lineHeight="1.8">
                Investment involves risk, including the possible loss of principal. Past performance does not guarantee future results. The information provided through our Services is for informational purposes only and should not be construed as investment advice.
              </Text>
              <Text mb={2} fontWeight="600" color="orange.900">Before making any investment decisions, you should:</Text>
              <List spacing={2} pl={4}>
                {[
                  "Consult with a qualified financial advisor;",
                  "Carefully review all offering documents and disclosures;",
                  "Consider your financial situation, investment objectives, and risk tolerance;",
                  "Understand that investments may lose value and you may lose your entire investment."
                ].map((item, i) => (
                  <ListItem key={i} display="flex" alignItems="start" color="orange.800" fontSize="sm">
                    <ListIcon as={ChevronRight} color="orange.500" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
              <Text mt={4} color="orange.900" fontStyle="italic">
                Hushh does not provide investment, legal, or tax advice. Any investment decisions you make are solely your responsibility.
              </Text>
            </Box>

            <Divider />

            {/* 4. Account Terms */}
            <Box id="account" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                4. Account Terms
              </Heading>
              <Text mb={4} color="gray.700" lineHeight="1.8">
                You are responsible for maintaining the security of your account and password. Hushh cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
              </Text>
              <List spacing={3} pl={4}>
                {[
                  "Provide accurate, current, and complete information during registration;",
                  "Maintain and promptly update your account information;",
                  "Keep your password secure and confidential;",
                  "Notify us immediately of any unauthorized use of your account;",
                  "Be responsible for all activities that occur under your account."
                ].map((item, i) => (
                  <ListItem key={i} display="flex" alignItems="start" color="gray.600" fontSize="sm">
                    <ListIcon as={ChevronRight} color="#0AADBC" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider />

            {/* 5. Prohibited Uses */}
            <Box id="prohibited" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                5. Prohibited Uses
              </Heading>
              <Text mb={4} color="gray.700" lineHeight="1.8">
                You may not use our Services for any illegal or unauthorized purpose. You agree not to:
              </Text>
              <List spacing={3} pl={4}>
                {[
                  "Violate any laws in your jurisdiction;",
                  "Transmit any worms, viruses, or destructive code;",
                  "Violate or infringe upon the rights of others;",
                  "Collect or harvest personal information from other users;",
                  "Interfere with or disrupt the Services or servers;",
                  "Impersonate any person or entity;",
                  "Use automated systems to access the Services without permission."
                ].map((item, i) => (
                  <ListItem key={i} display="flex" alignItems="start" color="gray.600" fontSize="sm">
                    <ListIcon as={ChevronRight} color="#0AADBC" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider />

            {/* 6. Intellectual Property */}
            <Box id="intellectual" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                6. Intellectual Property
              </Heading>
              <Text color="gray.700" lineHeight="1.8">
                The Services and their original content, features, and functionality are owned by Hushh Technologies LLC and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </Text>
              <Text mt={4} color="gray.700" lineHeight="1.8">
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Hushh Technologies LLC.
              </Text>
            </Box>

            <Divider />

            {/* 7. Limitation of Liability */}
            <Box id="liability" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                7. Limitation of Liability
              </Heading>
              <Text color="gray.700" lineHeight="1.8">
                In no event shall Hushh Technologies LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </Text>
              <List spacing={3} pl={4} mt={4}>
                {[
                  "Your access to or use of or inability to access or use the Services;",
                  "Any conduct or content of any third party on the Services;",
                  "Any content obtained from the Services;",
                  "Unauthorized access, use, or alteration of your transmissions or content."
                ].map((item, i) => (
                  <ListItem key={i} display="flex" alignItems="start" color="gray.600" fontSize="sm">
                    <ListIcon as={ChevronRight} color="#0AADBC" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider />

            {/* 8. Disclaimer */}
            <Box id="disclaimer-8" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                8. Disclaimer
              </Heading>
              <Text color="gray.700" lineHeight="1.8">
                Your use of the Services is at your sole risk. The Services are provided on an "AS IS" and "AS AVAILABLE" basis. The Services are provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </Text>
              <Text mt={4} color="gray.700" lineHeight="1.8">
                Hushh Technologies LLC does not warrant that the Services will function uninterrupted, secure, or available at any particular time or location; that any errors or defects will be corrected; that the Services are free of viruses or other harmful components; or that the results of using the Services will meet your requirements.
              </Text>
            </Box>

            <Divider />

            {/* 9. Modifications */}
            <Box id="modifications" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                9. Modifications
              </Heading>
              <Text color="gray.700" lineHeight="1.8">
                Hushh reserves the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              </Text>
              <Text mt={4} color="gray.700" lineHeight="1.8">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Services.
              </Text>
            </Box>

            <Divider />

            {/* 10. Governing Law */}
            <Box id="governing" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                10. Governing Law
              </Heading>
              <Text color="gray.700" lineHeight="1.8">
                These Terms shall be governed and construed in accordance with the laws of the State of Washington, United States, without regard to its conflict of law provisions.
              </Text>
              <Text mt={4} color="gray.700" lineHeight="1.8">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </Text>
            </Box>

            <Divider />

            {/* 11. Contact Information */}
            <Box id="contact" scrollMarginTop="120px">
              <Heading as="h2" size="lg" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                11. Contact Information
              </Heading>
              <Box p={6} bg="#FBFBFD" borderRadius="xl" border="1px solid" borderColor="gray.100">
                <VStack align="start" spacing={3}>
                  <Text color="gray.700"><Text as="span" fontWeight="600" w="80px" display="inline-block">Email:</Text> support@hushh.ai</Text>
                  <Text color="gray.700"><Text as="span" fontWeight="600" w="80px" display="inline-block">Phone:</Text> (888) 462-1726</Text>
                  <Text color="gray.700"><Text as="span" fontWeight="600" w="80px" display="inline-block">Address:</Text> 1021 5th St W, Kirkland, WA 98033</Text>
                </VStack>
              </Box>
            </Box>

            {/* Acknowledgment */}
            <Box id="acknowledgment" textAlign="center" pt={10}>
              <Heading as="h2" size="md" mb={4} fontWeight="500" fontFamily="'Playfair Display', serif">
                12. Acknowledgment
              </Heading>
              <Text color="gray.500" fontSize="sm">
                By using our Services, you acknowledge that you have read these Terms of Service and agree to be bound by them.
              </Text>
            </Box>
          </VStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default TermsOfServicePage;