'use client';

import { useEffect, useState } from 'react';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='cursor-pointer'
    >
      {theme === 'light' ? <Moon className='h-5 w-5' /> : <Sun className='h-5 w-5' />}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
