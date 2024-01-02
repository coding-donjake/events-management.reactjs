import React, { useEffect, useState } from "react";
import AdminNavigation from "../../navigations/AdminNavigation";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js/auto";
import { eventType } from "../../constants/EventType";
import { RowTable } from "../../components/tables";
import { toast } from "react-toastify";
import { eventName } from "../../constants/EventName";

const IndexScreen = () => {
  document.title = "Dashboard";
  ChartJS.register(ArcElement);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [event, setEvent] = useState<any>([]);
  const [loadedEvent, setLoadedEvent] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    password: "",
  });
  const [searchEventData, setSearchEventData] = useState({
    key: "",
    filterKey: "",
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

  const handleSearchEventKeyChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getEvent = async () => {
    setLoadedEvent(false);
    try {
      const response = await fetch("http://localhost:5000/event/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: searchEventData.key,
          status: searchEventData.filterKey,
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
        console.log(res.data);
        setEvent(res.data);
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

  const currentYear = new Date().getFullYear();

  const [payments, setPayments] = useState([]);
  const [loadedPayments, setLoadedPayments] = useState<boolean>(false);
  const [searchPaymentsData, setSearchPaymentsData] = useState({
    eventsKey: "",
  });

  const handleSearchPaymentsKeyChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSearchPaymentsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getPayments = async () => {
    setLoadedPayments(false);
    try {
      const response = await fetch("http://localhost:5000/payment/get", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (response.status === 500) {
        toast.error("Internal server error!");
        console.log("Failed to load payments.");
        return;
      }
      if (response.ok) {
        const res = await response.json();
        setPayments(res.data);
        console.log("payments:", res.data);
        return;
      }
      toast.error("Unkown error occured!");
      console.log(response);
    } catch (error) {
      toast.error("Client error!");
      console.error("catch error:", error);
    }
  };

  const monthlySummaries: { [year: number]: number[] } = {};
  const [currentYearSummaryArray, setCurrentYearSummaryArray] = useState<
    number[]
  >([]);
  const [previousYearSummaryArray, setPreviousYearSummaryArray] = useState<
    number[]
  >([]);

  useEffect(() => {
    getEvent();
    getPayments();
  }, []);

  useEffect(() => {
    payments.forEach((payment) => {
      const paymentYear = new Date(
        (payment as any).datetimePayment
      ).getFullYear();
      const paymentMonth =
        new Date((payment as any).datetimePayment).getMonth() + 1;
      const paymentAmount = (payment as any).amount;

      if (paymentYear === currentYear || paymentYear === currentYear - 1) {
        if (!monthlySummaries[paymentYear]) {
          monthlySummaries[paymentYear] = new Array(12).fill(0);
        }
        monthlySummaries[paymentYear][paymentMonth - 1] += paymentAmount;
      }
    });
    setCurrentYearSummaryArray(
      monthlySummaries[currentYear] || new Array(12).fill(0)
    );
    setPreviousYearSummaryArray(
      monthlySummaries[currentYear - 1] || new Array(12).fill(0)
    );

    console.log("Current Year Summary:", currentYearSummaryArray);
    console.log("Previous Year Summary:", previousYearSummaryArray);
    setLoadedPayments(true);
  }, [payments]);

  return (
    <div className="flex h-screen">
      <AdminNavigation />
      <div className="flex-1 h-screen p-4 overflow-auto">
        <h1 className="flex-1 font-bold text-3xl">Event Analysis</h1>
        {!loadedEvent ? (
          <div className="py-10 text-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          <div>
            <br />
            <h2 className="font-bold">Services Per Event Type</h2>
            <div className="w-full grid grid-cols-2 gap-4">
              <div>
                <RowTable
                  headers={["Event Type", "Services"]}
                  rows={eventType.map((type: any) => {
                    const filteredEvents = event.filter(
                      (event: { type: any }) => event.type === type
                    );
                    return [type, filteredEvents.length];
                  })}
                />
              </div>
              <div>
                <Pie
                  data={{
                    labels: [...eventType],
                    datasets: [
                      {
                        data: eventType.map((type: any) => {
                          const filteredEvents = event.filter(
                            (event: { type: any }) => event.type === type
                          );
                          return filteredEvents.length;
                        }),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                      },
                    ],
                  }}
                  options={options}
                />
              </div>
            </div>
            <br />
            <h2 className="font-bold">Monthly Income</h2>
            <div className="w-full grid grid-cols-1 gap-4">
              <div>
                <Line
                  data={{
                    labels: [...monthNames],
                    datasets: [
                      {
                        data: currentYearSummaryArray,
                        borderColor: "#22c55e",
                        fill: false,
                        tension: 0.3,
                      },
                      {
                        data: previousYearSummaryArray,
                        borderColor: "#6b7280",
                        fill: false,
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={options}
                />
              </div>
              <div>
                <br />
                <RowTable
                  headers={["Month", "Difference in Previous"]}
                  rows={monthNames.map((month: any, index: number) => {
                    return [
                      month,
                      currentYearSummaryArray[index] -
                        previousYearSummaryArray[index],
                    ];
                  })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexScreen;
