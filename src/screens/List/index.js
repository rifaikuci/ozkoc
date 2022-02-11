import React, {useEffect, useState} from "react";
import {FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




let array = [];
const HEIGHT = Dimensions.get('window').height;
const STORAGE_KEY = '@save_age3'

function sum(array) {
    let toplam = 0;
    for (let i = 0; i < array.length; i++) {
        toplam = toplam + parseFloat(array[i]);
    }

    return parseFloat(toplam)
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sil(val) {
    array = array.filter((item, index) => index !== val)
}


function  turkishtoEnglish (value) {
    return (value.replace('Ğ','g')
        .replace('Ü','u')
        .replace('Ş','s')
        .replace('I','i')
        .replace('İ','i')
        .replace('Ö','o')
        .replace('Ç','c')
        .replace('ğ','g')
        .replace('ü','u')
        .replace('ş','s')
        .replace('ı','i')
        .replace('ö','o')
        .replace('ç','c')).toUpperCase();
};

const List = ({route, navigation}) => {

    const [text, setText] = useState("");
    const [refresh, setRefresh] = useState(true);
    const [textInput, setTextInput] = useState(null);
    const [kod, setKod] = useState(null);

    useEffect(() => {
        readData()
    }, [])

    const readData = async () => {
        try {
            let tempArray = await AsyncStorage.getItem(route.params.item).then(
                data => data
            )


            if (tempArray) {
                array = tempArray.split(",");
            }
            setRefresh(!refresh)
        } catch (e) {}
    }

    const saveData = async () => {
        try {
            await AsyncStorage.setItem(route.params.item, array.toString())
            array = []
            setRefresh(!refresh)
        } catch (e) {
        }
    }


    const renderItem = ({item, index}) => (

        <TouchableOpacity style={{backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#37474F"}}>
            <View style={{margin: 10, flexDirection: "row", justifyContent: "space-between"}}>
                <View>

                    <Text style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: index % 2 === 0 ? "#000" : "#fff"
                    }}>  {item}</Text>
                </View>


                <View>
                    <TouchableOpacity style={{backgroundColor: '#E53935', padding: 6, margin: 6, borderRadius: 3}}
                                      onPress={() => {
                                          sil(index)
                                          setRefresh(!refresh)
                                      }}
                    >
                        <Text style={{color: "#fff"}}>
                            X
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

        </TouchableOpacity>
    );


    return (
        <SafeAreaView
            style={{margin: 10}}
        >


            <View style={{flexDirection: "row"}}>
                <View style={{marginVertical: 10, marginRight: 20}}>
                    <TouchableOpacity
                        onPress={()=> {navigation.navigate("Main")}}
                    >
                        <Image source={require("../../../assets/icons/back.png")} style={{width: 30, height: 30}}/>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={{
                flexDirection: "row", justifyContent: "flex-start"
            }}>
                <View style={{justifyContent: "flex-start", flex: 3}}>

                    <Text style={{margin: 5, color: "#7986CB", fontWeight: "bold"}}>
                        Toplam(Mt) : {numberWithCommas(sum(array))}
                    </Text>
                    <Text style={{margin: 5, color: "#999", fontWeight: "bold"}}>
                        Toplam Top Say: {array.length}
                    </Text>
                </View>
                <View style={{justifyContent: "flex-end", flex: 2}}>

                    <TouchableOpacity
                        onPress={async () => {
                            saveData()
                            setKod(null)
                            setText(null)
                            navigation.navigate("Main")

                        }}
                        style={{
                            backgroundColor: "#263238", marginRight: 10, padding: 10, borderRadius: 4,
                            justifyContent: "center", alignItems: "center"
                        }}>
                        <Text style={{fontSize: 15, fontWeight: "bold", color: "#FAFAFA"}}>
                            Güncelle
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
            <View style={{
                height: HEIGHT / 20,
                width: "30%",
                margin: 10,
                marginLeft: 50

            }}>
                <TextInput
                    ref={(input) => {
                        setTextInput(input);
                    }}
                    value={text}
                    blurOnSubmit={false}
                    onChangeText={(value) => setText(value)}
                    returnKeyType={"done"}
                    onSubmitEditing={(e) => {
                        if (e.nativeEvent.text && e.nativeEvent.text > 0) {
                            array.push(e.nativeEvent.text)
                            array= array.map(item => item).reverse()

                        }
                        textInput.focus()
                        setText("")
                    }}
                    style={{
                        padding: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                    }}
                    keyboardType='numeric'
                    placeholder={"Metre Giriniz..."}
                />

            </View>

            <View style={{alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: '#4682B4', fontWeight: "bold", fontSize: 20, marginBottom: 5}}>{route.params.item}</Text>
            </View>

            <View style={{
                height: HEIGHT / 10 * 6.5,
            }}>
                <FlatList data={array}
                          renderItem={renderItem}
                          keyExtractor={(item, index) => index}
                          ItemSeparatorComponent={() => {
                              return (
                                  <View style={{
                                      width: "100%",
                                      height: 1,
                                      backgroundColor: "#4f4f4f",
                                  }}/>
                              );
                          }}
                />
            </View>
        </SafeAreaView>
    )
};

export default List;
