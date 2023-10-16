"use client"
import { useState } from 'react';
import { MdOutlineKeyboardArrowDown, MdDone } from "react-icons/md";

const categories = {
  furniture: 'Mobilya',
  electronics: 'Elektronik',
  clothing: 'Giyim',
  accessories: 'Aksesuar',
};

const DropDownCategories = ({ selectedCategory, setSelectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-4 w-full lg:w-1/2 lg:mt-4 mx-auto bg-blue-600 lg:rounded-md shadow-md">
      <label htmlFor="kategori" className="block text-md font-medium text-white">
        Kategori Seçin:
      </label>
      <div className="relative">
        <div
          onClick={handleSelectToggle}
          className="w-full mt-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 flex items-center justify-between"
        >
          <span>{selectedCategory ? selectedCategory.value : 'Kategori seçin...'}</span>
          {selectedCategory && !isOpen ? (
            <MdDone size={25} color='green' className="" />
          ) : (
            <MdOutlineKeyboardArrowDown
              size={20}
              className={`transition-all ${isOpen ? " rotate-0 scale-110" : "-rotate-90 "}`}
            />
          )}
        </div>
        {isOpen && (
          <div className="absolute w-full mt-2 py-2 bg-gray-100 border-blue-200 border-2 text-gray-800 rounded-md shadow-lg">
            {Object.entries(categories).map(([key, value]) => (
              <div
                key={key}
                onClick={() => {
                  setSelectedCategory({ key, value });
                  setIsOpen(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-blue-200"
              >
                {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDownCategories;


