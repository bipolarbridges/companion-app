import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import { EventSubscription } from 'fbemitter';
import { observable, transaction } from 'mobx';
import { Notification, LocalNotification } from 'expo/build/Notifications/Notifications.types';
import ExpoConstants from 'expo-constants';

import { createLogger } from 'common/logger';
import {
    NotificationData,
    NotificationTypes,
    NotificationResult,
    NotificationSchedulingOptions,
    ScheduleResult,
    AndroidChannels,
} from 'common/models/Notifications';
import {
    getNotificationTimeMS,
    addDaysToDate,
    Schedule,
    NotificationTime,
    timeToString,
    correctExactDate,
} from 'src/helpers/notifications';
import { getRandomUniqMessages, getMessagesForExactTime, isAffirmation } from 'src/constants/notificationMessages';
import { GlobalTrigger, GlobalTriggers } from 'src/stateMachine/globalTriggers';
import Localization from 'src/services/localization';
import { getAffirmationForDomains } from 'src/constants/affirmationMessages';
import { Affirmation } from 'src/constants/QoL';

const logger = createLogger('[Notifications]');

export interface IUserNameProvider {
    readonly firstName: string;
    readonly lastName: string;
}

const SCHEDULE_DAYS_COUNT = 7;

export class NotificationsService {

    @observable
    private _currentStatus: Permissions.PermissionStatus;

    @observable.ref
    private _openedNotification: NotificationData;

    private _notificationsSubscription: EventSubscription  = null;

    private _tokenCached: string = null;

    constructor(private readonly user: IUserNameProvider) {
        if (!user) {
            throw new Error('IUserController is required');
        }
        this._notificationsSubscription = Notifications.addListener(this._onNotificationReceived);

        // TEST
        // setTimeout(() => {

        //     const data: NotificationData = {
        //         type: NotificationTypes.CustomPrompt,
        //         originalText: 'bla-bla',
        //         promptId: '123',
        //         // phrasePrompt: 'You mentioned "life sucks". Can you tell me more about that?',
        //         // phrase: 'life sucks',
        //         // promptId: '2e3bdb9a-89f3-49bb-ac33-06308e368969',
        //         // originalText: 'Is there anything that feels frustrating right now?',
        //     };

        //     this._onNotificationReceived({
        //         isMultiple: false,
        //         remote: true,
        //         origin: 'selected',
        //         data,
        //     });
        // }, 7000);
    }

    public get openedNotification() { return this._openedNotification; }

    public get hasPermission() {
        switch (this._currentStatus) {
            case Permissions.PermissionStatus.GRANTED: {
                return true;
            }

            case Permissions.PermissionStatus.DENIED: {
                return false;
            }

            default: {
                return null;
            }
        }
    }

    async checkPermissions() {
        const result = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        this._currentStatus = result.status;
        logger.log(`hasPermission = ${this.hasPermission}`);
    }

    async askPermission() {
        if (this.hasPermission === null) {
            const result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            this._currentStatus = result.status;
            logger.log('got new permission:', this.hasPermission);
        }
    }

    async getToken() {
        if (this.hasPermission && ExpoConstants.isDevice) {
            if (this._tokenCached) {
                return this._tokenCached;
            }

            try {
                const token = await Notifications.getExpoPushTokenAsync();
                if (!token) {
                    logger.error('Notifications.getExpoPushTokenAsync() returned `null` while `this._currentStatus` =', this._currentStatus);
                } else {
                    this._tokenCached = token;
                }
                return token;
            } catch (err) {
                logger.log('Failed to get notifications token');
                logger.error(err);
            }
        }

        return null;
    }

    private async scheduleMessage(msg: string, startDateMS: number, index: number) {
        const date = addDaysToDate(startDateMS, index);
        const schedulingOptions: NotificationSchedulingOptions = { time: date };
        const data = {
            type: NotificationTypes.Retention,
        };

        const notification: LocalNotification = {
            title: Localization.Current.MobileProject.projectName,
            data,
            body: msg,
            ios: { sound: true },
            android: Platform.OS === 'android' ? { channelId: AndroidChannels.Default } : null,
        };

        await Notifications.scheduleLocalNotificationAsync(notification, schedulingOptions);
        logger.log('scheduleNotifications with message:', notification.body, '| notification time is:', schedulingOptions.time);
        const dateStr = new Date(schedulingOptions.time).toUTCString();
        return { body: notification.body, date: dateStr };
    }

