export const USDC_ADDRESS = '0x0eb7B36996Ff2c55D1376D3E85287935Cc8CD617';
export const USDC_DECIMALS = 18;

export const generatePaymentId = () => {
  return '0x' + Array.from(
    { length: 64 }, 
    () => Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Copy to clipboard utility function
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern clipboard API
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  } else {
    // Fallback for older browsers or insecure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Error copying to clipboard', err);
      document.body.removeChild(textArea);
      return false;
    }
  }
};
