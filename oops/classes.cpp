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
#include<fstream>
#include<iomanip>
using namespace std;

// Tempelate
template <typename T>
class EData{
private:
    T data;
public:
    EData(T d){
        data = d;
    }
};

class EwasteException : public exception{
protected:
    string message;
public:
    EwasteException(const string &msg = "General e-waste system error"){
        message = msg;
    };
    const char *what() const noexcept override{
        return message.c_str(); // return pointer to null terminated string
    }
};

class InvalidItemException : public EwasteException{
public:
    InvalidItemException(const string &msg) : EwasteException("[Item Error]" + msg) {}
};

class PickUpException : public EwasteException{
public:
    PickUpException(const string &msg) : EwasteException("[Pickup error]" + msg) {}
};

class MyException{
    string message;
public:
    MyException(string msg){
        message = msg;
    }

    string what(){
        return message;
    }
};

// User-defined exception for invalid pickup requests
class InvalidPickupException{
    string message;
public:
    InvalidPickupException(string msg){
        message = msg;
    }

    string what() const{
        return message;
    }
};

class EWasteItem{
protected:
    string itemId;
    string itemType;
    string category;
    string description;
    double weight;
public:
    // Default Constructor
    EWasteItem(){
        itemId = "";
        itemType = "";
        category = "";
        description = "";
        weight = 0.0;
    }
    // Parameterized Constructor
    EWasteItem(string id, string type, string cat, string desc, double w){
        // throw implementation
        if(w < 0){
            throw invalid_argument("Weight cannot be negative");
        }
        itemId = id;
        itemType = type;
        category = cat;
        description = desc;
        weight = w;
    }

    // Copy Constructor
    EWasteItem(const EWasteItem &other){
        itemId = other.itemId;
        itemType = other.itemType;
        category = other.category;
        description = other.description;
        weight = other.weight;
    }
    // Virtual destructor (needed to delete derived objects via base pointer)
    virtual ~EWasteItem() {}
    // Virtual Function
    virtual void display_info(){
        cout << "Item ID       : " << itemId << endl;
        cout << "Item Type     : " << itemType << endl;
        cout << "Category      : " << category << endl;
        cout << "Description   : " << description << endl;
        cout << "Weight        : " << weight << " kg" << endl;
    }
    string getItemId() const{
        return itemId;
    }
    string getItemType()const{
        return itemType;
    }
    string getdes()const{
        return description;
    }
    double getWeight() const{
        return weight;
    }
    string getCategory() const{
        return category;
    }
    // class to basic type casting
    operator double(){
        return weight;
    }
    // Stream operator overloading using friend function
    friend ostream &operator<<(ostream &out, const EWasteItem &item){
        out << "Item ID: " << item.itemId << endl;
        out << "Item Type: " << item.itemType << endl;
        out << "Category: " << item.category << endl;
        out << "Weight: " << item.weight << " kg" << endl;
        return out;
    }
};

// Recycled Material Class (For class to class typecasting)
class RecycledMaterial{
private:
    string materialId;
    string materialCategory;
    double weight;
public:
    RecycledMaterial(){
        materialId = "";
        materialCategory = "";
        weight = 0.0;
    }
    // Class to class conversion constructor
    RecycledMaterial(const EWasteItem &item){
        materialId = item.getItemId();
        materialCategory = item.getCategory();
        weight = item.getWeight();
    }

    void display() const{
        cout << "Recycled Material Details" << endl;
        cout << "Material ID: " << materialId << endl;
        cout << "Category: " << materialCategory << endl;
        cout << "Weight: " << weight << " kg" << endl;
    }
};

// ---------------- PHONE ----------------
class Phone : public EWasteItem{
protected:
    string brand;
    string model;
    int storage;
public:
    Phone() : EWasteItem(){
        brand = "";
        model = "";
        storage = 0;
    }
    Phone(string id, string type, string cat, string desc, double w, string b, string m, int s) : EWasteItem(id, type, cat, desc, w){
        brand = b;
        model = m;
        storage = s;
    }
    Phone(const Phone &other) : EWasteItem(other){
        brand = other.brand;
        model = other.model;
        storage = other.storage;
    }
    void display_info() override{
        EWasteItem::display_info();
        cout << "Brand         : " << brand << endl;
        cout << "Model         : " << model << endl;
        cout << "Storage       : " << storage << " GB" << endl;
    }
    string getBrand()const{
        return brand;
    }
    string getModel()const{
        return model;
    }
    int getStorage()const{
        return storage;
    }
};

