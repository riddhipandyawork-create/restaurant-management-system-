# 🍛 22nd Parallel – Restaurant Management System

A full-stack, cloud-based Restaurant Management System built with **React + Vite**, **Node.js/Express**, **MongoDB**, and **Socket.io**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Setup Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run seed    # Seeds 22nd Parallel menu data (150+ items)
npm run dev     # Starts server on http://localhost:5000
```

### 2. Setup Admin Frontend (`client`)
```bash
cd client
npm install
npm run dev     # Starts Admin Vite app on http://localhost:5173
```

### 3. Setup Customer Frontend (`customer`)
```bash
cd customer
npm install
npm run dev     # Starts Customer Vite app on http://localhost:5174
```

## 🔑 Demo Login Credentials

| Role     | Email              | Password     |
|----------|--------------------|--------------|
| Admin    | admin@rms.com      | admin1234    |
| Manager  | manager@rms.com    | manager123   |
| Cashier  | cashier@rms.com    | cashier123   |
| Waiter   | waiter@rms.com     | waiter123    |
| Kitchen  | kitchen@rms.com    | kitchen123   |

## 📋 Features

| Module              | Description |
|---------------------|-------------|
| **Dashboard**       | KPI cards, revenue charts, top items, quick actions |
| **Menu**            | 150+ items from 22nd Parallel menu, category tabs, CRUD |
| **Orders**          | New order builder, cart, full status lifecycle |
| **Tables**          | Interactive floor map, status management (20 tables) |
| **Kitchen Display** | Real-time WebSocket order queue, item-level status |
| **Reservations**    | Date-based booking with time slots and occasions |
| **Billing**         | Invoice generation, print, mark as paid |
| **Staff**           | Role-based staff management |
| **Reports**         | Revenue charts, order volume, top items analytics |

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite 5, Zustand, React Router v6, Recharts, Lucide React
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Real-time**: Socket.io (Kitchen Display System)

## 🌱 Menu Data Source

All menu items are sourced directly from the **22nd Parallel restaurant menu** (Jetalpur, Anand) — 150+ authentic South Indian dishes across 16 categories including Dosais, Idlis, Uthappams, Rice dishes, Beverages, Prasadam, and more.
