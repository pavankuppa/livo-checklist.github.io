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

  const [livoCheckList, setItems] = useState({
    projectName: "",
    date: "",
    partName: "",
    partNumber: "",
    reviewedBy: "",
    drawnBy: "",
    sections: [{
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
    }]
  });

  interface AlertProps {
    message: string;
    type: string;
  }

  const [alertMessage, setAlertMessage] = useState<{ message: string, type: string } | null>(null);

  const handleSectionCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updateLivoCheckList = livoCheckList;

    let sectionName = (event.currentTarget.elements.namedItem("sectionName") as HTMLInputElement).value;
    updateLivoCheckList.sections.push({
      name: sectionName,
      data: [{
        name: "",
        completed: false
      }],
      display: true
    })
    setItems(updateLivoCheckList);
  }

  const handleChangeSectionList = (rowIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const updateLivoCheckList = livoCheckList;
    updateLivoCheckList.sections[rowIndex].display = event.target.checked
    setItems(updateLivoCheckList);
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
    const updateLivoCheckList = livoCheckList;
    let row = updateLivoCheckList.sections[sectionId].data[0]

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

    updateLivoCheckList.sections[sectionId].data.push(newRow);
    setItems(updateLivoCheckList);
  };

  const addColumnToTable = (sectionId: number,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const updateLivoCheckList = livoCheckList;
    let key_counts = Object.keys(updateLivoCheckList.sections[sectionId].data[0]).length
    // @ts-ignore
    updateLivoCheckList.sections[sectionId].data = updateLivoCheckList.sections[sectionId].data.map((item) => {
      // @ts-ignore
      item["column" + key_counts] = "";
      return item;
    });
    setItems(updateLivoCheckList);

  };

  const deleteRowFromTable = (sectionId: number,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const updateLivoCheckList = livoCheckList;
    updateLivoCheckList.sections[sectionId].data.pop();
    setItems(updateLivoCheckList);
  };

  const deleteColumnFromTable = (sectionId: number,
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const updateLivoCheckList = livoCheckList;
    let removeColumn = Object.keys(updateLivoCheckList.sections[sectionId].data[0]).pop();

    // @ts-ignore
    updateLivoCheckList.sections[sectionId].data = updateLivoCheckList.sections[sectionId].data.map((item) => {
      // @ts-ignore
      delete item[removeColumn];
      return item;
    });
    setItems(updateLivoCheckList);

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
    const updateLivoCheckList = livoCheckList;

    // @ts-ignore
    updateLivoCheckList.sections[sectionId].data = updateLivoCheckList.sections[sectionId].data.map((item) => {
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
    setItems(updateLivoCheckList);
  };

  const exportAsJSON = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!validateBeforeExport()) {
      return false;
    }

    var blob = new Blob([JSON.stringify(livoCheckList)], { type: "text/json;charset=utf-8" });
    saveAs(blob, "checklist-" + Date.now() + ".json");
  };

  const exportAsXLSX = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!validateBeforeExport()) {

      return false;
    }

    function capitalize(s: string) {
      return String(s[0]).toUpperCase() + String(s).slice(1);
    }

    const workbook = XLSX.utils.book_new();

    livoCheckList.sections.forEach((item) => {
      const worksheet = XLSX.utils.json_to_sheet(item.data);

      let headers = Object.keys(item.data[0]).map((x) => {
        return capitalize(x);
      });

      XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

      XLSX.utils.book_append_sheet(workbook, worksheet, item.name);
    })

    XLSX.writeFile(workbook, "checklist-" + Date.now() + ".xlsx", { compression: true });
  }

  const validateBeforeExport = () => {
    if (livoCheckList.projectName == "" || livoCheckList.date == "" || livoCheckList.partName == "" || livoCheckList.partNumber == "" || livoCheckList.reviewedBy == "" || livoCheckList.drawnBy == "") {
      setAlertMessage({ message: "Invalid data to export", type: "error" });

      window.setTimeout(() => {
        const dialog = document.getElementById('alert-modal') as HTMLDialogElement;
        console.log(dialog);
        dialog.show();
      }, 2000);
      return false;
    } else {
      setAlertMessage(null);
      return true;
    }
  };


  const Alert: React.FC<AlertProps> = ({ message, type }) => {
    return (
      <div id="alert-modal" className="modal overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="alert-modal">
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              {type == "error" ? (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  <span className="font-medium">{message}</span>
                </div>
              ) : type == "success" ? (
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                  <span className="font-medium">{message}</span>
                </div>
              ) : (
                <span className="font-medium">{message}</span>
              )
              }
            </div>
          </div>
        </div>
      </div>
    );
  };


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

        <div className="p-2 flex flex-col">
          <div className="mb-2">
            <input type="text" id="projectName" name="projectName" placeholder="Project name" className="text-sm p-2 w-full focus:outline-none" onChange={(event) => setProjectName(event.currentTarget.value)} />
          </div>
          <div className="mb-2">
            <input type="date" id="date" name="date" placeholder="Date" className="text-sm p-2 w-full focus:outline-none" onChange={(event) => setDate(event.currentTarget.value)} />
          </div>
          <div className="mb-2">
            <input type="text" id="partName" name="partName" placeholder="Part name" className="text-sm p-2 w-full focus:outline-none" onChange={(event) => setPartName(event.currentTarget.value)} />
          </div>
          <div className="mb-2">
            <input type="number" id="partNumber" name="partNumber" placeholder="Part number" className="text-sm p-2 w-full focus:outline-none" onChange={(event) => setPartNumber(event.currentTarget.value)} />
          </div>
          <div className="mb-2">
            <input type="text" id="reviewedBy" name="reviewedBy" placeholder="Reviewed by" className="text-sm p-2 w-full focus:outline-none" onChange={(event) => setReviewedBy(event.currentTarget.value)} />
          </div>
          <div className="mb-2">
            <input type="text" id="drawnBy" name="drawnBy" placeholder="Drawn by" className="text-sm p-2 w-full focus:outline-none" onChange={(event) => setDrawnBy(event.currentTarget.value)} />
          </div>
        </div>

        <CheckListItems items={livoCheckList.sections} onSectionListChange={handleChangeSectionList} onSectionCreate={handleSectionCreate} />
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
          {livoCheckList.sections.map((item: CheckListItem, rowIndex: number) => (

            <LivoTableSection key={item.name} display={item.display} sectionName={item.name} sectionId={rowIndex} items={item.data} onContextMenu={handleOnContextMenu} onChangeColumnName={handleOnChangeColumnName} />

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

      {alertMessage && (
        <Alert message={alertMessage.message} type={alertMessage.type} />
      )}
    </div>
  );
}
