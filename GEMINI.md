# TaskFlow - Technical Architecture & Design Analysis

## 1. TECH STACK DEEP DIVE

### Core Infrastructure
- **Runtime:** Node.js (LTS)
- **Backend Framework:** Express.js 5.x (utilizing the latest features for improved routing and error handling)
- **Frontend Library:** React 19 (leveraging modern hooks and concurrent rendering)
- **Database:** PostgreSQL via Supabase (Serverless infrastructure)
- **Authentication:** JWT (JSON Web Tokens) with `bcrypt` for secure credential hashing

### Styling & UI
- **Tailwind CSS:** Utility-first styling for rapid UI development and consistent design tokens.
- **Glassmorphism:** Implementation of `backdrop-blur` and semi-transparent RGBA layers for a modern "Apple-style" aesthetic.
- **Responsive Design:** Mobile-first approach using Tailwind's breakpoint system.

---

## 2. SCALABLE DESIGN PRINCIPLES

The project follows several key architectural patterns to ensure long-term maintainability:

### A. Separation of Concerns (SoC)
- **Controller-Service-Repository Pattern:** The backend separates route handling (routes), business logic (controllers), and data access (Supabase client).
- **Component-Based Architecture:** Frontend UI is broken down into reusable atomic components (Avatar, PrivateRoute, Modals).

### B. Middleware-Driven Security
- **Layered Authorization:** 
    1. `auth.middleware`: Validates identity.
    2. `workspace.middleware`: Validates organizational access.
    3. `projectRole.middleware`: Validates granular permissions (Owner vs. Member).

### C. Database Normalization
- The schema follows **3rd Normal Form (3NF)**, ensuring data integrity across Workspaces, Projects, Modules, and Tasks.
- **UUIDs:** Using `uuid_generate_v4()` instead of sequential integers to prevent ID enumeration attacks and facilitate distributed scaling.

---

## 3. STATE MANAGEMENT & DATA FETCHING

### Frontend State
- **Local State:** React `useState` and `useEffect` for component-level data.
- **Persistence:** `localStorage` for JWT and user session metadata to ensure persistence across refreshes.
- **Centralized API Utilities:** Decoupled Axios instances in `src/utils/` to manage base URLs and headers in one place.

---


## REFERENCE
Refer @PROJECT_ANALYSIS.md for detailed project description