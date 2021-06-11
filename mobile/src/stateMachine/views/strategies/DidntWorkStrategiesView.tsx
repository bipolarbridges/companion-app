import { ViewState } from '../base';
import React from 'react';
import { observer } from 'mobx-react';
import AppViewModel from 'src/viewModels';
import { StyleSheet, Text, View, ScrollView, TouchableHighlight, TouchableOpacity, Animated, Dimensions, Alert, SafeAreaView, FlatList } from 'react-native';
import { MasloPage, Container, Button, BackArrow, GradientChart, Card } from 'src/components';
import { ScenarioTriggers } from '../../abstractions';
import TextStyles, { mainFontMedium } from 'src/styles/TextStyles';
import Colors from '../../../constants/colors/Colors';
import { StrategyIded } from 'common/models/QoL';

// import { styles } from 'react-native-markdown-renderer';

import AppController from 'src/controllers';
import { observable } from 'mobx';

const minContentHeight = 300;
const { width } = Dimensions.get('window');

@observer
export class DidntWorkStrategiesView extends ViewState {

  private _strategyThatDidntWork: StrategyIded;

    constructor(props) {
        super(props);
        this._contentHeight = this.persona.setupContainerHeightForceScrollDown({ transition: { duration: 0} });
        this.hidePersona();
        this._strategyThatDidntWork = null; // this.viewModel.strategyThatDidntWork;
    }

    public get viewModel() {
        return AppViewModel.Instance.ChooseStrategy;
    }

    async start() {
      // this._strategyThatDidntWork = this.viewModel.strategyThatDidntWork;
      this.forceUpdate();
    }

    private cancel = () => {
        this.trigger(ScenarioTriggers.Cancel);
    }

    onLearnMorePress(id: string) {
      // MK-TODO: is this a place for learn more
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

    renderListItem = () => (
      <View style={styles.listItem}>
        <Text style={TextStyles.p1}>{this._strategyThatDidntWork.title}</Text>
        {/* Checkmark circle */}
        <Text style={[TextStyles.p2, {paddingLeft: 7, paddingTop: 7}]}>{this._strategyThatDidntWork.details}</Text>
        <View>
        <TouchableOpacity onPress={() => this.onLearnMorePress(this._strategyThatDidntWork.id)}>
          <Text style={{paddingRight: 7, textAlign: 'right'}}>{'LEARN MORE >'}</Text>
        </TouchableOpacity>
        </View>
      </View>

    );



    renderContent() {
        return (
            <MasloPage style={this.baseStyles.page} onClose={() => this.onClose()} onBack={() => this.cancel()}>
                <Container style={[{height: this._contentHeight, paddingTop: 10, paddingBottom: 10}]}>
                    {/* Title */}
                    <View style={{justifyContent: 'center', flexDirection: 'row', marginBottom: 20}}>
                        <Text style={[TextStyles.h2, styles.strategy]}>{'Why didn’t this strategy work out for you?'}</Text>
                    </View>
                    {this.renderListItem()}
                    <Button titleStyles={styles.sortButtonTitle} title='TELL US WHY' style={styles.sortButton}/>
                </Container>
            </MasloPage>
        );
    }
}

const styles = StyleSheet.create({ 
  sortButton: {
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#CBC8CD',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  sortButtonTitle: {
    color: Colors.survey.btnFontColor,
  },
  list: {
    marginBottom: 25,
  },
  listItem: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#CBC8CD',
    padding: 10,
    marginBottom: 30,
  },
  strategy: {
    textAlign: 'center',
  },
  selectButton: {
    // width: width * 0.8,
    marginBottom: 30,
  }

});