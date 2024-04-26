//client/src/components/navbar.jsx
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6 rounded-lg">
        <NavLink to="/">
          <img alt="Home Button" className="inline" style={{ height: '75px' }} src="/home.png"></img>
        </NavLink>

        <div className="flex-grow"></div>

        <NavLink
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium 
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 hover:bg-purple-100 h-9 rounded-md px-8 
          ring-2 ring-purple-500 ring-opacity-50 shadow-md"
          to="/report"
          style={{ marginRight: '10px' }} // Add margin to the right
        >
          Generate Report!
        </NavLink>
        <NavLink
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium 
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 hover:bg-purple-100 h-9 rounded-md px-8 
          ring-2 ring-purple-500 ring-opacity-50 shadow-md"
          to="/create"
        >
          Add Expense
        </NavLink>
      </nav>
    </div>
  );
}
