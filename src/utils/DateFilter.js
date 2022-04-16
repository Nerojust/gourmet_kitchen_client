import moment from 'moment';
import dateFormat, {masks} from 'dateformat';

const dateFilterParser = typeString => {
  var type = typeString.toLowerCase();
  const today = moment();
  let startDate = today.startOf(type).format('YYYY-MM-DD');
  let endDate = today.endOf(type);
  //console.log("end date before", endDate)
  // if (type === 'day') {
  endDate = endDate.add(1, 'days').format('YYYY-MM-DD');
  //console.log("inside end date", endDate)
  // } else {
  //   endDate = endDate.format('YYYY-MM-DD');
  // }

  return {startDate, endDate};
};
const getDateWithoutTime = date => {
  return dateFormat(date, 'yyyy-mm-dd');
};
const subtractOneDayFromTime = (dateValue, number) => {
  var dateRes = moment(dateValue).subtract(number, 'day');
  var date = dateRes.format('YYYY-MM-DD HH:MM:SS');

  return date;
};

export {dateFilterParser, getDateWithoutTime,subtractOneDayFromTime};
