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
                <svg className="w-5 h-6 text-indigo-800 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                </svg>

              </div>
              <div className="basis-1/8 ml-1">
                <svg className="text-red-600 dark:text-gray-500 w-5 h-6 cursor-pointer" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd">
                  </path>
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
