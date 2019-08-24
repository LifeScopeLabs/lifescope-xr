export default class HudUtils {
    constructor() {
        this.hudOpacity = 0.95;
    }

    toggleHud(styleObject, dur=0.5) {
        if (CONFIG.DEBUG) {console.log("toggleHud");}
        var visible = styleObject.visibility == 'visible' ? true : false;
        var start, end;
        start = visible ? this.hudOpacity : 0;
        end = visible ? 0 : this.hudOpacity;
        AFRAME.ANIME({
            targets: styleObject,
            easing: 'linear',
            opacity: [start, end],
            duration: dur*1000,
            begin: function(anim) {
                if (!visible) {
                    styleObject.visibility ='visible';
                }
            },
            complete: function(anim) {
                if (visible) {
                    styleObject.visibility ='hidden';
                }
            }
        })
    }

    timeStringFromNumber(timeNum) {
        var hours = this.getTimeHours(timeNum);
        var minutes = this.getTimeMinutes(timeNum);
        var minutesStr = minutes.toString().padStart(2, '0');
        var timeStr = `${hours}:${minutesStr}`;
        return timeStr;
    }
    getTimeHours(time) {
        return Math.floor(time);
    }
    getTimeMinutes(time) {
        return 60 * (time - Math.floor(time));
    }
    minutesToHourDecimal(minutes) {
        return minutes/60;
    }
}