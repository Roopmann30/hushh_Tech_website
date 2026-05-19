import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Report } from '../services/reportService';
import { formatShortDate } from '../utils/dateFormatter';

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  return (
    <Box as="article" mb={6}>
      {/* Date in red, bold */}
      <Text
        as="time"
        dateTime={report.date}
        color="red.600"
        fontWeight="500"
        fontSize={{ base: "sm", md: "md" }}
        mb={1}
        display="block"
      >
        {formatShortDate(report.date)}
      </Text>
      
      {/* Title as a link */}
      <Link to={`/reports/${report.id}`}>
        <Text
          as="h3"
          color="gray.900"
          fontSize={{ base: "md", md: "lg" }}
          _hover={{ textDecoration: "underline" }}
        >
          {report.title || 'Untitled Report'}
        </Text>
      </Link>
    </Box>
  );
};

export default ReportCard; 