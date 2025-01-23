import { LivoTableSectionInterface } from '@/interfaces/global';
import React from 'react';
import { useState } from "react";


const LivoTableSection: React.FC<LivoTableSectionInterface> = ({ display, sectionName, sectionId, items, onContextMenu, onChangeColumnName }) => {


  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [selectedColumn, setSelectedColumn] = useState("");


  const handleContextMenu = (sectionId: number,
    e: React.MouseEvent<HTMLTableElement, MouseEvent>
  ) => {
    e.preventDefault();
    onContextMenu(sectionId, e);
  };

  const handleOnChangeColumnName = (sectionId: number, oldValue: string, newValue: string, event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    let childrens: HTMLCollection = event.currentTarget.parentElement?.parentElement?.children;
    childrens[0].classList.add("hidden");
    onChangeColumnName(sectionId, oldValue, newValue);
    childrens[1].classList.remove("hidden");
    childrens[2].classList.remove("hidden");
  };

  const handleInputChange = (rowIndex: number, column: string, event: React.ChangeEvent<HTMLInputElement>) => {
    items[rowIndex][column] = event.target.value
    presetTableRowEdit();
  };

  const presetTableRowEdit = () => {
    setSelectedRowIndex(-1)
    setSelectedColumn("");
  };

  const handleCheckboxChange = (rowIndex: number, column: string, event: React.ChangeEvent<HTMLInputElement>) => {
    items[rowIndex][column] = event.target.checked
    presetTableRowEdit();
  };

  const onEditColumnName = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // @ts-ignore
    let childrens: HTMLCollection = event.currentTarget.parentElement?.children;
    childrens[0].classList.remove("hidden");
    childrens[1].classList.add("hidden");
    childrens[2].classList.add("hidden");
  };

  const onColumnDataEdit = (rowIndex: number, columnName: string, event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    event.preventDefault();
    setSelectedRowIndex(rowIndex);
    setSelectedColumn(columnName);
    (event.currentTarget.firstChild as HTMLInputElement).autofocus;
  };

  return (
    <div className={`m-1 p-1 border overflow-x-auto ${display ? "" : "hidden"}`}>
      <div className="relative">
        <table id={sectionName} className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" onContextMenu={(event) => handleContextMenu(sectionId, event)}>
          <caption className="p-2 text-sm text-left rtl:text-right text-white bg-blue-950 dark:text-white dark:bg-gray-800">
            {sectionName}
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-1 py-1">
                <input id="checkbox-all-search" type="checkbox" />
              </th>

              {Object.keys(items[0]).map((col: string) => (
                <th key={col} scope="col" className="px-6 py-3">
                  <div className="flex flex-row">
                    <div className="hidden">
                      <input type="text" defaultValue={col} onBlur={(event) => handleOnChangeColumnName(sectionId, col, event.target.value, event)} />
                    </div>
                    <div>{col}</div>
                    <div className='cursor-pointer' onClick={(event) => onEditColumnName(event)}>
                      <svg className="w-3 h-4 ml-1 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                      </svg>
                    </div>
                  </div>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((data: any, rowIndex: number) => (
              <React.Fragment key={rowIndex}>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <input id="checkbox-1" type="checkbox" />
                  </th>
                  {
                    Object.keys(data).map((col: string, colIndex: number) => (
                      <td className="px-6 py-4" key={colIndex} onClick={(event) => onColumnDataEdit(rowIndex, col, event)}>
                        {typeof data[col] === "string" ? (
                          selectedRowIndex === rowIndex && selectedColumn === col ? (
                            <input type="text" name={`items[${rowIndex}][${col}]`} defaultValue={data[col]} onBlur={(e) => handleInputChange(rowIndex, col, e)} className="px-2 py-1 bg-white border-b-2 border-gray-300 focus:outline-none text-sm " />
                          ) : (data[col])


                        ) : typeof data[col] === "boolean" ? (
                          selectedRowIndex === rowIndex && selectedColumn === col ? (
                            <input type="checkbox" name={`items[${rowIndex}][${col}]`} defaultChecked={data[col]} onChange={(e) => handleCheckboxChange(rowIndex, col, e)} />
                          ) : (
                            data[col] == true ? (
                              <span className="text-xs text-green-800 me-2 px-1.5 py-0.5 uppercase">{data[col] + ""}</span>
                            ) : (
                              <span className="text-xs text-red-800 me-2 px-1.5 py-0.5 uppercase">{data[col] + ""}</span>
                            )
                          )
                        ) : typeof data[col] === "number" ? (

                          data[col]

                        ) : null}
                      </td>
                    ))
                  }
                  <td>
                    <div className="flex">
                      <button type="button" className="cursor-pointer ml-1">
                        <svg className="w-5 h-6 text-red-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default LivoTableSection;