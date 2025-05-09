// import React, { useEffect, useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
// import "../styles/dashboard.css";
// import logo from "../img/logo/logo_bg_r.png";
// import { logOut } from "../Redux/slice/loginSlice";
// import ChangePassword from "./ChangePassword";
// import AddEmployee from "./AddEmployees";
// import LeveStatus from "./LeveStatus";
// import ApplayLeave from "./ApplayLeave";
// import LeaveAcces from "./LeaveAcces";

// const EmployeeReport = React.lazy(() => import(/* webpackPrefetch: true */ "./EmployeeReport"));
// const EmployeeTask = React.lazy(() => import(/* webpackPrefetch: true */ "./Tasks/Employeetask"));
// const EmployeeTaskEdit = React.lazy(() => import(/* webpackPrefetch: true */ "./Tasks/EmployeetaskEdit"));
// const IdCardReport = React.lazy(() => import(/* webpackPrefetch: true */ "./IdCardReport"));
// const IdCardReportEdit = React.lazy(() => import(/* webpackPrefetch: true */ "./IdCardReportEdit"));
// const ReportHistory = React.lazy(() => import(/* webpackPrefetch: true */ "./ReportHistory"));
// const ReportHistoryTl = React.lazy(() => import(/* webpackPrefetch: true */ "./ReportHistoryTl"));
// const EmployeeList = React.lazy(() => import(/* webpackPrefetch: true */ "./EmployeeList"));
// const TeamReport = React.lazy(() => import(/* webpackPrefetch: true */ "./TeamReport"));
// const PunchReport = React.lazy(() => import(/* webpackPrefetch: true */ "./PunchReport"));

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { isAuth, userData } = useSelector((state) => state.login);
//   const [isToggled, setIsToggled] = useState(false);
//   const sidebarRef = useRef(null);
//   const location = useLocation();
//   const isAdmin = userData.userType === "Admin";
//   const TL = userData.designation === "Sr Technicals Lead"
//   const Tl = userData.designation === "Sr. Technical Head"

