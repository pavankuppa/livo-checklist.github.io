import React from 'react';

export interface UploadCheckList {
  name: string; // Use `string` instead of `String`
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add proper typing for onChange
}

export interface CheckListItem {
    name: string;
    data: any;
    display: boolean;
}

export interface LivoCheckList {
  projectName: string;
  date: Date;
  partNumber: string;
  partName: string;
  drawnBy: string;
  reviewedBy: string;
  data: CheckListItem[];
}


export interface CheckListSection {
  items: CheckListItem[];
  onSectionCreate: (event: any) => void;
  onSectionListChange: (rowIndex: number, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface LivoTableSectionInterface {
  display: boolean;
  sectionName: string;
  sectionId: number;
  items: any;
  onContextMenu: (sectionId: number, event: React.MouseEvent<HTMLTableElement, MouseEvent>) => void;
  onChangeColumnName: (sectionId: number, oldValue: string, newValue: string) => void;
}