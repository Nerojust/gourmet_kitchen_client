import moment from 'moment';

const dateFilterParser = (typeString) => {
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

export {dateFilterParser};
