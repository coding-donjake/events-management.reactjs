import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import { faChevronLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, PrimaryButton } from "../../components/buttons";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Select } from "../../components/inputs";
import { toast } from "react-toastify";
import { fromISOToDateInput } from "../../services/Conversion";

const UpdateScreen = () => {
  document.title = "Update Supply";

  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedSupply, setLoadedSupply] = useState<boolean>(false);
  const [updateFormProcessing, setUpdateFormProcessing] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    id: "",
    name: "",
    brand: "",
    type: "",
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

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (updateFormProcessing) {
      return;
    }

    for (const key in formData) {
      if (!formData[key]) {
        if (key != "middleName" && key != "suffix") {
          toast.error(
            `Please enter ${key.replace(/^\w/, (c) => c.toUpperCase())}`
          );
          return;
        }
      }
    }

    try {
      setUpdateFormProcessing(true);
      const response = await fetch("http://localhost:5000/supply/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supply: {
            id: formData.id,
            name: formData.name,
            brand: formData.brand,
            type: formData.type,
          },
          password: formData.password,
        }),
      });
      if (response.status === 401) {
        toast.error("Invalid operator credentials.");
        setUpdateFormProcessing(false);
        return;
      }
      if (response.status === 500) {
        toast.error("Internal server error!");
        setUpdateFormProcessing(false);
        return;
      }
      if (response.ok) {
        toast.success("Update supply success.");
        navigate(-1);
        return;
      }
      toast.error("Unkown error occured!");
      setUpdateFormProcessing(false);
    } catch (error) {
      toast.error("Request failed!");
      console.error("Network error:", error);
      setUpdateFormProcessing(false);
    }
  };

  useEffect(() => {
    selectSupply();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Supplies</h1>
        <hr />
        <br />
        <div className="p-6 bg-white rounded-xl shadow-xl">
          <div className="flex gap-4 mb-2">
            <h1 className="flex-1 font-bold text-xl">Update Form</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faChevronLeft} />}
                content="Back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
          <br />
          {!loadedSupply ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <form className="mx-auto w-full max-w-md" onSubmit={handleOnSubmit}>
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Supply Information</h2>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    topLeftLabel="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <Input
                    id="brand"
                    topLeftLabel="Brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </div>
                <Input
                  id="type"
                  topLeftLabel="Type"
                  value={formData.type}
                  onChange={handleInputChange}
                />
              </div>
              <br />
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Confirm Operator</h2>
                <Input
                  type="password"
                  id="password"
                  topLeftLabel="Operator password"
                  onChange={handleInputChange}
                />
              </div>
              <br />
              <div className="flex justify-end">
                <PrimaryButton
                  type="submit"
                  icon={<FontAwesomeIcon icon={faFloppyDisk} />}
                  content="Save"
                  processing={updateFormProcessing}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateScreen;
