// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import moment from "moment";
// import { useSelector } from "react-redux";
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// const IdCardList = () => {
//   const [allEmployees, setAllEmployees] = useState([]);
//   const { employeeId, userType } = useSelector((state) => state.login.userData);
//   const [idCardList, setIdCardList] = useState([]);
//   const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
//   const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
//   const [totalRecord, setTotalRecord] = useState(0);
//   const [page, setPage] = useState(1);
//   const [error, setError] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const navigate = useNavigate();

//   const adminTableHeaders = [
//     "S/No",
//     "Report Date",
//     "Employee Name",
//     "Application",
//     "Location",
//     "Received Date",
//     "Reg No",
//     "No of Forms",
//     "Scanning",
//     "Typing",
//     "Photoshop",
//     "Coraldraw",
//     "Under Printing",
//     "To be Delivered",
//     "Delivered",
//   ];

//   const employeeTableHeaders = [
//     "S/No",
//     "Report Date",
//     "Application",
//     "Location",
//     "Received Date",
//     "Reg No",
//     "No of Forms",
//     "Scanning",
//     "Typing",
//     "Photoshop",
//     "Coraldraw",
//     "Under Printing",
//     "To be Delivered",
//     "Delivered",
//     "Edit",
//     "Delete",
//   ];

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchIdCardList = async () => {
//       setLoading(true);
//       try {
//         const payload = {
//           domain: "idCard",
//           page,
//           limit: 25,
//           fromDate,
//           toDate,
//         };

//         const apiEndpoint =
//           userType === "Admin"
//             ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
//             : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

//         const response = await axios.post(apiEndpoint, payload);
//         const { status, data, totalRecords } = response.data;

//         if (status === "Success") {
//           setTotalRecord(totalRecords);
//           setIdCardList(data);
//           setError(null);

//           if (userType === "Admin") {
//             if (data && Array.isArray(data)) {
//               const employeeNames = [
//                 ...new Set(
//                   data.flatMap((report) =>
//                     report.reports.map((employeeReport) => employeeReport.name)
//                   )
//                 ),
//               ];
//               setEmployees(["All", ...employeeNames]);
//               setAllEmployees(employeeNames);
//             }
//           }
//         } else {
//           setError("Failed to fetch data.");
//         }
//       } catch (error) {
//         console.error("Error occurred:", error);
//       }
//       setLoading(false);
//     };

//     if (fromDate && toDate && employeeId) {
//       fetchIdCardList();
//     }

//     fetchIdCardList();
//   }, [employeeId, fromDate, page, toDate, userType]);

//   const handleEmployeeChange = (e) => {
//     setSelectedEmployee(e.target.value);
//     setPage(1);
//   };

//   const handleDateChange = (e) => {
//     if (e.target.name === "fromDate") {
//       setFromDate(e.target.value);
//     } else {
//       setToDate(e.target.value);
//     }
//   };

//   const filteredIdCardList = selectedEmployee
//     ? idCardList.filter(
//         (item) => item.name === selectedEmployee || selectedEmployee === "All"
//       )
//     : idCardList;

//   const handleEdit = (id) => {
//     localStorage.setItem("selectedIdCardId", id);
//     navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/deleteIdReport/${id}`
//       );
//       if (response.data.status === "Success") {
//         alert("Record deleted successfully");
//         // Optionally, you could update the state or refresh the table
//       } else {
//         alert("Failed to delete record");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       alert("An error occurred while deleting the record");
//     }
//   };

//   const totalPages = Math.ceil(totalRecord / 20);

//   const groupedIdCardList = filteredIdCardList.reduce((acc, curr) => {
//     const reportDate = moment(curr.reportDate).format("DD-MM-YYYY");
//     const employeeName = curr.name;

//     const key = `${reportDate}|${employeeName}`;
//     if (!acc[key]) {
//       acc[key] = [];
//     }
//     acc[key].push(curr);
//     return acc;
//   }, {});

//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mx-auto">
//       <div date-rangepicker className="my-4 flex flex-col sm:flex-row items-center">
//         <div className="flex flex-col sm:flex-row">
//           <input
//             type="date"
//             name="fromDate"
//             value={fromDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           <input
//             type="date"
//             name="toDate"
//             value={toDate}
//             onChange={handleDateChange}
//             max={today}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
//           />
//           {userType === "Admin" && (
//            <div className="flex items-center">
//               <label htmlFor="employee" className="mr-2 text-sm text-gray-700">
//                 Select Employee:
//               </label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={handleEmployeeChange}
//                 className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
//                 >
//                 <option value="All">All</option>
//                 {Array.from(new Set(filteredIdCardList.map((employee) => employee.name))).map((name, index) => (
//                   <option key={index} value={name}>
//                     {name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {filteredIdCardList.length > 0 ? (
//         <div className="overflow-auto" style={{ maxHeight: "470px" }}>
//           <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//             <thead className="text-xs text-gray-700 uppercase bg-slate-200 sticky top-0">
//               <tr>
//                 {(userType === "employee" || "Employee"
//                   ? employeeTableHeaders
//                   : adminTableHeaders
//                 ).map((title, index) => (
//                   <th key={index} scope="col" className="px-4 py-2">
//                     {title}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             {Object.keys(groupedIdCardList).length > 0 ? (
//               <tbody>
//                 {Object.entries(groupedIdCardList).map(
//                   ([key, group], groupIndex) => {
//                     const [reportDate, employeeName] = key.split("|");

//                     return group.map((value, index) => (
//                       <tr
//                         className="odd:bg-white even:bg-gray-50 border text-gray-600 whitespace-nowrap"
//                         key={`${groupIndex}-${index}`}
//                       >
//                         {index === 0 && (
//                           <td rowSpan={group.length} className="border px-4 py-2">
//                             {groupIndex + 1}{" "}
//                           </td>
//                         )}
//                         {index === 0 && (
//                           <td rowSpan={group.length} className="px-4 py-3">
//                             {reportDate}
//                           </td>
//                         )}
//                         {(userType === "Admin" || userType === "idcardAdmin") &&
//                           index === 0 && (
//                             <td rowSpan={group.length} className="px-4 py-3">
//                               {employeeName}
//                             </td>
//                           )}
//                         <td className="px-4 py-3">{value.application}</td>
//                         <td className="px-4 py-3">{value.location}</td>
//                         <td className="px-4 py-3">{value.receivedDate}</td>
//                         <td className="px-4 py-3">{value.regNo}</td>
//                         <td className="px-4 py-3">{value.noOfForms}</td>
//                         <td className="px-4 py-3">{value.scanning}</td>
//                         <td className="px-4 py-3">{value.typing}</td>
//                         <td className="px-4 py-3">{value.photoshop}</td>
//                         <td className="px-4 py-3">{value.coraldraw}</td>
//                         <td className="px-4 py-3">{value.underPrinting}</td>
//                         <td className="px-4 py-3">{value.toBeDelivered}</td>
//                         <td className="px-4 py-3">{value.delivered}</td>
//                         {userType !== "Admin" && (
//                           <td className="px-4 py-3">
//                             <button
//                               onClick={() => handleEdit(value.id)}
//                             >
//                               <FontAwesomeIcon icon={faEdit} />
//                             </button>
//                           </td>
//                         )}
//                         {userType !== "Admin" && (
//                           <td className="px-4 py-3">
//                             <button

//                               onClick={() => handleDelete(value.id)}
//                             >
//                               <FontAwesomeIcon icon={faTrash} />
//                             </button>
//                           </td>
//                         )}
//                       </tr>
//                     ));
//                   }
//                 )}
//               </tbody>
//             ) : (
//               <tbody>
//                 <tr>
//                   <td colSpan={userType === "Admin" ? 16 : 15} className="text-center">
//                     No data available
//                   </td>
//                 </tr>
//               </tbody>
//             )}
//           </table>
//         </div>
//       ) : (
//         <div className="text-center text-gray-500">Loading...</div>
//       )}
//     </div>
//   );
// };

// export default IdCardList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const IdCardList = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const { employeeId, userType } = useSelector((state) => state.login.userData);
  const [idCardList, setIdCardList] = useState([]);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [totalRecord, setTotalRecord] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);

  const adminTableHeaders = [
    "S/No",
    "Report Date",
    "Employee Name", // Added Employee Name
    "Application",
    "Location",
    "Received Date",
    "Reg No",
    "No of Forms",
    "Scanning",
    "Typing",
    "Photoshop",
    "Coreldraw",
    "Under Printing",
    "To be Delivered",
    "Delivered",
  ];

  const employeeTableHeaders = [
    "S/No",
    "Report Date",

    "Application",
    "Location",
    "Received Date",
    "Reg No",
    "No of Forms",
    "Scanning",
    "Typing",
    "Photoshop",
    "Coreldraw",
    "Under Printing",
    "To be Delivered",
    "Delivered",
    "Edit",
    "Delete",
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdCardList = async () => {
      setLoading(true);
      try {
        const payload = {
          domain: "idCard",
          page,
          limit: 25,
          fromDate,
          toDate,
        };

        const apiEndpoint =
          userType === "Admin"
            ? `${process.env.REACT_APP_API_URL}/reportHistory_admin`
            : `${process.env.REACT_APP_API_URL}/reportHistory/${employeeId}`;

        const response = await axios.post(apiEndpoint, payload);
        const { status, data, totalRecords } = response.data;

        if (status === "Success") {
          setTotalRecord(totalRecords);
          setIdCardList(data);
          setError(null);

          if (userType === "Admin") {
            if (data && Array.isArray(data)) {
              const employeeNames = [
                ...new Set(
                  data.flatMap((report) =>
                    report.reports.map((employeeReport) => employeeReport.name)
                  )
                ),
              ];
              setEmployees(["All", ...employeeNames]);
              setAllEmployees(employeeNames);
            }
          }
        } else {
          setError("Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
      setLoading(false);
    };

    const fetchEmployeeList = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/employee_list/`
        );
        if (response.data.status === "Success") {
          setEmployeeList(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching employee list:", err);
      }
    };

    if (fromDate && toDate && employeeId) {
      fetchIdCardList();
    }

    fetchIdCardList();
    fetchEmployeeList();
  }, [employeeId, fromDate, page, toDate, userType]);

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setPage(1);
  };

  const handleDateChange = (e) => {
    if (e.target.name === "fromDate") {
      setFromDate(e.target.value);
    } else {
      setToDate(e.target.value);
    }
  };

  const filteredIdCardList = selectedEmployee
    ? idCardList.filter(
        (item) => item.name === selectedEmployee || selectedEmployee === "All"
      )
    : idCardList;

  const handleEdit = (id) => {
    localStorage.setItem("selectedIdCardId", id);
    navigate(`/dashboard/idCardReportEdit`, { state: { recordId: id } });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/deleteIdReport/${id}`
      );
      if (response.data.status === "Success") {
        alert("Record deleted successfully");
        // Optionally, you could update the state or refresh the table
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("An error occurred while deleting the record");
    }
  };

  const totalPages = Math.ceil(totalRecord / 20);

  const groupedIdCardList = filteredIdCardList.reduce((acc, curr) => {
    const reportDate = moment(curr.reportDate).format("DD-MM-YYYY");
    const employeeName = curr.name;

    const key = `${reportDate}|${employeeName}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <h5>ID Card Report</h5>

      <div className="container mx-auto">
        <div
          date-rangepicker
          className="my-4 flex flex-col sm:flex-row items-center"
        >
          <div className="flex flex-col sm:flex-row">
            <input
              type="date"
              name="fromDate"
              value={fromDate}
              onChange={handleDateChange}
              max={today}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
            />
            <input
              type="date"
              name="toDate"
              value={toDate}
              onChange={handleDateChange}
              max={today}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto p-2.5 mr-2 mb-2 sm:mb-0"
            />
            {userType === "Admin" && (
              <div className="flex items-center">
                <label
                  style={{ marginRight: 10, fontSize: 14, color: "#6b7280" }}
                  htmlFor="employee"
                >
                  Employee Name:
                </label>
                <select
                  id="employee"
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                >
                  <option value="">All</option>
                  {employeeList.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.employeeName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {idCardList.length > 0 ? (
          <div className="overflow-auto" style={{ maxHeight: "470px" }}>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-slate-200 sticky top-0">
                <tr>
                  {(userType === "employee" || userType === "Employee"
                    ? employeeTableHeaders
                    : adminTableHeaders
                  ).map((title, index) => (
                    <th key={index} scope="col" className="px-4 py-2">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {idCardList.length > 0 ? (
                  idCardList.map((data, index) => {
                    const reportDate = moment(data.reportDate).format(
                      "DD-MM-YYYY"
                    );
                    const employeeName = data.employeeName || employeeId;

                    return data.reports.map((value, subIndex) => (
                      <tr
                        className="odd:bg-white even:bg-gray-50 border text-gray-600 whitespace-nowrap"
                        key={`${index}-${subIndex}`}
                      >
                        {subIndex === 0 && (
                          <>
                            <td
                              rowSpan={data.reports.length}
                              className="border px-4 py-2"
                            >
                              {index + 1}
                            </td>
                            <td
                              rowSpan={data.reports.length}
                              className="px-4 py-3"
                            >
                              {reportDate}
                            </td>
                            {userType === "Admin" && (
                              <td
                                rowSpan={data.reports.length}
                                className="px-4 py-3"
                              >
                                {employeeName}
                              </td>
                            )}
                          </>
                        )}

                        <td className="px-4 py-3">{value.application}</td>
                        <td className="px-4 py-3">{value.location}</td>
                        <td className="px-4 py-3">{value.receivedDate}</td>
                        <td className="px-4 py-3">{value.regNo}</td>
                        <td className="px-4 py-3">{value.noOfForms}</td>
                        <td className="px-4 py-3">{value.scanning}</td>
                        <td className="px-4 py-3">{value.typing}</td>
                        <td className="px-4 py-3">{value.photoshop}</td>
                        <td className="px-4 py-3">{value.coraldraw}</td>
                        <td className="px-4 py-3">{value.underPrinting}</td>
                        <td className="px-4 py-3">{value.toBeDelivered}</td>
                        <td className="px-4 py-3">{value.delivered}</td>

                        {userType !== "Admin" && (
                            <td className="px-4 py-3">
                              <button onClick={() => handleEdit(value.id)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </td>
                          )}
                          {userType !== "Admin" && (
                            <td className="px-4 py-3">
                              <button
                                // style={{ backgroundColor: "red", color: "white", padding: 5 }}
                                onClick={() => handleDelete(value.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          )}
                      </tr>
                    ));
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={userType === "Admin" ? 17 : 16}
                      className="text-center py-4"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* {Object.keys(groupedIdCardList).length > 0 ? (
                <tbody>
                  {Object.entries(groupedIdCardList).map(
                    ([key, group], groupIndex) => {
                      const [reportDate, employeeName] = key.split("|");

                      return group.map((value, index) => (
                        <tr
                          className="odd:bg-white even:bg-gray-50 border text-gray-600 whitespace-nowrap"
                          key={`${groupIndex}-${index}`}
                        >
                          {index === 0 && (
                            <>
                              <td
                                rowSpan={group.length}
                                className="border px-4 py-2"
                              >
                                {groupIndex + 1}{" "}
                              </td>
                              <td rowSpan={group.length} className="px-4 py-3">
                                {reportDate}
                              </td>
                              {userType === "Admin" && (
                                <td
                                  rowSpan={group.length}
                                  className="px-4 py-3"
                                >
                                  {employeeName}
                                </td>
                              )}
                            </>
                          )}

                          <td className="px-4 py-3">{value.application}</td>
                          <td className="px-4 py-3">{value.location}</td>
                          <td className="px-4 py-3">{value.receivedDate}</td>
                          <td className="px-4 py-3">{value.regNo}</td>
                          <td className="px-4 py-3">{value.noOfForms}</td>
                          <td className="px-4 py-3">{value.scanning}</td>
                          <td className="px-4 py-3">{value.typing}</td>
                          <td className="px-4 py-3">{value.photoshop}</td>
                          <td className="px-4 py-3">{value.coreldraw}</td>
                          <td className="px-4 py-3">{value.underPrinting}</td>
                          <td className="px-4 py-3">{value.toBeDelivered}</td>
                          <td className="px-4 py-3">{value.delivered}</td>
                          {userType !== "Admin" && (
                            <td className="px-4 py-3">
                              <button onClick={() => handleEdit(value.id)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </td>
                          )}
                          {userType !== "Admin" && (
                            <td className="px-4 py-3">
                              <button
                                // style={{ backgroundColor: "red", color: "white", padding: 5 }}
                                onClick={() => handleDelete(value.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ));
                    }
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td
                      colSpan={userType === "Admin" ? 17 : 16}
                      className="text-center"
                    >
                      No data available
                    </td>
                  </tr>
                </tbody>
              )} */}
            {/* </table> */}
          </div>
        ) : (
          <div className="text-center text-gray-500">No data available</div>
        )}
      </div>
    </>
  );
};

export default IdCardList;
