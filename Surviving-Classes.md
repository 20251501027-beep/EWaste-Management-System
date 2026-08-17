# Noun–Verb Analysis — E-Waste Collection System

## 1. Use Cases Analyzed

The noun–verb analysis is performed on the following three use-case specifications:

1. Register E-Waste Item
2. Request Pickup
3. Track E-Waste Status

---

# 2. Raw Candidate List

The following nouns and noun phrases are identified from the three use-case specifications.

| No. | Candidate                 | Source                                       |
| --: | ------------------------- | -------------------------------------------- |
|   1 | User                      | All three use cases                          |
|   2 | E-Waste Collection System | All three use cases                          |
|   3 | E-Waste Item              | All three use cases                          |
|   4 | Item Type                 | Register E-Waste Item                        |
|   5 | Handling Rule             | Register E-Waste Item                        |
|   6 | E-Waste Category          | Register E-Waste Item                        |
|   7 | Item Details              | Register E-Waste Item                        |
|   8 | Status                    | Register E-Waste Item / Track E-Waste Status |
|   9 | E-Waste Record            | Register E-Waste Item                        |
|  10 | Confirmation              | Register E-Waste Item / Request Pickup       |
|  11 | Pickup                    | Request Pickup                               |
|  12 | Pickup Request            | Request Pickup                               |
|  13 | Collector                 | Request Pickup / Track E-Waste Status        |
|  14 | Registered E-Waste Item   | Request Pickup                               |
|  15 | Collection                | Request Pickup / Track E-Waste Status        |
|  16 | Tracking Information      | Track E-Waste Status                         |
|  17 | Lifecycle Information     | Track E-Waste Status                         |
|  18 | Registered                | Track E-Waste Status                         |
|  19 | Collected                 | Track E-Waste Status                         |
|  20 | In Transit                | Track E-Waste Status                         |
|  21 | Recycled                  | Track E-Waste Status                         |

---

# 3. Four Filters

The following four filters are applied to the raw candidates:

1. **Outside the system**
2. **A property of something else**
3. **A synonym already listed**
4. **Vague or whole-system**

---

# 4. Applying the Filters

| Candidate                     | Decision    | Reason                                                                                                           |
| ----------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| **User**                      | Discard     | Outside the system — User is an actor.                                                                           |
| **E-Waste Collection System** | Discard     | Whole system — represents the entire system.                                                                     |
| **E-Waste Item**              | **Survive** | Represents a main domain entity of the system.                                                                   |
| **Item Type**                 | Discard     | Property of E-Waste Item.                                                                                        |
| **Handling Rule**             | Discard     | Property related to the category/item rather than an independent class.                                          |
| **E-Waste Category**          | Discard     | Property of E-Waste Item.                                                                    |
| **Item Details**              | Discard     | Property/information describing an E-Waste Item.                                                                 |
| **E-Waste Record**            | Discard     | Representation/record of an E-Waste Item rather than a separate domain entity.                                   |
| **Pickup Request**            | **Survive** | Represents a distinct domain entity created for collecting e-waste.                                              |
| **Confirmation**              | Discard     | Vague/temporary system response, not a domain entity.                                                            |
| **Pickup**                    | Discard     | General activity/concept; the more specific entity is Pickup Request.                                            |
| **Collector**                 | Discard     | Outside the system — Collector is an actor.                                                                      |
| **Status**                    | **Survive** | Represents the status/state associated with an E-Waste Item and is treated as a separate class in this analysis. |
| **Registered E-Waste Item**   | Discard     | A state/status of E-Waste Item, not a separate class.                                                            |
| **Collection**                | Discard     | Activity/process rather than a distinct domain entity.                                                           |
| **Tracking Information**      | Discard     | Property/information associated with an E-Waste Item.                                                            |
| **Lifecycle Information**     | Discard     | Property/information describing the status of an E-Waste Item.                                                   |
| **Collected**                 | Discard     | State/status of an E-Waste Item, not a class.                                                                    |
| **In Transit**                | Discard     | State/status of an E-Waste Item, not a class.                                                                    |
| **Recycled**                  | Discard     | State/status of an E-Waste Item, not a class.                                                                    |

---

# 5. Surviving Classes

After applying the four filters, the following candidates survive:

### 1. E-Waste Item

Represents an individual electronic waste item registered in the system.

### 2. Pickup Request

Represents a request created for collecting one or more e-waste items.

### 3. Status

Represents the current status/state of an e-waste item.



Therefore, the surviving classes are:

**E-Waste Item, Status, Pickup Request**

---


