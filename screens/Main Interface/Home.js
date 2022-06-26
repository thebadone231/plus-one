import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { userCollectionRef } from '../../services/Firebase';
import { AuthenticationContext } from '../../services/Firebase';
import SafeArea from '../utility/SafeArea';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import RequestCard from './RequestCardComponent';
import { ScrollView } from 'react-native-gesture-handler';
import { GOOGLEAPIKEY } from '../../services/config';
import { auth, db, requestCollectionRef } from '../../services/Firebase';
import { LogBox } from 'react-native';

// to initialize geocoding which allows for converting of
// latlong to location and vice versa

Geocoder.init(GOOGLEAPIKEY, { language: 'en' });

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

  // to fetch request info
  useEffect(() => {
    const getRequestData = async () => {
      const requestDatabase = await requestCollectionRef();
      requestDatabase.forEach((doc) => {
        console.log(doc.data());
      });
    };

    getRequestData();
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

    // to ignore the useNativeDriver warning
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
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
        listViewDisplayed={true} // true/false/undefined
        fetchDetails={true}
        returnKeyType={'search'}
        renderDescription={(row) => row.description} // display full address
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
          key: GOOGLEAPIKEY,
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
    { label: 'Price', value: 'price' },
    { label: 'Distance', value: 'distance' },
    { label: 'Time', value: 'time' },
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
                <View style={{ flex: 1 }}></View>
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
                    <View style={styles.findIconContainer}>
                      <TouchableOpacity>
                        <Image
                          style={styles.findIcon}
                          source={require('../../assets/search.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.spacer}></View>
                  </View>

                  <View style={styles.detailedRequestsContainer}>
                    <ScrollView>
                      <RequestCard />
                      <RequestCard />
                      <RequestCard />
                      <RequestCard />
                      <RequestCard />
                    </ScrollView>
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
    position: 'absolute',
    elevation: 100,
    zIndex: 100,
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
    justifyContent: 'flex-start',
    marginLeft: -9,
    marginTop: 17,
  },
  locationIcon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },

  allRequestsContainer: {
    flex: 10,
    zIndex: 1,
    elevation: 1,
  },
  sortingContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: -10,
  },
  spacer: {
    flex: 0.5,
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
  findIconContainer: {
    flex: 1.5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  findIcon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  detailedRequestsContainer: {
    flex: 10,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
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
