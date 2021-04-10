import { ViewState } from '../base';
import React from 'react';
import { observer } from 'mobx-react';
import AppViewModel from 'src/viewModels';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MasloPage, Container, Button, Card, Checkbox} from 'src/components';
import { ScenarioTriggers } from '../../abstractions';
import Images from 'src/constants/images';
import Colors from 'src/constants/colors';
import { months } from 'common/utils/dateHelpers';
import TextStyles, { mainFontMedium } from 'src/styles/TextStyles';

import { styles } from 'react-native-markdown-renderer';

const minContentHeight = 300;
const { width } = Dimensions.get('window');
const date = new Date();
const today = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

@observer
export class ChooseStrategiesView extends ViewState {
    constructor(props) {
        super(props);
        this._contentHeight = this.persona.setupContainerHeightForceScroll({ rotation: -15, transition: { duration: 1 }, scale: 1.2 });
    }

    state = {
        active: 0,
        xTabOne: 0,
        xTabTwo: 0,
        xTabThree:0,
        translateX: new Animated.Value(0),
        translateXTabThree: new Animated.Value(width*2),
        translateXTabTwo: new Animated.Value(width),
        translateXTabOne: new Animated.Value(0),
        translateY: 0,
    }

    public get viewModel() {
        return AppViewModel.Instance.ChooseDomain;
    }

