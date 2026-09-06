"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import seed from "./seed.json";
import type {
  Customer,
  Doctor,
  Feedback,
  Medicine,
  Order,
  Prescription,
  Role,
  Session,
  StoreData,
} from "./types";

const STORAGE_KEY = "ops-web-store-v1";

const empty: StoreData = {
  customer: seed.customer as StoreData["customer"],
  doctor: seed.doctor as StoreData["doctor"],
  employee: seed.employee as StoreData["employee"],
  invoice: seed.invoice as StoreData["invoice"],
  login: seed.login as StoreData["login"],
  medicine: seed.medicine as StoreData["medicine"],
  pharmacy: seed.pharmacy as StoreData["pharmacy"],
  supplier: seed.supplier as StoreData["supplier"],
  cart: [],
  orders: [],
  prescriptions: [],
  feedback: [],
  session: null,
};

function nextId(values: number[]) {
  return values.length ? Math.max(...values) + 1 : 1;
}

type StoreApi = StoreData & {
  login: StoreData["login"];
  authenticate: (username: string, password: string, role: Role) => boolean;
  logout: () => void;
  addToCart: (medID: number, quantity: number) => string | null;
  removeFromCart: (medID: number) => void;
  clearCart: () => void;
  placeOrder: (input: {
    method: Order["method"];
    address: string;
    name: string;
    phone: string;
  }) => Order | string;
  addFeedback: (medID: number, text: string, rating: number) => void;
  addPrescription: (input: { CID: number; medID: number; notes: string }) => string | null;
  upsertMedicine: (row: Medicine) => void;
  deleteMedicine: (medID: number) => void;
  upsertCustomer: (row: Customer) => void;
  deleteCustomer: (CID: number) => void;
  upsertDoctor: (row: Doctor) => void;
  deleteDoctor: (docID: number) => void;
  resetData: () => void;
};

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoreData>;
        setData({ ...empty, ...parsed, login: empty.login });
      }
    } catch {
      setData(empty);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const api = useMemo<StoreApi>(() => {
    const persist = (updater: (prev: StoreData) => StoreData) =>
      setData((prev) => updater(prev));

    return {
      ...data,
      authenticate(username, password, role) {
        const match = data.login.find(
          (row) =>
            row.Username === username &&
            row.Password === password &&
            row.Role === role
        );
        if (!match) return false;
        const session: Session = {
          username: match.Username,
          role: match.Role as Role,
          lid: match.Lid,
        };
        persist((prev) => ({ ...prev, session }));
        return true;
      },
      logout() {
        persist((prev) => ({ ...prev, session: null, cart: [] }));
      },
      addToCart(medID, quantity) {
        const med = data.medicine.find((m) => m.medID === medID);
        if (!med) return "Medicine not found.";
        if (quantity < 1) return "Quantity must be at least 1.";
        if (med.Quantity < quantity) return "Not enough stock.";
        persist((prev) => {
          const medicines = prev.medicine.map((m) =>
            m.medID === medID ? { ...m, Quantity: m.Quantity - quantity } : m
          );
          const existing = prev.cart.find((c) => c.medID === medID);
          const cart = existing
            ? prev.cart.map((c) =>
                c.medID === medID
                  ? {
                      ...c,
                      quantity: c.quantity + quantity,
                      tprice: c.tprice + quantity * med.Price,
                    }
                  : c
              )
            : [
                ...prev.cart,
                {
                  id: nextId(prev.cart.map((c) => c.id)),
                  medID,
                  name: med.Mname,
                  quantity,
                  tprice: quantity * med.Price,
                },
              ];
          return { ...prev, medicine: medicines, cart };
        });
        return null;
      },
      removeFromCart(medID) {
        persist((prev) => {
          const item = prev.cart.find((c) => c.medID === medID);
          if (!item) return prev;
          return {
            ...prev,
            cart: prev.cart.filter((c) => c.medID !== medID),
            medicine: prev.medicine.map((m) =>
              m.medID === medID ? { ...m, Quantity: m.Quantity + item.quantity } : m
            ),
          };
        });
      },
      clearCart() {
        persist((prev) => {
          const restored = prev.medicine.map((m) => {
            const item = prev.cart.find((c) => c.medID === m.medID);
            return item ? { ...m, Quantity: m.Quantity + item.quantity } : m;
          });
          return { ...prev, cart: [], medicine: restored };
        });
      },
      placeOrder({ method, address, name, phone }) {
        const session = data.session;
        if (!session) return "Please log in first.";
        if (!data.cart.length) return "Cart is empty.";
        const amount = data.cart.reduce((sum, item) => sum + item.tprice, 0);
        const customer =
          data.customer.find((c) => c.CID === session.lid) ?? data.customer[0];
        const doctor = data.doctor[0];
        const order: Order = {
          id: nextId(data.orders.map((o) => o.id)),
          username: session.username,
          items: data.cart,
          amount,
          method,
          status: "Packed",
          createdAt: new Date().toISOString(),
          address,
          name,
          phone,
        };
        persist((prev) => {
          const invoices = [...prev.invoice];
          for (const item of prev.cart) {
            invoices.push({
              invoiceID: nextId(invoices.map((i) => i.invoiceID)),
              CID: customer.CID,
              docID: doctor.docID,
              medID: item.medID,
              Quantity: item.quantity,
              Amount: item.tprice,
            });
          }
          return {
            ...prev,
            cart: [],
            orders: [order, ...prev.orders],
            invoice: invoices,
          };
        });
        return order;
      },
      addFeedback(medID, text, rating) {
        const med = data.medicine.find((m) => m.medID === medID);
        if (!med || !data.session) return;
        const row: Feedback = {
          id: nextId(data.feedback.map((f) => f.id)),
          medID,
          medicineName: med.Mname,
          username: data.session.username,
          text,
          rating,
        };
        persist((prev) => ({ ...prev, feedback: [row, ...prev.feedback] }));
      },
      addPrescription({ CID, medID, notes }) {
        const session = data.session;
        if (!session || session.role !== "doctor") return "Doctor login required.";
        const customer = data.customer.find((c) => c.CID === CID);
        const med = data.medicine.find((m) => m.medID === medID);
        const doctor =
          data.doctor.find((d) => d.docID === session.lid) ?? data.doctor[0];
        if (!customer || !med) return "Customer or medicine not found.";
        const row: Prescription = {
          id: nextId(data.prescriptions.map((p) => p.id)),
          docUsername: session.username,
          docID: doctor.docID,
          doctorName: doctor.Dname,
          CID,
          customerName: customer.Cname,
          medID,
          medicineName: med.Mname,
          notes,
          createdAt: new Date().toISOString(),
        };
        persist((prev) => ({ ...prev, prescriptions: [row, ...prev.prescriptions] }));
        return null;
      },
      upsertMedicine(row) {
        persist((prev) => {
          const exists = prev.medicine.some((m) => m.medID === row.medID);
          return {
            ...prev,
            medicine: exists
              ? prev.medicine.map((m) => (m.medID === row.medID ? row : m))
              : [...prev.medicine, row],
          };
        });
      },
      deleteMedicine(medID) {
        persist((prev) => ({
          ...prev,
          medicine: prev.medicine.filter((m) => m.medID !== medID),
        }));
      },
      upsertCustomer(row) {
        persist((prev) => {
          const exists = prev.customer.some((c) => c.CID === row.CID);
          return {
            ...prev,
            customer: exists
              ? prev.customer.map((c) => (c.CID === row.CID ? row : c))
              : [...prev.customer, row],
          };
        });
      },
      deleteCustomer(CID) {
        persist((prev) => ({
          ...prev,
          customer: prev.customer.filter((c) => c.CID !== CID),
        }));
      },
      upsertDoctor(row) {
        persist((prev) => {
          const exists = prev.doctor.some((d) => d.docID === row.docID);
          return {
            ...prev,
            doctor: exists
              ? prev.doctor.map((d) => (d.docID === row.docID ? row : d))
              : [...prev.doctor, row],
          };
        });
      },
      deleteDoctor(docID) {
        persist((prev) => ({
          ...prev,
          doctor: prev.doctor.filter((d) => d.docID !== docID),
        }));
      },
      resetData() {
        localStorage.removeItem(STORAGE_KEY);
        setData({ ...empty, session: data.session });
      },
    };
  }, [data]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center text-teal-800">
        Loading pharmacy...
      </div>
    );
  }

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
