const Navbar = () => {

  // call fetch to query postgres database for all unique hotel names

  return (
    <>
      <nav className="flex justify-between items-center px-4 py-2">
        <div className="flex-grow">
          <h2><b>Select a hotel</b></h2>
          <select className="w-[300px] bg-[var(--navbar-bg-col)] text-[var(--navbar-text-col)] px-4 py-2 rounded-md border border-gray-300 focus:outline-none">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
        <div className="flex items-center"></div>
      </nav>
    </>
  );
};

export default Navbar;
