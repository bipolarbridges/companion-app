import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Container, MasloPage, StrategyCard } from 'src/components';
import AppController from 'src/controllers';
import TextStyles from 'src/styles/TextStyles';
import AppViewModel from 'src/viewModels';
import Colors from '../../constants/colors/Colors';
import { ScenarioTriggers } from '../abstractions';
import { ViewState } from './base';
import { months } from 'common/utils/dateHelpers';
import Layout from 'src/constants/Layout';

const date = new Date();
const today = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

const styles = StyleSheet.create({ 
  title: {
    textAlign: 'center',
  },
  list: {
    // marginTop: 30,
    marginBottom: 25,
  },
  listItem: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#CBC8CD',
    padding: 10,
    marginBottom: 30,
  },
  date: {
    textTransform: 'uppercase',
    marginBottom: 30,
},
labelLarge: {
  marginBottom: 15,
},

});

const minContentHeight = Layout.window.height;
let personaYPos = 0;
let domainsTitle = '';

@observer
export class YourFocusDomainsView extends ViewState {

  private domains: string[] = [];

    constructor(props) {
        super(props);
        this.domains = this.viewModel.selectedDomains || [];
        this.onLearnMorePress = this.onLearnMorePress.bind(this);

        this._contentHeight = this.persona.setupContainerHeight(minContentHeight) + 20;
        personaYPos = this._contentHeight * 0.5 - (TextStyles.labelMedium.lineHeight + styles.date.marginBottom + TextStyles.labelLarge.lineHeight + styles.labelLarge.marginBottom);
        domainsTitle = this.getDomainsTitle();
        personaYPos -= domainsTitle.length > 22 ? TextStyles.h2.lineHeight * 2 : TextStyles.h2.lineHeight;
        this.persona.view = { ...this.persona.view, position: { x: this.persona.view.position.x, y: personaYPos }, scale: 0.8 };
        console.log('--------------------------------------------')
        console.log('minContentHeight', minContentHeight)
        console.log('this._contentHeight', this._contentHeight)
        console.log('personaYPos', personaYPos)
        console.log('personaAnchor', this.persona.view.anchorPoint)
        console.log('personaPosition', this.persona.view.position)
        console.log('Layout.window.height ', Layout.window.height)
        console.log('--------------------------------------------')
    }

    public get viewModel() {
        return AppViewModel.Instance.ChooseStrategy;
    }

    async start() {}

    private getDomainsTitle(): string {
      switch (this.domains.length) {
        case 1:
          return this.capitalizeFirstLetter(this.domains[0])
        case 2:
          return this.capitalizeFirstLetter(this.domains[0])  + ' & ' + this.capitalizeFirstLetter(this.domains[1]);
        case 3:
          return this.capitalizeFirstLetter(this.domains[0])  + ', ' + this.capitalizeFirstLetter(this.domains[1])+ ' & ' + this.capitalizeFirstLetter(this.domains[2]);
        default:
          return 'INVALID number of domains'
      }
    }

    private capitalizeFirstLetter(str): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    onClose = () => {
      this.trigger(ScenarioTriggers.Cancel)
   }

    onLearnMorePress(id: string) {
      const found = this.viewModel.getStrategyById(id);
      if (found) {
        this.viewModel.learnMoreStrategy = found;
        this.trigger(ScenarioTriggers.Tertiary);
      } else {console.log(`Strategy with id: ${id} NOT found`)}
  }

    renderListItem = ({ item }) => (
      <StrategyCard item={item} onLearnMorePress={this.onLearnMorePress}/>
    );

    renderContent() {
        return (
            <MasloPage style={this.baseStyles.page} onClose={() => this.onClose()}>
                <Container style={[{height: this._contentHeight, paddingBottom: 10}]}>

                    {/* Title */}
                    <View style={{alignItems: 'center', flexDirection: 'column', marginBottom: personaYPos - 10}}>
                      <Text style={[TextStyles.labelMedium, styles.date]}>{today}</Text>
                      <Text style={[TextStyles.labelLarge, styles.labelLarge]}>{'Your Focus Domain'}{this.domains.length == 1 ? ':' : 's:'}</Text>
                      <Text style={[TextStyles.h2, styles.title]}>{domainsTitle}</Text>
                    </View>

                    {/* List of Strategies */}
                    <FlatList style={styles.list}    
                              data={this.viewModel.selectedStrategies}
                              renderItem={this.renderListItem}
                              keyExtractor={item => item.id}/>
                </Container>
            </MasloPage>
        );
    }
}
