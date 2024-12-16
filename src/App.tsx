import { PrimeReactProvider } from "primereact/api";
import DataTableComp from "./components/DataTableComp";

const App = () => {
  return (
    <PrimeReactProvider>
      <DataTableComp />
    </PrimeReactProvider>
  );
};

export default App;
