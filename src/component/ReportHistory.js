// import React, { Suspense } from "react";
// import { Link, Route, Routes, useLocation } from "react-router-dom";

// const EmployeeReportList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/EmployeeReportList"));
// const IdCardList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/IdCardList"));
// const TaskList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/TaskList"));

// const ReportHistory = () => {
//   const location = useLocation();
//   return (
//     <>
//       <nav className="bg-gray-50">
//         <div className="flex items-center max-w-screen-xl px-4 py-3 mx-auto">
//           <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
//             <li>
//               <Link to="/dashboard/report-history" className={location.pathname === "/dashboard/report-history" ? "underline" : ""}>
//                 Employee Report
//               </Link>
//             </li>
//             <li>
//               <Link to="/dashboard/report-history/id-card-report" className={location.pathname === "/dashboard/report-history/id-card-report" ? "underline" : ""}>
//                 ID Card Reports
//               </Link>
//             </li>
//             <li>
//               <Link to="/dashboard/report-history/taskList" className={location.pathname === "/dashboard/report-history/taskList" ? "underline" : ""}>
//                 Daily Task
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </nav>

//       <div className="images_content">
//         <Suspense fallback={<div>Loading...</div>}>
//           <Routes>
//             <Route path="/" element={<EmployeeReportList />} />
//             <Route path="/id-card-report" element={<IdCardList />} />
//             <Route path="/taskList" element={<TaskList />} />
//           </Routes>
//         </Suspense>
//       </div>
//     </>
//   );
// };

// export default ReportHistory;












// import React, { Suspense, useState } from "react";
// import { Link, Route, Routes, useLocation } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const EmployeeReportList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/EmployeeReportList"));
// const IdCardList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/IdCardList"));
// const TaskList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/TaskList"));

// const ReportHistory = () => {
//   const location = useLocation();
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());

//   return (
//     <div className="p-6 bg-whitesmoke min-h-screen">
//       <nav className="bg-gray-50 shadow-md p-4 rounded-lg">
//         <div className="flex items-center max-w-screen-xl px-4 mx-auto">
//           <ul className="flex flex-row font-medium space-x-8 text-sm">
//             <li>
//               <Link to="/dashboard/report-history" className={`${location.pathname === "/dashboard/report-history" ? "underline text-blue-600 bg-gray-200 px-4 py-2 rounded" : "hover:text-blue-500"}`}>
//                 Employee Report
//               </Link>
//             </li>
//             <li>
//               <Link to="/dashboard/report-history/id-card-report" className={`${location.pathname === "/dashboard/report-history/id-card-report" ? "underline text-blue-600 bg-gray-200 px-4 py-2 rounded" : "hover:text-blue-500"}`}>
//                 ID Card Reports
//               </Link>
//             </li>
//             <li>
//               <Link to="/dashboard/report-history/taskList" className={`${location.pathname === "/dashboard/report-history/taskList" ? "underline text-blue-600 bg-gray-200 px-4 py-2 rounded" : "hover:text-blue-500"}`}>
//                 Daily Task
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </nav>

//       {/* <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
//         <div className="grid grid-cols-3 gap-6">
//           <div>
//             <label className="block text-gray-700 font-medium">Start Date</label>
//             <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} maxDate={new Date()} className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" />
//           </div>
//           <div>
//             <label className="block text-gray-700 font-medium">End Date</label>
//             <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} minDate={startDate} maxDate={new Date()} className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" />
//           </div>
//         </div>
//       </div> */}
      
//       <div className="mt-6">
//         <Suspense fallback={<div>Loading...</div>}>
//           <Routes>
//             <Route path="/" element={<EmployeeReportList />} />
//             <Route path="/id-card-report" element={<IdCardList />} />
//             <Route path="/taskList" element={<TaskList />} />
//           </Routes>
//         </Suspense>
//       </div>
//     </div>
//   );
// };

// export default ReportHistory;



import React, { Suspense, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EmployeeReportList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/EmployeeReportList"));
const IdCardList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/IdCardList"));
const TaskList = React.lazy(() => import(/* webpackPrefetch: true */ "../module/TaskList"));

const ReportHistory = () => {
  const location = useLocation();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <div className="p-6 bg-whitesmoke min-h-screen">
      <nav className="bg-white-50 shadow-md p-4 rounded-lg">
        <div className="flex items-center max-w-screen-xl px-4 mx-auto">
          <ul className="flex flex-row font-medium space-x-8 text-sm">
            <li>
              <Link to="/dashboard/report-history">
                <button className={`px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 transition`}>
                  Employee Report
                </button>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-history/id-card-report">
                <button className={`px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 transition`}>
                  ID Card Reports
                </button>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/report-history/taskList">
                <button className={`px-6 py-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 transition`}>
                  Daily Task
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      
      
      <div className="mt-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<EmployeeReportList />} />
            <Route path="/id-card-report" element={<IdCardList />} />
            <Route path="/taskList" element={<TaskList />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default ReportHistory;




