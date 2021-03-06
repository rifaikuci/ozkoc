import {
    Alert,
    FlatList,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Mailer from 'react-native-mail';

import XLSX from 'xlsx';

var RNFS = require('react-native-fs');


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


const Main = ({navigation}) => {


    const [list, setList] = useState([]);
    const [count, setCount] = useState(0);
    const [refresh, setRefresh] = useState(true);
    let array = [];


    const importData = async () => {
        try {
            let array = []
            const keys = await AsyncStorage.getAllKeys();
            const result = await AsyncStorage.multiGet(keys).then(data => data);
            for (let i = 0; i < result.length; i++) {
                array.push(result[i]);
            }
            setCount(array.length)
            setList(array);
            setRefresh(!refresh)
        } catch (error) {
        }
    }


    const handleEmail = (file, item) => {
        Mailer.mail({
            subject: new Date().toLocaleDateString("tr-TR") + " Tarihinde yapılan " + item + " Kumaşın metreleri",
            body: '<b>Kumaşlar  Ektedir.</b>',
            isHTML: true,
            attachments: [{
                path: file,  // The absolute path of the file from which to read data.
                type: 'xlsx',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
                name: '',   // Optional: Custom filename for attachment
            }]
        }, (error, event) => {
            console.log(error)
            Alert.alert(
                error,
                event,
                [
                    {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
                    {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
                ],
                {cancelable: true}
            )
        });
    }

    const clearStorage = async () => {
        try {
            await AsyncStorage.clear()
            setRefresh(!refresh)
        } catch (e) {
        }
    }


    let allPrint = () => {

        let filePath = "";
        let wbout = null;
        let wb = null;
        let ws = null;
        wb = XLSX.utils.book_new();
        list.forEach(x => {
            let printData = [];

            array = x.length > 0 ? x[1].split(",") : [];


            let firmName = x[0];
            let dotname = "#";
            let dotname2 = "##";
            let dotname3 = "####";
            let dotname4 = "#####";
            let dotname5 = "######";
            let dotname6 = "#######";

            printData.push({
                [firmName]: "",
                [dotname]: "Toplam MT",
                [dotname2]: numberWithCommas(sum(array)),
                [dotname3]: "Toplam Top",
                [dotname4]: array.length,
                [dotname5]: "",
                [dotname6]: "",
            })
            array= array.map(Number)
            array = array.sort();


            let uzunluk = 45;

            for (let i = 0; i < array.length; i++) {
                printData.push({
                    [firmName]: i < uzunluk ? array[i] : "",
                    [dotname]: i < uzunluk ? array[uzunluk + i] ? array[uzunluk + i] : "" : "",
                    [dotname2]: i < uzunluk ? array[(uzunluk * 2) + i] ? array[(uzunluk * 2) + i] : "" : "",
                    [dotname3]: i < uzunluk ? array[(uzunluk * 3) + i] ? array[(uzunluk * 3) + i] : "" : "",
                    [dotname4]: i < uzunluk ? array[(uzunluk * 4) + i] ? array[(uzunluk * 4) + i] : "" : "",
                    [dotname5]: i < uzunluk ? array[(uzunluk * 5) + i] ? array[(uzunluk * 5) + i] : "" : "",
                    [dotname6]: i < uzunluk ? array[(uzunluk * 6) + i] ? array[(uzunluk * 6) + i] : "" : "",

                })
            }


            ws = XLSX.utils.json_to_sheet(printData)
            XLSX.utils.book_append_sheet(wb, ws, x[0])


        })
        let today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '_' + dd + '_' + yyyy;

        wbout = XLSX.write(wb, {type: 'binary', bookType: "xlsx"});
        if (Platform.OS === "ios") {
            filePath = RNFS.DocumentDirectoryPath + '/' + today + "kumaslar" + '.xlsx'

        } else {
            filePath = RNFS.ExternalStorageDirectoryPath + '/' + today + "kumaslar" + '.xlsx'

        }


        RNFS.writeFile(filePath, wbout, 'ascii').then((r) => {
            handleEmail(filePath, "kumaslar")

            //console.log(RNFS.ExternalStorageDirectoryPath + '/my_exported_file.xlsx');
        }).catch((e) => {
            console.log('Error', e);
        });




    }


    let printItem = (item) => {


        array = item.length > 0 ? item[1].split(",") : [];

        let printData = [];

        let firmName = item[0];
        let dotname = "#";
        let dotname2 = "##";
        let dotname3 = "####";
        let dotname4 = "#####";
        let dotname5 = "######";
        let dotname6 = "#######";

        printData.push({
            [firmName]: "",
            [dotname]: "Toplam MT",
            [dotname2]: numberWithCommas(sum(array)),
            [dotname3]: "Toplam Top",
            [dotname4]: array.length,
            [dotname5]: "",
            [dotname6]: "",
        })

        printData.push({
            [firmName]: "",
            [dotname]: "",
            [dotname2]: "",
            [dotname3]: "",
            [dotname4]: "",
            [dotname5]: "",
            [dotname6]: "",
        })

        array= array.map(Number)
        array = array.sort();
        let uzunluk = 45;

        for (let i = 0; i < array.length; i++) {
            printData.push({
                [firmName]: i < uzunluk ? array[i] : "",
                [dotname]: i < uzunluk ? array[uzunluk + i] ? array[uzunluk + i] : "" : "",
                [dotname2]: i < uzunluk ? array[(uzunluk * 2) + i] ? array[(uzunluk * 2) + i] : "" : "",
                [dotname3]: i < uzunluk ? array[(uzunluk * 3) + i] ? array[(uzunluk * 3) + i] : "" : "",
                [dotname4]: i < uzunluk ? array[(uzunluk * 4) + i] ? array[(uzunluk * 4) + i] : "" : "",
                [dotname5]: i < uzunluk ? array[(uzunluk * 5) + i] ? array[(uzunluk * 5) + i] : "" : "",
                [dotname6]: i < uzunluk ? array[(uzunluk * 6) + i] ? array[(uzunluk * 6) + i] : "" : "",

            })
        }


        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(printData)
        XLSX.utils.book_append_sheet(wb, ws, item[0])
        let wbout = XLSX.write(wb, {type: 'binary', bookType: "xlsx"});
        let today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '_' + dd + '_' + yyyy;

        let filePath = "";
        if (Platform.OS === "ios") {

            item[0] = item[0].replace(" ", "_")
            filePath = RNFS.DocumentDirectoryPath + '/' + today + item[0] + '.xlsx'

        } else {
            filePath = RNFS.ExternalStorageDirectoryPath + '/' + today + item[0] + '.xlsx'

        }

        RNFS.writeFile(filePath, wbout, 'ascii').then((r) => {
            handleEmail(filePath, item[0])

        }).catch((e) => {
            console.log('Error', e);
        });


    }


    const createTwoButtonAlert = () =>
        Alert.alert(
            "Uyarı",
            "Tüm Kayıtlar silinecek",
            [
                {
                    text: "Vazgeç",
                    onPress: () => {
                    },
                    style: "cancel"
                },
                {text: "Evet", onPress: () => clearStorage()}
            ]
        );


    useEffect(() => {
        importData()
    }, [count, refresh])


    const removeItem = async (key) => {
        try {
            Alert.alert(
                "Uyarı",
                "Kayıt Silinecek  Kayıt : " + key,
                [
                    {
                        text: "Vazgeç",
                        onPress: () => {
                        },
                        style: "cancel"
                    },
                    {
                        text: "Evet", onPress: async () => {
                            await AsyncStorage.removeItem(key)
                            importData()
                        }
                    }
                ]
            );


        } catch (e) {
        }
    }

    const renderItem = ({item, index}) => (
        <TouchableOpacity style={{backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#37474F"}} onPress={() => {
            item[0] ? navigation.navigate("List", {
                item: item[0]
            }) : ""
        }}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View>

                    <Text style={{
                        fontSize: 15,
                        padding: 20,
                        fontWeight: "bold",
                        color: index % 2 === 0 ? "#000" : "#fff"
                    }}>   {item[0] ? item[0] : ""} {item[1] ? "(" + item[1].split(",").length + ")" : ""}  </Text>
                </View>


                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={{backgroundColor: '#2979FF', padding: 10, margin: 10, borderRadius: 3}}
                                      onPress={() => {
                                          printItem(item)
                                      }}>
                        <Text style={{color: "#fff", fontSize: 20}}>
                            Yazdır
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#E53935', padding: 10, margin: 10, borderRadius: 3}}
                                      onPress={() => {
                                          removeItem(item[0])
                                      }}>
                        <Text style={{color: "#fff", fontSize: 20}}>
                            Sil
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>

        </TouchableOpacity>
    );

    return (

        <SafeAreaView>
            <View style={{height: "10%"}}>
                <View style={{
                    alignItems: "flex-end",
                    margin: 7,
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Home")
                        }}
                    >
                        <View style={{flexDirection: "row", backgroundColor: "#0091EA", borderRadius: 10}}>

                            <Text style={{margin: 2, fontSize: 15, padding: 10, color: "white", fontWeight: "300"}}>
                                Ekle
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Text style={{
                        fontSize: 18,
                        color: "#1E88E5",
                        fontWeight: "bold",
                    }}>
                        Listeler
                    </Text>
                </View>
            </View>

            <View style={{height: "77%", marginVertical: 20, marginBottom: 20}}>
                <FlatList data={list}
                          renderItem={renderItem}
                          keyExtractor={(item, index) => index}
                          style={{}}
                          ItemSeparatorComponent={() => {
                              return (
                                  <View style={{
                                      height: 1,
                                      backgroundColor: "#4f4f4f",
                                  }}/>
                              );
                          }}
                />
            </View>
            <View style={{flexDirection: "row", eight: "13%", justifyContent: "space-between", marginHorizontal: 30}}>
                <View style={{borderWidth: 1, borderRadius: 10, borderColor: "#304FFE", backgroundColor: "#C5CAE9"}}>
                    <TouchableOpacity onPress={createTwoButtonAlert}>
                        <Text style={{padding: 10, fontSize: 20}}>
                            Tümünü Sil
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{borderWidth: 1, borderRadius: 10, borderColor: "#00C853", backgroundColor: "#C8E6C9"}}>
                    <TouchableOpacity onPress={allPrint}>
                        <Text style={{padding: 10, fontSize: 20}}>
                            Tümünü Yazdır
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>


        </SafeAreaView>
    )
}

export default Main;
