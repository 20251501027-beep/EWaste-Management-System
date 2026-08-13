# Use Case Specifications — E-Waste Collection System

## 1. Register E-Waste Item

### Primary Actor
User

### Stakeholdersc
* User — wants to register e-waste for proper disposal.
* E-Waste Collection System — needs accurate item and category information.
* Collector — needs to know what type of e-waste will be collected.

### Preconditions

* User is registered/logged into the system.
* The user has an e-waste item to register.

### Postconditions

* The e-waste item is registered in the system.
* The item is assigned an appropriate category.
* Category-specific handling rules are associated with the item.
* The item's status becomes **Registered**.

### Trigger

The user chooses the **Register E-Waste** option and wants to add an e-waste item to the system.

### Main Flow

1. User selects **Register E-Waste**.
2. System asks the user to provide details of the e-waste item.
3. System identifies the corresponding e-waste category.
4. System applies the appropriate category-specific handling rules.
5. System displays the entered item details for confirmation.
6. User confirms the registration.
7. System creates the e-waste item record & assigns the status **Registered**.
8. System displays a confirmation to the user.

### Alternate Flow 1 — Invalid Item Category

1. At Step 3, the user enters an item that is not supported by the system.
2. System informs the user that the item category is not currently supported.
3. User enters a supported e-waste category.
4. System resumes the main flow from Step 4.

### Alternate Flow 2 — User Cancels Registration

1. At Step 5, the user decides not to register the item.
2. User cancels the registration.
3. System discards the entered information and does not create an e-waste record.

## 2. Request Pickup

### Primary Actor

User

### Stakeholders

* User — wants their registered e-waste to be collected.
* Collector — needs the pickup request and item details.
* E-Waste Collection System — needs to coordinate and track the pickup.

### Preconditions

* User is logged into the system.
* User has at least one registered e-waste item.
* The item is eligible for collection.

### Postconditions

* A pickup request is created.
* The selected e-waste items are associated with the pickup request.
* The request becomes available for collector assignment.

### Trigger

The user chooses **Request Pickup** for one or more registered e-waste items.

### Main Flow

1. User selects **Request Pickup**.
2. System displays the user's registered e-waste items.
3. User confirms the pickup request.
4. System creates a pickup request containing the selected items.
5. System marks the request as awaiting collector assignment.
6. System displays the pickup request confirmation to the user.

### Alternate Flow 1 — No Registered Items

1. At Step 2, the system finds that the user has no registered e-waste items available for pickup.
2. System informs the user that an item must be registered before requesting a pickup.
3. The pickup request is not created.

### Alternate Flow 2 — Item Already Included in Another Pickup

1. At Step 2, the user selects an item that is already associated with an active pickup request.
2. System informs the user that the item cannot be included in another pickup request.
3. User selects another eligible item.
4. System resumes the main flow from Step 3.

## 3. Track E-Waste Status

### Primary Actor

User

### Stakeholders

* User — wants to know what has happened to their e-waste.
* Collector — updates the collection and transportation status.
* E-Waste Collection System — maintains the item's lifecycle information.

### Preconditions

* User is logged into the system.
* The user has at least one delivered e-waste item.

### Postconditions

* The user can view the current status of the selected e-waste item.
* No information about the e-waste item is modified.

### Trigger

The user selects a registered e-waste item and chooses the **Track Status** option.

### Main Flow

1. User selects **Track E-Waste**.
2. System displays the user's registered e-waste items.
3. User selects an e-waste item.
4. System retrieves the item's current status.
5. System displays the item's status to the user.
6. System displays the item's lifecycle information, such as **Registered, Collected, In Transit, or Recycled**.
7. User exits the tracking view.

### Alternate Flow 1 — Status Not Yet Updated

1. At Step 4, the item exists but its latest status has not yet been updated.
2. System displays the last recorded status.
3. System informs the user that the status has not been updated yet.

### Alternate Flow 2 — Process Completed

1. At Step 4, the item exists but its process has been ended.
2. System displays the task has been accomplished.


