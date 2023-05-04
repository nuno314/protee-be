export enum LocationStatusEnum {
    Personal = 'personal', // is only family location, is default value when user creates location
    WaitingPublish = 'waiting_publish', // want to publish to system, if wasn't approved move to Personal, if approved move to Publish
    Published = 'published', // public in system, default value when admin creates location
    Hidden = 'hidden', // hidden in system, do not use for Personal location
}
