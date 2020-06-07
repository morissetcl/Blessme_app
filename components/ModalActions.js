import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { destroyPrayerResquest } from '../api/PrayerRequest';
import { createInnapropriateContent } from '../api/InnapropriateContent';

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
      signal: props.signal,
      currentUserToken: props.currentUserToken,
      navigation: props.navigation,
      body: props.body,
      title: props.title,
      category: props.category,
      prayerRequestId: props.prayerId,
    };
  }

  _deletePrayerRequest = () => {
    this._menu.hide();
    const trad = i18n.t('deleteSuccess', { defaultValue: 'Deleted' });
    destroyPrayerResquest({
      prayerRequestId: this.state.prayerRequestId,
      navigation: this.state.navigation }).then(() => {
        const {dispatch} = this.props
        dispatch(deletePrayerRequest(this.state.prayerRequestId));
        displayMessage(trad, 'success');
    });
  }

  _signalPrayerRequest = () => {
    const trad = i18n.t('signalSuccess', { defaultValue: 'Signalée avec succès' });
    createInnapropriateContent({
      navigation: this.state.navigation,
      alertableId: this.state.prayerRequestId,
      object: 'prayer_request'
    })
    displayMessage(trad, 'success');
  }

  _editPrayerRequest = () => {
    this._menu.hide();
    this.state.navigation.navigate('PrayerRequest', {
      currentUserToken: this.state.currentUserToken,
      body: this.state.body,
      title: this.state.title,
      category: this.state.category,
      username: this.state.username,
      editPrayer: true,
      prayerRequestId: this.state.prayerRequestId,
    });
  }

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

  render() {
    i18n.locale = Localization.locale;
    i18n.fallbacks = true;

    i18n.translations = {
      fr: {
        signalSuccess: 'Merci, nos équipes vont contrôler le contenu.',
        areYouSurePr: 'Que voulez vous faire avec cette demande ?',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        deleteSuccess: 'Votre demande a bien été supprimée.',
      },
      en: {
        signalSuccess: 'Thanks for the report. We are going to check.',
        areYouSurePr: 'What do you want to do ?',
        edit: 'Edit',
        delete: 'Remove',
        cancel: 'Cancel',
        deleteSuccess: 'Prayer request deleted with success.',
      },
    };
    return (
      <TouchableOpacity
        onPress={this.showMenu}
        style = {styles.menu} >

        <Menu
          ref={this.setMenuRef}
          button={<FontAwesomeIcon icon={ faEllipsisV } size={16} color={ '#bbbbbb' }/>}
        >
        { !this.props.signal ?
          <View>
            <MenuItem onPress={() => this._editPrayerRequest()}>Modifier</MenuItem>
            <MenuItem onPress={() => this._deletePrayerRequest()}>Supprimer</MenuItem>
          </View>
        :
          <View>
            <MenuItem onPress={() => this._signalPrayerRequest()}>Signaler</MenuItem>
          </View>
        }
        </Menu>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 8,
    right: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    prayerRequest: state.prayerRequest
  }
}

export default connect(mapStateToProps)(ModalActions)
