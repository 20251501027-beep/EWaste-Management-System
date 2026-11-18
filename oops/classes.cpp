#include <iostream>
#include <string>
#include <thread>
#include <mutex>
#include <chrono>
#include <exception>
#include <stdexcept>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

// Tempelate
template <typename T>
class EData
{
private:
    T data;

public:
    EData(T d)
    {
        data = d;
    }
};

class EwasteException : public exception
{
protected:
    string message;

public:
    EwasteException(const string &msg = "General e-waste system error")
    {
        message = msg;
    };
    const char *what() const noexcept override
    {
        return message.c_str(); // return pointer to null terminated string
    }
};

class InvalidItemException : public EwasteException
{
public:
    InvalidItemException(const string &msg) : EwasteException("[Item Error]" + msg) {}
};
class PickUpException : public EwasteException
{
public:
    PickUpException(const string &msg) : EwasteException("[Pickup error]" + msg) {}
};

class MyException
{
    string message;

public:
    MyException(string msg)
    {
        message = msg;
    }

    string what()
    {
        return message;
    }
};

// User-defined exception for invalid pickup requests
class InvalidPickupException
{
    string message;

public:
    InvalidPickupException(string msg)
    {
        message = msg;
    }

    string what() const
    {
        return message;
    }
};

class EWasteItem
{
protected:
    string itemId;
    string itemType;
    string category;
    string description;
    double weight;

public:
    // Default Constructor
    EWasteItem()
    {
        itemId = "";
        itemType = "";
        category = "";
        description = "";
        weight = 0.0;
    }

    // Parameterized Constructor
    EWasteItem(string id, string type, string cat, string desc, double w)
    {
        // throw implementation
        if (w < 0)
        {
            throw invalid_argument("Weight cannot be negative");
        }
        itemId = id;
        itemType = type;
        category = cat;
        description = desc;
        weight = w;
    }

    // Copy Constructor
    EWasteItem(const EWasteItem &other)
    {
        itemId = other.itemId;
        itemType = other.itemType;
        category = other.category;
        description = other.description;
        weight = other.weight;
    }

    // Virtual Function
    virtual void display_info()
    {
        cout << "Item ID       : " << itemId << endl;
        cout << "Item Type     : " << itemType << endl;
        cout << "Category      : " << category << endl;
        cout << "Description   : " << description << endl;
        cout << "Weight        : " << weight << " kg" << endl;
    }
    string getItemId() const
    {
        return itemId;
    }

    double getWeight() const
    {
        return weight;
    }

    string getCategory() const
    {
        return category;
    }
    // class to basic type casting
    operator double()
    {
        return weight;
    }

    // Stream operator overloading using friend function
    friend ostream &operator<<(ostream &out, const EWasteItem &item)
    {
        out << "Item ID: " << item.itemId << endl;
        out << "Item Type: " << item.itemType << endl;
        out << "Category: " << item.category << endl;
        out << "Weight: " << item.weight << " kg" << endl;
        return out;
    }
};

// Recycled Material Class (For class to class typecasting)
class RecycledMaterial
{
private:
    string materialId;
    string materialCategory;
    double weight;

public:
    RecycledMaterial()
    {
        materialId = "";
        materialCategory = "";
        weight = 0.0;
    }
    // Class to class conversion constructor
    RecycledMaterial(const EWasteItem &item)
    {
        materialId = item.getItemId();
        materialCategory = item.getCategory();
        weight = item.getWeight();
    }

    void display() const
    {
        cout << "Recycled Material Details" << endl;
        cout << "Material ID: " << materialId << endl;
        cout << "Category: " << materialCategory << endl;
        cout << "Weight: " << weight << " kg" << endl;
    }
};

// ---------------- PHONE ----------------
class Phone : public EWasteItem
{
protected:
    string brand;
    string model;
    int storage;

public:
    Phone() : EWasteItem()
    {
        brand = "";
        model = "";
        storage = 0;
    }

