import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Divider} from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import PublishButton from '../../shared/buttons/PublishButton';
import { styles } from './Styles';
import i18n from 'i18n-js';
import { createAnswer, updateAnswer } from '../../../api/Answer'

const AnswerForm = props => {
  const { prayerBody, prayerId, userId, navigation, actionType, answer } = props.navigation.state.params;
  const [body, setBody] = useState('');

  function publishAnswer() {
    createAnswer({ prayerId: prayerId,
                   body: body,
                   userId: userId,
                   navigation: navigation
                });
  }

  function editAnswer() {
    updateAnswer({ prayerId: answer.prayer_id,
                   answerId: answer.id,
                   body: body,
                   navigation: navigation
                });
  }

  return <View style={styles.container} >
            <Text style={styles.prayerTitle} >{ prayerBody }</Text>
            <View style={styles.positionPublishButton} >
            { actionType == 'edit' ?
              <PublishButton onPress={ () => editAnswer() } />
              :
              <PublishButton onPress={ () => publishAnswer() } />
            }
            </View>
            <Divider style={styles.divider} />
            <TextInput
              inputStyle={{ width: '100%', color: 'black' }}
              placeholder={ 'Écrivez votre réponse…' }
              underlineColorAndroid="transparent"
              multiline
              onChangeText={(body) => setBody({ body })}
              style={styles.commentInput}
            />
          </View>
};

export default AnswerForm;
