import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest, dataRequest, rgConfig, vmConfig, mtConfig } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { callMsGraph, callSubs, callMT } from "./graph";
import {
    Chart,
    Series,
    ArgumentAxis,
    CommonSeriesSettings,
    CommonAxisSettings,
    Grid,
    Export,
    Legend,
    Margin,
    Tooltip,
    Label,
    Format,
    ChartTitle,
    ValueAxis
  } from "devextreme-react/chart";

import "./styles/App.css";
import moment from "moment";


//프로필 데이터 불러오기
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
        });
    }

    const ProfileData = (props) => {
        let 이름 = props.graphData.displayName
        let 직급 = props.graphData.jobTitle
        let 메일 = props.graphData.mail
        let 핸드폰 = props.graphData.mobilePhone

        function handle() {
            const set = new Set();

            while(true) {
                let num = parseInt(Math.random() * 45) + 1;
                set.add(num);
                if (set.size== 6) {
                    break;
                }
            }
            const arr = [...set]
            arr.sort((a, b) => a - b);
            alert("로또번호는 " + arr[0] + " " + arr[1] + " " + arr[2] + " " + arr[3] + " " + arr[4] + " " + arr[5]);
        }
    
        return (
            <>
            <div className="data-area-div">
            <h1>🎉Welcome {이름} {직급}</h1><p />
                <div id="welcome">
                    <span id="icon" onClick={handle}>📍 </span><span id="userInfo" >User Information</span>
                    <div>Email : <b>{메일}</b></div>
                    <div>mobilePhone : <b>{핸드폰}</b></div>
                </div>
            </div>
            </>
        );
    };

    return (
        <>
        
            {graphData ?
                <ProfileData graphData={graphData} />
                :
                RequestProfileData()
            }
        </>
    );
};

//구독 데이터 불러오기
const SubsContent = () => {

    const { instance, accounts } = useMsal();
    const [subsData, setSubsData] = useState(null);
    let [subscriptionIdState, setSubscriptionIdState] = useState("");

    function RequestSubsData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callSubs(response.accessToken).then(response => setSubsData(response));
        });
    }

    const SubsData = (props) => {
        let tableRows = Object.entries(props.subsData.value).map((entry, index) => {
            index = entry[1].subscriptionId;
            return (<option key={index} value={index}>
                {entry[1].displayName}
            </option>)
        });
    
        return (
            <>
            <span id="subscription-span">
                <select value={subscriptionIdState} onChange={(e) => {
                    const selectedSubsId = e.target.value;
                    setSubscriptionIdState(selectedSubsId);
                } }>
                <option value="" disabled>Select Option</option>
                    {tableRows}
                </select>
            </span>
            {subscriptionIdState && <RGContent name={subscriptionIdState} />}
            </>
        );
    };

    return (
        <>
            {subsData ? 
                <SubsData subsData={subsData} />
                :
                RequestSubsData()
            }
        </>
    );
};

// 리소스그룹 데이터 불러오기
const RGContent = (props) => {
    const { instance, accounts } = useMsal();
    const [rgData, setRGData] = useState(null);
    let [rgNameState, setrgNameState] = useState("");

    function RequestRGData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, rgConfig.rgEndpoint1 + props.name + rgConfig.rgEndpoint2).then(response => setRGData(response));
        });
    }
    
    const RGData = (props) => {
        let tableRowss = Object.entries(props.rgData.value).map((entry, index) => {
            index = entry[1].id;
            return (<option key={index} value={index}>
                {entry[1].name}
            </option>)
        });
    
        return (
            <>
            <span id="resourcegroup-span">
                <select value={rgNameState} onChange={(e) => {
                    const selectedRgName = e.target.value;
                    setrgNameState(selectedRgName);
                } }>
                <option value="" disabled>Select Option</option>
                    {tableRowss}
                
                </select>
            </span>
            {rgNameState && <VMContent name={rgNameState} />}
            </>
        );
    };

    return (
        <>
            {rgData ? 
                <RGData rgData={rgData} />
                :
                RequestRGData()
            }
        </>
    );
};

