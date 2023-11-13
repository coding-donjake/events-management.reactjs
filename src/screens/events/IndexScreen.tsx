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
  document.title = "Events";

  const navigate = useNavigate();

  const [event, setEvent] = useState<any>([]);
  const [loadedEvent, setLoadedEvent] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    password: "",
  });
  const [searchEventData, setSearchEventData] = useState({
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

  const handleSearchEventKeyChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getEvent = async () => {
    setLoadedEvent(false);
    try {
      const response = await fetch("http://localhost:5000/event/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: searchEventData.key,
          status: searchEventData.filterKey,
        }),
      });
      if (response.status === 500) {
        setLoadedEvent(true);
        toast.error("Internal server error!");
        console.log("Failed to load event.");
        return;
      }
      if (response.ok) {
        const res = await response.json();
        console.log(res.data);
        setEvent(res.data);
        setLoadedEvent(true);
        return;
      }
      setLoadedEvent(true);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setLoadedEvent(true);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
  const [eventToRemove, setUserToRemove] = useState<string>("");
  const [removeUserProcessing, setRemoveUserProcessing] =
    useState<boolean>(false);

  const removeEvent = async () => {
    if (removeUserProcessing) {
      return;
    }

    try {
      setRemoveUserProcessing(true);
      const response = await fetch("http://localhost:5000/event/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          event: {
            id: eventToRemove,
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
        console.log("Failed to remove event.");
        return;
      }
      if (response.ok) {
        setRemoveUserProcessing(false);
        toast.success("Remove event success.");
        getEvent();
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
    getEvent();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Events</h1>
        <hr />
        <br />
        <div className="p-6 bg-white rounded-xl shadow-xl">
          <div className="flex gap-4 mb-2">
            <h1 className="flex-1 font-bold text-xl">Events List</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faPlus} />}
                content="Create Event"
                onClick={() => navigate("create")}
              />
              <Search
                placeholder="Search..."
                options={[
                  { label: "No filter", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Removed", value: "removed" },
                ]}
                onChange={handleSearchEventKeyChange}
                onClick={getEvent}
              />
            </div>
          </div>
          {!loadedEvent ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : event.length <= 0 ? (
            <div className="py-10 text-gray-500 text-center">
              <span className="text-6xl">
                <FontAwesomeIcon icon={faFolderOpen} />
              </span>
              <p>No event record found.</p>
            </div>
          ) : (
            <RowTable
              headers={["Date Start", "Date End", "Type", "Name", "Status", ""]}
              rows={event.map((event: any) => [
                event.datetimeStarted,
                event.datetimeEnded,
                event.type,
                event.name,
                event.status === "removed" ? (
                  <span className="text-red-500">{event.status}</span>
                ) : (
                  event.status
                ),
                <span className="flex gap-2 justify-end">
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={() => navigate(`update/${event.id}`)}
                  />
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => navigate(`view/${event.id}`)}
                  />
                  {event.role === "owner" || event.status === "removed" ? (
                    <ErrorIconButton
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      disabled={true}
                    />
                  ) : (
                    <ErrorIconButton
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={() => {
                        setUserToRemove(event.id);
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
              Are you sure you want to remove this event record? This cannot be
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
              onClick={removeEvent}
            />,
          ]}
          onClose={() => setOpenRemoveModal(false)}
        />
      ) : null}
    </div>
  );
};

export default IndexScreen;