    handleSlide = type => {
        let { xTabOne, xTabTwo, active, translateX, translateXTabTwo, translateXTabOne, translateXTabThree } = this.state
        Animated.spring(translateX, {
            toValue: type,
            useNativeDriver: true,
        }).start()

        if (active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    useNativeDriver: true,
                })
            ]).start()
            Animated.spring(translateXTabTwo, {
                toValue: width,
                useNativeDriver: true,
            }).start()
            Animated.spring(translateXTabThree, {
                toValue: width*2,
                useNativeDriver: true,
            }).start()
        } else if ( active === 1){
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    useNativeDriver: true,
                })
            ]).start()
            Animated.spring(translateXTabTwo, {
                toValue: 0,
                useNativeDriver: true,
            }).start()
            Animated.spring(translateXTabThree, {
                toValue: width,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -(width*2),
                    useNativeDriver: true,
                })
            ]).start()
            Animated.spring(translateXTabTwo, {
                toValue: -width,
                useNativeDriver: true,
            }).start()
            Animated.spring(translateXTabThree, {
                toValue: 0,
                useNativeDriver: true,
            }).start()

        }

    }

    async start() { }

    private cancel = () => {
        this.trigger(ScenarioTriggers.Cancel);
    }

    onClose = (): void | Promise<void> => this.runLongOperation(async () => {
        this.showModal({
            title: `Do you really want to stop? Your progress will not be saved.`,
            primaryButton: {
                text: 'yes, stop',
                action: this.cancel,
            },
            secondaryButton: {
                text: 'no, go back',
                action: this.hideModal,
            }
        });
    })

    onDetails = () => {
        this.trigger(ScenarioTriggers.Submit);
    }

    onSelectDomain = n => {
        this.viewModel.selectDomain(n);
        this.trigger(ScenarioTriggers.Tertiary);
    }

    onselectThird = () => {
        this.trigger(ScenarioTriggers.Next);
    }




    renderContent() {
        let { xTabOne, xTabTwo, active, translateXTabTwo, translateXTabOne, translateY, translateXTabThree} = this.state
        const domainsChosen = this.viewModel.SelectedDomain;
        const strategies = this.viewModel.getStrategies;
        return (
            <MasloPage style={this.baseStyles.page} onClose={() => this.cancel()} onBack={() => this.cancel()}>
                <Container style={[{ height: this._contentHeight, paddingTop: 20, paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                <View style={{marginBottom: 30, justifyContent:'center', alignItems: 'center'}}>
                        <Text style={[TextStyles.h1]}>Choose up to 4 focus</Text>
                        <Text style={[TextStyles.h1]}>strategies below</Text>
                    </View>
                  
                    <View style={{borderRadius: 10, height: 350, justifyContent: 'center', alignItems: 'center', marginTop: 10, flex:1}}>
                        <View style={{
                            flexDirection: 'row',
                            margin: 10,
                            height: 36,
                            position: 'relative',
                            borderRadius: 4,
                            borderColor: 'green'
                        }}>
                            <TouchableOpacity
                                style={[styles.tabs, {
                                    borderRightWidth: 0,
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0
                                }]}
                                onLayout={event => this.setState({ xTabOne: event.nativeEvent.layout.x })}
                                onPress={() => this.setState({ active: 0 }, () => this.handleSlide(xTabOne))}
                            >
                                <Text style={{ fontWeight: active === 0 ? 'bold' : 'normal', textDecorationLine: active === 0 ? 'underline' : 'none' }}>SHOW ALL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabs, {
                                    borderRightWidth: 0,
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0
                                }]}
                                onLayout={event => this.setState({ xTabOne: event.nativeEvent.layout.x })}
                                onPress={() => this.setState({ active: 1 }, () => this.handleSlide(xTabOne))}
                            >
                                <Text style={{ fontWeight: active === 1 ? 'bold' : 'normal', textDecorationLine: active === 1 ? 'underline' : 'none' }}>{domainsChosen[0]}1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabs, {
                                    borderLeftWidth: 0,
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0
                                }]}
                                onLayout={event => this.setState({ xTabTwo: event.nativeEvent.layout.x })}
                                onPress={() => this.setState({ active: 2 }, () => this.handleSlide(xTabTwo))}
                            >
                                <Text style={{ fontWeight: active === 2 ? 'bold' : 'normal', textDecorationLine: active === 2 ? 'underline' : 'none' }}>{domainsChosen[1]}</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <Animated.View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 10,
                                transform: [{
                                    translateX: translateXTabOne
                                }]

                            }}
                                onLayout={event => this.setState({ translateY: event.nativeEvent.layout.height })}


                            >
                               {strategies.map(n => (
                               <Card
                               title="Morning"
                               description="From 7 AM to 10 AM"
                               onPress={() => null}
                                >
                                    <Checkbox
                                        checked={true}
                                        onChange={() => null}
                                    />
                               </Card>
                                ))}
                            </Animated.View>
                            <Animated.View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                transform: [{
                                    translateX: translateXTabTwo
                                },
                                {
                                    translateY: -translateY
                                }]
                            }}>
                                <Images.noStatistics width={200} height={100} />
                        <Text style={[this.textStyles.h1, styles.placeholderHeading]}>No statistics yet{translateY}</Text>
                                <Text style={[this.textStyles.p1, styles.placeholderSubtitle]}>{`Complete at-least one week of check-ins to use your timeline.`}</Text>
                            </Animated.View>
                            <Animated.View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                transform: [{
                                    translateX: translateXTabThree
                                },
                                {
                                    translateY: -274
                                }
                            ]
                            }}>
                                <Images.noStatistics width={200} height={100} />
                                <Text style={[this.textStyles.h1, styles.placeholderHeading]}>bluh{translateY} </Text>
                                {/* <Text style={[this.textStyles.p1, styles.placeholderSubtitle]}>{`Complete at-least one week of check-ins to use your timeline.`}</Text> */}
                            </Animated.View>
                        </ScrollView>
                      
                    </View>
                   
                   
                </Container>
            </MasloPage>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        width: '100%',
    },
    buttonContainer: {
        alignItems: 'center',
        width: '100%',
        height: 350,
        // justifyContent: 'space-between',
        paddingBottom: 50,
        // borderWidth: 1,
    },
    buttons: {
        height: 60,
        width: '90%',
    },
    topView: {
        // flex: 1,
        borderWidth: 1,
        borderColor: 'red',
        width: '100%',
        height: '100%'

    },
    pView: {

    },
    tabs: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#007aff',
        borderRadius: 4,
    },
    placeholderHeading: {
        marginTop: 16,
        marginBottom: 12,
    },
    placeholderSubtitle: {
        textAlign: 'center',
        maxWidth: '90%',
        marginVertical: 0,
        marginHorizontal: 'auto',
        color: Colors.secondarySubtitle,
    },
    buttonDetails: {
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 20,
        borderWidth: 1,
        backgroundColor: '#E0E0E0',
        height: 40,
        width: '45%',
    },
    mailButtonTitle: {
        color: 'black',
        fontSize: 10,
        padding: 10,
    },
    date: {
        textTransform: 'uppercase',
    },
    domain: {
        fontWeight: '500',
        letterSpacing: 1.79,
        fontFamily: mainFontMedium,
        // fontSize: 25
    },
    selectDomain: {
        borderWidth: 1,
        borderRadius: 5,
        color: 'black',
        fontSize: 10,
        padding: 10,
    }
});
