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
  document.title = "Supplies";

  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
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

  const removeSupplier = async () => {
    if (removeSupplierProcessing) {
      return;
    }

    try {
      setRemoveSupplierProcessing(true);
      const response = await fetch("http://localhost:5000/supplier/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          supplier: {
            id: supplierToRemove,
            status: "removed",
          },
        }),
      });
      if (response.status === 401) {
        toast.error("Invalid operator credentials.");
        setRemoveSupplierProcessing(false);
        return;
      }
      if (response.status === 500) {
        setRemoveSupplierProcessing(false);
        toast.error("Internal server error!");
        console.log("Failed to remove supplier.");
        return;
      }
      if (response.ok) {
        setRemoveSupplierProcessing(false);
        toast.success("Remove supplier success.");
        getSupplier();
        setOpenRemoveSupplierModal(false);
        return;
      }
      setRemoveSupplierProcessing(false);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setRemoveSupplierProcessing(false);
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

  const removeSupply = async () => {
    if (removeSupplyProcessing) {
      return;
    }

    try {
      setRemoveSupplyProcessing(true);
      const response = await fetch("http://localhost:5000/supply/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          supply: {
            id: supplyToRemove,
            status: "removed",
          },
        }),
      });
      if (response.status === 401) {
        toast.error("Invalid operator credentials.");
        setRemoveSupplyProcessing(false);
        return;
      }
      if (response.status === 500) {
        setRemoveSupplyProcessing(false);
        toast.error("Internal server error!");
        console.log("Failed to remove supply.");
        return;
      }
      if (response.ok) {
        setRemoveSupplyProcessing(false);
        toast.success("Remove supply success.");
        getSupply();
        setOpenRemoveSupplyModal(false);
        return;
      }
      setRemoveSupplyProcessing(false);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setRemoveSupplyProcessing(false);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  // order

  const [order, setOrder] = useState<any>([]);
  const [loadedOrder, setLoadedOrder] = useState<boolean>(false);
  const [searchOrderData, setSearchOrderData] = useState({
    key: "",
    filterKey: "",
  });

  const [openRemoveOrderModal, setOpenRemoveOrderModal] =
    useState<boolean>(false);
  const [orderToRemove, setOrderToRemove] = useState<string>("");
  const [removeOrderProcessing, setRemoveOrderProcessing] =
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

  const removeOrder = async () => {
    if (removeOrderProcessing) {
      return;
    }

    try {
      setRemoveOrderProcessing(true);
      const response = await fetch("http://localhost:5000/order/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          order: {
            id: orderToRemove,
            status: "removed",
          },
          orderSupply: [],
        }),
      });
      if (response.status === 401) {
        toast.error("Invalid operator credentials.");
        setRemoveOrderProcessing(false);
        return;
      }
      if (response.status === 500) {
        setRemoveOrderProcessing(false);
        toast.error("Internal server error!");
        console.log("Failed to remove order.");
        return;
      }
      if (response.ok) {
        setRemoveOrderProcessing(false);
        toast.success("Remove order success.");
        getOrder();
        setOpenRemoveOrderModal(false);
        return;
      }
      setRemoveOrderProcessing(false);
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      setRemoveOrderProcessing(false);
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  useEffect(() => {
    getSupplier();
    getSupply();
    getOrder();
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
            <h1 className="flex-1 font-bold text-xl">Suppliers List</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faPlus} />}
                content="Create Supplier"
                onClick={() => navigate("supplier/create")}
              />
              <Search
                placeholder="Search..."
                options={[
                  { label: "No filter", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Removed", value: "removed" },
                ]}
                onChange={handleSearchSupplierKeyChange}
                onClick={getSupplier}
              />
            </div>
          </div>
          {!loadedSupplier ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : supplier.length <= 0 ? (
            <div className="py-10 text-gray-500 text-center">
              <span className="text-6xl">
                <FontAwesomeIcon icon={faFolderOpen} />
              </span>
              <p>No supplier record found.</p>
            </div>
          ) : (
            <RowTable
              headers={["Name", "Phone", "Email", "Status", ""]}
              rows={supplier.map((supplier: any) => [
                supplier.name,
                supplier.phone,
                supplier.email,
                supplier.status === "removed" ? (
                  <span className="text-red-500">{supplier.status}</span>
                ) : (
                  supplier.status
                ),
                <span className="flex gap-2 justify-end">
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={() => navigate(`supplier/update/${supplier.id}`)}
                  />
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => navigate(`supplier/view/${supplier.id}`)}
                  />
                  {supplier.status === "removed" ? (
                    <ErrorIconButton
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      disabled={true}
                    />
                  ) : (
                    <ErrorIconButton
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={() => {
                        setSupplierToRemove(supplier.id);
                        setOpenRemoveSupplierModal(true);
                      }}
                    />
                  )}
                </span>,
              ])}
            />
          )}
        </div>
        <br />
        <div className="p-6 bg-white rounded-xl shadow-xl">
          <div className="flex gap-4 mb-2">
            <h1 className="flex-1 font-bold text-xl">Supplies List</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faPlus} />}
                content="Create Supply"
                onClick={() => navigate("create")}
              />
              <Search
                placeholder="Search..."
                options={[
                  { label: "No filter", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Removed", value: "removed" },
                ]}
                onChange={handleSearchSupplyKeyChange}
                onClick={getSupply}
              />
            </div>
          </div>
          {!loadedSupply ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : supply.length <= 0 ? (
            <div className="py-10 text-gray-500 text-center">
              <span className="text-6xl">
                <FontAwesomeIcon icon={faFolderOpen} />
              </span>
              <p>No supply record found.</p>
            </div>
          ) : (
            <RowTable
              headers={["Name", "Brand", "Type", "Stocks Left", "Status", ""]}
              rows={supply.map((supply: any) => [
                supply.name,
                supply.brand,
                supply.type,
                `${supply.stock.toLocaleString()} remaining`,
                supply.status === "removed" ? (
                  <span className="text-red-500">{supply.status}</span>
                ) : (
                  supply.status
                ),
                <span className="flex gap-2 justify-end">
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={() => navigate(`update/${supply.id}`)}
                  />
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => navigate(`view/${supply.id}`)}
                  />
                  {supply.status === "removed" ? (
                    <ErrorIconButton
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      disabled={true}
                    />
                  ) : (
                    <ErrorIconButton
                      icon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={() => {
                        setSupplyToRemove(supply.id);
                        setOpenRemoveSupplyModal(true);
                      }}
                    />
                  )}
                </span>,
              ])}
            />
          )}
        </div>
        <br />
        <div className="p-6 bg-white rounded-xl shadow-xl">
          <div className="flex gap-4 mb-2">
            <h1 className="flex-1 font-bold text-xl">Orders List</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faPlus} />}
                content="Create Order"
                onClick={() => navigate("order/create")}
              />
              <Search
                placeholder="Search..."
                options={[
                  { label: "No filter", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Arrived", value: "arrived" },
                  { label: "Removed", value: "removed" },
                ]}
                onChange={handleSearchOrderKeyChange}
                onClick={getOrder}
              />
            </div>
          </div>
          {!loadedOrder ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : order.length <= 0 ? (
            <div className="py-10 text-gray-500 text-center">
              <span className="text-6xl">
                <FontAwesomeIcon icon={faFolderOpen} />
              </span>
              <p>No order record found.</p>
            </div>
          ) : (
            <RowTable
              headers={[
                "Date Ordered",
                "Expected Date Arrival",
                "Date Arrived",
                "Ordered Supplies",
                "Supplier",
                "Status",
                "",
              ]}
              rows={order.map((order: any) => {
                const totalQuantity = order.OrderSupply.reduce(
                  (acc: any, supply: any) => acc + supply.quantity,
                  0
                );

                return [
                  order.datetimeOrdered,
                  order.datetimeExpected,
                  order.datetimeArrived,
                  totalQuantity > 0 ? `${totalQuantity} pcs` : "0 pc",
                  order.Supplier.name,
                  order.status === "removed" ? (
                    <span className="text-red-500">{order.status}</span>
                  ) : (
                    order.status
                  ),
                  <span className="flex gap-2 justify-end">
                    <InfoIconButton
                      icon={<FontAwesomeIcon icon={faPen} />}
                      onClick={() => navigate(`order/update/${order.id}`)}
                    />
                    <InfoIconButton
                      icon={<FontAwesomeIcon icon={faEye} />}
                      onClick={() => navigate(`order/view/${order.id}`)}
                    />
                    {order.status === "removed" ? (
                      <ErrorIconButton
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        disabled={true}
                      />
                    ) : (
                      <ErrorIconButton
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={() => {
                          setOrderToRemove(order.id);
                          setOpenRemoveOrderModal(true);
                        }}
                      />
                    )}
                  </span>,
                ];
              })}
            />
          )}
        </div>
      </div>
      {openRemoveSupplierModal ? (
        <Modal
          header="Remove Supplier"
          content={
            <span>
              Are you sure you want to remove this supplier record? This cannot
              be undone.
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
              processing={removeSupplierProcessing}
              onClick={removeSupplier}
            />,
          ]}
          onClose={() => setOpenRemoveSupplierModal(false)}
        />
      ) : null}
      {openRemoveSupplyModal ? (
        <Modal
          header="Remove Supply"
          content={
            <span>
              Are you sure you want to remove this supply record? This cannot be
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
              processing={removeSupplyProcessing}
              onClick={removeSupply}
            />,
          ]}
          onClose={() => setOpenRemoveSupplyModal(false)}
        />
      ) : null}
      {openRemoveOrderModal ? (
        <Modal
          header="Remove Order"
          content={
            <span>
              Are you sure you want to remove this order record? This cannot be
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
              processing={removeOrderProcessing}
              onClick={removeOrder}
            />,
          ]}
          onClose={() => setOpenRemoveOrderModal(false)}
        />
      ) : null}
    </div>
  );
};

export default IndexScreen;
