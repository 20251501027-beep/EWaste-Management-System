# CRC Cards - E-Waste Collection System

## 1.Surviving Classes:-

- E-Waste Item
- Pickup Request
- Status

---

## 2. CRC Cards

### E-Waste Item

**Responsibilities:**
- It will store the details of the e-waste item.
- It will store the type, model number, purchase year, and condition.
- It will provide item information for a pickup request.
- It will maintain the current status of the item.

**Collaborators:**
- Pickup Request
- Status

---

### Pickup Request

**Responsibilities:**
- Create and manage a pickup request.
- To associate one or more e-waste items with the request.
- Store pickup-related information.
- To track the progress of the pickup.
- To update the status of the pickup request.

**Collaborators:**
- E-Waste Item
- Status

---

### Status

**Responsibilities:**
- To represent the current state of an e-waste item or pickup request.
- Track changes in state.
- Indicating the progress of collection and recycling.

**Collaborators:**
- E-Waste Item
- Pickup Request

---

## 3. Class Relationships

- An E-Waste Item can be associated with a Pickup Request.
- A Pickup Request can contain one or more E-Waste Items.
- An E-Waste Item and Pickup Request can have a Status.
- Status changes as the item moves through the collection and recycling process.