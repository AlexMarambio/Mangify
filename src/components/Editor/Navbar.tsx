import ModalMenu from "./subComponents/ModalMenu"
import {ModeToggle} from "../mode-toggle";

const NavBar = () => {

  return (
    <div className="flex flex-row w-screen h-full items-center px-6 gap-x-6 justify-between">
      <div className="flex justify-center mx-5">
        <ModalMenu />
      </div>
      <div className="flex-grow text-center mr-5">
        <span className="text-5xl font-bold">Mangify</span>
      </div>
      <div className="text-center mr-5">
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
