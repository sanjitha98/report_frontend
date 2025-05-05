// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
// import moment from "moment";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./style.css"; // Ensure your stylesheet is imported correctly

// const AddTask = () => {
//   const location = useLocation();
//   const id = location.state?.id || null;
//   const navigate = useNavigate();
//   const [isProjectAssigned, setIsProjectAssigned] = useState(false);
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: "",
//     task: "",
//     Subproducts: "",
//     estimatedTime: "",
//     startTime: null,
//     endTime: null,
//     taskStatus: "",
//     reasonForIncomplete: "",
//     remarks: "",
//     employeeId: localStorage.getItem("employeeId"),
//     employeeName: localStorage.getItem("employeeName"),
//   });

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const today = moment().startOf("day").toDate();
//   const minDate = moment(today).subtract(1, "day").toDate();
//   const maxDate = moment(today).add(1, "day").toDate();

//   const handleChange = (e) => {
//     setTaskData({
//       ...taskData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleDateChange = (date) => {
//     setTaskData({ ...taskData, date });
//   };

//   const handleStartTimeChange = (time) => {
//     setTaskData({ ...taskData, startTime: time });
//   };

//   const handleEndTimeChange = (time) => {
//     setTaskData({ ...taskData, endTime: time });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       startTime: taskData.startTime
//         ? moment(taskData.startTime).format("h:mm A")
//         : null,
//       endTime: taskData.endTime
//         ? moment(taskData.endTime).format("h:mm A")
//         : null,
//     };

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/createtask`,
//         formattedTaskData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setSuccessMessage("Task created successfully");
//       alert("Task added successfully!");
//       navigate("/dashboard/report-history/taskList");

//       /* navigate('/employeeDashboard'); */
//       setErrorMessage("");
//       setTaskData({
//         date: new Date(),
//         customer: "",
//         task: "",
//         SubProducts: "",
//         estimatedTime: "",
//         startTime: null,
//         endTime: null,
//         taskStatus: "",
//         reasonForIncomplete: "",
//         remarks: "",
//         employeeId: localStorage.getItem("employeeId"),
//         employeeName: localStorage.getItem("employeeName"),
//       });
//     } catch (error) {
//       setSuccessMessage("");
//       setErrorMessage(error.response?.data?.message || "Server error");
//     }
//   };

//   useEffect(() => {
//     const fetchAssignedProjectTask = async () => {
//       try {
//         const res = await axios.post(
//           `${process.env.REACT_APP_API_URL}/get_assigned_project`,
//           {
//             id: id,
//             from_date: moment(taskData.date).format("YYYY-MM-DD"),
//             to_date: moment(taskData.date).format("YYYY-MM-DD"),
//           }
//         );

//         const assignedTask = res.data.data?.[0]; // safely access the first item
//         if (assignedTask) {
//           setTaskData((prev) => ({
//             ...prev,
//             customer: assignedTask.project_name || "",
//             Subproducts: assignedTask.sub_products || "",
//             task: assignedTask.task_details || "",
//             estimatedTime: assignedTask.estimatedTime || "",
//             startTime: assignedTask.assigned_date
//               ? moment(assignedTask.assigned_date).toDate()
//               : null,
//             endTime: assignedTask.deadline_date
//               ? moment(assignedTask.deadline_date).toDate()
//               : null,
//             taskStatus: assignedTask.taskStatus || "",
//             reasonForIncomplete: assignedTask.reasonForIncomplete || "",
//             remarks: assignedTask.remarks || "",
//           }));
//           setIsProjectAssigned(true);
//         } else {
//           setIsProjectAssigned(false);
//         }
//       } catch (err) {
//         console.error("Error fetching assigned project task:", err);
//       }
//     };

//     fetchAssignedProjectTask();
//   }, [taskData.date]);

//   return (
//     <div
//       style={{
//         maxWidth: "1000px",
//         margin: "0 auto",
//         padding: "20px",
//         backgroundColor: "#f8f9fa",
//         borderRadius: "8px",
//       }}
//     >
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "10px" }}>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: "15px" }}>
//             <label>Date</label>
//             <div style={{ position: "relative" }}>
//               <DatePicker
//                 selected={taskData.date}
//                 onChange={handleDateChange}
//                 dateFormat="yyyy-MM-dd"
//                 className="custom-datepicker" // Use custom class here
//                 placeholderText="Select Date"
//                 minDate={minDate}
//                 maxDate={maxDate}
//               />
//             </div>
//           </div>
//           <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
//             <label>Project Name</label>
//             <input
//               type="text"
//               name="customer"
//               value={taskData.customer}
//               onChange={handleChange}
//               disabled={isProjectAssigned}
//               // placeholder="Enter customer name"
//               style={{
//                 width: "450px",
//                 padding: "8px",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label>Sub Products</label>
//           <input
//             type="text"
//             name="Subproducts"
//             value={taskData.Subproducts}
//             onChange={handleChange}
//             disabled={isProjectAssigned}
//             // placeholder="Enter estimated time"
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label>Task Description</label>
//           <textarea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             disabled={isProjectAssigned}
//             // placeholder="Enter task description"
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               flex: "0 0 32%",
//               marginRight: "10px",
//               marginBottom: "15px",
//             }}
//           >
//             <label>Estimated Times</label>
//             <input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>

//           <div
//             style={{
//               flex: "0 0 32%",
//               marginRight: "10px",
//               marginBottom: "15px",
//             }}
//           >
//             <label>Start Time</label>
//             <br />
//             <div style={{ position: "relative" }}>
//               <DatePicker
//                 selected={taskData.startTime}
//                 onChange={handleStartTimeChange}
//                 showTimeSelect
//                 showTimeSelectOnly
//                 timeIntervals={15}
//                 timeCaption="Time"
//                 dateFormat="h:mm aa"
//                 className="custom-datepicker"
//                 placeholderText="Select Start Time"
//               />
//             </div>
//           </div>

//           <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
//             <label>End Time</label>
//             <br />
//             <div style={{ position: "relative" }}>
//               <DatePicker
//                 selected={taskData.endTime}
//                 onChange={handleEndTimeChange}
//                 showTimeSelect
//                 showTimeSelectOnly
//                 timeIntervals={15}
//                 timeCaption="Time"
//                 dateFormat="h:mm aa"
//                 className="custom-datepicker"
//                 placeholderText="Select End Time"
//               />
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//             <label>Task Status</label>
//             <select
//               name="taskStatus"
//               value={taskData.taskStatus}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               }}
//             >
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>

//           {(taskData.taskStatus === "Pending" ||
//             taskData.taskStatus === "In Progress") && (
//             <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//               <label>Reason for Incomplete</label>
//               <input
//                 type="text"
//                 name="reasonForIncomplete" // corrected name attribute
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   borderRadius: "8px",
//                   border: "1px solid #ccc",
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label>Remarks</label>
//           <textarea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>

//         <button
//           type="submit"
//           style={{
//             display: "block",
//             margin: "0 auto",
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "8px",
//           }}
//         >
//           Add Task
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddTask;

//------
// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
// import moment from "moment";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./style.css"; // Ensure your stylesheet is imported correctly

// const AddTask = () => {
//   const location = useLocation();
//   const id = location.state?.id || null;
//   const navigate = useNavigate();
//   const [isProjectAssigned, setIsProjectAssigned] = useState(false);
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: "",
//     task: "",

//     Subproducts: "",
//     estimatedTime: "",
//     startTime: null,
//     endTime: null,
//     taskStatus: "",
//     reasonForIncomplete: "",
//     remarks: "",
//     employeeId: localStorage.getItem("employeeId"),
//     employeeName: localStorage.getItem("employeeName"),
//   });

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const today = moment().startOf("day").toDate();
//   const minDate = moment(today).subtract(1, "day").toDate();
//   const maxDate = moment(today).add(1, "day").toDate();

//   const handleChange = (e) => {
//     setTaskData({
//       ...taskData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleDateChange = (date) => {
//     setTaskData({ ...taskData, date });
//   };

//   const handleStartTimeChange = (time) => {
//     setTaskData({ ...taskData, startTime: time });
//   };

//   const handleEndTimeChange = (time) => {
//     setTaskData({ ...taskData, endTime: time });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       date: moment(taskData.date).format("YYYY-MM-DD"), // Ensure 'date' is properly formatted
//       project_name: taskData.customer, // Assuming taskData.projectName is the correct field for the project name
//       task_details: taskData.task, // Assuming 'task' contains task details
//       task_description: taskData.taskDescription, // Assuming 'taskDescription' is the field for task description
//       sub_products: taskData.Subproducts, // Assuming 'subProducts' corresponds to the products
//       estimated_time: taskData.estimatedTime, // Make sure this is a string or number as expected
//       assigned_date: taskData.startTime ? moment(taskData.startTime).toISOString() : null, // Ensure it's in ISO format
//       deadline_date: taskData.endTime ? moment(taskData.endTime).toISOString() : null, // Ensure it's in ISO format
//       task_status: taskData.taskStatus, // Task status
//       // reasonForIncomplete: taskData.reasonForIncomplete, // If applicable
//       remarks: taskData.remarks, // Remarks about the task
//       employee_id: taskData.employeeId, // Employee ID for assignment
//       employee_name: taskData.employeeName, // Employee name for assignment
//       id: id || undefined, // If an existing task is being updated, otherwise undefined
//       created_by: ""
//     };
//     console.log("Submitting payload:", payload);
//     console.log("API URL:", `${process.env.REACT_APP_API_URL}/project_assign`);

//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/project_assign`,
//         payload
//       );
//       alert(res.data.message);
//       navigate("/dashboard/project-assign-list");
//     } catch (err) {
//       console.error("API error:", err); // <-- Add this line
//       alert(err.response?.data?.error || "Something went wrong!");
//     }
//   };

