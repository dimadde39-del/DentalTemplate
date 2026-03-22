"use client";

import { createContext, useContext, useState } from "react";

interface BookingContextType {
  isOpen: boolean;
  selectedService: string | null;
  openBooking: (serviceName?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const openBooking = (serviceName?: string) => {
    setSelectedService(serviceName?.trim() ? serviceName.trim() : null);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
    setSelectedService(null);
  };

  return (
    <BookingContext.Provider
      value={{ isOpen, selectedService, openBooking, closeBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
