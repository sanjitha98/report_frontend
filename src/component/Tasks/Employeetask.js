import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Ensure your stylesheet is imported correctly

const AddTask = () => {
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    date: new Date(),
    customer: '',
    task: '',
    estimatedTime: '',
    startTime: null,
    endTime: null,
    taskStatus: '',
    reasonForIncomplete: '',
    remarks: '',
    employeeId: localStorage.getItem('employeeId'),
    employeeName: localStorage.getItem('employeeName')
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const today = moment().startOf('day').toDate();
  const minDate = moment(today).subtract(1, 'day').toDate();
  const maxDate = moment(today).add(1, 'day').toDate();

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (date) => {
    setTaskData({ ...taskData, date });
  };

  const handleStartTimeChange = (time) => {
    setTaskData({ ...taskData, startTime: time });
  };

  const handleEndTimeChange = (time) => {
    setTaskData({ ...taskData, endTime: time });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedTaskData = {
      ...taskData,
      date: moment(taskData.date).format('YYYY-MM-DD'),
      startTime: taskData.startTime ? moment(taskData.startTime).format('h:mm A') : null,
      endTime: taskData.endTime ? moment(taskData.endTime).format('h:mm A') : null
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccessMessage('Task created successfully');
      alert('Task added successfully!');
      navigate("/dashboard/report-history/taskList");

      /* navigate('/employeeDashboard'); */
      setErrorMessage('');
      setTaskData({
        date: new Date(),
        customer: '',
        task: '',
        estimatedTime: '',
        startTime: null,
        endTime: null,
        taskStatus: '',
        reasonForIncomplete: '',
        remarks: '',
        employeeId: localStorage.getItem('employeeId'),
        employeeName: localStorage.getItem('employeeName')
      });
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.data?.message || 'Server error');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className='flex'>
          <div style={{ marginBottom: '15px' }}>
            <label>Date</label>
            <div style={{ position: 'relative' }}>
              <DatePicker
                selected={taskData.date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker" // Use custom class here
                placeholderText="Select Date"
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          </div>
          <div style={{ marginBottom: '15px', marginLeft: "290px" }}>
            <label>Customer</label>
            <input
              type="text"
              name="customer"
              value={taskData.customer}
              onChange={handleChange}
              placeholder="Enter customer name"
              style={{ width: '450px', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Task</label>
          <textarea
            name="task"
            value={taskData.task}
            onChange={handleChange}
            placeholder="Enter task description"
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
            <label>Estimated Times</label>
            <input
              type="text"
              name="estimatedTime"
              value={taskData.estimatedTime}
              onChange={handleChange}
              placeholder="Enter estimated time"
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
            <label>Start Time</label><br />
            <div style={{ position: 'relative' }}>
              <DatePicker
                selected={taskData.startTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="custom-datepicker"
                placeholderText="Select Start Time"
              />
            </div>
          </div>
          
          <div style={{ flex: '0 0 32%', marginBottom: '15px' }}>
            <label>End Time</label><br />
            <div style={{ position: 'relative' }}>
              <DatePicker
                selected={taskData.endTime}
                onChange={handleEndTimeChange}
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
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
            <label>Task Status</label>
            <select
              name="taskStatus"
              value={taskData.taskStatus}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            >
              <option value="">Select Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {(taskData.taskStatus === 'Pending' || taskData.taskStatus === 'In Progress') && (
            <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
              <label>Reason for Incomplete</label>
              <input
  type="text"
  name="reasonForIncomplete" // corrected name attribute
  value={taskData.reasonForIncomplete}
  onChange={handleChange}
  placeholder="Reason for incomplete task"
  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
/>

            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={taskData.remarks}
            onChange={handleChange}
            placeholder="Additional remarks"
            rows={3}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        
        <button type="submit" style={{ display: 'block', margin: '0 auto', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px' }}>
          Add Task
        </button>
      </form>
      
    </div>
  );
};

export default AddTask;












// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import './style.css'; // Ensure your stylesheet is imported correctly

// const AddTask = () => {
//   const navigate = useNavigate();

//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: [], // Changed to array for multi-select
//     task: '',
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName')
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   const customerOptions = [
//     "KST Infotech Pvt Ltd",
//     "Calcium",
//     "Sify",
//     "Brakes India",
//     "TNPC",
//     "CRPF",
//     "Renault",
//     "RRD",
//     "ID Card Scanning",
//     "Interview"
//   ];


//   const handleChange = (e) => {
//     setTaskData({
//       ...taskData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleCustomerChange = (e) => {
//     const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
//     setTaskData({
//       ...taskData,
//       customer: selectedOptions
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

//     if (!taskData.task || !taskData.estimatedTime || !taskData.endTime || !taskData.startTime) {
//         setErrorMessage("Please fill in all required fields.");
//         return;
//     }

//     if (taskData.customer.length === 0) {
//       setErrorMessage("Please select at least one customer.");
//       return;
//     }

//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format('YYYY-MM-DD'),
//       startTime: taskData.startTime ? moment(taskData.startTime).format('h:mm A') : null,
//       endTime: taskData.endTime ? moment(taskData.endTime).format('h:mm A') : null,
//       customer: Array.isArray(taskData.customer) ? taskData.customer.join(', ') : taskData.customer
//     };

//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setSuccessMessage('Task created successfully');
//       alert('Task added successfully!');
//       navigate("/dashboard/report-history/taskList");
//       setErrorMessage('');
//       setTaskData({
//         date: new Date(),
//         customer: [], // Reset customer to empty array
//         task: '',
//         estimatedTime: '',
//         startTime: null,
//         endTime: null,
//         taskStatus: '',
//         reasonForIncomplete: '',
//         remarks: '',
//         employeeId: localStorage.getItem('employeeId'),
//         employeeName: localStorage.getItem('employeeName')
//       });
//     } catch (error) {
//       setSuccessMessage('');
//       setErrorMessage(error.response?.data?.message || 'Server error');
//     }
//   };

//   return (
//     <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//       {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
//       {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className='flex'>
//           <div style={{ marginBottom: '15px' }}>
//             <label>Date <span style={{ color: 'red' }}>*</span></label>
//             <div style={{ position: 'relative' }}>
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

//           <div style={{ marginBottom: '15px', marginLeft: "290px" }}>
//             <label>Customer <span style={{ color: 'red' }}>*</span></label>
//             <select
//               multiple
//               name="customer"
//               value={taskData.customer}
//               onChange={handleCustomerChange}
//               style={{ width: '450px', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//             >
//               {customerOptions.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Task <span style={{ color: 'red' }}>*</span></label>
//           <textarea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             placeholder="Enter task description"
//             style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//           />
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <label>Estimated Times <span style={{ color: 'red' }}>*</span></label>
//             <input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//               style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//             />
//           </div>

//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <label>Start Time <span style={{ color: 'red' }}>*</span></label><br />
//             <div style={{ position: 'relative' }}>
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

//           <div style={{ flex: '0 0 32%', marginBottom: '15px' }}>
//             <label>End Time <span style={{ color: 'red' }}>*</span></label><br />
//             <div style={{ position: 'relative' }}>
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

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//             <label>Task Status</label>
//             <select
//               name="taskStatus"
//               value={taskData.taskStatus}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//             >
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>

//           {(taskData.taskStatus === 'Pending' || taskData.taskStatus === 'In Progress') && (
//             <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//               <label>Reason for Incomplete</label>
//               <input
//                 type="text"
//                 name="reasonForIncomplete" // corrected name attribute
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//                 style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Remarks</label>
//           <textarea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//             style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//           />
//         </div>

//         <button type="submit" style={{ display: 'block', margin: '0 auto', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px' }}>
//           Add Task
//         </button>
//       </form>

//     </div>
//   );
// };

// export default AddTask;






// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import './style.css'; // Ensure your stylesheet is imported correctly

// // Styled Components for form container
// const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

// // Styled label and input styling
// const Label = styled.label`
//   font-weight: bold;
//   display: block;
//   margin-bottom: 5px;
// `;
// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;
// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;
// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;
// const MultiSelectContainer = styled.div`
//   margin-bottom: 15px;
// `;
// const SectionHeading = styled.h4`
//   margin: 10px 0 5px;
// `;

// // Container for each Customer Group selection (heading and sub-options)
// const CustomerGroupContainer = styled.div`
//   margin-bottom: 20px;
//   padding: 10px;
//   border: 2px solid orange;
//   border-radius: 8px;
// `;

// // Button styles
// const SubmitButton = styled.button`
//   display: block;
//   margin: 20px auto 0;
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// const AddTask = () => {
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: {}, // Object mapping customer heading to selected sub-options (array)
//     task: '',
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName')
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Date restrictions
//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   // Sample Customer Groups with sub-options
//   const customerGroups = [
//     {
//       heading: "KST Infotech Pvt Ltd",
//       subOptions: ["Option A", "Option B", "Option C"]
//     },
//     {
//       heading: "Calciumin",
//       subOptions: ["Power Bi", "Azure", "Web", "Mobile", "Core", "Studio"]
//     },
//     {
//       heading: "Sify",
//       subOptions: ["Colocation", "P2P", "DIA", "Cross Connect Domestic", "Login", "MPLS", "Colointernet", "GCC", "Channel Partner", "Docusign", "NSE", "Others"]
//     },
//     {
//       heading: "Brakes India",
//       subOptions: ["PMS", "Unitt-1", "Uniyt-2", "Unit-11", "RWH", "KST"]
//     },
//     {
//       heading: "TNPC",
//       subOptions: ["Building Assest Mgt", "Equipement Assest Mgt", "Fleet", "Billing Software", "Quarters Management"]
//     },
//     {
//       heading: "CRPF",
//       subOptions: ["Billing Software", "Montessori School Website"]
//     },
//     {
//       heading: "Renault",
//       subOptions: ["VMS"]
//     },
//     {
//       heading: "RRD",
//       subOptions: ["CMS"]
//     },
//     {
//       heading: "Wheels India",
//       subOptions: ["CV Unit"]
//     },
//     {
//       heading: "Attendance",
//       subOptions: ["Mobile", "Web"]
//     },
//     {
//       heading: "ID Card Scanning",
//       subOptions: ["ID Card Scanning"]
//     },
//     {
//       heading: "Scheduled Interview",
//       subOptions: ["Scheduled Interview"]
//     },
//     {
//       heading: "Client Visit",
//       subOptions: ["Client Visit"]
//     },
//   ];

//   // Handle generic changes
//   const handleChange = (e) => {
//     setTaskData({
//       ...taskData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle date changes
//   const handleDateChange = (date) => {
//     setTaskData({ ...taskData, date });
//   };

//   // Handle start and end time changes
//   const handleStartTimeChange = (time) => {
//     setTaskData({ ...taskData, startTime: time });
//   };

//   const handleEndTimeChange = (time) => {
//     setTaskData({ ...taskData, endTime: time });
//   };

//   // Handle change for customer groups (multi-select)
//   const handleCustomerGroupChange = (heading, selectedValues) => {
//     setTaskData({
//       ...taskData,
//       customer: { ...taskData.customer, [heading]: selectedValues },
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Validate required fields
//     if (
//       !taskData.task ||
//       !taskData.estimatedTime ||
//       !taskData.startTime ||
//       !taskData.endTime
//     ) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }
//     // Validate at least one customer group is selected with sub-options
//     const selectedCustomerGroups = Object.keys(taskData.customer).filter(
//       (heading) => taskData.customer[heading].length > 0
//     );
//     if (selectedCustomerGroups.length === 0) {
//       setErrorMessage("Please select at least one customer and its sub-options.");
//       return;
//     }

//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       startTime: taskData.startTime
//         ? moment(taskData.startTime).format("h:mm A")
//         : null,
//       endTime: taskData.endTime
//         ? moment(taskData.endTime).format("h:mm A")
//         : null,
//       // Convert customer object to a string format
//       customer: Object.keys(taskData.customer)
//         .map((heading) => `${heading}: [${taskData.customer[heading].join(", ")}]`)
//         .join(" | "),
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
//       // Navigate to task list (adjust your route as necessary)
//       // navigate("/dashboard/report-history/taskList");
//       setErrorMessage("");
//       setTaskData({
//         date: new Date(),
//         customer: {},
//         task: "",
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
//       setErrorMessage(
//         error.response?.data?.message || "Server error"
//       );
//     }
//   };

//   return (
//     <FormContainer>
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "10px" }}>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div style={{ color: "red", marginBottom: "10px" }}>
//           {errorMessage}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: "15px" }}>
//             <Label>
//               Date <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker"
//               placeholderText="Select Date"
//               minDate={minDate}
//               maxDate={maxDate}
//             />
//           </div>
//           <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
//             <Label>
//               Customer <span style={{ color: "red" }}>*</span>
//             </Label>
//             {/* Customer Groups Dropdown */}
//             {customerGroups.map((group) => (
//               <CustomerGroup
//                 key={group.heading}
//                 group={group}
//                 selected={taskData.customer[group.heading] || []}
//                 onChange={(selectedValues) =>
//                   handleCustomerGroupChange(group.heading, selectedValues)
//                 }
//               />
//             ))}
//           </div>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Task <span style={{ color: "red" }}>*</span></Label>
//           <textarea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             placeholder="Enter task description"
//             style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
//           />
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Estimated Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Start Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
//             <Label>
//               End Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//             />
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//             <Label>Task Status</Label>
//             <Select name="taskStatus" value={taskData.taskStatus} onChange={handleChange}>
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </div>
//           {(taskData.taskStatus === "Pending" || taskData.taskStatus === "In Progress") && (
//             <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//               <Label>Reason for Incomplete</Label>
//               <Input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Remarks</Label>
//           <TextArea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//           />
//         </div>

//         <SubmitButton type="submit">Add Task</SubmitButton>
//       </form>
//     </FormContainer>
//   );
// };

// const CustomerGroup = ({ group, selected, onChange }) => {
//   const [showSubOptions, setShowSubOptions] = useState(false);

//   const handleSelectChange = (e) => {
//     const options = Array.from(e.target.selectedOptions, option => option.value);
//     onChange(options);
//   };

//   return (
//     <CustomerGroupContainer>
//       <h4 onClick={() => setShowSubOptions(!showSubOptions)} style={{ cursor: 'pointer', color: '#007bff' }}>
//         {group.heading}
//       </h4>
//       {showSubOptions && (
//         <Select multiple value={selected} onChange={handleSelectChange}>
//           {group.subOptions.map((sub, idx) => (
//             <option key={idx} value={sub}>
//               {sub}
//             </option>
//           ))}
//         </Select>
//       )}
//     </CustomerGroupContainer>
//   );
// };

// export default AddTask;













// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import './style.css'; // Ensure your stylesheet is imported correctly

// // Styled Components for form container
// const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

// // Styled label and input styling
// const Label = styled.label`
//   font-weight: bold;
//   display: block;
//   margin-bottom: 5px;
// `;
// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;
// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;
// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// // Button styles
// const SubmitButton = styled.button`
//   display: block;
//   margin: 20px auto 0;
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// const AddTask = () => {
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: {}, // Object mapping customer heading to selected sub-options (array)
//     task: '',
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName')
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState('');

//   // Date restrictions
//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   // Sample Customer Groups with sub-options
//   const customerGroups = [
//     {
//       heading: "KST Infotech Pvt Ltd",
//       subOptions: ["Reporting Software", "KST Website", "Chat Bot", "Others"]
//     },
//     {
//       heading: "Calcium",
//       subOptions: ["Power Bi", "Azure", "Web", "Mobile", "Core", "Studio"]
//     },
//     {
//       heading: "Sify",
//       subOptions: ["Colocation", "P2P", "DIA", "Cross Connect Domestic", "Login", "MPLS", "Colointernet", "GCC", "Channel Partner", "Docusign", "NSE", "Others"]
//     },
//     {
//       heading: "Brakes India",
//       subOptions: ["PMS", "Unitt-1", "Uniyt-2", "Unit-11", "RWH", "KST"]
//     },
//     {
//       heading: "TNPC",
//       subOptions: ["Building Assest Mgt", "Equipement Assest Mgt", "Fleet", "Billing Software", "Quarters Management"]
//     },
//     {
//       heading: "CRPF",
//       subOptions: ["Billing Software", "Montessori School Website"]
//     },
//     {
//       heading: "Renault",
//       subOptions: ["VMS"]
//     },
//     {
//       heading: "RRD",
//       subOptions: ["CMS"]
//     },
//     {
//       heading: "Wheels India",
//       subOptions: ["CV Unit"]
//     },
//     {
//       heading: "Attendance",
//       subOptions: ["Mobile", "Web"]
//     },
//     {
//       heading: "ID Card Scanning",
//       subOptions: ["ID Card Scanning"]
//     },
//     {
//       heading: "Scheduled Interview",
//       subOptions: ["Scheduled Interview"]
//     },
//     {
//       heading: "Client Visit",
//       subOptions: ["Client Visit"]
//     },
//   ];

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

//   // Handle customer selection
//   const handleCustomerSelection = (e) => {
//     setSelectedCustomer(e.target.value);
//     setTaskData({
//       ...taskData,
//       customer: { ...taskData.customer, [e.target.value]: [] } // Initialize empty selected sub-options array
//     });
//   };

//   // Handle sub-option selection
//   const handleSubOptionChange = (subOption) => {
//     const { customer } = taskData;
//     const selectedSubOptions = customer[selectedCustomer] || [];
//     const newSelectedSubOptions = selectedSubOptions.includes(subOption)
//       ? selectedSubOptions.filter(option => option !== subOption)
//       : [...selectedSubOptions, subOption];

//     setTaskData({
//       ...taskData,
//       customer: {
//         ...customer,
//         [selectedCustomer]: newSelectedSubOptions
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Validate required fields
//     if (
//       !taskData.task ||
//       !taskData.estimatedTime ||
//       !taskData.startTime ||
//       !taskData.endTime
//     ) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }
//     const selectedCustomerGroups = Object.keys(taskData.customer).filter(
//       (heading) => taskData.customer[heading].length > 0
//     );
//     if (selectedCustomerGroups.length === 0) {
//       setErrorMessage("Please select at least one customer and its sub-options.");
//       return;
//     }

//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       startTime: taskData.startTime
//         ? moment(taskData.startTime).format("h:mm A")
//         : null,
//       endTime: taskData.endTime
//         ? moment(taskData.endTime).format("h:mm A")
//         : null,
//       customer: Object.keys(taskData.customer)
//         .map((heading) => `${heading}: [${taskData.customer[heading].join(", ")}]`)
//         .join(" | "),
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
//       // Navigate to task list (adjust your route as necessary)
//       // navigate("/dashboard/report-history/taskList");
//       setErrorMessage("");
//       setTaskData({
//         date: new Date(),
//         customer: {},
//         task: "",
//         estimatedTime: "",
//         startTime: null,
//         endTime: null,
//         taskStatus: "",
//         reasonForIncomplete: "",
//         remarks: "",
//         employeeId: localStorage.getItem("employeeId"),
//         employeeName: localStorage.getItem("employeeName"),
//       });
//       setSelectedCustomer('');
//     } catch (error) {
//       setSuccessMessage("");
//       setErrorMessage(error.response?.data?.message || "Server error");
//     }
//   };

//   return (
//     <FormContainer>
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "10px" }}>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div style={{ color: "red", marginBottom: "10px" }}>
//           {errorMessage}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: "15px" }}>
//             <Label>
//               Date <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker"
//               placeholderText="Select Date"
//               minDate={minDate}
//               maxDate={maxDate}
//             />
//           </div>
//           <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
//             <Label>
//               Customer Name <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Select value={selectedCustomer} onChange={handleCustomerSelection}>
//               <option value="">Select a customer</option>
//               {customerGroups.map((group) => (
//                 <option key={group.heading} value={group.heading}>
//                   {group.heading}
//                 </option>
//               ))}
//             </Select>

//             {selectedCustomer && (
//               <div style={{ marginTop: '10px' }}>
//                 {customerGroups.find(group => group.heading === selectedCustomer)?.subOptions.map((subOption) => (
//                   <div key={subOption}>
//                     <label>
//                       <input 
//                         type="checkbox" 
//                         checked={taskData.customer[selectedCustomer]?.includes(subOption)} 
//                         onChange={() => handleSubOptionChange(subOption)} 
//                       />
//                       {subOption}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Task <span style={{ color: "red" }}>*</span></Label>
//           <textarea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             placeholder="Enter task description"
//             style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
//           />
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Estimated Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Start Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
//             <Label>
//               End Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//             />
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//             <Label>Task Status</Label>
//             <Select name="taskStatus" value={taskData.taskStatus} onChange={handleChange}>
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </div>
//           {(taskData.taskStatus === "Pending" || taskData.taskStatus === "In Progress") && (
//             <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//               <Label>Reason for Incomplete</Label>
//               <Input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Remarks</Label>
//           <TextArea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//           />
//         </div>

//         <SubmitButton type="submit">Add Task</SubmitButton>
//       </form>
//     </FormContainer>
//   );
// };

// export default AddTask;











// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import './style.css'; // Ensure your stylesheet is imported correctly

// // Styled Components for form container
// const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

// // Styled label and input styling
// const Label = styled.label`
//   font-weight: bold;
//   display: block;
//   margin-bottom: 5px;
// `;
// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;
// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;
// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// // Button styles
// const SubmitButton = styled.button`
//   display: block;
//   margin: 20px auto 0;
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// const AddTask = () => {
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: {}, // Object mapping customer heading to selected sub-options (array)
//     task: '',
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName')
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState('');

//   // Date restrictions
//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   // Sample Customer Groups with sub-options
//   const customerGroups = [
//     {
//       heading: "KST Infotech Pvt Ltd", // No sub-options
//       subOptions: []
//     },
//     {
//       heading: "Calcium",
//       subOptions: ["Power Bi", "Azure", "Web", "Mobile", "Core", "Studio"]
//     },
//     {
//       heading: "Sify",
//       subOptions: ["Colocation", "P2P", "DIA", "Cross Connect Domestic", "Login", "MPLS", "Colointernet", "GCC", "Channel Partner", "Docusign", "NSE", "Others"]
//     },
//     {
//       heading: "Brakes India",
//       subOptions: ["PMS", "Unit-1", "Unit-2", "Unit-11", "RWH", "KST"]
//     },
//     {
//       heading: "TNPC",
//       subOptions: ["Building Assest Mgt", "Equipment Assest Mgt", "Fleet", "Billing Software", "Quarters Management"]
//     },
//     {
//       heading: "CRPF",
//       subOptions: ["Billing Software", "Montessori School Website"]
//     },
//     {
//       heading: "Renault",
//       subOptions: ["VMS"]
//     },
//     {
//       heading: "RRD",
//       subOptions: ["CMS"]
//     },
//     {
//       heading: "Wheels India",
//       subOptions: ["CV Unit"]
//     },
//     {
//       heading: "Attendance",
//       subOptions: ["Mobile", "Web"]
//     },
//     {
//       heading: "ID Card Scanning", // No sub-options
//       subOptions: []
//     },
//     {
//       heading: "Scheduled Interview", // No sub-options
//       subOptions: []
//     },
//     {
//       heading: "Client Visit", // No sub-options
//       subOptions: []
//     },
//   ];

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

//   // Handle customer selection
//   const handleCustomerSelection = (e) => {
//     setSelectedCustomer(e.target.value);
//     setTaskData({
//       ...taskData,
//       customer: { ...taskData.customer, [e.target.value]: [] } // Initialize empty selected sub-options array
//     });
//   };

//   // Handle sub-option selection
//   const handleSubOptionChange = (subOption) => {
//     const { customer } = taskData;
//     const selectedSubOptions = customer[selectedCustomer] || [];

//     const newSelectedSubOptions = selectedSubOptions.includes(subOption)
//       ? selectedSubOptions.filter(option => option !== subOption)
//       : [...selectedSubOptions, subOption];

//     setTaskData({
//       ...taskData,
//       customer: {
//         ...customer,
//         [selectedCustomer]: newSelectedSubOptions
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Validate required fields
//     if (
//       !taskData.task ||
//       !taskData.estimatedTime ||
//       !taskData.startTime ||
//       !taskData.endTime
//     ) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }
//     const selectedCustomerGroups = Object.keys(taskData.customer).filter(
//       (heading) => taskData.customer[heading].length > 0
//     );
//     if (selectedCustomerGroups.length === 0) {
//       setErrorMessage("Please select at least one customer and its sub-options.");
//       return;
//     }

//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       startTime: taskData.startTime
//         ? moment(taskData.startTime).format("h:mm A")
//         : null,
//       endTime: taskData.endTime
//         ? moment(taskData.endTime).format("h:mm A")
//         : null,
//       customer: Object.keys(taskData.customer)
//         .map((heading) => `${heading}: [${taskData.customer[heading].join(", ")}]`)
//         .join(" | "),
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
//       // Navigate to task list (adjust your route as necessary)
//       // navigate("/dashboard/report-history/taskList");
//       setErrorMessage("");
//       setTaskData({
//         date: new Date(),
//         customer: {},
//         task: "",
//         estimatedTime: "",
//         startTime: null,
//         endTime: null,
//         taskStatus: "",
//         reasonForIncomplete: "",
//         remarks: "",
//         employeeId: localStorage.getItem('employeeId'),
//         employeeName: localStorage.getItem('employeeName'),
//       });
//       setSelectedCustomer('');
//     } catch (error) {
//       setSuccessMessage("");
//       setErrorMessage(error.response?.data?.message || "Server error");
//     }
//   };

//   return (
//     <FormContainer>
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "10px" }}>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div style={{ color: "red", marginBottom: "10px" }}>
//           {errorMessage}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: "15px" }}>
//             <Label>
//               Date <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker"
//               placeholderText="Select Date"
//               minDate={minDate}
//               maxDate={maxDate}
//             />
//           </div>
//           <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
//             <Label>
//               Customer Name <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Select value={selectedCustomer} onChange={handleCustomerSelection}>
//               <option value="">Select a customer</option>
//               {customerGroups.map((group) => (
//                 <option key={group.heading} value={group.heading}>
//                   {group.heading}
//                 </option>
//               ))}
//             </Select>

//             {selectedCustomer && (
//               <div style={{ marginTop: '10px' }}>
//                 {customerGroups.find(group => group.heading === selectedCustomer)?.subOptions.map((subOption) => (
//                   <div key={subOption}>
//                     <label>
//                       <input 
//                         type="checkbox" 
//                         checked={taskData.customer[selectedCustomer]?.includes(subOption)} 
//                         onChange={() => handleSubOptionChange(subOption)} 
//                       />
//                       {subOption}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Task <span style={{ color: "red" }}>*</span></Label>
//           <TextArea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             placeholder="Enter task description"
//             rows={3}
//           />
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Estimated Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Start Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
//             <Label>
//               End Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//             />
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//             <Label>Task Status</Label>
//             <Select name="taskStatus" value={taskData.taskStatus} onChange={handleChange}>
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </div>
//           {(taskData.taskStatus === "Pending" || taskData.taskStatus === "In Progress") && (
//             <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//               <Label>Reason for Incomplete</Label>
//               <Input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Remarks</Label>
//           <TextArea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//           />
//         </div>

//         <SubmitButton type="submit">Add Task</SubmitButton>
//       </form>
//     </FormContainer>
//   );
// };

// export default AddTask;









// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import './style.css'; // Ensure your stylesheet is imported correctly

// // Styled Components for form container
// const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

// // Styled label and input styling
// const Label = styled.label`
//   font-weight: bold;
//   display: block;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// // Button styles
// const SubmitButton = styled.button`
//   display: block;
//   margin: 20px auto 0;
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// // Styled container for customer checkboxes
// const CheckboxContainer = styled.div`
//   margin: 10px 0;
// `;

// const CheckboxLabel = styled.label`
//   margin-right: 15px;
//   display: flex;
//   align-items: center;
// `;

// const Checkbox = styled.input`
//   margin-right: 5px;
// `;

// const AddTask = () => {
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: {}, // Object mapping customer heading to selected sub-options (array)
//     task: '',
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName')
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState('');

//   // Date restrictions
//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   // Sample Customer Groups with sub-options
//   const customerGroups = [
//     {
//       heading: "KST Infotech Pvt Ltd", // No sub-options
//       subOptions: []
//     },
    // {
    //   heading: "Calcium",
    //   subOptions: ["Power Bi", "Azure", "Web", "Mobile", "Core", "Studio"]
    // },
    // {
    //   heading: "Sify",
    //   subOptions: ["Colocation", "P2P", "DIA", "Cross Connect Domestic", "Login", "MPLS", "Colointernet", "GCC", "Channel Partner", "Docusign", "NSE", "Others"]
    // },
    // {
    //   heading: "Brakes India",
    //   subOptions: ["PMS", "Unit-1", "Unit-2", "Unit-11", "RWH", "KST"]
    // },
    // {
    //   heading: "TNPC",
    //   subOptions: ["Building Asset Mgmt", "Equipment Asset Mgmt", "Fleet", "Billing Software", "Quarters Management"]
    // },
    // {
    //   heading: "CRPF",
    //   subOptions: ["Billing Software", "Montessori School Website"]
    // },
    // {
    //   heading: "Renault",
    //   subOptions: ["VMS"]
    // },
    // {
    //   heading: "RRD",
    //   subOptions: ["CMS"]
    // },
    // {
    //   heading: "Wheels India",
    //   subOptions: ["CV Unit"]
    // },
    // {
    //   heading: "Attendance",
    //   subOptions: ["Mobile", "Web"]
    // },
    // {
    //   heading: "ID Card Scanning", // No sub-options
    //   subOptions: []
    // },
    // {
    //   heading: "Scheduled Interview", // No sub-options
    //   subOptions: []
    // },
    // {
    //   heading: "Client Visit", // No sub-options
    //   subOptions: []
    // },
//   ];

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

//   // Handle customer selection
//   const handleCustomerSelection = (e) => {
//     setSelectedCustomer(e.target.value);
//     setTaskData({
//       ...taskData,
//       customer: { ...taskData.customer, [e.target.value]: [] } // Initialize empty selected sub-options array
//     });
//   };

//   // Handle sub-option selection
//   const handleSubOptionChange = (subOption) => {
//     const { customer } = taskData;
//     const selectedSubOptions = customer[selectedCustomer] || [];

//     const newSelectedSubOptions = selectedSubOptions.includes(subOption)
//       ? selectedSubOptions.filter(option => option !== subOption)
//       : [...selectedSubOptions, subOption];

//     setTaskData({
//       ...taskData,
//       customer: {
//         ...customer,
//         [selectedCustomer]: newSelectedSubOptions
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Validate required fields
//     if (
//       !taskData.task ||
//       !taskData.estimatedTime ||
//       !taskData.startTime ||
//       !taskData.endTime
//     ) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }
//     const selectedCustomerGroups = Object.keys(taskData.customer).filter(
//       (heading) => taskData.customer[heading].length > 0
//     );
//     if (selectedCustomerGroups.length === 0) {
//       setErrorMessage("Please select at least one customer and its sub-options.");
//       return;
//     }

//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       startTime: taskData.startTime
//         ? moment(taskData.startTime).format("h:mm A")
//         : null,
//       endTime: taskData.endTime
//         ? moment(taskData.endTime).format("h:mm A")
//         : null,
//       customer: Object.keys(taskData.customer)
//         .map((heading) => `${heading}: [${taskData.customer[heading].join(", ")}]`)
//         .join(" | "),
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
//       // Navigate to task list (adjust your route as necessary)
//       // navigate("/dashboard/report-history/taskList");
//       setErrorMessage("");
//       setTaskData({
//         date: new Date(),
//         customer: {},
//         task: "",
//         estimatedTime: "",
//         startTime: null,
//         endTime: null,
//         taskStatus: "",
//         reasonForIncomplete: "",
//         remarks: "",
//         employeeId: localStorage.getItem('employeeId'),
//         employeeName: localStorage.getItem('employeeName'),
//       });
//       setSelectedCustomer('');
//     } catch (error) {
//       setSuccessMessage("");
//       setErrorMessage(error.response?.data?.message || "Server error");
//     }
//   };

//   return (
//     <FormContainer>
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "10px" }}>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div style={{ color: "red", marginBottom: "10px" }}>
//           {errorMessage}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: "15px" }}>
//             <Label>
//               Date <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker"
//               placeholderText="Select Date"
//               minDate={minDate}
//               maxDate={maxDate}
//             />
//           </div>

//           <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
//             <Label>
//               Customer Name <span style={{ color: "red" }}>*</span>
//             </Label>

//             <CheckboxContainer>
//               {customerGroups.map(group => (
//                 <CheckboxLabel key={group.heading}>
//                   <Checkbox 
//                     type="checkbox" 
//                     value={group.heading} 
//                     onChange={handleCustomerSelection}
//                     checked={selectedCustomer === group.heading}
//                   />
//                   {group.heading}
//                 </CheckboxLabel>
//               ))}
//             </CheckboxContainer>

//             {selectedCustomer && (
//               <div style={{ marginTop: '10px' }}>
//                 <Label>Sub Options</Label>
//                 {customerGroups.find(group => group.heading === selectedCustomer)?.subOptions.map((subOption) => (
//                   <CheckboxLabel key={subOption}>
//                     <Checkbox 
//                       type="checkbox" 
//                       checked={taskData.customer[selectedCustomer]?.includes(subOption)} 
//                       onChange={() => handleSubOptionChange(subOption)} 
//                     />
//                     {subOption}
//                   </CheckboxLabel>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Task <span style={{ color: "red" }}>*</span></Label>
//           <TextArea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             placeholder="Enter task description"
//             rows={3}
//           />
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Estimated Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Start Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
//             <Label>
//               End Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//             />
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//             <Label>Task Status</Label>
//             <Select name="taskStatus" value={taskData.taskStatus} onChange={handleChange}>
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </div>
//           {(taskData.taskStatus === "Pending" || taskData.taskStatus === "In Progress") && (
//             <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//               <Label>Reason for Incomplete</Label>
//               <Input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Remarks</Label>
//           <TextArea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//           />
//         </div>

//         <SubmitButton type="submit">Add Task</SubmitButton>
//       </form>
//     </FormContainer>
//   );
// };

// export default AddTask;










// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import './style.css'; // Ensure your stylesheet is imported correctly

// // Styled Components for form container
// const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

// // Styled label and input styling
// const Label = styled.label`
//   font-weight: bold;
//   display: block;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// // Button styles
// const SubmitButton = styled.button`
//   display: block;
//   margin: 20px auto 0;
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// // Styled container for customer checkboxes
// const CheckboxContainer = styled.div`
//   margin: 10px 0;
// `;

// const CheckboxLabel = styled.label`
//   margin-right: 15px;
//   display: flex;
//   align-items: center;
// `;

// const Checkbox = styled.input`
//   margin-right: 5px;
// `;

// const AddTask = () => {
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: {}, // Object mapping customer heading to selected sub-options (array)
//     task: '',
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName'),
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Date restrictions
//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   // Sample Customer Groups with sub-options
//   const customerGroups = [
//     { heading: "KST Infotech Pvt Ltd", subOptions: [] },
//     {
//       heading: "Calcium",
//       subOptions: ["Power Bi", "Azure", "Web", "Mobile", "Core", "Studio"]
//     },
//     {
//       heading: "Sify",
//       subOptions: ["Colocation", "P2P", "DIA", "Cross Connect Domestic", "Login", "MPLS", "Colointernet", "GCC", "Channel Partner", "Docusign", "NSE", "Others"]
//     },
//     {
//       heading: "Brakes India",
//       subOptions: ["PMS", "Unit-1", "Unit-2", "Unit-11", "RWH", "KST"]
//     },
//     {
//       heading: "TNPC",
//       subOptions: ["Building Asset Mgmt", "Equipment Asset Mgmt", "Fleet", "Billing Software", "Quarters Management"]
//     },
//     {
//       heading: "CRPF",
//       subOptions: ["Billing Software", "Montessori School Website"]
//     },
//     {
//       heading: "Renault",
//       subOptions: ["VMS"]
//     },
//     {
//       heading: "RRD",
//       subOptions: ["CMS"]
//     },
//     {
//       heading: "Wheels India",
//       subOptions: ["CV Unit"]
//     },
//     {
//       heading: "Attendance",
//       subOptions: ["Mobile", "Web"]
//     },
//     {
//       heading: "ID Card Scanning", // No sub-options
//       subOptions: []
//     },
//     {
//       heading: "Scheduled Interview", // No sub-options
//       subOptions: []
//     },
//     {
//       heading: "Client Visit", // No sub-options
//       subOptions: []
//     }, 
//   ];

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

//   // Handle customer selection
//   const handleCustomerSelection = (heading, isChecked) => {
//     const { customer } = taskData;

//     if (isChecked) {
//       customer[heading] = [];
//     } else {
//       delete customer[heading];
//     }

//     setTaskData({ ...taskData, customer });
//   };

//   // Handle sub-option selection
//   const handleSubOptionChange = (heading, subOption) => {
//     const { customer } = taskData;
    
//     const selectedSubOptions = customer[heading] || [];
//     const newSelectedSubOptions = selectedSubOptions.includes(subOption)
//       ? selectedSubOptions.filter(option => option !== subOption)
//       : [...selectedSubOptions, subOption];

//     setTaskData({
//       ...taskData,
//       customer: {
//         ...customer,
//         [heading]: newSelectedSubOptions
//       }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Validate required fields
//     if (
//       !taskData.task ||
//       !taskData.estimatedTime ||
//       !taskData.startTime ||
//       !taskData.endTime
//     ) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }

//     const selectedCustomerGroups = Object.keys(taskData.customer);
//     if (selectedCustomerGroups.length === 0) {
//       setErrorMessage("Please select at least one customer and its sub-options.");
//       return;
//     }

//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       startTime: taskData.startTime
//         ? moment(taskData.startTime).format("h:mm A")
//         : null,
//       endTime: taskData.endTime
//         ? moment(taskData.endTime).format("h:mm A")
//         : null,
//       customer: selectedCustomerGroups
//         .map((heading) => `${heading}: [${taskData.customer[heading].join(", ")}]`)
//         .join(" | "),
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
//       setSuccessMessage("Task created successfully.");
//       alert("Task added successfully!");
//       // Navigate to task list (adjust your route as necessary)
//       // navigate("/dashboard/report-history/taskList");
//       setErrorMessage("");
//       setTaskData({
//         date: new Date(),
//         customer: {},
//         task: '',
//         estimatedTime: '',
//         startTime: null,
//         endTime: null,
//         taskStatus: '',
//         reasonForIncomplete: '',
//         remarks: '',
//       });
//     } catch (error) {
//       setSuccessMessage("");
//       setErrorMessage(error.response?.data?.message || "Server error");
//     }
//   };

//   return (
//     <FormContainer>
//       {successMessage && (
//         <div style={{ color: "green", marginBottom: "10px" }}>
//           {successMessage}
//         </div>
//       )}
//       {errorMessage && (
//         <div style={{ color: "red", marginBottom: "10px" }}>
//           {errorMessage}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: "15px" }}>
//             <Label>
//               Date <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker"
//               placeholderText="Select Date"
//               minDate={minDate}
//               maxDate={maxDate}
//             />
//           </div>

//           <div style={{ marginBottom: "15px", marginLeft: "290px" }}>
//             <Label>
//               Customer Name <span style={{ color: "red" }}>*</span>
//             </Label>
//             <CheckboxContainer>
//               {customerGroups.map(group => (
//                 <CheckboxLabel key={group.heading}>
//                   <Checkbox 
//                     type="checkbox"
//                     onChange={(e) => handleCustomerSelection(group.heading, e.target.checked)}
//                   />
//                   {group.heading}
//                 </CheckboxLabel>
//               ))}
//             </CheckboxContainer>

//             {Object.keys(taskData.customer).map(heading => (
//               <div key={heading} style={{ marginTop: '10px' }}>
//                 <Label>{heading} Sub Options</Label>
//                 {customerGroups.find(group => group.heading === heading)?.subOptions.map((subOption) => (
//                   <CheckboxLabel key={subOption}>
//                     <Checkbox 
//                       type="checkbox" 
//                       checked={taskData.customer[heading]?.includes(subOption)} 
//                       onChange={() => handleSubOptionChange(heading, subOption)} 
//                     />
//                     {subOption}
//                   </CheckboxLabel>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Task <span style={{ color: "red" }}>*</span></Label>
//           <TextArea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             placeholder="Enter task description"
//             rows={3}
//           />
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Estimated Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <Input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginRight: "10px", marginBottom: "15px" }}>
//             <Label>
//               Start Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//             />
//           </div>
//           <div style={{ flex: "0 0 32%", marginBottom: "15px" }}>
//             <Label>
//               End Time <span style={{ color: "red" }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//             />
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
//           <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//             <Label>Task Status</Label>
//             <Select name="taskStatus" value={taskData.taskStatus} onChange={handleChange}>
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </div>
//           {(taskData.taskStatus === "Pending" || taskData.taskStatus === "In Progress") && (
//             <div style={{ flex: "0 0 48%", marginBottom: "15px" }}>
//               <Label>Reason for Incomplete</Label>
//               <Input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <Label>Remarks</Label>
//           <TextArea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//           />
//         </div>