    private async scheduleAffirmationMessage(msg: Affirmation, affirmationTime: number) {
        const schedulingOptions: NotificationSchedulingOptions = { 
            time: (new Date(affirmationTime).getTime()),
            repeat: 'day',
        };
        const data = {
            type: NotificationTypes.Affirmation,
        };
        const body = msg.text;
        const notification: LocalNotification = {
            title: Localization.Current.MobileProject.projectName,
            data,
            body,
            ios: { sound: true },
            android: Platform.OS === 'android' ? { channelId: AndroidChannels.Default } : null,
        };

        await Notifications.scheduleLocalNotificationAsync(notification, schedulingOptions);
        logger.log('scheduleNotifications with message:', notification.body, '| notification time is:', schedulingOptions.time);
        const dateStr = new Date(schedulingOptions.time).toUTCString();
        return { body: notification.body, date: dateStr };
    }

    private async scheduleMessages(messages: string[] | Affirmation[], startDateMS: number, affirmationTime? : number) {
        const result: NotificationResult[] = [];
        for (let i = 0; i < messages.length; i++) {
            let msg: string | Affirmation = messages[i];
            if (affirmationTime && isAffirmation(msg)) {
                if (isAffirmation(msg)) result.push((await this.scheduleAffirmationMessage(msg, affirmationTime)));
            } else {
                msg = messages[i] as string;
                result.push((await this.scheduleMessage(msg, startDateMS, i)));
            }
        }
        return result;
    }

    private async scheduleNotifications(time: NotificationTime, startDateMS: number, domains?: string[], affirmationTime?: number) {
        const settings = { name: this.user.firstName };
        const result: NotificationResult[] = [];
        const messages = time === NotificationTime.ExactTime
            ? {
                [NotificationTypes.Retention]: getMessagesForExactTime(startDateMS, SCHEDULE_DAYS_COUNT, settings),
                [NotificationTypes.Affirmation]: getAffirmationForDomains(domains, 1, settings)
            }
            : {
                [NotificationTypes.Retention]: getRandomUniqMessages(time, SCHEDULE_DAYS_COUNT, settings)
            };
        
        
        result.push(...(await this.scheduleMessages(messages[NotificationTypes.Retention], startDateMS)));
        if (messages[NotificationTypes.Affirmation]) {
            result.push(...(await this.scheduleMessages(messages[NotificationTypes.Affirmation], startDateMS, affirmationTime)));
        }

        return result;
    }

    public async rescheduleNotifications(schedule: Schedule, domains?: string[], affirmationTime?: number) {
        await this.resetSchedule();
        
        if (Platform.OS === 'android') {
            await this.createAndroidChannel();
        }

        const scheduleData: ScheduleResult = { };
        const keys = Object.keys(schedule);

        for (let i = 0; i < keys.length; i++) {
            const time = keys[i] as NotificationTime;
            const active = time === NotificationTime.ExactTime
                ? schedule[time] && schedule[time].active
                : schedule[time];

            if (!active) {
                continue;
            }

            const startDateMS = time === NotificationTime.ExactTime
                ? correctExactDate(schedule[time] && schedule[time].value)
                : getNotificationTimeMS(time);

            if (!startDateMS) {
                continue;
            }

            const res = await this.scheduleNotifications(time, startDateMS, domains, affirmationTime);
            scheduleData[time] = res;
        }

        return scheduleData;
    }

    public resetSchedule = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();

        if (Platform.OS === 'android') {
            await this.deleteAndroidChannel();
        }
    }

    public resetOpenedNotification = () => {
        this._openedNotification = null;
    }

    async createAndroidChannel() {
        await Notifications.createChannelAndroidAsync(AndroidChannels.Default, {
            name:  Localization.Current.MobileProject.projectName,
            sound: true,
            vibrate: true,
        });
    }

    async deleteAndroidChannel() {
        await Notifications.deleteChannelAndroidAsync(AndroidChannels.Default);
    }

    private _onNotificationReceived = (n: Notification) => {
        logger.log('received notification:', n);

        if (NotificationData.guard(n.data)) {
            transaction(() => {
                this._openedNotification = null;
                this._openedNotification = { ...n.data };
            });

            GlobalTrigger(GlobalTriggers.NotificationReceived);
        }
    }

    dispose() {
        this._notificationsSubscription.remove();
        this._notificationsSubscription = null;
    }
}
