import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Setting from "./pages/Setting";
import Login from "./pages/Login";
import Management from "./pages/Management";
import UserManagement from "./pages/UserManagement";
import AdminManagement from "./pages/AdminManagement";
import AdminManagementAdd from "./pages/AdminManagementAdd";
import AdminManagementEdit from "./pages/AdminManagementEdit";
import MessageEdit from "./pages/MessageEdit";
import UserManagementEdit from "./pages/UserManagementEdit";
import user from './components/User'
import Settingall from "./pages/SettingAll";
import MyNav from "./components/MyNav";

interface Props {
  currentPath: string;
}

const App: React.FC<Props> = ({ currentPath }) => {
  return (
    <BrowserRouter>
    {currentPath !== "" && currentPath!== "/" && currentPath !== "/login" ? <MyNav /> : null}
      <Routes>
        <Route path="/" element={<Home persons={[{ avatarImage: "./images/userImage.jpg", moodImage: "./images/moods/cool.png", text: "Hello ____ you seem happy today" }]}/>} />
        <Route path="/login" element={<Login />} />
        {user.getStatus() === "true" &&(
          <>
        <Route path="/manage" element={<Management />} />
        <Route path="/message" element={<Setting />} />
        <Route path="/setting" element={<Settingall />} />
        <Route path="/user" element={<UserManagement />} />
        <Route path="/admin" element={<AdminManagement />} />
        <Route path="/admin/add" element={<AdminManagementAdd />} />
        <Route path="/admin/edit/:user" element={<AdminManagementEdit />} />
        <Route path="/text/edit/:id" element={<MessageEdit />} />
        <Route path="/user/edit/:id" element={<UserManagementEdit />} />
        </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
