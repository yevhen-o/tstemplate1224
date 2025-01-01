import { useState } from "react";
import withClientScreen from "src/hocs/withClientScreen";
import { ClientScreenInterface } from "src/Types/ClientScreen";
import InputField from "../FormFields/InputField";

interface FilterProps extends Partial<ClientScreenInterface> {
  searchText?: string;
}

const Filters: React.FC<FilterProps> = ({ searchText = "", screenWidth }) => {
  const [search, setSearch] = useState(searchText);
  return (
    <div>
      {screenWidth}
      <InputField
        name="search"
        type="search"
        fieldType="input"
        value={search}
        onChange={(value) => setSearch(value.toString())}
      />
    </div>
  );
};

export default withClientScreen(Filters);
