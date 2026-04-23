# Invoice Management App

A fully responsive Invoice Management Application built with **React + TypeScript** that implements complete invoice CRUD flows, draft and payment status management, filtering, theme switching, authentication, multi-currency support, and accessibility-focused modal/drawer interactions.

This project was built for the **Frontend Wizards — Stage 2 Task** and follows the recommended component architecture while also including a few practical enhancements beyond the base requirements.

---

## Live Demo

https://invoice-app-production-f957.up.railway.app/

GitHub Repository
https://github.com/Precious-Odion/invoice-app

Overview
This application allows users to:

- Create invoices
- Read and view invoice details
- Update existing invoices
- Delete invoices with confirmation
- Save invoices as Draft
- Submit completed invoices as Pending
- Mark pending invoices as Paid
- Filter invoices by status
- Toggle between light and dark mode
- Use the app across desktop, tablet, and mobile layouts
- Interact with accessible modals and drawers
- Persist invoice, theme, and auth state with localStorage
  The project emphasizes:
- clean structure
- reusable components
- responsive design
- keyboard accessibility
- practical UX decisions

⸻

Core Features

1. CRUD Functionality
   Create
   Users can open the invoice form drawer, fill in invoice details, add items, choose a currency, and either:

- save as draft
- or save and send as pending
  Read
  Users can:
- view all invoices in the invoice list
- click an invoice card to open the full invoice detail page
  Update
  Users can:
- open an existing invoice in edit mode
- modify any supported field
- save a completed draft as Pending
- keep an incomplete invoice as Draft
  Delete
  Users can:
- delete an invoice from the detail page
- confirm deletion using a dedicated confirmation modal

⸻

2. Draft / Pending / Paid Flow
   Invoices support three statuses:

- Draft
- Pending
- Paid
  Supported behavior
- New invoices can be saved as Draft
- Draft invoices can later be edited
- Once all required fields are valid, a draft can be submitted as Pending
- Pending invoices can be marked as Paid
- Paid invoices cannot be reverted back to Draft
  Status visibility
  Status is clearly shown in:
- invoice list cards
- invoice detail page
- status badge styling

⸻

3. Form Validation
   Validation behavior differs based on intent:
   Draft mode
   Draft mode is intentionally more flexible:

- partially filled forms are allowed
- fields that are filled still undergo format validation where appropriate
  Pending mode
  Pending submission is strict:
- required fields must be present
- invalid fields are highlighted
- submission is blocked until all required values are valid
  Validations include
- client name required
- valid email format for invoice recipient
- project description checks
- at least one valid invoice item
- quantity must be positive
- price must be positive
- currency must be valid
- payment terms must be valid

⸻

4. Multi-Currency Support
   Beyond the base task, the app supports a currency dropdown in the invoice form.
   Supported currencies

- GBP (£)
- USD ($)
- EUR (€)
- NGN (₦)
- CAD (C$)
  Currency behavior
- Currency is selected at invoice creation/edit time
- Invoice totals update using the selected currency
- Currency is reflected in:
  _ item prices
  _ item totals
  _ invoice total
  _ list view \* detail view
  UX note
  Price inputs use a user-friendly currency formatting approach:
- users type raw values naturally
- prices are formatted more cleanly through blur/finalized display behavior
- this avoids disruptive cursor jumps while typing

⸻

5. Filtering
   Users can filter invoices by status using a checkbox-based filter component.
   Supported filters

- Draft
- Pending
- Paid
  Behavior
- filtering updates the list immediately
- multiple filters can be toggled
- an empty state is shown when no invoice matches the selected filter(s)

⸻

6. Light / Dark Mode
   The application includes a global theme toggle.
   Theme behavior

- toggles between light and dark mode
- preference is persisted in localStorage
- all core surfaces, text, borders, and interactive components adapt to theme variables
- color contrast was considered for both modes

⸻

7. Responsive Design
   The layout adapts across:

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
  Responsive considerations
- invoice cards change layout for mobile
- invoice detail sections stack appropriately
- drawer behavior adapts by screen size
- actions remain usable on smaller screens
- spacing and hierarchy are preserved
- overflow issues were actively addressed during implementation
  Mobile UX
  Special effort was made to keep mobile interactions usable:
- drawer layout adjusted for small screens
- invoice item layout adapted for mobile detail view
- invoice list cards restructured to match the Figma mobile pattern more closely
- no unnecessary horizontal overflow in final intended interactions

⸻

8. Hover & Interactive States
   Interactive states were implemented across the app, including:

- buttons
- invoice cards
- status filters
- dropdown options
- form inputs
- delete buttons
- theme toggle
- user menu actions
  This improves usability and makes interactions feel more complete and intentional.

⸻

Authentication
Authentication was added as a lightweight enhancement beyond the original task.
Included auth features

- signup
- login
- logout
- protected routes
- profile/avatar support
- multiple local accounts stored in localStorage
  Simplified auth behavior
  For this project:
- signup email validation is intentionally minimal
- the app allows emails in lightweight forms such as xx@y
- password length is intentionally unrestricted
  Reason for this choice
  Authentication was intentionally kept simple in order to:
- prioritize the main grading criteria of the task
- avoid overengineering a feature not central to invoice workflows
- reduce friction for assessors testing the app quickly
- focus implementation time on CRUD, responsiveness, accessibility, theming, and invoice logic
  In a production version, this would be replaced with:
