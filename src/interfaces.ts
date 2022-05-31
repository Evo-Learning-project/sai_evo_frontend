/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SelectableOption {
  value: any;
  content: string;
  description?: string | string[];
  icons?: string[];
  disabled?: boolean;
}

export interface DialogData {
  // used for components where a single dialog has multiple uses
  // to dynamically pass certain props to the dialog component
  title?: string;
  text?: string;
  yesText?: string;
  noText?: string;
  dismissible?: boolean;
  confirmOnly?: boolean;
  onYes?: () => void;
  onNo?: () => void;
  error?: boolean;
  warning?: boolean;
}

export interface ErrorMessage {
  icon?: string;
  title: string;
  content?: string;
}
