```markdown
# Technical Documentation

## 1. Database Schema

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

## 2. Core Utilities

### Bill Calculations
- Location: `src/features/billing/utils/billCalculations.ts`
- Functions:
  - `generateItemBreakdown`: Generates item quantities and rates
  - `calculateGST`: Handles CGST/SGST and IGST calculations
  - `distributeAmount`: Handles split bill amount distribution

### GSTIN Verification
- Location: `src/features/billing/utils/gstVerification.ts`
- API Integration: SignalX GST Verification
- State Code Mapping

### Database Operations
- Location: `src/lib/db.ts`
- Implementation: Dexie (IndexedDB)
- Key Operations:
  - Bill Creation
  - Customer Management
  - Split Bill Scheduling

### WhatsApp Integration
- Location: `src/features/billing/utils/whatsappIntegration.ts`
- API: WhatsApp Business API
- Functionality:
  - Automatic bill sending
  - PDF attachment
  - Message customization
```
