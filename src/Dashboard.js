import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="h-[calc(100%-2rem)]">
        <div className="absolute bottom-16 right-16">
          <Button variant="contained" onClick={() => navigate("/imageupload")}>
            Create new
          </Button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
