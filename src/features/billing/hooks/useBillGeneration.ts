// Add to existing imports
import { sendWhatsAppBill } from '../utils/whatsappIntegration';
import { generatePDF } from '../utils/pdfGeneration';

// Update the generateBill function
export const useBillGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const generateBill = async (
    customer: Customer,
    amount: number,
    options?: {
      isPartOfSplit?: boolean;
      splitIndex?: number;
      totalSplits?: number;
    }
  ): Promise<Bill | null> => {
    setIsGenerating(true);
    setError(null);
    setWhatsappStatus('idle');

    try {
      // Generate bill data
      const items = generateItemBreakdown(amount);
      const itemsWithGST = calculateGST(items, customer.state);
      
      const billNumber = await db.getNextBillNumber();
      const billId = crypto.randomUUID();

      const billData: Bill = {
        id: billId,
        billNumber: `INV${billNumber.toString().padStart(6, '0')}`,
        customer,
        items: itemsWithGST,
        amount: items.reduce((sum, item) => sum + item.amount, 0),
        gstType: customer.state.toLowerCase() === 'delhi' ? 'CGST_SGST' : 'IGST',
        gstAmount: itemsWithGST.reduce((sum, item) => sum + (item.igst || (item.cgst! + item.sgst!)), 0),
        total: amount,
        date: new Date().toISOString(),
        ...options,
        createdAt: new Date().toISOString()
      };

      // Save bill to database
      await db.createBill(billData);

      // Generate PDF
      setWhatsappStatus('sending');
      const pdfBuffer = await generatePDF(billData);

      // Send WhatsApp message
      const whatsappResult = await sendWhatsAppBill(billData, pdfBuffer);
      setWhatsappStatus(whatsappResult ? 'sent' : 'failed');

      if (!whatsappResult) {
        console.error('Failed to send WhatsApp message');
        // Still return bill data even if WhatsApp fails
      }

      return billData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate bill');
      setWhatsappStatus('failed');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateBill,
    isGenerating,
    error,
    whatsappStatus
  };
};
