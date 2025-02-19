```markdown
# Features Documentation

## 1. Quick Bill Generation

### Status: ✅ Completed
- Location: `src/pages/QuickBill.tsx`
- Features:
  - Customer details input
  - GSTIN verification
  - Amount validation
  - Bill number generation
  - GST calculations
  - Automatic WhatsApp sending

## 2. Split Bill Handling

### Status: 🚧 In Progress
- Location: `src/lib/eodBillProcessor.ts`
- Features:
  - Amount distribution
  - Date scheduling
  - EOD processing
  - Bill number sequencing

## 3. Bill Preview

### Status: ✅ Completed
- Location: `src/components/BillPreview.tsx`
- Features:
  - Print layout
  - GST calculations
  - Item breakdown
  - Total calculations

## 4. Customer Management

### Customer Database
- Status: ✅ Completed
- Location: `src/lib/db.ts`
- Features:
  - Customer storage
  - History tracking
  - Purchase statistics

### Customer Search
- Status: ❌ Pending
- Planned Features:
  - Auto-complete
  - History lookup
  - Quick fill

## 5. Reports

### GST Reports
- Status: ❌ Pending
- Planned Features:
  - GSTR-1 format
  - Monthly summaries
  - HSN summary

### Sales Reports
- Status: ❌ Pending
- Planned Features:
  - Daily/Monthly/Yearly
  - Customer-wise
  - Split bill tracking
```
