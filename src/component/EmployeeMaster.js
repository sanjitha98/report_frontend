import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import welcomeImage from "../img/logo/welcome.png";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closeModel,
  openModel,
  setHasModalShownToday,
} from "../Redux/slice/commonSlice";

// Register Chart.js components for v3+
ChartJS.register(ArcElement, Tooltip, Legend);

// ================= Daily Quotes =================
const dailyQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Believe you can and you’re halfway there. – Theodore Roosevelt",
  "Do what you can, with what you have, where you are. – Theodore Roosevelt",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "Act as if what you do makes a difference. It does. – William James",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
  "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
  "I find that the harder I work, the more luck I seem to have. – Thomas Jefferson",
  "It always seems impossible until it’s done. – Nelson Mandela",
  "Your limitation—it’s only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It’s going to be hard, but hard does not mean impossible.",
  "Don’t wait for opportunity. Create it.",
  "Sometimes later becomes never. Do it now.",
  "The key to success is to focus on goals, not obstacles.",
  "You don’t have to be great to start, but you have to start to be great.",
  "The only place where success comes before work is in the dictionary. – Vidal Sassoon",
  "Difficult roads often lead to beautiful destinations.",
  "Be yourself; everyone else is already taken. – Oscar Wilde",
  "Don’t let what you cannot do interfere with what you can do. – John Wooden",
  "Happiness is not something ready made. It comes from your own actions. – Dalai Lama",
  "If everything seems under control, you’re not going fast enough. – Mario Andretti",
  "Be a voice, not an echo.",
  "No matter how many mistakes you make, or how slow you progress, you are still way ahead of everyone who isn’t trying.",
  "Only those who dare to fail greatly can ever achieve greatly. – Robert F. Kennedy",
  "Challenges are what make life interesting and overcoming them is what makes life meaningful.",
  "Happiness depends upon ourselves. – Aristotle",
  "Do what is right, not what is easy nor what is popular.",
  "You don’t need to see the whole staircase, just take the first step. – Martin Luther King Jr.",
  "Opportunities don't happen. You create them. – Chris Grosser",
  "I never dreamed about success. I worked for it. – Estée Lauder",
  "What seems to us as bitter trials are often blessings in disguise. – Oscar Wilde",
  "It is not the mountain we conquer but ourselves. – Edmund Hillary",
  "Our greatest glory is not in never falling, but in rising every time we fall. – Confucius",
  "A champion is defined not by their wins but by how they can recover when they fall. – Serena Williams",
  "If you’re going through hell, keep going. – Winston Churchill",
  "The only way to achieve the impossible is to believe it is possible. – Charles Kingsleigh",
  "Nothing is impossible, the word itself says ‘I’m possible’! – Audrey Hepburn",
  "You are braver than you believe, stronger than you seem, and smarter than you think. – A.A. Milne",
  "All our dreams can come true, if we have the courage to pursue them. – Walt Disney",
  "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
  "Everything you’ve ever wanted is on the other side of fear. – George Addair",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "Don't let yesterday take up too much of today. – Will Rogers",
  "Try not to become a person of success, but rather try to become a person of value. – Albert Einstein",
  "Perseverance is not a long race; it is many short races one after the other. – Walter Elliot",
  "Failure is the opportunity to begin again more intelligently. – Henry Ford",
  "A year from now you may wish you had started today. – Karen Lamb",
  "It’s not whether you get knocked down, it’s whether you get up. – Vince Lombardi",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
  "The best way to predict the future is to create it. – Peter Drucker",
  "Success is how high you bounce when you hit bottom. – George S. Patton",
  "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart. – Roy T. Bennett",
  "Do what you feel in your heart to be right – for you’ll be criticized anyway. – Eleanor Roosevelt",
  "Don’t wish it were easier. Wish you were better. – Jim Rohn",
  "Do one thing every day that scares you. – Eleanor Roosevelt",
  "The best revenge is massive success. – Frank Sinatra",
  "Don’t be afraid to give up the good to go for the great. – John D. Rockefeller",
  "Start each day with a positive thought and a grateful heart. – Roy T. Bennett",
  "Work hard in silence, let success make the noise. – Frank Ocean",
  "Doubt kills more dreams than failure ever will. – Suzy Kassem",
  "Don’t count the days, make the days count. – Muhammad Ali",
  "In the middle of every difficulty lies opportunity. – Albert Einstein",
  "Turn your wounds into wisdom. – Oprah Winfrey",
  "Don’t let small minds convince you that your dreams are too big.",
  "Keep your face always toward the sunshine—and shadows will fall behind you. – Walt Whitman",
];

// ========== Styled Components ==========
const DashboardContainer = styled.div`
  padding: 1.5rem;
  font-family: "Roboto", sans-serif;
  color: #333;
  background-color: #f3f4f6;
  min-height: 100vh;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    margin: 0;
    font-size: 1.75rem;
    color: #1f2937;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const DateTimeContainer = styled.div`
  font-size: 0.95rem;
  color: #6b7280;
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const WelcomeCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;

    h2 {
      font-size: 1.5rem;
    }
  }
`;

const WelcomeText = styled.div`
  max-width: 60%;

  h2 {
    margin: 0;
    font-size: 1.75rem;
    color: #1f2937;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.5rem 0;
    color: #6b7280;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    max-width: 100%;

    h2 {
      font-size: 1.5rem;
    }
  }