//   useEffect(() => {
//     const fetchAssignedProjectTask = async () => {
//       try {
//         const res = await axios.post(
//           `${process.env.REACT_APP_API_URL}/get_assigned_project`,
//           {
//             id: id,
//             from_date: moment(taskData.date).format("YYYY-MM-DD"),
//             to_date: moment(taskData.date).format("YYYY-MM-DD"),
//           }
//         );

//         const assignedTask = res.data.data?.[0]; // safely access the first item
//         if (assignedTask) {
//           setTaskData((prev) => ({
//             ...prev,
//             customer: assignedTask.project_name || "",
//             Subproducts: assignedTask.sub_products || "",
//             task: assignedTask.task_details || "",
//             estimatedTime: assignedTask.estimatedTime || "",
//             startTime: assignedTask.assigned_date
//               ? moment(assignedTask.assigned_date).toDate()
//               : null,
//             endTime: assignedTask.deadline_date
//               ? moment(assignedTask.deadline_date).toDate()
//               : null,
//             taskStatus: assignedTask.taskStatus || "",
//             reasonForIncomplete: assignedTask.reasonForIncomplete || "",
//             remarks: assignedTask.remarks || "",
//           }));
//           setIsProjectAssigned(true);
//         } else {
//           setIsProjectAssigned(false);
//         }
//       } catch (err) {
//         console.error("Error fetching assigned project task:", err);
//       }
//     };

