// app/rooms/page.tsx
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function RoomsPage() {
  // Optional: Check if user is authenticated
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Redirect to home page
  redirect('/');
}