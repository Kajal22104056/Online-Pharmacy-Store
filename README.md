# 💊 Online Pharmacy Store

An end-to-end online pharmacy application designed to connect customers with pharmacies, facilitate secure prescription-based orders, and manage the full pharmaceutical supply chain efficiently.

## 📌 Project Scope

The **Online Pharmacy Store** provides users with an interface to:

- Search and order medications (prescription-based and OTC).
- Upload prescriptions for validation.
- Track orders and communicate with delivery agents.
- Verify prescriptions using Doctor ID and signatures.
- Manage and store data related to:
  - Customers
  - Medicines
  - Pharmacies
  - Suppliers
  - Invoices and Payments
  - Doctors and Employees

---

## 🧑‍⚕️ Features

- 🔐 **User Authentication** – Secure login system for customers, employees, and doctors.
- 📝 **Prescription Verification** – Validates prescriptions using doctor signature and ID.
- 🔍 **Medicine Lookup** – Check availability, pricing, and expiry of medications.
- 🚚 **Order Tracking** – Live order status and delivery person contact info.
- 📦 **Inventory Management** – Automated updates on medicine quantity and expiry.
- 💳 **Payment System** – Integrated invoice and payment module.
- 📊 **Data Records** – Stores and maintains records of drugs, side effects, manufacturer info, and more.

---

## 🌐 Live website

**Always-on production URL:** [https://online-pharmacy-store-kajal.vercel.app](https://online-pharmacy-store-kajal.vercel.app)

This is the stable Vercel production link (it stays the same on every deploy).

The original project was a Java CLI + MySQL dump. The website source lives in `web/`:

```bash
cd web
npm install
npm run dev
```

Demo logins from the `login` table:

| Role | Username | Password |
| --- | --- | --- |
| Customer | `c_user3` | `password3` |
| Doctor | `a_user1` | `password1` |
| Admin | `b_user2` | `password2` |

## 🛠️ Tech Stack

- **Website**: Next.js, TypeScript, Tailwind CSS
- **Original backend**: Java CLI (JDBC + MySQL)
- **Database dump**: MySQL (`ops`) in `Database Schema/DBMS03.sql`

---

## 🗃️ ER Diagram Overview

The system includes the following key entities:

- **Login** (Lid, username, password, role)
- **Customer** (CID, name, contact, address)
- **Doctor** (docID, name, specialty)
- **Pharmacy** (pharID, location, name)
- **Medicine** (medID, name, expiry, quantity, price)
- **Employee** (EID, name, salary, etc.)
- **Supplier** (supplierID, name, location)
- **Invoice** (invoiceID, medID, amount)
- **Payment** (PID, payDate, amount)

---

## 🧪 Functional Flow

1. **User Registration**: Enters name, phone, address, prescription.
2. **Prescription Validation**: Checked manually and verified via docID/signature.
3. **Medicine Lookup**: Inventory is queried.
4. **Order Confirmation**: Cost is shown and order confirmed.
5. **Tracking**: Tracker activated for delivery.
6. **Invoice & Payment**: Invoice generated, payment processed.
7. **Post-Order Info**: Medicine info, side effects, manufacturer details are accessible.

---

## 📎 Sample Use Cases

- A patient uploads a prescription → system verifies it → medicine found → payment → order dispatched → real-time tracking enabled.
- Admin adds a new medicine → sets expiry and price → reflected in store's inventory instantly.

---

## 👩‍💻 Developer

**Kajal Kumari (22104056)**  
Project for academic submission.

---

## 📁 Repository Structure

```bash
📦 Online-Pharmacy-Store
├── 📂 web                                 # Next.js website (Vercel)
├── 📂 Command Line Interface              # CLI-based order and inventory interaction
├── 📂 Database Schema                     # SQL DDL scripts for database schema
├── 📂 Embedded SQL & OLAP Queries         # Queries for advanced analytics & reports
├── 📂 SQL queries                         # Core SQL queries for app functionality
├── 📄 ER_Diagram_ONLINE_PHARMACY.pdf     # Entity Relationship diagram of the system
└── 📄 README.md                           # Project documentation
