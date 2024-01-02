import React, { useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import { faChevronLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, PrimaryButton } from "../../components/buttons";
import { useNavigate } from "react-router-dom";
import { Input, Select } from "../../components/inputs";
import { toast } from "react-toastify";

const CreateScreen = () => {
  document.title = "Create Customer";

  const navigate = useNavigate();
  const [createFormProcessing, setCreateFormProcessing] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
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

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createFormProcessing) {
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
      setCreateFormProcessing(true);
      const response = await fetch("http://localhost:5000/customer/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            lastName: formData.lastName,
            firstName: formData.firstName,
            middleName: formData.middleName,
            suffix: formData.suffix,
            gender: formData.gender,
            birthDate: new Date(formData.birthDate).toISOString(),
          },
          customer: {
            address: formData.address,
          },
          email: {
            content: formData.email,
          },
          simcard: {
            content: formData.phone,
          },
          password: formData.password,
        }),
      });
      if (response.status === 401) {
        toast.error("Invalid operator credentials.");
        setCreateFormProcessing(false);
        return;
      }
      if (response.status === 500) {
        toast.error("Internal server error!");
        setCreateFormProcessing(false);
        return;
      }
      if (response.ok) {
        toast.success("Create user success.");
        navigate(-1);
        return;
      }
      toast.error("Unkown error occured!");
      setCreateFormProcessing(false);
    } catch (error) {
      toast.error("Request failed!");
      console.error("Network error:", error);
      setCreateFormProcessing(false);
    }
  };

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Customers</h1>
        <hr />
        <br />
        <div className="p-6 bg-white rounded-xl shadow-xl">
          <div className="flex gap-4 mb-2">
            <h1 className="flex-1 font-bold text-xl">Create Form</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faChevronLeft} />}
                content="Back"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
          <br />
          <form className="mx-auto w-full max-w-md" onSubmit={handleOnSubmit}>
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-center">Personal Information</h2>
              <div className="flex gap-2">
                <Input
                  id="lastName"
                  topLeftLabel="Last name"
                  onChange={handleInputChange}
                />
                <Input
                  id="firstName"
                  topLeftLabel="First name"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  id="middleName"
                  topLeftLabel="Middle name (optional)"
                  onChange={handleInputChange}
                />
                <Input
                  id="suffix"
                  topLeftLabel="Suffix (optional)"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  id="gender"
                  topLeftLabel="Sex"
                  options={[
                    { label: "Select sex", value: "" },
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  onChange={handleInputChange}
                />
                <Input
                  type="date"
                  id="birthDate"
                  topLeftLabel="Birth date"
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
                onChange={handleInputChange}
              />
              <div className="flex gap-2">
                <Input
                  id="email"
                  topLeftLabel="Email"
                  onChange={handleInputChange}
                />
                <Input
                  id="phone"
                  topLeftLabel="Phone"
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
                processing={createFormProcessing}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateScreen;
