import React from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  Panel,
  PanelHeader,
  Group,
  Header,
  List,
  Cell,
  Subhead,
  Title,
  Button,
  Div,
} from "@vkontakte/vkui";

import { PanelId } from "../shared/consts";
import { DataTimer, ValuesPanelId, CurrentEventData } from "../shared/types";
import { getStringDate, getDateCurrentTimeZone } from "../shared/utils";

type Props = {
  id: ValuesPanelId;
  timeData: DataTimer[];
  go: (id: ValuesPanelId) => void;
  onFetch: (arg1: string) => void;
  setCurrentEventData: (arg1: CurrentEventData) => void;
  setTimeId: (arg1: number) => void;
};

const ANCHOR_TIME = ",";

const getModelTimersList = (dataTimer: DataTimer[]) => {
  const timerList = [];
  let currentLengthTime;
  let time;
  let nameDate;

  for (const date of dataTimer) {
    currentLengthTime = date.value.indexOf(ANCHOR_TIME);
    time = date.value.substring(1, currentLengthTime);
    nameDate = date.value.substring(currentLengthTime + 1);

    timerList.push({
      id: date.key,
      time,
      nameDate,
      isBefore: date.value.charAt(0) === "-",
    });
  }

  return timerList;
};

const TimerList: React.FC<Props> = ({
  id,
  go,
  timeData,
  onFetch,
  setCurrentEventData,
  setTimeId,
}: Props) => {
  const isEmptyData = !timeData.length || !timeData.some((el) => !!el.value);
  const isFullEventList = timeData.every((el) => el.value);

  async function deleteEvent(eventId: string, eventDescription: string) {
    await bridge.send("VKWebAppStorageSet", { key: `${eventId}`, value: "" });

    onFetch(eventDescription);
  }

  const onClickEditEvent = (
      eventId: string,
      time: string,
      nameDate: string
  ) => {
    setCurrentEventData({
      time,
      nameDate,
    });
    setTimeId(+eventId);
    go(PanelId.TIMER_ADD);
  };

  return (
    <Panel id={id}>
      <PanelHeader>Cобытия</PanelHeader>
      {!!timeData.length && (
        <Group header={<Header mode="secondary">Список событий</Header>}>
          <List>
            {isEmptyData && (
              <Cell>
                <Subhead weight="regular">
                  У вас еще нет добавленных событий
                </Subhead>
              </Cell>
            )}
            {isEmptyData ||
              getModelTimersList(timeData).map((el) => {
                if (!el.nameDate) {
                  return "";
                }
                const eventDescription = getStringDate(getDateCurrentTimeZone(+el.time));

                return (
                  <Cell
                    key={el.id}
                    size="l"
                    multiline={true}
                    description={eventDescription}
                    bottomContent={
                      <div style={{ display: "flex" }}>
                        <Button
                          size="m"
                          mode="outline"
                          onClick={() =>
                            onClickEditEvent(el.id, el.time, el.nameDate)
                          }
                        >
                          Редактировать
                        </Button>
                        <Button
                          size="m"
                          mode="destructive"
                          style={{ marginLeft: 8 }}
                          onClick={() => deleteEvent(el.id, eventDescription)}
                        >
                          Удалить
                        </Button>
                      </div>
                    }
                  >
                    <Title level="2" weight="regular">
                      {el.nameDate}
                    </Title>
                    {el.isBefore ? `C события прошло:` : `До события осталось:`}
                  </Cell>
                );
              })}
          </List>
          {isFullEventList || (
            <Div>
              <Button size="xl" onClick={() => go(PanelId.TIMER_ADD)}>
                {"Добавить событие"}
              </Button>
            </Div>
          )}
        </Group>
      )}
    </Panel>
  );
};

export default TimerList;
