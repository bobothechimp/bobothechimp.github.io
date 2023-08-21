export const createOrdinalIndicator = (num) => {
  let oi: string;
  switch (num % 10) {
    case 1:
      oi = "st";
      break;
    case 2:
      oi = "nd";
      break;
    case 3:
      oi = "rd";
      break;
    default:
      oi = "th";
      break;
  }
  return <sup>{oi}</sup>;
};
