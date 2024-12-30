import { useState } from "react";

const Filters = () => {
  const [searchText, setSearchText] = useState("");
  return (
    <div>
      <input
        type="search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default Filters;
