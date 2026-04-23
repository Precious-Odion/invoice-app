# 📄 Invoice Management App

A fully responsive Invoice Management Application built with React, implementing complete CRUD functionality, draft/payment workflows, filtering, theming, and accessibility best practices.

---

## 🚀 Live Demo

https://invoice-app-production-f957.up.railway.app/

---

## 📦 Repository

https://github.com/Precious-Odion/invoice-app

---

# 🎯 Overview

This application allows users to:

- Create, view, update, and delete invoices
- Save invoices as Draft, Pending, or mark as Paid
- Filter invoices by status
- Toggle between light and dark themes
- Interact with a responsive UI across mobile, tablet, and desktop
- Experience accessible modal and drawer interactions

The project follows a modular, scalable component architecture with emphasis on maintainability, UX consistency, and accessibility.

---

# 🧩 Architecture

The application is structured into clearly separated concerns:

### 📄 Pages

- InvoiceListPage – Displays all invoices and filtering controls
- InvoiceDetailPage – Shows full invoice details and actions

### 🧱 Components

- InvoiceFormDrawer – Handles invoice creation and editing
- InvoiceCard – Displays invoice summary in list view
- InvoiceStatusBadge – Visual status indicator (Draft, Pending, Paid)
- FilterDropdown – Multi-select filter UI
- Modal – Reusable confirmation dialog
- UserMenu / ProfileModal – User interactions

### 🧠 State Management

- InvoiceContext – Handles all invoice data, filtering, and mutations
- ThemeContext – Manages light/dark mode with persistence
- AuthContext – Handles authentication state

### 🧱 Layout

- AppShell – Provides consistent layout structure (navigation + content)

---

# ⚙️ Features

## ✅ CRUD Functionality

- Create invoices via a dynamic form
- View invoices in list and detail pages
- Edit existing invoices
- Delete invoices with confirmation modal

---

## 🧾 Draft & Payment Flow

Invoices support three states:

- Draft – partially completed invoices
- Pending – fully valid invoices ready to be sent
- Paid – completed invoices

### Behavior:

- Drafts can be edited and later submitted as Pending
- Pending invoices can be marked as Paid
- Paid invoices are immutable

---

## 🧪 Form Validation

- Required fields enforced for Pending submission
- Drafts allow partial input but still validate formats when provided
- Validation includes:
  - Email format
  - Name format
  - Address constraints
  - Positive quantity and price
  - At least one valid item

---

## 🎯 Filtering

- Filter invoices by:
  - All
  - Draft
  - Pending
  - Paid
- Updates list in real-time
- Handles empty states gracefully

---

## 🎨 Theming

- Light/Dark mode toggle
- Persisted using localStorage
- All components adapt to theme variables

---

## 📱 Responsive Design

Supports:

- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

### Key considerations:

- No horizontal overflow
- Adaptive layouts for invoice cards and detail views
- Mobile-optimized item list and drawer behavior

---

# ♿ Accessibility

Accessibility was treated as a core requirement:

### Modals & Drawer

- Focus is trapped within active modal/drawer
- ESC key closes modal/drawer
- Keyboard navigation fully supported
- Background interaction is disabled

### Forms

- Proper <label> usage
- Error states clearly indicated
- Focus shifts to first invalid field

### General

- Semantic HTML used throughout
- Sufficient color contrast (light & dark mode)

---

# 🧠 Key Engineering Decisions

## 1. Drawer as Form Container

Instead of a traditional page, the invoice form is implemented as a drawer overlay, improving UX and matching modern UI patterns.

---

## 2. Centralized State via Context

InvoiceContext was used instead of external state libraries to:

- Keep the project lightweight
- Maintain clarity and control over logic
- Simplify data flow

---

## 3. Scroll Locking System

A custom hook (useLockBodyScroll) ensures:

- Background content cannot scroll when modal/drawer is open
- Mobile UX matches expected native behavior

---

## 4. Validation Strategy

- Draft mode: flexible validation
- Pending mode: strict validation

This balances user flexibility with data integrity

---

# 🔐 Authentication (Simplified)

For the purpose of this project:

- Email format: xx@y (minimal validation)
- Password: any length

### ❗ Reason:

Authentication was intentionally simplified to:

- Focus on core application features (CRUD, UI, UX, state)
- Avoid overengineering authentication logic not required by the task
- Ensure faster testing and smoother user flow during evaluation

In a production system, stricter validation and backend authentication would be implemented.

---

# 💾 Data Persistence

Invoices and user state are persisted using:

- localStorage

This ensures:

- Data survives page reloads
- No backend dependency required for the challenge

---

# ⚠️ Trade-offs

### 1. Large Component Size

InvoiceFormDrawer contains significant logic (validation, item management)

➡️ Trade-off: faster development vs deeper abstraction

---

### 2. Multiple Modal Systems

Separate implementations exist for:

- Modal
- Drawer
- Profile modal

➡️ Ideal solution would unify these into a single system

---

### 3. Context Scope

InvoiceContext handles multiple responsibilities (state + filtering + mutations)

➡️ Acceptable for this scale, but would be split in larger applications

---

# 🚀 Possible Improvements

- Extract form logic into smaller reusable hooks
- Introduce a unified modal/drawer system
- Add backend (Node.js / API routes) for real persistence
- Implement stricter authentication
- Add unit and integration tests
- Improve performance with memoization for large datasets

---

# 🛠️ Setup Instructions

bash # Clone repo git clone <https://github.com/Precious-Odion/invoice-app> # Navigate into project cd invoice-app # Install dependencies npm install # Run development server npm run dev

---

# 📊 Final Notes

This project prioritizes:

- Clean architecture
- Accessibility
- Responsive design
- Real-world UX patterns

While some simplifications were made (e.g., authentication), they were intentional to focus on delivering a high-quality, functional, and user-friendly invoice management system.

---

# 🙌 Acknowledgements

- Figma design reference provided in task
- Built with React + TypeS
