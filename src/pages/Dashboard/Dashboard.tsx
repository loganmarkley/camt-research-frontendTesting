import React, { useEffect, useState } from "react";
import { Box } from "@mui/joy";
import Sidebar from "./Sidebar";
import { tools } from "./tools/tools";
import { Outlet } from "react-router";
import getUserRole from "../../common/getUserRole";
import { ACCESS_LEVELS, Tool } from "./types";
import { useMediaQuery } from "@mui/material";
import DynamicBreadcrumbs from "../../components/Breadcrumbs";
import { useLocation } from "react-router-dom";
import Data from "./tools/Data";

const Dashboard: React.FC = () => {
  const [renderTool, setRenderTool] = useState<Tool[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width:1025px)");
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await getUserRole();
      setRole(userRole);
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (role) {
      const toolsForRole = tools.filter(
        (tool) =>
          tool.accessLevel.includes(ACCESS_LEVELS.ALL) ||
          tool.accessLevel.includes(role as ACCESS_LEVELS)
      );
      setRenderTool(toolsForRole);
    }
  }, [role]);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Sidebar tools={renderTool} isDesktop={isDesktop} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            marginLeft: { xs: 0, md: isDesktop ? "60px" : "0px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "flex-start",
          }}
        >
          {location.pathname === "/dashboard" && <Data />}
          <Box sx={{ mb: 2, mt: "20px" }}>
            <DynamicBreadcrumbs />
          </Box>

          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
