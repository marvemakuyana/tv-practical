"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  setPhoneNumber,
  requestOtp,
  login,
} from "../../../store/slices/authSlice";
import { useRouter } from "next/navigation";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "40px 24px 24px 24px",
    backgroundColor: "white",
    minHeight: "100vh",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    boxSizing: "border-box",
    maxWidth: "420px",
    margin: "0 auto",
  },
  logo: {
    fontSize: "1.875rem",
    fontWeight: 600,
    color: "black",
    textAlign: "left",
    marginBottom: "32px",
    alignSelf: "flex-start",
    lineHeight: 1,
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
    marginBottom: "24px",
    alignSelf: "flex-start",
    lineHeight: "1.3",
  },
  label: {
    fontSize: "0.875rem",
    color: "#4B5563",
    marginBottom: "8px",
    alignSelf: "flex-start",
  },
  phoneInputWrapper: {
    display: "flex",
    width: "100%",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    marginBottom: "24px",
    overflow: "hidden",
  },
  countrySelect: {
    padding: "12px 10px 12px 12px",
    border: "none",
    borderRight: "1px solid #D1D5DB",
    backgroundColor: "white",
    fontSize: "1rem",
    color: "#1F2937",
    cursor: "pointer",
    minWidth: "90px",
    flexShrink: 0,
  },
  phoneInput: {
    flexGrow: 1,
    padding: "12px 12px",
    border: "none",
    backgroundColor: "white",
    fontSize: "1rem",
    color: "#1F2937",
    outline: "none",
  },
  nextButton: {
    width: "100%",
    padding: "14px 20px",
    backgroundColor: "#FFEE58",
    color: "black",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
    transition: "background-color 0.2s, opacity 0.2s",
  },
  nextButtonDisabled: {
    backgroundColor: "#FFF9C4",
    color: "#A1887F",
    cursor: "not-allowed",
  },
  errorText: {
    color: "#EF4444",
    fontSize: "0.875rem",
    marginTop: "16px",
    textAlign: "center",
  },
};

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { phoneNumber, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [countryCode, setCountryCode] = useState("+27");
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPhoneNumber(e.target.value.replace(/\D/g, "")));
  };

  const handleLoginFlow = async () => {
    if (loading || !phoneNumber) return;
    try {
      const otp = await dispatch(
        requestOtp(countryCode + phoneNumber)
      ).unwrap();

      await dispatch(
        login({ phone: countryCode + phoneNumber, otp: otp as string })
      ).unwrap();

      router.push("/mobile/pairing");
    } catch (err) {
      console.error("Login flow failed:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.logo}>fibertime</h1>
      <h2 style={styles.title}>Log in to connect to WiFi</h2>

      <p style={styles.label}>Enter your phone number below:</p>
      <div style={styles.phoneInputWrapper}>
        <select
          style={styles.countrySelect}
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="+27">🇿🇦 +27</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+91">🇮🇳 +91</option>
        </select>
        <input
          type="tel"
          style={styles.phoneInput}
          placeholder="82 345 6789"
          value={phoneNumber}
          onChange={handlePhoneChange}
          inputMode="tel"
        />
      </div>

      <button
        style={{
          ...styles.nextButton,
          ...(loading || !phoneNumber ? styles.nextButtonDisabled : {}),
        }}
        onClick={handleLoginFlow}
        disabled={loading || !phoneNumber}
      >
        {loading ? "Processing..." : "Next"}
      </button>

      {error && (
        <p style={styles.errorText}>
          {typeof error === "string" ? error : "An unknown error occurred"}
        </p>
      )}
    </div>
  );
};

export default LoginPage;