//         <SubmitButton type="submit">Add Task</SubmitButton>
//       </form>
//     </FormContainer>
//   );
// };

// export default AddTask;






// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import './style.css'; // Ensure your stylesheet is imported correctly

// // Styled Components for form container
// const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

// // Styled label and input styling
// const Label = styled.label`
//   font-weight: bold;
//   display: block;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const SubmitButton = styled.button`
//   display: block;
//   margin: 20px auto 0;
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// // Styled container for customer selection with scrollable list
// const CustomerSelectContainer = styled.div`
//   max-height: 250px;
//   overflow-y: auto;
//   border: 1px solid #ccc;
//   padding: 10px;
//   border-radius: 8px;
//   background-color: #fff;
//   margin-top: 5px;
//   min-width:480px;
// `;

// const CustomerGroupContainer = styled.div`
//   margin-bottom: 15px;
// `;

// const CheckboxLabel = styled.label`
//   display: flex;
//   align-items: center;
//   margin-bottom: 5px;
// `;

// const Checkbox = styled.input`
//   margin-right: 5px;
// `;

// // Main AddTask Component
// const AddTask = () => {
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: {}, // Object mapping customer heading to selected sub-options (array)
//     task: '',
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName'),
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Date restrictions
//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   // Sample Customer Groups with sub-options.
//   // For "KST Infotech Pvt Ltd", we set subOptions to null so that it will be stored as heading alone.
//   const customerGroups = [
//     { heading: "KST Infotech Pvt Ltd", subOptions: null },
//     {
//       heading: "Calcium",
//       subOptions: ["Power Bi", "Azure", "Web", "Mobile", "Core", "Studio"]
//     },
//     {
//       heading: "Sify",
//       subOptions: ["Colocation", "P2P", "DIA", "Cross Connect Domestic", "Login", "MPLS", "Colointernet", "GCC", "Channel Partner", "Docusign", "NSE", "Others"]
//     },
//     {
//       heading: "Brakes India",
//       subOptions: ["PMS", "Unit-1", "Unit-2", "Unit-11", "RWH", "KST"]
//     },
//     {
//       heading: "TNPC",
//       subOptions: ["Building Asset Mgmt", "Equipment Asset Mgmt", "Fleet", "Billing Software", "Quarters Management"]
//     },
//     {
//       heading: "CRPF",
//       subOptions: ["Billing Software", "Montessori School Website"]
//     },
//     {
//       heading: "Renault",
//       subOptions: ["VMS"]
//     },
//     {
//       heading: "RRD",
//       subOptions: ["CMS"]
//     },
//     {
//       heading: "Wheels India",
//       subOptions: ["CV Unit"]
//     },
//     {
//       heading: "Attendance",
//       subOptions: ["Mobile", "Web"]
//     },
//     {
//       heading: "ID Card Scanning",
//       subOptions: null,
//     },
//     {
//       heading: "Scheduled Interview",
//       subOptions: null,
//     },
//     {
//       heading: "Client Visit",
//       subOptions: null,
//     }, 
//   ];

