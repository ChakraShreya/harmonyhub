import React from 'react';
import { useCookies } from "react-cookie";

const LogoutComponent = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    // Clear the 'token' cookie
    removeCookie('token');

    // Perform any additional logout logic if needed
    // For example, you might want to redirect the user to the login page
    window.location.href = '/login';
  };

  return (
    <div>
      {/* Your component content here */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutComponent;