import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import { faChevronLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, PrimaryButton } from "../../components/buttons";
import { useNavigate } from "react-router-dom";
import { Input, Select } from "../../components/inputs";
import { toast } from "react-toastify";

const CreateScreen = () => {
  document.title = "Create Event";

  const navigate = useNavigate();
  const [createFormProcessing, setCreateFormProcessing] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    datetimeStarted: "",
    type: "",
    name: "",
    address: "",
    price: "",
    customerId: "",
    password: "",
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
      const response = await fetch("http://localhost:5000/event/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: {
            datetimeStarted: new Date(formData.datetimeStarted).toISOString(),
            type: formData.type,
            name: formData.name,
            address: formData.address,
            price: parseFloat(formData.price),
            balance: parseFloat(formData.price),
            customerId: formData.customerId,
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

  // customer

  const [customer, setCustomer] = useState<any>([]);
  const [loadedCustomer, setLoadedCustomer] = useState<boolean>(false);
  const [searchCustomerData, setSearchCustomerData] = useState({
    key: "",
    filterKey: "",
  });

  const [openRemoveCustomerModal, setOpenRemoveCustomerModal] =
    useState<boolean>(false);
  const [customerToRemove, setCustomerToRemove] = useState<string>("");
  const [removeCustomerProcessing, setRemoveCustomerProcessing] =
    useState<boolean>(false);

  const handleSearchCustomerKeyChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getCustomer = async () => {
    setLoadedCustomer(false);
    try {
      const response = await fetch("http://localhost:5000/customer/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: searchCustomerData.key,
          status: searchCustomerData.filterKey,
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
        console.log(res.data);
        setCustomer(res.data);
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

  useEffect(() => {
    getCustomer();
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
          {loadedCustomer ? (
            <form className="mx-auto w-full max-w-lg" onSubmit={handleOnSubmit}>
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Event Information</h2>
                <Select
                  topLeftLabel="Supplier"
                  id="customerId"
                  options={[
                    { label: "Select customer", value: "" },
                    ...customer.map((customer: any) => ({
                      label: `${customer.User.lastName}, ${customer.User.firstName} ${customer.User.middleName} ${customer.User.suffix}`,
                      value: customer.id,
                    })),
                  ]}
                  onChange={handleInputChange}
                />
                <Input
                  id="address"
                  topLeftLabel="Address"
                  onChange={handleInputChange}
                />
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    id="datetimeStarted"
                    topLeftLabel="Date Start"
                    onChange={handleInputChange}
                  />
                  <Input
                    type="number"
                    id="price"
                    topLeftLabel="Event price"
                    min={0}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    id="type"
                    topLeftLabel="Event type"
                    onChange={handleInputChange}
                  />
                  <Input
                    id="name"
                    topLeftLabel="Event name"
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CreateScreen;
