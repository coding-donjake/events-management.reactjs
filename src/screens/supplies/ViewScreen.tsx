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
  document.title = "View Supply";

  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedSupply, setLoadedSupply] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    id: "",
    name: "",
    brand: "",
    type: "",
  });

  const selectSupply = async () => {
    setLoadedSupply(false);
    try {
      const response = await fetch("http://localhost:5000/supply/select", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supply: { id: id },
        }),
      });
      if (response.status === 500) {
        setLoadedSupply(true);
        toast.error("Internal server error!");
        console.log("Failed to load supply.");
        return;
      }
      if (response.ok) {
        const res = await response.json();
        console.log(res.data);
        setFormData((prevData) => ({
          ...prevData,
          ["id"]: res.data.id,
          ["name"]: res.data.name,
          ["brand"]: res.data.brand,
          ["type"]: res.data.type,
        }));
        setLoadedSupply(true);
        return;
      }
      setLoadedSupply(true);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setLoadedSupply(true);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  useEffect(() => {
    selectSupply();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Supplys</h1>
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
          {!loadedSupply ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <form className="mx-auto w-full max-w-md">
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Supply Information</h2>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    topLeftLabel="Name"
                    value={formData.name}
                    onChange={() => {}}
                    readonly={true}
                  />
                  <Input
                    id="brand"
                    topLeftLabel="Brand"
                    value={formData.brand}
                    onChange={() => {}}
                    readonly={true}
                  />
                </div>
                <Input
                  id="type"
                  topLeftLabel="Type"
                  value={formData.type}
                  onChange={() => {}}
                  readonly={true}
                />
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
