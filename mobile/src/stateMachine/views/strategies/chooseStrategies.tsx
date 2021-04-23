import { ViewState } from '../base';
import React from 'react';
import { observer } from 'mobx-react';
import AppViewModel from 'src/viewModels';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Dimensions, Image, SafeAreaView, FlatList } from 'react-native';
import { MasloPage, Container, Button, Card, Checkbox} from 'src/components';
import { ScenarioTriggers } from '../../abstractions';
import Images from 'src/constants/images';
import Colors from 'src/constants/colors';
import { months } from 'common/utils/dateHelpers';
import TextStyles, { mainFontMedium } from 'src/styles/TextStyles';

import { styles } from 'react-native-markdown-renderer';
import { random } from 'common/utils/mathx';

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
    }

    public get viewModel() {
        return AppViewModel.Instance.ChooseDomain;
    }

    handleSlide = type => {
        let {translateX} = this.state
        Animated.spring(translateX, {
            toValue: type,
            useNativeDriver: true,
        }).start()
    }

    async start() {
     }

    private cancel = () => {
        this.trigger(ScenarioTriggers.Cancel);
    }

    onClose = (): void | Promise<void> => this.runLongOperation(async () => {
        this.showModal({
            title: `Do you really want to stop? Your progress will be saved.`,
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

    onSelectDomain = n => {
        this.viewModel.selectDomain(n);
        this.trigger(ScenarioTriggers.Tertiary);
    }

    onselectThird = () => {
        this.trigger(ScenarioTriggers.Next);
    }

    renderContent() {
        let { xTabOne, xTabTwo, active} = this.state
        const domainsChosen = this.viewModel.selectedDomain;
        const strategies = this.viewModel.getStrategies;
        const l_strategies = strategies.filter(p => p.domains.includes(domainsChosen[0]));
        const r_strategies = strategies.filter(p => p.domains.includes(domainsChosen[1]));
        return (
            <MasloPage style={this.baseStyles.page} onClose={() => this.onClose()} onBack={() => this.cancel()}>
                <Container style={[{ height: this._contentHeight, paddingTop: 20, paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                <View style={{marginBottom: 30, justifyContent:'center', alignItems: 'center'}}>
                        <Text style={[TextStyles.h1]}>Choose up to 4 focus</Text>
                        <Text style={[TextStyles.h1]}>strategies below</Text>
                    </View>
                  
                    <View style={{borderRadius: 10, justifyContent: 'center', marginTop: 10, flex:1, width:'100%'}}>
                        <View style={{
                            flexDirection: 'row',
                            // margin: 10,
                            height: 36,
                            position: 'relative',
                            width: '100%'
                        }}>
                            <TouchableOpacity
                                style={styles.tabs}
                                onLayout={event => this.setState({ xTabOne: event.nativeEvent.layout.x })}
                                onPress={() => this.setState({ active: 0 }, () => this.handleSlide(xTabOne))}
                            >
                                <Text style={{ fontWeight: active === 0 ? 'bold' : 'normal', textDecorationLine: active === 0 ? 'underline' : 'none' }}>SHOW ALL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.tabs}
                                onLayout={event => this.setState({ xTabOne: event.nativeEvent.layout.x })}
                                onPress={() => this.setState({ active: 1 }, () => this.handleSlide(xTabOne))}
                            >
                                <Text style={{ fontWeight: active === 1 ? 'bold' : 'normal', textDecorationLine: active === 1 ? 'underline' : 'none' }}>{domainsChosen[0]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.tabs}
                                onLayout={event => this.setState({ xTabTwo: event.nativeEvent.layout.x })}
                                onPress={() => this.setState({ active: 2 }, () => this.handleSlide(xTabTwo))}
                            >
                                <Text style={{ fontWeight: active === 2 ? 'bold' : 'normal', textDecorationLine: active === 2 ? 'underline' : 'none' }}>{domainsChosen[1]}</Text>
                            </TouchableOpacity>
                        </View>
                        {active === 0 && <FlatList
                                    data={strategies}
                                    keyExtractor={item => item.strat}
                                    showsVerticalScrollIndicator={false}
                                    renderItem = {({item}) => {
                                        return   <View style={styles.card}>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text style={[{fontSize:18}]}>{item.strat}</Text>
                                                <Checkbox
                                                    onChange={() => null}
                                                    checked={false}
                                                />
                                            </View>
                                        <View style={{width: '70%', alignItems:'center', justifyContent:'center'}}>
                                            <Text style={TextStyles.p3}>{item.info}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingLeft:10}}>
                                            <Images.bellIcon/>
                                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:5}}>
                                                <Text>Learn More </Text>
                                                <Images.arrowRight/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    }} />}
                        {active === 1 && <FlatList
                                    data={l_strategies}
                                    keyExtractor={item => item.strat}
                                    showsVerticalScrollIndicator={false}
                                    renderItem = {({item}) => {
                                        return   <View style={styles.card}>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text style={[{fontSize:18}]}>{item.strat}</Text>
                                                <Checkbox
                                                    onChange={() => null}
                                                    checked={false}
                                                />
                                            </View>
                                        <View style={{width: '70%', alignItems:'center', justifyContent:'center'}}>
                                            <Text style={TextStyles.p3}>{item.info}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingLeft:10}}>
                                            <Images.bellIcon/>
                                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:5}}>
                                                <Text>Learn More </Text>
                                                <Images.arrowRight/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    }} />}
                        {active === 2 && <FlatList
                                    data={r_strategies}
                                    keyExtractor={item => item.strat}
                                    renderItem = {({item}) => {
                                        return   <View style={styles.card}>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                <Text style={[{fontSize:18}]}>{item.strat}</Text>
                                                <Checkbox
                                                    onChange={() => null}
                                                    checked={false}
                                                />
                                            </View>
                                        <View style={{width: '70%', alignItems:'center', justifyContent:'center'}}>
                                            <Text style={TextStyles.p3}>{item.info}</Text>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingLeft:10}}>
                                            <Images.bellIcon/>
                                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:5}}>
                                                <Text>Learn More </Text>
                                                <Images.arrowRight/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    }} />}
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
    card: {
        width: 'auto',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 5,
        padding: 5,
        borderColor: 'grey'
    },
    tabs: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#007aff',
        borderRadius: 4,
    },
    domain: {
        fontWeight: '500',
        letterSpacing: 1.79,
        fontFamily: mainFontMedium,
        // fontSize: 25
    },
});
