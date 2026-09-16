#include<bits/stdc++.h>
using namespace std;

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
        itemId="";
        itemType="";
        category="";
        description="";
        weight=0.0;
    }
    // Parameterized Constructor
    EWasteItem(string id,string type,string cat,string desc,double w){
        itemId=id;
        itemType=type;
        category=cat;
        description=desc;
        weight=w;
    }

    // Copy Constructor
    EWasteItem(const EWasteItem& other){
        itemId=other.itemId;
        itemType=other.itemType;
        category=other.category;
        description=other.description;
        weight=other.weight;
    }

    //Methods

    virtual void display_info(){
        cout<< "Item ID       : "<<itemId<<endl;
        cout<< "Item Type     : "<<itemType<<endl;
        cout<< "Category      : "<<category<<endl;
        cout<< "Description   : "<<description<<endl;
        cout<< "Weight        : "<<weight<<" kg"<<endl;
    }
    // Getter
    string getItemId() const{
        return itemId;
    }
    double getWeight() const{
        return weight;
    }
    string getCategory() const{
        return category;
    }
    // Friend Overrloading function
    friend double operator+(const EWasteItem& item1,const EWasteItem& item2){
        return item1.weight+item2.weight;
    }
};
class Phone:public EWasteItem{
    protected:
        string brand;
        string model;
        int storage;
    public:
        // Default Constructor
        Phone(): EWasteItem(){
            brand="";
            model="";
            storage=0;
        }
        // Parameterized Constructor
        Phone(string id, string type, string cat,string desc, double w,string b, string m, int s):EWasteItem(id, type, cat, desc, w){
            brand=b;
            model=m;
            storage=s;
        }
        // Copy Constructor
        Phone(const Phone& other):EWasteItem(other){
            brand=other.brand;
            model=other.model;
            storage=other.storage;
        }
        //Method Overriding
        void display_info() override{
            EWasteItem::display_info();
            cout<<"Brand         : "<<brand<<endl;
            cout<<"Model         : "<<model<<endl;
            cout<<"Storage       : "<<storage<<" GB"<<endl;
        }
};

class SmartPhone: public Phone{
    private:
        string operatingSystem;
    public:
        SmartPhone():Phone(){
            operatingSystem="";
        }
        SmartPhone(string id, string type, string cat,string desc, double w,string b, string m, int s,string os):Phone(id, type, cat, desc, w, b, m, s){
          operatingSystem=os;
        }
        SmartPhone(const SmartPhone& other):Phone(other){
          operatingSystem=other.operatingSystem;
        }

        //Method Overriding
        void display_info() override{
            Phone::display_info();
            cout<<"Operating System : "<<operatingSystem;

        }
};

class Laptop : public EWasteItem{
private:
    string brand;
    string model;
    int ram;
public:
    // Default Constructor
    Laptop():EWasteItem(){
        brand="";
        model="";
        ram=0;
    }
    // Parameterized Constructor
    Laptop(string id, string type, string cat,string desc, double w,string b, string m, int r):EWasteItem(id, type, cat, desc, w){
        brand=b;
        model=m;
        ram=r;
    }
    // Copy Constructor
    Laptop(const Laptop& other): EWasteItem(other){
        brand=other.brand;
        model=other.model;
        ram=other.ram;
    }
    // Method Overriding
    void display_info() override{
        EWasteItem::display_info();
        cout<<"Brand         : "<<brand<<endl;
        cout<<"Model         : "<<model<<endl;
        cout<<"RAM           : "<<ram<< " GB"<<endl;
    }
};

class Battery : public EWasteItem{
private:
    string batteryType;
    double capacity;
public:
    // Default Constructor
    Battery(): EWasteItem(){
        batteryType="";
        capacity=0.0;
    }
    // Parameterized Constructor
    Battery(string id, string type, string cat,string desc, double w,string bt, double cap): EWasteItem(id, type, cat, desc, w){
        batteryType=bt;
        capacity=cap;
    }
    // Copy Constructor
    Battery(const Battery& other): EWasteItem(other){
        batteryType=other.batteryType;
        capacity=other.capacity;
    }

    // Method Overriding
    void display_info() override
    {
        EWasteItem::display_info();
        cout<<"Battery Type  : "<<batteryType <<endl;
        cout<<"Capacity      : "<<capacity <<" mAh"<<endl;
    }
};

class Status{
private:
    int statusId;
    string statusName;
public:
    // Default Constructor
    Status(){
        statusId=0;
        statusName="Pending";
    }

    // Parameterized Constructor
    Status(int id, string name){
        statusId=id;
        statusName=name;
    }
    // Copy Constructor
    Status(const Status& other){
        statusId=other.statusId;
        statusName=other.statusName;
    }
    //Getter 
    string getStatusName() const{
        return statusName;
    }
    //Setter
    void setStatus(string name){
        statusName = name;
    }
    //Overriding
    void displayStatus() const{
        cout<<"Status: "<<statusName<<endl;
    }
};

class PickupRequest{
private:
    int requestId;
    string address;
    Status status;
    PickupSchedule schedule;
public:
    // Default Constructor
    PickupRequest(){
        requestId=0;
        address="";
        status=Status();
        schedule=PickupSchedule();
    }
    // Parameterized Constructor
    PickupRequest(int id,string addr,Status s,PickupSchedule ps){
        requestId=id;
        address=addr;
        status=s;
        schedule=ps;
    }
    // Copy Constructor
    PickupRequest(const PickupRequest& other){
        requestId=other.requestId;
        address=other.address;
        status=other.status;
        schedule=other.schedule;
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
    void displayRequest() const{
        cout<<"         PICKUP REQUEST DETAILS"<<endl;
        cout<<"Request ID : "<<requestId<<endl;
        cout<<"Address    : "<<address<<endl;
        cout<<"Status     : "<<status.getStatusName()<<endl;
        cout <<"Pickup Schedule:"<<endl;
        schedule.displaySchedule();
    }
};

class PickupSchedule{
private:
    string date;
    string time;
public:
    // Default Constructor
    PickupSchedule(){
        date="Not Set";
        time="Not Set";
    }
    // Parameterized Constructor
    PickupSchedule(string d, string t){
        date=d;
        time=t;
    }
    // Copy Constructor
    PickupSchedule(const PickupSchedule& other){
        date=other.date;
        time=other.time;
    }

    string getDate() const{
        return date;
    }

    string getTime() const{
        return time;
    }

    void displaySchedule() const{
        cout << "Date : " << date << endl;
        cout << "Time : " << time << endl;
    }
};


class RewardService{
private:
    double pointsPerKg;
    double bonusPoints;
public:
    // Default Constructor
    RewardService(){
        pointsPerKg=10.0;
        bonusPoints=20.0;
    }
    // Parameterized Constructor
    RewardService(double ppk, double bp){
        pointsPerKg=ppk;
        bonusPoints=bp;
    }
    // Copy Constructor
    RewardService(const RewardService& other){
        pointsPerKg=other.pointsPerKg;
        bonusPoints=other.bonusPoints;
    }
}