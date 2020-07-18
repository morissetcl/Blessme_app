import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Answer from '../../Answer';
import { NavigationEvents } from 'react-navigation';
import { styles } from './Styles';
import i18n from 'i18n-js';

const Prayer = props => {
  const { index, response, currentUser, navigation, username, prayerId, prayerRequest, prayerRequestUsername } = props;


  const formattedDate = new Date(Date.parse(response.created_at) * 1000);
  const unformattedCreatedDateSince = Date.now() - Date.parse(response.created_at);
  const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
  const trad = `il y a ${createdAtSince} jours`
  const formattedCreatedAtSince = (createdAtSince !== 0) ? trad : "Aujourd'hui";

  return <View
         style={styles.commentCard}
         key={response.created_at}
         id={index}
         >
         <TouchableOpacity
            onLongPress={(value) => {
              this.signalContent(response.id);
            }}
          >
          <Text
          style={[(response.user.username === prayerRequestUsername) ? styles.usernameOp : styles.usernameNotOp]}
             onPress={(value) => {
               navigation.navigate('Profile', { username: username, userToken: response.user.token });
             }}
           >
             {response.user.username}
           </Text>
          {(response.user.token === currentUser.token) ?
             <View style={styles.actionsButton}>
               <ModalActions
                 prayerRequest={prayerRequest}
                 navigation={navigation}
                 body={response.body}
                 username={username}
                 prayerId={prayerId}
                 commentId={response.id}
                 actionType={'editPrayer'}
                 isAudioPrayer={response.audio}
                 newPrayer={false}
               />
             </View>
             :
             <Text style = {styles.createdAt}>{ formattedCreatedAtSince }</Text>
           }
           { response.audio ?
              <View style={styles.playerAudio}>
                <AudioPrayer audio={response.audio} duration={response.audio_duration} />
              </View>
              :
              <Text style={styles.prayerBody}>{response.body}</Text>
            }

           <View style={styles.answer}>
             { response.answers.map((answer, i) => {
               return <Answer
                         key={ Math.random() }
                         index={i}
                         answer={answer}
                         currentUser={currentUser}
                       />
               })
             }
           </View>
          </TouchableOpacity>
         </View>
};

export default Prayer;
