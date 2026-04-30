import React, { useState } from 'react';
import { Box, Text, Flex, Badge, IconButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Report } from '../services/reportService';

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const [isHidden, setIsHidden] = useState(false);

  // Fallback values if the report object doesn't have them yet
  const portfolioValue = report.portfolioValue || "$1,656,064.53";
  const riskLevel = report.riskLevel || "HIGH";

  return (
    <Box
      bg="gray.950"
      p={8}
      borderRadius="3xl"
      border="1px solid"
      borderColor="whiteAlpha.100"
      textAlign="center"
      position="relative"
    >
      <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} letterSpacing="widest">
        TOTAL PORTFOLIO VALUE
      </Text>

      <Flex justify="center" align="center" gap={3} mb={2}>
        <Badge variant="outline" colorScheme="red" borderRadius="full" px={3}>
          RISK: {riskLevel}
        </Badge>
        <Badge variant="outline" colorScheme="gray" borderRadius="full" px={3}>
          HOLDINGS: {report.holdingsCount ?? 0}
        </Badge>
      </Flex>

      <Box cursor="pointer" onClick={() => setIsHidden(!isHidden)}>
        <Text
          fontSize="5xl"
          fontWeight="bold"
          color="white"
          fontFamily="mono"
          className={isHidden ? "blur-md" : ""}
          transition="all 0.3s"
        >
          {isHidden ? "$ ••••••••" : portfolioValue}
        </Text>
      </Box>

      {/* Change Percentage Logic */}
      {/* TODO: Replace with dynamic data from the report object, e.g., report.dailyChange */}
      <Text color={report.dailyChange.isPositive ? "emerald.400" : "red.400"} fontWeight="bold" fontSize="lg" mt={1}>
        {report.dailyChange.isPositive ? '↗' : '↘'} {report.dailyChange.value} ({report.dailyChange.percentage}%)
      </Text>

      <Box mt={6} pt={4} borderTop="1px solid" borderColor="whiteAlpha.100">
        <Link to={`/reports/${report.id}`}>
          <Text color="gray.400" fontSize="sm" _hover={{ color: "white" }}>
            {/* Assuming a property like 'beginningBalance' exists on the report object */}
            Current statement period beginning balance: <b>{report.beginningBalance ?? 'N/A'}</b>
          </Text>
        </Link>
      </Box>
    </Box>
  );
};

export default ReportCard;
