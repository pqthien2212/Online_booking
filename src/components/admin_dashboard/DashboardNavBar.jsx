import DashboardMenuButton from "./DashboardMenuButton";

import DashboardDropDownMenu from "./DashboardDropDownMenu";

import test_img from "../../assets/test_profile_img/pic3.jpg";
import { Link } from "react-router-dom";

const DashboardNavBar = ({ menuToggle, handleMenuToggle }) => {
  return (
    <div className="w-full flex flex-row min-h-15 gap-4 bg-gradient-to-r from-purple-800 to-indigo-800">
      <DashboardMenuButton
        className="text-white bg-purple-700 text-3xl w-15 h-15"
        open={menuToggle}
        onClick={handleMenuToggle}
      />
      
      <div className="flex flex-row mx-4 gap-8 text-white text-sm font-bold">
        <Link to="/" className="text-white flex-grow flex items-center">
          HOME
        </Link>
      </div>
      <div className="flex flex-row ml-auto text-white divide-x divide-solid divide-purple-400 divide-opacity-50">
        <div></div>
        <DashboardDropDownMenu
          buttonContent={
            <div className="px-4">
              <img
                src={test_img}
                width={32}
                height={32}
                className="rounded-full"
              ></img>
            </div>
          }
        >
          <div className="flex flex-col bg-white shadow-md text-sm [&>*]:p-3 [&>*:hover]:bg-gray-200">
            <a href="#">My profile</a>
            <a href="#">Activity</a>
            <a href="#">Messages</a>
            <a href="#">Logout</a>
          </div>
        </DashboardDropDownMenu>
      </div>
    </div>
  );
};

export default DashboardNavBar;
