import { FC, useCallback } from "react";
import moment, { Moment } from "moment";

import * as utilDate from "./utils";

export type DayProps = {
  date: Moment;
  startDate: Moment;
  endDate: Moment;
  mode: "single" | "range";
  isAvailableDay: boolean;
  loading?: boolean;
  timezone: string;
  maxValue?: Date | null;
  minValue?: Date | null;
  availableDateRangeLength: number;
  onClick: (date: Moment) => void;
};

const Day: FC<DayProps> = ({
  date,
  startDate,
  endDate,
  mode,
  isAvailableDay = false,
  loading = false,
  timezone = "",
  maxValue,
  minValue,
  availableDateRangeLength,
  onClick,
}) => {
  const classList: string[] = [];

  const isDayDisabled = useCallback(() => {
    const min = utilDate.getDateWithTimezone({
      date: minValue || undefined,
      timezone,
    });
    const max = utilDate.getDateWithTimezone({
      date: maxValue || undefined,
      timezone,
    });
    const now = utilDate.getDateWithTimezone({
      timezone,
    });
    if (!minValue && !maxValue) return false;
    else {
      if (
        maxValue &&
        max.date() < date.date() &&
        utilDate.yearFormat(date) === utilDate.yearFormat(now) &&
        moment(date).month() === now.month()
      ) {
        return true;
      }
      if (
        !maxValue &&
        min &&
        min.date() > date.date() &&
        utilDate.yearFormat(date) === utilDate.yearFormat(now) &&
        moment(date).month() === now.month()
      ) {
        return true;
      }
      if (
        !maxValue &&
        min &&
        utilDate.yearFormat(date) === utilDate.yearFormat(now) &&
        moment(date).month() < now.month()
      ) {
        return true;
      } else if (
        !maxValue &&
        min &&
        utilDate.yearFormat(date) < utilDate.yearFormat(now)
      ) {
        return true;
      }
      if (
        maxValue &&
        utilDate.yearFormat(date) === utilDate.yearFormat(now) &&
        moment(date).month() > now.month()
      ) {
        return true;
      } else if (
        maxValue &&
        utilDate.yearFormat(date) > utilDate.yearFormat(now)
      ) {
        return true;
      }
    }
    return false;
  }, [date, maxValue, minValue, timezone]);

  const customIsDayDisabled = () => {
    if (availableDateRangeLength === 0) return false;
    if (isAvailableDay) {
      return false;
    } else {
      return true;
    }
  };

  if (utilDate.getDateWithTimezone({ timezone }).isSame(date, "day")) {
    classList.push("dynamic_calendar__active_day");
  }

  if (startDate && date.isSame(startDate, "day")) {
    classList.push("dynamic_calendar__start_day");
  }

  if (mode === "range") {
    if (startDate && date.isSame(startDate, "day")) {
      if (endDate && endDate.format("DD") !== startDate.format("DD")) {
        classList.push("dynamic_calendar__start_day_bg");
        classList.push("dynamic_calendar__startday");
      }
    }
    if (startDate && endDate && date.isBetween(startDate, endDate, "day")) {
      classList.push("dynamic_calendar__between_day");
    }
    if (endDate && date.isSame(endDate, "day")) {
      classList.push("dynamic_calendar__end_day");
      if (endDate && endDate.format("DD") !== startDate.format("DD")) {
        classList.push("dynamic_calendar__end_day_bg");
      }
    }
  }

  if (isDayDisabled()) {
    classList.push("dynamic_calendar__disabled_day");
  }

  if (customIsDayDisabled()) {
    classList.push("dynamic_calendar__disabled_day");
  }

  const bundleOnClick = () => {
    if (isDayDisabled() || customIsDayDisabled()) {
      return;
    }
    onClick(date);
  };

  if (loading) {
    return (
      <div className="dynamic_calendar__day_skeleton_container">
        <div className="dynamic_calendar__day_skeleton"></div>
      </div>
    );
  }

  return (
    <div className="dynamic_calendar__day_container" onClick={bundleOnClick}>
      <div className={["dynamic_calendar__day", classList.join(" ")].join(" ")}>
        {date.date()}
      </div>
    </div>
  );
};

export default Day;
