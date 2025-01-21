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
  onItemsChange: (rowIndex: number, index: number, column: string, newValue: any) => void;
  onContextMenu: (sectionId: number, event: React.MouseEvent<HTMLTableElement, MouseEvent>) => void;
  onChangeColumnName: (sectionId: number, oldValue: string, newValue: string) => void;
}