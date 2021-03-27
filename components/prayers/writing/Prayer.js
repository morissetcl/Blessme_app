import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Answer from '../../Answer';
import ModalActions from '../../ModalActions';
import { NavigationEvents } from 'react-navigation';
import { styles } from './Styles';
import i18n from 'i18n-js';
import AudioPrayer from '../audio/Prayer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const Prayer = props => {
  const { index, response, currentUser, navigation, username, prayerId, prayerRequest, prayerRequestUsername } = props;

  const formattedDate = new Date(Date.parse(response.created_at) * 1000);
  const unformattedCreatedDateSince = Date.now() - Date.parse(response.created_at);
  const createdAtSince = Math.floor(unformattedCreatedDateSince/8.64e7);
  const trad = `il y a ${createdAtSince} jours`
  const formattedCreatedAtSince = (createdAtSince !== 0) ? trad : "Aujourd'hui";

  const [hideAnswer, setHideAnswer] = useState(true);

  return <View
         style={styles.commentCard}
         key={response.created_at}
         id={index}
         >
           <TouchableOpacity>
             <Text
               style={[(response.user?.username === prayerRequestUsername) ? styles.usernameOp : styles.usernameNotOp]}
               onPress={(value) => {
                 navigation.navigate('Profile', { username: username, userToken: response.user?.token });
               }}
              >
               {response.user?.username}
              </Text>
           </TouchableOpacity>

           <View style={styles.actionsButton}>
             <Text style = {styles.createdAt}>{ formattedCreatedAtSince }</Text>
              {(response.user?.token === currentUser) ?
                 <ModalActions
                   navigation={navigation}
                   body={response.body}
                   username={username}
                   prayerId={prayerId}
                   commentId={response.id}
                   actionType={'editPrayer'}
                   isAudioPrayer={response.audio}
                   answer={response.answer}
                   newPrayer={false}
                   prayerRequest={prayerRequest}
                 />
                 :
                 <ModalActions
                   navigation={navigation}
                   body={response.body}
                   username={username}
                   prayerId={prayerId}
                   commentId={response.id}
                   actionType={'signalPrayer'}
                 />
               }
           </View>
           { response.audio ?
              <View style={styles.playerAudio}>
                <AudioPrayer audio={response.audio} duration={response.audio_duration} />
              </View>
              :
              <Text style={styles.prayerBody}>{response.body}</Text>
            }

            { response.answers.length > 0 ?
               hideAnswer ?
                  <Text
                    onPress={() => setHideAnswer(false)}
                    style={styles.displayAnswers}
                    >
                      <FontAwesomeIcon icon={faAngleDown} color={'#bbbbbb'} size={24} />
                    </Text>
                 :
                   <View style={styles.answer}>
                     <Text
                       onPress={() => setHideAnswer(true)}
                       style={styles.displayAnswers}
                     >
                      <FontAwesomeIcon icon={faAngleUp} color={'#bbbbbb'} size={24} />
                     </Text>
                     { response.answers.map((answer, i) => {
                       return <Answer
                                 key={ Math.random() }
                                 index={i}
                                 answer={answer}
                                 currentUser={currentUser}
                                 navigation={navigation}
                               />
                       })
                     }
                   </View>
              :
              null
            }

         </View>
};

export default Prayer;
