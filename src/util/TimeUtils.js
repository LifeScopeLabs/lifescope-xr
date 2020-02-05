export default class TimeUtils {

    static timeStringFromNumber(timeNum) {
        var hours = this.getTimeHours(timeNum);
        var minutes = this.getTimeMinutes(timeNum);
        var minutesStr = minutes.toString().padStart(2, '0');
        var timeStr = `${hours}:${minutesStr}`;
        return timeStr;
    }
    static minuteNumberToString(minutesNum) {
        // var hours = this.getTimeHours(timeNum);
        // var minutes = this.getTimeMinutes(timeNum);
        var minutes = Math.floor(minutesNum);
        var minutesStr = minutes.toString();
        var seconds = Math.floor(60 * (minutesNum - Math.floor(minutesNum)));
        var secondsStr = seconds.toString().padStart(2, '0');
        var timeStr = `${minutesStr}:${secondsStr}`;
        return timeStr;
    }
    static getTimeHours(time) {
        return Math.floor(time);
    }
    static getTimeMinutes(time) {
        return Math.floor(60 * (time - Math.floor(time)));
    }
    static getPaddedMinutesString(minutes) {
        return minutes.toString().padStart(2, '0');
    }
    static minutesToHourDecimal(minutes) {
        return minutes/60;
    }

}