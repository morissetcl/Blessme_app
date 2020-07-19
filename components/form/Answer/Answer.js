import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Divider} from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import PublishButton from '../../shared/buttons/PublishButton';
import { styles } from './Styles';
import i18n from 'i18n-js';
import { createAnswer } from '../../../api/Answer'
const AnswerForm = props => {
  const { prayerBody, prayerId, userId, prayerRequestId, navigation } = props.navigation.state.params;
  const [body, setBody] = useState('');

  function publishAnswer() {
    createAnswer({ prayerRequestId: prayerRequestId,
      prayerId: prayerId,
      body: body,
      userId: userId,
      navigation: navigation
    });
  }

  return <View style={styles.container} >
            <Text style={styles.prayerTitle} >{ prayerBody }</Text>
            <View style={styles.positionPublishButton} >
              <PublishButton onPress={ () => publishAnswer() } />
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
