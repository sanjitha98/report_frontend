import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

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
    client_name: "",
    contact_number: "",
    mail_id: "",
  });

  useEffect(() => {
    // Fetch projects and check for form visibility based on path
    fetchProjects();
    if (location.pathname === "/dashboard/projects/add") {
      setShowForm(true);
    } else {
      setShowForm(false); // optional: reset if navigating away from '/add'
    }
  }, [location.pathname]);

  const fetchProjects = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get_projects_list`
      );
      console.log("Fetched Projects:", response.data.data);
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      id: project.id,
      project: project.projectName || "",
      subProject: Array.isArray(project.subCategory)
        ? project.subCategory.join(", ")
        : "",
      client_name: project.contact_details?.[0]?.client_name || "",
      contact_number: project.contact_details?.[0]?.contact_number || "",
      mail_id: project.contact_details?.[0]?.mail_id || "",
    });
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
      idRef: null, // Optional reference
      subProject: formData.subProject
        ? formData.subProject.split(",").map((s) => s.trim())
        : [],
      contact_details: [
        {
          client_name: formData.client_name || null,
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
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/delete_project`, {
        id,
      });

      setSuccessMessage("Project deleted successfully.");
      fetchProjects(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r to-indigo-100 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-black-800 mb-6">
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
        <div className="bg-green-100 text-blue-800 p-4 rounded-xl shadow-md mb-6 text-lg text-center">
          {successMessage}
        </div>
      )}

      {/* Project List Display - Two Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            <div className="flex justify-between items-start">
              <span className="text-2xl font-semibold text-gray-800">{project.projectName}</span>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    handleEdit(project);
                    navigate("/dashboard/projects/add", { state: { project } });
                  }}
                  className="text-indigo-600 hover:underline text-sm font-medium transition-all hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500 hover:underline text-sm font-medium transition-all hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Sub-Projects Section */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Sub-Products:</h3>
              <ul className="ml-6 mt-2 list-disc text-lg text-gray-700">
                {(project.subCategory || []).map((sub, idx) => (
                  <li key={idx} className="mt-2">{sub}</li>
                ))}
              </ul>
            </div>

            {/* Conditionally render the Contact Details Section */}
            {project.contactDetails && project.contactDetails.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">Contact Details:</h3>
                {(project.contactDetails || []).map((contact, idx) => (
                  <div key={idx} className="ml-6 mt-2 text-sm text-gray-600">
                    <p>👤 <strong>Client Name:</strong> {contact.client_name}</p>
                    <p>📞 <strong>Contact Number:</strong> {contact.contact_number}</p>
                    <p>📧 <strong>Email:</strong> {contact.mail_id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
