import React, { useState, useContext, useEffect } from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Keyboard,} from 'react-native';
import { auth, db } from '../../services/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Accordion from 'react-native-collapsible/Accordion';
import { AuthenticationContext } from '../../services/Firebase';

const FAQScreen = ({ navigation }) => {

  const [feedback, setFeedback] = useState('');
  const [alert, setAlert] = useState(false);
  const [active_sections, setactive_sections] = useState([]);
  const { user } = useContext(AuthenticationContext);


  const userFeedbackDocRef = doc(db, 'feedback/' + user.email);

  //content for the FAQ
  const sections = [
    {
      title: 'What is +1?',
      content: '+1 is an application where users can pay for to get their errands fulfilled or receive a small reward for errands they accomplished. \n\nNeed something from the supermarket although\nyou just came back? Use +1!',
    },
    {
      title: 'My order is more than 10 mins late',
      content:'You can try contacting the user doing the delivery\nusing our in app chat function. Alternatively, you\nmay choose to give that user a call\n\nDrop us a feedback if all else fails!',
    },
    {
      title: 'How do I cancel my order?',
      content: 'To be updated...',
    },
    {
      title: 'I am unable to contact the buyer',
      content: 'Have you given our in app chat function a try?\nElse you can find the contact details of the buyer\nin the +1 request ',
    },
  ];

  //functions for collapsible container
  let Header = (section, index) => {
    return (
      <View style={{ backgroundColor: '#D5DDF9', alignItems: 'center', padding: 5 }}>

        <Text style={{ fontSize: 17, fontWeight: '600', marginTop: 10 }}>
          {section.title}
        </Text>
        
        <Image style={{ width: 15, height: 15 }} 
          source={ active_sections.includes(index) ? require('../../assets/circled-chevron-up.png'): require('../../assets/circled-chevron-down.png')}
        />

      </View>
    );
  };

  let Content = (section) => {
    return (
      <View style={styles.content}>
        <Text style={{ fontSize: 15, fontWeight: '400' }}>
          {section.content}
        </Text>
      </View>
    );
  };

  //function for uploading of feedback
  const upload_feedback = async () => {
    var today = new Date();
    var date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    var time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;


    await setDoc( userFeedbackDocRef, { [dateTime]: { feedback: feedback } },{ merge: true }).then(setAlert(true))
    .catch(console.error);
  };

  return (
    <View style={{ ...styles.container, justifyContent: 'center' }}>

      <View style={{ flex: 5, justifyContent: 'flex-end', alignItems: 'center' }}>
        <TouchableOpacity style={{ width: '19%' }} onPress={() => {navigation.navigate('MainInterface');}}>
          <Text style={{ ...styles.mainLogo }}> +1 </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 23, marginTop: 10 }}>

        <KeyboardAwareScrollView>
          <Accordion
            activeSections={active_sections}
            sections={sections}
            renderHeader={Header}
            renderContent={Content}
            onChange={(activeSections) => {
              setactive_sections(activeSections);
            }}
            expandMultiple={true}
          />
          <View style={styles.feedback}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Send us a feedback!
              </Text>
            </View>

            <View
              style={{flex: 11, justifyContent: 'center', alignItems: 'center',width: '100%',}}>
              <TextInput
                style={styles.feedbackText}
                multiline={true}
                placeholder="Details: "
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                blurOnSubmit={true}
                onChangeText={(text) => {
                  setFeedback(text);
                }}
              />
            </View>

            <View style={{ flex: 3, alignItems: 'center', width: '100%' }}>
              <TouchableOpacity style={styles.submitButton} onPress={upload_feedback}>
                <Text style={{ fontSize: 17, fontWeight: '500' }}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAwareScrollView>

        
      </View>

      <AwesomeAlert
        show={alert}
        title={'Thank You!'}
        message={'Your feedback has been received'}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText="Close"
        onCancelPressed={() => {
          setAlert(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5DDF9',
  },

  mainLogo: {
    fontSize: 50,
    fontWeight: '800',
  },

  botNavBar: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    backgroundColor: '#E8EDFF',
    padding: 7,
    borderRadius: 15,
  },

  feedback: {
    alignItems: 'center',
    width: '100%',
    height: 360,
    marginTop: 30,
  },

  feedbackText: {
    height: '85%',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 13,
    paddingTop: 10,
    fontSize: 15,
    fontWeight: '500',
  },

  submitButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '23%',
    height: '37%',
    borderRadius: 7,
  },
});

export default FAQScreen;