    Phone(string id, string type, string cat, string desc, double w, string b, string m, int s) : EWasteItem(id, type, cat, desc, w)
    {
        brand = b;
        model = m;
        storage = s;
    }
    Phone(const Phone &other) : EWasteItem(other)
    {
        brand = other.brand;
        model = other.model;
        storage = other.storage;
    }
    void display_info() override
    {
        EWasteItem::display_info();

        cout << "Brand         : " << brand << endl;
        cout << "Model         : " << model << endl;
        cout << "Storage       : " << storage << " GB" << endl;
    }
};

// ---------------- SMARTPHONE ----------------
class SmartPhone : virtual public Phone
{
private:
    string operatingSystem;

public:
    SmartPhone() : Phone()
    {
        operatingSystem = "";
    }

    SmartPhone(string id, string type, string cat, string desc,
               double w, string b, string m, int s, string os)
        : Phone(id, type, cat, desc, w, b, m, s)
    {

        operatingSystem = os;
    }

    SmartPhone(const SmartPhone &other) : Phone(other)
    {
        operatingSystem = other.operatingSystem;
    }

    // final prevents further overriding
    void display_info() override final
    {
        Phone::display_info();

        cout << "Operating System : "
             << operatingSystem << endl;
    }
};

// ---------------- LAPTOP ----------------

class Laptop : virtual public EWasteItem
{
private:
    string brand;
    string model;
    int ram;

public:
    Laptop() : EWasteItem()
    {
        brand = "";
        model = "";
        ram = 0;
    }
    Laptop(string id, string type, string cat, string desc, double w, string b, string m, int r) : EWasteItem(id, type, cat, desc, w)
    {
        brand = b;
        model = m;
        ram = r;
    }
    Laptop(const Laptop &other) : EWasteItem(other)
    {
        brand = other.brand;
        model = other.model;
        ram = other.ram;
    }
    void display_info() override
    {
        EWasteItem::display_info();
        cout << "Brand         : " << brand << endl;
        cout << "Model         : " << model << endl;
        cout << "RAM           : " << ram << " GB" << endl;
    }
};
// ---------------- BATTERY ----------------
class Battery : public EWasteItem
{
private:
    string batteryType;
    double capacity;

public:
    Battery() : EWasteItem()
    {
        batteryType = "";
        capacity = 0.0;
    }
    Battery(string id, string type, string cat, string desc,
            double w, string bt, double cap)
        : EWasteItem(id, type, cat, desc, w)
    {
        batteryType = bt;
        capacity = cap;
    }
    Battery(const Battery &other) : EWasteItem(other)
    {
        batteryType = other.batteryType;
        capacity = other.capacity;
    }
    void display_info() override
    {
        EWasteItem::display_info();
        cout << "Battery Type  : " << batteryType << endl;
        cout << "Capacity      : " << capacity << " mAh" << endl;
    }
};

class charger : public Laptop, public Phone
{
private:
    int mfgDate;
    int capacity; // mAh
    void chargecap(int capacity)
    {
        cout << "This charger charges with capacity of " << capacity << "mAh." << endl;
    }
};
// ----------------STATUS----------------
class Status
{
private:
    int statusId;
    string statusName;

public:
    Status()
    {
        statusId = 0;
        statusName = "Pending";
    }
    Status(string name)
    {
        statusId = 0;
        statusName = name;
    }
    Status(int id, string name)
    {
        statusId = id;
        statusName = name;
    }
    Status(const Status &other)
    {
        statusId = other.statusId;
        statusName = other.statusName;
    }
    string getStatusName() const
    {
        return statusName;
    }
    // "this" pointer used
    void setStatus(string name)
    {
        this->statusName = name;
    }
    void displayStatus() const
    {
        cout << "Status: " << statusName << endl;
    }
};
// ----------------PICKUP REQUEST----------------
class PickupRequest
{
public:
    // NESTED CLASS
    class PickupSchedule
    {
    private:
        string date;
        string time;

