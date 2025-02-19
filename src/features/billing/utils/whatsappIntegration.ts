interface WhatsAppMessage {
  to: string;
  message: string;
  pdfUrl?: string;
}

export const sendWhatsAppBill = async (billData: any, pdfBuffer: Buffer) => {
  try {
    const customer = typeof billData.customerData === 'string' 
      ? JSON.parse(billData.customerData) 
      : billData.customer;

    // Format phone number (ensure it starts with 91 for India)
    const phoneNumber = customer.phone.startsWith('+91') 
      ? customer.phone.substring(3) 
      : customer.phone.startsWith('91') 
        ? customer.phone 
        : `91${customer.phone}`;

    // Create message text
    const messageText = `Dear ${customer.name},\n\n` +
      `Thank you for your purchase at VM Jewellers!\n` +
      `Bill Number: ${billData.billNumber}\n` +
      `Amount: ₹${billData.total}\n\n` +
      `Please find your bill attached.\n\n` +
      `For any queries, please contact us at +91 85878 91402`;

    // Send message with PDF
    const response = await fetch('https://api.whatsapp.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "template",
        template: {
          name: "bill_notification",
          language: {
            code: "en"
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                    filename: `VM_Jewellers_Bill_${billData.billNumber}.pdf`,
                    mime_type: "application/pdf",
                    file: pdfBuffer.toString('base64')
                  }
                }
              ]
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: customer.name
                },
                {
                  type: "text",
                  text: billData.billNumber
                },
                {
                  type: "text",
                  text: `₹${billData.total}`
                }
              ]
            }
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    return true;
  } catch (error) {
    console.error('WhatsApp sending failed:', error);
    return false;
  }
};