// 가상머신 데이터 불러오기
const VMContent = (props) => {
    const { instance, accounts } = useMsal();
    const [vmData, setVMData] = useState(null);
    let [vmState, setvmState] = useState("");
    let [timeState, setTimeState] = useState("");
    let [btnState, setBtnState] = useState("btn1");

    function RequestVMData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, vmConfig.vmEndpoint1 + props.name + vmConfig.vmEndpoint2).then(response => setVMData(response));
        });
    }

    const VMData = (props) => {
        let tableRowsss = Object.entries(props.vmData.value).map((entry, index) => {
            index = entry[1].id;
            return (<option key={index} value={index}>
                {entry[1].name}
            </option>)
        });
    
        return (
            <>
            <span id="virtualMachine-span">
                <select value={vmState} onChange={(e) => {
                    const selectedvmName = e.target.value;
                    setvmState(selectedvmName);
                } }>
                <option value="" disabled>Select Option</option>
                    {tableRowsss}
                </select>
            </span>
            <div id="timespan-div">
                <button className="timespan-button" style={btnState === "btn1" ? {background: "skyblue"} : {}} onClick={() => {setTimeState("&timespan=PT1H"), setBtnState("btn1")}}>1 hour</button>
                <button className="timespan-button" style={btnState === "btn2" ? {background: "skyblue"} : {}} onClick={() => {setTimeState("&timespan=PT6H&interval=PT5M"), setBtnState("btn2")}}>6 hour</button>
                <button className="timespan-button" style={btnState === "btn3" ? {background: "skyblue"} : {}} onClick={() => {setTimeState("&timespan=PT12H&interval=PT5M"), setBtnState("btn3")}}>12 hour</button>
                <button className="timespan-button" style={btnState === "btn4" ? {background: "skyblue"} : {}} onClick={() => {setTimeState("&timespan=P1D&interval=PT30M"), setBtnState("btn4")}}>1 day</button>
                <button className="timespan-button" style={btnState === "btn5" ? {background: "skyblue"} : {}} onClick={() => {setTimeState("&timespan=P7D&interval=PT6H"), setBtnState("btn5")}}>7 day</button>
                <button className="timespan-button" style={btnState === "btn6" ? {background: "skyblue"} : {}} onClick={() => {setTimeState("&timespan=P30D&interval=P1D"), setBtnState("btn6")}}>30 day</button>
            </div>
            <div id="chart-div">
                {vmState && <CPUContent name={vmState} time={timeState}/>}
                {vmState && <NetworkContent name={vmState} time={timeState}/>}
                {vmState && <DiskContent name={vmState} time={timeState}/>}
                {vmState && <DiskOperationContent name={vmState} time={timeState}/>}
                {vmState && <MemoryContent name={vmState} time={timeState}/>}
            </div>
            </>
        );
    };

    return (
        <>
            {vmData ? 
                <VMData vmData={vmData} />
                :
                RequestVMData()
            }
        </>
    );
};

// 가상머신 CPU 데이터 불러오기
const CPUContent = (props) => {
    const { instance, accounts } = useMsal();
    const [cpuData, setCPUData] = useState(null);
    
    //CPU 데이터 요청
    function RequestCPUData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointCPU + props.time).then(response => setCPUData(response));
        });
    }
    
    //CPU 데이터 가공 및 출력
    const CPUData = (props) => {
        const architectureSources = [
            { value: 'average', name: 'Percentage CPU (Avg)' },
          ];
        const cpuDataAll = props.cpuData.value[0].timeseries[0].data;

        const result = cpuDataAll.map(function (item) {
            return {
                "timeStamp" : moment(item.timeStamp).format("DD일 HH:mm"), 
                "average" : Number(Number(item.average).toFixed(4))
            };       
        })

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Vintage"
                dataSource={result}
            >
            <ChartTitle text="⚙ CPU (Avarage)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={false} />
            </CommonAxisSettings>
            {architectureSources.map(function (item) {
                return (
                <Series
                    key={item.value}
                    valueField={item.value}
                    name={item.name}
                />
                );
            })}
            <Margin bottom={20} />
            <ArgumentAxis allowDecimals={false} axisDivisionFactor={60}>
                <Label>
                <Format type="decimal" />
                </Label>
            </ArgumentAxis>
            <Legend verticalAlignment="top" horizontalAlignment="right" />
            <Export enabled={true} fileName="CPU" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };
    return (
        <>
            {cpuData ? <CPUData cpuData={cpuData} />:RequestCPUData()}
        </>
    );
};

