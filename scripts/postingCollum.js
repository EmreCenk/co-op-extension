

const Posting = class {
    constructor(
        appStatus, Id, jobTitle, organization, division, openings,
        internalStatus, city, level, applications, deadline
    ){
        this.appStatus = appStatus;
        this.Id = Id;
        this.jobTitle = jobTitle;
        this.organization = organization;
        this.division = division;
        this.openings = openings;
        this.internalStatus = internalStatus;
        this.city = city;
        this.level = level;
        this.applications = applications;
        this.deadline = deadline;
    }
    
    getHiringPercentage(){ // probability of you being randomly hired
        return ( (this.openings + 1) / this.applications );
    }

}