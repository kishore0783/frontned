import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Car,
  Settings,
  DollarSign,
  MessageSquare,
  PieChart,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ onToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    setOpenDropdown(null);
    onToggle?.(newState);
  };

  const handleNavigate = (path) => {
    setOpenDropdown(null);
    navigate(path);
  };

  const handleDropdown = (section) => {
    setOpenDropdown((prevSection) => (prevSection === section ? null : section));
  };

  const MenuItem = ({ icon: Icon, text, onClick, hasDropdown, isDropdownOpen, children }) => (
    <div className="w-full">
      <div
        onClick={onClick}
        className={`
          flex items-center px-4 py-3 cursor-pointer
          transition-colors duration-200
          hover:bg-slate-700 rounded-lg
          ${isDropdownOpen ? 'bg-slate-700' : ''}
        `}
      >
        <Icon className="w-5 h-5 text-slate-300" />
        <span className={`ml-4 text-slate-200 font-medium transition-opacity duration-200 
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {text}
        </span>
        {hasDropdown && (
          <ChevronRight 
            className={`ml-auto w-4 h-4 text-slate-400 transition-transform duration-200
              ${isDropdownOpen ? 'rotate-90' : ''}`}
          />
        )}
      </div>
      {children && isDropdownOpen && isSidebarOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );

  const DropdownItem = ({ text, onClick }) => (
    <div
      onClick={onClick}
      className="
        px-4 py-2 flex items-center
        text-sm text-slate-300
        hover:bg-slate-700 rounded-lg
        cursor-pointer transition-colors duration-200
        ml-5 pl-4
      "
    >
      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-3" />
      {text}
    </div>
  );

  return (
    <div 
      className={`
        fixed top-0 left-0 h-full
        bg-slate-800 shadow-xl
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64' : 'w-20'}
        flex flex-col
        z-50
      `}
    >
      <div className="flex items-center justify-between p-4">
        <h1 className={`
          text-slate-200 font-semibold
          transition-opacity duration-200
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}
        `}>
          Admin Dashboard
        </h1>
        <button
          onClick={handleToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-slate-300" />
          ) : (
            <Menu className="w-5 h-5 text-slate-300" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        <MenuItem
          icon={Home}
          text="Home"
          onClick={() => handleNavigate('/admin')}
        />

        <MenuItem
          icon={Car}
          text="Car Management"
          hasDropdown
          isDropdownOpen={openDropdown === 'car-management'}
          onClick={() => handleDropdown('car-management')}
        >
          <DropdownItem
            text="Add Car"
            onClick={() => handleNavigate('/admin/add-car')}
          />
          <DropdownItem
            text="Edit Car"
            onClick={() => handleNavigate('/admin/edit-car')}
          />
          <DropdownItem
            text="Remove Car"
            onClick={() => handleNavigate('/admin/remove-car')}
          />
          <DropdownItem
            text="View Customers"
            onClick={() => handleNavigate('/admin/view-customers')}
          />
        </MenuItem>

        <MenuItem
          icon={PieChart}
          text="Rental Management"
          hasDropdown
          isDropdownOpen={openDropdown === 'rental-management'}
          onClick={() => handleDropdown('rental-management')}
        >
          <DropdownItem
            text="Total Rentals"
            onClick={() => handleNavigate('/admin/total-rentals')}
          />
          <DropdownItem
            text="Available Cars"
            onClick={() => handleNavigate('/admin/available-cars')}
          />
        </MenuItem>

        <MenuItem
          icon={Settings}
          text="System Health"
          onClick={() => handleNavigate('/admin/system-health')}
        />

        <MenuItem
          icon={DollarSign}
          text="Recent Payments"
          onClick={() => handleNavigate('/admin/recent-payments')}
        />

        <MenuItem
          icon={MessageSquare}
          text="Customer Feedback"
          onClick={() => handleNavigate('/admin/customer-feedback')}
        />
      </div>
    </div>
  );
};

export default Sidebar;