import { redirect } from 'next/navigation';

export default function HomePage() {
  // Simple redirect to cameras page - keeps homepage static
  redirect('/cameras');
}