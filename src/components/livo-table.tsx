import { LivoTableSectionInterface } from '@/interfaces/global';
import { Underdog } from 'next/font/google';
import React from 'react';


const LivoTableSection: React.FC<LivoTableSectionInterface> = ({ display, sectionName, sectionId, items, onItemsChange, onContextMenu, onChangeColumnName }) => {
  // const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

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

  // const handleCloseMenu = () => {
  //   setMenuPosition(null);
  // };

  const handleInputChange = (rowIndex: number, index: number, column: string, event: React.ChangeEvent<HTMLInputElement>) => {
    onItemsChange(rowIndex, index, column, event.target.value);
  };

  const handleCheckboxChange = (rowIndex: number, index: number, column: string, event: React.ChangeEvent<HTMLInputElement>) => {
    onItemsChange(rowIndex, index, column, event.target.checked);
  };

  const onEditColumnName = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // @ts-ignore
    let childrens: HTMLCollection = event.currentTarget.parentElement?.children;
    childrens[0].classList.remove("hidden");
    childrens[1].classList.add("hidden");
    childrens[2].classList.add("hidden");
  };

  return (
    <div className={`m-1 p-1 border ${display ? "" : "hidden"}`}>
      <div className="relative overflow-x-auto">
        <div className="p-2 text-white border bg-blue-950">
          {sectionName}
        </div>
        <table id={sectionName} className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" onContextMenu={(event) => handleContextMenu(sectionId, event)}>

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
                      <svg className="w-3 h-4 ml-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
                      </svg>
                    </div>
                    {/* <div className='cursor-pointer hidden'>
                      <svg className="w-3 h-4 ml-l text-green-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div> */}
                  </div>
                </th>
              ))}
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
                      <td className="px-6 py-4" key={colIndex}>
                        {typeof data[col] === "string" ? (
                          <input type="text" name={`items[${data.id}][${col}]`} defaultValue={data[col]} onChange={(e) => handleInputChange(sectionId, rowIndex, col, e)} className="px-2 py-1 bg-white border shadow-sm border-slate-300 placeholder-slate-400  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none" />
                        ) : typeof data[col] === "boolean" ? (

                          <input type="checkbox" name={`items[${data.id}][${col}]`} defaultChecked={data[col]} onChange={(e) => handleCheckboxChange(sectionId, rowIndex, col, e)} />
                        ) : typeof data[col] === "number" ? (
                          data[col]
                        ) : null}
                      </td>
                    ))
                  }
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