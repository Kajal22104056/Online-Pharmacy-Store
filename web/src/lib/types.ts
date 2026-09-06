export type Role = "customer" | "doctor" | "employee";

export type Customer = {
  CID: number;
  Cname: string;
  Gender: string;
  Age: number;
  Contact: number;
  Address: string;
};

export type Doctor = {
  docID: number;
  Dname: string;
  Gender: string;
  Contact: number;
  Speciality: string;
  Address: string;
};

export type Employee = {
  EID: number;
  Ename: string;
  Gender: string;
  Age: number;
  Address: string;
  Contact: number;
  Salary: number;
};

export type Invoice = {
  invoiceID: number;
  CID: number;
  docID: number;
  medID: number;
  Quantity: number;
  Amount: number;
};

export type Login = {
  Lid: number;
  Role: Role | string;
  Username: string;
  Password: string;
};

export type Medicine = {
  medID: number;
  Mname: string;
  MfgDate: string;
  ExpDate: string;
  description: string;
  Quantity: number;
  Price: number;
};

export type Pharmacy = {
  pharID: number;
  pharName: string;
  Address: string;
  City: string;
  State: string | null;
  Pincode: number | null;
  Location: string;
};

export type Supplier = {
  supplierID: number;
  Sname: string;
  Location: string;
  State: string;
  City: string;
};

export type CartItem = {
  id: number;
  medID: number;
  name: string;
  quantity: number;
  tprice: number;
};

export type Order = {
  id: number;
  username: string;
  items: CartItem[];
  amount: number;
  method: "card" | "netbanking" | "cod";
  status: "Packed" | "Shipped" | "Out for delivery" | "Delivered";
  createdAt: string;
  address: string;
  name: string;
  phone: string;
};

export type Prescription = {
  id: number;
  docUsername: string;
  docID: number;
  doctorName: string;
  CID: number;
  customerName: string;
  medID: number;
  medicineName: string;
  notes: string;
  createdAt: string;
};

export type Feedback = {
  id: number;
  medID: number;
  medicineName: string;
  username: string;
  text: string;
  rating: number;
};

export type Session = {
  username: string;
  role: Role;
  lid: number;
};

export type StoreData = {
  customer: Customer[];
  doctor: Doctor[];
  employee: Employee[];
  invoice: Invoice[];
  login: Login[];
  medicine: Medicine[];
  pharmacy: Pharmacy[];
  supplier: Supplier[];
  cart: CartItem[];
  orders: Order[];
  prescriptions: Prescription[];
  feedback: Feedback[];
  session: Session | null;
};
