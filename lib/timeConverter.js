export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function millisToHoursAndMinutesAndSeconds(ms) {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = Math.round(seconds % 60);

  if (hours === 0) {
    return minutes + " min " + (seconds < 10 ? "0" : "") + seconds + " sec ";
  } else {
    return (
      hours +
      " hr " +
      minutes +
      " min " +
      (seconds < 10 ? "0" : "") +
      seconds +
      " sec "
    );
  }
}
