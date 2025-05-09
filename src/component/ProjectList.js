// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// const ProjectList = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [projects, setProjects] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [formData, setFormData] = useState({
//     id: null,
//     project: "",
//     subProject: "",
//     client_name: "",
//     contact_number: "",
//     mail_id: "",
//   });

//   useEffect(() => {
//     fetchProjects();
//     if (location.pathname === "/dashboard/projects/add") {
//       setShowForm(true);
//     } else {
//       setShowForm(false);
//     }
//   }, [location.pathname]);

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/get_projects_list`
//       );
//       console.log("Fetched Projects:", response.data.data);
//       setProjects(response.data.data);
//     } catch (error) {
//       console.error("Error fetching projects", error);
//     }
//   };

//   const handleEdit = (project) => {
//     setFormData({
//       id: project.id,
//       project: project.projectName || "",
//       subProject: Array.isArray(project.subCategory)
//         ? project.subCategory.join(", ")
//         : "",
//       client_name: project.contact_details?.[0]?.client_name || "",
//       contact_number: project.contact_details?.[0]?.contact_number || "",
//       mail_id: project.contact_details?.[0]?.mail_id || "",
//     });
//     setShowForm(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     const payload = {
//       id: formData.id ?? null,
//       project: formData.project || null,
//       idRef: null,
//       subProject: formData.subProject
//         ? formData.subProject.split(",").map((s) => s.trim())
//         : [],
//       contact_details: [
//         {
//           client_name: formData.client_name || null,
//           contact_number: formData.contact_number || null,
//           mail_id: formData.mail_id || null,
//         },
//       ],
//     };

//     try {
//       await axios.post(
//         `${process.env.REACT_APP_API_URL}/project_master`,
//         payload
//       );

//       setFormData({
//         id: null,
//         project: "",
//         subProject: "",
//         client_name: "",
//         contact_number: "",
//         mail_id: "",
//       });
//       fetchProjects();
//       setSuccessMessage("Project saved successfully.");
//     } catch (err) {
//       console.error("Failed to submit project", err);
//     }
//   };

//   const handleDelete = async (id) => {
//   const projectToDelete = projects.find((proj) => proj.id === id);

//   console.log("Project to Delete:", projectToDelete);

//   // if (projectToDelete?.isActive === "1") {
//   //   alert("Access Denied: Cannot delete an active project.");
//   //   return;
//   // }

//   // Continue with delete confirmation and logic
//   if (!window.confirm("Are you sure you want to delete this project?")) return;

//   try {
//     await axios.post(`${process.env.REACT_APP_API_URL}/delete_project`, { id });

//     setSuccessMessage("Project deleted successfully.");
//     fetchProjects();
//   } catch (error) {
//     console.error("Error deleting project", error);
//   }
// };

  
  
  
//   return (
//     <div className="p-6 bg-gradient-to-r from-white-100 to-white-200 min-h-screen">
//       <h2 className="text-4xl font-bold text-center text-black-800 mb-6">
//         Project List
//       </h2>

//       {(showForm || location.pathname === "/dashboard/projects/add") && (
//         <button
//           onClick={() => {
//             navigate("/dashboard/projects");
//             setShowForm(false);
//             setFormData({
//               id: null,
//               project: "",
//               subProject: "",
//               client_name: "",
//               contact_number: "",
//               mail_id: "",
//             });
//           }}
//           className="bg-blue-500 text-white px-6 py-3 rounded-xl mb-6 mr-4 transition-all hover:bg-blue-600"
//         >
//           ← Back
//         </button>
//       )}

//       {!showForm && location.pathname !== "/dashboard/projects/add" && (
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={() => navigate("/dashboard/projects/add")}
//             className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-all hover:bg-blue-700"
//           >
//             Add New Project
//           </button>
//         </div>
//       )}

//       {successMessage && (
//         <div className="bg-green-100 text-blue-800 p-4 rounded-xl shadow-md mb-6 text-lg text-center">
//           {successMessage}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {projects.map((project) => (
//           <div
//             key={project.id}
//             className="bg-white p-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
//           >
//             <div className="flex justify-between items-start">
//               <span className="text-2xl font-semibold text-black-800">
//                 Project: {project.projectName}
//               </span>
//               <div className="flex items-center gap-6">
//                 <button
//                   onClick={() => {
//                     handleEdit(project);
//                     navigate("/dashboard/projects/add", { state: { project } });
//                   }}
//                   className="text-green-600 hover:underline text-sm font-medium transition-all hover:text-blue-800"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(project.id)}
//                   className="text-red-500 hover:underline text-sm font-medium transition-all hover:text-red-700"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Sub-Products:
//               </h3>
//               <div className="mt-2 flex flex-wrap gap-2 ml-4">
//                 {(project.subCategory || []).map((sub, idx) => (
//                   <span
//                     key={idx}
//                     className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm hover:bg-blue-200 transition-all"
//                   >
//                     {sub}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {project.contactDetails && project.contactDetails.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                   Contact Details:
//                 </h3>
//                 <div className="grid gap-3">
//                   {project.contactDetails.map((contact, idx) => (
//                     <div
//                       key={idx}
//                       className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
//                     >
//                       <div className="text-sm text-blue-900 mb-1">
//                         <span className="font-bold">👤 Client:</span>{" "}
//                         {contact.client_name}
//                       </div>
//                       <div className="text-sm text-blue-900 mb-1">
//                         <span className="font-bold">📞 Phone:</span>{" "}
//                         {contact.contact_number}
//                       </div>
//                       <div className="text-sm text-blue-900">
//                         <span className="font-bold">📧 Email:</span>{" "}
//                         {contact.mail_id}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ProjectList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    project: "",
    subProject: "",
    projectdomain: "",
    platform: "",
    client_name: "",
    contact_number: "",
    mail_id: "",
  });

  useEffect(() => {
    fetchProjects();
    if (location.pathname === "/dashboard/projects/add") {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [location.pathname]);

  const fetchProjects = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get_projects_list`
      );
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const handleEdit = (project) => {
    console.log(project);
    setFormData({
      id: project.id,
      project: project.projectName || "",
      subProject: Array.isArray(project.subCategory)
        ? project.subCategory.join(", ")
        : "",
      projectdomain: project.projectdomain || "",
      platform: project.platform || "",
      client_name: project.clientname || "",
      contact_number: project.contact_details?.[0]?.contact_number || "",
      mail_id: project.contact_details?.[0]?.mail_id || "",
    });
console.log(formData)
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      id: formData.id ?? null,
      project: formData.project || null,
      idRef: null,
      projectdomain: formData.projectdomain || null,
      platform: formData.platform || null,
      client_name: formData.clientname || null,
      subProject: formData.subProject
        ? formData.subProject.split(",").map((s) => s.trim())
        : [],
      contact_details: [
        {
          contact_number: formData.contact_number || null,
          mail_id: formData.mail_id || null,
        },
      ],
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/project_master`,
        payload
      );

      setFormData({
        id: null,
        project: "",
        subProject: "",
        projectdomain: "",
        platform: "",
        client_name: "",
        contact_number: "",
        mail_id: "",
      });
      fetchProjects();
      setSuccessMessage("Project saved successfully.");
    } catch (err) {
      console.error("Failed to submit project", err);
    }
  };

  const handleDelete = async (id) => {
    const projectToDelete = projects.find((proj) => proj.id === id);
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/delete_project`, { id });
      setSuccessMessage("Project deleted successfully.");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-white to-white min-h-screen">
      <h2 className="text-4xl font-bold text-center text-black mb-6">
        Project List
      </h2>

      {(showForm || location.pathname === "/dashboard/projects/add") && (
        <button
          onClick={() => {
            navigate("/dashboard/projects");
            setShowForm(false);
            setFormData({
              id: null,
              project: "",
              subProject: "",
              projectdomain: "",
              platform: "",
              client_name: "",
              contact_number: "",
              mail_id: "",
            });
          }}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl mb-6 mr-4 transition-all hover:bg-blue-600"
        >
          ← Back
        </button>
      )}

      {!showForm && location.pathname !== "/dashboard/projects/add" && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/dashboard/projects/add")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl transition-all hover:bg-blue-700"
          >
            Add New Project
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow-md mb-6 text-lg text-center">
          {successMessage}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">
            {formData.id ? "Edit Project" : "Add New Project"}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <input type="text" name="project" value={formData.project} onChange={handleChange} placeholder="Project Name" className="border border-gray-300 p-3 rounded-lg" />
            <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Client Name" className="border border-gray-300 p-3 rounded-lg" />
            <input type="text" name="projectdomain" value={formData.projectdomain} onChange={handleChange} placeholder="Project Domain" className="border border-gray-300 p-3 rounded-lg" />
            <input type="text" name="platform" value={formData.platform} onChange={handleChange} placeholder="Platform" className="border border-gray-300 p-3 rounded-lg" />
            <input type="text" name="subProject" value={formData.subProject} onChange={handleChange} placeholder="Sub Projects (comma separated)" className="border border-gray-300 p-3 rounded-lg" />
            <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" className="border border-gray-300 p-3 rounded-lg" />
            <input type="email" name="mail_id" value={formData.mail_id} onChange={handleChange} placeholder="Email Address" className="border border-gray-300 p-3 rounded-lg" />
          </div>

          <button onClick={handleSubmit} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all">
            {formData.id ? "Update Project" : "Save Project"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-blue-700 truncate leading-snug max-w-[90%]">

                
                👤 Client: <span className="text-gray-700">{project.clientname?.toUpperCase()}</span>
                
              </h3>
              <div className="relative inline-block text-left">
  <button
    onClick={() =>
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, showMenu: !p.showMenu } : { ...p, showMenu: false }
        )
      )
    }
    className="text-gray-600 hover:text-black text-xl"
  >
    ⋮
  </button>

  {project.showMenu && (
    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <button
        onClick={() => {
          handleEdit(project);
          navigate("/dashboard/projects/add", { state: { project } });
        }}
        className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
      >
        ✏️ Edit
      </button>
      <button
        onClick={() => handleDelete(project.id)}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        🗑️ Delete
      </button>
    </div>
  )}
</div>
            </div>

            <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-700">
              
              <div><span className="font-semibold">📝 Project Name:</span> {project.projectName?.toUpperCase()}</div>
              <div><span className="font-semibold">📂 Domain:</span> {project.projectdomain}</div>
              <div><span className="font-semibold">💻 Platform:</span> {project.platform}</div>
            </div>

            <div className="mt-4">
              <span className="block text-sm font-semibold text-gray-800 mb-1">📦 Sub-Products:</span>
              <div className="flex flex-wrap gap-2">
                {(project.subCategory || []).map((sub, idx) => (
                  <span key={idx} className="bg-indigo-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {project.contactDetails && project.contactDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">📞 Contact Details</h4>
                <div className="grid gap-2">
                  {project.contactDetails.map((contact, idx) => (
                    <div key={idx} className="bg-slate-100 p-3 rounded-lg shadow-inner text-sm">
                      <div><span className="font-semibold">📱 Phone:</span> {contact.contact_number}</div>
                      <div><span className="font-semibold">✉️ Email:</span> {contact.mail_id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;




