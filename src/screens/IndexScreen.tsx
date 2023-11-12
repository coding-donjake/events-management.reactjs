import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrimaryButton } from "../components/buttons";
import { Input } from "../components/inputs";
import Logo from "../assets/logo.jpg";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IndexScreen = () => {
  document.title = "Administrator";

  const navigate = useNavigate();
  const [loginFormProcessing, setLoginFormProcessing] =
    useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: "",
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

    if (loginFormProcessing) {
      return;
    }

    try {
      setLoginFormProcessing(true);
      const response = await fetch("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin: formData }),
      });
      if (response.status === 401) {
        toast.error("Invalid username or password.");
        setLoginFormProcessing(false);
        return;
      }
      if (response.status === 500) {
        toast.error("Internal server error!");
        setLoginFormProcessing(false);
        return;
      }
      if (response.ok) {
        const res = await response.json();
        toast.success("Logged In Successfully.");
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("username", res.username);
        localStorage.setItem("role", res.role);
        navigate("dashboard");
        return;
      }
      toast.error("Unkown error occured!");
    } catch (error) {
      toast.error("Request failed!");
      console.error("Network error:", error);
      setLoginFormProcessing(false);
    }
  };

  return (
    <div className="px-6 py-12">
      <form
        className="mx-auto shadow-xl w-full max-w-xs p-6 bg-white rounded-xl"
        onSubmit={handleOnSubmit}
      >
        <img className="w-32 mx-auto mb-4" src={Logo} alt="Logo" />
        <h1 className="mb-4 font-bold text-2xl text-center">Khayas EMS</h1>
        <div className="flex flex-col gap-4">
          <Input
            id="username"
            topLeftLabel="Username"
            onChange={handleInputChange}
          />
          <Input
            type="password"
            id="password"
            topLeftLabel="Password"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-end mt-6">
          <PrimaryButton
            type="submit"
            icon={<FontAwesomeIcon icon={faRightToBracket} />}
            content="Log In"
            processing={loginFormProcessing}
          />
        </div>
      </form>
    </div>
  );
};

export default IndexScreen;
