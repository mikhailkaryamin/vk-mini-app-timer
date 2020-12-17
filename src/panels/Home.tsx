import React, { useState } from "react";
import {
  Panel,
  PanelHeader,
  FormLayout,
  Input,
  Button,
  Group,
  List,
  SimpleCell,
  Header,
} from "@vkontakte/vkui/dist";

type Props = {
  id: string;
};

type FormatTime = {
  year: number;
  month: number;
  days: number;
  hour: number;
  minutes: number;
  seconds: number;
};

const MS_YEAR = 31556952000;
const MS_MONTH = 2629800000;
const MS_DAY = 86400000;
const MS_HOUR = 3600000;
const MS_MINUTES = 60000;
const MS_SECOND = 1000;

const formatTime = (ms: number): FormatTime => {
  if (ms < 0) {
    ms = ms * -1;
  }

  const msCurrentTimeZone = ms + new Date().getTimezoneOffset() * 60000;

  const year = Math.floor(msCurrentTimeZone / MS_YEAR);
  const month = Math.floor((msCurrentTimeZone % MS_YEAR) / MS_MONTH);
  const days = Math.floor((msCurrentTimeZone % MS_MONTH) / MS_DAY);
  const hour = Math.floor((msCurrentTimeZone % MS_DAY) / MS_HOUR);
  const minutes = Math.floor((msCurrentTimeZone % MS_HOUR) / MS_MINUTES);
  const seconds = Math.floor((msCurrentTimeZone % MS_MINUTES) / MS_SECOND);

  return {
    year,
    month,
    days,
    hour,
    minutes,
    seconds,
  };
};

const calculateDate = (date: number, time = 0): FormatTime => {
  if (!date) {
    return {
      year: 0,
      month: 0,
      days: 0,
      hour: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return formatTime(Date.now() - date - time);
};

const Home: React.FC<Props> = ({ id }: Props) => {
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const [isVisibilityTime, setVisibilityTime] = useState(false);

  if (isNaN(time)) {
    setTime(0);
  }

  const isBeforeDate = (date + time) < Date.now();

  const { year, month, days, hour, minutes, seconds } = calculateDate(
      date,
      time
  );


  return (
    <Panel id={id}>
      <PanelHeader>Таймер</PanelHeader>
      <Group>
        <FormLayout>
          <Input
            type="date"
            top="Дата"
            name="date"
            onChange={(evt) => setDate(evt.target.valueAsNumber)}
          />

          <Button onClick={() => setVisibilityTime(!isVisibilityTime)}>
            {isVisibilityTime ? "Убрать время" : "Добавить время"}
          </Button>

          {isVisibilityTime && (
            <Input
              type="time"
              top="Время"
              name="time"
              onChange={(evt) => setTime(evt.target.valueAsNumber)}
            />
          )}
        </FormLayout>
      </Group>

      <Group>
        {(!!seconds && isBeforeDate) && <Header mode="secondary">Прошло с даты:</Header>}
        {(!!seconds && !isBeforeDate) && <Header mode="secondary">До даты осталось:</Header>}
        <List>
          {!!year && <SimpleCell indicator={year}>{"Лет:"}</SimpleCell>}
          {!!month && <SimpleCell indicator={month}>{"Месяцев"}</SimpleCell>}
          {!!days && <SimpleCell indicator={days}>{"Дней"}</SimpleCell>}
          {!!hour && <SimpleCell indicator={hour}>{"Часов"}</SimpleCell>}
          {!!minutes && <SimpleCell indicator={minutes}>{"Минут"}</SimpleCell>}
          {!!seconds && <SimpleCell indicator={seconds}>{"Секунд"}</SimpleCell>}
        </List>
      </Group>
    </Panel>
  );
};

export default Home;
