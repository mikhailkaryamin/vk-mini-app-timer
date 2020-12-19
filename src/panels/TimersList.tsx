import React from "react";
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
import { DataTimer, TimeData, ValuesPanelId } from "../shared/types";
import { getStringDate } from "../shared/utils";

type Props = {
  id: ValuesPanelId;
  timeData: TimeData[];
  go: (id: ValuesPanelId) => void;
};

const ANCHOR_TIME = ",";

const getModelTimersList = (dataTimer: DataTimer[]) => {
  const timerList = [];

  let currentLengthTime;
  let time;
  let dateName;

  for (const date of dataTimer) {
    currentLengthTime = date.value.indexOf(ANCHOR_TIME);
    time = date.value.substring(1, currentLengthTime);
    dateName = date.value.substring(currentLengthTime + 1);
    timerList.push({
      time,
      dateName,
      isBefore: date.value.charAt(0) === "-",
    });
  }

  return timerList;
};

const TimerList: React.FC<Props> = ({ id, go, timeData }: Props) => {
  const isEmptyData = !timeData.length || !timeData[0].value;

  return (
    <Panel id={id}>
      <PanelHeader>Cобытия</PanelHeader>
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
              if (!el.dateName) {
                return "";
              }

              return (
                <Cell
                  key="id"
                  size="l"
                  multiline={true}
                  description={getStringDate(+el.time)}
                  bottomContent={
                    <div style={{ display: "flex" }}>
                      <Button size="m" mode="outline">
                        Редактировать
                      </Button>
                      <Button
                        size="m"
                        mode="destructive"
                        style={{ marginLeft: 8 }}
                      >
                        Удалить
                      </Button>
                    </div>
                  }
                >
                  <Title level="2" weight="regular">
                    {el.dateName}
                  </Title>
                  {el.isBefore ? `C события прошло:` : `До события осталось:`}
                </Cell>
              );
            })}
        </List>
        <Div>
          <Button size="xl" onClick={() => go(PanelId.TIMER_ADD)}>{"Добавить событие"}</Button>
        </Div>
      </Group>
    </Panel>
  );
};

export default TimerList;