//     fetchAssignedProjectTask();
//   }, [taskData.date]);

//   return (
//     <div
//       style={{
//         maxWidth: "1000px",
//         margin: "0 auto",
//         padding: "20px",
//         backgroundColor: "#f8f9fa",
//         borderRadius: "8px",
//       }}
//     >
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "10px" }}>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: "15px" }}>
//             <label>Date</label>
//             <div style={{ position: "relative" }}>
//               <DatePicker
//                 selected={taskData.date}
//                 onChange={handleDateChange}
//                 dateFormat="yyyy-MM-dd"
//                 className="custom-datepicker" // Use custom class here
//                 placeholderText="Select Date"
//                 minDate={minDate}
//                 maxDate={maxDate}
//               />
//             </div>
//           </div>
//           <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
//             <label>Project Name</label>
//             <input
//               type="text"
//               name="customer"
//               value={taskData.customer}
//               onChange={handleChange}
//               disabled={isProjectAssigned}
//               // placeholder="Enter customer name"
//               style={{
//                 width: "450px",
//                 padding: "8px",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label>Sub Products</label>
//           <input
//             type="text"
//             name="Subproducts"
//             value={taskData.Subproducts}
//             onChange={handleChange}
//             disabled={isProjectAssigned}
//             // placeholder="Enter estimated time"
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label>Task Description</label>
//           <textarea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             disabled={isProjectAssigned}
//             // placeholder="Enter task description"
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//           }}
//         >
//           <div
//             style={{
//               flex: "0 0 32%",
//               marginRight: "10px",
//               marginBottom: "15px",
//             }}
//           >
//             <label>Estimated Times</label>
//             <input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               }}
//             />
//           </div>

