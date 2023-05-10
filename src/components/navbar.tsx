import type { FC } from "react";
import { useState } from "react";
import { Navbar, TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router";

const ExampleNavbar: FC = function () {
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigate();

  const search = (searchText: string) => {
    navigation(`/search/${searchText}`);
  };

  return (
    <Navbar fluid className="bg-transparent">
      <div className="w-full p-3 lg:px-5 lg:pl-3 bg-bit-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="../images/logo.svg"
                className="mr-3 h-6 sm:h-8"
              />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                VANGUARD SPACE
              </span>
            </Navbar.Brand>
          </div>
          <form
            className="self-center hidden md:block bg-bit-transparent"
            onSubmit={() => search(searchText)}
          >
            <TextInput
              icon={HiSearch}
              id="search"
              name="search"
              placeholder="Pesquisar"
              required
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size={100}
              type="search"
            />
          </form>
          <div className="flex items-center lg:gap-4"></div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
