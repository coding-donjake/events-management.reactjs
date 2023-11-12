import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import { RowTable } from "../../components/tables";
import {
  Button,
  ErrorIconButton,
  InfoIconButton,
} from "../../components/buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFolderOpen,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Search } from "../../components/inputs";

const IndexScreen = () => {
  document.title = "Supplies";

  const navigate = useNavigate();

  const [supplier, setSupplier] = useState<any>([]);
  const [loadedSupplier, setLoadedSupplier] = useState<boolean>(false);
  const [searchSupplierData, setSearchSupplierData] = useState({
    key: "",
    filterKey: "",
  });

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

  const [supply, setSupply] = useState<any>([]);
  const [loadedSupply, setLoadedSupply] = useState<boolean>(false);
  const [searchSupplyData, setSearchSupplyData] = useState({
    key: "",
    filterKey: "",
  });

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
    getSupplier();
    getSupply();
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
                supplier.address,
                supplier.phone,
                supplier.status,
                <span className="flex gap-2">
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={() => navigate(`supplier/update/${supplier.id}`)}
                  />
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => navigate(`supplier/view/${supplier.id}`)}
                  />
                  <ErrorIconButton
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => {}}
                  />
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
              headers={["Name", "Brand", "Type", "Status", ""]}
              rows={supply.map((supply: any) => [
                supply.name,
                supply.brand,
                supply.type,
                supply.status,
                <span className="flex gap-2">
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={() => navigate(`update/${supply.id}`)}
                  />
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => navigate(`view/${supply.id}`)}
                  />
                  <ErrorIconButton
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => {}}
                  />
                </span>,
              ])}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexScreen;