//           <div
//             style={{
//               flex: "0 0 32%",
//               marginRight: "10px",
//               marginBottom: "15px",
//             }}
//           >
//             <label>Start Time</label>
//             <br />
//             <div style={{ position: "relative" }}>
//               <DatePicker
//                 selected={taskData.startTime}
//                 onChange={handleStartTimeChange}
//                 showTimeSelect
//                 showTimeSelectOnly
//                 timeIntervals={15}
//                 timeCaption="Time"
//                 dateFormat="h:mm aa"
//                 className="custom-datepicker"
//                 placeholderText="Select Start Time"
//               />
//             </div>
//           </div>

//           <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
//             <label>End Time</label>
//             <br />
//             <div style={{ position: "relative" }}>
//               <DatePicker
//                 selected={taskData.endTime}
//                 onChange={handleEndTimeChange}
//                 showTimeSelect
//                 showTimeSelectOnly
//                 timeIntervals={15}
//                 timeCaption="Time"
//                 dateFormat="h:mm aa"
//                 className="custom-datepicker"
//                 placeholderText="Select End Time"
//               />
//             </div>
//           </div>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             flexWrap: "wrap",
//           }}
//         >
//           <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//             <label>Task Status</label>
//             <select
//               name="taskStatus"
//               value={taskData.taskStatus}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               }}
//             >
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>

//           {(taskData.taskStatus === "Pending" ||
//             taskData.taskStatus === "In Progress") && (
//             <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//               <label>Reason for Incomplete</label>
//               <input
//                 type="text"
//                 name="reasonForIncomplete" // corrected name attribute
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   borderRadius: "8px",
//                   border: "1px solid #ccc",
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label>Remarks</label>
//           <textarea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//             }}
//           />
//         </div>

