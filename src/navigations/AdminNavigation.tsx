import React from "react";
import Logo from "../assets/logo.jpg";
import { Button, ErrorButton, NeutralButton } from "../components/buttons";
import {
  faBoxesStacked,
  faChartPie,
  faFlag,
  faRightFromBracket,
  faUserGroup,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const AdminNavigation = () => {
  const navigate = useNavigate();
  const currentURL = window.location.href;

  return (
    <div className="flex flex-col flex-shrink-0 gap-4 w-60 h-screen p-4 bg-white hide-in-print">
      <div>
        <img className="w-full" src={Logo} alt="Logo" />
      </div>
      <h1 className="font-bold text-3xl text-center">
        {localStorage.getItem("username")}
      </h1>
      <div className="flex flex-col gap-2">
        {currentURL.includes(":3000/dashboard") ? (
          <NeutralButton
            icon={<FontAwesomeIcon icon={faChartPie} />}
            content="Dashboard"
          />
        ) : (
          <Button
            icon={<FontAwesomeIcon icon={faChartPie} />}
            content="Dashboard"
            onClick={() => navigate("/dashboard")}
          />
        )}
        {currentURL.includes(":3000/users") ? (
          <NeutralButton
            icon={<FontAwesomeIcon icon={faUserGroup} />}
            content="Users"
          />
        ) : (
          <Button
            icon={<FontAwesomeIcon icon={faUserGroup} />}
            content="Users"
            onClick={() => navigate("/users")}
          />
        )}
        {currentURL.includes(":3000/customers") ? (
          <NeutralButton
            icon={<FontAwesomeIcon icon={faUsers} />}
            content="Customers"
          />
        ) : (
          <Button
            icon={<FontAwesomeIcon icon={faUsers} />}
            content="Customers"
            onClick={() => navigate("/customers")}
          />
        )}
        {currentURL.includes(":3000/supplies") ? (
          <NeutralButton
            icon={<FontAwesomeIcon icon={faBoxesStacked} />}
            content="Supplies"
          />
        ) : (
          <Button
            icon={<FontAwesomeIcon icon={faBoxesStacked} />}
            content="Supplies"
            onClick={() => navigate("/supplies")}
          />
        )}
        {currentURL.includes(":3000/events") ? (
          <NeutralButton
            icon={<FontAwesomeIcon icon={faFlag} />}
            content="Events"
          />
        ) : (
          <Button
            icon={<FontAwesomeIcon icon={faFlag} />}
            content="Events"
            onClick={() => navigate("/events")}
          />
        )}
        <ErrorButton
          icon={<FontAwesomeIcon icon={faRightFromBracket} />}
          content="Log Out"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default AdminNavigation;
