import { SetStateAction, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
// import { type } from "os";
import ReactMarkdown from "react-markdown";
// for signature.
import { v4 as uuidv4 } from "uuid";
import { parseEther } from "viem";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ETHSpace: NextPage = () => {
  const [signature, setSignature] = useState("");
  const [content, setContent] = useState("");

  const handleSignMessage = async () => {
    if (typeof window.ethereum !== "undefined") {
      const message = uuidv4(); // Generate a random message
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, account],
        });
        setSignature(signature);
        console.log("Signature:", signature);

        // Now make an API call to authenticate
        const response = await fetch(
          `https://bodhi-data.deno.dev/bodhi_auth?addr=${account}&asset_id=0&msg=${message}&signature=${signature}`,
          {
            method: "GET",
          },
        );
        const responseData = await response.json();

        if (response.ok) {
          console.log("Authentication successful:", responseData);

          // Perform actions based on successful authentication
        } else {
          console.error("Authentication failed:", responseData);
          // Handle authentication failures
        }
        setContent(responseData.result);
      } catch (error) {
        console.error("Error signing message or authenticating:", error);
      }
    } else {
      alert("MetaMask is not installed. Please consider installing it: https://metamask.io/download.html");
    }
  };

  return (
    <div className="container">
      <p>
        <b>Rule:</b> hodl as least 0.001 shares for{" "}
        <a href="https://bodhi.wtf/14020" target="_blank" style={{ color: "blue", textDecoration: "underline" }}>
          space #5
        </a>
      </p>
      <button className="btn" onClick={handleSignMessage}>
        Sign to Login
      </button>
      {content && (
        <div>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default ETHSpace;
