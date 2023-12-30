// components/Navbar.js
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineMenu,
  MdOutlineClose,
} from 'react-icons/md';
import LoadingScreen from '@/components/other/loading';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const Navbar = ({ links }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [isloading, setIsloading] = useState(true);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsloading(false);
    setOpenSubMenuIndex(null);
  }, [pathname, searchParams]);

  useEffect(() => {
    setIsloading(false);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenSubMenuIndex(null); // Ana menüyü açarken alt menüleri kapat
  };

  const handleSubMenuToggle = (index) => {
    // Alt menüyü açarken diğer alt menüleri kapat
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Ana menüyü açık tutmak için
  const handleMenuMouseEnter = () => {
    setIsMenuOpen(true);
  };

  // Ana menüyü kapalı tutmak için
  const handleMenuMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}

      <nav className='bg-gray-800 p-4 relative z-50'>
        <div className='w-full mx-auto'>
          <div
            className='flex flex-col md:flex-row md:justify-around justify-between items-center'
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          >
            <div className='w-full md:w-auto flex flex-row md:justify-around justify-between items-center'>
              <Link href='/'>
                <div className='text-white font-bold text-xl hover:scale-110 transition-all hover:cursor-pointer'>
                  Logo
                </div>
              </Link>
              <div className='md:hidden'>
                <button
                  onClick={() => {
                    handleMenuToggle;
                    setIsloading(true);
                  }}
                  className='text-white focus:outline-none px-3 py-2'
                >
                  {isMenuOpen ? (
                    <MdOutlineClose size={30} />
                  ) : (
                    <MdOutlineMenu size={30} />
                  )}
                </button>
              </div>
            </div>

            <div
              className={`${
                isMenuOpen ? 'block' : 'hidden md:block'
              } md:flex md:space-x-4 md:items-center`}
            >
              {links.map((link, index) => (
                <div key={index} className='relative'>
                  {link.submenu ? (
                    <>
                      <Link href={link.url}>
                        <button
                          onMouseEnter={() => handleSubMenuToggle(index)}
                          className='text-white hover:bg-gray-700 px-3 py-2 rounded-md md:inline-block'
                        >
                          {link.text}

                          <MdOutlineKeyboardArrowDown
                            className={`w-5 h-5 inline ml-1 transition-transform ${
                              openSubMenuIndex === index
                                ? 'transform rotate-180'
                                : ''
                            }`}
                          />
                        </button>
                      </Link>
                      {openSubMenuIndex === index && (
                        <div
                          className='absolute bg-gray-800 rounded-md shadow-md mt-2 py-2 w-40 z-40 md:left-0'
                          onMouseLeave={() => handleSubMenuToggle(index)}
                        >
                          {link.submenu.map((sublink, subIndex) => (
                            <Link
                              href={sublink.url}
                              key={subIndex}
                              onClick={() => {
                                setIsMenuOpen(!isMenuOpen);
                              }}
                            >
                              <div className='block text-white hover:bg-gray-700 px-3 py-2 rounded-md'>
                                {sublink.text}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : !link.button ? (
                    <Link href={link.url} key={index}>
                      <div className='text-white hover:bg-gray-700 px-3 py-2 rounded-md md:inline-block'>
                        {link.text}
                      </div>
                    </Link>
                  ) : (
                    <Link href={link.url} key={index}>
                      <button className='text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md md:inline-block'>
                        {link.text}
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
