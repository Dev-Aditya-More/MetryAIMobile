import React, { createContext, ReactNode, useContext, useState } from "react";

type Service = {
  id: string;
  title: string;
  price: number;
};

type CustomerDetails = {
  name: string;
  email: string;
  phone: number;
};

type BookingData = {
  services: Service[]; // ✅ multiple services
  customerDetails: CustomerDetails | null;
};

type BookingContextType = {
  booking: BookingData;
  setServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  removeService: (id: string) => void;
  setCustomer: (customer: CustomerDetails) => void;
  updateServices: (updatedServices: Service[]) => void;
  resetBooking: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [booking, setBooking] = useState<BookingData>({
    services: [],
    customerDetails: null,
  });

  // ✅ Replace all services
  const setServices = (services: Service[]) => {
    setBooking((prev) => ({ ...prev, services }));
  };

  // ✅ Add a single service
  const addService = (service: Service) => {
    setBooking((prev) => ({
      ...prev,
      services: [...prev.services, service],
    }));
  };

  // ✅ Remove service by ID
  const removeService = (id: string) => {
    setBooking((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  // ✅ Update services array (like replacing after editing)
  const updateServices = (updatedServices: Service[]) => {
    setBooking((prev) => ({ ...prev, services: updatedServices }));
  };

  // ✅ Set or update customer details
  const setCustomer = (customer: CustomerDetails) => {
    setBooking((prev) => ({ ...prev, customerDetails: customer }));
  };

  // ✅ Reset everything
  const resetBooking = () => {
    setBooking({ services: [], customerDetails: null });
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setServices,
        addService,
        removeService,
        setCustomer,
        updateServices,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
