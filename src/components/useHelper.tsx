import { useEffect, useState, useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";

interface Product {
  id: string;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: number;
  date_end: number;
}
interface LazyTableState {
  first: number;
  rows: number;
  page: number;
}

type DynamicObject = {
  [key: number]: number;
};

const useHelper = () => {
  const overlayRef = useRef<OverlayPanel | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [rows, setRows] = useState<DynamicObject>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [lazyState, setlazyState] = useState<LazyTableState>({
    first: 0,
    rows: 12,
    page: 0,
  });
  //   console.log(selectedProducts);
  //   console.log(products);

  function onPage(event: any) {
    const obj: LazyTableState = {
      first: event.first,
      rows: event.rows,
      page: event.page,
    };
    setlazyState(obj);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    overlayRef.current?.toggle(e);

    const newObj = { ...rows };
    let temp: number = Number(inputRef.current?.value);

    for (let i = lazyState.page + 1; i <= totalRecords; i++) {
      if (temp > 12) {
        newObj[i] = 12;
        temp = temp - 12;
      } else {
        newObj[i] = temp;
        break;
      }
    }

    setRows(newObj);
  }

  function handleSelection(e: any) {
    // console.log(e);
    if (e.type === "all") {
      if (e.originalEvent.checked === true) {
        const newArr = selectedProducts.filter((e) => {
          for (let i = 0; i < products.length; i++) {
            if (e.id === products[i].id) return false;
          }
          return true;
        });
        setSelectedProducts([...newArr, ...e.value]);
      } else {
        const filteredData = selectedProducts.filter((e) => {
          for (let i = 0; i < products.length; i++) {
            if (e.id === products[i].id) return false;
          }
          return true;
        });
        // console.log(filteredData);
        setSelectedProducts(filteredData);
      }
    } else setSelectedProducts(e.value);
  }

  function handleRows() {
    let temp = rows[lazyState.page + 1];
    // console.log(temp);
    if (temp > 0) {
      const newArr = [...selectedProducts];

      products.forEach((e) => {
        if (temp > 0) {
          if (selectedProducts.every((ele) => ele.id !== e.id)) {
            newArr.push(e);
          }
          temp--;
        }
      });

      const newObj = { ...rows };
      newObj[lazyState.page + 1] = temp;
      setRows(newObj);

      setSelectedProducts(newArr);
    }
  }

  useEffect(() => {
    // console.log(lazyState.page);
    setLoading(true);
    const fetchData = async () => {
      const url = `https://api.artic.edu/api/v1/artworks?page=${
        lazyState.page + 1
      }`;
      const resObj = await fetch(url);
      const data = await resObj.json();
      const newData = data.data.map((e: any, i: number) => {
        e.id = lazyState.page + 1 + "" + i;
        const obj: Product = {
          id: e.id,
          place_of_origin: e.place_of_origin,
          title: e.title,
          artist_display: e.artist_display,
          inscriptions: e.inscriptions,
          date_start: e.date_start,
          date_end: e.date_end,
        };

        return obj;
      });
      setProducts(newData);
      setTotalRecords(data.pagination.total);
      setLoading(false);
    };
    fetchData();
  }, [lazyState]);

  useEffect(handleRows, [rows, products]);

  function iconTemplate() {
    return (
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <i
          style={{ cursor: "pointer" }}
          className="pi pi-angle-down"
          onClick={(e) => overlayRef.current?.toggle(e)}
        ></i>
        <span>Title</span>

        <OverlayPanel ref={overlayRef}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              ref={inputRef}
              type="text"
              className="border outline-none px-2 py-1  max-w-40"
              placeholder="Select rows"
            />
            <Button label="Submit" className="self-end" />
          </form>
        </OverlayPanel>
      </div>
    );
  }

  return {
    loading: loading,
    onPage,
    iconTemplate,
    handleRows,
    handleSelection,
    products: products,
    selectedProducts: selectedProducts,
    lazyState: lazyState,
    totalRecords: totalRecords,
  };
};

export default useHelper;
