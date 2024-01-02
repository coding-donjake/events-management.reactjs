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
  document.title = "Update Customer";

  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedCustomer, setLoadedCustomer] = useState<boolean>(false);
  const [updateFormProcessing, setUpdateFormProcessing] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    id: "",
    userId: "",
    emailId: "",
    simcardId: "",
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
    gender: "",
    birthDate: "",
    address: "",
    email: "",
    phone: "",
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

  const selectCustomer = async () => {
    setLoadedCustomer(false);
    try {
      const response = await fetch("http://localhost:5000/customer/select", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: { id: id },
        }),
      });
      if (response.status === 500) {
        setLoadedCustomer(true);
        toast.error("Internal server error!");
        console.log("Failed to load customer.");
        return;
      }
      if (response.ok) {
        const res = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          ["id"]: res.data.id,
          ["userId"]: res.data.User.id,
          ["emailId"]: res.data.Email.id,
          ["simcardId"]: res.data.Simcard.id,
          ["lastName"]: res.data.User.lastName,
          ["firstName"]: res.data.User.firstName,
          ["middleName"]: res.data.User.middleName,
          ["suffix"]: res.data.User.suffix,
          ["gender"]: res.data.User.gender,
          ["birthDate"]: fromISOToDateInput(res.data.User.birthDate),
          ["address"]: res.data.address,
          ["email"]: res.data.Email.content,
          ["phone"]: res.data.Simcard.content,
        }));
        setLoadedCustomer(true);
        return;
      }
      setLoadedCustomer(true);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setLoadedCustomer(true);
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
      const response = await fetch("http://localhost:5000/customer/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            id: formData.userId,
            lastName: formData.lastName,
            firstName: formData.firstName,
            middleName: formData.middleName,
            suffix: formData.suffix,
            gender: formData.gender,
            birthDate: new Date(formData.birthDate).toISOString(),
          },
          customer: {
            id: formData.id,
            address: formData.address,
          },
          email: {
            id: formData.emailId,
            content: formData.email,
          },
          simcard: {
            id: formData.simcardId,
            content: formData.phone,
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
        toast.success("Update customer success.");
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
    selectCustomer();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Customers</h1>
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
          {!loadedCustomer ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <form className="mx-auto w-full max-w-md" onSubmit={handleOnSubmit}>
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Personal Information</h2>
                <div className="flex gap-2">
                  <Input
                    id="lastName"
                    topLeftLabel="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  <Input
                    id="firstName"
                    topLeftLabel="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    id="middleName"
                    topLeftLabel="Middle name (optional)"
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                  <Input
                    id="suffix"
                    topLeftLabel="Suffix (optional)"
                    value={formData.suffix}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    id="gender"
                    topLeftLabel="Sex"
                    options={[
                      { label: "Select gender", value: "" },
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                    value={formData.gender}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="date"
                    id="birthDate"
                    topLeftLabel="Birth date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <br />
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Contact Information</h2>
                <Input
                  id="address"
                  topLeftLabel="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <div className="flex gap-2">
                  <Input
                    id="email"
                    topLeftLabel="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <Input
                    id="phone"
                    topLeftLabel="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
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
