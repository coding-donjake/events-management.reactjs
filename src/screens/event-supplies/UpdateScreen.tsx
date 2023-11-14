import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import {
  faChevronLeft,
  faFloppyDisk,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ErrorIconButton,
  InfoButton,
  InfoIconButton,
  PrimaryButton,
} from "../../components/buttons";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Select } from "../../components/inputs";
import { toast } from "react-toastify";
import {
  fromISOToDate,
  fromISOToDateInput,
  fromISOToDateTimeInput,
} from "../../services/Conversion";
import { RowTable } from "../../components/tables";

const UpdateScreen = () => {
  document.title = "Update Event";

  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedEvent, setLoadedEvent] = useState<boolean>(false);
  const [supplyId, setSupplyId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [updateFormProcessing, setUpdateFormProcessing] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string | object;
    id: string;
    type: string;
    name: string;
    eventSupplies: object;
  }>({
    id: "",
    type: "",
    name: "",
    eventSupplies: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "supplyId") {
      setSupplyId(value);
      return;
    }
    if (name === "quantity") {
      setQuantity(parseInt(value));
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
        setFormData((prevData) => ({
          ...prevData,
          ["id"]: res.data.id,
          ["type"]: res.data.type,
          ["name"]: res.data.name,
          ["eventSupplies"]: res.data.EventSupply.map((child: any) => {
            console.log("target:");
            console.log(child);
            return {
              supplyId: child.Supply.id,
              quantity: child.quantity,
            };
          }),
        }));
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
      const response = await fetch("http://localhost:5000/event/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: {
            id: formData.id,
          },
          eventSupply: formData.eventSupplies,
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
        toast.success("Update event success.");
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

  const insertEventSupplies = () => {
    if (supplyId === "") {
      return;
    }
    const newSupply = { supplyId: supplyId, quantity: quantity };
    const existingSupplies = formData.eventSupplies;
    const existingIndex = (existingSupplies as any).findIndex(
      (supply: { supplyId: string }) => supply.supplyId === supplyId
    );
    if (existingIndex !== -1) {
      (existingSupplies as any)[existingIndex].quantity += quantity;
    } else {
      (existingSupplies as any).push(newSupply);
    }
    console.log(existingSupplies);
    setFormData((prevData) => ({
      ...prevData,
      eventSupplies: existingSupplies,
    }));
  };

  const updateQuantity = (id: string, offset: number) => {
    const existingSupplies = formData.eventSupplies;
    const existingIndex = (existingSupplies as any).findIndex(
      (supply: { supplyId: string }) => supply.supplyId === id
    );
    (existingSupplies as any)[existingIndex].quantity += offset;
    if ((existingSupplies as any)[existingIndex].quantity <= 0) {
      (existingSupplies as any)[existingIndex].quantity = 1;
    }
    setFormData((prevData) => ({
      ...prevData,
      ["eventSupplies"]: existingSupplies,
    }));
  };

  const removeSupply = (id: string) => {
    const existingSupplies = formData.eventSupplies;
    const existingIndex = (existingSupplies as any).findIndex(
      (supply: { supplyId: string }) => supply.supplyId === id
    );
    if (existingIndex !== -1) {
      (existingSupplies as any).splice(existingIndex, 1);
    }
    setFormData((prevData) => ({
      ...prevData,
      ["eventSupplies"]: existingSupplies,
    }));
  };

  // supplier

  const [supplier, setSupplier] = useState<any>([]);
  const [loadedSupplier, setLoadedSupplier] = useState<boolean>(false);
  const [searchSupplierData, setSearchSupplierData] = useState({
    key: "",
    filterKey: "",
  });

  const [openRemoveSupplierModal, setOpenRemoveSupplierModal] =
    useState<boolean>(false);
  const [supplierToRemove, setSupplierToRemove] = useState<string>("");
  const [removeSupplierProcessing, setRemoveSupplierProcessing] =
    useState<boolean>(false);

  const handleSearchSupplierKeyChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getSupplier = async () => {
    setLoadedSupplier(false);
    try {
      const response = await fetch("http://localhost:5000/supplier/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: searchSupplierData.key,
          status: searchSupplierData.filterKey,
        }),
      });
      if (response.status === 500) {
        setLoadedSupplier(true);
        toast.error("Internal server error!");
        console.log("Failed to load supplier.");
        return;
      }
      if (response.ok) {
        const res = await response.json();
        console.log(res.data);
        setSupplier(res.data);
        setLoadedSupplier(true);
        return;
      }
      setLoadedSupplier(true);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setLoadedSupplier(true);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  // supply

  const [supply, setSupply] = useState<any>([]);
  const [loadedSupply, setLoadedSupply] = useState<boolean>(false);
  const [searchSupplyData, setSearchSupplyData] = useState({
    key: "",
    filterKey: "",
  });

  const [openRemoveSupplyModal, setOpenRemoveSupplyModal] =
    useState<boolean>(false);
  const [supplyToRemove, setSupplyToRemove] = useState<string>("");
  const [removeSupplyProcessing, setRemoveSupplyProcessing] =
    useState<boolean>(false);

  const handleSearchSupplyKeyChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchSupplyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getSupply = async () => {
    setLoadedSupply(false);
    try {
      const response = await fetch("http://localhost:5000/supply/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: searchSupplyData.key,
          status: searchSupplyData.filterKey,
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
        setSupply(res.data);
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
    getSupply();
    selectEvent();
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
          {!loadedEvent || !loadedSupply ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <form className="mx-auto w-full max-w-lg" onSubmit={handleOnSubmit}>
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Event Information</h2>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    topLeftLabel="Event type"
                    value={formData.type}
                    onChange={handleInputChange}
                    readonly={true}
                  />
                  <Input
                    id="datetimeExpected"
                    topLeftLabel="Event name"
                    value={formData.name}
                    onChange={handleInputChange}
                    readonly={true}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    topLeftLabel="Supply"
                    id="supplyId"
                    options={[
                      { label: "Select supply", value: "" },
                      ...supply.map((supply: any) => ({
                        label: supply.name,
                        value: supply.id,
                      })),
                    ]}
                    onChange={handleInputChange}
                  />
                  <span className="flex gap-2 items-end flex-1">
                    <Input
                      type="number"
                      id="quantity"
                      topLeftLabel="Quantity"
                      min={1}
                      value="1"
                      onChange={handleInputChange}
                    />
                    <InfoButton
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={insertEventSupplies}
                    />
                  </span>
                </div>
                {(formData.eventSupplies as any).length > 0 ? (
                  <RowTable
                    headers={["Supply", "Quantity", ""]}
                    rows={(formData.eventSupplies as any).map((temp: any) => [
                      `${
                        (
                          supply[
                            (formData.eventSupplies as any).findIndex(
                              (temp: { supplyId: string }) =>
                                temp.supplyId === temp.supplyId
                            )
                          ] as any
                        ).name
                      } (${
                        (
                          supply[
                            (formData.eventSupplies as any).findIndex(
                              (temp: { supplyId: string }) =>
                                temp.supplyId === temp.supplyId
                            )
                          ] as any
                        ).brand
                      })`,
                      temp.quantity > 1
                        ? `${temp.quantity} pcs`
                        : `${temp.quantity} pc`,
                      <span className="flex gap-2 justify-end">
                        <InfoIconButton
                          icon={<FontAwesomeIcon icon={faPlus} />}
                          onClick={() => updateQuantity(temp.supplyId, 1)}
                        />
                        <InfoIconButton
                          icon={<FontAwesomeIcon icon={faMinus} />}
                          onClick={() => updateQuantity(temp.supplyId, -1)}
                        />
                        <ErrorIconButton
                          icon={<FontAwesomeIcon icon={faTrash} />}
                          onClick={() => removeSupply(temp.supplyId)}
                        />
                      </span>,
                    ])}
                  />
                ) : null}
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
