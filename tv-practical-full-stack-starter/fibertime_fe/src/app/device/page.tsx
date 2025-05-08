"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchDevice } from "../../store/slices/deviceSlice";

const DevicePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { device, loading, error } = useSelector(
    (state: RootState) => state.device
  );

  useEffect(() => {
    if (!device && !loading) {
      dispatch(fetchDevice());
    }
  }, [dispatch, device, loading]);

  let codeChars: string[] = ["-", "-", "-", "-"];
  if (loading) {
    codeChars = [".", ".", ".", "."];
  } else if (device && device.code) {
    const deviceCodeStr = String(device.code);
    const tempChars = deviceCodeStr.split("");
    while (tempChars.length < 4) tempChars.push("-");
    codeChars = tempChars.slice(0, 4);
  } else if (error) {
    codeChars = ["X", "X", "X", "X"];
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#5A546B",
        padding: "20px",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: "clamp(320px, 85vw, 750px)",
          aspectRatio: "750 / 520",
          maxWidth: "750px",
          maxHeight: "520px",
          background:
            "linear-gradient(90deg, #00E0FF 0%, #00E0FF 20%, #FFEE58 20%, #FFEE58 40%, #00E0FF 40%, #00E0FF 60%, #FFEE58 60%, #FFEE58 80%, #00E0FF 80%, #00E0FF 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "25px",
          padding: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            padding: "6px 12px",
            backgroundColor: "#FFEE58",
            color: "black",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "4px",
            lineHeight: "1",
          }}
        >
          fibertime
        </h1>

        <div
          style={{
            backgroundColor: "white",
            padding: "30px 35px",
            borderRadius: "12px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            width: "calc(100% - 60px)",
            maxWidth: "460px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          {loading ? (
            <p style={{ margin: "20px 0", color: "#333", fontSize: "1rem" }}>
              Loading device info...
            </p>
          ) : error ? (
            <p
              style={{
                margin: "20px 0",
                color: "#D32F2F",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Error fetching code. Please try again.
            </p>
          ) : device ? (
            <>
              <p
                style={{
                  color: "#374151",
                  fontSize: "1.1rem",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                On your phone go to{" "}
                <Link
                  href="https://fibertime.tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  fibertime.tv
                </Link>{" "}
                and enter this code
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                {codeChars.map((char, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#FFEE58",
                      color: "black",
                      width: "55px",
                      height: "65px",
                      fontSize: "2.2rem",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {char}
                  </div>
                ))}
              </div>

              <p
                style={{
                  color: "#6B7280",
                  fontSize: "0.9rem",
                  margin: 0,
                }}
              >
                For help WhatsApp{" "}
                <strong style={{ color: "black", fontWeight: "bold" }}>
                  078 886 1090
                </strong>
              </p>
            </>
          ) : (
            <p style={{ margin: "20px 0", color: "#555", fontSize: "1rem" }}>
              Device information not available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevicePage;
