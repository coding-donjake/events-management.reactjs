import React, { useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import { faChevronLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, PrimaryButton } from "../../components/buttons";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/inputs";
import { toast } from "react-toastify";
import { fromISOToDateTimeInput } from "../../services/Conversion";

const CreateScreen = () => {
  document.title = "Create Payment";

  const { id } = useParams();
  const navigate = useNavigate();
  const [createFormProcessing, setCreateFormProcessing] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    datetimePayment: "",
    amount: "",
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

    setFormData((prevData) => ({
      ...prevData,
      ["eventId"]: id!,
    }));

    try {
      setCreateFormProcessing(true);
      const response = await fetch("http://localhost:5000/payment/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: {
            id: id,
          },
          payment: {
            datetimePayment: new Date(formData.datetimePayment).toISOString(),
            amount: parseFloat(formData.amount),
            eventId: formData.eventId,
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
      if (response.status === 501) {
        toast.error("Payment exceeds the balance.");
        setCreateFormProcessing(false);
        return;
      }
      if (response.ok) {
        toast.success("Create payment success.");
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
        <h1 className="flex-1 font-bold text-3xl">Payments</h1>
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
          <form className="mx-auto w-full max-w-lg" onSubmit={handleOnSubmit}>
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-center">Payment Information</h2>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  id="datetimePayment"
                  topLeftLabel="Date paid"
                  onChange={handleInputChange}
                />
                <Input
                  type="number"
                  id="amount"
                  topLeftLabel="Amount"
                  min={0}
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
