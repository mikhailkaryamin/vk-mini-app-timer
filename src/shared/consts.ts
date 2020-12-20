const MS = {
  YEAR: 31556952000,
  MONTH: 2629800000,
  DAY: 86400000,
  HOUR: 3600000,
  MINUTES: 60000,
  SECOND: 1000,
};

const PanelId = {
  TIMER_ADD: "timer-add",
  TIMERS_LIST: "timers-list",
} as const;

const EMPTY_EVENT_DATA = {
  time: "",
  nameDate: "",
};

export {
  EMPTY_EVENT_DATA,
  MS,
  PanelId,
};
