import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert, RefreshControl} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';



export default function App() {
  const [devices, setDevices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // ################ REFRESH DO SCROLLVIEW #################
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
//###############################################################
  const options = {
    port: 6788,
    host: '192.168.0.106',

  };

  //######################## SWITCH TROCA ############################

  const togglePressed = ((valor) => {
    let auxD = valor;
    let auxV = devices;
    auxD.status = !valor.status;
    auxV.splice(auxV.indexOf(valor), 1)
    auxV.push(auxD);
    setDevices(auxV);
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));

  })
//###############################################################

//####################### REMOVER DISPOSITIVO ###########################

  const removeLocal = ((valor) => {
    Alert.alert(
      "Tem certeza que deseja remover o dispositivo?", "",
      [
          {
              text: "Sim",
              onPress: (() => {
                let aux = devices;
                if( aux.indexOf(valor) > -1){
                aux.splice(aux.indexOf(valor), 1)
                setDevices(aux);
                setRefreshing(true);
                wait(1000).then(() => setRefreshing(false));
              }
              }),
          },
          { text: "Não", onPress: (() => { }) },
      ]
  );

  })

  const listDevices = (() => {
    if(devices.length === 0){
      return(
        <View style={styles.withoutDevicesView}>
          <Text style={styles.withoutDevicesText}> SEM DISPOSITIVOS ADICIONADOS </Text>
        </View>
      )
    } else {
      devices.sort(function (a, b) {
        if (a.nome > b.nome) {
          return 1;
        }
        if (a.nome < b.nome) {
          return -1;
        }
        return 0;
      });

      return (
       devices.map((dispositivo,index) => {
         return(
            <View key={index} style={styles.devicesList}>
              <View>
              <Text style={styles.device}>{dispositivo.nome}</Text>
              <TouchableOpacity onPress={(() => {removeLocal(dispositivo)})}>
                <Text style={styles.remove}>Remover dispositivo</Text>
              </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row'}}>
              <Text style={styles.device}>{dispositivo.contexto_adicional}</Text>
              
              <Switch
                trackColor={{ false: "#767577", true: 'red' }}
                thumbColor={dispositivo.status ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(() => {togglePressed(dispositivo)})}
                value={dispositivo.status}
            />
            </View>

              
            </View>

          )
        })
      )
 
    }
  })
//####################### PROCURAR DISPOSITIVO ###########################

 const searchDevices = (() => {
  setDevices([{nome: 'Lampada', status: true, operacao: 'ligar, desligar', contexto_adicional: ''},{nome: 'Termometro', status: false, operacao: 'ligar, desligar', contexto_adicional: '18°'},{nome: 'Umidade', status: true, operacao: 'ligar, desligar', contexto_adicional: '35%'}])
  
     /*const client = TcpSocket.createConnection(options, () => {
      client.write('Hello server!');
  
        });
    
    client.on('data', function(data) {
      alert(data)
    });
    
    client.on('error', function(error) {
      alert(error);
    });
    client.on('close', function(){
      client.destroy();
  
      console.log('Connection closed!');
    });
  */
  }) 

  
  return (
    <SafeAreaView style={styles.pai}>
      <View style={styles.header}>
        <Text style={styles.textHeader}> DEVICE CONTROLLER</Text>

      </View>

      <ScrollView style={styles.devices}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
      
      >
        {listDevices()}
      </ScrollView>

      <TouchableOpacity style={styles.procuraDevices} onPress={searchDevices}>
        <Text style={styles.procuraDevicesText}> PROCURAR DISPOSITIVOS </Text>
      </TouchableOpacity>

    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  pai: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#423F3D',

  },
  header:{
    paddingTop: 45,

  },
  textHeader:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20

  },
  procuraDevices:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 10,
    marginBottom: 50,
    marginTop: 30
  },
  procuraDevicesText:{
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black'

  },
  devices: {
    width: '100%',
    height: '50%',
    marginTop: 30,
  },
  withoutDevicesText:{
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold'
  },
  withoutDevicesView:{
    alignItems:'center',
    justifyContent: 'center',

  },
  devicesList:{
    flexDirection: 'row', 
    justifyContent: 'space-between',
    margin: 15 ,
    alignItems: 'center'
  },
  device:{
    fontSize: 16,
    fontWeight: '500',
    color: 'white',

  },
  remove:{
    color: 'red'
  }
});
