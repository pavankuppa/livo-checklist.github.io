import React from 'react';
import { CheckListItem, CheckListSection } from "../interfaces/global"


const CheckListItems: React.FC<CheckListSection> = (props) => {
  return (
    <div className="checklist-section p-2">
      <form onSubmit={props.onSectionCreate} method='post' action="#">
        <input autoComplete="off" type="text" name="sectionName" defaultValue={""} className="px-2 py-1 bg-white border shadow-sm border-slate-300 placeholder-slate-400  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none" />
        <input type="submit" className="mx-2 px-2 py-1 text-xs rounded-sm bg-lime-700 hover:bg-lime-800 text-white" value="Add section" />
      </form>
      <div className="checklist-items mt-2">
        <h2 className='bg-blue-950 p-2 text-sm text-white'>Sections</h2>
        <div className='p-2 border border-blue-950'>
          {props.items.map((item: CheckListItem, rowIndex: number) => (
            <div className="flex flex-row" key={rowIndex}>

              <div key={rowIndex} className="basis-3/4">
                <input type="checkbox" id={`item-${rowIndex}`} name={item.name} onChange={(event) => props.onSectionListChange(rowIndex, event)} defaultChecked={true} className='mr-2' />
                <label htmlFor={`item-${rowIndex}`}>{item.name}</label>
              </div>
              <div className="basis-1/8 ml-2">
                <svg className="w-5 h-6 text-indigo-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                </svg>
              </div>
              <div className="basis-1/8 ml-1">
                <svg className="w-5 h-6 text-red-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


export default CheckListItems;
