import React from 'react';
import { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';

import DeleteUser from "./DeleteUser";
import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChangePassword";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function UserSettings() {
  const [value, setValue] = React.useState(0);

  const tabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <div className="bg-lightgray h-screen w-screen overflow-auto">
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={tabChange} aria-label="basic tabs example">
          <Tab label="Manage account" {...a11yProps(0)} />
          <Tab label="Delete Account" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}  className="flex flex-wrap">
            <Box className="flex">
                <ChangePassword />
                <ChangeUsername />
            </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DeleteUser />
      </CustomTabPanel>
    </Box>
    </div>
  );
}
