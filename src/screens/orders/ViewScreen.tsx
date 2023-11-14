import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import {
  faCheck,
  faChevronLeft,
  faCircleExclamation,
  faFloppyDisk,
  faList,
  faMinus,
  faPlus,
  faTrash,
  faTruckRampBox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ErrorButton,
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
  fromISOToDateTime12hr,
  fromISOToDateTimeInput,
} from "../../services/Conversion";
import { RowTable } from "../../components/tables";
import { Modal } from "../../components/modals";

const ViewScreen = () => {
  document.title = "View Order";

  const navigate = useNavigate();
  const { id } = useParams();
  const [loadedOrder, setLoadedOrder] = useState<boolean>(false);
  const [supplyId, setSupplyId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [updateFormProcessing, setUpdateFormProcessing] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string | object;
    datetimeOrdered: string;
    datetimeExpected: string;
    datetimeArrived: string;
    supplierId: string;
    orderSupplies: object;
  }>({
    datetimeOrdered: "",
    datetimeExpected: "",
    datetimeArrived: "",
    supplierId: "",
    supplierName: "",
    orderSupplies: [],
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

  const selectOrder = async () => {
    setLoadedOrder(false);
    try {
      const response = await fetch("http://localhost:5000/order/select", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: { id: id },
        }),
      });
      if (response.status === 500) {
        setLoadedOrder(true);
        toast.error("Internal server error!");
        console.log("Failed to load order.");
        return;
      }
      if (response.ok) {
        const res = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          ["id"]: res.data.id,
          ["datetimeOrdered"]: fromISOToDateTime12hr(res.data.datetimeOrdered),
          ["datetimeExpected"]: fromISOToDateTime12hr(
            res.data.datetimeExpected
          ),
          ["datetimeArrived"]: fromISOToDateTime12hr(res.data.datetimeArrived),
          ["supplierId"]: res.data.Supplier.id,
          ["supplierName"]: res.data.Supplier.name,
          ["orderSupplies"]: res.data.OrderSupply,
          ["status"]: res.data.status,
        }));
        setLoadedOrder(true);
        return;
      }
      setLoadedOrder(true);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setLoadedOrder(true);
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
      const response = await fetch("http://localhost:5000/order/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            id: formData.id,
            datetimeOrdered: new Date(formData.datetimeOrdered).toISOString(),
            datetimeExpected: new Date(formData.datetimeExpected).toISOString(),
            supplierId: formData.supplierId,
          },
          orderSupply: formData.orderSupplies,
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
        toast.success("Update order success.");
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

  const insertOrderSupplies = () => {
    if (supplyId === "") {
      return;
    }
    const newSupply = { supplyId: supplyId, quantity: quantity };
    const existingSupplies = formData.orderSupplies;
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
      orderSupplies: existingSupplies,
    }));
  };

  const updateQuantity = (id: string, offset: number) => {
    const existingSupplies = formData.orderSupplies;
    const existingIndex = (existingSupplies as any).findIndex(
      (supply: { supplyId: string }) => supply.supplyId === id
    );
    (existingSupplies as any)[existingIndex].quantity += offset;
    if ((existingSupplies as any)[existingIndex].quantity <= 0) {
      (existingSupplies as any)[existingIndex].quantity = 1;
    }
    setFormData((prevData) => ({
      ...prevData,
      ["orderSupplies"]: existingSupplies,
    }));
  };

  const removeSupply = (id: string) => {
    const existingSupplies = formData.orderSupplies;
    const existingIndex = (existingSupplies as any).findIndex(
      (supply: { supplyId: string }) => supply.supplyId === id
    );
    if (existingIndex !== -1) {
      (existingSupplies as any).splice(existingIndex, 1);
    }
    setFormData((prevData) => ({
      ...prevData,
      ["orderSupplies"]: existingSupplies,
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

  const [order, setOrder] = useState<any>([]);
  const [searchOrderData, setSearchOrderData] = useState({
    key: "",
    filterKey: "",
  });

  const [openConfirmOrderModal, setOpenConfirmOrderModal] =
    useState<boolean>(false);
  const [orderToConfirm, setOrderToConfirm] = useState<string>("");
  const [confirmOrderProcessing, setConfirmOrderProcessing] =
    useState<boolean>(false);

  const handleSearchOrderKeyChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getOrder = async () => {
    setLoadedOrder(false);
    try {
      const response = await fetch("http://localhost:5000/order/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: searchOrderData.key,
          status: searchOrderData.filterKey,
        }),
      });
      if (response.status === 500) {
        setLoadedOrder(true);
        toast.error("Internal server error!");
        console.log("Failed to load order.");
        return;
      }
      if (response.ok) {
        const res = await response.json();
        console.log("target");
        console.log(res.data);
        setOrder(res.data);
        setLoadedOrder(true);
        return;
      }
      setLoadedOrder(true);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setLoadedOrder(true);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  const confirmOrder = async () => {
    if (confirmOrderProcessing) {
      return;
    }

    try {
      setConfirmOrderProcessing(true);
      const response = await fetch("http://localhost:5000/order/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          order: {
            id: formData.id,
            status: "arrived",
          },
          orderSupply: formData.orderSupplies,
        }),
      });
      if (response.status === 401) {
        toast.error("Invalid operator credentials.");
        setConfirmOrderProcessing(false);
        return;
      }
      if (response.status === 500) {
        setConfirmOrderProcessing(false);
        toast.error("Internal server error!");
        console.log("Failed to confirm order.");
        return;
      }
      if (response.ok) {
        setConfirmOrderProcessing(false);
        toast.success("Confirm order arrival success.");
        navigate(-1);
        return;
      }
      setConfirmOrderProcessing(false);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setConfirmOrderProcessing(false);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  useEffect(() => {
    getSupplier();
    getSupply();
    selectOrder();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Orders</h1>
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
          {!loadedOrder || !loadedSupplier || !loadedSupply ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <form className="mx-auto w-full max-w-lg" onSubmit={handleOnSubmit}>
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-center">Order Information</h2>
                <Input
                  topLeftLabel="Supplier"
                  id="supplierId"
                  value={formData.supplierName as any}
                  onChange={handleInputChange}
                  readonly={true}
                />
                <Input
                  id="datetimeOrdered"
                  topLeftLabel="Date Ordered"
                  value={formData.datetimeOrdered}
                  onChange={handleInputChange}
                  readonly={true}
                />
                <div className="flex gap-2">
                  <Input
                    id="datetimeExpected"
                    topLeftLabel="Expected arrival date"
                    value={formData.datetimeExpected}
                    onChange={handleInputChange}
                    readonly={true}
                  />
                  <Input
                    id="datetimeArrived"
                    topLeftLabel="Date Arrived"
                    value={formData.datetimeArrived}
                    onChange={handleInputChange}
                    readonly={true}
                  />
                </div>
                {(formData.orderSupplies as any).length > 0 ? (
                  <RowTable
                    headers={["Supply", "Quantity"]}
                    rows={(formData.orderSupplies as any).map((temp: any) => [
                      `${
                        (
                          supply[
                            (formData.orderSupplies as any).findIndex(
                              (temp: { supplyId: string }) =>
                                temp.supplyId === temp.supplyId
                            )
                          ] as any
                        ).name
                      } (${
                        (
                          supply[
                            (formData.orderSupplies as any).findIndex(
                              (temp: { supplyId: string }) =>
                                temp.supplyId === temp.supplyId
                            )
                          ] as any
                        ).brand
                      })`,
                      temp.quantity > 1
                        ? `${temp.quantity} pcs`
                        : `${temp.quantity} pc`,
                    ])}
                  />
                ) : null}
              </div>
              <br />
              <div className="flex justify-end">
                <PrimaryButton
                  icon={<FontAwesomeIcon icon={faTruckRampBox} />}
                  content="Delivered"
                  onClick={() => {
                    setOpenConfirmOrderModal(true);
                  }}
                  disabled={formData.status === "arrived" ? true : false}
                />
              </div>
            </form>
          )}
        </div>
      </div>
      {openConfirmOrderModal ? (
        <Modal
          header="Confirm Order Arrival"
          content={
            <span>
              Are you sure you want to confirm this order record? This cannot be
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
              icon={<FontAwesomeIcon icon={faCheck} />}
              content="Confirm"
              processing={confirmOrderProcessing}
              onClick={confirmOrder}
            />,
          ]}
          onClose={() => setOpenConfirmOrderModal(false)}
        />
      ) : null}
    </div>
  );
};

export default ViewScreen;
