// Add to handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const numAmount = parseFloat(amount);
    const bill = await generateBill(formData, numAmount);

    if (bill) {
      // Show appropriate message based on WhatsApp status
      if (whatsappStatus === 'sent') {
        alert(`Bill generated successfully and sent via WhatsApp!`);
      } else if (whatsappStatus === 'failed') {
        alert(`Bill generated successfully but WhatsApp sending failed. Please try sending manually.`);
      }

      // Reset form
      setFormData({
        name: '',
        phone: '',
        state: '',
        idType: 'GSTIN',
        idNumber: '',
        address: ''
      });
      setAmount('');
    }
  } catch (error) {
    console.error('Error generating bill:', error);
    alert('Failed to generate bill. Please try again.');
  }
};
