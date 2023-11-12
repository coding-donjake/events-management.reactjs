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
  document.title = "Customers";

  const navigate = useNavigate();

  const [customer, setCustomer] = useState<any>([]);
  const [loadedCustomer, setLoadedCustomer] = useState<boolean>(false);
  const [searchCustomerData, setSearchCustomerData] = useState({
    key: "",
    filterKey: "",
  });

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
        <h1 className="flex-1 font-bold text-3xl">Customers</h1>
        <hr />
        <br />
        <div className="p-6 bg-white rounded-xl shadow-xl">
          <div className="flex gap-4 mb-2">
            <h1 className="flex-1 font-bold text-xl">Customers List</h1>
            <div className="flex gap-2">
              <Button
                icon={<FontAwesomeIcon icon={faPlus} />}
                content="Create Customer"
                onClick={() => navigate("create")}
              />
              <Search
                placeholder="Search..."
                options={[
                  { label: "No filter", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Removed", value: "removed" },
                ]}
                onChange={handleSearchCustomerKeyChange}
                onClick={getCustomer}
              />
            </div>
          </div>
          {!loadedCustomer ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : customer.length <= 0 ? (
            <div className="py-10 text-gray-500 text-center">
              <span className="text-6xl">
                <FontAwesomeIcon icon={faFolderOpen} />
              </span>
              <p>No customer record found.</p>
            </div>
          ) : (
            <RowTable
              headers={["Full Name", "Gender", "Email", "Phone", "Status", ""]}
              rows={customer.map((customer: any) => [
                `${customer.User.lastName}, ${customer.User.firstName} ${customer.User.middleName} ${customer.User.suffix}`,
                customer.User.gender,
                customer.Email.content,
                customer.Simcard.content,
                customer.status,
                <span className="flex gap-2">
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={() => navigate(`update/${customer.id}`)}
                  />
                  <InfoIconButton
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => navigate(`view/${customer.id}`)}
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
