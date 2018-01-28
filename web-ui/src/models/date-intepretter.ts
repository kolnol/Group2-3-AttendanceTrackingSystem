
export class DateInterpretter {

    static getDay(number) {
        switch(number) {
            case 0: {
                return "Sunday"
            }
            case 1: {
                return "Monday"
            }
            case 2: {
                return "Tuesday"
            }
            case 3: {
                return "Wednesday"
            }
            case 4: {
                return "Thursday"
            }
            case 5: {
                return "Friday"
            }
            case 6: {
                return "Saturday"
            }
        }
    }

    static getMonth(number) {
        switch(number) {
            case 0: {
                return "01"
            }
            case 1: {
                return "02"
            }
            case 2: {
                return "03"
            }
            case 3: {
                return "04"
            }
            case 4: {
                return "05"
            }
            case 5: {
                return "06"
            }
            case 6: {
                return "07"
            }
            case 7: {
                return "08"
            }
            case 8: {
                return "09"
            }
            case 9: {
                return "10"
            }
            case 10: {
                return "11"
            }
            case 11: {
                return "12"
            }
        }
    }

    static formatTime(date) {
        let hours: string;
        let minutes: string;
        if(Number(date.getHours()) < 10) {
          hours = "0" + date.getHours()
        } else {
          hours = date.getHours()
        }
        if(Number(date.getMinutes()) < 10) {
          minutes = "0" + date.getMinutes()
        } else {
          minutes = date.getMinutes()
        }
        return hours + ":" + minutes;
    }

    static formatDate(date){
        return date.getDate()+ '.' + DateInterpretter.getMonth(date.getMonth()) + '.' + date.getFullYear();
    }

}