"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchUserBundle } from "../../../store/slices/deviceSlice";

const TvIcon = ({ style, size = 24, color = "black", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
    style={style}
    {...props}
  >
    <path d="M21,3H3C1.89,3,1,3.89,1,5V17c0,1.1,0.89,1.9,2,1.9h8v2h4v-2h8c1.1,0,1.99-0.9,1.99-2L23,5C23,3.89,22.1,3,21,3z M21,17H3V5h18V17z" />
  </svg>
);

const WifiIcon = ({ style, size = 24, color = "black", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
    style={style}
    {...props}
  >
    <circle cx="12" cy="19" r="1.5" />
    <path d="M12 14.5c-2.49 0-4.5 2.01-4.5 4.5h1.5c0-1.65 1.35-3 3-3s3 1.35 3 3h1.5c0-2.49-2.01-4.5-4.5-4.5z" />
    <path d="M12 10c-4.97 0-9 4.03-9 9h1.5c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5H21c0-4.97-4.03-9-9-9z" />
    <path d="M12 5.5c-7.42 0-13.5 6.08-13.5 13.5H0C0 10.48 5.37 5.5 12 5.5s12 4.98 12 10.5h-1.5c0-7.42-6.08-13.5-13.5-13.5z" />
  </svg>
);

const GlobeIcon = ({ style, size = 24, color = "black", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
    style={style}
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const CheckDotIcon = ({ style, size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    {...props}
  >
    <circle cx="12" cy="12" r="7" fill="#4CAF50" />
    <path
      d="M9.5 12.5L11 14L14.5 10.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />{" "}
    <circle cx="19" cy="12" r="2" fill="black" />
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
      backgroundColor: "transparent",
      ...style,
    }}
  >
    {count}
  </div>
);

const formatExpiryDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const time = date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${time} ${day}/${month}/${year}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

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
    marginBottom: "24px",
    textAlign: "center",
  },
  iconFlowContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "24px",
  },
  iconInFlow: {
    width: "32px",
    height: "32px",
  },
  checkDotIconInFlow: {
    width: "28px",
    height: "28px",
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
    marginBottom: "32px",
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
  remainingTimeText: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "black",
    margin: "4px 0 2px 0",
    lineHeight: 1.2,
  },
  expiresAtText: {
    fontSize: "0.875rem",
    color: "black",
    margin: "0 0 8px 0",
    position: "relative",
    paddingBottom: "6px",
  },
  expiryLine: {
    position: "absolute",
    bottom: "0px",
    left: "0",
    height: "2px",
    width: "calc(100% - 6px)",
    backgroundColor: "black",
  },
  expiryDot: {
    position: "absolute",
    bottom: "-2px",
    right: "0",
    width: "6px",
    height: "6px",
    backgroundColor: "black",
    borderRadius: "50%",
  },
  footerTextContainer: {
    textAlign: "center",
    maxWidth: "340px",
  },
  footerTextLine1: {
    fontSize: "1rem",
    color: "#374151",
    lineHeight: "1.6",
    marginBottom: "4px",
  },
  footerTextLine2: {
    fontSize: "1rem",
    color: "black",
    fontWeight: "bold",
    lineHeight: "1.6",
  },
  loadingErrorText: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#374151",
    marginTop: "20px",
  },
};

const ConnectedPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { device, loading, error } = useSelector(
    (state: RootState) => state.device
  );

  useEffect(() => {
    if (device?.code && !device.bundleInfo) {
      dispatch(fetchUserBundle(device.code));
    }
  }, [device?.code, device?.bundleInfo, dispatch]);

  if (loading && !device?.bundleInfo)
    return <p style={styles.loadingErrorText}>Loading bundle info...</p>;
  if (error && !device?.bundleInfo)
    return (
      <p style={{ ...styles.loadingErrorText, color: "red" }}>
        Error:{" "}
        {typeof error === "string" ? error : "Failed to load bundle info."}
      </p>
    );

  const displayMac = "[00-00-00-00-00-00]";
  const displayDeviceName = "Device";
  const bundleInfo = device?.bundleInfo;
  let expiresAtFormatted = "N/A";
  const now = new Date();
  const expiryDate = new Date(now.getTime());

  if (bundleInfo?.days != null && bundleInfo?.hours != null) {
    expiryDate.setDate(expiryDate.getDate() + bundleInfo.days);
    expiryDate.setHours(expiryDate.getHours() + bundleInfo.hours);
    expiryDate.setMinutes(now.getMinutes());

    expiresAtFormatted = formatExpiryDate(expiryDate);
  }

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}>Connected!</h2>

      <div style={styles.iconFlowContainer}>
        <TvIcon style={styles.iconInFlow} />
        <CheckDotIcon style={styles.checkDotIconInFlow} />
        <WifiIcon style={styles.iconInFlow} />
        <CheckDotIcon style={styles.checkDotIconInFlow} />
        <GlobeIcon style={styles.iconInFlow} />
      </div>

      <div style={styles.yellowBox}>
        <div style={styles.yellowBoxTopRow}>
          <WifiIcon style={{ ...styles.smallIcon, color: "#374151" }} />{" "}
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

        {bundleInfo ? (
          <>
            <p style={styles.remainingTimeText}>
              {bundleInfo.days} days {bundleInfo.hours} hours...
            </p>
            <div style={styles.expiresAtText}>
              expires at {expiresAtFormatted}
              <span style={styles.expiryLine}></span>
              <span style={styles.expiryDot}></span>
            </div>
          </>
        ) : (
          <>
            <p style={styles.remainingTimeText}>29 days 23 hours...</p>
            <div style={styles.expiresAtText}>
              expires at {formatExpiryDate(expiryDate.toISOString())}{" "}
              <span style={styles.expiryLine}></span>
              <span style={styles.expiryDot}></span>
            </div>
          </>
        )}
        {error && device?.bundleInfo && (
          <p
            style={{
              color: "red",
              fontSize: "0.8rem",
              textAlign: "center",
              marginTop: "-10px",
              marginBottom: "5px",
            }}
          >
            Couldn&apos;t update bundle info.
          </p>
        )}
      </div>

      <div style={styles.footerTextContainer}>
        <p style={styles.footerTextLine1}>
          Check your active bundles by WhatsApping us on
        </p>
        <p style={styles.footerTextLine2}>000 000 0000</p>
      </div>
    </div>
  );
};

export default ConnectedPage;
