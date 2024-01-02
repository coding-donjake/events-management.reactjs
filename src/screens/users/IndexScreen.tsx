import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import { RowTable } from "../../components/tables";
import {
  Button,
  ErrorButton,
  ErrorIconButton,
  InfoIconButton,
} from "../../components/buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faEye,
  faFolderOpen,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, Search } from "../../components/inputs";
import { Modal } from "../../components/modals";

const IndexScreen = () => {
  document.title = "Users";

  const navigate = useNavigate();

  const [admin, setAdmin] = useState<any>([]);
  const [loadedAdmin, setLoadedAdmin] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    password: "",
  });
  const [searchAdminData, setSearchAdminData] = useState({
    key: "",
    filterKey: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchAdminKeyChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getAdmin = async () => {
    setLoadedAdmin(false);
    try {
      const response = await fetch("http://localhost:5000/admin/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: searchAdminData.key,
          status: searchAdminData.filterKey,
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
        setAdmin(res.data);
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

  const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
  const [userToRemove, setUserToRemove] = useState<string>("");
  const [removeUserProcessing, setRemoveUserProcessing] =
    useState<boolean>(false);

  const removeAdmin = async () => {
    if (removeUserProcessing) {
      return;
    }

    try {
      setRemoveUserProcessing(true);
      const response = await fetch("http://localhost:5000/admin/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          admin: {
            id: userToRemove,
            status: "removed",
          },
        }),
      });
      if (response.status === 401) {
        toast.error("Invalid operator credentials.");
        setRemoveUserProcessing(false);
        return;
      }
      if (response.status === 500) {
        setRemoveUserProcessing(false);
        toast.error("Internal server error!");
        console.log("Failed to remove admin.");
        return;
      }
      if (response.ok) {
        setRemoveUserProcessing(false);
        toast.success("Remove user success.");
        getAdmin();
        setOpenRemoveModal(false);
        return;
      }
      setRemoveUserProcessing(false);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setRemoveUserProcessing(false);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  useEffect(() => {
    getAdmin();
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
            <h1 className="flex-1 font-bold text-xl">Users List</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faPlus} />}
                content="Create User"
                onClick={() => navigate("create")}
              />
              <Search
                placeholder="Search..."
                options={[
                  { label: "No filter", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Removed", value: "removed" },
                ]}
                onChange={handleSearchAdminKeyChange}
                onClick={getAdmin}
              />
            </div>
          </div>
          {!loadedAdmin ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : admin.length <= 0 ? (
            <div className="py-10 text-gray-500 text-center">
              <span className="text-6xl">
                <FontAwesomeIcon icon={faFolderOpen} />
              </span>
              <p>No admin record found.</p>
            </div>
          ) : (
            <RowTable
              headers={["Username", "Full Name", "Sex", "Role", "Status", ""]}
              rows={admin.map((admin: any) => [
                admin.username,
                `${admin.User.lastName}, ${admin.User.firstName} ${admin.User.middleName} ${admin.User.suffix}`,
                admin.User.gender,
                admin.role,
                admin.status === "removed" ? (
                  <span className="text-red-500">{admin.status}</span>
                ) : (
                  admin.status
                ),
                <span className="flex gap-2 justify-end">
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={() => navigate(`update/${admin.id}`)}
                  />
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => navigate(`view/${admin.id}`)}
                  />
                  {admin.role === "owner" || admin.status === "removed" ? (
                    <ErrorIconButton
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      disabled={true}
                    />
                  ) : (
                    <ErrorIconButton
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={() => {
                        setUserToRemove(admin.id);
                        setOpenRemoveModal(true);
                      }}
                    />
                  )}
                </span>,
              ])}
            />
          )}
        </div>
      </div>
      {openRemoveModal ? (
        <Modal
          header="Remove User"
          content={
            <span>
              Are you sure you want to remove this user record? This cannot be
              undone.
              <br />
              <br />
              <hr />
              <div className="flex flex-col gap-4">
                <Input
                  type="password"
                  id="password"
                  topLeftLabel="Operator password"
                  onChange={handleInputChange}
                />
              </div>
            </span>
          }
          modalActions={[
            <ErrorButton
              icon={<FontAwesomeIcon icon={faCircleExclamation} />}
              content="Remove"
              processing={removeUserProcessing}
              onClick={removeAdmin}
            />,
          ]}
          onClose={() => setOpenRemoveModal(false)}
        />
      ) : null}
    </div>
  );
};

export default IndexScreen;
