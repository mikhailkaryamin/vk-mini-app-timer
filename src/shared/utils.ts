import { MS } from "./consts";
import { FormatTime } from "./types";

const DeclensionTime = {
  YEAR: {
    DECLENSION_FIRST: "год,",
    DECLENSION_SECOND: "года,",
    DECLENSION_THIRD: "лет,",
  },
  MONTH: {
    DECLENSION_FIRST: "месяц,",
    DECLENSION_SECOND: "месяца,",
    DECLENSION_THIRD: "месяцев,",
  },
  DAY: {
    DECLENSION_FIRST: "день,",
    DECLENSION_SECOND: "дня,",
    DECLENSION_THIRD: "дней,",
  },
  HOUR: {
    DECLENSION_FIRST: "час,",
    DECLENSION_SECOND: "часа,",
    DECLENSION_THIRD: "часов,",
  },
  MINUTE: {
    DECLENSION_FIRST: "минута,",
    DECLENSION_SECOND: "минуты,",
    DECLENSION_THIRD: "минут,",
  },
  SECOND: {
    DECLENSION_FIRST: "секунда",
    DECLENSION_SECOND: "секунд",
    DECLENSION_THIRD: "секунд",
  },
};

const formatTime = (ms: number): FormatTime => {
  if (ms < 0) {
    ms = ms * -1;
  }

  let msCurrentTimeZone = ms + new Date().getTimezoneOffset() * 60000;

  if (msCurrentTimeZone < 0) {
    msCurrentTimeZone = msCurrentTimeZone * -1;
  }

  const year = Math.floor(msCurrentTimeZone / MS.YEAR);
  const month = Math.floor((msCurrentTimeZone % MS.YEAR) / MS.MONTH);
  const day = Math.floor((msCurrentTimeZone % MS.MONTH) / MS.DAY);
  const hour = Math.floor((msCurrentTimeZone % MS.DAY) / MS.HOUR);
  const minute = Math.floor((msCurrentTimeZone % MS.HOUR) / MS.MINUTES);
  const second = Math.floor((msCurrentTimeZone % MS.MINUTES) / MS.SECOND);

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
  };
};


const getStringDate = (date: number, time = 0) => {
  if (!date) {
    return {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    };
  }

  const { year, month, day, hour, minute, second } = formatTime(
      Date.now() - date - time
  );

  const getFormatTimeString = (
      timeData: number,
      declensionFirst: string,
      declensionSecond: string,
      declensionThird: string
  ) => {
    switch (true) {
      case timeData === 1:
        return `1 ${declensionFirst} `;
      case timeData.toString().endsWith("2") || timeData.toString().endsWith("3") || timeData.toString().endsWith("4"):
        return `${timeData} ${declensionSecond} `;
      case timeData >= 5:
        return `${timeData} ${declensionThird} `;
      default:
        return ``;
    }
  };

  const YEAR = getFormatTimeString(
      year,
      DeclensionTime.YEAR.DECLENSION_FIRST,
      DeclensionTime.YEAR.DECLENSION_SECOND,
      DeclensionTime.YEAR.DECLENSION_THIRD
  );

  const MONTH = getFormatTimeString(
      month,
      DeclensionTime.MONTH.DECLENSION_FIRST,
      DeclensionTime.MONTH.DECLENSION_SECOND,
      DeclensionTime.MONTH.DECLENSION_THIRD
  );

  const DAY = getFormatTimeString(
      day,
      DeclensionTime.DAY.DECLENSION_FIRST,
      DeclensionTime.DAY.DECLENSION_SECOND,
      DeclensionTime.DAY.DECLENSION_THIRD
  );

  const HOUR = getFormatTimeString(
      hour,
      DeclensionTime.HOUR.DECLENSION_FIRST,
      DeclensionTime.HOUR.DECLENSION_SECOND,
      DeclensionTime.HOUR.DECLENSION_THIRD
  );

  const MINUTE = getFormatTimeString(
      minute,
      DeclensionTime.MINUTE.DECLENSION_FIRST,
      DeclensionTime.MINUTE.DECLENSION_SECOND,
      DeclensionTime.MINUTE.DECLENSION_THIRD
  );

  const SECOND = getFormatTimeString(
      second,
      DeclensionTime.SECOND.DECLENSION_FIRST,
      DeclensionTime.SECOND.DECLENSION_SECOND,
      DeclensionTime.SECOND.DECLENSION_THIRD
  );


  return (
    `${YEAR}${MONTH}${DAY}${HOUR}${MINUTE}${SECOND}`
  );
};

export { getStringDate };