// 가상머신 네트워크 데이터 불러오기
const NetworkContent = (props) => {
    const { instance, accounts } = useMsal();
    const [netInData, setnetInData] = useState(null);
    const [netOutData, setnetOutData] = useState(null);

    //네트워크 IN 데이터 요청
    function RequestNetInData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointNetworkIn + props.time).then(response => setnetInData(response));
        });
    }
    //네트워크 OUT 데이터 요청
    function RequestNetOutData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointNetworkOut + props.time).then(response => setnetOutData(response));
        });
    }
    
    //네트워크 데이터 가공 및 출력
    const NetworkData = (props) => {
        const architectureSources = [
            { value: 'networkIn', name: 'Network In Total (Sum)' },
            { value: 'networkOut', name: 'Network Out Total (Sum)' }
          ];
        const networkInDataAll = props.netInData.value[0].timeseries[0].data;
        const networkOutDataAll = props.netOutData.value[0].timeseries[0].data;

        const result = networkInDataAll.map((item, index) =>{

            return {
                "timeStamp" : moment(item.timeStamp).format("DD일 HH:mm"), 
                "networkIn" : Number((item.total / 1000).toFixed(2)),
                "networkOut" : Number((networkOutDataAll[index].total / 1000).toFixed(2))
            };
        })

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Ocean"
                dataSource={result}
            >
            <ChartTitle text="⚙ Network (Total)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={false} />
            </CommonAxisSettings>
            {architectureSources.map(function (item) {
                return (
                <Series
                    key={item.value}
                    valueField={item.value}
                    name={item.name}
                />
                );
            })}
            <Margin bottom={20} />
            <ArgumentAxis allowDecimals={false} axisDivisionFactor={60}>
                <Label>
                <Format type="decimal" />
                </Label>
            </ArgumentAxis>
            <Legend verticalAlignment="top" horizontalAlignment="right" />
            <Export enabled={true} fileName="Network" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    return (
        <>
            {netInData ? 
                netOutData ? 
                    <NetworkData netInData={netInData} netOutData={netOutData}/>
                    :RequestNetOutData() 
                :RequestNetInData()}
        </>
    );
};

// 가상머신 디스크 데이터 불러오기
const DiskContent = (props) => {
    const { instance, accounts } = useMsal();
    const [diskReadData, setDiskReadData] = useState(null);
    const [diskWriteData, setDiskWriteData] = useState(null);

    //디스크 Read 데이터 요청
    function RequestDiskReadData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointDiskRead + props.time).then(response => setDiskReadData(response));
        });
    }
    //디스크 Write 데이터 요청
    function RequestDiskWriteData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointDiskWrite + props.time).then(response => setDiskWriteData(response));
        });
    }
    
    //디스크 데이터 가공 및 출력
    const DiskData = (props) => {
        const architectureSources = [
            { value: 'diskRead', name: 'Disk Read Bytes (Sum)' },
            { value: 'diskWrite', name: 'Disk Write Bytes (Sum)' }
          ];
        const diskReadDataAll = props.diskReadData.value[0].timeseries[0].data;
        const diskWriteDataAll = props.diskWriteData.value[0].timeseries[0].data;

        const result = diskReadDataAll.map((item, index) =>{

            return {
                "timeStamp" : moment(item.timeStamp).format("DD일 HH:mm"), 
                "diskRead" : Number((item.total / 1000000).toFixed(2)),       
                "diskWrite" : Number((diskWriteDataAll[index].total / 1000000).toFixed(2))
            };
        })

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Office"  
                dataSource={result}
            >
            <ChartTitle text="⚙ Disk bytes (Total)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>  
                <Grid visible={false} />
            </CommonAxisSettings>
            {architectureSources.map(function (item) {
                return (
                <Series
                    key={item.value}
                    valueField={item.value}
                    name={item.name}
                />
                );
            })}
            <Margin bottom={20} />
            <ArgumentAxis allowDecimals={false} axisDivisionFactor={60}>
                <Label>
                <Format type="decimal" />
                </Label>
            </ArgumentAxis>
            <Legend verticalAlignment="top" horizontalAlignment="right" />
            <Export enabled={true} fileName="Disk_bytes" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    return (
        <>
            {diskReadData ? 
                diskWriteData ? 
                    <DiskData diskReadData={diskReadData} diskWriteData={diskWriteData}/>
                    :RequestDiskWriteData() 
                :RequestDiskReadData()}
        </>
    );
};