//   // Generic change handler
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

//   // Handle customer selection
//   // If a heading is checked, we add it to the customer object (if sub-options exist, initialize as empty array)
//   // If not, remove it.
//   const handleCustomerSelection = (heading, isChecked) => {
//     const updatedCustomer = { ...taskData.customer };
//     if (isChecked) {
//       // Only set as an array if subOptions exist; if null, store the heading as true.
//       updatedCustomer[heading] = customerGroups.find(g => g.heading === heading).subOptions ? [] : true;
//     } else {
//       delete updatedCustomer[heading];
//     }
//     setTaskData({ ...taskData, customer: updatedCustomer });
//   };

//   // Handle sub-option selection for a customer group
//   const handleSubOptionChange = (heading, subOption, isChecked) => {
//     const updatedCustomer = { ...taskData.customer };
//     const currentSelections = updatedCustomer[heading] || [];
//     if (isChecked) {
//       // Add the subOption if not already present
//       if (!currentSelections.includes(subOption)) {
//         updatedCustomer[heading] = [...currentSelections, subOption];
//       }
//     } else {
//       // Remove the subOption
//       updatedCustomer[heading] = currentSelections.filter(option => option !== subOption);
//     }
//     setTaskData({ ...taskData, customer: updatedCustomer });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !taskData.task ||
//       !taskData.estimatedTime ||
//       !taskData.startTime ||
//       !taskData.endTime
//     ) {
//       setErrorMessage("Please fill in all required fields.");
//       return;
//     }

