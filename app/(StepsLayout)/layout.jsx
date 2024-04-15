'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import { useParams } from 'next/navigation';

const MainLayout = ({ children }) => {
  const { id } = useParams()

  const buttons = [
    {
      title: 'Siparişinizi Tamamlayın',
      buttons: [
        {
          id: '1.1',
          label: '1.1 Adım',
          path: `/stepbystep/${id}/1.1`
        },
        {
          id: '1.2',
          label: 'Fişi Gör Veya Gönder',
          path: `/stepbystep/${id}/1.2`
        },
        {
          id: '2',
          label: '2 Adım',
          path: `/stepbystep/${id}/2`
        },
        {
          id: '3',
          label: '3 Adım',
          path: `/stepbystep/${id}/3`
        },
      ],
    },
  ];


  return (
    <div className='flex h-screen w-full overflow-hidden bg-background pb-4'>
      <Sidebar buttons={buttons} />

      <div className='flex flex-1 w-full flex-col h-full px-4 overflow-hidden gap-2'>
        {/* <Navbar /> */}

        <div className='flex flex-1 h-full overflow-auto bg-background rounded-lg'>
          <div className='py-6 w-full pl-6 md:pl-0'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
