import AppController from 'src/controllers';
import CheckInViewModel from './CheckInViewModel';
import { computed } from 'mobx';
import NamesHelper from 'common/utils/nameHelper';
import { months } from 'common/utils/dateHelpers';
import { ITipItem, IStaticTipItem, ICheckInTipItem, IFinishQolTipItem, IMonthlyQolTipItem, IWeeklyQolTipItem, IAssessmentTipItem, IDocumentLinkTip } from './components/TipItemViewModel';
import AppViewModel from './index';
import InterventionTipsViewModel from 'src/viewModels/components/InterventionTipsViewModel';
import Localization from 'src/services/localization';
import { createLazy } from 'common/utils/lazy.light';
import { tryOpenLink } from 'src/constants/links';
import { Identify, DocumentLinkEntry, DocumentLinkShareStatuses } from 'common/models';
import { arraySplit } from 'common/utils/mathx';
import { UserProfileViewModel } from './UserProfileViewModel';
import { QolSurveyResults } from 'common/models/QoL';
import { PersonaDomains } from 'src/stateMachine/persona';
import { PersonaArmState } from 'dependencies/persona/lib';
import { ILocalSettingsController } from 'src/controllers/LocalSettings';
import { QolType } from 'common/models/QoL';
import logger from 'common/logger';

const EmptyArr: any[] = [];

export default class HomeViewModel {

    private static readonly _instance = createLazy(() => new HomeViewModel());
    public static get Instance() { return HomeViewModel._instance.value; }
    private readonly _settings: ILocalSettingsController = AppController.Instance.User.localSettings;

    public readonly interventionTips = process.appFeatures.INTERVENTIONS_ENABLED ? new InterventionTipsViewModel() : null;

    get loading() { return AppController.Instance.User.journal.loading; }

