"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { checkConnectionStatus } from "../../../store/slices/deviceSlice";
import { useRouter } from "next/navigation";

const TvIcon = ({ style, size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    style={{ color: "black", ...style }}
    {...props}
  >
    <path d="M21,3H3C1.89,3,1,3.89,1,5V17c0,1.1,0.89,1.9,2,1.9h8v2h4v-2h8c1.1,0,1.99-0.9,1.99-2L23,5C23,3.89,22.1,3,21,3z M21,17H3V5h18V17z" />
  </svg>
);

const WifiIcon = ({ style, size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    style={{ color: "black", ...style }}
    {...props}
  >
    <circle cx="12" cy="19" r="1.5" />
    <path d="M12 14.5c-2.49 0-4.5 2.01-4.5 4.5h1.5c0-1.65 1.35-3 3-3s3 1.35 3 3h1.5c0-2.49-2.01-4.5-4.5-4.5z" />
    <path d="M12 10c-4.97 0-9 4.03-9 9h1.5c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5H21c0-4.97-4.03-9-9-9z" />
    <path d="M12 5.5c-7.42 0-13.5 6.08-13.5 13.5H0C0 10.48 5.37 5.5 12 5.5s12 4.98 12 10.5h-1.5c0-7.42-6.08-13.5-13.5-13.5z" />
  </svg>
);

const GlobeIcon = ({ style, size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    style={{ color: "black", ...style }}
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const DeviceCountDisplay = ({ count, style }) => (
  <div
    style={{
      width: "28px",
      height: "20px",
      border: "2px solid black",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      fontWeight: "bold",
      color: "black",
      lineHeight: "1",
      paddingBottom: "1px",
      ...style,
    }}
  >
    {count}
  </div>
);

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 24px 24px 24px",
    backgroundColor: "white",
    minHeight: "100vh",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "black",
    marginBottom: "32px",
    textAlign: "center",
  },
  iconFlowContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  iconInFlow: {
    width: "32px",
    height: "32px",
  },
  dots: {
    fontSize: "1.5rem",
    color: "black",
    fontWeight: "bold",
    lineHeight: "1",
    paddingBottom: "4px",
  },
  yellowBox: {
    backgroundColor: "#FFEE58",
    borderRadius: "12px",
    padding: "20px",
    width: "100%",
    maxWidth: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  },
  yellowBoxTopRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  smallIcon: {
    width: "22px",
    height: "22px",
  },
  daysText: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "black",
  },
  deviceInfoCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  deviceTextContainer: {
    display: "flex",
    flexDirection: "column",
  },
  deviceName: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "black",
    margin: 0,
  },
  deviceMac: {
    fontSize: "0.875rem",
    color: "#6B7280",
    margin: 0,
    wordBreak: "break-all",
  },
  instructionText: {
    fontSize: "1rem",
    color: "#374151",
    textAlign: "center",
    lineHeight: "1.6",
    maxWidth: "340px",
    marginBottom: "24px",
  },
  errorText: {
    color: "#EF4444",
    fontSize: "0.875rem",
    marginTop: "16px",
    textAlign: "center",
  },
};

const ConnectingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const hasConnected = useRef(false);

  const { code, isConnected, error } = useSelector(
    (state: RootState) => state.device
  );

  useEffect(() => {
    if (!code) {
      console.warn("No pairing code found for connection check.");
      return;
    }

    const interval = setInterval(() => {
      if (!hasConnected.current && !error) {
        dispatch(checkConnectionStatus(code));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [dispatch, code, error]);

  useEffect(() => {
    if (isConnected && !hasConnected.current) {
      hasConnected.current = true;
      setTimeout(() => {
        router.push("/mobile/connected");
      }, 1000);
      router.push("/mobile/connected");
    }
  }, [isConnected, router]);

  const displayMac = "[00-00-00-00-00-00]";
  const displayDeviceName = "Device";

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}>Connecting...</h2>

      <div style={styles.iconFlowContainer}>
        <TvIcon style={styles.iconInFlow} />
        <span style={styles.dots}>•••</span>
        <WifiIcon style={styles.iconInFlow} />
        <span style={styles.dots}>•••</span>
        <GlobeIcon style={styles.iconInFlow} />
      </div>

      <div style={styles.yellowBox}>
        <div style={styles.yellowBoxTopRow}>
          <WifiIcon style={styles.smallIcon} />
          <DeviceCountDisplay count="1" style={undefined} />
          <span style={styles.daysText}>30 Days</span>
        </div>
        <div style={styles.deviceInfoCard}>
          <TvIcon style={styles.smallIcon} />
          <div style={styles.deviceTextContainer}>
            <p style={styles.deviceName}>{displayDeviceName}</p>
            <p style={styles.deviceMac}>{displayMac}</p>
          </div>
        </div>
      </div>

      <p style={styles.instructionText}>
        Busy connecting your TV… make sure it is switched on and connected to
        @fibertime
      </p>

      {error && (
        <p style={styles.errorText}>
          {typeof error === "string"
            ? error
            : "Connection failed. Please try again."}
        </p>
      )}
    </div>
  );
};

export default ConnectingPage;
