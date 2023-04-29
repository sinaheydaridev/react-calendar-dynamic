import { FC } from "react";
import moment, { Moment } from "moment";

import Day from "./Day";

export type DaysProps = {
  date: Moment;
  startDate: Moment;
  endDate: Moment;
  mode: "single" | "range";
  loading?: boolean;
  availableDateRange?: Date[];
  timezone: string;
  maxValue?: Date | null;
  minValue?: Date | null;
  onClick: (date: Moment) => void;
};

const Days: FC<DaysProps> = ({
  date,
  startDate,
  endDate,
  mode,
  loading,
  availableDateRange = [],
  maxValue,
  minValue,
  timezone = "",
  onClick,
}) => {
  const thisDate = moment(date.format());
  const daysInMonth = moment(date.format()).daysInMonth();
  const days: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];

  for (let i = 0; i <= 6; i++) {
    labels.push(
      <span key={Math.random()} className="dynamic_calendar__days__label">
        {moment().day(i).format("ddd")}
      </span>
    );
  }

  for (let i = 1; i <= daysInMonth; i++) {
    thisDate.date(i);
    days.push(
      <Day
        key={moment(thisDate).format("DD MM YYYY")}
        onClick={(date) => onClick(date)}
        date={moment(thisDate)}
        startDate={startDate}
        endDate={endDate}
        mode={mode}
        loading={loading}
        maxValue={maxValue}
        minValue={minValue}
        isAvailableDay={Boolean(
          availableDateRange
            .sort((a, b) => a.getTime() - b.getTime())
            .some((date) => {
              return (
                date.toDateString() === moment(thisDate).toDate().toDateString()
              );
            })
        )}
        availableDateRangeLength={availableDateRange.length}
        timezone={timezone}
      />
    );
  }

  return (
    <>
      {labels}
      {days}
    </>
  );
};

export default Days;
