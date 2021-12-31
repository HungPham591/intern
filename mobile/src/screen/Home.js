import React from 'react';
import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Modal,
    Pressable,
    ActivityIndicator,
    Button,
    FlatList
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";
import { Picker } from '@react-native-picker/picker';


export default function Home({ navigation }) {

    const [load, showLoad] = useState(false)

    const [filter, setFilter] = useState({ page: 1 })

    const [dataReport, setDataReport] = useState([]);
    const [dataCode, setDataCode] = useState({});
    const [dataDepartment, setDataDepartment] = useState([]);

    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment().add(1, 'months'));
    const [displayedDate, setDisplayed] = useState(moment())
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedReportStatus, setSelectReportStatus] = useState(null);
    const [selectedReportType, setSelectReportType] = useState(null);
    const [selectedIncidentObject, setSelectedIncidentObject] = useState(null)

    const Authorization = async () => {
        const value = await AsyncStorage.getItem('TOKEN');
        return JSON.parse(value);
    }

    const HEADER = {
        'Content-Type': 'multipart/form-data',
        'Authorization': Authorization(),
    }

    const fetchReport = async () => {
        showLoad(true)
        const URL = 'https://qlsc.maysoft.io/server/api/getAllReports'
        const DATA = filter;
        const result = await axios.post(URL, DATA, { headers: HEADER })
        setDataReport({ ...dataReport, ...result.data.data });
        showLoad(false)
    }
    const fetchCode = async () => {
        const URL = 'https://qlsc.maysoft.io/server/api/getCommon'
        const DATA = { groups: "incidentObject, reportStatus, reportType" };
        const result = await axios.post(URL, DATA, { headers: HEADER });
        setDataCode(result.data);
    }
    const fetchDepartment = async () => {
        const URL = 'https://qlsc.maysoft.io/server/api/getAllDepartments'
        const DATA = null;
        const result = await axios.post(URL, DATA, { headers: HEADER });
        setDataCode(result.data.data);
    }
    useEffect(() => {
        fetchReport();
        fetchCode();
        fetchDepartment();
    }, [])

    const handleDatePickerChange = (date) => {
        if (date.startDate)
            setStartDate(date.startDate)
        if (date.endDate)
            setEndDate(date.endDate)
    }
    const handleFilter = () => {
        setFilter({ ...filter, incidentObject: selectedIncidentObject, status: selectedReportStatus, reportType: selectedReportType })
        dataReport = []
        fetchReport();
        setModalVisible(!modalVisible)
    }
    const handleLoadMore = () => {
        setFilter({ ...filter, page: page + 1 })
        fetchReport();
    }
    const list = () => {
        if (dataReport) {
            return (
                <FlatList style={{ height: '100%' }} data={dataReport} onEndReached={handleLoadMore}
                    renderItem={({ item }) => {
                        const reportType = dataCode.reportType.find((value) => value.code === item.reportType)
                        const reportStatus = dataCode.reportStatus.find((value) => value.code === item.status);
                        const incidentObject = dataCode.incidentObject.find((value) => value.code === item.incidentObject);

                        const date = new Date(item.reportTime * 1000).getDate();
                        const month = new Date(item.reportTime * 1000).getMonth();
                        const year = new Date(item.reportTime * 1000).getFullYear();
                        const hour = new Date(item.reportTime * 1000).getHours()
                        const minute = new Date(item.reportTime * 1000).getMinutes();
                        return (
                            <View style={styles.card}>
                                <View style={{ width: '80%' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{item?.reportNo} <Text style={(reportStatus.code === "1") ? { color: 'rgb(254, 198, 0)' } : (reportStatus.code === "2") ? { color: 'rgb(39, 174, 96)' } : { color: 'rgb(36, 235, 199)' }}>{reportStatus?.name}</Text></Text>
                                    <Text style={{ fontStyle: 'italic' }}>{date}/{month}/{year} {hour}/{minute}</Text>
                                    <Text>{reportType?.name}|{incidentObject?.name}</Text>
                                    <Text>{item?.detector}</Text>
                                    <Text>{item?.detailDescription}</Text>
                                </View>
                                <View style={{ width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 5, height: 5, marginVertical: 2, backgroundColor: 'blue' }}></View>
                                    <View style={{ width: 5, height: 5, marginVertical: 2, backgroundColor: 'blue' }}></View>
                                    <View style={{ width: 5, height: 5, marginVertical: 2, backgroundColor: 'blue' }}></View>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={item => `${item.id}`}
                    contentContainerStyle={{ paddingHorizontal: 5 }}
                />
            )
        }
    }
    const picker = (selectedValue, handleChange, name, value) => {
        console.log(dataCode.reportType)
        let listOption = value.map((value, index) => {
            return (
                <Picker.Item value={value} label={name[index]} />
            )
        })
        return (
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker} selectedValue={selectedValue}
                    onValueChange={(itemValue, itemIndex) =>
                        handleChange(itemValue)
                    }>
                    <Picker.Item value={null} label='All' />
                    {listOption}
                </Picker>
            </View>
        )
    }
    const modalFilter = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Setting</Text>
                        {dataCode.reportStatus ? picker(selectedReportStatus, setSelectReportStatus, Array.from(dataCode?.reportStatus, ({ name }) => name), Array.from(dataCode?.reportStatus, ({ code }) => code)) : <View></View>}
                        {dataCode.reportType ? picker(selectedReportType, setSelectReportType, Array.from(dataCode?.reportType, ({ name }) => name), Array.from(dataCode?.reportType, ({ code }) => code)) : <View></View>}
                        {dataCode.incidentObject ? picker(selectedIncidentObject, setSelectedIncidentObject, Array.from(dataCode?.incidentObject, ({ name }) => name), Array.from(dataCode?.incidentObject, ({ code }) => code)) : <View></View>}
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleFilter}
                        >
                            <Text style={styles.textStyle}>Save</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        )
    }
    let start = {
        date: new Date(startDate).getDate(),
        month: new Date(startDate).getMonth(),
        year: new Date(startDate).getFullYear()
    }
    let end = {
        date: new Date(endDate).getDate(),
        month: new Date(endDate).getMonth(),
        year: new Date(endDate).getFullYear()
    }
    const button = () => {
        return (
            <View style={{ borderRadius: 50, height: 60, width: 60, backgroundColor: 'blue', position: 'absolute', bottom: 5, right: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 35, height: 8, backgroundColor: 'white', borderRadius: 5, position: 'absolute' }}></View>
                <View style={{ width: 8, height: 35, backgroundColor: 'white', borderRadius: 5, position: 'absolute' }}></View>
            </View>
        )
    }
    return (
        <>
            {modalFilter()}
            <View style={styles.container}>
                <View style={styles.topPanel}>
                    <DateRangePicker
                        onChange={handleDatePickerChange}
                        endDate={endDate}
                        startDate={startDate}
                        displayedDate={displayedDate}
                        range
                    >
                        <Text style={styles.datePicker}>{start.date}/{start.month + 1}/{start.year}-{end.date}/{end.month + 1}/{end.year}</Text>
                    </DateRangePicker>
                    <TouchableHighlight style={styles.filterButton} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            Filter
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={{ height: '100%' }}>
                    {list()}
                </View>
                <View style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <ActivityIndicator animating={load} size="small" color="#0000ff" />
                </View>
            </View>
            {button()}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, width: '100%', backgroundColor: 'white'
    },
    topPanel: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10
    },
    card: {
        width: '100%',
        borderRadius: 5,
        borderColor: 'red',
        borderWidth: 0.7,
        padding: 10,
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row'
    },
    datePicker: {
        borderWidth: 0.5,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: 250,
        height: 50,
    },
    picker: {
        width: 210,
        height: 50,
    },
    pickerContainer: {
        borderWidth: 0.5,
        borderRadius: 10,
        marginVertical: 10
    },
    textView: {
        paddingVertical: 10,
        fontWeight: 'bold'
    },
    filterButton: {
        width: 100,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: 'rgb(15, 142, 162)',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: '80%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 10,
        elevation: 2,
        marginVertical: 10,
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
})