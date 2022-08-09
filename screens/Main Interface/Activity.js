import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text, Image,} from 'react-native';
import { auth, db } from '../../services/Firebase';
import { getDoc, doc } from 'firebase/firestore';
import SelectDropdown from 'react-native-select-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Accordion from 'react-native-collapsible/Accordion';

const ActivityScreen = () => {
  const [plusoneData, setplusoneData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [deliveriesData, setDeliveriesData] = useState([]);
  const [type, setType] = useState('');
  const [time, setTime] = useState('');
  const [active_sections, setactive_sections] = useState([]);

  const userDocRef = doc(db, 'users/' + auth.currentUser.email);

  useEffect(() => {
    const getUserData = async () => {
      const UserDatabase = await getDoc(userDocRef);
      const userdata = UserDatabase.data();
      setplusoneData(userdata['plus-one']);
      setRequestData(userdata['requests']);
      setDeliveriesData(userdata['deliveries']);
    };

    getUserData().then(() => {})
      .catch((error) => {
        console.error;
      });
  }, []);

  const field1 = [
    { label: 'Your +1', value: '+1' },
    { label: 'Your Requests', value: 'requests' },
    { label: 'Your Deliveries', value: 'deliveries' },
  ];

  const field2 = [
    { label: 'Last Week', value: 'last week' },
    { label: 'Last 3 months', value: 'last 3 months' },
    { label: 'Last 6 months', value: 'last 6 months' },
  ];

  //functions for collapsible container
  let Header = (section, index) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ backgroundColor: '#D5DDF9', flex: 1 }}>
          <Text></Text>
        </View>

        <View style={{ flex: 22, borderRadius: 10 }}>
          <View style={{ backgroundColor: '#D5DDF9' }}>
            <Text></Text>
          </View>

          <View style={{ backgroundColor: '#E8EDFF', padding: 5, flexDirection: 'row', borderRadius: 3,}}>
            <View style={{flex: 7, flexDirection: 'row', justifyContent: 'center',}}>
              <Text style={{fontSize: 18, fontWeight: '600', marginRight: 14, marginLeft: 15,}}>
                {section.title['name']}
              </Text>

              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                {section.title['price']}
              </Text>
            </View>

            <View style={{ flex: 2 }}>
              <Image style={{ width: 18, height: 18 }}
                source={ active_sections.includes(index) ? require('../../assets/circled-chevron-up.png') : require('../../assets/circled-chevron-down.png')}
              />
            </View>

          </View>
        </View>

        <View style={{ backgroundColor: '#D5DDF9', flex: 1 }}>
          <Text></Text>
        </View>
      </View>
    );
  };

  let Content = (section) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ backgroundColor: '#D5DDF9', flex: 1 }}>
          <Text></Text>
        </View>

        <View style={styles.content}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              marginLeft: 20,
              marginBottom: 7,
            }}
          >
            {section.content['location']}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              fontSize: 15,
              fontWeight: '400',
              marginLeft: 20,
              marginBottom: 3,
            }}
          >
            <Text>Order details: </Text>
            <Text style={{ width: '74%' }}>
              {section.content['details']['order specifics']}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              marginLeft: 20,
              marginBottom: 3,
            }}
          >
            Time of request : {section.content['time']}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              marginLeft: 20,
              marginBottom: 3,
            }}
          >
            Payment method: {section.content['details']['payment method']}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              marginLeft: 20,
              marginBottom: 8,
            }}
          >
            Delivered by: {section.content['details']['delivered by']['user']}
          </Text>
        </View>

        <View style={{ backgroundColor: '#D5DDF9', flex: 1 }}>
          <Text></Text>
        </View>
      </View>
    );
  };

  //default component that will be rendered when the user has yet to select the fields
  let main_component = (
    <View style={{ alignItems: 'center' }}>
      <Text>Please select the relevant options</Text>
    </View>
  );

  let sections = [];
  //processing of data for rendering: determining the correct type of data to display
  if (time && type) {
    //logic processing
    var userData = plusoneData;
    if (type == 'requests') {
      userData = requestData;
    } else if (type == 'deliveries') {
      userData = deliveriesData;
    }

    var timeframe = 'last week';
    var comp = new Date();
    if (time == 'last 3 months') {
      timeframe = 'last 3 months';
      comp.setDate(comp.getDate() - 92);
    } else if (time == 'last 6 months') {
      timeframe = 'last 6 months';
      comp.setDate(comp.getDate() - 183);
    } else {
      comp.setDate(comp.getDate() - 7);
    }

    let dateFilter = (ref, item) => {
      var curr =
        (ref.getFullYear() - 1) * 365 + ref.getMonth() * 31 + ref.getDate();
      var prev =
        (parseInt(item.split(' ')[0].split('-')[0]) - 1) * 365 +
        (parseInt(item.split(' ')[0].split('-')[1]) - 1) * 31 +
        parseInt(item.split(' ')[0].split('-')[2]);
      return curr <= prev;
    };

    //filtering data by time period
    var temp = Object.keys(userData).filter((item) => dateFilter(comp, item));

    //2nd round of data processing: filtering out irrelevant data in the data type obtained above
    for (var i of temp) {
      sections.push({
        title: {
          name: userData[i]['order details']['product name'],
          price: userData[i]['order details']['price'],
        },
        content: {
          location: userData[i]['location']['address'],
          details: userData[i]['order details'],
          time: i,
        },
      });
    }

    if (sections.length != 0) {
      main_component = (
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
        </KeyboardAwareScrollView>
      );
    } else { //display that will be rendered when the user has yet to have information in the fields selected
      main_component = (
        <View style={{ alignItems: 'center' }}>
          <Text>
            Information on the fields selected are missing {'\n'} Please select
            other fields
          </Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{ flex: 5, justifyContent: 'flex-end', alignItems: 'center' }}
      >
        <Text style={{ ...styles.mainLogo }}> +1 </Text>
      </View>

      <View style={{ flex: 23 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingTop: 20,
          }}
        >
          <View>
            <SelectDropdown
              data={field1}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem['label'];
              }}
              onSelect={(selectedItem) => {
                setType(selectedItem['value']);
              }}
              rowTextForSelection={(item, index) => {
                return item['label'];
              }}
              buttonStyle={{ width: 140, height: '50%', borderRadius: 6 }}
              buttonTextStyle={{ fontSize: 15, fontWeight: '600' }}
              rowStyle={{ height: 33 }}
              rowTextStyle={{ fontSize: 14, fontWeight: '400' }}
              searchPlaceHolder="test"
            />
          </View>
          <View style={{}}>
            <SelectDropdown
              data={field2}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem['label'];
              }}
              onSelect={(selectedItem) => {
                sections = [];
                setTime(selectedItem['value']);
              }}
              rowTextForSelection={(item, index) => {
                return item['label'];
              }}
              buttonStyle={{ width: 140, height: '50%', borderRadius: 6 }}
              buttonTextStyle={{ fontSize: 15, fontWeight: '600' }}
              rowStyle={{ height: 33 }}
              rowTextStyle={{ fontSize: 14, fontWeight: '400' }}
            />
          </View>
        </View>

        <View style={{ flex: 8 }}>
          <View
            contentContainerStyle={{
              alignItems: 'center',
              height: 200,
              width: 350,
              borderRadius: 15,
              padding: 10,
            }}
          >
            {main_component}
          </View>
        </View>
      </View>
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

  content: {
    flex: 22,
    backgroundColor: '#E8EDFF',
    paddingRight: 10,
    paddingTop: 7,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
});

export default ActivityScreen;