// ---------------- SMARTPHONE ----------------
class SmartPhone : virtual public Phone{
private:
    string operatingSystem;
public:
    SmartPhone() : Phone(){
        operatingSystem = "";
    }
    SmartPhone(string id, string type, string cat, string desc,double w, string b, string m, int s, string os):Phone(id, type, cat, desc, w, b, m, s){
        operatingSystem = os;
    }
    SmartPhone(const SmartPhone &other) : Phone(other){
        operatingSystem = other.operatingSystem;
    }
    // final prevents further overriding
    void display_info() override final{
        Phone::display_info();
        cout << "Operating System : "<< operatingSystem << endl;
    }
    string getOperatingSystem() const {
        return operatingSystem;
    }
};
// ---------------- LAPTOP ----------------
class Laptop : virtual public EWasteItem{
private:
    string brand;
    string model;
    int ram;
public:
    Laptop():EWasteItem(){
        brand = "";
        model = "";
        ram = 0;
    }
    Laptop(string id, string type, string cat, string desc, double w, string b, string m, int r) : EWasteItem(id, type, cat, desc, w){
        brand = b;
        model = m;
        ram = r;
    }
    Laptop(const Laptop &other):EWasteItem(other){
        brand = other.brand;
        model = other.model;
        ram = other.ram;
    }
    void display_info() override{
        EWasteItem::display_info();
        cout << "Brand         : " << brand << endl;
        cout << "Model         : " << model << endl;
        cout << "RAM           : " << ram << " GB" << endl;
    }
    string getBrand() const{
        return brand;
    }
    string getModel() const{
        return model;
    }
    int getRAM() const{
        return ram;
    }
};
// ---------------- BATTERY ----------------
class Battery : public EWasteItem{
private:
    string batteryType;
    double capacity;
public:
    Battery() : EWasteItem(){
        batteryType = "";
        capacity = 0.0;
    }
    Battery(string id, string type, string cat, string desc,double w, string bt, double cap):EWasteItem(id, type, cat, desc, w){
        batteryType = bt;
        capacity = cap;
    }
    Battery(const Battery &other):EWasteItem(other){
        batteryType = other.batteryType;
        capacity = other.capacity;
    }
    void display_info() override{
        EWasteItem::display_info();
        cout << "Battery Type  : " << batteryType << endl;
        cout << "Capacity      : " << capacity << " mAh" << endl;
    }
    string getBatteryType() const{
        return batteryType;
    }
    double getCapacity() const {
        return capacity;
    }
};
class charger : public Laptop, public Phone{
private:
    int mfgDate;
    int capacity;
    void chargecap(int capacity){
        cout << "This charger charges with capacity of " << capacity << "mAh." << endl;
    }
};
// ----------------STATUS----------------
class Status{
private:
    int statusId;
    string statusName;
public:
    Status(){
        statusId = 0;
        statusName = "Pending";
    }
    Status(string name){
        statusId = 0;
        statusName = name;
    }
    Status(int id, string name){
        statusId = id;
        statusName = name;
    }
    Status(const Status &other){
        statusId = other.statusId;
        statusName = other.statusName;
    }
    string getStatusName() const{
        return statusName;
    }
    // "this" pointer used
    void setStatus(string name){
        this->statusName = name;
    }
    void displayStatus() const{
        cout << "Status: " << statusName << endl;
    }
};
// ----------------PICKUP REQUEST----------------
class PickupRequest{
public:
    // NESTED CLASS
    class PickupSchedule{
    private:
        string date;
        string time;
    public:
        PickupSchedule(){
            date = "Not Set";
            time = "Not Set";
        }
        PickupSchedule(string d, string t){
            date = d;
            time = t;
        }
        void displaySchedule() const{
            cout << "Date : " << date << endl;
            cout << "Time : " << time << endl;
        }
        string getDate() const {
            return date;
        }
        string getTime() const {
            return time;
        }
    };
private:
    int requestId;
    string address;
    Status status;
    PickupSchedule schedule;
public:
    PickupRequest(){
        requestId = 0;
        address = "";
        status = Status();
        schedule = PickupSchedule();
    }
    PickupRequest(int id, string addr, Status s, PickupSchedule ps){
        if(id <= 0 || addr.empty()){
            throw InvalidPickupException("Invalid pickup request! Request ID must be positive and address cannot be empty.");
        }
        requestId = id;
        address = addr;
        status = s;
        schedule = ps;
    }
    void updateStatus(string newStatus){
        status.setStatus(newStatus);
    }
    string getStatus() const{
        return status.getStatusName();
    }
    int getRequestId() const{
        return requestId;
    }
    string getAddress() const {
        return address;
    }
    string getPickupDate() const {
        return schedule.getDate();
    }
    string getPickupTime() const {
        return schedule.getTime();
    }
    void displayRequest() const{
        cout << "PICKUP REQUEST DETAILS" << endl;
        cout << "Request ID : " << requestId << endl;
        cout << "Address    : " << address << endl;
        cout << "Status     : " << status.getStatusName() << endl;
        cout << "Pickup Schedule:" << endl;
        schedule.displaySchedule();
    }
};
// ---------------- REWARD SERVICE ----------------
class RewardService{
private:
    double pointsPerKg;
    double bonusPoints;
    // STATIC VARIABLE
    static int totalServices;
public:
    RewardService(){
        pointsPerKg = 10.0;
        bonusPoints = 20.0;
        totalServices++;
    }
    RewardService(double ppk, double bp){
        pointsPerKg = ppk;
        bonusPoints = bp;
        totalServices++;
    }
    RewardService(const RewardService &other){
        pointsPerKg = other.pointsPerKg;
        bonusPoints = other.bonusPoints;
        totalServices++;
    }
    // STATIC FUNCTION
    static void showTotalServices(){
        cout << "Total Reward Services: " << totalServices << endl;
    }
};
// Definition of static variable
int RewardService::totalServices = 0;
void processPickup(int id){
    cout << "Processing id: " << id << endl;
}
// ---------------- INPUT HELPERS ----------------
string readLine(const string &prompt){
    string s;
    cout << prompt;
    getline(cin, s);
    return s;
}
int readInt(const string &prompt){
    while (true){
        string s = readLine(prompt);
        try{
            size_t pos;
            int v = stoi(s, &pos);
            if(pos == s.size())return v;
        }
        catch (...){}
        cout << "Invalid number, try again." << endl;
    }
}
double readDouble(const string &prompt){
    while (true){
        string s = readLine(prompt);
        try{
            size_t pos;
            double v = stod(s, &pos);
            if (pos == s.size())
                return v;
        }
        catch (...)
        {
        }
        cout << "Invalid number, try again." << endl;
    }
}
void saveItems(const vector<EWasteItem*>& items) {
    ofstream file("ewaste_items.txt");
    if (!file) {
        cout << "Error opening items file!" << endl;
        return;
    }
    for (EWasteItem* it : items){
        if (SmartPhone* s = dynamic_cast<SmartPhone*>(it)){
            file << "S "<< quoted(s->getItemId()) << " "<< quoted(s->getItemType()) << " "<< quoted(s->getCategory()) << " "<< quoted(s->getdes()) << " "<< s->getWeight() << " "<< quoted(s->getBrand()) << " "<< quoted(s->getModel()) << " "<< s->getStorage() << " "<< quoted(s->getOperatingSystem()) << endl;
        }
        else if (Phone* p = dynamic_cast<Phone*>(it)){
            file << "P "<< quoted(p->getItemId()) << " "<< quoted(p->getItemType()) << " "<< quoted(p->getCategory()) << " "<< quoted(p->getdes()) << " "<< p->getWeight() << " "<< quoted(p->getBrand()) << " "<< quoted(p->getModel()) << " "<< p->getStorage() << endl;
        }
        else if (Laptop* l = dynamic_cast<Laptop*>(it)){
            file << "L "<< quoted(l->getItemId()) << " "<< quoted(l->getItemType()) << " "<< quoted(l->getCategory()) << " "<< quoted(l->getdes()) << " "<< l->getWeight() << " "<< quoted(l->getBrand()) << " "<< quoted(l->getModel()) << " "<< l->getRAM() << endl;
        }
        else if (Battery* b = dynamic_cast<Battery*>(it)){
            file<< "B "<< quoted(b->getItemId()) << " "<< quoted(b->getItemType()) << " "<< quoted(b->getCategory()) << " "<< quoted(b->getdes()) <<" "<< b->getWeight()<<" "<< quoted(b->getBatteryType()) << " "<< b->getCapacity() << endl;
        }
        else {
            file << "G "<< quoted(it->getItemId()) << " "<< quoted(it->getItemType()) << " "<< quoted(it->getCategory()) << " "<< quoted(it->getdes()) << " "<< it->getWeight() << endl;
        }
    }
    file.close();
}
void loadItems(vector<EWasteItem*>& items) {
    ifstream file("ewaste_items.txt");
    if (!file)return;
    char type;
    while (file >> type) {
        string id, itemType, category, description;
        double weight;
        file >> quoted(id)>> quoted(itemType)>> quoted(category)>> quoted(description)>> weight;
        if (!file)break;
        if (type == 'G') {
            items.push_back(new EWasteItem(id, itemType, category,description, weight));
        }
        else if (type == 'P') {
            string brand, model;
            int storage;
            file >> quoted(brand) >> quoted(model) >> storage;
            items.push_back(new Phone(id, itemType, category, description,weight, brand, model, storage));
        }
        else if (type == 'S') {
            string brand, model, os;
            int storage;
            file >> quoted(brand) >> quoted(model)>> storage >> quoted(os);
            items.push_back(new SmartPhone(id, itemType, category, description,weight, brand, model, storage, os));
        }
        else if (type == 'L') {
            string brand, model;
            int ram;
            file >> quoted(brand) >> quoted(model) >> ram;
            items.push_back(new Laptop(id, itemType, category, description,weight, brand, model, ram));
        }
        else if (type == 'B') {
            string batteryType;
            double capacity;
            file >> quoted(batteryType) >> capacity;
            items.push_back(new Battery(id, itemType, category, description,weight, batteryType, capacity));
        }
        if (!file)break;
    }
    file.close();
}
// ---------------- MAIN ----------------
int main(){
    vector<EWasteItem *> items;
    vector<PickupRequest> requests;
    loadItems(items);
    int choice = -1;
    while (choice != 0){
        cout << "\n========== E-WASTE COLLECTION SYSTEM ==========\n";
        cout << "1.  Add e-waste item\n";
        cout << "2.  Display all items\n";
        cout << "3.  Show item\n";
        cout << "4.  Schedule pickup request\n";
        cout << "5.  Update pickup status\n";
        cout << "6.  View all pickup requests\n";
        cout << "7.  Convert item to recycled material/weight\n";
        cout << "8.  Reward service and points\n";
        cout << "9.  Process pickups\n";
        cout << "0.  Exit\n";
        choice = readInt("Enter choice: ");
        switch (choice){
        case 1:
        {
            cout << "\nItem type: 1.Generic  2.Phone  3.SmartPhone  4.Laptop  5.Battery\n";
            int t = readInt("Select type: ");
            if (t < 1 || t > 5){
                cout << "Invalid item type." << endl;
                break;
            }
            string id = readLine("Item ID: ");
            bool dup = false;
            for (EWasteItem *it : items)
                if (it->getItemId() == id)
                    dup = true;
            if(dup){
                cout << "Item ID already exists." << endl;
                break;
            }
            string type = readLine("Item Type (e.g. Phone): ");
            string cat = readLine("Category: ");
            string desc = readLine("Description: ");
            double w = readDouble("Weight (kg): ");
            try{
                EWasteItem *obj = nullptr;
                if (t == 1){
                    obj = new EWasteItem(id, type, cat, desc, w);
                }
                else if (t == 2){
                    string b = readLine("Brand: ");
                    string m = readLine("Model: ");
                    int s = readInt("Storage (GB): ");
                    obj = new Phone(id, type, cat, desc, w, b, m, s);
                }
                else if (t == 3){
                    string b = readLine("Brand: ");
                    string m = readLine("Model: ");
                    int s = readInt("Storage (GB): ");
                    string os = readLine("Operating System: ");
                    obj = new SmartPhone(id, type, cat, desc, w, b, m, s, os);
                }
                else if (t == 4){
                    string b = readLine("Brand: ");
                    string m = readLine("Model: ");
                    int r = readInt("RAM (GB): ");
                    obj = new Laptop(id, type, cat, desc, w, b, m, r);
                }
                else{
                    string bt = readLine("Battery Type: ");
                    double cap = readDouble("Capacity (mAh): ");
                    obj = new Battery(id, type, cat, desc, w, bt, cap);
                }
                items.push_back(obj);
                saveItems(items);
                cout << "Item added successfully." << endl;
            }
            catch (const invalid_argument &e){
                cout << "Error: " << e.what() << endl;
            }
            break;
        }
        case 2:
        {
            if (items.empty()){
                cout << "No items added yet." << endl;
                break;
            }
            // Sort by weight (ascending) using algorithm
            vector<EWasteItem *> sorted = items;
            sort(sorted.begin(), sorted.end(),[](EWasteItem *a, EWasteItem *b){ return a->getWeight() < b->getWeight(); });
            cout << "\nItems (sorted by weight):\n";
            for (EWasteItem *it : sorted){
                cout << "-------------------------" << endl;
                it->display_info(); // runtime polymorphism
            }
            break;
        }
        case 3:
        {
            string id = readLine("Enter item ID: ");
            bool found = false;
            for (EWasteItem *it : items){
                if (it->getItemId() == id){
                    cout << *it;
                    found = true;
                }
            }
            if (!found)
                cout << "Item not found." << endl;
            break;
        }
        case 4:
        {
            int id = readInt("Request ID: ");
            string addr = readLine("Address: ");
            string d = readLine("Pickup date: ");
            string tm = readLine("Pickup time: ");
            try{
                PickupRequest req(id, addr, Status("Pending"),
                                  PickupRequest::PickupSchedule(d, tm));
                requests.push_back(req);
                cout << "Pickup request scheduled." << endl;
            }
            catch (const InvalidPickupException &e){
                cout << "Exception caught: " << e.what() << endl;
            }
            break;
        }
        case 5:
        {
            int id = readInt("Request ID to update: ");
            bool found = false;
            for (PickupRequest &r : requests){
                if (r.getRequestId() == id){
                    cout << "1.Pending  2.Out for Pickup  3.Completed\n";
                    int s = readInt("New status: ");
                    if (s == 1)
                        r.updateStatus("Pending");
                    else if (s == 2)
                        r.updateStatus("Out for Pickup");
                    else if (s == 3)
                        r.updateStatus("Completed");
                    else
                    {
                        cout << "Invalid status choice." << endl;
                        found = true;
                        break;
                    }
                    cout << "Status updated to: " << r.getStatus() << endl;
                    found = true;
                }
            }
            if (!found)
                cout << "Request not found." << endl;
            break;
        }
        case 6:
        {
            if (requests.empty()){
                cout << "No pickup requests yet." << endl;
                break;
            }
            for (const PickupRequest &r : requests){
                cout << "-------------------------" << endl;
                r.displayRequest();
            }
            break;
        }
        case 7:
        {
            string id = readLine("Enter item ID: ");
            bool found = false;
            for (EWasteItem *it : items){
                if (it->getItemId() == id){
                    RecycledMaterial material = *it; // class-to-class conversion
                    material.display();
                    double w = *it; // class-to-basic conversion
                    cout << "Weight using type casting: " << w << " kg" << endl;
                    found = true;
                }
            }
            if (!found)
                cout << "Item not found." << endl;
            break;
        }
        case 8:
        {
            double ppk = readDouble("Points per kg: ");
            double bp = readDouble("Bonus points: ");
            RewardService service(ppk, bp); // static counter increases
            RewardService::showTotalServices();
            double totalWeight = 0;
            for (EWasteItem *it : items)
                totalWeight += it->getWeight();
            cout << "Total weight of items: " << totalWeight << " kg" << endl;
            cout << "Reward points earned: " << totalWeight * ppk + bp << endl;
            break;
        }
        case 9:
        {
            if (requests.empty()){
                cout << "No pickup requests to process." << endl;
                break;
            }
            vector<thread> threads;
            for (PickupRequest &r : requests)
                threads.push_back(thread(processPickup, r.getRequestId()));
            for (thread &th : threads)
                th.join();
            break;
        }
        case 10:
        {
            cout << "\n1.Object slicing  2.Template  3.Custom exceptions\n";
            int d = readInt("Select demo: ");
            if (d == 1){
                Phone ph("P000", "Phone", "Mobile", "Demo phone", 0.4,
                         "Samsung", "S21", 128);
                EWasteItem sliced = ph; // object slicing
                cout << "After object slicing (Phone fields lost):" << endl;
                sliced.display_info();
            }
            else if (d == 2){
                EData<int> e1(100);
                EData<string> e2("Template data");
                EData<double> e3(2.5);
                cout << "EData created for int, string and double." << endl;
            }
            else if (d == 3){
                try{
                    throw InvalidItemException("Unknown item type");
                }
                catch (const EwasteException &e){
                    cout << "Caught: " << e.what() << endl;
                }
                try{
                    throw PickUpException("Pickup slot unavailable");
                }
                catch (const EwasteException &e){
                    cout << "Caught: " << e.what() << endl;
                }
                try{
                    throw MyException("Custom exception without base class");
                }
                catch (MyException &e){
                    cout << "Caught: " << e.what() << endl;
                }
            }
            else{
                cout << "Invalid demo choice." << endl;
            }
            break;
        }
        case 0:
            saveItems(items);
            cout << "Exiting program. Goodbye!" << endl;
            break;
        default:
            cout << "Invalid choice, try again." << endl;
        }
    }
    for (EWasteItem *it : items)
        delete it;
}