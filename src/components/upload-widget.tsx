import React from 'react';
import { UploadCheckList } from "../interfaces/global"

const UploadCheckListForm: React.FC<UploadCheckList> = ({ name, id, onChange }) => {
  return (
    <div className="upload-widget p-2">
      <label htmlFor={id}>{name}</label>
      <input type="file" id={id} onChange={onChange} />
    </div>
  );
};



export default UploadCheckListForm;
