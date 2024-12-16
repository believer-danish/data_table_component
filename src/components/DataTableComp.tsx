import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useHelper from "./useHelper";

const DataTableComp = () => {
  const {
    loading,
    onPage,
    handleSelection,
    iconTemplate,
    lazyState,
    products,
    selectedProducts,
    totalRecords,
  } = useHelper();
  return (
    <div>
      <DataTable
        value={products}
        selection={selectedProducts}
        onSelectionChange={handleSelection}
        selectionMode="multiple"
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
        lazy
        paginator
        first={lazyState.first}
        rows={12}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="title" header={iconTemplate}></Column>
        <Column field="place_of_origin" header="Place Of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions "></Column>
        <Column field="date_start" header="Start Date "></Column>
        <Column field="date_end" header="End Date "></Column>
      </DataTable>
    </div>
  );
};

export default DataTableComp;
