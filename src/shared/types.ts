import { PanelId } from "./consts";

export type DataTimer = {
  key: string;
  value: string;
};

export type CurrentEventData = {
  time: string;
  nameDate: string;
};

export type FormatTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

type KeysPanelId = keyof typeof PanelId;
export type ValuesPanelId = typeof PanelId[KeysPanelId];
