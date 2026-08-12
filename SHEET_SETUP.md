# Ntuma Admin Dashboard - Google Sheets Setup

This guide explains how to set up the Google Sheets backend for the Ntuma Admin Dashboard.

## Service Account Setup (Configured)

Your application is configured to connect directly to Google Sheets using a **Google Service Account**.

### 1. Share the Google Sheet with Service Account
In your Google Sheet (`1XZB_IFr6o5TBYDlI34UlV0EyISUMTvvNBPDI_i1Ocr4`), click the **Share** button in the top right corner and grant **Editor** access to:
```
ntuma-45@ntuma-505218.iam.gserviceaccount.com
```

### 2. Environment Variables (.env.local)
The `.env.local` file contains:
```env
GOOGLE_SHEET_ID=1XZB_IFr6o5TBYDlI34UlV0EyISUMTvvNBPDI_i1Ocr4
GOOGLE_SERVICE_ACCOUNT_EMAIL=ntuma-45@ntuma-505218.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### 3. Sheet Tabs & Headers
The API automatically verifies and creates missing tabs and headers when requests are made:
- **Categories**: `id`, `name`, `description`, `createdAt`
- **Products**: `id`, `name`, `category`, `price`, `unit`, `description`, `createdAt`
- **Orders**: `id`, `createdAt`, `customerName`, `customerPhone`, `location`, `budget`, `total`, `status`
- **OrderItems**: `id`, `orderId`, `category`, `productName`, `qty`, `unit`, `price`, `subtotal`, `isCustom`