    @computed
    get today() {
        const date = new Date();

        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    get name() {
        return this.firstName;
    }

    @computed
    get coachProfile() {
        return new UserProfileViewModel(AppController.Instance.User.activeAccount?.coachId);
    }

    get coachName() {
        return AppController.Instance.User.activeAccount?.coachName || 'Your therapist';
    }

    @computed
    get firstName() { return NamesHelper.ensureFromUsers(AppController.Instance.User.user, AppController.Instance.Auth.authUser).firstName; }

    @computed
    get checkIns(): ReadonlyArray<CheckInViewModel> {
        return AppController.Instance.User.journal.entries
            .map(s => new CheckInViewModel().setCheckInId(s.id));
    }

    get showAssessment() { return process.appFeatures.ASSESSMENTS_ENABLED && !!AppController.Instance.User.assessments?.nextFormTypeAvailable; }

    get newDocumentLink() {
        return AppController.Instance.User.documents.popupDocument;
    }

    @computed
    private get generalTips(): ITipItem[] {
        const result: ITipItem[] = [];

        if (process.appFeatures.INTERVENTIONS_ENABLED && this.interventionTips?.tips?.length) {
            result.push(
                ...this.interventionTips.tips.map(tip => ({
                    id: tip.id,
                    type: 'interventionTip' as 'interventionTip',
                    title: tip.title,
                    status: tip.status,
                    actions: tip.actions,
                })),
            );
        }

        if (this.showAssessment) {
            result.push(<IAssessmentTipItem>{
                id: 'assessment',
                type: 'assessment',
                title: Localization.Current.MobileProject.assessmentTipText || 'New Assessment',
            });
        }

        if (result.length > 0) {
            return result;
        }

        if (process.appFeatures?.MOBILE_STATIC_TIPS_ENABLED) {
            return AppController.Instance.User.staticTips?.map(st => (<IStaticTipItem>{
                type: 'staticTip',
                id: st.id,
                title: st.title,
                url: st.url,
                staticTipType: st.type,
            })) || EmptyArr;
        }

        this.submitPendingWeeklyIfTimeForMonthly() // MK-TODO: Need clarification on logic of weekly and monthly qol collision
        const needsDailyCheckIn = !this.hasCompletedDailyCheckInToday();
        let res: ITipItem[] = [];

        if (needsDailyCheckIn) {
            res = [
                <ICheckInTipItem>{
                    id: 'check-in',
                    type: 'check-in',
                    title: AppViewModel.Instance.CreateCheckIn.question || 'Create a new check-in!',
                }];
        }

        if (AppViewModel.Instance.QOL.isUnfinished) {
            res.unshift(
                <IFinishQolTipItem>{
                    id: 'finish-qol',
                    type: 'finish-qol',
                    title: 'Tap to continue your QoL Survey!',
                });
            return res;
        }

        if (this.isTimeForMonthlyQol()) {
            res.unshift(
                <IMonthlyQolTipItem>{
                    id: 'monthly-qol',
                    type: 'monthly-qol',
                    title: "It's time for your monthly check-in!",
                });
        }

        if (this.isTimeForWeeklyQol()) {
            res.unshift(
                <IWeeklyQolTipItem>{
                    id: 'weekly-qol',
                    type: 'weekly-qol',
                    title: "It's time for your weekly check-in!",
                });
        }

        return res.length == 0 ?
            [<ICheckInTipItem>{
                id: 'check-in',
                type: 'check-in',
                title: AppViewModel.Instance.CreateCheckIn.question || 'Create a new check-in!',
            }] 
            : res;
    }

    @computed
    get tips(): ReadonlyArray<ITipItem> {
        return this.addDocLinkTips(this.generalTips);
    }

    private addDocLinkTips(tips: ITipItem[]) {
        const [newLinks, openedLinks] = arraySplit(
            AppController.Instance.User.documents.activeLinks,
            d => !d.share || d.share.status === DocumentLinkShareStatuses.Sent,
        );

        const docLinkToTip = (d: Identify<DocumentLinkEntry>) => (<IDocumentLinkTip>{
            type: 'docLinkTip',
            id: d.id,
            title: `${this.coachName} sent you ${d.name}`,
            url: d.link,
            open: () => this.openDocumentLink(d),
        });

        return [
            ...newLinks.map(docLinkToTip),
            ...tips,
            ...openedLinks.map(docLinkToTip),
        ];
    }

    private submitPendingWeeklyIfTimeForMonthly() {
        if (AppController.Instance.User.localSettings?.current?.qol?.pendingWeeklyQol && this.isTimeForMonthlyQol()) {
            this._settings.updatePendingQol({ pendingWeeklyQol: false }, QolType.Weekly);
        }
    }

    // returns true if it has been 28 calendar days since last Monthly QoL
    // return true if there is a pending Monthly QoL
    private isTimeForMonthlyQol(): boolean {
        const lastMonthlyQol: Date = new Date(AppController.Instance.User.localSettings?.current?.qol?.lastMonthlyQol);
        let nextMonthlyQol: Date = lastMonthlyQol;
        nextMonthlyQol.setDate(nextMonthlyQol.getDate() + 28);
        const today: Date = new Date();
        if (nextMonthlyQol.getDay() === today.getDay() && nextMonthlyQol.getMonth() === today.getMonth()
        && nextMonthlyQol.getFullYear() === today.getFullYear()) {
            this._settings.updateLastQol({ lastMonthlyQol: Date() }, QolType.Monthly);
            this._settings.updatePendingQol({ pendingMonthlyQol: true }, QolType.Monthly);
            return true;
        } else if (AppController.Instance.User.localSettings?.current?.qol?.pendingMonthlyQol) { return true; }
        return false;
    }

        // returns true if it has been 7 calendar days since last Weekly QoL
        // return true if there is a pending Weekly QoL
        private isTimeForWeeklyQol(): boolean {
            const lastWeeklyQol: Date = new Date(AppController.Instance.User.localSettings?.current?.qol?.lastWeeklyQol);
            console.log(`lastWeeklyQol: ${AppController.Instance.User.localSettings?.current?.qol?.lastWeeklyQol}`);
            let nextWeeklyQol: Date = lastWeeklyQol;
            nextWeeklyQol.setDate(nextWeeklyQol.getDate() + 7);
            const today: Date = new Date();
            if (nextWeeklyQol.getDay() === today.getDay() && nextWeeklyQol.getMonth() === today.getMonth()
            && nextWeeklyQol.getFullYear() === today.getFullYear()) {
                this._settings.updateLastQol({ lastWeeklyQol: Date() }, QolType.Weekly);
                this._settings.updatePendingQol({ pendingWeeklyQol: true }, QolType.Weekly);
                return true;
            } else if (AppController.Instance.User.localSettings?.current?.qol?.pendingWeeklyQol) { return true; }
            return false;
        }

    private hasCompletedDailyCheckInToday(): boolean {
        const lastDailyCheckIn: Date = new Date(AppController.Instance.User.localSettings?.current?.lastDailyCheckIn);
        const today: Date = new Date();

        return (lastDailyCheckIn.getDay() === today.getDay() && lastDailyCheckIn.getMonth() === today.getMonth() && lastDailyCheckIn.getFullYear() === today.getFullYear())
        }

    public getArmMagnitudes = async () => {
        const lastSurveyScores: QolSurveyResults = await AppController.Instance.User.backend.getSurveyResults();
        if (lastSurveyScores === null) {
            return PersonaArmState.createEmptyArmState();
        }
        let currMags: PersonaArmState = {};
        for (let domain of PersonaDomains) {
            let score: number = lastSurveyScores[domain];
            let mag: number = 0.4 + (score * 3 / 100);
            currMags[domain] = mag;
        }
        return currMags;
    }

    public markLinkDocumentAsSeen = (doc: Identify<DocumentLinkEntry>) => {
        const docid = this.newDocumentLink?.id;
        if (!docid) {
            return;
        }

        return AppController.Instance.User.documents.markAsSeen(docid);
    }

    public openDocumentLink = async (doc: Identify<DocumentLinkEntry>) => {
        const docid = doc?.id;
        const url = doc?.link;
        if (!docid || !url) {
            return;
        }

        const res = await tryOpenLink(url);
        if (res) {
            await AppController.Instance.User.documents.markAsOpened(docid);
        }
    }
}
