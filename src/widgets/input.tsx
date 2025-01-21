import React from 'react';

interface InputText {
    name: string;
    value: string;
}

const LivoInput: React.FC<InputText> = (props: any) => {
  return (
    <input type="text" name={props.name} defaultValue={props.value} className="px-2 py-1 bg-white border shadow-sm border-slate-300 placeholder-slate-400  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md sm:text-sm focus:ring-1 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none"/>
  );
};
export default LivoInput;