//     // Validate that at least one customer is selected.
//     if (Object.keys(taskData.customer).length === 0) {
//       setErrorMessage("Please select at least one customer.");
//       return;
//     }

//     // Prepare customer data for submission.
//     // For groups without sub-options (stored as true), we simply use the heading.
//     // For others, we list the heading and the selected sub-options.
//     const formattedCustomers = Object.keys(taskData.customer)
//       .map((heading) => {
//         const value = taskData.customer[heading];
//         return (value === true) ? heading : `${heading}: [${value.join(", ")}]`;
//       })
//       .join(" | ");

//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       startTime: taskData.startTime ? moment(taskData.startTime).format("h:mm A") : null,
//       endTime: taskData.endTime ? moment(taskData.endTime).format("h:mm A") : null,
//       customer: formattedCustomers,
//     };

//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setSuccessMessage('Task created successfully.');
//       alert('Task added successfully!');
//       // navigate("/dashboard/report-history/taskList"); // Uncomment if navigation is needed
//       setErrorMessage('');
//       setTaskData({
//         date: new Date(),
//         customer: {},
//         task: '',
//         estimatedTime: '',
//         startTime: null,
//         endTime: null,
//         taskStatus: '',
//         reasonForIncomplete: '',
//         remarks: '',
//         employeeId: localStorage.getItem('employeeId'),
//         employeeName: localStorage.getItem('employeeName'),
//       });
//     } catch (error) {
//       setSuccessMessage('');
//       setErrorMessage(error.response?.data?.message || 'Server error');
//     }
//   };

