# Project Contributors & Division of Labor

This document outlines the roles, responsibilities, and specific contributions of each team member in the development of the 22nd Parallel Restaurant Management System (RMS).

## 1. [Your Name/ID] - Lead Full-Stack Developer
*Primary contributor responsible for the core backend business logic, operational views, and real-time systems.*
- **Backend Architecture:** Developed the Node.js/Express server, including RESTful routing, controllers, and authentication middleware.
- **Real-Time Integration:** Implemented WebSockets (Socket.io) for live synchronization between the ordering system and the Kitchen Display System (KDS).
- **Core Frontend Views:** Built the primary React.js interfaces for the Admin portal (Orders, Tables, Kitchen, Dashboard) and Customer website.

## 2. [Member 2 Name/ID] - Database Architect
*Responsible for data modeling, storage solutions, and database initialization.*
- **Schema Design:** Architected the MongoDB schemas using Mongoose for entities like `Order`, `MenuItem`, `Reservation`, `User`, and `Table`.
- **Data Seeding:** Created the initialization scripts (`seeds/seed.js`) to populate the database with over 150 authentic menu items.
- **Optimization:** Handled database connections, `.env` configurations, and optimized data relations for efficient querying.

## 3. [Member 3 Name/ID] - Frontend Architect & API Integrator
*Responsible for reusable UI design, global state management, and frontend-to-backend integration.*
- **State Management:** Implemented global state management using Zustand for Auth, Cart, and user sessions across the applications.
- **API Integration:** Built the frontend API service layers (`client/src/services` & `customer/src/services`) connecting React to the Node.js backend.
- **UI Components:** Developed reusable, responsive UI components (Navbars, Modals, Auth pages) and managed the design documentation (`open-design/`).

## 4. [Member 4 Name/ID] - DevOps & Configuration Engineer
*Provided build tooling support and initial repository scaffolding.*
- **Build Configurations:** Configured the Vite, Tailwind CSS, and PostCSS build environments for both frontend applications.
- **Repository Setup:** Handled the initial GitHub repository boilerplate, package dependencies (`package.json`), and ignore files (`.gitignore`).
- **Static Assets:** Managed static HTML entry points and global CSS variable initialization.
