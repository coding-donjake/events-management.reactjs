import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import {
  faChevronLeft,
  faEye,
  faFolderOpen,
  faList,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ErrorIconButton,
  InfoIconButton,
} from "../../components/buttons";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Select } from "../../components/inputs";
import { toast } from "react-toastify";
import {
  fromISOToDate,
  fromISOToDateTime12hr,
} from "../../services/Conversion";
import { RowTable } from "../../components/tables";

const ViewScreen = () => {
  document.title = "View Event";

  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedEvent, setLoadedEvent] = useState<boolean>(false);
  const [event, setEvent] = useState<any>();

  const selectEvent = async () => {
    setLoadedEvent(false);
    try {
      const response = await fetch("http://localhost:5000/event/select", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: { id: id },
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

  useEffect(() => {
    selectEvent();
  }, []);

  useEffect(() => {
    console.log("-------------");
    console.log(event);
    console.log("-------------");
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
            <h1 className="flex-1 font-bold text-xl">Event Workspace</h1>
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
          {!loadedEvent ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <div>
              <div className="flex gap-4">
                <Input
                  id="datetimeStarted"
                  topLeftLabel="Start date"
                  value={fromISOToDateTime12hr(event.datetimeStarted)}
                  onChange={() => {}}
                  readonly={true}
                />
                <Input
                  id="datetimeEnded"
                  topLeftLabel="End date"
                  value={fromISOToDateTime12hr(event.datetimeEnded)}
                  onChange={() => {}}
                  readonly={true}
                />
              </div>
              <div className="flex gap-4">
                <Input
                  id="type"
                  topLeftLabel="Event type"
                  value={event.type}
                  onChange={() => {}}
                  readonly={true}
                />
                <Input
                  id="name"
                  topLeftLabel="Event name"
                  value={event.name}
                  onChange={() => {}}
                  readonly={true}
                />
              </div>
              <Input
                id="customer"
                topLeftLabel="Customer"
                value={`${event.Customer.User.lastName}, ${event.Customer.User.firstName} ${event.Customer.User.middleName} ${event.Customer.User.suffix}`}
                onChange={() => {}}
                readonly={true}
              />
              <Input
                id="address"
                topLeftLabel="Address"
                value={event.address}
                onChange={() => {}}
                readonly={true}
              />
              <br />
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-gray-100 rounded-xl">
                  <div className="flex gap-2">
                    <h2 className="flex-1 font-bold text-xl">Supplies</h2>
                    <div>
                      <Button
                        icon={<FontAwesomeIcon icon={faPen} />}
                        content="Update"
                        onClick={() => navigate("event-supplies")}
                      />
                    </div>
                  </div>
                  {event.EventSupply.length > 0 ? (
                    <RowTable
                      headers={["Name", "Quantity"]}
                      rows={event.EventSupply.map((x: any) => [
                        x.Supply.name,
                        x.quantity > 0
                          ? `${x.quantity} pcs`
                          : `${x.quantity} pc`,
                      ])}
                    />
                  ) : (
                    <div className="py-10 text-gray-500 text-center">
                      <span className="text-6xl">
                        <FontAwesomeIcon icon={faFolderOpen} />
                      </span>
                      <p>No supplies for this event.</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4 bg-gray-100 rounded-xl">
                  <div className="flex gap-2">
                    <h2 className="flex-1 font-bold text-xl">Payments</h2>
                    <div>
                      <Button
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        content="New"
                        onClick={() => navigate("add-payment")}
                      />
                    </div>
                  </div>
                  {event.EventSupply.length > 0 ? (
                    <RowTable
                      headers={["Name", "Quantity"]}
                      rows={event.EventSupply.map((x: any) => [
                        x.Supply.name,
                        x.quantity > 0
                          ? `${x.quantity} pcs`
                          : `${x.quantity} pc`,
                      ])}
                    />
                  ) : (
                    <div className="py-10 text-gray-500 text-center">
                      <span className="text-6xl">
                        <FontAwesomeIcon icon={faFolderOpen} />
                      </span>
                      <p>No supplies for this event.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewScreen;