//         <button
//           type="submit"
//           style={{
//             display: "block",
//             margin: "0 auto",
//             padding: "10px 20px",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: "8px",
//           }}
//         >
//           Add Task
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddTask;
//------

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const AddTask = () => {
  const location = useLocation();
  const id = location.state?.id || null;
  const navigate = useNavigate();

  const [isProjectAssigned, setIsProjectAssigned] = useState(false);
  const [taskData, setTaskData] = useState({
    date: new Date(),
    project_name: "",
    task_details: "",
    task_description:"",
    sub_products: "",
    estimated_time: "",
    assigned_date: null,
    deadline_date: null,
    task_status: "",
    remarks: "",
    employee_id: localStorage.getItem("employeeId"),
    employee_name: localStorage.getItem("employeeName"),
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const today = moment().startOf("day").toDate();
  const minDate = moment(today).subtract(1, "day").toDate();
  const maxDate = moment(today).add(1, "day").toDate();

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setTaskData({ ...taskData, date });
  };

  const handleStartTimeChange = (time) => {
    setTaskData({ ...taskData, assigned_date: time });
  };

  const handleEndTimeChange = (time) => {
    setTaskData({ ...taskData, deadline_date: time });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...taskData,
      date: moment(taskData.date).format("YYYY-MM-DD"),
      id: id ? Number(id) : undefined,
      created_by: "",
    };

    console.log("Submitting payload:", payload);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/project_assign`,
        payload
      );
      alert(res.data.message);
      navigate("/dashboard/project-assign-list");
    } catch (err) {
      console.error("API error:", err);
      alert(err.response?.data?.error || "Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchAssignedProjectTask = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/get_assigned_project`,
          {
            id: id,
            from_date: moment(taskData.date).format("YYYY-MM-DD"),
            to_date: moment(taskData.date).format("YYYY-MM-DD"),
          }
        );

        const assignedTask = res.data.data?.[0];
        if (assignedTask) {
          setTaskData((prev) => ({
            ...prev,
            project_name: assignedTask.project_name || "",
            sub_products: assignedTask.sub_products || "",
            task_details: assignedTask.task_details || "",
            task_description:assignedTask.task_description|| "",
            estimated_time: assignedTask.estimated_time || "",
            assigned_date: assignedTask.assigned_date
              ? moment(assignedTask.assigned_date).format("YYYY-MM-DD HH:mm:ss")
              : null,

            deadline_date: assignedTask.deadline_date
              ? moment(assignedTask.deadline_date).format("YYYY-MM-DD HH:mm:ss")
              : null,

            task_status: assignedTask.taskStatus || "",
            remarks: assignedTask.remarks || "",
          }));
          setIsProjectAssigned(true);
        } else {
          setIsProjectAssigned(false);
        }
      } catch (err) {
        console.error("Error fetching assigned project task:", err);
      }
    };

    fetchAssignedProjectTask();
  }, [taskData.date]);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div style={{ marginBottom: "15px" }}>
            <label>Date</label>
            <div style={{ position: "relative" }}>
              <DatePicker
                selected={taskData.date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
                placeholderText="Select Date"
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          </div>
          <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
            <label>Project Name</label>
            <input
              type="text"
              name="project_name"
              value={taskData.project_name}
              onChange={handleChange}
              disabled={isProjectAssigned}
              style={{
                width: "450px",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Sub Products</label>
          <input
            type="text"
            name="sub_products"
            value={taskData.sub_products}
            onChange={handleChange}
            disabled={isProjectAssigned}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Task </label>
          <textarea
            name="task_details"
            value={taskData.task_details}
            onChange={handleChange}
            disabled={isProjectAssigned}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Task Description</label>
          <textarea
            name="task_description"
            value={taskData.task_description}
            onChange={handleChange}
            disabled={isProjectAssigned}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "0 0 32%",
              marginRight: "10px",
              marginBottom: "15px",
            }}
          >
            <label>Estimated Time</label>
            <input
              type="text"
              name="estimated_time"
              value={taskData.estimated_time}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div
            style={{
              flex: "0 0 32%",
              marginRight: "10px",
              marginBottom: "15px",
            }}
          >
            <label>Start Time</label>
            <br />
            <input
              value={taskData.assigned_date}
              onChange={handleChange}
              name="assigned_date"
              type="datetime-local"
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="datetime"
              dateFormat="YYYY-MM-DD HH:mm:ss"
              className="custom-datepicker"
              placeholderText="Select Start Time"
            />
          </div>

          <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
            <label>End Time</label>
            <br />
            <input
              value={taskData.deadline_date}
              onChange={handleChange}
              name="deadline_date"
              type="datetime-local"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="custom-datepicker"
              placeholderText="Select End Time"
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Task Status</label>
          <select
            name="task_status"
            value={taskData.task_status}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={taskData.remarks}
            onChange={handleChange}
            placeholder="Additional remarks"
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            display: "block",
            margin: "0 auto",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