    public:
        PickupSchedule()
        {
            date = "Not Set";
            time = "Not Set";
        }
        PickupSchedule(string d, string t)
        {
            date = d;
            time = t;
        }
        void displaySchedule() const
        {
            cout << "Date : " << date << endl;
            cout << "Time : " << time << endl;
        }
    };

private:
    int requestId;
    string address;
    Status status;
    PickupSchedule schedule;

public:
    PickupRequest()
    {
        requestId = 0;
        address = "";
        status = Status();
        schedule = PickupSchedule();
    }
    PickupRequest(int id, string addr, Status s, PickupSchedule ps)
    {
        if (id <= 0 || addr.empty())
        {
            throw InvalidPickupException(
                "Invalid pickup request! Request ID must be positive "
                "and address cannot be empty.");
        }
        requestId = id;
        address = addr;
        status = s;
        schedule = ps;
    }
    void updateStatus(string newStatus)
    {
        status.setStatus(newStatus);
    }
    string getStatus() const
    {
        return status.getStatusName();
    }
    int getRequestId() const
    {
        return requestId;
    }
    void displayRequest() const
    {
        cout << "PICKUP REQUEST DETAILS" << endl;
        cout << "Request ID : " << requestId << endl;
        cout << "Address    : " << address << endl;
        cout << "Status     : " << status.getStatusName() << endl;
        cout << "Pickup Schedule:" << endl;
        schedule.displaySchedule();
    }
};
// ---------------- REWARD SERVICE ----------------
class RewardService
{
private:
    double pointsPerKg;
    double bonusPoints;
    // STATIC VARIABLE
    static int totalServices;

public:
    RewardService()
    {
        pointsPerKg = 10.0;
        bonusPoints = 20.0;
        totalServices++;
    }
    RewardService(double ppk, double bp)
    {
        pointsPerKg = ppk;
        bonusPoints = bp;
        totalServices++;
    }

    RewardService(const RewardService &other)
    {
        pointsPerKg = other.pointsPerKg;
        bonusPoints = other.bonusPoints;
        totalServices++;
    }

    // STATIC FUNCTION
    static void showTotalServices()
    {
        cout << "Total Reward Services: " << totalServices << endl;
    }
};

// Definition of static variable
int RewardService::totalServices = 0;

void processPickup(int id)
{
    cout << "Processing id: " << id << endl;
}

// ---------------- MAIN ----------------

int main()
{

    // ---------------- STREAM OPERATOR ----------------
    try
    {
        EWasteItem item1(
            "E001",
            "Phone",
            "Mobile",
            "Old smartphone",
            0.5);
        cout << item1;
    }
    catch (const invalid_argument &e)
    {
        cout << e.what() << endl;
    }

    // ---------------- OBJECT SLICING ----------------
    Phone phone(
        "P001",
        "Phone",
        "Mobile",
        "Old phone",
        0.4,
        "Samsung",
        "S21",
        128);

    EWasteItem item2 = phone; // Object slicing

    cout << "\nAfter Object Slicing:\n";
    item2.display_info();

    // ---------------- STATIC VARIABLE ----------------
    RewardService r1;
    RewardService r2;
    RewardService r3;

    // ---------------- STATIC FUNCTION ----------------
    RewardService::showTotalServices();

    EWasteItem item3(
        "E002",
        "Phone",
        "Mobile",
        "Old smartphone",
        0.5);

    EWasteItem *p1 = &item3; // Pointer to base-class object
    Phone *p2 = &phone;      // Pointer to derived-class object
    EWasteItem *p3 = &phone; // Base-class pointer to derived-class object
    p3->display_info();      // Runtime polymorphism

    // Class-to-class conversion
    RecycledMaterial material = item3;
    material.display();

    // Class-to-basic type casting
    double w = item3;
    cout << "Weight using type casting: " << w << " kg" << endl;

    // Basic-to-class type casting
    Status currstatus = (string) "Out for Pickup";
    currstatus.displayStatus();

    // ---------------- USER-DEFINED EXCEPTION: INVALID PICKUP ----------------
    try
    {
        Status pickupStatus("Pending");

        PickupRequest request(
            -1,          // Invalid request ID to test exception
            "Ahmedabad", // Pickup address
            pickupStatus,
            PickupRequest::PickupSchedule());

        request.displayRequest();
    }
    catch (const InvalidPickupException &e)
    {
        cout << "Exception caught: " << e.what() << endl;
    }

    thread t1(processPickup, 11);
    thread t2(processPickup, 12);
    t1.join();
    t2.join();
    return 0;
}