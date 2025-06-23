import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ImgUpload from "./ImgUpload";
import Performance from "./DashBoard/Performance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

function Profile() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }

    async function fetchUserDetails() {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchUserDetails();
  }, [authToken, navigate, id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        localStorage.setItem("profileImage", imageData);
        setProfileImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(to top,rgb(243, 182, 77),rgb(143, 217, 249))",
      minHeight: "100vh",
      paddingBottom: "50px"
    }}>
      <Navbar page="profile" />
        <div style={{paddingTop:"90px"}}>
            <div style={{
            maxWidth: "950px",
            margin: "80px auto",
            background: "linear-gradient(135deg,rgb(255, 255, 255),rgb(250, 250, 250))",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "left"
          }}>

            {/* Profile Image */}
            <div style={{
              flex: "1",
              minWidth: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <div style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid teal",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}>
                <ImgUpload
                  onChange={handleImageChange}
                  src={profileImage}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* User Details */}
            <div style={{
              flex: "2",
              minWidth: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "10px 20px"
            }}>
              <h2 style={{
                color: "teal",
                fontWeight: "bold",
                fontSize: "28px",
                marginBottom: "25px",
                textAlign: "center",
                paddingTop:"10px",
                paddingright:"10px",
                color: "darkblue"
              }}>
                {userDetails?.username}
              </h2>

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ flex: "1", minWidth: "220px", marginBottom: "15px" }}>
                  <p style={{paddingTop:"10px"}}><strong>Gender:</strong> {userDetails?.gender}</p>
                  <p><strong>Date of Birth:</strong> {userDetails?.dob}</p>
                  <p><strong>Profession:</strong> {userDetails?.profession}</p>
                  <p><strong>Learning Courses:</strong> {userDetails?.learningCourses?.length}</p>
                </div>

                <div style={{ flex: "1", minWidth: "220px", marginBottom: "15px" }}>
                  <p style={{paddingTop:"10px"}}><strong>Email:</strong> {userDetails?.email}</p>
                  <p><strong>Phone Number:</strong> {userDetails?.phno}</p>
                </div>
              </div>

              {/* Social Links */}
              <div style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                gap: "20px"
              }}>
                {userDetails?.linkedin_url && (
                  <a href={userDetails.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "#0077B5" }}>
                    <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: "32px", cursor: "pointer" }} />
                  </a>
                )}
                {userDetails?.github_url && (
                  <a href={userDetails.github_url} target="_blank" rel="noopener noreferrer" style={{ color: "darkviolet" }}>
                    <FontAwesomeIcon icon={faGithub} style={{ fontSize: "32px", cursor: "pointer" }} />
                  </a>
                )}
              </div>
            </div>
        </div>
      </div>
      

      <Performance />
    </div>
  );
}

export default Profile;
