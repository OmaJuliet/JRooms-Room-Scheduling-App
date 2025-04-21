"use client"

import type React from "react"
import { jsPDF } from "jspdf";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Download } from "lucide-react"
import { BookingsEntry } from "../../bcms/types/ts";

interface BookingModalProps {
  roomId: string
  roomTemplateId: string
  roomTitle: string
  maxHours: number | undefined
  roomPrice: number | undefined
}

export function BookingModal({ 
  roomId, 
  roomTitle, 
  maxHours, 
  roomTemplateId,
  roomPrice 
}: BookingModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isBooked, setIsBooked] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    duration: 1,
  })

  // Check booking status and expiration
  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        const response = await fetch("/api/bookings");
        if (response.ok) {
          const bookings = await response.json();
          
          // Find all bookings for this room (not just the most recent)
          const roomBookings = bookings.filter(
            (booking: BookingsEntry) => booking.meta?.en?.rooms?._id === roomId
          );
  
          // Check if there's any active booking (not expired)
            const hasActiveBooking = roomBookings.some((booking: BookingsEntry) => {
            // createdAt is in milliseconds (Unix timestamp)
            const bookingTime: Date = new Date(booking.createdAt);
            const durationHours: number = booking.meta?.en?.duration || 1;
            const expiryTime: Date = new Date(bookingTime.getTime() + (durationHours * 60 * 60 * 1000));
            
            // Booking is still active if current time is before expiry
            return new Date() < expiryTime;
            });
  
          setIsBooked(hasActiveBooking);
  
          // Clean up localStorage if no active bookings exist
          if (!hasActiveBooking) {
            localStorage.removeItem(`booking-${roomId}`);
          }
        }
      } catch (error) {
        console.error("Error checking booking status:", error);
        setIsBooked(false);
      }
    };
  
    checkBookingStatus();
    
    // Add interval to re-check booking status periodically
    const interval = setInterval(checkBookingStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [roomId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value, 10) || 1 : value,
    }))
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, "-")
  }

  const handleDownloadReceipt = () => {
  const bookingData = JSON.parse(localStorage.getItem(`booking-${roomId}`) || '{}');
  if (!bookingData) return;

  // Create new PDF document
  const doc = new jsPDF();
  
  // Add logo or header (optional)
  // doc.addImage(logoData, 'PNG', 10, 10, 50, 25);
  
  // Set document properties
  doc.setProperties({
    title: `Booking Receipt - ${bookingData.paymentid}`,
    subject: 'Room Booking Confirmation',
    author: 'Your Company Name',
  });

  // Set styles
  const primaryColor = '#3b82f6'; // blue-500
  const textColor = '#333333';
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(primaryColor);
  doc.text('BOOKING RECEIPT', 105, 30, { align: 'center' });
  
  // Add divider line
  doc.setDrawColor(primaryColor);
  doc.line(20, 35, 190, 35);
  
  // Reset text color
  doc.setTextColor(textColor);
  
  // Add booking details
  doc.setFontSize(12);
  doc.text(`Booking ID: ${bookingData.paymentid}`, 20, 45);
  doc.text(`Date: ${new Date(bookingData.time).toLocaleString()}`, 20, 55);
  
  // Add room information
  doc.setFontSize(14);
  doc.text(`Room: ${roomTitle}`, 20, 70);
  doc.setFontSize(12);
  doc.text(`Duration: ${bookingData.duration} hour(s)`, 20, 80);
  
  // Add customer information
  doc.setFontSize(14);
  doc.text('Customer Details', 20, 95);
  doc.setFontSize(12);
  doc.text(`Name: ${bookingData.title}`, 20, 105);
  doc.text(`Email: ${bookingData.email}`, 20, 115);
  doc.text(`Phone: ${bookingData.phone}`, 20, 125);
  
  // Add payment summary
  doc.setFontSize(14);
  doc.text('Payment Summary', 20, 140);
  doc.setFontSize(12);
  doc.text(`Hourly Rate: $${roomPrice?.toFixed(2)}`, 20, 150);
  doc.text(`Duration: ${bookingData.duration} hours`, 20, 160);
  
  // Calculate and display total
  const total = roomPrice ? (roomPrice * bookingData.duration).toFixed(2) : '0.00';
  doc.setFontSize(16);
  doc.text(`Total Amount: $${total}`, 20, 175);
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor('#777777');
  doc.text('Thank you for your booking!', 105, 280, { align: 'center' });
  doc.text('For any inquiries, please contact support@jrooms.com', 105, 285, { align: 'center' });
  
  // Save the PDF
  doc.save(`booking-receipt-${bookingData.paymentid}.pdf`);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const paymentId = `user_${Math.random().toString(36).substring(2, 9)}`
    const slug = generateSlug(formData?.name)
    const bookingTime = new Date()

    const bookingData = {
      title: formData?.name,
      slug,
      paymentid: paymentId,
      email: formData.email,
      phone: formData.phone,
      time: bookingTime.toISOString(),
      duration: formData.duration,
      rooms: {
        entryId: roomId,
        templateId: roomTemplateId,
      },
    }

    try {
      const response = await fetch("/api/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit booking")
      }

      const result = await response.json()
      console.log("Booking created successfully:", result)
      
      // Store booking data for receipt
      localStorage.setItem(`booking-${roomId}`, JSON.stringify(bookingData))
      
      setIsBooked(true)
      toast.success("Booking created successfully!")
      setOpen(false)
    } catch (error) {
      toast.error("Failed to create booking")
      console.error("Error submitting booking:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isBooked ? (
            <Button className="w-full" disabled variant="secondary">
              This room is already booked
            </Button>
          ) : (
            <Button className="w-full">Book this room</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Room</DialogTitle>
            <DialogDescription>
              Enter your details to book &quot;{roomTitle}&quot;
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  max={maxHours}
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating Booking..." : "Proceed"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isBooked && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleDownloadReceipt}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
      )}
    </div>
  )
}