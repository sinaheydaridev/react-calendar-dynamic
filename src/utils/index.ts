import moment, { Moment } from "moment";
import "moment-timezone";

export const monthNameFormat = (date: Moment) => date.format("MMMM");

export const dayFormat = (date: Moment) => date.format("DD");

export const yearFormat = (date: Moment) => date.format("YYYY");

export const getDateWithTimezone = ({
  date = new Date(),
  timezone,
}: {
  date?: Date;
  timezone: string;
}) => {
  let dateWithTimezone: Date;
  try {
    const time = new Date(
      moment(date.getTime())
        .tz(timezone || moment.tz.guess())
        .format("YYYY-MM-DD HH:mm")
    ).getTime();
    dateWithTimezone = new Date(time);
  } catch {
    dateWithTimezone = new Date();
  }
  const momentDate = moment(dateWithTimezone);
  return momentDate;
};