- stricter email validation
- stronger password rules
- secure backend-based authentication
- hashing and token/session management

⸻

Accessibility
Accessibility was treated as a serious requirement throughout the app.
Modal & Drawer Accessibility
The task explicitly required that modals:

- trap focus
- close via ESC key
- be keyboard navigable
  The app addresses this with:
- keyboard focus trapping
- ESC support for modal/drawer closing
- focus redirection back inside active overlays
- background scroll locking while overlay is open
- semantic dialog behavior using role="dialog" and aria-modal="true"
  Forms
- Labels are connected to inputs
- Buttons are actual <button> elements
- Error messages are shown for invalid fields
- Focus is moved to the first invalid field on failed strict submission
  General
- semantic HTML used where appropriate
- theme colors chosen with contrast in mind
- focus-visible handling included for interactive components
  Accessibility Note
  Mobile focus trapping is harder than desktop because mobile devices do not use keyboard Tab behavior in the same way. To address this, the app uses additional focus handling logic rather than relying only on Tab key cycling.

⸻

Recommended Architecture Compliance
The task recommended the following structure:

- Invoice List Page
- Invoice Detail Page
- Invoice Form Component
- Status Badge Component
- Filter Component
- Theme Provider / Context
  Current implementation
  Pages
- InvoiceListPage
- InvoiceDetailPage
- LoginPage
- SignupPage
  Components
- InvoiceFormDrawer
- InvoiceCard
- InvoiceStatusBadge
- FilterDropdown
- Modal
- ProfileModal
- UserMenu
- DatePicker
- SelectMenu
- Button
  Providers / Context
- InvoiceContext
- ThemeContext
- AuthContext
  Layout
- AppShell
- MainNav
  So yes, the project follows the recommended architecture and extends it where useful.

⸻

State Management
InvoiceContext
Handles:

- invoice storage
- filtering
- retrieval by id
- create/update/delete operations
- mark as paid logic
  ThemeContext
  Handles:
- light/dark theme state
- persistence in localStorage
  AuthContext
  Handles:
- current user state
- signup/login/logout
- avatar updates
- protected user session state

⸻

Data Persistence
This project uses localStorage for persistence.
Persisted data includes

- invoices
- current theme
- saved auth accounts
- current logged-in session
  Why localStorage
  This was chosen because:
- it satisfies the task requirements
- it keeps the app fully functional without backend setup
- it supports quick reviewer testing
- it allows the app to remain React-only as requested

⸻

Key Engineering Decisions

1. Invoice Form as a Drawer
   Instead of navigating to a separate page for editing/creating, the invoice form uses a drawer overlay. This keeps users closer to context and better matches the design style.
2. Centralized Invoice Logic
   Invoice data and mutations are handled through a dedicated context rather than scattered page-level state. This makes the system easier to reason about and reuse.
3. Flexible Draft vs Strict Pending Validation
   Drafts are intentionally more forgiving, while pending invoices require stricter validation. This matches real-world expectations better than applying the same validation intensity to both flows.
4. Multi-Currency Enhancement
   Currency selection was introduced as an additional improvement to make the app more flexible and realistic.
5. Scroll Lock Hook
   A reusable body scroll lock hook was introduced to improve overlay behavior and prevent background scrolling under active modals or drawers.

⸻

Trade-offs

1. Simplified Authentication
   Authentication is intentionally lightweight and front-end only. This keeps the app easy to test but is not production-grade security.
2. Large Form Component
   InvoiceFormDrawer contains a lot of logic:

- validation
- item handling
- formatting
- status flow
  This improved delivery speed, though a larger production system would split this further into smaller hooks/components.

3. Separate Overlay Systems
   The app currently has:

- Modal
- Drawer
- Profile modal
  These behave similarly but are still separate implementations. A future refactor could unify them into a more generic overlay system.

4. localStorage Instead of Backend
   This improves simplicity and satisfies the challenge, but a backend would be preferable for:

- user management
- shared persistence
- secure auth
- multi-device continuity

⸻

Improvements Beyond Requirements
The project includes some practical additions beyond the base task:

- lightweight authentication
- multiple local accounts
- avatar/profile support
- multi-currency selection
- reusable modal system
- reusable custom scroll lock hook
- improved keyboard/focus behavior for overlays
- custom mobile invoice item presentation

⸻

Possible Future Improvements

- extract invoice form logic into reusable hooks
- unify modal and drawer logic into one overlay system
- stricter auth validation and backend auth
- add tests (unit + integration)
- use IndexedDB or backend persistence
- add invoice search
- export invoices as PDF
- improve profile management
- add animation polish and motion consistency

⸻

Tech Stack

- React
- TypeScript
- React Router
- Context API
- localStorage
- CSS

⸻

Setup Instructions

1. Clone the repository
   git clone https://github.com/Precious-Odion/invoice-app
2. Go into the project folder
   cd invoice-app
3. Install dependencies
   npm install
4. Start development server
   npm run dev
5. Build for production
   npm run build

⸻

Project Highlights for Reviewers
This project focuses on the criteria most relevant to the task:

- working CRUD behavior
- accurate status flow
- responsive invoice layouts
- filter functionality
- persistent theming
- local persistence
- accessibility-minded overlays
- maintainable component structure
  Where simplifications were made, they were intentional and documented.

⸻

Acknowledgements

- Figma invoice design reference provided in the task
- Built with React and TypeScript
