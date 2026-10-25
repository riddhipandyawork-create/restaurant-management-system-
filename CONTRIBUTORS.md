# Project Contributors & Division of Labor

This document outlines the roles, responsibilities, and specific contributions of each team member in the development of the 22nd Parallel Restaurant Management System (RMS).

## 1. [Your Name/ID] - Lead Full-Stack & Systems Architect
*Primary contributor responsible for the core backend business logic, real-time WebSocket systems, and specialized operational screens.*
- **Backend Architecture:** Developed the Node.js/Express server, including RESTful routing, controllers, and JWT authentication middleware.
- **Real-Time WebSockets:** Implemented Socket.io for live bidirectional synchronization between POS orders and the Kitchen Display System (KDS).
- **Core Operations Engine:** Built the Kitchen Display System (KDS) interface, Analytics aggregation engine, and Staff Administration controls.

## 2. [Member 2 Name/ID] - Database Architect
*Responsible for data modeling, storage solutions, and database initialization.*
- **Schema Design:** Architected the MongoDB schemas using Mongoose for entities like `Order`, `MenuItem`, `Reservation`, `User`, and `Table`.
- **Data Seeding:** Created the initialization scripts (`seeds/seed.js`) to populate the database with over 150 authentic menu items.
- **Optimization:** Handled database connections, `.env` configurations, and optimized data relations for efficient querying.

## 3. [Member 3 Name/ID] (Riddhi Pandya) - Frontend Architect & Full-Stack UI Integrator
*Responsible for end-to-end customer web experience, operational admin interfaces, and frontend state/API architecture.*
- **Customer Web Application:** Architected the complete customer website (Landing, Digital Menu browsing, Table Reservation booking, Live Order Tracking, and Reviews).
- **Admin UI Modules:** Built the operational admin modules including Dashboard KPIs, POS Order station, Menu catalog management, Billing & Invoicing, and Table floor map.
- **State Management & Services:** Implemented global state management using Zustand and built the unified Axios API service layer (`client/src/services` & `customer/src/services`).
- **UI Design System:** Maintained design tokens, reusable UI components (Navbars, Modals, Drawer cart, Sidebars), and project documentation.

## 4. [Member 4 Name/ID] - DevOps & Configuration Engineer
*Provided build tooling support and initial repository scaffolding.*
- **Build Configurations:** Configured the Vite, Tailwind CSS, and PostCSS build environments for both frontend applications.
- **Repository Setup:** Handled the initial GitHub repository boilerplate, package dependencies (`package.json`), and ignore files (`.gitignore`).
- **Static Assets:** Managed static HTML entry points and global CSS variable initialization.
