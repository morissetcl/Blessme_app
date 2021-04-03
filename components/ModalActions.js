import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { destroyPrayerResquest } from '../api/PrayerRequest';
import { destroyPrayers } from '../api/Prayer';

import { createInnapropriateContent } from '../api/InnapropriateContent';
import { updateCounter } from '../store/actions/actionCreators'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { displayMessage } from "./shared/message";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import { deletePrayerRequest } from '../store/actions/actionCreators'

import { connect } from 'react-redux'

class ModalActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      body: props.body,
      title: props.title,
      category: props.category,
      prayerRequestId: props.prayerId,
      commentId: props.commentId,
      prayerRequest: this.findPrayerRequest(),
      actionType: props.actionType,
      isAudioPrayer: props.isAudioPrayer,
      answer: props.answer
    };
  }

  findPrayerRequest() {
    if (this.props.navigation.state.params) {
      return this.props.navigation.state.params.prayerRequest
    };
    return this.props.prayerRequest;
  };

  _deletePrayerRequest = () => {
    this._menu.hide();
    const trad = i18n.t('deleteSuccess', { defaultValue: 'Supprimé' });
    destroyPrayerResquest({
      prayerRequestId: this.state.prayerRequestId,
      navigation: this.state.navigation
    }).then(() => {
        const {dispatch} = this.props
        dispatch(deletePrayerRequest(this.state.prayerRequestId));
        displayMessage(trad, 'success');
    });
  };

  _signalContent = () => {
    const trad = i18n.t('signalSuccess', { defaultValue: 'Signalée avec succès' });
    createInnapropriateContent({
      navigation: this.state.navigation,
      alertableId: this.alertableId(),
      object: this.alertableType()
    })
    displayMessage(trad, 'success');
  };

  alertableId() {
    switch(this.props.actionType) {
      case 'signalPrayer':
        return this.state.commentId;
      case 'signalPrayerRequest':
        return this.state.prayerRequestId;
      case 'signalAnswer':
        return this.state.answer ? this.state.answer.id : null;
      default:
        return ''
    }
  };

  alertableType() {
    switch(this.props.actionType) {
      case 'signalPrayer':
        return 'prayer';
      case 'signalPrayerRequest':
        return 'prayer_request';
      case 'signalAnswer':
        return 'answer';
      default:
        return ''
    }
  };

  _editPrayerRequest = () => {
    this._menu.hide();
    this.state.navigation.navigate('PrayerRequestForm', {
      currentUserToken: this.props.currentUser,
      body: this.state.body,
      title: this.state.title,
      category: this.state.category,
      username: this.state.username,
      editPrayer: true,
      prayerRequestId: this.state.prayerRequestId,
    });
  };

  _editPrayer = () => {
    this._menu.hide();
    this.state.navigation.navigate('WritingComment', {
      prayerRequest: this.state.prayerRequest,
      currentUserToken: this.props.currentUser,
      prayerId: this.state.prayerId,
      body: this.state.body,
      commentId: this.state.commentId
    });
  };

  _addAnswer = () => {
    this._menu.hide();
    this.state.navigation.navigate('AnswerForm', {
      prayerId: this.state.commentId,
      userId: this.props.currentUser,
      prayerBody: this.state.body,
      navigation: this.state.navigation
    });
  };

  _editAnswer = () => {
    this._menu.hide();
    this.state.navigation.navigate('AnswerForm', {
      actionType: 'edit',
      answer: this.state.answer,
      navigation: this.state.navigation
    });
  };

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  _deletePrayer = () => {
    const typeOfPrayer = this.state.isAudioPrayer ? 'audio' : 'writing'
    destroyPrayers({
      prayerId: this.state.prayerRequestId,
      commentId: this.state.commentId,
      navigation: this.state.navigation
    }).then(() => {
      this.props.dispatch(updateCounter(this.state.prayerRequestId, typeOfPrayer, false));
      displayMessage('Prière supprimée avec succès', 'success');
    });
  };

  renderSwitchActions() {
    switch(this.state.actionType) {
      case 'editPrayer':
        return <View>
                 { !this.state.isAudioPrayer ?
                   <MenuItem onPress={() => this._editPrayer()}>Modifier</MenuItem>
                 :
                   null
                  }
                  <MenuItem onPress={() => this._addAnswer()}>Répondre</MenuItem>
                  <MenuItem onPress={() => this._deletePrayer()}>Supprimer</MenuItem>
              </View>
      case 'editPrayerRequest':
        return <View>
                 <MenuItem onPress={() => this._editPrayerRequest()}>Modifier</MenuItem>
                 <MenuItem onPress={() => this._deletePrayerRequest()}>Supprimer</MenuItem>
              </View>
      default:
        return <View>
                 { ((this.props.actionType !== 'signalAnswer') && !this.state.title) ?
                   <MenuItem onPress={() => this._addAnswer()}>Répondre</MenuItem>
                 :
                   null
                  }
                   { this.state.answer && (this.props.currentUser == this.state.answer.user?.token) ?
                    <MenuItem onPress={() => this._editAnswer()}>Modifier</MenuItem>
                   :
                     null
                   }
                 <MenuItem onPress={() => this._signalContent()}>Signaler</MenuItem>
              </View>
    };
  };

  render() {

    return (
      <TouchableOpacity
        onPress={this.showMenu}
        style={[this.state.answer ? styles.menuAnswer : styles.menu]}>


        <Menu
          ref={this.setMenuRef}
          button={<FontAwesomeIcon icon={ faEllipsisV } size={16} color={ '#bbbbbb' }/>}
        >
        { this.renderSwitchActions() }
        </Menu>
      </TouchableOpacity>
    );
  };
};


const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 8,
    right: 0,
  },
  menuAnswer: {
    position: 'absolute',
    top: 8,
    right: 10,
  }
});

const mapDispatchToProps = dispatch => ({
   dispatch
});

const mapStateToProps = (state) => {
  return {
    prayerRequest: state.prayerRequest,
    currentUser: state.userReducer.data
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalActions)