//   return (
//     <FormContainer>
//       {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
//       {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: '15px' }}>
//             <Label>
//               Date <span style={{ color: 'red' }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker"
//               placeholderText="Select Date"
//               minDate={minDate}
//               maxDate={maxDate}
//             />
//           </div>
//           <div style={{ marginBottom: '15px', marginLeft: "290px" }}>
//             <Label>
//               Customer Name <span style={{ color: 'red' }}>*</span>
//             </Label>
//             <CustomerSelectContainer>
//               {customerGroups.map(group => (
//                 <div key={group.heading}>
//                   <CheckboxLabel>
//                     <Checkbox 
//                       type="checkbox" 
//                       onChange={(e) => handleCustomerSelection(group.heading, e.target.checked)} 
//                       checked={taskData.customer[group.heading] !== undefined}
//                     />
//                     {group.heading}
//                   </CheckboxLabel>
//                   {/* Render sub-options only if subOptions exist and the group is selected */}
//                   {group.subOptions && taskData.customer[group.heading] !== undefined && (
//                     <div style={{ marginLeft: '20px' }}>
//                       {group.subOptions.map((subOption) => (
//                         <CheckboxLabel key={subOption}>
//                           <Checkbox 
//                             type="checkbox" 
//                             onChange={(e) => handleSubOptionChange(group.heading, subOption, e.target.checked)}
//                             checked={taskData.customer[group.heading].includes(subOption)}
//                           />
//                           {subOption}
//                         </CheckboxLabel>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </CustomerSelectContainer>
//           </div>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <Label>Task <span style={{ color: 'red' }}>*</span></Label>
//           <TextArea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             placeholder="Enter task description"
//             rows={3}
//           />
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <Label>Estimated Time <span style={{ color: 'red' }}>*</span></Label>
//             <Input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//             />
//           </div>
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <Label>Start Time <span style={{ color: 'red' }}>*</span></Label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//             />
//           </div>
//           <div style={{ flex: '0 0 32%', marginBottom: '15px' }}>
//             <Label>End Time <span style={{ color: 'red' }}>*</span></Label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//             />
//           </div>
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//             <Label>Task Status</Label>
//             <Select name="taskStatus" value={taskData.taskStatus} onChange={handleChange}>
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </div>
//           {(taskData.taskStatus === 'Pending' || taskData.taskStatus === 'In Progress') && (
//             <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//               <Label>Reason for Incomplete</Label>
//               <Input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <Label>Remarks</Label>
//           <TextArea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//           />
//         </div>

