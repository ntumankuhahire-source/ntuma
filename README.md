# Ntuma — E-Commerce & Fresh Grocery Delivery Platform

Comprehensive technical documentation, technology stack, environment variables, credentials, security keys, database configuration, and usage guide for the **Ntuma (Ntuma Nkuhahire)** platform.

---

## 📌 Executive Summary

**Ntuma Nkuhahire** is a full-featured e-commerce and fresh produce delivery platform serving customers in Rwanda. It offers intuitive category and product browsing, custom produce items creation, shopping cart management, seamless checkout with budget targeting, verifiable digital invoice receipts with QR codes, email notifications, and an internal administrative dashboard backed by Google Sheets as a real-time database.

---

## 🛠️ Technology Stack & Dependencies

### Core Framework & Language
* **Framework**: Next.js 14.2 (App Router & React Server Components / API Routes)
* **Library**: React 18.3
* **Language**: TypeScript 6.0

### User Interface & Styling
* **Styling Engine**: Tailwind CSS 3.4, PostCSS, Autoprefixer
* **Icons**: Lucide React
* **Animations**: Framer Motion 13.0
* **Typography**: Google Inter & Modern UI Typography System

### Backend & Database Architecture
* **Primary Database**: Google Sheets API (`googleapis` v174 Node.js SDK)
* **Authentication**: Firebase Authentication SDK (v12) (Email/Password & Google Sign-In)
* **Admin Guard**: Custom Next.js Cookie Middleware (`middleware.ts`)
* **Apps Script Backup**: Google Apps Script (`Code.gs`) Web App fallback endpoint

### Email & Verification Infrastructure
* **Email Service**: Nodemailer v9 (SMTP via Gmail App Passwords)
* **Receipt Verification**: SHA-256 Web Crypto API deterministic HMAC hash (`receiptHash.ts`)
* **QR Code Engine**: `qrcode` v1.5
* **Document Export**: `html2canvas` v1.4 & `jsPDF` v4.2

---

## 🔑 Environment Variables, Passwords & Secret Keys

Below is the complete inventory of keys, passwords, credentials, and API configuration used across the application. These parameters are stored in `.env.local`:

```env
# ==============================================================================
# 1. ADMIN DASHBOARD AUTHENTICATION
# ==============================================================================
# Passphrase required to access the /admin dashboard panel
ADMIN_PASSPHRASE=ntuma2026

# Session Cookie set upon successful admin login:
# Cookie Name: ntuma_admin_session
# Cookie Value: authenticated

# ==============================================================================
# 2. RECEIPT VERIFICATION & SECURITY KEYS
# ==============================================================================
# Domain / App base URL (Defaults to https://ntumankuhahire.com if unset)
NEXT_PUBLIC_APP_URL=https://ntumankuhahire.com

# SHA-256 HMAC Secret Key used to generate & verify receipt QR code signatures
NEXT_PUBLIC_NTUMA_SECRET=ntumankuhahire_secret_key_2026
NEXT_PUBLIC_TECHLAB_SECRET=ntumankuhahire_secret_key_2026

# ==============================================================================
# 3. GOOGLE SHEETS DATABASE CONFIGURATION
# ==============================================================================
# Google Sheet ID used as the live database
GOOGLE_SHEET_ID=1XZB_IFr6o5TBYDlI34UlV0EyISUMTvvNBPDI_i1Ocr4

# Google Service Account IAM Email
GOOGLE_SERVICE_ACCOUNT_EMAIL=ntuma-45@ntuma-505218.iam.gserviceaccount.com

# Google Service Account Private Key (RSA 2048-bit)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDWRGO6HaO4VI4x\nyEgINptS+ML6swV/Mgkq4q6DVdosQzDAgMT1RBWhYeNYTEdcF4+fDfPOb6qJExno\nDNwXz1AnLzzgem/tFXC12ejawmV3BttIOpTghbfTBGRh7nDmdlf4SmxAxC7mNGfX\n0n/fOSOMv6JR5M5LMzQwXRvgMMVVrrnTn0qBQ1t5tkJ73t3cttLWiy4ZR0uD4bQM\nsNOQblzKJqJXkXTrdX/luctHMCi0CJ6SBCPy0E7zvw3a6WABDipg1jch7xMSxBOC\nrwvWaAU2xPvAU3uvPj0wGv61Sijo/AM8Khu/2n3XUhhfNAHNl2/KU06IYKMHn32Z\nDh8cwjUNAgMBAAECggEAEeUlVRp7nX4GYDcDeRgicdQP6MNB3sUtidTj0Vk+vvqf\nnDxE9t0IV3Gm/K1mOlVHa/fM2H1wB0G+pKhKS3zHi3ZBBdiD94+WWcHI1lhtA/th\nHg+ydmwElc2kmp9A86aHo1eH4gLgjd5rm9VbU6fghbVNl7xd1F8C6VUlalx4Zrbp\nZe2i3x3E/4cw+g0xSqC22fMP3HyQEQhVJFCis960ONK7bQreh9LnkdUCHrNAKcgV\nLDm9KN5FS/3M3TjYMJA/vHXZwNGjnkFHr1uttbBHi+j6YBFCb14H+nBbvkzT8Z3y\n4C55StGEqpU8fsLuegvGVZ9esLwJG4X4nLT6iiTw+wKBgQD3CVAQhQMLWQa8S+6G\nyxV06P1rlV/kAIMV3tWuTL8MYgm+yOtgBXcq4nZIE4ik/7PMKw3ZNz3FjpINGUF2\nCuvU4tsDb7jaBuFJz6+rDoEQkyQAotjepkBIaMu+kSKO055565Hb0VR+myIrqNNQ\ndP5cbhg5QP2CZi/9TwqESkeTGwKBgQDeCrAZI/P6ShGmKsk/P1816Gm7VWrT7GXt\n6pwq+F1kBpkNwUmou11sD0e5YEGhcvskGKwAeqJoXN6TN9v/UQ82zPkcU4GG2sgD\nsESSgSNxUj8Zg5jB0H6VRiLhQl2EaGN6A8HggXB7r/8LpsJ6uAWi4ZyP7i9KFxV2\nA7yYXGgy9wKBgQCHNYOq5wJZjaqQGQc+o5zk1jkOTz2ir10P9V0C/2J5xpcK4zFg\n5tzojfarUHWzyXiBQPddckzO+k+Z977KewPFCz1QTi/gtW9NVO0TNOcTSVWlO3xz\nsI7yktkhPpKplc3hcTvuEk6q1QII32h5Wu91a5S6kYWvf3q4rDBXY8h1DQKBgGDJ\nOd+Li3LjTHQpHFYEcqUV7NiqsAk2d2vQo0gbwOGz+o1DXq89FMjglDwa2CDe9NfU\nJU2EJzzklmSHqc7N75rMmB2fzMsSnLL2570Qq3lfB4BAm5qIHlVFIDkea5MmyY3L\nC3yoD3bqzXqvswA5LMPGIi+e/GAIVeN+V3v2c7kbAoGBAMG0kj1BUfWDMts/WRhn\nOcucxksuPuZMXH4squfRwPsyx9vkA7QwvvLHX6lkn74oPrnwopf5zgTjrz2V3ycE\n8yiwBkY7uppwL/goDx8ElDIk8pSkqmRHIh+saeNtNuMjfw7KUdTEGyq/wLoXa9sG\nen1s6vSA4hUOJEaJolgDsSuJ\n-----END PRIVATE KEY-----\n"

# Optional Apps Script Web App fallback URL (if not using direct Google Sheets API)
NEXT_PUBLIC_SHEETS_API_URL=

# ==============================================================================
# 4. FIREBASE AUTHENTICATION & CLIENT CONFIGURATION
# ==============================================================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAx2PFdk0bZSYbO1Shh2Bv1S7JsPWqBj38
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ntuma-bf804.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ntuma-bf804
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ntuma-bf804.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=720587265451
NEXT_PUBLIC_FIREBASE_APP_ID=1:720587265451:web:6b94b86791fa6b099f2eee

# ==============================================================================
# 5. EMAIL NOTIFICATION & SMTP CONFIGURATION (NODEMAILER)
# ==============================================================================
GMAIL_USER=ntumankuhahire@gmail.com
GMAIL_APP_PASSWORD="rpif reyn qtau ihvg"
CONTACT_RECEIVER_EMAIL=ntumankuhahire@gmail.com
CONTACT_CC_EMAILS=fabimukundente@gmail.com,info@ntumankuhahire.com
```

---

## 📊 Database Schema (Google Sheets)

The database operates on Google Sheets ID `1XZB_IFr6o5TBYDlI34UlV0EyISUMTvvNBPDI_i1Ocr4`. The system automatically creates missing tabs and header rows on demand.

### 1. `Categories` Tab
* **Columns**: `id`, `name`, `description`, `createdAt`
* **Purpose**: Manages product categories (e.g. Vegetables, Fruits, Dairy, Meats, Household).

### 2. `Products` Tab
* **Columns**: `id`, `name`, `category`, `price`, `unit`, `description`, `createdAt`
* **Purpose**: Stores active item inventory and unit pricing (RWF).

