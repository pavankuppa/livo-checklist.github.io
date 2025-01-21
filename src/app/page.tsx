'use client';

import UploadCheckListForm from "../components/upload-widget"
import CheckListItems from "../components/sections"
import LivoTableSection from "../components/livo-table"
import { CheckListItem } from "@/interfaces/global";
import { useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  console.log('Selected file:', file);
};


export default function Home() {

  const [items, setItems] = useState([
    {
      name: "Mechanical",
      data: [{
        name: "Apple",
        completed: true
      }],
      display: true
    },
    {
      name: "Production",
      data: [{
        name: "Apple 2",
        completed: false
      }],
      display: true
    }
  ]);

  const handleTableItemChange = (sectionId: number, index: number, column: string, newData: any) => {
    const updatedItems = [...items];

    // updatedItems[index].data = newData;
    // setItems(updatedItems);
    console.log(sectionId, index, column, newData)
  };

  const handleSectionCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updatedItems = [...items];
    let sectionName = (event.currentTarget.elements.namedItem("sectionName") as HTMLInputElement).value;
    updatedItems.push({
      name: sectionName,
      data: [{
        name: "",
        completed: false
      }],
      display: true
    })
    setItems(updatedItems);
  }

  const handleChangeSectionList = (rowIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItems = [...items];
    updatedItems[rowIndex].display = event.target.checked
    setItems(updatedItems);
  }


  interface ContextMenuProps {
    sectionId: number;
    x: number;
    y: number;
    onClose: () => void;
  }

  const addRowToTable = (sectionId: number,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const updatedItems = [...items];
    let row = updatedItems[sectionId].data[0]

    let newRow: any = {};
    Object.keys(row).forEach((key) => {
      // @ts-ignore
      if (typeof row[key] == "string") {
        newRow[key] = "";

        // @ts-ignore
      } else if (typeof row[key] == "boolean") {
        newRow[key] = false;
      } else {
        newRow[key] = ""
      }
    })

    updatedItems[sectionId].data.push(newRow);
    setItems(updatedItems);
  };

  const addColumnToTable = (sectionId: number,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const updatedItems = [...items];
    let key_counts = Object.keys(updatedItems[sectionId].data[0]).length
    // @ts-ignore
    updatedItems[sectionId].data = updatedItems[sectionId].data.map((item) => {
      // @ts-ignore
      item["column" + key_counts] = "";
      return item;
    });
    setItems(updatedItems);

  };

  const deleteRowFromTable = (sectionId: number,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const updatedItems = [...items];
    updatedItems[sectionId].data.pop();
    setItems(updatedItems);
  };

  const deleteColumnFromTable = (sectionId: number,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const updatedItems = [...items];
    let removeColumn = Object.keys(updatedItems[sectionId].data[0]).pop();

    // @ts-ignore
    updatedItems[sectionId].data = updatedItems[sectionId].data.map((item) => {
      // @ts-ignore
      delete item[removeColumn];
      return item;
    });
    setItems(updatedItems);

  };

  const ContextMenu: React.FC<ContextMenuProps> = ({ sectionId, x, y, onClose }) => {
    return (
      <div
        className="absolute z-50 w-40 bg-white border rounded shadow-md"
        style={{ top: y, left: x }}
        onClick={onClose} // Close menu when clicked
      >
        <ul className="text-sm">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(event) => addRowToTable(sectionId, event)}>Add Row</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(event) => addColumnToTable(sectionId, event)}>Add Column</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={(event) => deleteRowFromTable(sectionId, event)}>
            Remove Row
          </li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={(event) => deleteColumnFromTable(sectionId, event)}>
            Remove Column
          </li>
        </ul>
      </div>
    );
  };

  const [menuPosition, setMenuPosition] = useState<{ sectionId: number, x: number; y: number } | null>(null);

  const handleOnContextMenu = (sectionId: number,
    e: React.MouseEvent<HTMLTableElement, MouseEvent>
  ) => {
    setMenuPosition({ sectionId: sectionId, x: e.pageX, y: e.pageY });
  };

  const handleCloseMenu = () => {
    setMenuPosition(null);
  };

  const handleOnChangeColumnName = (sectionId: number, oldKey: string, newKey: string) => {
    const updatedItems = [...items];

    // @ts-ignore
    updatedItems[sectionId].data = updatedItems[sectionId].data.map((item) => {
      const updatedItem: Record<string, any> = {};

      // Iterate over the keys in the original item to preserve order
      Object.keys(item).forEach((key) => {
        if (key === oldKey) {
          // Replace old key with the new key
          // @ts-ignore
          updatedItem[newKey] = item[key];
        } else {
          // Keep other keys unchanged
          // @ts-ignore
          updatedItem[key] = item[key];
        }
      });

      return updatedItem;
    });
    setItems(updatedItems);
    console.log(sectionId, oldKey, newKey)
  };

  const exportAsJSON = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    var blob = new Blob([JSON.stringify(items)], { type: "text/json;charset=utf-8" });
    saveAs(blob, "checklist-" + Date.now() + ".json");
  };

  const exportAsXLSX = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    function capitalize(s: string) {
      return String(s[0]).toUpperCase() + String(s).slice(1);
    }

    const workbook = XLSX.utils.book_new();

    items.forEach((item) => {
      const worksheet = XLSX.utils.json_to_sheet(item.data);

      let headers = Object.keys(item.data[0]).map((x) => {
        return capitalize(x);
      });

      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

      XLSX.utils.book_append_sheet(workbook, worksheet, item.name);
    })

    XLSX.writeFile(workbook, "checklist-" + Date.now() + ".xlsx", { compression: true });
  }


  return (
    <div>

      <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-80 bg-slate-100 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="logo-header bg-blue-950">
          <div className="p-2 flex flex-row">
            <img src="logo.svg" height="30" />

            <svg className="w-6 h-6 text-red-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" />
            </svg>
          </div>
        </div>

        <UploadCheckListForm id="upload-checklist" name="upload file" onChange={handleFileChange} />
        <CheckListItems items={items} onSectionListChange={handleChangeSectionList} onSectionCreate={handleSectionCreate} />
        <div className="static">
          <div className="absolute bottom-0 left-0 flex text-sm p-2 bg-blue-100 w-80">
            <div>
              Export as:
            </div>
            <div className="pl-1 text-sky-500">
              <button onClick={exportAsJSON}>JSON</button>,
            </div>
            <div className="pl-1 text-sky-500">
              <button onClick={exportAsXLSX}>XLSX</button>
            </div>
          </div>
        </div>
      </aside>
      <div className="sm:ml-80 z-0 w-10/12">


        <div className="flex flex-wrap size-full">
          {items.map((item: CheckListItem, rowIndex: number) => (

            <LivoTableSection key={item.name} display={item.display} sectionName={item.name} sectionId={rowIndex} items={item.data} onItemsChange={handleTableItemChange} onContextMenu={handleOnContextMenu} onChangeColumnName={handleOnChangeColumnName} />

          ))}
        </div>


      </div>

      {/* Context Menu */}
      {menuPosition && (
        <ContextMenu
          sectionId={menuPosition.sectionId}
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={handleCloseMenu}
        />
      )}

      {/* Overlay to close the menu when clicking elsewhere */}
      {menuPosition && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleCloseMenu}
        ></div>
      )}
    </div>
  );
}
