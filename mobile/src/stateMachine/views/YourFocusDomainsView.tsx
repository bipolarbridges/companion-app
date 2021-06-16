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
import { AlertExitWithoutSave } from 'src/constants/alerts';
import { months } from 'common/utils/dateHelpers';

const date = new Date();
const today = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

@observer
export class YourFocusDomainsView extends ViewState {

  private domains: string[] = [];

    constructor(props) {
        super(props);
        this._contentHeight = this.persona.setupContainerHeightForceScrollDown({ transition: { duration: 0} });

        this.domains = this.viewModel.selectedDomains || [];
        this.onLearnMorePress = this.onLearnMorePress.bind(this);
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
                    <View style={{alignItems: 'center', flexDirection: 'column', marginBottom: 20}}>
                      <Text style={[TextStyles.labelMedium, styles.date, {marginBottom: 30}]}>{today}</Text>
                      <Text style={[TextStyles.labelLarge, {marginBottom: 15}]}>{'Your Focus Domain'}{this.domains.length == 1 ? ':' : 's:'}</Text>
                      <Text style={[TextStyles.h2, styles.title]}>{this.getDomainsTitle()}</Text>
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


const styles = StyleSheet.create({ 
  title: {
    textAlign: 'center',
  },
  list: {
    marginTop: 30,
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
},

});
