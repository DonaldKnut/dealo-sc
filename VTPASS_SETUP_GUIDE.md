# 🚀 VTPass Integration Setup Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup](#step-by-step-setup)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [API Documentation](#api-documentation)

---

## 🎯 Overview

This guide will help you set up VTPass integration for scratch card purchases in your Dealo platform. VTPass is a Nigerian payment gateway that provides access to various services including WAEC, NECO, and JAMB scratch cards.

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] VTPass merchant account
- [ ] API credentials (API Key & Secret Key)
- [ ] Access to VTPass dashboard
- [ ] Valid business registration documents
- [ ] Bank account for settlements

---

## 🔧 Step-by-Step Setup

### Step 1: VTPass Account Registration

1. **Visit VTPass Website**

   ```
   https://vtpass.com
   ```

2. **Click "Register" or "Sign Up"**

   - Fill in your business details
   - Provide valid contact information
   - Upload required documents

3. **Wait for Approval**
   - VTPass will review your application
   - Approval typically takes 24-48 hours
   - You'll receive email confirmation

### Step 2: Get API Credentials

1. **Login to VTPass Dashboard**

   ```
   https://vtpass.com/login
   ```

2. **Navigate to API Section**

   - Go to "Developer" or "API" section
   - Look for "API Keys" or "Credentials"

3. **Generate API Keys**
   - Click "Generate New API Key"
   - Copy both API Key and Secret Key
   - **⚠️ Keep these secure and never share them**

### Step 3: Configure Environment Variables

Add these variables to your `.env.local` file:

```bash
# VTPass Configuration
VTPASS_API_KEY=your_vtpass_api_key_here
VTPASS_SECRET_KEY=your_vtpass_secret_key_here
VTPASS_API_ENDPOINT=https://api.vtpass.com/pay

# Optional: Test Mode
VTPASS_TEST_MODE=true  # Set to false for production
```

### Step 4: Update Application Configuration

1. **Verify VTPass Service Configuration**

   Check `lib/vtpassService.ts`:

   ```typescript
   const VTPASS_CONFIG = {
     apiKey: process.env.VTPASS_API_KEY!,
     secretKey: process.env.VTPASS_SECRET_KEY!,
     apiEndpoint:
       process.env.VTPASS_API_ENDPOINT || "https://api.vtpass.com/pay",
   };
   ```

2. **Update Scratch Card Pricing**

   Modify `app/(dealoapi)/api/scratch-cards/prices/route.ts`:

   ```typescript
   const SCRATCH_CARD_PRICES = {
     WAEC: {
       price: 2500, // Your selling price
       apiPrice: 2200, // VTPass price
       profit: 300, // Your profit
     },
     NECO: {
       price: 2200,
       apiPrice: 1900,
       profit: 300,
     },
     JAMB: {
       price: 6200,
       apiPrice: 5800,
       profit: 400,
     },
   };
   ```

### Step 5: Test Integration

1. **Run Test Purchase**

   ```bash
   npm run dev
   ```

   Navigate to: `http://localhost:3000/scratch-cards`

2. **Test with Small Amount**
   - Start with 1 scratch card
   - Use test phone numbers
   - Verify email delivery

---

## 🔐 Environment Variables Reference

| Variable              | Description            | Required | Example                      |
| --------------------- | ---------------------- | -------- | ---------------------------- |
| `VTPASS_API_KEY`      | Your VTPass API key    | ✅ Yes   | `vtp_1234567890abcdef`       |
| `VTPASS_SECRET_KEY`   | Your VTPass secret key | ✅ Yes   | `vts_abcdef1234567890`       |
| `VTPASS_API_ENDPOINT` | VTPass API endpoint    | ❌ No    | `https://api.vtpass.com/pay` |
| `VTPASS_TEST_MODE`    | Enable test mode       | ❌ No    | `true` or `false`            |

---

## 🧪 Testing

### Test Scenarios

1. **Successful Purchase**

   - ✅ Valid phone number
   - ✅ Sufficient balance
   - ✅ Correct exam type

2. **Error Handling**
   - ❌ Invalid phone number
   - ❌ Insufficient balance
   - ❌ Network timeout
   - ❌ Invalid API credentials

### Test Data

```json
{
  "examType": "WAEC",
  "quantity": 1,
  "customerEmail": "test@example.com",
  "customerPhone": "08012345678",
  "customerName": "Test User",
  "paymentMethod": "card"
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. "Invalid API Credentials" Error

**Problem**: API key or secret is incorrect
**Solution**:

- Double-check credentials in VTPass dashboard
- Ensure no extra spaces in environment variables
- Verify API key format: `vtp_` prefix

#### 2. "Insufficient Balance" Error

**Problem**: VTPass account has low balance
**Solution**:

- Check balance in VTPass dashboard
- Top up your account
  - Contact VTPass support

#### 3. "Network Timeout" Error

**Problem**: API request times out
**Solution**:

- Check internet connection
- Verify VTPass API status
- Increase timeout in code (currently 30 seconds)

#### 4. "Invalid Phone Number" Error

**Problem**: Phone number format is incorrect
**Solution**:

- Ensure Nigerian phone number format: `08012345678`
- Remove any special characters
- Verify number is active

### Debug Mode

Enable debug logging by adding to your environment:

```bash
DEBUG_VTPASS=true
```

This will log detailed API requests and responses.

---

## 📚 API Documentation

### VTPass API Endpoints

| Endpoint   | Method | Description              |
| ---------- | ------ | ------------------------ |
| `/pay`     | POST   | Purchase scratch cards   |
| `/requery` | POST   | Check transaction status |
| `/balance` | GET    | Check account balance    |

### Request Format

```typescript
{
  request_id: "unique_request_id",
  serviceID: "waec_result", // or "neco_result", "jamb_result"
  billersCode: "phone_number",
  variation_code: "waec_result",
  phone: "phone_number",
  amount: 2200
}
```

### Response Format

```typescript
{
  code: "000", // 000 = success
  response_description: "TRANSACTION SUCCESSFUL",
  requestId: "request_id",
  transactionId: "vtpass_transaction_id",
  content: {
    // Scratch card details
  }
}
```

---

## 🔄 Production Deployment

### Before Going Live

1. **Update Environment Variables**

   ```bash
   VTPASS_TEST_MODE=false
   ```

2. **Verify Pricing**

   - Confirm all prices are correct
   - Test with real phone numbers
   - Verify profit margins

3. **Monitor Transactions**

   - Set up logging
   - Monitor error rates
   - Track success rates

4. **Backup Configuration**
   - Document all settings
   - Store credentials securely
   - Create recovery procedures

---

## 📞 Support

### VTPass Support

- **Email**: support@vtpass.com
- **Phone**: +234 1 631 0000
- **Website**: https://vtpass.com/support

### Internal Support

- **Developer**: Check logs in `/logs/vtpass.log`
- **Admin**: Monitor transactions in dashboard
- **Customer**: Contact through platform support

---

## 📝 Notes

- **Security**: Never commit API keys to version control
- **Testing**: Always test in sandbox mode first
- **Monitoring**: Set up alerts for failed transactions
- **Compliance**: Ensure compliance with Nigerian regulations
- **Backup**: Keep backup payment methods ready

---

**Last Updated**: December 2024  
**Version**: 2.0  
**Author**: Dealo Development Team
