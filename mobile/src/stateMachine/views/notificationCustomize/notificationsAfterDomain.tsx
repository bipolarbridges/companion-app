import { ViewState } from '../base';
import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { MasloPage, Container, Checkbox, Card, Button } from 'src/components';
import { Appearance } from 'react-native-appearance';
import Colors from 'src/constants/colors';

import { ScenarioTriggers, PersonaStates } from '../../abstractions';
import { PushToast } from '../../toaster';
import Layout from 'src/constants/Layout';
import { PersonaViewPresets } from 'src/stateMachine/persona';
import { PersonaScrollMask } from 'src/components/PersonaScollMask';
import Images from 'src/constants/images';
import { NotificationCustomizeViewModel } from 'src/viewModels/NotificationsCustomizeViewModel';
import { color } from 'd3';

const colorScheme = Appearance.getColorScheme();

@observer
export class NotificationsAfterDomainView extends ViewState {
    constructor(props) {
        super(props);
        this._contentHeight = this.persona.setupContainerHeightForceScroll();
    }

    private readonly model = new NotificationCustomizeViewModel();

    protected get unbreakable() { return false; }

    async start() {
        this.resetPersona(PersonaStates.Question, PersonaViewPresets.TopHalfOut);
        this.model.settingsSynced.on(this.onScheduleSynced);
    }
    
    onClickEnabled = true;

    componentWillUnmount() {
        this.model.settingsSynced.off(this.onScheduleSynced);
    }

    onScheduleSynced = () => {
        PushToast({ text: 'Changes saved' });
    }

    onContinue = () => {
        this.onClickEnabled = false
    }
    onSave = () => {
        this.trigger(ScenarioTriggers.Primary)
    }
    renderContent() {
        const notificationsEnabled = this.model.isEnabled && !this.model.isToggleInProgress;
        const titleText = 'You can customize what notifications you receive below:';
        const description1 = 'You may choose to receive or turn off notifications for certain focus domains'
        const description2 = 'Polarus understands that you may not want to receive notifications about your bipolar diagnosis for privacy reasons'

        return (
            <MasloPage style={this.baseStyles.page}>
                <Container style={styles.topBarWrapWrap}>
                    <PersonaScrollMask />
                    <View style={styles.topBarWrap}>
                        <Button style={styles.backBtn} underlayColor="transparent" onPress={() => this.trigger(ScenarioTriggers.Back)}>
                            <Images.backIcon width={28} height={14} />
                        </Button>
                    </View>
                </Container>
                <ScrollView style={[{ zIndex: 0, elevation: 0 }]}>
                    <Container style={[this.baseStyles.container, styles.container]}>
                        <Text style={[this.textStyles.h1, styles.title]}>{titleText}</Text>
                        {!this.onClickEnabled && (
                            <>
                        <Card
                            title="Physical Domain"
                            description={notificationsEnabled ? 'On' : 'Off'}
                            style={{ marginBottom: 20 }}
                            Image={Images.bellIcon}
                        >
                            <Switch
                                value={this.model.isEnabled}
                                disabled={this.model.isToggleInProgress}
                                style={styles.switchStyles}
                            />
                        </Card>
                        <Card
                            title="Leisure Domain"
                            description={notificationsEnabled ? 'On' : 'Off'}
                            style={{ marginBottom: 20 }}
                            Image={Images.bellIcon}
                        >
                            <Switch
                                value={this.model.isEnabled}
                                disabled={this.model.isToggleInProgress}
                                style={styles.switchStyles}
                            />
                        </Card>
                        <Card
                            title="Sleep Domain"
                            description={notificationsEnabled ? 'On' : 'Off'}
                            style={{ marginBottom: 20 }}
                            Image={Images.bellIcon}
                        >
                            <Switch
                                value={this.model.isEnabled}
                                disabled={this.model.isToggleInProgress}
                                style={styles.switchStyles}
                            />
                        </Card>
                        <Text style={[this.textStyles.p1, styles.description]}>{description1}</Text>
                        <View style={styles.buttonView}>
                        <Button
                            title="CONTINUE"
                            style={[styles.insturctionsButton, this.textStyles.h2]}
                            titleStyles={styles.insturctionsButtonTitle}
                            onPress={this.onContinue}
                            isTransparent
                            />
                        </View>
                        </>
                        )}
                        {this.onClickEnabled && (
                            <>
                        <Card
                            title="Include notifications that mention bipolar diagnosis"
                            description={notificationsEnabled ? 'On' : 'Off'}
                            style={{ marginBottom: 20, height: 80}}
                            Image={Images.bellIcon}
                        >
                            <Switch
                                value={this.model.isEnabled}
                                disabled={this.model.isToggleInProgress}
                                style={styles.switchStyles}
                            />
                        </Card>
                        <Text style={[this.textStyles.p1, styles.description]}>{description2}</Text>
                        <View style={styles.buttonView}>
                        <Button
                            title="SAVE"
                            style={[styles.insturctionsButton, this.textStyles.h2]}
                            titleStyles={styles.insturctionsButtonTitle}
                            onPress={this.onSave}
                            isTransparent
                            />
                        </View>
                        </>
                        )}
                    </Container>
                </ScrollView>
            </MasloPage>
        );
    }
}

const styles = StyleSheet.create({
    topBarWrapWrap: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 2,
        elevation: 2,
    },
    topBarWrap: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 72,
        zIndex: 2,
        elevation: 2,
    },
    backBtn: {
        width: 52,
        height: 52,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    container: {
        minHeight: Layout.window.height,
        paddingTop: Layout.getViewHeight(21),
    },
    title: {
        marginBottom: 40,
        textAlign: 'center',
    },
    exactCard: {
        borderLeftWidth: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        marginBottom: 0,
        color: 'grey',
    },
    switchStyles: {
        paddingHorizontal: 3,
    },
    buttonView : {
        alignContent: 'center',
        alignItems: 'center',
        padding: 5
     },
    insturctionsButton: {
        width: 280,
        height: 50,
        borderColor: '#595959',
        borderWidth: 0.25,
        backgroundColor: '#595959',
        padding: 5
    },
    insturctionsButtonTitle: {
        color: 'white'
    },
    description: {
        textAlign: 'center',
        color: 'grey',
        marginBottom: 30,
        borderColor: 'transparent',
        borderWidth: 40
    }
});