### 3. `Orders` Tab
* **Columns**: `id`, `createdAt`, `customerName`, `customerPhone`, `location`, `budget`, `total`, `status`
* **Purpose**: Tracks submitted customer orders and fulfillment status (`Pending`, `In Progress`, `Completed`, `Cancelled`).

### 4. `OrderItems` Tab
* **Columns**: `id`, `orderId`, `category`, `productName`, `qty`, `unit`, `price`, `subtotal`, `isCustom`
* **Purpose**: Line items associated with each order, supporting custom requested produce items.

---

## 🚀 How to Run & Use the System

### Prerequisites
* **Node.js**: Version 18.x or 20.x recommended
* **npm**: Version 9.x+

### 1. Installation & Environment Setup
Clone the repository and install all dependencies:
```bash
npm install
```
Ensure `.env.local` exists in the root directory with all environment variables listed above.

### 2. Development Mode
Start the local Next.js development server:
```bash
npm run dev
```
Open your browser and navigate to:
* **Customer Storefront**: `http://localhost:3000`
* **Admin Login**: `http://localhost:3000/login` or `http://localhost:3000/admin/login`
* **Admin Dashboard**: `http://localhost:3000/admin` (Protected by middleware)
* **Receipt Verification**: `http://localhost:3000/verify`

### 3. Production Build & Start
To compile and test a production build locally:
```bash
npm run build
npm start
```

### 4. Admin Access & Authentication
1. Go to `http://localhost:3000/admin/login`
2. Enter the Admin Passphrase: `ntuma2026`
3. Upon authentication, a HTTP cookie (`ntuma_admin_session=authenticated`) is issued.
4. From the dashboard, staff can:
   * View live incoming orders from Google Sheets
   * Update order statuses
   * Add, edit, or delete categories and inventory items
   * Generate official PDF digital receipts with anti-tamper QR verification hashes

---

## 🔒 Security & Verification System

### Receipt Authenticity Verification (`/verify`)
Every digital receipt generated by Ntuma features a 10-character SHA-256 hash computed deterministically from:
`receiptNumber | totalAmount | clientName | date | SECRET_KEY`

When a customer or delivery personnel scans the QR code on a receipt, it opens:
`https://ntumankuhahire.rw/verify?id=...&name=...&amount=...&date=...&hash=...`

The system recalculates the signature using `NEXT_PUBLIC_NTUMA_SECRET` and verifies whether the receipt is authentic or tampered with.

---

## 📂 Project Directory Structure

```
ntuma/
├── app/                      # Next.js 14 App Router Pages & API Routes
│   ├── admin/                # Admin Panel pages & Admin Login
│   ├── api/                  # Serverless API routes (Google Sheets & Mail)
│   │   ├── admin/            # Auth & session verification
│   │   ├── contact/          # Email notification endpoint
│   │   └── sheets/           # Google Sheets CRUD API wrapper
│   ├── cart/                 # Cart overview page
│   ├── checkout/             # Checkout & order submission page
│   ├── contact/              # Contact us page
│   ├── login/                # Admin login page
│   ├── verify/               # Digital receipt verification portal
│   ├── layout.tsx            # Global app layout & client providers
│   └── page.tsx              # Storefront landing page
├── components/               # React UI Components
│   ├── admin/                # Admin management UI components
│   ├── CartDrawer.tsx        # Slide-over shopping cart
│   ├── CheckoutDashboard.tsx # Comprehensive checkout & receipt generator
│   ├── InvoiceTemplate.tsx   # Printable PDF invoice component
│   └── ProductList.tsx       # Live product catalog & filtering
├── lib/                      # Helper modules & backend services
│   ├── CartContext.tsx       # React Context state management for shopping cart
│   ├── firebase.ts           # Firebase SDK initialization
│   ├── googleSheetsService.ts# Google Sheets JWT Service Account connector
│   ├── receiptHash.ts        # Cryptographic receipt signature engine
│   └── sheetsApi.ts          # Client-side API fetch client for Google Sheets
├── Code.gs                   # Google Apps Script Web App fallback script
├── SHEET_SETUP.md            # Detailed Google Sheets setup guide
├── middleware.ts             # Route guard protection for /admin routes
├── package.json              # Dependencies & build scripts
├── tailwind.config.js        # Tailwind CSS styling configuration
└── tsconfig.json             # TypeScript settings
```

---

## 📬 Contact & Support

For system administrative support or technical inquiries:
* **Primary Email**: `ntumankuhahire@gmail.com`
* **CC Contacts**: `fabimukundente@gmail.com`, `info@ntumankuhahire.com`
* **Domain**: [https://ntumankuhahire.rw](https://ntumankuhahire.rw)
