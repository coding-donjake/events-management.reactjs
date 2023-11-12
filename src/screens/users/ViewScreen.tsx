import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import {
  faChevronLeft,
  faFloppyDisk,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, PrimaryButton } from "../../components/buttons";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Select } from "../../components/inputs";
import { toast } from "react-toastify";
import { fromISOToDate } from "../../services/Conversion";

const ViewScreen = () => {
  document.title = "View User";

  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedAdmin, setLoadedAdmin] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    id: "",
    username: "",
    password: "",
    role: "",
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
    gender: "",
    birthDate: "",
  });

  const selectAdmin = async () => {
    setLoadedAdmin(false);
    try {
      const response = await fetch("/admin/select", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin: { id: id },
        }),
      });
      if (response.status === 500) {
        setLoadedAdmin(true);
        toast.error("Internal server error!");
        console.log("Failed to load admin.");
        return;
      }
      if (response.ok) {
        const res = await response.json();
        console.log(res.data);
        setFormData((prevData) => ({
          ...prevData,
          ["id"]: res.data.id,
          ["userId"]: res.data.User.id,
          ["username"]: res.data.username,
          ["role"]: res.data.role,
          ["lastName"]: res.data.User.lastName,
          ["firstName"]: res.data.User.firstName,
          ["middleName"]: res.data.User.middleName,
          ["suffix"]: res.data.User.suffix,
          ["gender"]: res.data.User.gender,
          ["birthDate"]: fromISOToDate(res.data.User.birthDate),
        }));
        setLoadedAdmin(true);
        return;
      }
      setLoadedAdmin(true);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setLoadedAdmin(true);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  useEffect(() => {
    selectAdmin();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Users</h1>
        <hr />
        <br />
        <div className="p-6 bg-white rounded-xl shadow-xl">
          <div className="flex gap-4 mb-2">
            <h1 className="flex-1 font-bold text-xl">View Form</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faChevronLeft} />}
                content="Back"
                onClick={() => navigate(-1)}
              />
              <Button
                icon={<FontAwesomeIcon icon={faList} />}
                content="View Logs"
                onClick={() => navigate("logs")}
              />
            </div>
          </div>
          <br />
          {!loadedAdmin ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <form className="mx-auto w-full max-w-md">
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Account Information</h2>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    topLeftLabel="Username"
                    value={formData.username}
                    onChange={() => {}}
                    readonly={true}
                  />
                  <Input
                    id="role"
                    topLeftLabel="Role"
                    value={formData.role}
                    onChange={() => {}}
                    readonly={true}
                  />
                </div>
              </div>
              <br />
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Personal Information</h2>
                <div className="flex gap-2">
                  <Input
                    id="lastName"
                    topLeftLabel="Last name"
                    value={formData.lastName}
                    onChange={() => {}}
                    readonly={true}
                  />
                  <Input
                    id="firstName"
                    topLeftLabel="First name"
                    value={formData.firstName}
                    onChange={() => {}}
                    readonly={true}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    id="middleName"
                    topLeftLabel="Middle name (optional)"
                    value={formData.middleName}
                    onChange={() => {}}
                    readonly={true}
                  />
                  <Input
                    id="suffix"
                    topLeftLabel="Suffix (optional)"
                    value={formData.suffix}
                    onChange={() => {}}
                    readonly={true}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    id="gender"
                    topLeftLabel="Gender"
                    options={[
                      { label: "Select gender", value: "" },
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                    value={formData.gender}
                    onChange={() => {}}
                    readonly={true}
                  />
                  <Input
                    type="text"
                    id="birthDate"
                    topLeftLabel="Birth date"
                    value={formData.birthDate}
                    onChange={() => {}}
                    readonly={true}
                  />
                </div>
              </div>
              <br />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewScreen;
