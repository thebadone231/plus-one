import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { userCollectionRef } from '../../services/Firebase';
import { setDoc, doc } from 'firebase/firestore';
import { AuthenticationContext } from '../../services/Firebase';
import SafeArea from '../utility/SafeArea';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';

// to initialize geocoding which allows for converting of
// latlong to location and vice versa

Geocoder.init('AIzaSyBtKQ04efioF9NJ44J1ARRhDIydhskD8XM', { language: 'en' });

const HomeScreen = ({ navigation }) => {
  const { user, handleSignout } = useContext(AuthenticationContext);

  // for top of screen location searchbar text
  const [searchText, setSearchText] = useState('');

  // to check if we have the user's location already
  const [locationReady, setLocationReady] = useState(false);

  // position to be used by react native maps,
  // default location is NUS
  const [position, setPosition] = useState({
    latitude: 1.290665504,
    longitude: 103.772663576,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });

  // to toggle on/off map
  const [toggleMap, setToggleMap] = useState(false);

  // for storing of addressToLatLong coordinates for future use
  const [addressToLatLongCoordinates, setAddressToLatLongCoordinates] =
    useState(null);

  // to fetch user info
  useEffect(() => {
    setDoc(
      doc(userCollectionRef, user.email),
      {
        requests: {
          current: { test: 1 },
          expired: { test: 2 },
        },
      },
      { merge: true }
    );
  }, []);

  // to get user current location, need to wait on the homescreen for a while before it works
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      if (status === 'granted') {
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          enableHighAccuracy: true,
          timeInterval: 5,
        }).then((location) => {
          setPosition({
            latitude: location['coords']['latitude'],
            longitude: location['coords']['longitude'],
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          });
          setLocationReady(true);
          console.log('this is user position \n', position);
        });
      }
    })();
  }, []);

  // component which shows the map
  const CurrentLocationFinder = () => (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      loadingEnabled={true}
      region={position}
    >
      <Marker
        draggable
        coordinate={{
          latitude: position.latitude,
          longitude: position.longitude,
        }}
        onDragEnd={(e) => {
          setPosition({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: 0.0421,
            longitudeDelta: 0.0421,
          });
          console.log('this is Marker onDragEnd position \n', position);
        }}
      />
    </MapView>
  );

  // to autocomplete location searchbar
  const GooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={3} // minimum length of text to search
        autoFocus={false}
        listViewDisplayed="auto" // true/false/undefined
        fetchDetails={true}
        returnKeyType={'search'}
        renderDescription={(row) => row.terms[0].value} // display street only
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log('this is data \n', data);
          console.log('this is details \n', details);
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyBtKQ04efioF9NJ44J1ARRhDIydhskD8XM',
          language: 'en', // language of the results
          components: 'country:sg',
        }}
      />
    );
  };

  // to get location from latitude and longitude
  const latLongToAddress = (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then((json) => {
        console.log(
          'this is the address of geocoding \n',
          json.results[1].formatted_address
        );
        setSearchText(json.results[1].formatted_address);
      })
      .catch((error) => console.warn(error));
  };

  // to get latitude and longitude from address for future use
  const addressToLatLong = (address) => {
    Geocoder.from(address)
      .then((json) => {
        console.log(
          'this is the result from reverse geocoding \n',
          json.results[0].geometry.location
        );
        setAddressToLatLongCoordinates({
          latitude: json.results[0].geometry.location.lat,
          longitude: json.results[0].geometry.location.lng,
        });
      })
      .catch((error) => console.warn(error));
  };

  // for sorting by category dropdown menu
  const [openCategory, setOpenCatergory] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [itemsCategory, setItemsCategory] = useState([
    { label: 'By Price', value: 'price' },
    { label: 'By Distance', value: 'distance' },
    { label: 'By Time', value: 'time' },
  ]);

  // for sorting by larger or smaller than
  const [openDirection, setOpenDirection] = useState(false);
  const [valueDirection, setValueDirection] = useState(null);
  const [itemsDirection, setItemsDirection] = useState([
    { label: '>=', value: 'larger' },
    { label: '<=', value: 'smaller' },
  ]);

  // for filtering by a certain limit ($,m,min)
  const [openFilter, setOpenFilter] = useState(false);
  const [valueFilter, setValueFilter] = useState(null);
  const [itemsFilter, setItemsFilter] = useState([
    { label: 'Free', value: '0.00' },
    { label: '$1.00', value: '1.00' },
    { label: '$2.00', value: '2.00' },
    { label: '$3.00', value: '3.00' },
    { label: '$4.00', value: '4.00' },
    { label: '$5.00', value: '5.00' },
    { label: '$10.00', value: '10.00' },
    { label: '$15.00', value: '15.00' },
    { label: '100m', value: '100m' },
    { label: '300m', value: '300m' },
    { label: '500m', value: '500m' },
    { label: '1km', value: '1000m' },
    { label: '1.5km', value: '1500m' },
    { label: '2km', value: '2000m' },
    { label: '30 min', value: '30' },
    { label: '1h', value: '60' },
    { label: '1h30min', value: '90' },
    { label: '2h', value: '120' },
    { label: '3h', value: '180' },
    { label: '5h', value: '300' },
  ]);

  return (
    <>
      <SafeArea>
        <View style={styles.container}>
          {toggleMap ? (
            <>
              <CurrentLocationFinder />
              <View
                style={{
                  position: 'absolute',
                  top: '90%',
                  alignSelf: 'center',
                }}
              >
                <TouchableOpacity
                  style={styles.setLocationButton}
                  onPress={() => {
                    latLongToAddress(
                      position['latitude'],
                      position['longitude']
                    );
                    setToggleMap((prevToggleMap) => !prevToggleMap);
                  }}
                >
                  <Text style={styles.locationButtonText}>Set My Location</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <KeyboardAwareView animated={true}>
                <View style={styles.searchbarContainer}>
                  <View style={styles.searchbar}>
                    <GooglePlacesInput />
                  </View>

                  <View style={styles.location}>
                    <TouchableOpacity
                      onPress={() => {
                        setToggleMap(true);
                      }}
                    >
                      <Image
                        style={styles.locationIcon}
                        source={require('../../assets/locationpin.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.allRequestsContainer}>
                  <View style={styles.sortingContainer}>
                    <View style={styles.spacer}></View>
                    <View style={styles.category}>
                      <DropDownPicker
                        open={openCategory}
                        value={valueCategory}
                        items={itemsCategory}
                        setOpen={setOpenCatergory}
                        setValue={setValueCategory}
                        setItems={setItemsCategory}
                        defaultValue="price"
                        placeholder="Filter By"
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                    </View>
                    <View style={styles.greaterThanIcon}>
                      <DropDownPicker
                        open={openDirection}
                        value={valueDirection}
                        items={itemsDirection}
                        setOpen={setOpenDirection}
                        setValue={setValueDirection}
                        setItems={setItemsDirection}
                        defaultValue="larger"
                        placeholder="Range"
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                    </View>
                    <View style={styles.range}>
                      <DropDownPicker
                        open={openFilter}
                        value={valueFilter}
                        items={itemsFilter}
                        setOpen={setOpenFilter}
                        setValue={setValueFilter}
                        setItems={setItemsFilter}
                        defaultValue="5.00"
                        placeholder="Limit"
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                    </View>
                    <View style={styles.findIcon}>
                      <TouchableOpacity>
                        <Image
                          style={styles.locationIcon}
                          source={require('../../assets/search.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.spacer}></View>
                  </View>

                  <View style={styles.detailedRequestsContainer}>
                    <Text>Detailed Requests</Text>
                    <Text>Detailed Requests</Text>
                    <Text>Detailed Requests</Text>
                    <Text>Detailed Requests</Text>
                    <Text>Detailed Requests</Text>
                    <Text>Detailed Requests</Text>
                    <Text>Detailed Requests</Text>
                  </View>
                </View>
              </KeyboardAwareView>
            </>
          )}
        </View>
      </SafeArea>
      <ExpoStatusBar style="auto" />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5DDF9',
  },
  searchbarContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  searchbar: {
    flex: 6,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  location: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: -9,
  },
  locationIcon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },

  allRequestsContainer: {
    flex: 10,
  },
  sortingContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  spacer: {
    flex: 1,
  },
  category: {
    flex: 5,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  greaterThanIcon: {
    flex: 4.5,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  range: {
    flex: 4,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  findIcon: {
    flex: 1.5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  detailedRequestsContainer: {
    flex: 10,
    backgroundColor: 'grey',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  setLocationButton: {
    backgroundColor: '#1F51FF',
    borderRadius: 10,
    padding: 10,
  },
  locationButtonText: {
    fontSize: 17,
    color: 'white',
  },
});
