import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  NativeModules,
  Platform,
} from 'react-native';
import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [devicesFound, setDevicesFound] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const zpl = '^XA^CT+^FO20,20^A0N,50,40^FDThis is a tilde: ~^FS^CT~^XZ ';

  async function getDevices() {
    RNZebraBluetoothPrinter.scanDevices().then(deviceArray => {
      //do something with deviceArray
      console.log('deviceArray', deviceArray);

      const aux = JSON.parse(
        Platform.OS === 'ios' ? deviceArray.found : deviceArray,
      );
      setDevicesFound(Platform.OS === 'ios' ? aux : aux.found);
    });
  }

  useEffect(() => {
    NativeModules.RNZebraBluetoothPrinter.isEnabledBluetooth().then(res => {
      if (res) {
        RNZebraBluetoothPrinter.enableBluetooth().then(resEnable => {
          //do something with res
          console.log('enableBluetooth ', resEnable);

          if (typeof resEnable !== 'undefined') {
            getDevices();
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (devicesFound.length > 0) {
      console.log(devicesFound);
      setLoading(false);
    }
  }, [devicesFound]);

  const connectDevice = deviceAddress => {
    console.log('*********** deviceAddress', deviceAddress);
    NativeModules.RNZebraBluetoothPrinter.connectDevice(deviceAddress).then(
      res => {
        console.log('res', res);
        console.log('imprimir....');
        printer();
      },
      error => {
        console.log(error);
      },
    );
  };

  const printer = () => {
    NativeModules.RNZebraBluetoothPrinter.print(zpl).then(
      res => {
        //do something with res
        console.log('res print: ', res);
      },
      error => {
        console.log(error);
      },
    );
  };
  const ListBluetoothDevices = ({index, title, deviceSelected}) => (
    <View style={styles.cardStyle}>
      <View>
        <Text style={styles.textCardItem}>{title}</Text>
      </View>
      <View>
        <Button
          onPress={() => connectDevice(deviceSelected.address)}
          title="Conectar"
          color="#841584"
        />
      </View>
    </View>
  );

  const ModalPrinter = () => {
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Hello World!</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>;
  };

  return (
    <ScrollView style={styles.backgroundPage}>
      <SafeAreaView>
        <View style={styles.bodyContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            devicesFound.map((device, index) => (
              <ListBluetoothDevices
                index={index}
                title={device.name}
                deviceSelected={device}
                key={index}
              />
            ))
          )}
        </View>
        <ModalPrinter />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundPage: {
    backgroundColor: '#F7F9FD',
  },
  bodyContainer: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column',
  },
  cardStyle: {
    borderRadius: 15,
    width: '90%',
    marginVertical: '1%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#F0F0F0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  textCardItem: {
    fontWeight: '400',
    fontSize: 16,
    marginVertical: '2.33%',
    marginHorizontal: '3.33%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
