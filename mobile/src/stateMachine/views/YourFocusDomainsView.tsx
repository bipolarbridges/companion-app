import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, LayoutChangeEvent, GestureResponderEvent, PixelRatio } from 'react-native';
import { Button, Container, MasloPage, StrategyCard } from 'src/components';
import TextStyles from 'src/styles/TextStyles';
import AppViewModel from 'src/viewModels';
import Colors from '../../constants/colors/Colors';
import { ScenarioTriggers } from '../abstractions';
import { ViewState } from './base';
import { months } from 'common/utils/dateHelpers';
import Layout from 'src/constants/Layout';
import { getPersonaRadius, PersonaScale } from '../persona';
import AppController from 'src/controllers';
import IconsOnCircle from './IconsOnCircle';
import { PersonaArmState } from 'dependencies/persona/lib';
import { hasNotch } from 'src/constants/devices';
import { DomainName } from 'src/constants/Domain';

const date = new Date();
const today = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

const pixelRatio = PixelRatio.get();
const containerMarginBottom = Layout.isSmallDevice ? 0 : 25;
const containerMarginTop = hasNotch ? 75 : 25;

type YourFocusDomainsViewState = {
  bottomWrapperTop: number,
}

@observer
export class YourFocusDomainsView extends ViewState<YourFocusDomainsViewState> {

  private domains: DomainName[] = [];
  private ordRadius = getPersonaRadius();

    constructor(props) {
        super(props);
        // for testing
        this.persona.qolArmMagnitudes = PersonaArmState.createEmptyArmState();
        //
        this.domains = this.viewModel.selectedDomains || [];
        this.onLearnMorePress = this.onLearnMorePress.bind(this);
        this.onLayoutIconCircle = this.onLayoutIconCircle.bind(this);
        this._contentHeight = this.layout.window.height - containerMarginTop;

        this.state = {
          bottomWrapperTop: 0,
        }
    }

    public get viewModel() {
        return AppViewModel.Instance.ChooseStrategy;
    }

    async start() {}

    private getIndicesFromSelectedDomains(): Array<number> {
      let result: Array<number> = [];
      this.domains.forEach((domain) => {
        switch (domain) {
          case DomainName.MOOD:    
            result.push(0);
            break;
          case DomainName.PHYSICAL:
            result.push(1);
            break;
          case DomainName.SLEEP:
            result.push(2);
            break;
          case DomainName.THINKING:
            result.push(3);
            break;
          case DomainName.IDENTITY:
            result.push(4);
            break;
          case DomainName.LEISURE:
            result.push(5);
            break;
          case DomainName.INDEPENDENCE:
            result.push(6);
            break;
          case DomainName.SELFESTEEM:
            result.push(7);
            break;
          case DomainName.HOME:
            result.push(8);
            break;
          case DomainName.MONEY:
            result.push(9);
            break;
          case DomainName.SPIRITUAL:
            result.push(10);
            break;
          case DomainName.RELATIONSHIPS:
            result.push(11);
            break;
        }
      })
      console.log(result)
      return result;
    }


    onClose = () => {
      this.trigger(ScenarioTriggers.Cancel)
   }

    onLearnMorePress(id: string) {
      const found = this.viewModel.getStrategyById(id);
      if (found) {
        this.viewModel.learnMoreStrategy = found;
        this.trigger(ScenarioTriggers.Tertiary);
      } else {
        console.log(`Strategy with id: ${id} NOT found`)
      }
  }

  onLifeAreasPress = () => {
    this.trigger(ScenarioTriggers.Next)
  }

  onLayoutIconCircle(event: LayoutChangeEvent) {
    const { layout } = event.nativeEvent;
    const scaledOrbRadius = this.ordRadius / PersonaScale;
    this.persona.setupContainerHeight(0, null, (containerMarginTop - containerMarginBottom) + layout.height/2);

    const bottomWrapperMarginTop = 20;
    this.setState({
      bottomWrapperTop: layout.height + bottomWrapperMarginTop,
    })
  }

    renderListItem = ({ item }) => (
      <StrategyCard item={item} onLearnMorePress={this.onLearnMorePress} hideCheckbox={true} isSmallCard={true}/>
    );

    renderContent() {
        return (
            <MasloPage style={this.baseStyles.page} onClose={() => this.onClose()}>
                <Container style={[{height: this._contentHeight, marginTop: containerMarginTop, marginBottom: containerMarginBottom}]}>
                    <IconsOnCircle circleRaius={this.ordRadius * 6} symbolSize={40} highlightedIndices={this.getIndicesFromSelectedDomains()} onLayout={this.onLayoutIconCircle}/>
                    <View pointerEvents={'box-none'} style={[styles.bottomWrapper, {top: this.state.bottomWrapperTop}]}>
                    <Button
                        title={'View All Life Areas'}
                        style={[styles.viewAllButton]}
                        onPress={this.onLifeAreasPress}
                    />
                    <Text style={[TextStyles.labelLarge, styles.focusStrategies]}>Your Focus Strategies:</Text>
                    <FlatList style={[styles.list]}
                              data={this.viewModel.selectedStrategies}
                              renderItem={this.renderListItem}
                              keyExtractor={item => item.id}/>
                              </View>
                </Container>
            </MasloPage>
        );
    }
}

const styles = StyleSheet.create({ 
bottomWrapper: {
  position: 'absolute',
  left: 20,
  right: 20,
  bottom: 0,
},
viewAllButton: {
  alignSelf: 'center',
  width: '90%',
  height: 50,
  margin: 5,
},
focusStrategies: {
  marginTop: 35,
  textAlign: 'center',
},
list: {
  marginTop: 25,
  width: '100%',
},
listItem: {
  borderWidth: 1,
  borderRadius: 7,
  borderColor: '#CBC8CD',
  padding: 10,
  marginBottom: 30,
},
});