import React from "react";
import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SettingButton() {
  let navigate = useNavigate();

  const handleSettingClick = () => {
    navigate("/login");
    window.location.reload();
  };

  return (
    <Image
      fluid
      className="position-fixed bottom-0 right-0 setting m-1"
      src="./images/setting.png"
      alt="Setting"
      onClick={handleSettingClick}
    />
  );
}
