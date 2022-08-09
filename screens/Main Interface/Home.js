import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
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
import { GOOGLEAPIKEY } from '../../services/config.js';
import { requestCollectionRef } from '../../services/Firebase';
import { LogBox } from 'react-native';
import { getDistance } from 'geolib';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Timestamp } from 'firebase/firestore';

// to initialize geocoding which allows for converting of latlong to location and vice versa

Geocoder.init(GOOGLEAPIKEY, { language: 'en' });

const HomeScreen = ({ navigation }) => {
  // for top of screen location searchbar text
  const [searchText, setSearchText] = useState('');

  // to check if we have the user's location already
  const [locationReady, setLocationReady] = useState(false);

  // position to be used by react native maps
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

  // for storing of QuerySnapshot
  const [requestQuery, setRequestQuery] = useState(null);

  // to check if requests have loaded
  const [isRequestLoaded, setIsRequestLoaded] = useState(false);

  // to check if requests have been filtered
  const [isRequestFiltered, setIsRequestFiltered] = useState(false);

  // to fetch request info
  useEffect(() => {
    const getRequestData = async () => {
      const requestDatabase = await requestCollectionRef();
      var requestArray = [];
      requestDatabase.forEach((doc) => {
        requestArray.push({
          restaurantName: doc.data()['order details']['product name'],
          price: doc.data()['order details']['price'],
          address: doc.data()['location']['address'],
          latitude: doc.data()['location']['lat'],
          longitude: doc.data()['location']['long'],
          profilePicture: require('../../assets/user.png'),
          username: doc.data()['order details']['username'],
          orderDetails: doc.data()['order details']['order specifics'],
          deliverBy: new Timestamp(
            doc.data()['order details']['delivery timing']['seconds'],
            doc.data()['order details']['delivery timing']['nanoseconds']
          ).toDate(),
          paymentMethod: doc.data()['order details']['payment method'],
          contactNumber: doc.data()['order details']['contact number'],
          userid: doc.data()['user'],
          requestid: doc.id,
        });
      });
      setRequestQuery(requestArray);
      setIsRequestLoaded(true);
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
    const ref = useRef();

    useEffect(() => {
      ref.current?.setAddressText(searchText);
    }, []);

    return (
      <GooglePlacesAutocomplete
        ref={ref}
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
        setSearchText(json.results[1].formatted_address);
      })
      .catch((error) => console.warn(error));
  };

  // get distance between two location
  const distanceBetween = (location1, location2) => {
    var distance = getPreciseDistance(location1, location2);
    console.log(`Distance between them is ${distance / 1000} km`);
    return distance;
  };

  // to get latitude and longitude from address for future use if needed
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
  const [openCategory, setOpenCategory] = useState(false);
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
    { label: 'NIL', value: 'NA' },
  ]);

  // for price
  const [itemsPriceFilter, setItemsPriceFilter] = useState([
    { label: '$0.00', value: '0' },
    { label: '$1.00', value: '1' },
    { label: '$2.00', value: '2' },
    { label: '$3.00', value: '3' },
    { label: '$4.00', value: '4' },
    { label: '$5.00', value: '5' },
    { label: '$10.00', value: '10' },
  ]);

  // for distance
  const [itemsDistanceFilter, setItemsDistanceFilter] = useState([
    { label: '0km', value: '0' },
    { label: '0.5km', value: '500' },
    { label: '1km', value: '1000' },
    { label: '1.5km', value: '1500' },
    { label: '2km', value: '2000' },
    { label: '5km', value: '5000' },
    { label: '10km', value: '10000' },
  ]);

  // for time
  const [itemsTimeFilter, setItemsTimeFilter] = useState([
    { label: '1h', value: '1' },
    { label: '2h', value: '2' },
    { label: '3h', value: '3' },
    { label: '5h', value: '5' },
    { label: '12h', value: '12' },
  ]);

  // alerts for filtering of requests
  const [nullFilterAlert, setNullFilterAlert] = useState(false);
  const [limitNILAlert, setLimitNILAlert] = useState(false);

  const filterRequests = () => {
    if (
      valueCategory == null ||
      valueDirection == null ||
      valueFilter == null
    ) {
      setNullFilterAlert(true);
    } else if (valueFilter == 'NA') {
      setLimitNILAlert(true);
    } else {
      setIsRequestFiltered(true);
    }
  };

  return (
    <>
      <SafeArea>
        <View style={styles.container}>
          {toggleMap ? ( // if user chose to open interactive map
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
                    setToggleMap((prevToggleMap) => !prevToggleMap); // close the interactive map
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
                        setOpen={setOpenCategory}
                        setValue={setValueCategory}
                        setItems={setItemsCategory}
                        placeholder="Filter By"
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                        onOpen={() => {
                          setOpenDirection(false);
                          setOpenFilter(false);
                        }}
                        onChangeValue={(value) => {
                          if (value == 'price') {
                            setItemsFilter(itemsPriceFilter);
                          } else if (value == 'distance') {
                            setItemsFilter(itemsDistanceFilter);
                          } else if (value == 'time') {
                            setItemsFilter(itemsTimeFilter);
                          }
                        }}
                        textStyle={{
                          fontSize: 12,
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
                        placeholder="Range"
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                        onOpen={() => {
                          setOpenCategory(false);
                          setOpenFilter(false);
                        }}
                        textStyle={{
                          fontSize: 12,
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
                        placeholder="Limit"
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                        onOpen={() => {
                          setOpenDirection(false);
                          setOpenCategory(false);
                        }}
                        textStyle={{
                          fontSize: 12,
                        }}
                      />
                    </View>
                    <View style={styles.findIconContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          filterRequests();
                        }}
                      >
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
                      {isRequestLoaded ? (
                        isRequestFiltered ? (
                          requestQuery.map((doc) => {
                            // check if requests have expired
                            if (doc.deliverBy.getTime() > Date.now()) {
                              // if price is chosen
                              if (valueCategory == 'price') {
                                if (valueDirection == 'larger') {
                                  if (
                                    parseFloat(doc.price) >=
                                    parseFloat(valueFilter)
                                  ) {
                                    return (
                                      <View>
                                        <RequestCard
                                          request={doc}
                                          navigation={navigation}
                                        />
                                      </View>
                                    );
                                  }
                                } else if (valueDirection == 'smaller') {
                                  if (
                                    parseFloat(doc.price) <=
                                    parseFloat(valueFilter)
                                  ) {
                                    return (
                                      <View>
                                        <RequestCard
                                          request={doc}
                                          navigation={navigation}
                                        />
                                      </View>
                                    );
                                  }
                                }
                                // if distance is chosen
                              } else if (valueCategory == 'distance') {
                                var distance = getDistance(
                                  {
                                    latitude: doc.latitude,
                                    longitude: doc.longitude,
                                  },
                                  {
                                    latitude: position.latitude,
                                    longitude: position.longitude,
                                  }
                                );
                                if (valueDirection == 'larger') {
                                  if (distance >= parseInt(valueFilter)) {
                                    return (
                                      <View>
                                        <RequestCard
                                          request={doc}
                                          navigation={navigation}
                                        />
                                      </View>
                                    );
                                  }
                                } else if (valueDirection == 'smaller') {
                                  if (distance <= parseInt(valueFilter)) {
                                    return (
                                      <View>
                                        <RequestCard
                                          request={doc}
                                          navigation={navigation}
                                        />
                                      </View>
                                    );
                                  }
                                }
                                // if time is chosen
                              } else if (valueCategory == 'time') {
                                var requestTime = doc.deliverBy.getTime();
                                var currentTime = Date.now();
                                var timeAdded = parseInt(valueFilter);
                                if (valueDirection == 'larger') {
                                  if (
                                    requestTime >=
                                    currentTime + timeAdded * 60 * 60 * 1000
                                  ) {
                                    return (
                                      <View>
                                        <RequestCard
                                          request={doc}
                                          navigation={navigation}
                                        />
                                      </View>
                                    );
                                  }
                                } else if (valueDirection == 'smaller') {
                                  if (
                                    requestTime <=
                                    currentTime + timeAdded * 60 * 60 * 1000
                                  ) {
                                    return (
                                      <View>
                                        <RequestCard
                                          request={doc}
                                          navigation={navigation}
                                        />
                                      </View>
                                    );
                                  }
                                }
                              }
                            }
                          })
                        ) : (
                          requestQuery.map((doc) => {
                            if (doc.deliverBy.getTime() > Date.now()) {
                              // check if requests have expired
                              return (
                                <View>
                                  <RequestCard
                                    request={doc}
                                    navigation={navigation}
                                  />
                                </View>
                              );
                            }
                          })
                        )
                      ) : (
                        <View>
                          <Text>Loading...</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              </KeyboardAwareView>
            </>
          )}
        </View>
        <AwesomeAlert
          show={nullFilterAlert}
          title="Invalid Filter"
          message="Please set all filters properly"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="Close"
          onCancelPressed={() => {
            setNullFilterAlert(false);
          }}
        />
        <AwesomeAlert
          show={limitNILAlert}
          title="Invalid Filter"
          message="Please select a limit"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="Close"
          onCancelPressed={() => {
            setLimitNILAlert(false);
          }}
        />
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
    elevation: 1,
    zIndex: 1,
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
