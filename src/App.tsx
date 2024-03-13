import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Setting from "./pages/Setting";
import Login from "./pages/Login";
import Management from "./pages/Management";
import UserManagement from "./pages/UserManagement";
import AdminManagement from "./pages/AdminManagement";
import AdminManagementAdd from "./pages/AdminManagementAdd";
import AdminManagementEdit from "./pages/AdminManagementEdit";
import MessageEdit from "./pages/MessageEdit";
import UserManagementEdit from "./pages/UserManagementEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/manage" element={<Management></Management>} />
        <Route path="/setting" element={<Setting></Setting>} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/user" element={<UserManagement></UserManagement>}></Route>
        <Route
          path="/admin"
          element={<AdminManagement></AdminManagement>}
        ></Route>
        <Route
          path="/admin/add"
          element={<AdminManagementAdd></AdminManagementAdd>}
        ></Route>
        <Route
          path="/admin/edit/:user"
          element={<AdminManagementEdit></AdminManagementEdit>}
        ></Route>
        <Route path="/text/edit/:id" element={<MessageEdit />} />
        <Route path="/user/edit/:id" element={<UserManagementEdit />} />
        <Route
          path="/"
          element={
            <Home
              persons={[
                {
                  avatarImage: "./images/userImage.jpg",
                  moodImage: "./images/moods/cool.png",
                  text: "Hello ____ you seem happy today",
                },
              ]}
            ></Home>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
