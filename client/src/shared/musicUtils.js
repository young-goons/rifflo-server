/**
 * Obtain the total length (or the end time) of the input length into a nice string format
 * @param length length in seconds (number)
 * @returns {string} input length converted to a string of format (M)M:SS
 */
export const getEndTimeStr = (length) => {
    const minutes = Math.floor(length / 60),
        secondsInt = length - minutes * 60,
        secondsStr = secondsInt.toString(),
        seconds = secondsStr.substr(0, 2);

    return (minutes < 10 ? "0" + minutes : minutes) + ':' +
        (seconds < 10 ? "0" + seconds : seconds);
};

/**
 * Obtain the current time in a nice string format of MM:SS
 * @param currentTime current time in seconds (float)
 * @returns {string} input time converted to a string of format MM:SS
 */
export const getCurrentTimeStr = (currentTime) => {
    const currentHour = parseInt(currentTime / 3600) % 24,
          currentMinute = parseInt(Math.floor(currentTime / 60)) % 60,
          currentSeconds = Math.floor(currentTime) % 60;

    return (currentMinute < 10 ? "0" + currentMinute : currentMinute) + ":" +
        (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds);
};

/**
 * Obtain the current time in a nice string format of MM:SS.MSMS
 * @param currentTime current time in seconds (float)
 * @returns {string} input time converted to a string of format MM:SS.MSMS
 */
export const getCurrentTimeFloatStr = (currentTime) => {
    // TODO: there is a potential error due to toFixed (when it is rounded up from .99999 or sth => find other way)
    const currentHour = parseInt(currentTime / 3600) % 24,
          currentMinute = parseInt(Math.floor(currentTime) / 60) % 60,
          currentSeconds = Math.floor(currentTime) % 60,
          currentMSeconds = (currentTime - Math.floor(currentTime)).toFixed(2) * 100;

    const currentMSecondsStr = currentMSeconds < 10 ? "0" + currentMSeconds : currentMSeconds;

    return (currentMinute < 10 ? "0" + currentMinute : currentMinute) + ":" +
        (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds) + "." +
        currentMSecondsStr.toString().substring(0, 2);
};

/**
 * Convert time string in format MM:SS.MSMS into seconds in floating point
 * Assume input timeStr is in the right format
 * @param timeStr time string in format of MM:SS.MSMS
 */
export const convertTimeStrToTime = (timeStr) => {
    const minute = parseInt(timeStr.split(":")[0]),
          second = parseInt(timeStr.split(":")[1].split(".")[0]),
          msecond = parseInt(timeStr.split(":")[1].split(".")[1]),
          time = minute * 60 + second + msecond / 100;
    console.log(minute, second, msecond);
    return time;
};