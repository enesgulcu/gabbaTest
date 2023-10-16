import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gabba Home',
  description: 'Gabba Home Design',
}

export default function RootLayout({ children }) {

  const links = [
    { url: '/', text: 'Ana Sayfa' },
    {
      url: '/createProduct/createProduct',
      text: 'Ürün ve Koleksiyon',
      submenu: [
        { url: '/createProduct/measurements', text: 'Ölçü Oluştur' },
        { url: '/createProduct/fabrics', text: 'Kartela Oluştur' },
        { url: '/createProduct/metals', text: 'Metal Oluştur' },
        { url: '/createProduct/colors', text: 'Renk Oluştur' },
      ],
    },
    
    // {
    //   url: '/products',
    //   text: 'Products',
    //   submenu: [
    //     { url: '/products/category1', text: 'Category 4' },
    //     { url: '/products/category2', text: 'Category 5' },
    //     { url: '/products/category3', text: 'Category 6' },
    //   ],
    // },
    // {
    //   url: '/contact',
    //   text: 'Contact',
    //   button: true,
    // },
    // Diğer linkleri burada da tanımlayabilirsiniz
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar links={links}/>
        {children}
      </body>
    </html>
  )
}