//         <SubmitButton type="submit">Add Task</SubmitButton>
//       </form>
//     </FormContainer>
//   );
// };

// export default AddTask;















// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import './style.css'; // Ensure your stylesheet is imported correctly

// // Styled Components for form container
// const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

// // Styled label and input styling
// const Label = styled.label`
//   font-weight: bold;
//   display: block;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const SubmitButton = styled.button`
//   display: block;
//   margin: 20px auto 0;
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// // Styled container for customer selection with scrollable list
// const CustomerSelectContainer = styled.div`
//   max-height: 250px;
//   overflow-y: auto;
//   border: 1px solid #ccc;
//   padding: 10px;
//   border-radius: 8px;
//   background-color: #fff;
//   margin-top: 5px;
// `;

// const CustomerGroupContainer = styled.div`
//   margin-bottom: 15px;
// `;

// const CheckboxLabel = styled.label`
//   display: flex;
//   align-items: center;
//   margin-bottom: 5px;
// `;

// const Checkbox = styled.input`
//   margin-right: 5px;
// `;

// // Main AddTask Component
// const AddTask = () => {
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: {}, // Object mapping customer heading to selected sub-options (array)
//     tasks: [], // Array to hold tasks for each customer selection
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName'),
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   const customerGroups = [
//     { heading: "KST Infotech Pvt Ltd", subOptions: null },
//     {
//       heading: "Calcium",
//       subOptions: ["Power Bi", "Azure", "Web", "Mobile", "Core", "Studio"]
//     },
//     {
//       heading: "Sify",
//       subOptions: ["Colocation", "P2P", "DIA", "Cross Connect Domestic", "Login", "MPLS", "Colointernet", "GCC", "Channel Partner", "Docusign", "NSE", "Others"]
//     },
//     {
//       heading: "Brakes India",
//       subOptions: ["PMS", "Unit-1", "Unit-2", "Unit-11", "RWH", "KST"]
//     },
//     {
//       heading: "TNPC",
//       subOptions: ["Building Asset Mgmt", "Equipment Asset Mgmt", "Fleet", "Billing Software", "Quarters Management"]
//     },
//     {
//       heading: "CRPF",
//       subOptions: ["Billing Software", "Montessori School Website"]
//     },
//     {
//       heading: "Renault",
//       subOptions: ["VMS"]
//     },
//     {
//       heading: "RRD",
//       subOptions: ["CMS"]
//     },
//     {
//       heading: "Wheels India",
//       subOptions: ["CV Unit"]
//     },
//     {
//       heading: "Attendance",
//       subOptions: ["Mobile", "Web"]
//     },
//     {
//       heading: "ID Card Scanning",
//       subOptions: null,
//     },
//     {
//       heading: "Scheduled Interview",
//       subOptions: null,
//     },
//     {
//       heading: "Client Visit",
//       subOptions: null,
//     },
//   ];

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

//   const handleCustomerSelection = (heading, isChecked) => {
//     const updatedCustomer = { ...taskData.customer };
//     if (isChecked) {
//       updatedCustomer[heading] = customerGroups.find(g => g.heading === heading).subOptions ? [] : true;
//     } else {
//       delete updatedCustomer[heading];
//       // Remove tasks associated with this customer if unchecked
//       setTaskData({
//         ...taskData,
//         tasks: taskData.tasks.filter(task => task.customerHeading !== heading),
//         customer: updatedCustomer
//       });
//       return; // Exit if unchecked
//     }
//     setTaskData({ ...taskData, customer: updatedCustomer });
//   };

//   const handleSubOptionChange = (heading, subOption, isChecked) => {
//     const updatedCustomer = { ...taskData.customer };
//     const currentSelections = updatedCustomer[heading] || [];
    
//     if (isChecked) {
//       if (!currentSelections.includes(subOption)) {
//         updatedCustomer[heading] = [...currentSelections, subOption];
//       }
//     } else {
//       updatedCustomer[heading] = currentSelections.filter(option => option !== subOption);
//     }

//     setTaskData({ ...taskData, customer: updatedCustomer });

//     // Update the tasks when the selection changes
//     const updatedTasks = [...taskData.tasks];
//     if (isChecked) {
//       // Add a new task entry for this selection
//       const taskId = `${heading}-${subOption}`;
//       const existingTaskIndex = updatedTasks.findIndex(t => t.id === taskId);
//       if (existingTaskIndex === -1) {
//         updatedTasks.push({ id: taskId, customerHeading: heading, subOption, task: '', estimatedTime: '', startTime: null, endTime: null });
//       }
//     } else {
//       // Remove task entry if all options for a heading are unchecked
//       const existingTaskIndex = updatedTasks.findIndex(t => t.customerHeading === heading && t.subOption === subOption);
//       if (existingTaskIndex > -1) {
//         updatedTasks.splice(existingTaskIndex, 1);
//       }
//     }
//     setTaskData({ ...taskData, tasks: updatedTasks });
//   };

//   const handleTaskChange = (taskId, key, value) => {
//     const updatedTasks = taskData.tasks.map(task => 
//       task.id === taskId ? { ...task, [key]: value } : task
//     );
//     setTaskData({ ...taskData, tasks: updatedTasks });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate that the form is filled out
//     if (taskData.tasks.length === 0) {
//       setErrorMessage("Please create at least one task.");
//       return;
//     }

//     const formattedCustomers = taskData.tasks.map(task => `${task.customerHeading} - ${task.subOption}: [${task.task}]`).join(" | ");
//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       customer: formattedCustomers,
//     };

//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setSuccessMessage('Tasks created successfully.');
//       alert('Tasks added successfully!');
//       setErrorMessage('');
//       setTaskData({
//         date: new Date(),
//         customer: {},
//         tasks: [],
//         estimatedTime: '',
//         startTime: null,
//         endTime: null,
//         taskStatus: '',
//         reasonForIncomplete: '',
//         remarks: '',
//         employeeId: localStorage.getItem('employeeId'),
//         employeeName: localStorage.getItem('employeeName'),
//       });
//     } catch (error) {
//       setSuccessMessage('');
//       setErrorMessage(error.response?.data?.message || 'Server error');
//     }
//   };

//   return (
//     <FormContainer>
//       {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
//       {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: '15px' }}>
//             <Label>
//               Date <span style={{ color: 'red' }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker"
//               placeholderText="Select Date"
//               minDate={minDate}
//               maxDate={maxDate}
//             />
//           </div>
//           <div style={{ marginBottom: '15px', marginLeft: "290px" }}>
//             <Label>
//               Customer Name <span style={{ color: 'red' }}>*</span>
//             </Label>
//             <CustomerSelectContainer>
//               {customerGroups.map(group => (
//                 <div key={group.heading}>
//                   <CheckboxLabel>
//                     <Checkbox 
//                       type="checkbox" 
//                       onChange={(e) => handleCustomerSelection(group.heading, e.target.checked)} 
//                       checked={taskData.customer[group.heading] !== undefined}
//                     />
//                     {group.heading}
//                   </CheckboxLabel>
//                   {group.subOptions && taskData.customer[group.heading] !== undefined && (
//                     <div style={{ marginLeft: '20px' }}>
//                       {group.subOptions.map((subOption) => (
//                         <CheckboxLabel key={subOption}>
//                           <Checkbox 
//                             type="checkbox" 
//                             onChange={(e) => handleSubOptionChange(group.heading, subOption, e.target.checked)}
//                             checked={taskData.customer[group.heading].includes(subOption)}
//                           />
//                           {subOption}
//                         </CheckboxLabel>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </CustomerSelectContainer>
//           </div>
//         </div>

//         {taskData.tasks.map((task) => (
//           <div key={task.id} style={{ marginBottom: '15px' }}>
//             <Label>{`${task.customerHeading} - ${task.subOption}`} <span style={{ color: 'red' }}>*</span></Label>
//             <TextArea
//               name="task"
//               value={task.task}
//               onChange={(e) => handleTaskChange(task.id, 'task', e.target.value)}
//               placeholder="Enter task description"
//               rows={3}
//             />
//           </div>
//         ))}

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <Label>Estimated Time <span style={{ color: 'red' }}>*</span></Label>
//             <Input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//             />
//           </div>
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <Label>Start Time <span style={{ color: 'red' }}>*</span></Label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//             />
//           </div>
//           <div style={{ flex: '0 0 32%', marginBottom: '15px' }}>
//             <Label>End Time <span style={{ color: 'red' }}>*</span></Label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//             />
//           </div>
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//             <Label>Task Status</Label>
//             <Select name="taskStatus" value={taskData.taskStatus} onChange={handleChange}>
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </div>
//           {(taskData.taskStatus === 'Pending' || taskData.taskStatus === 'In Progress') && (
//             <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//               <Label>Reason for Incomplete</Label>
//               <Input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <Label>Remarks</Label>
//           <TextArea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//           />
//         </div>

//         <SubmitButton type="submit">Add Task</SubmitButton>
//       </form>
//     </FormContainer>
//   );
// };

// export default AddTask;







// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import './style.css'; // Ensure your stylesheet is imported correctly

// // Styled Components for form container
// const FormContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f8f9fa;
//   border-radius: 8px;
// `;

// // Styled label and input styling
// const Label = styled.label`
//   font-weight: bold;
//   display: block;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 8px;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const SubmitButton = styled.button`
//   display: block;
//   margin: 20px auto 0;
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
// `;

// // Styled container for customer selection with scrollable list
// const CustomerSelectContainer = styled.div`
//   max-height: 250px;
//   overflow-y: auto;
//   border: 1px solid #ccc;
//   padding: 10px;
//   border-radius: 8px;
//   background-color: #fff;
//   margin-top: 5px;
// `;

// const CheckboxLabel = styled.label`
//   display: flex;
//   align-items: center;
//   margin-bottom: 5px;
// `;

// const Checkbox = styled.input`
//   margin-right: 5px;
// `;

// // Main AddTask Component
// const AddTask = () => {
//   const navigate = useNavigate();
//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: {}, // Object mapping customer heading to selected sub-options (array)
//     tasks: [], // Array to hold tasks for each customer selection
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName'),
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const today = moment().startOf('day').toDate();
//   const minDate = moment(today).subtract(1, 'day').toDate();
//   const maxDate = moment(today).add(1, 'day').toDate();

//   const customerGroups = [
  //   { heading: "KST Infotech Pvt Ltd", subOptions: null },
  //   {
  //     heading: "Calcium",
  //     subOptions: ["Power Bi", "Azure", "Web", "Mobile", "Core", "Studio"]
  //   },
  //   {
  //     heading: "Sify",
  //     subOptions: ["Colocation", "P2P", "DIA", "Cross Connect Domestic", "Login", "MPLS", "Colointernet", "GCC", "Channel Partner", "Docusign", "NSE", "Others"]
  //   },
  //   {
  //     heading: "Brakes India",
  //     subOptions: ["PMS", "Unit-1", "Unit-2", "Unit-11", "RWH", "KST"]
  //   },
  //   {
  //     heading: "TNPC",
  //     subOptions: ["Building Asset Mgmt", "Equipment Asset Mgmt", "Fleet", "Billing Software", "Quarters Management"]
  //   },
  //   {
  //     heading: "CRPF",
  //     subOptions: ["Billing Software", "Montessori School Website"]
  //   },
  //   {
  //     heading: "Renault",
  //     subOptions: ["VMS"]
  //   },
  //   {
  //     heading: "RRD",
  //     subOptions: ["CMS"]
  //   },
  //   {
  //     heading: "Wheels India",
  //     subOptions: ["CV Unit"]
  //   },
  //   {
  //     heading: "Attendance",
  //     subOptions: ["Mobile", "Web"]
  //   },
  //   {
  //     heading: "ID Card Scanning",
  //     subOptions: null,
  //   },
  //   {
  //     heading: "Scheduled Interview",
  //     subOptions: null,
  //   },
  //   {
  //     heading: "Client Visit",
  //     subOptions: null,
  //   },
  // ];

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

//   const handleCustomerSelection = (heading, isChecked) => {
//     const updatedCustomer = { ...taskData.customer };
//     if (isChecked) {
//       updatedCustomer[heading] = customerGroups.find(g => g.heading === heading).subOptions ? [] : true;
//     } else {
//       delete updatedCustomer[heading];
//       // Remove tasks associated with this customer if unchecked
//       setTaskData({
//         ...taskData,
//         tasks: taskData.tasks.filter(task => task.customerHeading !== heading),
//         customer: updatedCustomer
//       });
//       return; // Exit if unchecked
//     }
//     setTaskData({ ...taskData, customer: updatedCustomer });
//   };

//   const handleSubOptionChange = (heading, subOption, isChecked) => {
//     const updatedCustomer = { ...taskData.customer };
//     const currentSelections = updatedCustomer[heading] || [];

//     if (isChecked) {
//       if (!currentSelections.includes(subOption)) {
//         updatedCustomer[heading] = [...currentSelections, subOption];
//       }
//     } else {
//       updatedCustomer[heading] = currentSelections.filter(option => option !== subOption);
//     }

//     setTaskData({ ...taskData, customer: updatedCustomer });

//     // Update the tasks when the selection changes
//     const updatedTasks = [...taskData.tasks];
//     if (isChecked) {
//       // Add a new task entry for this selection
//       const taskId = `${heading}-${subOption}`;
//       const existingTaskIndex = updatedTasks.findIndex(t => t.id === taskId);
//       if (existingTaskIndex === -1) {
//         updatedTasks.push({ id: taskId, customerHeading: heading, subOption, task: '', estimatedTime: '', startTime: null, endTime: null });
//       }
//     } else {
//       // Remove task entry if all options for a heading are unchecked
//       const existingTaskIndex = updatedTasks.findIndex(t => t.customerHeading === heading && t.subOption === subOption);
//       if (existingTaskIndex > -1) {
//         updatedTasks.splice(existingTaskIndex, 1);
//       }
//     }
//     setTaskData({ ...taskData, tasks: updatedTasks });
//   };

//   const handleTaskChange = (taskId, key, value) => {
//     const updatedTasks = taskData.tasks.map(task => 
//       task.id === taskId ? { ...task, [key]: value } : task
//     );
//     setTaskData({ ...taskData, tasks: updatedTasks });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate that the form is filled out
//     if (taskData.tasks.length === 0) {
//       setErrorMessage("Please create at least one task.");
//       return;
//     }

//     const formattedCustomers = taskData.tasks.map(task => `${task.customerHeading} - ${task.subOption}: [${task.task}]`).join(" | ");
//     const formattedTaskData = {
//       ...taskData,
//       date: moment(taskData.date).format("YYYY-MM-DD"),
//       customer: formattedCustomers,
//     };

//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setSuccessMessage('Tasks created successfully.');
//       alert('Tasks added successfully!');
//       setErrorMessage('');
//       setTaskData({
//         date: new Date(),
//         customer: {},
//         tasks: [],
//         estimatedTime: '',
//         startTime: null,
//         endTime: null,
//         taskStatus: '',
//         reasonForIncomplete: '',
//         remarks: '',
//         employeeId: localStorage.getItem('employeeId'),
//         employeeName: localStorage.getItem('employeeName'),
//       });
//     } catch (error) {
//       setSuccessMessage('');
//       setErrorMessage(error.response?.data?.message || 'Server error');
//     }
//   };

//   return (
//     <FormContainer>
//       {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
//       {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="flex">
//           <div style={{ marginBottom: '15px' }}>
//             <Label>
//               Date <span style={{ color: 'red' }}>*</span>
//             </Label>
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker"
//               placeholderText="Select Date"
//               minDate={minDate}
//               maxDate={maxDate}
//             />
//           </div>
//           <div style={{ marginBottom: '15px', marginLeft: "290px" }}>
//             <Label>
//               Customer Name <span style={{ color: 'red' }}>*</span>
//             </Label>
//             <CustomerSelectContainer>
//               {customerGroups.map(group => (
//                 <div key={group.heading}>
//                   <CheckboxLabel>
//                     <Checkbox 
//                       type="checkbox" 
//                       onChange={(e) => handleCustomerSelection(group.heading, e.target.checked)} 
//                       checked={taskData.customer[group.heading] !== undefined}
//                     />
//                     {group.heading}
//                   </CheckboxLabel>
//                   {group.subOptions && taskData.customer[group.heading] !== undefined && (
//                     <div style={{ marginLeft: '20px' }}>
//                       {group.subOptions.map((subOption) => (
//                         <CheckboxLabel key={subOption}>
//                           <Checkbox 
//                             type="checkbox" 
//                             onChange={(e) => handleSubOptionChange(group.heading, subOption, e.target.checked)}
//                             checked={taskData.customer[group.heading].includes(subOption)}
//                           />
//                           {subOption}
//                         </CheckboxLabel>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </CustomerSelectContainer>
//           </div>
//         </div>

//         {taskData.tasks.map((task) => (
//           <div key={task.id} style={{ marginBottom: '15px' }}>
//             <Label>{`${task.customerHeading} - ${task.subOption}`} <span style={{ color: 'red' }}>*</span></Label>
//             <TextArea
//               name="task"
//               value={task.task}
//               onChange={(e) => handleTaskChange(task.id, 'task', e.target.value)}
//               placeholder="Enter task description"
//               rows={3}
//             />
//           </div>
//         ))}

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <Label>Estimated Time <span style={{ color: 'red' }}>*</span></Label>
//             <Input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//             />
//           </div>
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <Label>Start Time <span style={{ color: 'red' }}>*</span></Label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//             />
//           </div>
//           <div style={{ flex: '0 0 32%', marginBottom: '15px' }}>
//             <Label>End Time <span style={{ color: 'red' }}>*</span></Label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//             />
//           </div>
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//             <Label>Task Status</Label>
//             <Select name="taskStatus" value={taskData.taskStatus} onChange={handleChange}>
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </Select>
//           </div>
//           {(taskData.taskStatus === 'Pending' || taskData.taskStatus === 'In Progress') && (
//             <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//               <Label>Reason for Incomplete</Label>
//               <Input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <Label>Remarks</Label>
//           <TextArea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//           />
//         </div>

//         <SubmitButton type="submit">Add Task</SubmitButton>
//       </form>
//     </FormContainer>
//   );
// };

// export default AddTask;








// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import './style.css'; // Ensure your stylesheet is imported correctly
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// const AddTask = () => {
//   const navigate = useNavigate();

//   const [taskData, setTaskData] = useState({
//     date: new Date(),
//     customer: '',
//     task: '',
//     estimatedTime: '',
//     startTime: null,
//     endTime: null,
//     taskStatus: '',
//     reasonForIncomplete: '',
//     remarks: '',
//     employeeId: localStorage.getItem('employeeId'),
//     employeeName: localStorage.getItem('employeeName')
//   });

//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Today's date and yesterday's date
//   const today = moment().startOf('day').toDate();
//   const yesterday = moment(today).subtract(1, 'day').toDate();

//   const handleChange = (e) => {
//     setTaskData({
//       ...taskData,
//       [e.target.name]: e.target.value
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
//       date: moment(taskData.date).format('YYYY-MM-DD'),
//       startTime: taskData.startTime ? moment(taskData.startTime).format('h:mm A') : null,
//       endTime: taskData.endTime ? moment(taskData.endTime).format('h:mm A') : null
//     };

//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/api/createtask`, formattedTaskData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setSuccessMessage('Task created successfully');
//       alert('Task added successfully!');
//       navigate("/dashboard/report-history/taskList");

//       setErrorMessage('');
//       setTaskData({
//         date: new Date(),
//         customer: '',
//         task: '',
//         estimatedTime: '',
//         startTime: null,
//         endTime: null,
//         taskStatus: '',
//         reasonForIncomplete: '',
//         remarks: '',
//         employeeId: localStorage.getItem('employeeId'),
//         employeeName: localStorage.getItem('employeeName')
//       });
//     } catch (error) {
//       setSuccessMessage('');
//       setErrorMessage(error.response?.data?.message || 'Server error');
//     }
//   };

//   return (
//     <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//       {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
//       {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className='flex'>
//           <div style={{ marginBottom: '15px', position: 'relative' }}>
//             <label>Date</label>
//             <FontAwesomeIcon icon={faCalendarAlt} style={{ position: 'absolute', left: '10px', top: '30%', color: '#888' }} />
//             <DatePicker
//               selected={taskData.date}
//               onChange={handleDateChange}
//               dateFormat="yyyy-MM-dd"
//               className="custom-datepicker" // Use your custom class here
//               placeholderText="Select Date"
//               minDate={yesterday} // Allow selection from yesterday
//               maxDate={today} // Allow today as the maximum date
//               filterDate={(date) => date <= today} // Only allow past dates (up to today)
//               style={{ paddingLeft: '30px', width: '100%' }} // Adjust padding to accommodate the icon
//             />
//           </div>
//           <div style={{ marginBottom: '15px', marginLeft: "290px" }}>
//             <label>Customer</label>
//             <input
//               type="text"
//               name="customer"
//               value={taskData.customer}
//               onChange={handleChange}
//               placeholder="Enter customer name"
//               style={{ width: '450px', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//             />
//           </div>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Task</label>
//           <textarea
//             name="task"
//             value={taskData.task}
//             onChange={handleChange}
//             placeholder="Enter task description"
//             style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//           />
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <label>Estimated Time</label>
//             <input
//               type="text"
//               name="estimatedTime"
//               value={taskData.estimatedTime}
//               onChange={handleChange}
//               placeholder="Enter estimated time"
//               style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//             />
//           </div>
          
//           {/* Start Time Picker */}
//           <div style={{ flex: '0 0 32%', marginRight: '10px', marginBottom: '15px' }}>
//             <label>Start Time</label>
//             <DatePicker
//               selected={taskData.startTime}
//               onChange={handleStartTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select Start Time"
//               style={{ width: '100%' }} // Adjust width
//             />
//           </div>
          
//           {/* End Time Picker */}
//           <div style={{ flex: '0 0 32%', marginBottom: '15px' }}>
//             <label>End Time</label>
//             <DatePicker
//               selected={taskData.endTime}
//               onChange={handleEndTimeChange}
//               showTimeSelect
//               showTimeSelectOnly
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="h:mm aa"
//               className="custom-datepicker"
//               placeholderText="Select End Time"
//               style={{ width: '100%' }} // Adjust width
//             />
//           </div>
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//             <label>Task Status</label>
//             <select
//               name="taskStatus"
//               value={taskData.taskStatus}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//             >
//               <option value="">Select Status</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>

//           {(taskData.taskStatus === 'Pending' || taskData.taskStatus === 'In Progress') && (
//             <div style={{ flex: '0 0 48%', marginBottom: '15px' }}>
//               <label>Reason for Incomplete</label>
//               <input
//                 type="text"
//                 name="reasonForIncomplete"
//                 value={taskData.reasonForIncomplete}
//                 onChange={handleChange}
//                 placeholder="Reason for incomplete task"
//                 style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//               />
//             </div>
//           )}
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Remarks</label>
//           <textarea
//             name="remarks"
//             value={taskData.remarks}
//             onChange={handleChange}
//             placeholder="Additional remarks"
//             rows={3}
//             style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
//           />
//         </div>
        
//         <button type="submit" style={{ display: 'block', margin: '0 auto', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px' }}>
//           Add Task
//         </button>
//       </form>
      
//     </div>
//   );
// };

// export default AddTask;