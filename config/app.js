/** @typedef {(import ('../common/services/firebase').FirebaseConfig)} FirebaseConfig */
/** @typedef {(import ('../common/declarations/process').AppFeaturesConfig)} AppFeaturesConfig */
/** @typedef {(import ('../common/declarations/process').FirebasePlatformConfig)} FirebasePlatformConfig */
/** @typedef {(import ('../common/declarations/process').GoogleConfig)} GoogleConfig */
/** @typedef {(import ('../common/declarations/process').IntegrationConfigs)} IntegrationConfigs */

/** @typedef {import('./declarations').Environments} Environments */
/** @typedef {import('./declarations').IncludeConfig} IncludeConfig */
/** @typedef {import('./declarations').BuildConfig} BuildConfig */

/** @type {Record<Environments, FirebaseConfig>} */
const FirebaseConfigs = {
    production: {
        apiKey: "AIzaSyD2Rc2XvXdhHRymGhNZEeBThi08gVqeB3A",
        authDomain: "bipolarbridges.firebaseapp.com",
        databaseURL: "https://bipolarbridges.firebaseio.com",
        projectId: "bipolarbridges",
        storageBucket: "bipolarbridges.appspot.com",
        messagingSenderId: "548887643205",
        appId: "1:548887643205:web:aa3a0db61601e6aa4d0f2c",
        measurementId: "G-6ZL6BPS92R"
    },
    get staging() { return FirebaseConfigs.production },
    get development() { return FirebaseConfigs.staging; },
};

/** @type {Record<Environments, FirebasePlatformConfig>} */
const FirebasePlatformOverrides = {
    production: {
        ios: {
            appId: '1:548887643205:ios:c796e690f13185934d0f2c',
            apiKey: 'AIzaSyA1wFAJxVr1ZXQg3benTmDDuKibt4rfA54',
        },
        android: {
            appId: '1:548887643205:android:e4dfc71c41cabeed4d0f2c',
            apiKey: 'AIzaSyAfeoXkcrfi-T672QN3amioRxOeX9XQEaA',
        },
    },
    get staging() { return FirebasePlatformOverrides.production; },
    get development() { return FirebasePlatformOverrides.staging; },
};

/** @type {Record<Environments, GoogleConfig>} */
const GoogleConfigs = {
    production: {
        ClientIdNative: '',
        ExpoClientIdAndroid: '548887643205-ta2fe61uevnp00grh1qma57r4e8sooi7.apps.googleusercontent.com', // android app id
        ExpoClientIdIOS: '548887643205-426s6fr7gntjehjti3tnu3qtsffrbc67.apps.googleusercontent.com' // ios app id,
    },
    get staging() { return GoogleConfigs.production; },
    get development() { return GoogleConfigs.staging; },
};

/** @type {Record<Environments, IntegrationConfigs>} */
const Integrations = {
    production: {
        SentryDsn: '...' // sentry url,
    },
    get staging() { return Integrations.production; },
    get development() { return Integrations.staging; },
};

/** @type {Record<Environments, AppFeaturesConfig>} */
const FeaturesConfig = {
    /** @type {AppFeaturesConfig} */
    get production() {
        return {
            BILLING_DISABLED: true,
            SESSIONS_DISABLED: true,
            ASSESSMENTS_ENABLED: true,
            EDITABLE_PROMPTS_ENABLED: true,
            MOBILE_ONBOARDING_ENABLED: false,
            CLIENT_CARETAKERS_ENABLED: false,
            MOBILE_STANDALONE: false,
            MOBILE_SHOW_CONSENT: false,
            MOBILE_STATIC_TIPS_ENABLED: false,
            INTERVENTIONS_ENABLED: false,
            COACH_TIME_TRACKING_ENABLED: false,
            NOTES_ON_INDIVIDUALS: false,
            GOALS_ENABLED: false,
            CLIENT_REWARDS_ENABLED: false,
            PICTURE_CHECKINS_ENABLED: false,
        };
    },
    get staging() { return FeaturesConfig.production; },
    get development() { return FeaturesConfig.staging; },
};

const includeConfigs = [
    {
        id: 'firebase',
        obj: FirebaseConfigs,
    },
    {
        id: 'firebaseForPlatform',
        obj: FirebasePlatformOverrides,
    },
    {
        id: 'google',
        obj: GoogleConfigs,
    },
    {
        id: 'appIntegrations',
        obj: Integrations,
    },
    {
        id: 'appFeatures',
        obj: FeaturesConfig,
        recursiveFlat: true,
    },
];

/** @type {Record<Environments, BuildConfig>} */
const BuildConfigs = {
    production: {
        hostname: {
            dashboard: 'https://bipolarbridges.web.app', // url for dashboard
            web: 'https://bipolarbridges.web.app', // url for website
        },
        mobile: {
            releaseChannel: '...', // expo release channel
            configName: '...', // bundle id
        },
    },
    get development() { return BuildConfigs.production; },
    get staging() { return BuildConfigs.production; },
};

module.exports = {
    includeConfigs,
    BuildConfigs,
};
