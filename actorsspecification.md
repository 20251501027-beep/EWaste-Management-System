# E-Waste Collection System — Actor Analysis

## Project Overview

An e-waste collection system that allows users to register e-waste, select a pickup, get assigned a collector, and track recycling. Different waste types (phones, chargers, batteries, earphones, laptops, cables) have different handling rules.

**Key features:**
- Manual item registration form (model number, purchase year, condition, etc. — no AI scanner/classifier)
- Value estimation (internal — computed from form data against a depreciation/pricing table)
- Data destruction (for phones/laptops before recycling)
- E-waste and environmental impact tracking dashboard
- Gamification and rewards via an internal points/coins system (earned on deposit, redeemable for new devices, with an expiry limit)
- Pickup status and location tracked via message/notification updates (no separate maps API)

---

## 1. Primary Actors

Human actors who directly initiate use cases.

| Actor | Role |
|---|---|
| **Citizen / Depositor** | Registers e-waste via form, selects pickup slot, tracks pickup/recycling status, earns and redeems points/coins |
| **Collector / Pickup Agent** | Accepts assigned pickups, collects e-waste, sends status/location updates ("on the way", "reached location") |
| **Recycler / Recycling Center Staff** | Receives waste at facility, sorts per handling rules, updates recycling status, triggers data destruction |
| **System Administrator** | Manages users and collectors, defines waste-handling rules, manages points/coins catalog, views dashboard |

---

## 2. External Systems

Systems the application depends on but does not own.

| Actor | Role |
|---|---|
| **Notification Service** | Sends pickup confirmations, collector assignment alerts, recycling certificates, **and pickup location/status updates** (replaces a separate maps/geolocation API) |
| **Data Destruction / Wiping Tool** | Certified data-wiping tool triggered before recycling storage-bearing devices (phones, laptops); returns a wipe certificate |
| **Regulatory Reporting System** | Compliance reporting to environmental authorities (e.g., CPCB-style reporting) — quantities recycled, environmental disclosures |

**Removed from scope (and why):**
- ~~AI Classifier / Scanner Engine~~ — replaced by a manual form where users enter device details (model number, purchase year, etc.)
- ~~Payment / UPI Gateway~~ — replaced by an internal points/coins system; no real-money transactions leave the platform
- ~~Maps / Geolocation API~~ — replaced by manual collector-driven status updates through the Notification Service

---

## 3. Time-Triggered / Scheduled Actors

No human behind these — triggered by a scheduler/cron, not a login.

| Actor | Trigger |
|---|---|
| **Pickup Scheduler (Cron Job)** | Periodically auto-assigns unassigned pickup requests to available collectors |
| **Report Generator** | Daily/weekly job that compiles the environmental impact dashboard (CO₂ saved, kg recycled, etc.) |
| **Points/Coins Expiry Job** | Periodically expires unused points/coins past their limit, updates leaderboard rankings |
| **Reminder Trigger** | Sends automated reminders if a scheduled pickup hasn't been collected within a set time window |

---

## 4. Open Decision for the Group

Whether redeeming points/coins for new devices happens through:
- **(a)** Your own internally managed device catalog/voucher system (fully internal — no new actor), or
- **(b)** A partner store or external marketplace (would add a 5th external actor: **Partner Vendor / E-store**, since the system would send a redemption request and the partner would confirm stock/fulfillment)

This decision affects both the actor list above and later sequence diagrams for the redemption flow.
