import * as React from 'react';

import { AppNavbar } from '@/components/app-navbar';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface ICamerasListLayoutProps {
  children: React.ReactNode;
}

const CamerasListLayout: React.FunctionComponent<ICamerasListLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full'>
        <AppSidebar />
        <div className='flex flex-1 flex-col border'>
          <AppNavbar />
          <main className='bg-muted flex-1 p-4'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CamerasListLayout;
