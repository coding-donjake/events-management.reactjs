import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import {
  faChevronLeft,
  faFloppyDisk,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, PrimaryButton } from "../../components/buttons";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RowTable } from "../../components/tables";
import { fromISOToDateTime12hr } from "../../services/Conversion";

const LogsScreen = () => {
  document.title = "View Supplier";

  const navigate = useNavigate();
  const { id } = useParams();
  const [supplier, setSupplier] = useState<any>([]);
  const [loadedSupplier, setLoadedSupplier] = useState<boolean>(false);

  const selectSupplier = async () => {
    setLoadedSupplier(false);
    try {
      const response = await fetch("http://localhost:5000/supplier/select", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplier: { id: id },
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

  useEffect(() => {
    selectSupplier();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Suppliers</h1>
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
            </div>
          </div>
          <br />
          {!loadedSupplier ? (
            <div className="py-10 text-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : (
            <RowTable
              headers={["Date & Time", "Type", "Operator"]}
              rows={supplier.SupplierLog.map((log: any) => [
                fromISOToDateTime12hr(log.datetime),
                log.type,
                `${log.Operator.lastName}, ${log.Operator.firstName} ${log.Operator.middleName} ${log.Operator.suffix}`,
              ])}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsScreen;
