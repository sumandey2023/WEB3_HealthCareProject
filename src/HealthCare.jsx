import { useEffect, useState } from "react";
import "./App.css";
import { ethers, BrowserProvider } from "ethers";
const HealthCare = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [currentAccountAddress, setCurrentAccountAddress] = useState("");
  const [authorizeUser, setAuthorizeUser] = useState("");
  const [smartContract, setSmartContract] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [patientId, setPatientId] = useState();
  const [patientName, setpatientName] = useState("");
  const [patientDiagnosis, setpatientDiagnosis] = useState("");
  const [patientTreatment, setpatientTreatment] = useState("");
  const [CurrentPatientId, setCurrentPatientId] = useState();
  const [allRecord, setAllRecord] = useState([]);
  const contractAddress = "0x9ef3517f1e3d656e167242e95d7924fc7b132ce5";
  const contractABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "patientID",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_patient_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_diagnosis",
          type: "string",
        },
        {
          internalType: "string",
          name: "_treatment",
          type: "string",
        },
      ],
      name: "addPatientRecord",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "provider",
          type: "address",
        },
      ],
      name: "authorizeTheProvider",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "authorizedUser",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_patient_id",
          type: "uint256",
        },
      ],
      name: "fetchAllRecords",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "record_id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "patient_name",
              type: "string",
            },
            {
              internalType: "string",
              name: "diagnosis",
              type: "string",
            },
            {
              internalType: "string",
              name: "treatment",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          internalType: "struct HealthCareSystem.Record[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "patientRecords",
      outputs: [
        {
          internalType: "uint256",
          name: "record_id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "patient_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "diagnosis",
          type: "string",
        },
        {
          internalType: "string",
          name: "treatment",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  useEffect(() => {
    const connectWallet = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const accountAddress = await signer.getAddress();
      setCurrentAccountAddress(accountAddress);

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setSmartContract(contract);
      const owner = await contract.getOwner();
      setIsOwner(accountAddress.toLowerCase() === owner.toLowerCase());
    };
    connectWallet();
  }, []);

  const authorizeProvider = async () => {
    try {
      const authorizedPerson = await smartContract.authorizeTheProvider(
        authorizeUser
      );
      setAuthorizeUser("");
    } catch (error) {
      console.error("Error authorizing provider:", error);
    }
  };

  const addRecords = async () => {
    try {
      const patientInfo = await smartContract.addPatientRecord(
        patientId,
        patientName,
        patientDiagnosis,
        patientTreatment
      );
      setPatientId("");
      setpatientName("");
      setpatientDiagnosis("");
      setpatientTreatment("");
    } catch (error) {
      console.log("Record add error", error);
    }
  };

  const fetchPatientRecords = async () => {
    try {
      const data = await smartContract.fetchAllRecords(CurrentPatientId);
      setAllRecord(data);
      console.log("Fetched Records:", data);
      setCurrentPatientId("");
    } catch (error) {
      console.log("Record fetch error", error);
    }
  };
  return (
    <div className="container">
      <h1 className="title">HealthCare Application</h1>
      {currentAccountAddress && (
        <p className="account-info">
          Connected Account: {currentAccountAddress}
          <button
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(currentAccountAddress);
              setShowCopied(true);
              setTimeout(() => setShowCopied(false), 2000);
            }}
            title="Copy Address"
          >
            {showCopied ? "Copied! ✓" : "📋"}
          </button>
        </p>
      )}
      {isOwner && <p className="owner-info">You are the contract owner</p>}

      <div className="form-section">
        <h2>Fetch Patient Records</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Enter Patient ID"
          value={CurrentPatientId}
          onChange={(e) => setCurrentPatientId(e.target.value)}
        />
        <button className="action-button" onClick={fetchPatientRecords}>
          Fetch Records
        </button>
      </div>

      <div className="form-section">
        <h2>Add Patient Record</h2>
        <input
          className="input-field"
          type="text"
          placeholder="pateint ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="pateint name"
          value={patientName}
          onChange={(e) => setpatientName(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Diagnosis"
          value={patientDiagnosis}
          onChange={(e) => setpatientDiagnosis(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Treatment"
          value={patientTreatment}
          onChange={(e) => setpatientTreatment(e.target.value)}
        />
        <button className="action-button" onClick={addRecords}>
          Add Records
        </button>
      </div>
      <div className="form-section">
        <h2>Authorize HealthCare Provider</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Provider Address"
          value={authorizeUser}
          onChange={(e) => setAuthorizeUser(e.target.value)}
        />
        <button className="action-button" onClick={authorizeProvider}>
          Authorize Provider
        </button>
      </div>

      {allRecord.length > 0 && (
        <div className="records-section">
          <h2>Patient Records</h2>
          {allRecord.map((record, index) => (
            <div key={index}>
              <p>Record #{record.record_id.toString()}</p>
              <p>
                <strong>Patient:</strong> {record.patient_name}
              </p>
              <p>
                <strong>Diagnosis:</strong> {record.diagnosis}
              </p>
              <p>
                <strong>Treatment:</strong> {record.treatment}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(Number(record.timestamp) * 1000).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(Number(record.timestamp) * 1000).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthCare;
