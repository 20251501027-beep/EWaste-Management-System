<div align="center">

♻ E-Waste Collection System
Problem Statement

1. Background
2. 
Households and institutions routinely accumulate electronic waste — phones, chargers, batteries, earphones, laptops, and cables — but have no structured way to dispose of it responsibly. In the absence of a dedicated system, e-waste is commonly discarded alongside regular household waste or left unused indefinitely. This leads to environmental hazards such as toxic material leakage from batteries, loss of recoverable materials such as metals and plastics, and non-compliance with e-waste management regulations that require traceable, hazard-appropriate disposal.
3. Problem Definition
4. 
Existing disposal channels are largely informal and manual. Users have no platform to register their e-waste, request a pickup, or track what happens to their items after collection. Furthermore, different categories of e-waste require different handling procedures — batteries need hazard-safe transport, phones and laptops require secure data-wiping before recycling, while cables, chargers, and earphones can be processed with standard handling. Ad-hoc disposal systems rarely enforce this category-specific differentiation, and users receive no incentive or acknowledgement for disposing of e-waste correctly, which further discourages participation.
5. Proposed Solution
6. 
This project proposes an object-oriented E-Waste Collection System that digitizes and streamlines the entire disposal lifecycle:
	•	Register: Users register e-waste items by category (phone, charger, battery, earphone, laptop, cable), with category-specific handling rules applied automatically.
	•	Request Pickup: Users raise a pickup request bundling one or more registered items.
	•	Assign Collector: A collector is assigned to fulfill the pickup request.
	•	Track: Users can track the status of their items — registered, collected, in transit, and recycled.
	•	Reward Points: Users earn points based on the type and quantity of e-waste submitted, redeemable toward the purchase of electronic items on the platform — encouraging responsible disposal through incentives rather than real monetary transactions.
7. Objective
8. 
To design and implement an object-oriented E-Waste Collection System that models e-waste items, users, collectors, and pickup requests as interacting objects — using inheritance and polymorphism to handle category-specific disposal rules and reward-point calculation, and association/composition relationships to manage the pickup, tracking, and redemption workflow — thereby replacing informal e-waste disposal with a structured, extensible, and user-incentivized alternative.
9. Scope
10. 
In scope: item registration by category, pickup requests, collector assignment, end-to-end status tracking, and a points-based reward and redemption system. Out of scope: real monetary payment/billing or third-party payment gateways, logistics route optimization, and integration with government e-waste compliance reporting — these are considered extensions beyond the current iteration.


</div>