`;

const QuoteText = styled.blockquote`
  font-style: italic;
  color: #4caf50;
  border-left: 4px solid #4caf50;
  padding-left: 8px;
  margin: 1rem 0 0 0;
  font-size: 0.9rem;
`;

const WelcomeImage = styled.img`
  max-width: 150px; /* Reduced from 200px to 150px */
  height: auto;
  object-fit: cover;
  margin-left: 1.5rem;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 1rem;
    max-width: 120px; /* Optional: even smaller on mobile screens */
  }
`;

const StatsCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  h3 {
    margin: 0 0 1rem;
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .stats-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;

    p {
      margin: 0;
      color: #6b7280;
      font-size: 0.95rem;
    }

    span {
      font-weight: bold;
      color: #1f2937;
    }
  }

  h4 {
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    color: #1f2937;
  }

  .attendance-status {
    margin-top: 0.25rem;

    div {
      font-size: 0.85rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    h3 {
      font-size: 1.1rem;
    }

    h4 {
      font-size: 0.9rem;
    }
  }
`;

const MissingTaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  thead {
    background-color: #e5e7eb;
  }

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    font-size: 0.9rem;
    border: 1px solid #ccc;
  }

  th {
    font-weight: 600;
    color: #1f2937;
  }

  tbody tr:nth-child(even) {
    background-color: #f9fafb;
  }

  tbody tr:hover {
    background-color: #f3f4f6;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 0.5rem;
      font-size: 0.85rem;
    }
  }
`;

const LatePunchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const PunchTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: #e5e7eb;
  }

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    font-size: 0.9rem;
    border: 1px solid #ccc;
  }

  th {
    font-weight: 600;
    color: #1f2937;
  }

  td {
    color: #374151;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;

    th,
    td {
      padding: 0.5rem;
    }
  }
`;

const PieChartWrapper = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;

  @media (max-width: 768px) {
    min-height: 250px;
    padding: 0.5rem;
  }
`;

const CalendarCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  .calendar-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
    }
  }

  .calendar-date {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }

  .calendar-cell {
    text-align: center;
    padding: 0.5rem 0;
    border-radius: 4px;
    background: #f3f4f6;
    color: #374151;
    font-size: 0.85rem;
  }

  .day-label {
    font-weight: 600;
    background-color: #e5e7eb;
  }

  .current-day {
    background: #2563eb;
    color: #fff;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .calendar-header h3 {
      font-size: 1.2rem;
    }

    .calendar-date {
      font-size: 0.9rem;
    }

    .calendar-cell {
      font-size: 0.75rem;
    }
  }
`;

const UpcomingCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  h3 {
    margin: 0 0 1rem;
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  ul {
    list-style-type: disc;
    margin-left: 1.25rem;
    color: #6b7280;
    font-size: 0.95rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    h3 {
      font-size: 1.1rem;
    }

    ul {
      font-size: 0.85rem;
    }
  }
`;

// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const ModalContent = styled.div`
//   background: white;
//   padding: 20px;
//   border-radius: 10px;
//   width: 300px;
//   text-align: center;
// `;

// ================= EmployeeMaster Component =================
const EmployeeMaster = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");
  const [employeeCount, setEmployeeCount] = useState(0);
  const [employeeList, setEmployeeList] = useState([]);
  const [absentEmployees, setAbsentEmployees] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState([]); // show all leave applications with leaveType
  const [punchDataToday, setPunchDataToday] = useState([]);
  const [latePunchData, setLatePunchData] = useState([]);
  const [monthlyLatePunchSummary, setMonthlyLatePunchSummary] = useState({
    totalDaysLate: 0,
    totalLateHours: 0,
  });

  const [presentEmployeeCount, setPresentEmployeeCount] = useState(0);

  const [calendarDays, setCalendarDays] = useState([]);
  const [upcomingEventsWithin2Days, setUpcomingEventsWithin2Days] = useState(
    []
  );
  // const [isModelOpen, setisModelOpen] = useState(false);//no need
  const [todayEvents, setTodayEvents] = useState([]);
  const dispatch = useDispatch();
  const { isAuth, userData } = useSelector((state) => state.login);
  const { isModelOpen, hasModalShownToday } = useSelector(
    (state) => state.common
  );

  const [missingEmployees, setMissingEmployees] = useState([]);
  const [missingTaskLoading, setMissingTaskLoading] = useState(true);
  const [missingTaskError, setMissingTaskError] = useState("");

  // Function to close modal
  const closeModelFun = () => {
    dispatch(closeModel());
    dispatch(setHasModalShownToday(true));
  };

  // States for uploading employee data
  const [formData, setFormData] = useState(new FormData());
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  // 1. SET DAILY QUOTE, DATE/TIME, GREETING
  useEffect(() => {
    // Compute daily quote based on the day of the year
    const dayOfYear = moment().dayOfYear(); // returns 1 to 365 (or 366)
    const dailyQuote = dailyQuotes[(dayOfYear - 1) % dailyQuotes.length];
    setQuote(dailyQuote);

    const now = new Date();
    const hr = now.getHours();
    if (hr < 12) setGreeting("Good Morning");
    else if (hr < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    setCurrentDate(moment().format("DD MMMM YYYY"));
    setCurrentTime(moment().format("hh:mm A"));

    const intervalId = setInterval(() => {
      setCurrentDate(moment().format("DD MMMM YYYY"));
      setCurrentTime(moment().format("hh:mm A"));
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // 2. FETCH EMPLOYEE LIST
  const fetchEmployeeList = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/employee_list/`
      );
      if (response.data.status === "Success") {
        setEmployeeList(response.data.data);
        setEmployeeCount(response.data.data.length);
      } else {
        console.error("Failed to fetch employee list:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching employee list:", err);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  // 3. FETCH LEAVE APPLICATIONS (Attendance Status)
  // useEffect(() => {
  //   const fetchLeaveApplications = async () => {
  //     const startDate = moment().format("YYYY-MM-DD");
  //     const endDate = moment().format("YYYY-MM-DD"); // Only fetch for today
  //     try {
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
  //         {
  //           startDate: startDate,
  //           endDate: endDate,
  //         }
  //       );

  //       if (response.data && response.data.status === "Success") {
  //         const leaves = response.data.data;
  //         const enrichedLeaves = await Promise.all(
  //           leaves.map(async (leave) => {
  //             if (!leave.employeeName) {
  //               try {
  //                 const empResponse = await axios.post(
  //                   `${process.env.REACT_APP_API_URL}/getEmployeeById/${leave.employeeId}`
  //                 );
  //                 return {
  //                   ...leave,
  //                   employeeName: empResponse.data.employeeName,
  //                 };
  //               } catch (err) {
  //                 console.error("Error fetching employee details:", err);
  //                 return leave;
  //               }
  //             }
  //             return leave;
  //           })
  //         );
  //         setAttendanceStatus(enrichedLeaves);
  //         const LossOfPayLeave = enrichedLeaves.filter(
  //           (leave) => leave.leaveTypes === "LossOfPay Leave","Casual Leave", "Permission", "Work From Home", "Saturday Off "
  //         );
  //         setAbsentEmployees(LossOfPayLeave);
  //       } else {
  //         console.error("No leave data returned from API:", response.data);
  //       }
  //     } catch (error) {
  //       console.error(
  //         "Error fetching leave applications:",
  //         error.response?.data || error.message
  //       );
  //     }
  //   };
  //   fetchLeaveApplications();
  // }, []);

  // // Calculate number of present employees by subtracting only LossOfPay leave records
  // const presentEmployeeCount = employeeCount - absentEmployees.length;

  // useEffect(() => {
  //   const fetchLeaveApplications = async () => {
  //     const startDate = moment().format("YYYY-MM-DD");
  //     const endDate = moment().format("YYYY-MM-DD"); // Only fetch for today
  //     try {
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
  //         { startDate, endDate }
  //       );

  //       console.log("API Response:", response.data); // Debugging

  //       if (response.data && response.data.status === "Success") {
  //         const leaves = response.data.data;
  //         console.log("Raw Leaves Data:", leaves);

  //         const enrichedLeaves = await Promise.all(
  //           leaves.map(async (leave) => {
  //             if (!leave.employeeName) {
  //               try {
  //                 const empResponse = await axios.post(
  //                   `${process.env.REACT_APP_API_URL}/getEmployeeById/${leave.employeeId}`
  //                 );
  //                 return {
  //                   ...leave,
  //                   employeeName: empResponse.data.employeeName,
  //                 };
  //               } catch (err) {
  //                 console.error("Error fetching employee details:", err);
  //                 return leave;
  //               }
  //             }
  //             return leave;
  //           })
  //         );

  //         console.log("Enriched Leaves:", enrichedLeaves);
  //         setAttendanceStatus(enrichedLeaves);

  //         // **Fix: Consider all employees on leave as absent**
  //         const allLeaves = enrichedLeaves.filter(
  //           (leave) => leave.leaveTypes && leave.leaveTypes.trim() !== ""
  //         );

  //         console.log("Final Absent Employees List:", allLeaves);
  //         setAbsentEmployees(allLeaves);
  //       } else {
  //         console.error("No leave data returned from API:", response.data);
  //       }
  //     } catch (error) {
  //       console.error(
  //         "Error fetching leave applications:",
  //         error.response?.data || error.message
  //       );
  //     }
  //   };

  //   fetchLeaveApplications();
  // }, []);

  // const [presentEmployeeCount, setPresentEmployeeCount] = useState(0);

  // useEffect(() => {
  //   console.log("Recalculating Present Employees...");
  //   console.log("Total Employees:", employeeCount);
  //   console.log("Total Absent Employees:", absentEmployees.length);

  //   if (employeeCount > 0) {
  //     setPresentEmployeeCount(employeeCount - absentEmployees.length);
  //   }

  //   console.log("Updated Present Employees:", presentEmployeeCount);
  // }, [absentEmployees, employeeCount]);

  //  const fetchAttendanceData = async () => {
  //     try {
  //       const todayDate = moment().format("YYYY-MM-DD");

  //       //Get all today punched employee
  //       const punchResponse = await axios.post(
  //         `${process.env.REACT_APP_API_URL}/dailypunch`,
  //         { date: todayDate }
  //       );

  //       console.log("Punch Data:", punchResponse.data);

  //       let todayPunchedEmployeeCount = 0; // set default 0 fro punced employee
  //       if (punchResponse?.data?.length > 0) {
  //         todayPunchedEmployeeCount = new Set(
  //           punchResponse.data
  //             .filter((emp) => emp.logType === "In" && emp.logSno === 1)
  //             .map((emp) => emp.employeeId)
  //         ).size;
  //       }
  //       console.log("todayPunchedEmployeeCount", todayPunchedEmployeeCount);
  //       setPresentEmployeeCount(todayPunchedEmployeeCount); // set today punched employee count

  //       let appliedAbsentEmployeesCount = 0; // set default 0 for leave applied
  //       try {
  //         //get all applied leave based on today
  //         const leaveResponse = await axios.post(
  //           `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
  //           { startDate: todayDate, endDate: todayDate }
  //         );

  //         console.log("leaveResponse", leaveResponse.data.data);

  //         if (leaveResponse.data && leaveResponse.data.status === "Success") {
  //           const leaves = leaveResponse.data.data;
  //           const enrichedLeaves = await Promise.all(
  //             leaves.map(async (leave) => {
  //               if (!leave.employeeName) {
  //                 try {
  //                   const empResponse = await axios.post(
  //                     `${process.env.REACT_APP_API_URL}/getEmployeeById/${leave.employeeId}`
  //                   );
  //                   return {
  //                     ...leave,
  //                     employeeName: empResponse.data.employeeName,
  //                   };
  //                 } catch (err) {
  //                   console.error("Error fetching employee details:", err);
  //                   return leave;
  //                 }
  //               }
  //               return leave;
  //             })
  //           );
  //           console.log("enrichedLeaves", enrichedLeaves);
  //           appliedAbsentEmployeesCount = enrichedLeaves.filter(
  //             (leave) =>
  //               leave.leaveTypes === "LossOfPay Leave" ||
  //               "Casual Leave" ||
  //               "Work From Home" ||
  //               "Saturday Off " ||
  //               "Absent"
  //           ).length;

  //         } else {
  //           console.error("No leave data returned from API:", leaveResponse.data);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }

  //       const totalEmployees = employeeList.length;
  //       const totalAbsent =
  //         todayPunchedEmployeeCount - appliedAbsentEmployeesCount;
  //       setAbsentEmployees(totalEmployees - totalAbsent);

  //     } catch (error) {
  //       console.error(
  //         "Error fetching attendance data:",
  //         error.response?.data || error.message
  //       );
  //     }
  //   };

  //   useEffect(() => {
  //     fetchAttendanceData();
  //   }, [employeeList]);

  // const [leaveData, setLeaveData] = useState([]); // Store leave details

  // const fetchAttendanceData = async () => {
  //   try {
  //     const todayDate = moment().format("YYYY-MM-DD");

  //     // Get all today punched employees
  //     const punchResponse = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/dailypunch`,
  //       { date: todayDate }
  //     );

  //     console.log("Punch Response:", punchResponse.data); // Debug log

  //     let todayPunchedEmployeeCount = 0;
  //     let punchedEmployeeIds = new Set();

  //     if (punchResponse?.data?.length > 0) {
  //       punchedEmployeeIds = new Set(
  //         punchResponse.data
  //           .filter((emp) => emp.logType === "In" && emp.logSno === 1)
  //           .map((emp) => emp.employeeId)
  //       );
  //       todayPunchedEmployeeCount = punchedEmployeeIds.size;
  //     }

  //     setPresentEmployeeCount(todayPunchedEmployeeCount);
  //     console.log("Punched Employee IDs:", punchedEmployeeIds); // Debug
  //   console.log("Present Employees:", todayPunchedEmployeeCount); // Debug

  //     let appliedAbsentEmployeesCount = 0;
  //     let leaveDetails = [];

  //     try {
  //       // Get all applied leaves based on today
  //       const leaveResponse = await axios.post(
  //         `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
  //         { startDate: todayDate, endDate: todayDate }
  //       );

  //       console.log("Leave Response:", leaveResponse.data); // Debug log

  //       if (leaveResponse.data && leaveResponse.data.status === "Success") {
  //         const leaves = leaveResponse.data.data;

  //         if (!leaves || leaves.length === 0) {
  //           console.warn("No leave data found");
  //         }

  //         const enrichedLeaves = await Promise.all(
  //           leaves.map(async (leave) => {
  //             if (!leave.employeeName) {
  //               try {
  //                 const empResponse = await axios.post(
  //                   `${process.env.REACT_APP_API_URL}/getEmployeeById/${leave.employeeId}`
  //                 );
  //                 return {
  //                   ...leave,
  //                   employeeName: empResponse.data.employeeName,
  //                 };
  //               } catch (err) {
  //                 console.error("Error fetching employee details:", err);
  //                 return leave;
  //               }
  //             }
  //             return leave;
  //           })
  //         );

  //         // Store employee name and leave type in an array
  //         leaveDetails = enrichedLeaves.map((leave) => ({
  //           employeeName: leave.employeeName,
  //           leaveTypes: leave.leaveTypes || "Absent", // If no leave type, mark as "Absent"
  //         }));

  //         console.log("Processed Leave Data:", leaveDetails); // Debug log
  //         console.log("Leave Details:", leaveDetails); // Debug
  //         // const appliedAbsentEmployeesCount = 2;
  //         appliedAbsentEmployeesCount = enrichedLeaves.filter((leave) => {

  //           if (leave.leaveTypes === "Permission") {
  //             return leave.duration && leave.duration > 2; // Ignore permission as absent
  //           } else {
  //             return [
  //               "LossOfPay Leave",
  //               "Casual Leave",
  //               "Work From Home",
  //               "Saturday Off ",
  //             ].includes(leave.leaveTypes);
  //           }
  //         }).length;
  //         console.log("Applied Absent Employees Count:", appliedAbsentEmployeesCount); // Add this line
  //       }
  //     } catch (error) {
  //       console.error("Error fetching leave data:", error);
  //     }
  //     // Find employees who didn't punch in and are NOT on leave
  //     const absentWithoutLeave = employeeList.filter(
  //       (emp) =>
  //         !punchedEmployeeIds.has(emp.employeeId) &&
  //         !leaveDetails.some((leave) => leave.employeeName === emp.employeeName)
  //     );

  //     //  Add missing employees as "Absent"
  //     absentWithoutLeave.forEach((emp) => {
  //       leaveDetails.push({
  //         employeeName: emp.employeeName,
  //         leaveTypes: "Absent",
  //       });
  //     });

  //     const totalEmployees = employeeList.length;
  //     const totalAbsentWithoutLeaves =
  //       totalEmployees - todayPunchedEmployeeCount;
  //     const actualAbsent =
  //       totalAbsentWithoutLeaves + appliedAbsentEmployeesCount;
  //       console.log("Actual Absent:", actualAbsent);
  //     setAbsentEmployees(actualAbsent);
  //     setLeaveData(leaveDetails); // Store employee names & leave types

  //     console.log("Employee List:", employeeList); // Debug
  //     console.log("Total Absent Without Leaves:", totalAbsentWithoutLeaves); // Debug
  //     console.log("Actual Absent:", actualAbsent); // Debug

  //   } catch (error) {
  //     console.error(
  //       "Error fetching attendance data:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  // useEffect(() => {
  //   fetchAttendanceData();
  // }, [employeeList]);

  // //  Add this useEffect to log leaveData changes
  // useEffect(() => {
  //   console.log("Updated Leave Data:", leaveData);
  // }, [leaveData]);

  const [leaveData, setLeaveData] = useState([]); // Store leave details

  const fetchAttendanceData = async () => {
    try {
      const todayDate = moment().format("YYYY-MM-DD");

      // Get all today punched employees
      const punchResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/dailypunch`,
        { date: todayDate }
      );

      console.log("Punch Response:", punchResponse.data); // Debug log

      let todayPunchedEmployeeCount = 0;
      let punchedEmployeeIds = new Set();

      if (punchResponse?.data?.length > 0) {
        punchedEmployeeIds = new Set(
          punchResponse.data
            .filter((emp) => emp.logType === "In" && emp.logSno === 1)
            .map((emp) => emp.employeeId)
        );
        todayPunchedEmployeeCount = punchedEmployeeIds.size;
      }

      setPresentEmployeeCount(todayPunchedEmployeeCount);
      console.log("Punched Employee IDs:", punchedEmployeeIds); // Debug
      console.log("Present Employees:", todayPunchedEmployeeCount); // Debug

      let appliedAbsentEmployeesCount = 0;
      let leaveDetails = [];

      try {
        // Get all applied leaves based on today
        const leaveResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/getLeaveRequestsAll`,
          { startDate: todayDate, endDate: todayDate }
        );

        console.log("Leave Response:", leaveResponse.data); // Debug log

        if (leaveResponse.data && leaveResponse.data.status === "Success") {
          const leaves = leaveResponse.data.data;

          if (!leaves || leaves.length === 0) {
            console.warn("No leave data found");
          }

          const enrichedLeaves = await Promise.all(
            leaves.map(async (leave) => {
              if (!leave.employeeName) {
                try {
                  const empResponse = await axios.post(
                    `${process.env.REACT_APP_API_URL}/getEmployeeById/${leave.employeeId}`
                  );
                  return {
                    ...leave,
                    employeeName: empResponse.data.employeeName,
                  };
                } catch (err) {
                  console.error("Error fetching employee details:", err);
                  return leave;
                }
              }
              return leave;
            })
          );

          // Store employee name and leave type in an array
          const filteredLeaves = enrichedLeaves.filter(
            (leave) => leave.status === "Accepted"
          );

          leaveDetails = filteredLeaves.map((leave) => ({
            employeeName: leave.employeeName,
            leaveTypes: leave.leaveTypes || "Absent",
          }));

          console.log("Processed Leave Data:", leaveDetails); // Debug log
          console.log("Leave Details:", leaveDetails); // Debug

          // Calculate appliedAbsentEmployeesCount based on actual leave requests
          // appliedAbsentEmployeesCount = enrichedLeaves.filter((leave) => {
          //   if (leave.status !== "Accepted") return false;
          //   if (leave.leaveTypes === "Permission") {
          //     return leave.duration && leave.duration > 2; // Ignore permission as absent
          //   } else {
          //     return [
          //       "LossofPay Leave",
          //       "Casual Leave",
          //       "Work From Home",
          //       "Saturday Off ",
          //     ].includes(leave.leaveTypes);
          //   }
          // }).length;

          appliedAbsentEmployeesCount = enrichedLeaves.reduce(
            (count, leave) => {
              if (leave.status !== "Accepted") return count;

              if (leave.leaveTypes === "Half Day Leave") {
                return count + 0.5;
              }

              if (leave.leaveTypes === "Permission") {
                return leave.duration && leave.duration > 2 ? count + 1 : count;
              }

              if (
                [
                  "LossofPay Leave",
                  "Casual Leave",
                  "Work From Home",
                  "Saturday Off ",
                ].includes(leave.leaveTypes)
              ) {
                return count + 1;
              }

              return count;
            },
            0
          );

          console.log(
            "Applied Absent Employees Count:",
            appliedAbsentEmployeesCount
          ); // Debug
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }

      // Find employees who didn't punch in and are NOT on leave
      const absentWithoutLeave = employeeList.filter(
        (emp) =>
          !punchedEmployeeIds.has(emp.employeeId) &&
          !leaveDetails.some((leave) => leave.employeeName === emp.employeeName)
      );

      // Add missing employees as "Absent" ONLY for the leaveDetails array
      absentWithoutLeave.forEach((emp) => {
        leaveDetails.push({
          employeeName: emp.employeeName,
          leaveTypes: "Absent",
        });
      });

      // Calculate totalAbsentWithoutLeaves correctly
      const totalAbsentWithoutLeaves = absentWithoutLeave.length; // Corrected line

      const actualAbsent =
        totalAbsentWithoutLeaves + appliedAbsentEmployeesCount;

      console.log("Actual Absent:", actualAbsent); // Log here, AFTER calculation

      setAbsentEmployees(actualAbsent);
      setLeaveData(leaveDetails); // Store employee names & leave types

      console.log("Employee List:", employeeList); // Debug
      console.log("Total Absent Without Leaves:", totalAbsentWithoutLeaves); // Debug
    } catch (error) {
      console.error(
        "Error fetching attendance data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [employeeList]);

  // Add this useEffect to log leaveData changes
  useEffect(() => {
    console.log("Updated Leave Data:", leaveData);
  }, [leaveData]);

  // 4. FETCH PUNCH LOGS for Today
  useEffect(() => {
    const fetchPunchDataToday = async () => {
      const todayDate = moment().format("YYYY-MM-DD");
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/dailypunch`,
          { date: todayDate }
        );
        if (response.data) {
          setPunchDataToday(response.data);
          const lateArr = [];
          let daysLate = 0;
          let totalLateMinutes = 0;
          const groupedByEmployee = {};
          const employeeLookup = {};
          employeeList.forEach((emp) => {
            employeeLookup[emp.employeeId] = emp.employeeName;
          });

          response.data.forEach((item) => {
            const employeeName =
              item.employeeName ||
              employeeLookup[item.employeeId] ||
              item.employeeId;
            if (!groupedByEmployee[employeeName]) {
              groupedByEmployee[employeeName] = [];
            }
            groupedByEmployee[employeeName].push(item);
          });

          Object.keys(groupedByEmployee).forEach((empKey) => {
            const employeeData = groupedByEmployee[empKey];
            const inPunches = employeeData.filter(
              (item) => item.logType === "In"
            );
            const groupedByDate = inPunches.reduce((acc, item) => {
              const dateStr = new Date(item.logTime).toLocaleDateString();
              if (!acc[dateStr]) {
                acc[dateStr] = [];
              }
              acc[dateStr].push(item.logTime);
              return acc;
            }, {});

            Object.keys(groupedByDate).forEach((dateStr) => {
              const times = groupedByDate[dateStr].sort(
                (a, b) => new Date(a) - new Date(b)
              );
              const firstPunchTime = new Date(times[0]);
              const threshold = new Date(firstPunchTime);
              threshold.setHours(9, 30, 0, 0);

              if (firstPunchTime > threshold) {
                const diffMs = firstPunchTime - threshold;
                const lateMinutes = Math.round(diffMs / (1000 * 60));
                const hours = Math.floor(lateMinutes / 60);
                const minutes = lateMinutes % 60;
                const lateString = `${hours} hr${
                  hours !== 1 ? "s" : ""
                } ${minutes} min${minutes !== 1 ? "s" : ""}`;

                lateArr.push({
                  date: dateStr,
                  employeeName: empKey,
                  punchIn: [times[0]],
                  lateString: lateString,
                });
                daysLate++;
                totalLateMinutes += lateMinutes;
              }
            });
          });

          setLatePunchData(lateArr);
          setMonthlyLatePunchSummary({
            totalDaysLate: daysLate,
            totalLateHours: totalLateMinutes / 60,
          });
        } else {
          console.error("No punch data returned from API");
        }
      } catch (error) {
        console.error("Error fetching punch data:", error);
      }
    };
    fetchPunchDataToday();
  }, [employeeList]);

  // useEffect(() => {
  //   const fetchMissingTasks = async () => {
  //     try {
  //       const res = await axios.post(
  //         `${process.env.REACT_APP_API_URL}/getEmployeesWithMissingTasks`
  //       );
  //       setMissingEmployees(res.data.data);
  //       setMissingTaskLoading(false);
  //     } catch (err) {
  //       setMissingTaskError("Failed to fetch data");
  //       setMissingTaskLoading(false);
  //     }
  //   };

  //   fetchMissingTasks();
  // }, []);

  useEffect(() => {
    const fetchMissingTasks = async () => {
      try {
        // Fetch missing employees (only employeeId list)
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/getEmployeesWithMissingTasks`
        );
        const missingList = res.data.data;

        // Fetch full employee list to get names
        const empRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/employee_list/`
        );
        const fullEmployeeList = empRes.data.data;

        // Map employee names to missing employee list
        const mergedList = missingList.map((emp) => {
          const match = fullEmployeeList.find(
            (e) => e.employeeId === emp.employeeId
          );
          return {
            ...emp,
            name: match ? match.name : "Name not found",
          };
        });

        setMissingEmployees(mergedList);
        setMissingTaskLoading(false);
      } catch (err) {
        setMissingTaskError("Failed to fetch data");
        setMissingTaskLoading(false);
      }
    };

    fetchMissingTasks();
  }, []);

  // 5. GENERATE CALENDAR DAYS
  useEffect(() => {
    const now = moment();
    const startOfMonth = moment(now).startOf("month");
    const endOfMonth = moment(now).endOf("month");
    const daysArray = [];
    let currentDay = startOfMonth.clone();
    while (
      currentDay.isBefore(endOfMonth) ||
      currentDay.isSame(endOfMonth, "day")
    ) {
      daysArray.push(currentDay.clone());
      currentDay.add(1, "day");
    }
    setCalendarDays(daysArray);
  }, []);

  // 6. Compute Upcoming Events based on employee birthdays (from employeeList)
  useEffect(() => {
    if (employeeList.length > 0) {
      const upcomingBirthdays = employeeList
        .filter((employee) => {
          if (!employee.dateOfBirth) return false;
          let birthdayThisYear = moment(employee.dateOfBirth).year(
            moment().year()
          );
          if (birthdayThisYear.isBefore(moment(), "day")) {
            birthdayThisYear.add(1, "year");
          }
          const diffDays = birthdayThisYear.diff(moment(), "days");
          return diffDays >= 0 && diffDays <= 30;
        })
        .map((employee) => {
          let birthdayThisYear = moment(employee.dateOfBirth).year(
            moment().year()
          );
          if (birthdayThisYear.isBefore(moment(), "day")) {
            birthdayThisYear.add(1, "year");
          }
          return {
            date: birthdayThisYear.format("DD MMM YYYY"),
            event: `${employee.name}'s Birthday`,
            profileUrl: employee.profileUrl?.startsWith("http")
              ? employee.profileUrl
              : `${process.env.REACT_APP_API_URL}/uploads/Images/${employee.profileUrl}`,
            birthdayDate: birthdayThisYear, // Store moment object for sorting
          };
        });
      // Sort by the calculated birthday date
      const sortedBirthdays = upcomingBirthdays.sort(
        (a, b) => a.birthdayDate - b.birthdayDate
      );

      setUpcomingEventsWithin2Days(sortedBirthdays);
      // Check if today has any events
      const today = moment().format("DD MMM YYYY");
      const todayEventsList = sortedBirthdays.filter(
        (evt) => evt.date === today
      );
      if (!isModelOpen) {
        if (todayEventsList.length > 0) {
          setTodayEvents(todayEventsList);
          dispatch(openModel(true));
        }
      }
    }
  }, [employeeList]);

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const formatDate = (date) => moment(date).format("DD MMM YYYY");
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/get_upcoming_holidays`
        );
        //       setHolidays(response.data.data);
        //     } catch (err) {
        //       setError("Failed to fetch holidays.");
        //     } finally {
        //       setLoading(false);
        //     }
        //   };
        //   fetchHolidays();
        // }, []);

        const today = new Date();
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(today.getMonth() + 3);

        const filteredHolidays = response.data.data.filter((holiday) => {
          const holidayDate = new Date(holiday.startDate);
          return holidayDate >= today && holidayDate <= threeMonthsLater;
        });

        setHolidays(filteredHolidays);
      } catch (err) {
        setError("Failed to fetch holidays.");
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  // 7. PIE CHART DATA
  const totalEmployees = employeeCount;
  const uniqueLateEmployees = new Set(latePunchData.map((l) => l.employeeName));
  const lateCount = uniqueLateEmployees.size;
  const onTimeCount = totalEmployees - lateCount;

  const pieData = {
    labels: ["Late", "On Time"],
    datasets: [
      {
        data: [lateCount, onTimeCount],
        // backgroundColor: ["#ef4444", "#10b981"],
        // hoverBackgroundColor: ["#dc2626", "#059669"],
        backgroundColor: ["#9ca3af", "#3b82f6"], // gray and blue
        hoverBackgroundColor: ["#6b7280", "#2563eb"], // darker gray and blue for hover
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  // Method to handle the form data (for adding an employee)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "file") {
      formData.append("file", e.target.files[0]);
    } else {
      formData.set(name, value);
    }
    setFormData(formData);
  };

  // Method to handle form submission (for adding an employee)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/addEmployee`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === "Success") {
        setSuccess(true);
        fetchEmployeeList();
      } else {
        setError("Failed to add employee: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      setError("Internal Server Error");
    }
  };

  // ========== Render ==========
  return (
    <DashboardContainer>
      <Header>
        <HeaderLeft>
          <h1>Dashboard</h1>
          <DateTimeContainer>
            {currentDate} | {currentTime}
          </DateTimeContainer>
        </HeaderLeft>
      </Header>

      <ContentArea>
        <MainSection>
          <WelcomeCard>
            <WelcomeText>
              <h2>Welcome To</h2>
              <p>KST Reporting Software</p>
              <p>{greeting}, have a nice day!</p>
              <QuoteText>{quote}</QuoteText>
            </WelcomeText>
            <WelcomeImage src={welcomeImage} alt="Welcome" />
          </WelcomeCard>

          <StatsCard>
            <div
              className="stats-row"
              style={{ justifyContent: "space-between" }}
            >
              <div>
                <p>Total Presents:</p>
                <span>{presentEmployeeCount}</span>
              </div>
              <div>
                <p>Total Absent:</p>
                <span>{absentEmployees}</span>
              </div>
            </div>
            <h4>Leave/Permission Status</h4>
            <div className="attendance-status">
              {leaveData.length > 0 ? (
                leaveData.map((leave, idx) => (
                  <div key={idx}>
                    {leave.employeeName} - {leave.leaveTypes}
                  </div>
                ))
              ) : (
                <p>No updates.</p>
              )}
            </div>
          </StatsCard>

          <h3>Missing Daily Task Employees</h3>
          {missingEmployees.length === 0 ? (
            <p>No missing task records found for today.</p>
          ) : (
            <MissingTaskTable>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                </tr>
              </thead>
              <tbody>
                {missingEmployees.map((emp, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                  </tr>
                ))}
              </tbody>
            </MissingTaskTable>
          )}

          <LatePunchContainer>
            <h3>Late Punches for Today</h3>
            <PunchTable>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee Name</th>
                  <th>Punch In</th>
                  <th>Late By</th>
                </tr>
              </thead>
              <tbody>
                {latePunchData.length > 0 ? (
                  latePunchData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.date}</td>
                      <td>{item.employeeName}</td>
                      <td>{new Date(item.punchIn[0]).toLocaleTimeString()}</td>
                      <td>{item.lateString}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No late arrivals today.</td>
                  </tr>
                )}
              </tbody>
            </PunchTable>
          </LatePunchContainer>
        </MainSection>

        <SideSection>
          <CalendarCard>
            <div className="calendar-header">
              <FaCalendarAlt size={24} color="#3b82f6" />
              <h3>Calendar</h3>
            </div>
            <div className="calendar-date">{moment().format("MMMM YYYY")}</div>
            <div className="calendar-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="calendar-cell day-label">
                  {day}
                </div>
              ))}
              {/* Add empty cells before the 1st day to align correctly */}
              {calendarDays.length > 0 &&
                Array.from({ length: calendarDays[0].day() }, (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="calendar-cell empty-cell"
                  ></div>
                ))}
              {calendarDays.map((dayObj) => {
                const dayNumber = dayObj.format("D");
                const isToday = dayObj.isSame(moment(), "day");
                return (
                  <div
                    key={dayObj.toString()}
                    className={`calendar-cell ${isToday ? "current-day" : ""}`}
                  >
                    {dayNumber}
                  </div>
                );
              })}
            </div>
          </CalendarCard>

          {/* Auto Pop-Up for Today's Events */}
          {isModelOpen && !hasModalShownToday && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={closeModelFun}
            >
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  width: "320px",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  style={{
                    marginBottom: "15px",
                    fontSize: "20px",
                    color: "#ff5722",
                  }}
                >
                  🎉 Today's Events 🎂
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {todayEvents.map((evt, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={evt.profileUrl}
                        alt="Profile"
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "50%",
                          border: "2px solid #ff9800",
                        }}
                      />
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#333",
                          margin: 0,
                        }}
                      >
                        🎂 Happy Birthday, {evt.event.split("'s Birthday")[0]}!
                        🎉
                      </p>
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: "14px", color: "#ff9800" }}>
                  🎊 Wishing you a fantastic day! 🎊
                </p>
                <button
                  onClick={closeModelFun}
                  style={{
                    marginTop: "15px",
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <UpcomingCard>
            <h3>Upcoming Events</h3>
            {upcomingEventsWithin2Days.length > 0 ? (
              <ul>
                {upcomingEventsWithin2Days.map((evt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ marginRight: "15px" }}>
                      <img
                        src={evt.profileUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                        style={{
                          marginRight: "5px",
                          flexShrink: 0, // Ensures image size stays fixed
                        }}
                      />
                    </div>
                    <div>
                      <p style={{ margin: 0 }}>
                        {evt.date} - {evt.event}
                      </p>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No Upcoming Events.</p>
            )}
          </UpcomingCard>
          <div
            className="mt-6 bg-white p-4 rounded-xl shadow-sm"
            style={{ marginTop: "0px" }}
          >
            <h1 className="text-lg font-semibold text-gray-800 mb-4">
              Upcoming Holidays
            </h1>
            <ul className="ml-8 space-y-2 text-sm text-gray-600">
              {holidays.length > 0 ? (
                holidays.map((holiday) => (
                  <li key={holiday.id}>
                    <span className="font-medium uppercase">{holiday.eventName}</span> —{" "}
                    {formatDate(holiday.startDate)}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">
                  No upcoming holidays in the next 3 months.
                </li>
              )}
            </ul>
          </div>

          <PieChartWrapper>
            <div style={{ width: "200px", height: "200px", marginTop: "10px" }}>
              <span>Late Punch Records</span>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </PieChartWrapper>
        </SideSection>
      </ContentArea>
    </DashboardContainer>
  );
};

export default EmployeeMaster;
