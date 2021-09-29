import React, { useState } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest, dataRequest, rgConfig } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
import { callMsGraph, callSubs, callRG, callVM } from "./graph";
import Button from "react-bootstrap/Button";
import "./styles/App.css";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

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

const SubsContent = () => {

    const { instance, accounts } = useMsal();
    const [subsData, setSubsData] = useState(null);

    function RequestSubsData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callSubs(response.accessToken).then(response => setSubsData(response));
        });
    }

    return (
        <>
            {subsData ? 
                subsData
                :
                RequestSubsData()
            }
        </>
    );
};

const RGContent = (props) => {
    const { instance, accounts } = useMsal();
    const [rgData, setRGData] = useState(null);

    function RequestRGData() {
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callRG(response.accessToken, rgConfig.rgEndpoint1 + props + rgConfig.rgEndpoint2).then(response => setRGData(response));
        });
    }
    return (
        <>
            {rgData ? 
                rgData
                :
                RequestRGData()
            }
        </>
    );
};

const VMContent = () => {
    const { instance, accounts } = useMsal();
    const [vmData, setVMData] = useState(null);

    function RequestVMData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...dataRequest,
            account: accounts[0]
        }).then((response) => {
            callVM(response.accessToken).then(response => setVMData(response));
        });
    }

    return (
        <>
            {vmData ? 
                vmData
                :
                RequestVMData()
            }
        </>
    );
};

const AllContent = () => {
    let [subscriptionIdState, setSubscriptionIdState] = useState("");

    const ddd1 = SubsContent();
    const ddd2 = RGContent(subscriptionIdState);
    let tableRows1 = Object.entries(ddd1.props.children.value).map((entry, index) => {
        let index1 = entry[1].subscriptionId;
        return (<option key={index} value={index1}>
            {entry[1].displayName}
        </option>)
    });

    // console.log("ddd1", ddd1.props.children.value);
    console.log("ddd2", ddd2);

    return(
        <>
            <span id="subscription-div">
                <select value={subscriptionIdState} onChange={(e)=>{
                    const selectedSubsId = e.target.value;
                    setSubscriptionIdState(selectedSubsId)
                }}>
                    {tableRows1}
                </select>
            </span>
            <span id="resourcegroup-div">
                <select>
                    {/* {tableRows2} */}
                </select>
            </span>
        </>
    );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {    
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
                <hr />
                <AllContent />
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