// 가상머신 디스크 작업 데이터 불러오기
const DiskOperationContent = (props) => {
    const { instance, accounts } = useMsal();
    const [diskReadOperationData, setDiskReadOperationData] = useState(null);
    const [diskWriteOperationData, setDiskWriteOperationData] = useState(null);

    //디스크 작업 Read 데이터 요청
    function RequestDiskReadOperationData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointDiskReadOperation + props.time).then(response => setDiskReadOperationData(response));
        });
    }
    //디스크 작업 Write 데이터 요청
    function RequestDiskWriteOperationData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointDiskWriteOperation + props.time).then(response => setDiskWriteOperationData(response));
        });
    }
    
    //디스크 작업 데이터 가공 및 출력
    const DiskOperationData = (props) => {
        const architectureSources = [
            { value: 'diskReadOperation', name: 'Disk Read Operations/Sec (Avg)' },
            { value: 'diskWriteOperation', name: 'Disk Write Operations/Sec (Avg)' }
          ];
        const diskReadOperationDataAll = props.diskReadOperationData.value[0].timeseries[0].data;
        const diskWriteOperationDataAll = props.diskWriteOperationData.value[0].timeseries[0].data;

        const result = diskReadOperationDataAll.map((item, index) =>{

            return {
                "timeStamp" : moment(item.timeStamp).format("DD일 HH:mm"), 
                "diskReadOperation" : Number(Number(item.average).toFixed(2)),
                "diskWriteOperation" : Number(Number(diskWriteOperationDataAll[index].average).toFixed(2))
            };
        })

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Carmine"
                dataSource={result}
            >
            <ChartTitle text="⚙ Disk Operations/sec (Average)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={false} />
            </CommonAxisSettings>
            {architectureSources.map(function (item) {
                return (
                <Series
                    key={item.value}
                    valueField={item.value}
                    name={item.name}
                />
                );
            })}
            <Margin bottom={20} />
            <ArgumentAxis allowDecimals={false} axisDivisionFactor={60}>
                <Label>
                <Format type="decimal" />
                </Label>
            </ArgumentAxis>
            <Legend verticalAlignment="top" horizontalAlignment="right" />
            <Export enabled={true} fileName="Disk_Operations/sec" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    return (
        <>
            {diskReadOperationData ? 
                diskWriteOperationData ? 
                    <DiskOperationData diskReadOperationData={diskReadOperationData} diskWriteOperationData={diskWriteOperationData}/>
                    :RequestDiskWriteOperationData() 
                :RequestDiskReadOperationData()}
        </>
    );
};

// 가상머신 메모리 데이터 불러오기
const MemoryContent = (props) => {
    const { instance, accounts } = useMsal();
    const [memoryData, setMemoryData] = useState(null);
    
    //메모리 데이터 요청
    function RequestMemoryData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callMT(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointMemory + props.time).then(response => setMemoryData(response));
        });
    }
    
    //메모리 데이터 가공 및 출력
    const MemoryData = (props) => {
        const architectureSources = [
            { value: 'average', name: 'Available Memory Bytes (Avg)' },
          ];
        const memoryDataAll = props.memoryData.value[0].timeseries[0].data;

        const result = memoryDataAll.map(function (item) {
            return {
                "timeStamp" : moment(item.timeStamp).format("DD일 HH:mm"), 
                "average" : Number((item.average / 1000000000).toFixed(2))
            };       
        })

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Violet"
                dataSource={result}
            >
            <ValueAxis showZero={true} />
            <ChartTitle text="⚙ Available Memory Bytes (Avarage)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={false} />
            </CommonAxisSettings>
            {architectureSources.map(function (item) {
                return (
                <Series
                    key={item.value}
                    valueField={item.value}
                    name={item.name}
                />
                );
            })}
            <Margin bottom={20} />
            <ArgumentAxis allowDecimals={false} axisDivisionFactor={60}>
                <Label>
                <Format type="decimal" />
                </Label>
            </ArgumentAxis>
            <Legend verticalAlignment="top" horizontalAlignment="right" />
            <Export enabled={true} fileName="Available_Memory_Bytes" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    return (
        <>
            {memoryData ? <MemoryData memoryData={memoryData} />:RequestMemoryData()}
        </>
    );
};


const MainContent = () => {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
                <hr />
                <SubsContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default function App() {
    return (
        <PageLayout>
            <MainContent />
        </PageLayout>
    );
}