//   const [expanded, setExpanded] = React.useState(true);
//   const [activeKey, setActiveKey] = React.useState('1');
//   const [clickEvent, setclickEvent] = useState("")
//   const [windowSize, setWindowSize] = useState({
//       width: window.innerWidth,
//       height: window.innerHeight,
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       setIsToggled(window.innerWidth < 640);
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const handleResize = () => {
//     console.log('Resize triggered');
//     setWindowSize({
//       width: window.innerWidth,
//       height: window.innerHeight,
//     });

//     if (window.innerWidth < 500) {
//       setIsToggled(false); // Close the sidebar for mobile
//       console.log('Sidebar toggled off due to small screen');
//     } else {
//       setIsToggled(true); // Open the sidebar for larger screens
//       console.log('Sidebar toggled on due to large screen');
//     }
//   };

//   useEffect(() => {
//     if (!isAuth) {
//       navigate("/");
//     }
//   }, [isAuth, navigate]);

//   const logOuts = () => {
//     dispatch(logOut());
//     navigate("/");
//   };

//   const handleToggle = () => {
//     setIsToggled(!isToggled);
//   };
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (window.innerWidth < 640 && sidebarRef.current && !sidebarRef.current.contains(event.target) && !isToggled) {
//         setIsToggled(true);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isToggled]);

//   return (
//     <>
//       <button onClick={() => handleToggle()} className="sidebar-toggle" type="button">
//         {/* <span className="sr-only">Open sidebar</span> */}
//         <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//           <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
//         </svg>
//       </button>

//       <aside ref={sidebarRef} id="sidebar-multi-level-sidebar" className={isToggled ? "sidebar active" : "sidebar"} aria-label="Sidebar">
//         <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50" style={{backgroundColor:"#f5f5f5"}}>
//           <ul className="space-y-2 font-medium">
//             <li>
//               <Link to="/dashboard" className="flex justify-center items-center p-2 text-gray-900 rounded-lg bg-gray-100 group">
//                 <span className="ms-3 mr-4">
//                   <img alt="logo" className="h-14 w-auto" src={logo}></img>
//                 </span>
//               </Link>
//             </li>
//             { TL ? (
//               <>
//               <li>
//                 <Link to="/dashboard" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard" && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap "  >Employee Report</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/employeeTask"
//                   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/employeeTask" ? "bg-gray-100" : ""}`}
//                 >
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/employeeTask" ? "text-orange-500" : ""}`}                     xmlns="http://www.w3.org/2000/svg"fill="none"viewBox="0 0 24 24"stroke="currentColor">
//                     <path strokeLinecap="round"strokeLinejoin="round"strokeWidth={2}d="M9 12h6m-3-3v6m-3-6h6M5 3a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 whitespace-nowrap"> Daily Task</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/id-card-report" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/id-card-report" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/id-card-report" && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">ID Card Report</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/report-history" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname.startsWith("/dashboard/report-history") && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname.startsWith("/dashboard/report-history") && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Report History</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/dashboard/teamReport"
//                   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
//                     location.pathname.startsWith("/dashboard/teamReport") && "bg-gray-100"
//                   }`}
//                 >
//                   <svg
//                     className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
//                       location.pathname.startsWith("/dashboard/teamReport") && "text-orange-500"
//                     }`}
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4 6h4v12H4zm6 6h4v6h-4zm6-12h4v18h-4z"
//                     />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
//                     Team Report
//                   </span>
//                 </Link>
//               </li>

//               <li>
//                 <Link to="/dashboard/applayLeave" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/applayLeave" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/applayLeave" && "text-orange-500"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12V8m4 4V8m1-4H9a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1z" /> {/* Key icon */}
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Apply Leave </span>
//                 </Link>
//               </li>

//               <li>
//                 <Link to="/dashboard/leveStatus" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/leveStatus" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/leveStatus" && "text-orange-500"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8h12M6 12h8m-8 4h8m-9 5h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" /> {/* Clipboard/Checklist icon */}
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Leave Status</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/changePassword" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/changePassword" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/changePassword" && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V4a4 4 0 1 1 8 0v3m-8 0a4 4 0 0 0-4 4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-7a4 4 0 0 0-4-4H8z" />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Change Password</span>
//                 </Link>
//               </li>
//             </>
//               ) : isAdmin ? (
//                   <>
//                     <li>
//                       <Link to="/dashboard/employee-list" onClick={() => {
//       console.log("Link clicked");
//       handleResize(); // Trigger resize logic
//     }} className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/employee-list" && "bg-gray-100"}`}>
// <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/employee-list" && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
// </svg>
//                         <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Employee List</span>
//                       </Link>
//                     </li>

//                     <li>
//                     <Link to="/dashboard/report-history" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/report-history" && "bg-gray-100"}`}>
//                       <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname.startsWith("/dashboard/report-history") && "text-orange-500"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2ZM7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8ZM12 14v-2m0 0v-2m0 4l2 2m-2-2-2 2" />
//                       </svg>
//                       <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Report History</span>
//                     </Link>

//                     </li>
//                     <li>
//                       <Link to="/dashboard/PunchReport" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/PunchReport" && "bg-gray-100"}`}>
//                         <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname.startsWith("/dashboard/PunchReport") && "text-orange-500"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
//                         </svg>
//                         <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Punch Report</span>
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="/dashboard/leaveAcces" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/leaveAcces" && "bg-gray-100"}`}>
//                       <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h6M19 3H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
//                       </svg>

//                         <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Leave Approve</span>
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to="/dashboard/changePassword" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/changePassword" && "bg-gray-100"}`}>
//                         <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/changePassword" && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V4a4 4 0 1 1 8 0v3m-8 0a4 4 0 0 0-4 4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-7a4 4 0 0 0-4-4H8z" />
//                         </svg>
//                         <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Change Password</span>
//                       </Link>
//                     </li>
//                   </>
//               ) : (
//             <>
//               <li>
//                 <Link to="/dashboard" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard" && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Employee Report</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/dashboard/employeeTask"
//                   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/employeeTask" ? "bg-gray-100" : ""}`}
//                 >
//                   <svg
//                     className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/employeeTask" ? "text-orange-500" : ""}`}
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-3-3v6m-3-6h6M5 3a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z"
//                     />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 whitespace-nowrap"> Daily Task</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/id-card-report" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/id-card-report" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/id-card-report" && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">ID Card Report</span>
//                 </Link>
//               </li>
//               <li>
//               <Link
//                 to="/dashboard/report-history"
//                 className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
//                   location.pathname === "/dashboard/report-history" && "bg-gray-100"
//                 }`}
//               >
//                 <svg
//                   className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
//                     location.pathname === "/dashboard/report-history" && "text-orange-500"
//                   }`}
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="2"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2ZM7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8ZM12 14v-2m0 0v-2m0 4l2 2m-2-2-2 2"
//                   />
//                 </svg>
//                 <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
//                   Report History
//                 </span>
//               </Link>
//             </li>
//             {Tl && (
//               <li>
//                 <Link
//                   to="/dashboard/report-historyTl"
//                   className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
//                     location.pathname === "/dashboard/report-historyTl" && "bg-gray-100"
//                   }`}
//                 >
//                   <svg
//                     className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
//                       location.pathname === "/dashboard/report-historyTl" && "text-orange-500"
//                     }`}
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4 6h4v12H4zm6 6h4v6h-4zm6-12h4v18h-4z"
//                     />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
//                     Team Report
//                   </span>
//                 </Link>
//               </li>
//             )}

//               <li>
//                 <Link to="/dashboard/applayLeave" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/applayLeave" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/applayLeave" && "text-orange-500"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12V8m4 4V8m1-4H9a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1z" /> {/* Key icon */}
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Apply Leave </span>
//                 </Link>
//               </li>

//               <li>
//                 <Link to="/dashboard/leveStatus" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/dashboard/leveStatus" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/dashboard/leveStatus" && "text-orange-500"}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8h12M6 12h8m-8 4h8m-9 5h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" /> {/* Clipboard/Checklist icon */}
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Leave Status</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/changePassword" className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${location.pathname === "/changePassword" && "bg-gray-100"}`}>
//                   <svg className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${location.pathname === "/changePassword " && "text-orange-500"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V4a4 4 0 1 1 8 0v3m-8 0a4 4 0 0 0-4 4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-7a4 4 0 0 0-4-4H8z" />
//                   </svg>
//                   <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">Change Password</span>
//                 </Link>
//               </li>

//             </>
//             )}
//             <li>
//               <div onClick={(e) => logOuts()} className="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
//                 <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
//                 </svg>
//                 <span className="flex-1 text-left ml-3 ms-3 select-none whitespace-nowrap">Logout</span>
//               </div>
//             </li>
//           </ul>
//           <div class="flex items-center absolute bottom-0 mb-3 pl-4 pr-14 py-2 border-t border-indigo-150 rounded-md">
//             <div class="flex-shrink-0">
//               <img alt="profile pic" class="w-10 h-10 rounded-full" src={userData.profileUrl} />
//             </div>
//             <div class="flex-1 min-w-0 ms-4">
//               <p class="text-sm font-medium text-gray-900 truncate dark:text-white">{userData.employeeName}</p>
//               <p class="text-sm text-gray-500 truncate dark:text-gray-400">{userData.designation}</p>
//             </div>
//             <div></div>
//           </div>
//         </div>
//       </aside>

//       <div className="p-4 sm:ml-64">
//         <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
//           <Routes>
//             <Route path="/" element={<EmployeeReport />} />
//             <Route path="/employeeTask" element={<EmployeeTask />} />
//             <Route path="/employeeTaskEdit" element={<EmployeeTaskEdit />} />
//             <Route path="/id-card-report" element={<IdCardReport />} />
//             <Route path="/idCardReportEdit" element={<IdCardReportEdit />} />
//             <Route path="/report-history/*" element={<ReportHistory />} />
//             <Route path="/report-historyTl/*" element={<ReportHistoryTl />} />
//             <Route path="/employee-list" element={<EmployeeList />} />
//             <Route path="/addEmployee" element={<AddEmployee/>} />
//             <Route path="/changePassword" element={<ChangePassword />} />

//             <Route path="/teamReport/*" element={<TeamReport />} />
//             <Route path="/applayLeave" element={<ApplayLeave />} />
//             <Route path="/leveStatus" element={<LeveStatus />} />
//             <Route path="/leaveAcces" element={<LeaveAcces />} />
//             <Route path="/punchReport" element={<PunchReport />} />
//           </Routes>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../img/logo/logo_bg_r.png";
import { logOut } from "../Redux/slice/loginSlice";
import ChangePassword from "./ChangePassword";
import AddEmployee from "./AddEmployees";
import LeveStatus from "./LeveStatus";
import ApplayLeave from "./ApplayLeave";
import LeaveAcces from "./LeaveAcces";
import EmployeeMaster from "./EmployeeMaster";
import EmployeeMasters from "./EmployeeMasters";
import AttendanceReport from "./AttendanceReport";
import EmployeeStatus from "./EmployeeStatus";
//import ProjectMasters from "./ProjectMasters";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";
import { closeModel, setHasModalShownToday } from "../Redux/slice/commonSlice";
import ProjectAssignForm from "./ProjectAssignForm";
import ProjectAssignList from "./ProjectAssignList";

const EmployeeReport = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./EmployeeReport")
);
const EmployeeTask = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./Tasks/Employeetask")
);
const EmployeeTaskEdit = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./Tasks/EmployeetaskEdit")
);
const IdCardReport = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./IdCardReport")
);
const IdCardReportEdit = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./IdCardReportEdit")
);
const ReportHistory = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./ReportHistory")
);
const ReportHistoryTl = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./ReportHistoryTl")
);
const EmployeeList = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./EmployeeList")
);
const TeamReport = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./TeamReport")
);
const PunchReport = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./PunchReport")
);

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, userData } = useSelector((state) => state.login);
  const [isAdmin, setIsAdmin] = useState();
  const [TL, setTL] = useState();
  const [Tl, setTl] = useState();
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
    setIsAdmin(userData?.userType === "Admin");
    setTL(userData?.designation === "Sr Technicals Lead");
    setTl(userData?.designation === "Sr. Technical Head");
  }, [isAuth, navigate]);
  const [isToggled, setIsToggled] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  // Add state for dropdown
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState("1");
  const [clickEvent, setclickEvent] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsToggled(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    console.log("Resize triggered");
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    if (window.innerWidth < 500) {
      setIsToggled(false); // Close the sidebar for mobile
      console.log("Sidebar toggled off due to small screen");
    } else {
      setIsToggled(true); // Open the sidebar for larger screens
      console.log("Sidebar toggled on due to large screen");
    }
  };

  const logOuts = () => {
    dispatch(logOut());
    dispatch(setHasModalShownToday(false));
    // dispatch(closeModel());
    navigate("/");
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth < 640 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !isToggled
      ) {
        setIsToggled(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggled]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown open state
  };

  return (
    <>
      <button
        onClick={() => handleToggle()}
        className="sidebar-toggle"
        type="button"
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        ref={sidebarRef}
        id="sidebar-multi-level-sidebar"
        className={isToggled ? "sidebar active" : "sidebar"}
        aria-label="Sidebar"
      >
        <div
          className="h-full px-3 py-4 overflow-y-auto bg-gray-50"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/dashboard/dashboard"
                className="flex justify-center items-center p-2 text-gray-900 rounded-lg bg-gray-100 group"
              >
                <span className="ms-3 mr-4">
                  <img alt="logo" className="h-14 w-auto" src={logo}></img>
                </span>
              </Link>
            </li>
            {TL ? (
              <>
                {/* TL-specific Links */}
                <li>
                  <Link
                    to="/dashboard"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard" && "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard" && "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap ">
                      Employee Report
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/employeeTask"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/employeeTask"
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/employeeTask"
                          ? "text-orange-500"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-3-3v6m-3-6h6M5 3a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 whitespace-nowrap">
                      {" "}
                      Daily Task
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/id-card-report"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/id-card-report" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/id-card-report" &&
                        "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      ID Card Report
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/report-history"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname.startsWith(
                        "/dashboard/report-history"
                      ) && "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname.startsWith(
                          "/dashboard/report-history"
                        ) && "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Report History
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/teamReport"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname.startsWith("/dashboard/teamReport") &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname.startsWith("/dashboard/teamReport") &&
                        "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h4v12H4zm6 6h4v6h-4zm6-12h4v18h-4z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Team Report
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/applayLeave"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/applayLeave" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/applayLeave" &&
                        "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 12V8m4 4V8m1-4H9a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1z"
                      />{" "}
                      {/* Key icon */}
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Apply Leave{" "}
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/leveStatus"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/leveStatus" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/leveStatus" &&
                        "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 8h12M6 12h8m-8 4h8m-9 5h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"
                      />{" "}
                      {/* Clipboard/Checklist icon */}
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Leave Status
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/changePassword"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/changePassword" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/changePassword" &&
                        "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V4a4 4 0 1 1 8 0v3m-8 0a4 4 0 0 0-4 4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-7a4 4 0 0 0-4-4H8z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Change Password
                    </span>
                  </Link>
                </li>
              </>
            ) : isAdmin ? (
              <>
                <li>
                  <Link
                    to="/dashboard/dashboard"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/dashboard" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname.startsWith("/dashboard/dashboard") &&
                        "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 3V21M4 21H20M20 21V3M8 17V11M12 17V7M16 17V13"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Dashboard
                    </span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() =>
                      setEmployeeDropdownOpen(!employeeDropdownOpen)
                    }
                    className={`flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname.startsWith(
                        "/dashboard/employee-master"
                      ) && "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname.startsWith(
                          "/dashboard/employee-master"
                        ) && "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z
M4 17c0-1.657 1.343-3 3-3h10c1.657 0 3 1.343 3 3v1c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1v-1z
M16 14v6"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Employee Details
                    </span>
                    <svg
                      className={`w-5 h-5 transition ${
                        employeeDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {employeeDropdownOpen && (
                    <ul className="ml-4">
                      <li>
                        <Link
                          to="/dashboard/employee-list"
                          className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                            location.pathname === "/dashboard/employee-list" &&
                            "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                              location.pathname ===
                                "/dashboard/employee-list" && "text-orange-500"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                            />
                          </svg>
                          <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                            Employee List
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/employee-status"
                          className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                            location.pathname ===
                              "/dashboard/employee-status" && "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                              location.pathname ===
                                "/dashboard/employee-status" &&
                              "text-orange-500"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle
                              cx="12"
                              cy="8"
                              r="4"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="4"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M18 16v2l1.5 1.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <rect
                              x="6"
                              y="14"
                              width="8"
                              height="6"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                            <path
                              d="M8 16h4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                            Old Employee Details{" "}
                          </span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <button
                    onClick={() => setReportsDropdownOpen(!reportsDropdownOpen)}
                    className={`flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname.startsWith(
                        "/dashboard/employee-master"
                      ) && "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname.startsWith(
                          "/dashboard/employee-master"
                        ) && "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z
M4 17c0-1.657 1.343-3 3-3h10c1.657 0 3 1.343 3 3v1c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1v-1z
M16 14v6"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Reports
                    </span>
                    <svg
                      className={`w-5 h-5 transition ${
                        reportsDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {reportsDropdownOpen && (
                    <ul className="ml-4">
                      <li>
                        <Link
                          to="/dashboard/attendance-report"
                          className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                            location.pathname ===
                              "/dashboard/attendance-report" && "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                              location.pathname ===
                                "/dashboard/attendance-report" &&
                              "text-orange-500"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                            />
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 21C5 17.134 8.134 14 12 14C15.866 14 19 17.134 19 21"
                            />
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 19L18 21L22 17"
                            />
                          </svg>
                          <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                            Attendance Report
                          </span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/dashboard/report-history"
                          className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                            location.pathname === "/dashboard/report-history" &&
                            "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                              location.pathname.startsWith(
                                "/dashboard/report-history"
                              ) && "text-orange-500"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2ZM7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8ZM12 14v-2m0 0v-2m0 4l2 2m-2-2-2 2"
                            />
                          </svg>
                          <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                            Report History
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/punchReport"
                          className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                            location.pathname === "/dashboard/punchReport" &&
                            "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                              location.pathname.startsWith(
                                "/dashboard/punchReport"
                              ) && "text-orange-500"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6l4 2M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"
                            />
                          </svg>
                          <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                            Punch Report
                          </span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <button
                    onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                    className={`flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname.startsWith("/dashboard/projects") &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname.startsWith("/dashboard/projects") &&
                        "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Projects
                    </span>
                    <svg
                      className={`w-5 h-5 transition ${
                        projectDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {projectDropdownOpen && (
                    <ul className="ml-4">
                      <li>
                        <Link
                          to="/dashboard/projects"
                          className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                            location.pathname.includes("/dashboard/projects") &&
                            "bg-gray-100"
                          }`}
                        >
                          <span className="flex-1 text-left ml-3 whitespace-nowrap">
                            Project List
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/dashboard/project-assign-list"
                          className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                            location.pathname ===
                              "/dashboard/project-assign-list" && "bg-gray-100"
                          }`}
                        >
                          <span className="flex-1 text-left ml-3 whitespace-nowrap">
                            Project Assign
                          </span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    to="/dashboard/leaveAcces"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/leaveAcces" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6M9 16h6M9 8h6M19 3H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Leave Approve
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/changePassword"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/changePassword" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/changePassword" &&
                        "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V4a4 4 0 1 1 8 0v3m-8 0a4 4 0 0 0-4 4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-7a4 4 0 0 0-4-4H8z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Change Password
                    </span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/dashboard/dashboards"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/dashboards" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname.startsWith("/dashboard/dashboards") &&
                        "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 3V21M4 21H20M20 21V3M8 17V11M12 17V7M16 17V13"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Dashboard
                    </span>
                  </Link>
                </li>
                <li></li>
                <li>
                  <Link
                    to="/dashboard"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard" && "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard" && "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Employee Report
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/project-assign-list"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/project-assign-list"
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/project-assign-list"
                          ? "text-orange-500"
                          : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-3-3v6m-3-6h6M5 3a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 whitespace-nowrap">
                      {" "}
                      Daily Task
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/id-card-report"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/id-card-report" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/id-card-report" &&
                        "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 9h3m-3 3h3m-3 3h3m-6 1c-.306-.613-.933-1-1.618-1H7.618c-.685 0-1.312.387-1.618 1M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      ID Card Report
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/report-history"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/report-history" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/report-history" &&
                        "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2ZM7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8ZM12 14v-2m0 0v-2m0 4l2 2m-2-2-2 2"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Report History
                    </span>
                  </Link>
                </li>
                {Tl && (
                  <li>
                    <Link
                      to="/dashboard/report-historyTl"
                      className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                        location.pathname === "/dashboard/report-historyTl" &&
                        "bg-gray-100"
                      }`}
                    >
                      <svg
                        className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                          location.pathname === "/dashboard/report-historyTl" &&
                          "text-orange-500"
                        }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h4v12H4zm6 6h4v6h-4zm6-12h4v18h-4z"
                        />
                      </svg>
                      <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                        Team Report
                      </span>
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    to="/dashboard/applayLeave"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/applayLeave" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/applayLeave" &&
                        "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 12V8m4 4V8m1-4H9a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1z"
                      />{" "}
                      {/* Key icon */}
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Apply Leave{" "}
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard/leveStatus"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/leveStatus" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/leveStatus" &&
                        "text-orange-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 8h12M6 12h8m-8 4h8m-9 5h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"
                      />{" "}
                      {/* Clipboard/Checklist icon */}
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Leave Status
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/changePassword"
                    className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                      location.pathname === "/dashboard/changePassword" &&
                      "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500 ${
                        location.pathname === "/dashboard/changePassword" &&
                        "text-orange-500"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V4a4 4 0 1 1 8 0v3m-8 0a4 4 0 0 0-4 4v7a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-7a4 4 0 0 0-4-4H8z"
                      />
                    </svg>
                    <span className="flex-1 text-left ml-3 ms-3 whitespace-nowrap">
                      Change Password
                    </span>
                  </Link>
                </li>
              </>
            )}
            <li>
              <div
                onClick={(e) => logOuts()}
                className="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-orange-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                  />
                </svg>
                <span className="flex-1 text-left ml-3 ms-3 select-none whitespace-nowrap">
                  Logout
                </span>
              </div>
            </li>
          </ul>
          <div className="flex items-center absolute bottom-0 mb-3 pl-4 pr-14 py-2 border-t border-indigo-150 rounded-md">
            <div className="flex-shrink-0">
              <img
                alt="profile pic"
                className="w-10 h-10 rounded-full"
                src={userData?.profileUrl || ""}
              />
            </div>
            <div className="flex-1 min-w-0 ms-4">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {userData?.employeeName || ""}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {userData?.designation || ""}
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <Routes>
            <Route path="/" element={<EmployeeReport />} />
            <Route path="/employeeTask" element={<EmployeeTask />} />
            <Route path="/employeeTaskEdit" element={<EmployeeTaskEdit />} />
            <Route path="/id-card-report" element={<IdCardReport />} />
            <Route path="/idCardReportEdit" element={<IdCardReportEdit />} />
            <Route path="/report-history/*" element={<ReportHistory />} />
            <Route path="/report-historyTl/*" element={<ReportHistoryTl />} />
            <Route path="/employee-list" element={<EmployeeList />} />
            <Route path="/dashboard" element={<EmployeeMaster />} />
            <Route path="/attendance-report" element={<AttendanceReport />} />
            <Route path="/employee-status" element={<EmployeeStatus />} />
            {/* <Route path="/projects" element={<ProjectMasters />} /> */}
            <Route path="/dashboards" element={<EmployeeMasters />} />
            <Route path="/addEmployee" element={<AddEmployee />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/teamReport/*" element={<TeamReport />} />
            <Route path="/applayLeave" element={<ApplayLeave />} />
            <Route path="/leveStatus" element={<LeveStatus />} />
            <Route path="/leaveAcces" element={<LeaveAcces />} />
            <Route path="/punchReport" element={<PunchReport />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/add" element={<ProjectForm />} />
            <Route path="/project-assign" element={<ProjectAssignForm />} />
            <Route path="/project-assign-list" element={<ProjectAssignList />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
