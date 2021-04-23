import { ViewState } from '../base';
import React from 'react';
import { observer } from 'mobx-react';
import AppViewModel from 'src/viewModels';
import { StyleSheet, Animated, FlatList, Dimensions, StatusBar, TouchableOpacity, View, Text } from 'react-native';
import { MasloPage, Container, Button, Card, Checkbox} from 'src/components';
import { ScenarioTriggers } from '../../abstractions';
import Images from 'src/constants/images';
import Colors from 'src/constants/colors';
import { months } from 'common/utils/dateHelpers';
import TextStyles, { mainFontMedium } from 'src/styles/TextStyles';

import { styles } from 'react-native-markdown-renderer';
import { random } from 'common/utils/mathx';
import { Status } from 'sentry-expo';

const {width, height} = Dimensions.get('screen');

@observer
export class ChooseStrategiesView extends ViewState {
    constructor(props) {
        super(props);
        this._contentHeight = this.persona.setupContainerHeightForceScroll({ rotation: -15, transition: { duration: 1 }, scale: 1.2 });
    }

    async start() {
        // no-op
    };

    public get viewModel() {
        return AppViewModel.Instance.ChooseDomain;
    }


    renderContent() {
        const trial = [];
        const strategies = this.viewModel.getStrategies;
        const [l_domain,r_domain] = this.viewModel.selectedDomain;
        const data = strategies.map((n, key) => ({
            key: key,
            title: n.strat,
            info: n.info,
            domains: n.domains
        }))
        const data_l = strategies.filter(p => p.domains.includes("p"));
        const data_r = strategies.filter(p => p.domains.includes("p"));
        const show = (
            <FlatList
            data={strategies}
            keyExtractor={item => item.info}
            renderItem = {({item}) => {
                return  <View style={styles.card}>
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
            }}
           />
        )
        const domain_2 = (
            <FlatList
             data={data}
             keyExtractor={item => item.info}
             renderItem = {({item}) => {
                 return  <View style={{width}}>
                 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                         <Text style={[{fontSize:18}]}>{item.title}</Text>
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
             }}
            />
        )
        trial.push(show);
        trial.push(domain_1);
        // trial.push(domain_2);
       
        return (
            <MasloPage style={this.baseStyles.page} onClose={() => null} onBack={() => null} >
                <Container style={[{height: this._contentHeight}, styles.container]}>
                    <Animated.FlatList
                        data ={trial}
                        keyExtractor={item=> item.key}
                        horizontal
                        pagingEnabled
                        bounces={false}
                        renderItem = {({item}) => {
                            return item
                        }}

                    />
                </Container>     
            </MasloPage>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        paddingTop: 20, 
        paddingBottom: 10,
        justifyContent: 'center', 
        // alignItems: 'center',
        borderWidth: 1,
        width: 'auto'
    }, 
    card: {
        borderWidth: 1,
        marginBottom: 20,
        marginRight: 70,
        borderRadius: 5,
        padding: 5,
        borderColor: 'grey',
        width: width - 50,
        left:0
        // height: 'auto',
    },
    
});