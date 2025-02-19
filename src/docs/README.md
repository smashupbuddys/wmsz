```markdown
# VM Jewellers Billing System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Database Schema](#database-schema)
5. [API Documentation](#api-documentation)
6. [User Guide](#user-guide)
7. [WhatsApp Integration](#whatsapp-integration)
8. [Split Bill Handling](#split-bill-handling)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)
12. [License](#license)

## System Overview
Billing system for VM Jewellers with features for bill generation, GST handling, and split bill management.

## Features
- Quick Bill Generation
- GSTIN Verification
- Split Bill Handling
- Bill Preview and Printing
- Customer Management
- Reports Generation
- WhatsApp Integration

## Technical Architecture
- Frontend: React, Tailwind CSS
- Database: Dexie (IndexedDB)
- Utilities: Custom functions for calculations, validation, and API calls

## Database Schema

### Bills Table
```typescript
interface Bill {
  id: string;
  billNumber: string;
  customerData: string; // JSON
  amount: number;
  items: string; // JSON
  gstType: string;
  gstAmount: number;
  total: number;
  splitGroupId?: string;
  splitIndex?: number;
  totalSplits?: number;
  createdAt: string;
}
```

### Customers Table
```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  state: string;
  idType: string;
  idNumber: string;
  address?: string;
  lastBillDate: string;
  totalBills: number;
  totalAmount: number;
  createdAt: string;
}
```

### ScheduledSplitBills Table
```typescript
interface ScheduledSplitBill {
  id: string;
  originalBillId: string;
  scheduledDate: string;
  amount: number;
  customerData: string;
  splitIndex: number;
  totalSplits: number;
  status: string;
  errorMessage?: string;
  generatedBillId?: string;
  generatedBillNumber?: string;
  generatedAt?: string;
  createdAt: string;
}
```

### Settings Table
```typescript
interface Settings {
  id: string;
  billNumberSequence: number;
}
```

## API Documentation
(Not applicable for this project as it doesn't have a backend API)

## User Guide

### Quick Bill Generation
1. Enter customer details
2. Select ID type (GSTIN/Aadhar/PAN)
3. Enter amount
4. Review generated items
5. Generate bill

### GSTIN Verification
- Enter 15-digit GSTIN
- System auto-verifies and fills:
  - Company name
  - Address
  - State

### Split Bill Handling
- System automatically detects if amount exceeds threshold
- Thresholds:
  - Delhi: ₹99,900
  - Other States: ₹49,900
- Shows split preview before generation

### Bill Management
- Access from Bills page
- Search by:
  - Bill number
  - Customer name
  - Phone number
- Filter by date range

### Print/Share Bills
1. Click 'View' on any bill
2. Preview opens
3. Options:
   - Print
   - Share (Coming soon)
   - Download (Coming soon)

## WhatsApp Integration
- Automatic bill sending after generation
- PDF attachment
- Customized message template
- Error handling
- Status tracking

### Setup
1. Get a WhatsApp Business API key
2. Set the `WHATSAPP_API_KEY` environment variable
3. Ensure phone numbers are in the correct format (91XXXXXXXXXX)

### Message Template
```
Dear {{customer_name}},

Thank you for your purchase at VM Jewellers!
Bill Number: {{bill_number}}
Amount: ₹{{bill_amount}}

Please find your bill attached.

For any queries, please contact us at +91 85878 91402
```

### Error Handling
- WhatsApp API errors
- PDF generation errors
- Network issues
- Invalid phone numbers

## Split Bill Handling
- Automatic split bill generation for amounts exceeding thresholds
- Thresholds:
  - Delhi: ₹99,900
  - Other States: ₹49,900
- Split bill scheduling
- EOD processing for sequential bill numbers

## Security
- Input validation
- Data sanitization
- Secure storage (IndexedDB)
- Password protection (To be implemented)

## Troubleshooting
- Issue: Bill generation fails
  - Solution: Check network connection, validate input data, and try again.
- Issue: WhatsApp message not sent
  - Solution: Verify API key, phone number format, and message template.
- Issue: Split bill not generated
  - Solution: Check scheduled date, EOD processing status, and error logs.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit a pull request

## License
MIT License
```
