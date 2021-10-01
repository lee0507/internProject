import React, { useState, useEffect } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest, dataRequest, rgConfig, vmConfig, mtConfig } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { callMsGraph, callSubs, callRG, callVM } from "./graph";
import Button from 'devextreme-react/button';
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
    ChartTitle
  } from "devextreme-react/chart";

import "./styles/App.css";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

//프로필 데이터 불러오기
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    
    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
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
        console.log(props)
    
        return (
            <>
            <div className="data-area-div">
            <h1>Welcome {이름} {직급}</h1>
                <div>📍 User Information</div>
                <div>Email : {메일}</div>
                <div>mobilePhone : {핸드폰}</div>
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
            <span id="subscription-div">
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
            callRG(response.accessToken, rgConfig.rgEndpoint1 + props.name + rgConfig.rgEndpoint2).then(response => setRGData(response));
        });
    }
    
    const RGData = (props) => {
        let tableRowss = Object.entries(props.rgData.value).map((entry, index) => {
            index = entry[1].id;
            return (<option key={index} value={index}>
                {entry[1].name}
            </option>)
        });
        console.log("bbb", tableRowss);
    
        return (
            <>
            <span id="resourcegroup-div">
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

    function RequestVMData() {
        
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callVM(response.accessToken, vmConfig.vmEndpoint1 + props.name + vmConfig.vmEndpoint2).then(response => setVMData(response));
        });
    }

    const VMData = (props) => {
        let tableRowsss = Object.entries(props.vmData.value).map((entry, index) => {
            index = entry[1].id;
            return (<option key={index} value={index}>
                {entry[1].name}
            </option>)
        });
        console.log("ccc", tableRowsss);
    
        return (
            <>
            <span id="virtualMachine-div">
                <select value={vmState} onChange={(e) => {
                    const selectedvmName = e.target.value;
                    setvmState(selectedvmName);
                } }>
                <option value="" disabled>Select Option</option>
                    {tableRowsss}
                
                </select>
            </span>
            {vmState && <CPUContent name={vmState} />}
            {vmState && <NetworkContent name={vmState} />}
            {vmState && <DiskContent name={vmState} />}
            {vmState && <DiskOperationContent name={vmState} />}
            {vmState && <MemoryContent name={vmState} />}
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
            callVM(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointCPU).then(response => setCPUData(response));
        });
    }
    
    //CPU 데이터 가공 및 출력
    const CPUData = (props) => {
        const architectureSources = [
            { value: 'average', name: 'Average' },
          ];
        const cpuDataAll = props.cpuData.value[0].timeseries[0].data;

        const result = cpuDataAll.map(function (item) {
            return {
                "timeStamp" : item.timeStamp.slice(11, -4), 
                "average" : item.average
            };       
        })
        console.log("aaaa", result);

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Violet"
                dataSource={result}
            >
            <ChartTitle text="⚙ CPU (Avarage)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={true} />
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
            <Export enabled={true} fileName="lee" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    useEffect(() => {
        return () => setCPUData(false);
      }, []);
    
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
            callVM(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointNetworkIn).then(response => setnetInData(response));
        });
    }
    //네트워크 OUT 데이터 요청
    function RequestNetOutData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callVM(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointNetworkOut).then(response => setnetOutData(response));
        });
    }
    
    //네트워크 데이터 가공 및 출력
    const NetworkData = (props) => {
        const architectureSources = [
            { value: 'networkIn', name: 'NetworkIn' },
            { value: 'networkOut', name: 'NetworkOut' }
          ];
        const networkInDataAll = props.netInData.value[0].timeseries[0].data;
        const networkOutDataAll = props.netOutData.value[0].timeseries[0].data;

        const result = networkInDataAll.map((item, index) =>{

            return {
                "timeStamp" : item.timeStamp.slice(11, -4), 
                "networkIn" : item.total,
                "networkOut" : networkOutDataAll[index].total
            };
        })

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Violet"
                dataSource={result}
            >
            <ChartTitle text="⚙ Network (Total)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={true} />
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
            <Export enabled={true} fileName="lee" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    useEffect(() => {
        return () => setnetInData(false);
      }, []);

    useEffect(() => {
        return () => setnetOutData(false);
      }, []);

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
            callVM(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointDiskRead).then(response => setDiskReadData(response));
        });
    }
    //디스크 Write 데이터 요청
    function RequestDiskWriteData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callVM(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointDiskWrite).then(response => setDiskWriteData(response));
        });
    }
    
    //디스크 데이터 가공 및 출력
    const DiskData = (props) => {
        const architectureSources = [
            { value: 'diskRead', name: 'DiskRead' },
            { value: 'diskWrite', name: 'DiskWrite' }
          ];
        const diskReadDataAll = props.diskReadData.value[0].timeseries[0].data;
        const diskWriteDataAll = props.diskWriteData.value[0].timeseries[0].data;

        const result = diskReadDataAll.map((item, index) =>{

            return {
                "timeStamp" : item.timeStamp.slice(11, -4), 
                "diskRead" : item.total,
                "diskWrite" : diskWriteDataAll[index].total
            };
        })

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Violet"
                dataSource={result}
            >
            <ChartTitle text="⚙ Disk (Total)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={true} />
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
            <Export enabled={true} fileName="lee" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    useEffect(() => {
        return () => setDiskReadData(false);
      }, []);

    useEffect(() => {
        return () => setDiskWriteData(false);
      }, []);

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
            callVM(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointDiskReadOperation).then(response => setDiskReadOperationData(response));
        });
    }
    //디스크 작업 Write 데이터 요청
    function RequestDiskWriteOperationData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callVM(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointDiskWriteOperation).then(response => setDiskWriteOperationData(response));
        });
    }
    
    //디스크 작업 데이터 가공 및 출력
    const DiskOperationData = (props) => {
        const architectureSources = [
            { value: 'diskReadOperation', name: 'DiskReadOperation' },
            { value: 'diskWriteOperation', name: 'DiskWriteOperation' }
          ];
        const diskReadOperationDataAll = props.diskReadOperationData.value[0].timeseries[0].data;
        const diskWriteOperationDataAll = props.diskWriteOperationData.value[0].timeseries[0].data;

        const result = diskReadOperationDataAll.map((item, index) =>{

            return {
                "timeStamp" : item.timeStamp.slice(11, -4), 
                "diskReadOperation" : item.average,
                "diskWriteOperation" : diskWriteOperationDataAll[index].average
            };
        })

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Violet"
                dataSource={result}
            >
            <ChartTitle text="⚙ Disk Operation (Average)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={true} />
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
            <Export enabled={true} fileName="lee" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    useEffect(() => {
        return () => setDiskReadOperationData(false);
      }, []);

    useEffect(() => {
        return () => setDiskWriteOperationData(false);
      }, []);

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
            callVM(response.accessToken, mtConfig.mtEndpoint1 + props.name + mtConfig.mtEndpointMemory).then(response => setMemoryData(response));
        });
    }
    
    //메모리 데이터 가공 및 출력
    const MemoryData = (props) => {
        const architectureSources = [
            { value: 'average', name: 'Average' },
          ];
        const memoryDataAll = props.memoryData.value[0].timeseries[0].data;
        console.log("memoryDataAll", memoryDataAll)
        const result = memoryDataAll.map(function (item) {
            return {
                "timeStamp" : item.timeStamp.slice(11, -4), 
                "average" : (item.average / 1000000000).toFixed(2)
            };       
        })
        console.log("aaaa", result);

        return (
        <React.Fragment>
            <hr />
            <Chart
                palette="Violet"
                dataSource={result}
            >
            <ChartTitle text="⚙ Memory (Avarage)" />
            <CommonSeriesSettings argumentField="timeStamp" type="spline" />
            <CommonAxisSettings>
                <Grid visible={true} />
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
            <Export enabled={true} fileName="lee" />
            <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
        );
    };

    useEffect(() => {
        return () => setMemoryData(false);
      }, []);
    
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
