export class GroupWrapper {
    id: null
    number: null
    instructor: {}
    sessions: any;
    students:  any;
    attendances:  any;
    currentSession: any;
    sessionStarted: boolean = false;
    sessionButtonCaption: string = "Start session";
    buttonColor: string = 'green'
}