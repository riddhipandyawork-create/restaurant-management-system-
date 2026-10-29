# Project Contributors & Division of Labor

This document outlines the roles, responsibilities, and specific contributions of each team member in the development of the 22nd Parallel Restaurant Management System (RMS).

## 1. Bhargav Rajput (24bt04144) - Lead Full-Stack & Systems Architect
*Primary contributor responsible for the core backend business logic, real-time WebSocket systems, operational kitchen display, and system-level test infrastructure.*
- **Backend Architecture:** Developed the central Node.js/Express server (`server/index.js`), middleware pipeline, and modular REST API routing.
- **Authentication & Security:** Implemented JWT verification (`server/middleware/auth.js`), password hashing via bcrypt, and granular role-based access control (Admin, Manager, Waiter, Cashier, Kitchen).
- **Core Business Logic Controllers:** Authored backend controllers for order lifecycle (`orderController.js`), menu updates, table allocation, billing calculations, and analytics aggregations.
- **Real-Time WebSockets:** Implemented Socket.io server handlers (`sockets/orderSocket.js`) and bidirectional live updates between POS orders and the Kitchen Display System (KDS).
- **Kitchen Display System (KDS) & Operational UI:** Built the real-time Kitchen Display interface (`Kitchen.jsx`), Orders monitoring workflow (`Orders.jsx`), Reports and Analytics dashboards (`Reports.jsx`), and Staff HR administration (`Staff.jsx`).
- **Quality Assurance & Testing:** Engineered the automated testing suite utilizing Jest and Supertest across 5 comprehensive test suites (29 passing unit and integration tests).

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

## 4. Kosamia Krishraj (24bt04055) - DevOps, Build Tooling & Infrastructure Lead
*Responsible for the technical foundation, build automation, bundler architectures (Vite), CSS post-processing pipelines (Tailwind CSS, PostCSS), containerization (Docker Compose), CI/CD workflows, and development bootstrapping.*
- **Build Configurations:** Configured Vite bundlers, path aliases, development proxy routing, Tailwind CSS design system, and PostCSS vendor prefix pipelines.
- **Repository Setup & Security:** Handled package dependency manifests (`package.json`), version locking, root and sub-project `.gitignore` protection rules, and Oxlint code quality rules.
- **Static Assets & Entry Points:** Established HTML5 entry mounts, Google Fonts typography preloading, and React root bootstrapping.
- **DevOps & Containerization:** Implemented multi-stage Docker containerization, Nginx reverse proxies, Docker Compose orchestration, and `start-dev.bat` multi-service bootstrapper.
- **Continuous Integration (CI):** Designed automated GitHub Actions CI pipeline testing Jest suites and Vite bundle compilation on every push.
