// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Menu, MenuItem } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import "./EmployeeList.css";

// const EmployeeStatus = () => {
//   const [deactivatedEmployees, setDeactivatedEmployees] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(1);
//   const [maxDisplayCount, setMaxDisplayCount] = useState(10);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   useEffect(() => {
//     const fetchDeactivatedEmployees = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/deactiveEmployees/`,
//           {
//             params: { domain: "", page, limit: maxDisplayCount },
//           }
//         );

//         const { data, totalRecords } = response.data;

//         if (Array.isArray(data)) {
//           setDeactivatedEmployees(data);
//           setTotalRecords(totalRecords || 0);
//         } else {
//           setDeactivatedEmployees([]);
//           setTotalRecords(0);
//         }
//       } catch (error) {
//         console.error("Error fetching deactivated employees:", error);
//         setError("Failed to fetch data.");
//         setDeactivatedEmployees([]);
//         setTotalRecords(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeactivatedEmployees();
//   }, [page, maxDisplayCount]);

//   const handleMenuOpen = (event, employee) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedEmployee(employee);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedEmployee(null);
//   };

//   const handleView = () => {
//     if (selectedEmployee) {
//       navigate("/dashboard/addEmployee", { state: { employee: selectedEmployee, readOnly: true } });
//     }
//     handleMenuClose();
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4"> Old Employee List</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : deactivatedEmployees.length > 0 ? (
//         <div className="grid grid-cols-3 gap-4">
//           {deactivatedEmployees.map((employee) => (
//             <div key={employee.id} className="p-4 border rounded-lg shadow-md relative employee-card">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={
//                     employee.profileUrl?.startsWith("http")
//                       ? employee.profileUrl
//                       : `${process.env.REACT_APP_API_URL}/uploads/Images/${employee.profileUrl}`
//                   }
//                   className="w-16 h-16 rounded-lg employee-image"
//                   alt="Profile"
//                 />
//                 <div className="ml-2">
//                   <h3 className="text-lg font-bold">{employee.name}</h3>
//                   <p className="text-purple-600">{employee.designation}</p>
//                   <p>Phone: {employee.mobileNumber}</p>
//                   <p>Email: {employee.email}</p>
//                 </div>
//               </div>

//               {/* Three-dot menu */}
//               <div className="absolute top-2 right-2">
//                 <MoreVertIcon
//                   className="cursor-pointer"
//                   onClick={(event) => handleMenuOpen(event, employee)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No deactivated employees found.</p>
//       )}

      
//       <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
//         <MenuItem onClick={handleView}>View</MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default EmployeeStatus;


import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./EmployeeList.css";

const EmployeeStatus = () => {
  const [deactivatedEmployees, setDeactivatedEmployees] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [maxDisplayCount, setMaxDisplayCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  useEffect(() => {
    const fetchDeactivatedEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/deactiveEmployees/`,
          {
            params: { domain: "", page, limit: maxDisplayCount },
          }
        );

        const { data, totalRecords } = response.data;

        if (Array.isArray(data)) {
          setDeactivatedEmployees(data);
          setTotalRecords(totalRecords || 0);
        } else {
          setDeactivatedEmployees([]);
          setTotalRecords(0);
        }
      } catch (error) {
        console.error("Error fetching deactivated employees:", error);
        setError("Failed to fetch data.");
        setDeactivatedEmployees([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDeactivatedEmployees();
  }, [page, maxDisplayCount]);

  const handleMenuOpen = (event, employee) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedEmployee(null);
  };

  const handleView = () => {
    if (selectedEmployee) {
      navigate("/dashboard/addEmployee", { state: { employee: selectedEmployee, readOnly: true } });
    }
    handleMenuClose();
  };

  return (
    <div className="p-6 relative">
      {/* Top-right button */}
      <button
        onClick={() => navigate("/dashboard/employee-list")}
        className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        View Employee List
      </button>

      <h2 className="text-2xl font-bold mb-4">Old Employee List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : deactivatedEmployees.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {deactivatedEmployees.map((employee) => (
            <div key={employee.id} className="p-4 border rounded-lg shadow-md relative employee-card">
              <div className="flex items-center gap-4">
                <img
                  src={
                    employee.profileUrl?.startsWith("http")
                      ? employee.profileUrl
                      : `${process.env.REACT_APP_API_URL}/uploads/Images/${employee.profileUrl}`
                  }
                  className="w-16 h-16 rounded-lg employee-image"
                  alt="Profile"
                />
                <div className="ml-2">
                  <h3 className="text-lg font-bold">{employee.name}</h3>
                  <p className="text-purple-600">{employee.designation}</p>
                  <p>Phone: {employee.mobileNumber}</p>
                  <p>Email: {employee.email}</p>
                </div>
              </div>

              {/* Three-dot menu */}
              <div className="absolute top-2 right-2">
                <MoreVertIcon
                  className="cursor-pointer"
                  onClick={(event) => handleMenuOpen(event, employee)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No deactivated employees found.</p>
      )}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleView}>View</MenuItem>
      </Menu>
    </div>
  );
};

export default EmployeeStatus;
