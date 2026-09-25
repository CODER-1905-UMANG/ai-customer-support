import { useState } from "react";

const SESSION_ID = crypto.randomUUID();
const CUSTOMER_ID = "6ab505cee04af8d903c2696d";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          customerId: CUSTOMER_ID,
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data?.data?.message ||
            "Sorry, something went wrong.",
          sources: data?.data?.sources || [],
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to connect to the support server. Please try again.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "min(760px, calc(100vh - 48px))",
          minHeight: "600px",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "#111827",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "#ffffff",
                color: "#111827",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "800",
                fontSize: "18px",
              }}
            >
              T
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "19px",
                  fontWeight: "700",
                }}
              >
                TechNova Support
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  marginTop: "5px",
                  fontSize: "13px",
                  color: "#d1d5db",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />

                AI Support Online
              </div>
            </div>
          </div>

          <button
            onClick={startNewChat}
            disabled={loading}
            style={{
              border: "1px solid #374151",
              background: "transparent",
              color: "#ffffff",
              padding: "9px 14px",
              borderRadius: "9px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "13px",
              opacity: loading ? 0.5 : 1,
            }}
          >
            + New Chat
          </button>
        </div>

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            background: "#f8fafc",
          }}
        >
          {/* Empty State */}
          {messages.length === 0 && (
            <div
              style={{
                margin: "auto",
                width: "100%",
                maxWidth: "600px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 18px",
                  borderRadius: "20px",
                  background: "#111827",
                  color: "#ffffff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "25px",
                  fontWeight: "700",
                }}
              >
                T
              </div>

              <h1
                style={{
                  margin: "0 0 8px",
                  color: "#111827",
                  fontSize: "27px",
                }}
              >
                How can we help?
              </h1>

              <p
                style={{
                  margin: "0 auto 24px",
                  color: "#64748b",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  maxWidth: "500px",
                }}
              >
                Ask about your orders, payments, refunds,
                shipping, or any other support issue.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {[
                  "Where is my order 45821?",
                  "What is your refund policy?",
                  "What payment methods do you accept?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setMessage(suggestion)}
                    style={{
                      border: "1px solid #e2e8f0",
                      background: "#ffffff",
                      color: "#334155",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf:
                  msg.role === "user"
                    ? "flex-end"
                    : "flex-start",
                width: "fit-content",
                maxWidth: "78%",
              }}
            >
              <div
                style={{
                  padding: "13px 16px",
                  borderRadius:
                    msg.role === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  background:
                    msg.role === "user"
                      ? "#111827"
                      : "#ffffff",
                  color:
                    msg.role === "user"
                      ? "#ffffff"
                      : "#1e293b",
                  lineHeight: "1.6",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  boxShadow:
                    msg.role === "assistant"
                      ? "0 2px 8px rgba(15, 23, 42, 0.06)"
                      : "none",
                  border:
                    msg.role === "assistant"
                      ? "1px solid #e2e8f0"
                      : "none",
                }}
              >
                {msg.content}
              </div>

              {/* Sources */}
              {msg.role === "assistant" &&
                msg.sources &&
                msg.sources.length > 0 && (
                  <div
                    style={{
                      marginTop: "7px",
                      paddingLeft: "4px",
                      fontSize: "11px",
                      color: "#64748b",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>
                      Sources:
                    </span>{" "}
                    {msg.sources.join(" • ")}
                  </div>
                )}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                padding: "13px 16px",
                borderRadius: "16px 16px 16px 4px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                color: "#64748b",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>Thinking</span>

              <span
                style={{
                  display: "inline-flex",
                  gap: "3px",
                }}
              >
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "16px 20px 20px",
            background: "#ffffff",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              border: "1px solid #dbe2ea",
              borderRadius: "14px",
              padding: "6px",
              background: "#f8fafc",
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              disabled={loading}
              placeholder="Ask TechNova Support..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                padding: "11px 12px",
                fontSize: "14px",
                color: "#111827",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "11px 18px",
                background:
                  loading || !message.trim()
                    ? "#cbd5e1"
                    : "#111827",
                color: "#ffffff",
                cursor:
                  loading || !message.trim()
                    ? "not-allowed"
                    : "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "8px",
              color: "#94a3b8",
              fontSize: "11px",
            }}
          >
            AI-powered support • Responses may require verification
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;