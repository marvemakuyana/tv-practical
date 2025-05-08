"use client";

import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { setCode, connectDevice } from "../../../store/slices/deviceSlice";
import { useRouter } from "next/navigation";

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "white",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    boxSizing: "border-box",
    padding: "24px",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: "12px",
    padding: "32px 24px",
    textAlign: "center",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "black",
    marginBottom: "24px",
    lineHeight: "1.4",
    maxWidth: "300px",
  },
  codeInputWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    cursor: "text",
  },
  codeBox: {
    width: "60px",
    height: "70px",
    backgroundColor: "#FFEE58",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "black",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: "1px",
    height: "1px",
    border: "none",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0px, 0px, 0px, 0px)",
    whiteSpace: "nowrap",
  },
  helpLink: {
    fontSize: "0.875rem",
    color: "#6B7280",
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: "8px 0 0 0",
    fontFamily: "inherit",
  },
  backButtonContainer: {
    width: "100%",
    maxWidth: "380px",
    marginTop: "auto",
    paddingTop: "24px",
    paddingBottom: "16px",
  },
  backButton: {
    width: "100%",
    padding: "12px 20px",
    backgroundColor: "white",
    color: "black",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "center",
  },
  errorText: {
    color: "#EF4444",
    fontSize: "0.875rem",
    marginTop: "16px",
    textAlign: "center",
  },
};

const PairingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { code, loading, error } = useSelector(
    (state: RootState) => state.device
  );
  const phone = useSelector((state: RootState) => state.auth.user?.phone);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 4) {
      dispatch(setCode(value));
    }
  };

  useEffect(() => {
    const tryConnect = async () => {
      try {
        await dispatch(connectDevice({ code, phone })).unwrap();
        setHasAttempted(true);
        router.push("/mobile/connecting");
      } catch (err) {
        console.error("Pairing failed:", err);
      }
    };

    if (code.length === 4 && !loading && !error && !hasAttempted) {
      tryConnect();
    }
  }, [code, loading, error, dispatch, router, phone, hasAttempted]);

  const handleBack = () => {
    router.back();
  };

  const handleHelp = () => {
    console.log("Help link clicked");
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const displayChars = Array.from({ length: 4 }).map(
    (_, index) => code[index] || "0"
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 id="pairing-title" style={styles.title}>
          Enter the four digit code on the TV or device screen
        </h1>

        <div
          style={styles.codeInputWrapper}
          onClick={focusInput}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") focusInput();
          }}
          aria-label="Enter pairing code. Focuses code input."
        >
          {displayChars.map((char, index) => (
            <div key={index} style={styles.codeBox} aria-hidden="true">
              {char}
            </div>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          pattern="[A-Za-z0-9]*"
          maxLength={4}
          value={code}
          onChange={handleChange}
          style={styles.hiddenInput}
          aria-label="Pairing code input"
          autoComplete="off"
          autoCapitalize="characters"
        />

        <button onClick={handleHelp} style={styles.helpLink}>
          Help, I can’t find my code
        </button>

        {error && (
          <p style={styles.errorText}>
            {typeof error === "string"
              ? error
              : "An error occurred during pairing."}
          </p>
        )}
      </div>

      <div style={styles.backButtonContainer}>
        <button
          onClick={handleBack}
          style={styles.backButton}
          disabled={loading}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PairingPage;
