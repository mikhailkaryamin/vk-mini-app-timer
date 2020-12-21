import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  Panel,
  PanelHeader,
  FormLayout,
  Input,
  Button,
  Group,
  List,
  Header,
  Cell,
  PanelHeaderBack,
} from "@vkontakte/vkui/dist";

import { ValuesPanelId, CurrentEventData } from "../shared/types";
import { PanelId, EMPTY_EVENT_DATA, MS } from "../shared/consts";
import { getStringDate, getDateCurrentTimeZone } from "../shared/utils";

type Props = {
  currentEventData: CurrentEventData;
  id: ValuesPanelId;
  go: (id: ValuesPanelId) => void;
  timeId: number;
  onFetch: (arg1: string) => void;
  setCurrentEventData: (arg1: CurrentEventData) => void;
};

const getDefaultValue = (dateTime: CurrentEventData) => {
  const dateISO = new Date(+dateTime.time).toISOString();
  const date = dateISO.substring(0, 10);
  const time = dateISO.substring(11, 16);

  return {
    date,
    time,
  };
};

const getTimeMs = (timeString: string) => {
  if (!timeString) {
    return 0;
  }

  const hourMs = +(timeString.substring(0, 2)) * MS.HOUR;
  const minuteMs = +(timeString.substring(3, 5)) * MS.MINUTE;

  return (hourMs + minuteMs);
};

const Edit: React.FC<Props> = ({
  id,
  go,
  timeId,
  onFetch,
  currentEventData,
  setCurrentEventData,
}: Props) => {

  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [nameEventValue, setNameEventValue] = useState("");

  const [isVisibilityTime, setVisibilityTime] = useState(false);
  const [newTimeData, setNewTimeData] = useState("");

  const onSubmitForm = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const form = new FormData(evt.currentTarget);

    const dateForm = new Date(`${form.get("date")}`)?.getTime();
    const nameEventForm = form.get("nameDate");
    const timeForm = getTimeMs(timeValue);

    const dataString = `${isBeforeDate ? "-" : "+"}${
      dateForm + timeForm
    },${nameEventForm}`;

    setNewTimeData(dataString);
    setCurrentEventData(EMPTY_EVENT_DATA);
  };

  const onClickBackButton = () => {
    go(PanelId.TIMERS_LIST);
    setCurrentEventData(EMPTY_EVENT_DATA);
  };

  useEffect(() => {
    if (currentEventData.time) {
      const defaultValue = getDefaultValue(currentEventData);

      setDateValue(defaultValue.date);
      setTimeValue(defaultValue.time);
      setNameEventValue(currentEventData.nameDate);

      setCurrentEventData({
        time: "",
        nameDate: "",
      });
    }
  }, []);

  useEffect(() => {
    async function sendTimeData() {
      if (newTimeData) {
        await bridge.send("VKWebAppStorageSet", {
          key: `${timeId}`,
          value: newTimeData,
        });

        go(PanelId.TIMERS_LIST);
        onFetch(newTimeData);
      }
    }

    sendTimeData();
  }, [newTimeData]);


  const dateCurrentTimeZone = getDateCurrentTimeZone(new Date(dateValue)?.getTime());
  const time = getTimeMs(timeValue);

  const isBeforeDate = dateCurrentTimeZone + time < Date.now();
  const stringDate = getStringDate(dateCurrentTimeZone + time);

  return (
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={onClickBackButton}></PanelHeaderBack>}
      >
        Редактор
      </PanelHeader>
      <Group>
        <FormLayout onSubmit={onSubmitForm}>
          <Input
            type="date"
            top="Дата"
            name="date"
            placeholder="ГГГГ-ММ-ДД"
            value={dateValue}
            onChange={(evt) => setDateValue(evt.target.value)}
            required
          />

          <Button
            type="button"
            onClick={() => setVisibilityTime(!isVisibilityTime)}
          >
            {isVisibilityTime ? "Убрать время" : "Добавить время"}
          </Button>

          {isVisibilityTime && (
            <Input
              type="time"
              top="Время"
              name="time"
              placeholder="ЧЧ:ММ"
              value={timeValue}
              onChange={(evt) => setTimeValue(evt.target.value)}
            />
          )}
          <Input
            placeholder="Название события"
            name="nameDate"
            onChange={(evt) => {
              setNameEventValue(evt.target.value);
            }}
            value={nameEventValue}
            required
          ></Input>
          <Button size="xl" type="submit">
            {"Сохранить событие"}
          </Button>
        </FormLayout>
      </Group>

      <Group>
        {!!stringDate && isBeforeDate && (
          <Header mode="secondary">Прошло с даты:</Header>
        )}
        {!!stringDate && !isBeforeDate && (
          <Header mode="secondary">До даты осталось:</Header>
        )}
        <List>
          <Cell>{stringDate}</Cell>
        </List>
      </Group>
    </Panel>
  );
};

export default Edit;
