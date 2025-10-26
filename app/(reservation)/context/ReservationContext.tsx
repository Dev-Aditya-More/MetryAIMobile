import React, { createContext, useContext, useState } from "react";

// ✅ Define the type for the booking data
type BookingData = {
  service: {
    id: string;
    title: string;
    duration: number;
    price: number;
  } | null;
  staff: {
    id: string;
    name: string;
    specialty: string;
  } | null;
  date: string | null;
  time: string | null;
  customerDetails: {
    name: string;
    email: string;
    phone: number;
  } | null;
};

// ✅ Define the context type (data + functions)
type BookingContextType = {
  booking: BookingData;
  updateService: (service: {
    id: string;
    title: string;
    duration: number;
    price: number;
  }) => void;
  updateStaff: (staff: { id: string; name: string; specialty: string }) => void;
  updateDateTime: (date: string, time: string) => void;
  updateCustomerDetails: (details: {
    name: string;
    email: string;
    phone: number;
  }) => void;
  resetBooking: () => void;
  resetAfterService: () => void;
  resetAfterStaff: () => void;
  resetAfterDateTime: () => void;
};

// ✅ Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// ✅ Provider component
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingData>({
    service: null,
    staff: null,
    date: null,
    time: null,
    customerDetails: null,
  });

  // ---- Update Functions ---- //
  const updateService = (service: {
    id: string;
    title: string;
    duration: number;
    price: number;
  }) => {
    setBooking({
      service,
      staff: null,
      date: null,
      time: null,
      customerDetails: null,
    });
  };

  const updateStaff = (staff: {
    id: string;
    name: string;
    specialty: string;
  }) => {
    setBooking((prev) => ({
      ...prev,
      staff,
      date: null,
      time: null,
      customerDetails: null,
    }));
  };

  const updateDateTime = (date: string, time: string) => {
    setBooking((prev) => ({
      ...prev,
      date,
      time,
      customerDetails: null,
    }));
  };

  const updateCustomerDetails = (details: {
    name: string;
    email: string;
    phone: number;
  }) => {
    setBooking((prev) => ({
      ...prev,
      customerDetails: details,
    }));
  };

  // ---- Reset Functions ---- //
  const resetBooking = () => {
    setBooking({
      service: null,
      staff: null,
      date: null,
      time: null,
      customerDetails: null,
    });
  };

  const resetAfterService = () => {
    setBooking((prev) => ({
      ...prev,
      staff: null,
      date: null,
      time: null,
      customerDetails: null,
    }));
  };

  const resetAfterStaff = () => {
    setBooking((prev) => ({
      ...prev,
      date: null,
      time: null,
      customerDetails: null,
    }));
  };

  const resetAfterDateTime = () => {
    setBooking((prev) => ({
      ...prev,
      customerDetails: null,
    }));
  };

  // ---- Return Provider ---- //
  return (
    <BookingContext.Provider
      value={{
        booking,
        updateService,
        updateStaff,
        updateDateTime,
        updateCustomerDetails,
        resetBooking,
        resetAfterService,
        resetAfterStaff,
        resetAfterDateTime,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// ✅ Custom Hook to access BookingContext
export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
