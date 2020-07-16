import { EventEmitter } from "eventemitter3";
import _webrtcAdapter from "webrtc-adapter";
const $b8ae1e77afb69fcb4d65a87db09c18$export$Supports = new class {
  constructor() {
    this.isIOS = ['iPad', 'iPhone', 'iPod'].includes(navigator.platform);
    this.supportedBrowsers = ['firefox', 'chrome', 'safari'];
    this.minFirefoxVersion = 59;
    this.minChromeVersion = 72;
    this.minSafariVersion = 605;
  }

  isWebRTCSupported() {
    return typeof RTCPeerConnection !== 'undefined';
  }

  isBrowserSupported() {
    const browser = this.getBrowser();
    const version = this.getVersion();
    const validBrowser = this.supportedBrowsers.includes(browser);
    if (!validBrowser) return false;
    if (browser === 'chrome') return version >= this.minChromeVersion;
    if (browser === 'firefox') return version >= this.minFirefoxVersion;
    if (browser === 'safari') return !this.isIOS && version >= this.minSafariVersion;
    return false;
  }

  getBrowser() {
    return _webrtcAdapter.browserDetails.browser;
  }

  getVersion() {
    return _webrtcAdapter.browserDetails.version || 0;
  }

  isUnifiedPlanSupported() {
    const browser = this.getBrowser();
    const version = _webrtcAdapter.browserDetails.version || 0;
    if (browser === 'chrome' && version < 72) return false;
    if (browser === 'firefox' && version >= 59) return true;
    if (!window.RTCRtpTransceiver || !('currentDirection' in RTCRtpTransceiver.prototype)) return false;
    let tempPc;
    let supported = false;

    try {
      tempPc = new RTCPeerConnection();
      tempPc.addTransceiver('audio');
      supported = true;
    } catch (e) {} finally {
      if (tempPc) {
        tempPc.close();
      }
    }

    return supported;
  }

  toString() {
    return `Supports: 
    browser:${this.getBrowser()} 
    version:${this.getVersion()} 
    isIOS:${this.isIOS} 
    isWebRTCSupported:${this.isWebRTCSupported()} 
    isBrowserSupported:${this.isBrowserSupported()} 
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
  }

}();
const $e0d6b34e6a94a3dd2cd10e71bd186bfd$var$DEFAULT_CONFIG = {
  iceServers: [{
    urls: "stun:stun1.l.google.com:19302"
  }, {
    urls: "stun:stun2.l.google.com:19302"
  }, {
    urls: "stun:stun3.l.google.com:19302"
  }, {
    urls: "stun:stun4.l.google.com:19302"
  }],
  sdpSemantics: "unified-plan"
};
export const util = new class {
  constructor() {
    // Browsers that need chunking:
    this.chunkedBrowsers = {
      Chrome: 1,
      chrome: 1
    };
    this.chunkedMTU = 16300; // The original 60000 bytes setting does not work when sending data from Firefox to Chrome, which is "cut off" after 16384 bytes and delivered individually.
    // Returns browser-agnostic default config

    this.defaultConfig = $e0d6b34e6a94a3dd2cd10e71bd186bfd$var$DEFAULT_CONFIG;
    this.browser = $b8ae1e77afb69fcb4d65a87db09c18$export$Supports.getBrowser();
    this.browserVersion = $b8ae1e77afb69fcb4d65a87db09c18$export$Supports.getVersion(); // Lists which features are supported

    this.supports = function () {
      const supported = {
        browser: $b8ae1e77afb69fcb4d65a87db09c18$export$Supports.isBrowserSupported(),
        webRTC: $b8ae1e77afb69fcb4d65a87db09c18$export$Supports.isWebRTCSupported(),
        audioVideo: false,
        data: false,
        binaryBlob: false,
        reliable: false
      };
      if (!supported.webRTC) return supported;
      let pc;

      try {
        pc = new RTCPeerConnection($e0d6b34e6a94a3dd2cd10e71bd186bfd$var$DEFAULT_CONFIG);
        supported.audioVideo = true;
        let dc;

        try {
          dc = pc.createDataChannel("_PEERJSTEST", {
            ordered: true
          });
          supported.data = true;
          supported.reliable = !!dc.ordered; // Binary test

          try {
            dc.binaryType = "blob";
            supported.binaryBlob = !$b8ae1e77afb69fcb4d65a87db09c18$export$Supports.isIOS;
          } catch (e) {}
        } catch (e) {} finally {
          if (dc) {
            dc.close();
          }
        }
      } catch (e) {} finally {
        if (pc) {
          pc.close();
        }
      }

      return supported;
    }(); // Binary stuff


    this._dataCount = 1;
  }

  noop() {} // Ensure alphanumeric ids


  validateId(id) {
    // Allow empty ids
    return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
  }

  chunk(blob) {
    const chunks = [];
    const size = blob.size;
    const total = Math.ceil(size / util.chunkedMTU);
    let index = 0;
    let start = 0;

    while (start < size) {
      const end = Math.min(size, start + util.chunkedMTU);
      const b = blob.slice(start, end);
      const chunk = {
        __peerData: this._dataCount,
        n: index,
        data: b,
        total
      };
      chunks.push(chunk);
      start = end;
      index++;
    }

    this._dataCount++;
    return chunks;
  }

  randomToken() {
    return Math.random().toString(36).substr(2);
  }

  isSecure() {
    return location.protocol === "https:";
  }

}();
// ASSET: C:\Repo\other\peerjs\lib\logger.ts
var $bc9099f2fab2058874c9150b6e93145$var$_temp;
const $bc9099f2fab2058874c9150b6e93145$var$LOG_PREFIX = 'PeerJS: ';
/*
Prints log messages depending on the debug level passed in. Defaults to 0.
0  Prints no logs.
1  Prints only errors.
2  Prints errors and warnings.
3  Prints all logs.
*/

var $bc9099f2fab2058874c9150b6e93145$export$LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["Disabled"] = 0] = "Disabled";
  LogLevel[LogLevel["Errors"] = 1] = "Errors";
  LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
  LogLevel[LogLevel["All"] = 3] = "All";
})($bc9099f2fab2058874c9150b6e93145$export$LogLevel || ($bc9099f2fab2058874c9150b6e93145$var$_temp = $bc9099f2fab2058874c9150b6e93145$export$LogLevel = {}, $bc9099f2fab2058874c9150b6e93145$export$LogLevel, $bc9099f2fab2058874c9150b6e93145$var$_temp));

class $bc9099f2fab2058874c9150b6e93145$var$Logger {
  constructor() {
    this._logLevel = $bc9099f2fab2058874c9150b6e93145$export$LogLevel.Disabled;
  }

  get logLevel() {
    return this._logLevel;
  }

  set logLevel(logLevel) {
    this._logLevel = logLevel;
  }

  log(...args) {
    if (this._logLevel >= $bc9099f2fab2058874c9150b6e93145$export$LogLevel.All) {
      this._print($bc9099f2fab2058874c9150b6e93145$export$LogLevel.All, ...args);
    }
  }

  warn(...args) {
    if (this._logLevel >= $bc9099f2fab2058874c9150b6e93145$export$LogLevel.Warnings) {
      this._print($bc9099f2fab2058874c9150b6e93145$export$LogLevel.Warnings, ...args);
    }
  }

  error(...args) {
    if (this._logLevel >= $bc9099f2fab2058874c9150b6e93145$export$LogLevel.Errors) {
      this._print($bc9099f2fab2058874c9150b6e93145$export$LogLevel.Errors, ...args);
    }
  }

  setLogFunction(fn) {
    this._print = fn;
  }

  _print(logLevel, ...rest) {
    const copy = [$bc9099f2fab2058874c9150b6e93145$var$LOG_PREFIX, ...rest];

    for (let i in copy) {
      if (copy[i] instanceof Error) {
        copy[i] = "(" + copy[i].name + ") " + copy[i].message;
      }
    }

    if (logLevel >= $bc9099f2fab2058874c9150b6e93145$export$LogLevel.All) {
      console.log(...copy);
    } else if (logLevel >= $bc9099f2fab2058874c9150b6e93145$export$LogLevel.Warnings) {
      console.warn("WARNING", ...copy);
    } else if (logLevel >= $bc9099f2fab2058874c9150b6e93145$export$LogLevel.Errors) {
      console.error("ERROR", ...copy);
    }
  }

}

var $bc9099f2fab2058874c9150b6e93145$export$default = new $bc9099f2fab2058874c9150b6e93145$var$Logger();
// ASSET: C:\Repo\other\peerjs\lib\enums.ts
var $ceed60ce0cf31767c568c168280b408$var$_temp, $ceed60ce0cf31767c568c168280b408$var$_temp2, $ceed60ce0cf31767c568c168280b408$var$_temp3, $ceed60ce0cf31767c568c168280b408$var$_temp4, $ceed60ce0cf31767c568c168280b408$var$_temp5, $ceed60ce0cf31767c568c168280b408$var$_temp6, $ceed60ce0cf31767c568c168280b408$var$_temp7;
var $ceed60ce0cf31767c568c168280b408$export$ConnectionEventType;

(function (ConnectionEventType) {
  ConnectionEventType["Open"] = "open";
  ConnectionEventType["Data"] = "data";
  ConnectionEventType["Close"] = "close";
  ConnectionEventType["Error"] = "error";
  ConnectionEventType["IceStateChanged"] = "iceStateChanged";
})($ceed60ce0cf31767c568c168280b408$export$ConnectionEventType || ($ceed60ce0cf31767c568c168280b408$var$_temp = $ceed60ce0cf31767c568c168280b408$export$ConnectionEventType = {}, $ceed60ce0cf31767c568c168280b408$export$ConnectionEventType, $ceed60ce0cf31767c568c168280b408$var$_temp));

var $ceed60ce0cf31767c568c168280b408$export$ConnectionType;

(function (ConnectionType) {
  ConnectionType["Data"] = "data";
})($ceed60ce0cf31767c568c168280b408$export$ConnectionType || ($ceed60ce0cf31767c568c168280b408$var$_temp2 = $ceed60ce0cf31767c568c168280b408$export$ConnectionType = {}, $ceed60ce0cf31767c568c168280b408$export$ConnectionType, $ceed60ce0cf31767c568c168280b408$var$_temp2));

var $ceed60ce0cf31767c568c168280b408$export$PeerEventType;

(function (PeerEventType) {
  PeerEventType["Open"] = "open";
  PeerEventType["Close"] = "close";
  PeerEventType["Connection"] = "connection";
  PeerEventType["Disconnected"] = "disconnected";
  PeerEventType["Error"] = "error";
})($ceed60ce0cf31767c568c168280b408$export$PeerEventType || ($ceed60ce0cf31767c568c168280b408$var$_temp3 = $ceed60ce0cf31767c568c168280b408$export$PeerEventType = {}, $ceed60ce0cf31767c568c168280b408$export$PeerEventType, $ceed60ce0cf31767c568c168280b408$var$_temp3));

var $ceed60ce0cf31767c568c168280b408$export$PeerErrorType;

(function (PeerErrorType) {
  PeerErrorType["BrowserIncompatible"] = "browser-incompatible";
  PeerErrorType["Disconnected"] = "disconnected";
  PeerErrorType["InvalidID"] = "invalid-id";
  PeerErrorType["InvalidKey"] = "invalid-key";
  PeerErrorType["Network"] = "network";
  PeerErrorType["PeerUnavailable"] = "peer-unavailable";
  PeerErrorType["SslUnavailable"] = "ssl-unavailable";
  PeerErrorType["ServerError"] = "server-error";
  PeerErrorType["SocketError"] = "socket-error";
  PeerErrorType["SocketClosed"] = "socket-closed";
  PeerErrorType["UnavailableID"] = "unavailable-id";
  PeerErrorType["WebRTC"] = "webrtc";
})($ceed60ce0cf31767c568c168280b408$export$PeerErrorType || ($ceed60ce0cf31767c568c168280b408$var$_temp4 = $ceed60ce0cf31767c568c168280b408$export$PeerErrorType = {}, $ceed60ce0cf31767c568c168280b408$export$PeerErrorType, $ceed60ce0cf31767c568c168280b408$var$_temp4));

var $ceed60ce0cf31767c568c168280b408$export$SerializationType;

(function (SerializationType) {
  SerializationType["JSON"] = "json";
})($ceed60ce0cf31767c568c168280b408$export$SerializationType || ($ceed60ce0cf31767c568c168280b408$var$_temp5 = $ceed60ce0cf31767c568c168280b408$export$SerializationType = {}, $ceed60ce0cf31767c568c168280b408$export$SerializationType, $ceed60ce0cf31767c568c168280b408$var$_temp5));

var $ceed60ce0cf31767c568c168280b408$export$SocketEventType;

(function (SocketEventType) {
  SocketEventType["Message"] = "message";
  SocketEventType["Disconnected"] = "disconnected";
  SocketEventType["Error"] = "error";
  SocketEventType["Close"] = "close";
})($ceed60ce0cf31767c568c168280b408$export$SocketEventType || ($ceed60ce0cf31767c568c168280b408$var$_temp6 = $ceed60ce0cf31767c568c168280b408$export$SocketEventType = {}, $ceed60ce0cf31767c568c168280b408$export$SocketEventType, $ceed60ce0cf31767c568c168280b408$var$_temp6));

var $ceed60ce0cf31767c568c168280b408$export$ServerMessageType;

(function (ServerMessageType) {
  ServerMessageType["Heartbeat"] = "HEARTBEAT";
  ServerMessageType["Candidate"] = "CANDIDATE";
  ServerMessageType["Offer"] = "OFFER";
  ServerMessageType["Answer"] = "ANSWER";
  ServerMessageType["Open"] = "OPEN";
  ServerMessageType["Error"] = "ERROR";
  ServerMessageType["IdTaken"] = "ID-TAKEN";
  ServerMessageType["InvalidKey"] = "INVALID-KEY";
  ServerMessageType["Leave"] = "LEAVE";
  ServerMessageType["Expire"] = "EXPIRE"; // The offer sent to a peer has expired without response.
})($ceed60ce0cf31767c568c168280b408$export$ServerMessageType || ($ceed60ce0cf31767c568c168280b408$var$_temp7 = $ceed60ce0cf31767c568c168280b408$export$ServerMessageType = {}, $ceed60ce0cf31767c568c168280b408$export$ServerMessageType, $ceed60ce0cf31767c568c168280b408$var$_temp7));

/**
 * An abstraction on top of WebSockets to provide fastest
 * possible connection for peers.
 */
class $bed64a34ec422d9ea5f0379ef2d36ad9$export$Socket extends EventEmitter {
  constructor(secure, host, port, path, key, pingInterval = 5000) {
    super();
    this.pingInterval = pingInterval;
    this._disconnected = true;
    this._messagesQueue = [];
    const wsProtocol = secure ? "wss://" : "ws://";
    this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
  }

  start(id, token) {
    this._id = id;
    const wsUrl = `${this._baseUrl}&id=${id}&token=${token}`;

    if (!!this._socket || !this._disconnected) {
      return;
    }

    this._socket = new WebSocket(wsUrl);
    this._disconnected = false;

    this._socket.onmessage = event => {
      let data;

      try {
        data = JSON.parse(event.data);
        $bc9099f2fab2058874c9150b6e93145$export$default.log("Server message received:", data);
      } catch (e) {
        $bc9099f2fab2058874c9150b6e93145$export$default.log("Invalid server message", event.data);
        return;
      }

      this.emit($ceed60ce0cf31767c568c168280b408$export$SocketEventType.Message, data);
    };

    this._socket.onclose = event => {
      if (this._disconnected) {
        return;
      }

      $bc9099f2fab2058874c9150b6e93145$export$default.log("Socket closed.", event);

      this._cleanup();

      this._disconnected = true;
      this.emit($ceed60ce0cf31767c568c168280b408$export$SocketEventType.Disconnected);
    }; // Take care of the queue of connections if necessary and make sure Peer knows
    // socket is open.


    this._socket.onopen = () => {
      if (this._disconnected) {
        return;
      }

      this._sendQueuedMessages();

      $bc9099f2fab2058874c9150b6e93145$export$default.log("Socket open");

      this._scheduleHeartbeat();
    };
  }

  _scheduleHeartbeat() {
    this._wsPingTimer = setTimeout(() => {
      this._sendHeartbeat();
    }, this.pingInterval);
  }

  _sendHeartbeat() {
    if (!this._wsOpen()) {
      $bc9099f2fab2058874c9150b6e93145$export$default.log(`Cannot send heartbeat, because socket closed`);
      return;
    }

    const message = JSON.stringify({
      type: $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Heartbeat
    });

    this._socket.send(message);

    this._scheduleHeartbeat();
  }
  /** Is the websocket currently open? */


  _wsOpen() {
    return !!this._socket && this._socket.readyState === 1;
  }
  /** Send queued messages. */


  _sendQueuedMessages() {
    //Create copy of queue and clear it,
    //because send method push the message back to queue if smth will go wrong
    const copiedQueue = [...this._messagesQueue];
    this._messagesQueue = [];

    for (const message of copiedQueue) {
      this.send(message);
    }
  }
  /** Exposed send for DC & Peer. */


  send(data) {
    if (this._disconnected) {
      return;
    } // If we didn't get an ID yet, we can't yet send anything so we should queue
    // up these messages.


    if (!this._id) {
      this._messagesQueue.push(data);

      return;
    }

    if (!data.type) {
      this.emit($ceed60ce0cf31767c568c168280b408$export$SocketEventType.Error, "Invalid message");
      return;
    }

    if (!this._wsOpen()) {
      return;
    }

    const message = JSON.stringify(data);

    this._socket.send(message);
  }

  close() {
    if (this._disconnected) {
      return;
    }

    this._cleanup();

    this._disconnected = true;
  }

  _cleanup() {
    if (!!this._socket) {
      this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;

      this._socket.close();

      this._socket = undefined;
    }

    clearTimeout(this._wsPingTimer);
  }

}

/**
 * Manages all negotiations between Peers.
 */
class $e3a1166e64d9a663986328e52c00dde$export$Negotiator {
  constructor(connection) {
    this.connection = connection;
  }
  /** Returns a PeerConnection object set up correctly (for data, media). */


  startConnection(options) {
    const peerConnection = this._startPeerConnection(); // Set the connection's PC.


    this.connection.peerConnection = peerConnection; // What do we need to do now?

    if (options.originator) {
      if (this.connection.type === $ceed60ce0cf31767c568c168280b408$export$ConnectionType.Data) {
        const dataConnection = this.connection;
        const config = {
          ordered: !!options.reliable
        };
        const dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
        dataConnection.initialize(dataChannel);
      }

      this._makeOffer();
    } else {
      this.handleSDP("OFFER", options.sdp);
    }
  }
  /** Start a PC. */


  _startPeerConnection() {
    $bc9099f2fab2058874c9150b6e93145$export$default.log("Creating RTCPeerConnection.");
    const peerConnection = new RTCPeerConnection(this.connection.provider.options.config);

    this._setupListeners(peerConnection);

    return peerConnection;
  }
  /** Set up various WebRTC listeners. */


  _setupListeners(peerConnection) {
    const peerId = this.connection.peer;
    const connectionId = this.connection.connectionId;
    const connectionType = this.connection.type;
    const provider = this.connection.provider; // ICE CANDIDATES.

    $bc9099f2fab2058874c9150b6e93145$export$default.log("Listening for ICE candidates.");

    peerConnection.onicecandidate = evt => {
      if (!evt.candidate || !evt.candidate.candidate) return;
      $bc9099f2fab2058874c9150b6e93145$export$default.log(`Received ICE candidates for ${peerId}:`, evt.candidate);
      provider.socket.send({
        type: $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Candidate,
        payload: {
          candidate: evt.candidate,
          type: connectionType,
          connectionId: connectionId
        },
        dst: peerId
      });
    };

    peerConnection.oniceconnectionstatechange = () => {
      switch (peerConnection.iceConnectionState) {
        case "failed":
          $bc9099f2fab2058874c9150b6e93145$export$default.log("iceConnectionState is failed, closing connections to " + peerId);
          this.connection.emit($ceed60ce0cf31767c568c168280b408$export$ConnectionEventType.Error, new Error("Negotiation of connection to " + peerId + " failed."));
          this.connection.close();
          break;

        case "closed":
          $bc9099f2fab2058874c9150b6e93145$export$default.log("iceConnectionState is closed, closing connections to " + peerId);
          this.connection.emit($ceed60ce0cf31767c568c168280b408$export$ConnectionEventType.Error, new Error("Connection to " + peerId + " closed."));
          this.connection.close();
          break;

        case "disconnected":
          $bc9099f2fab2058874c9150b6e93145$export$default.log("iceConnectionState changed to disconnected on the connection with " + peerId);
          break;

        case "completed":
          peerConnection.onicecandidate = util.noop;
          break;
      }

      this.connection.emit($ceed60ce0cf31767c568c168280b408$export$ConnectionEventType.IceStateChanged, peerConnection.iceConnectionState);
    }; // DATACONNECTION.


    $bc9099f2fab2058874c9150b6e93145$export$default.log("Listening for data channel"); // Fired between offer and answer, so options should already be saved
    // in the options hash.

    peerConnection.ondatachannel = evt => {
      $bc9099f2fab2058874c9150b6e93145$export$default.log("Received data channel");
      const dataChannel = evt.channel;
      const connection = provider.getConnection(peerId, connectionId);
      connection.initialize(dataChannel);
    }; // MEDIACONNECTION.


    $bc9099f2fab2058874c9150b6e93145$export$default.log("Listening for remote stream");

    peerConnection.ontrack = () => {
      $bc9099f2fab2058874c9150b6e93145$export$default.log("Received remote stream");
    };
  }

  cleanup() {
    $bc9099f2fab2058874c9150b6e93145$export$default.log("Cleaning up PeerConnection to " + this.connection.peer);
    const peerConnection = this.connection.peerConnection;

    if (!peerConnection) {
      return;
    }

    this.connection.peerConnection = null; //unsubscribe from all PeerConnection's events

    peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = () => {};

    const peerConnectionNotClosed = peerConnection.signalingState !== "closed";
    let dataChannelNotClosed = false;

    if (this.connection.type === $ceed60ce0cf31767c568c168280b408$export$ConnectionType.Data) {
      const dataConnection = this.connection;
      const dataChannel = dataConnection.dataChannel;

      if (dataChannel) {
        dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
      }
    }

    if (peerConnectionNotClosed || dataChannelNotClosed) {
      peerConnection.close();
    }
  }

  async _makeOffer() {
    const peerConnection = this.connection.peerConnection;
    const provider = this.connection.provider;

    try {
      const offer = await peerConnection.createOffer(this.connection.options.constraints);
      $bc9099f2fab2058874c9150b6e93145$export$default.log("Created offer.");

      if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === 'function') {
        offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
      }

      try {
        await peerConnection.setLocalDescription(offer);
        $bc9099f2fab2058874c9150b6e93145$export$default.log("Set localDescription:", offer, `for:${this.connection.peer}`);
        let payload = {
          sdp: offer,
          type: this.connection.type,
          connectionId: this.connection.connectionId,
          metadata: this.connection.metadata,
          browser: util.browser
        };

        if (this.connection.type === $ceed60ce0cf31767c568c168280b408$export$ConnectionType.Data) {
          const dataConnection = this.connection;
          payload = { ...payload,
            label: dataConnection.label,
            reliable: dataConnection.reliable,
            serialization: dataConnection.serialization
          };
        }

        provider.socket.send({
          type: $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Offer,
          payload,
          dst: this.connection.peer
        });
      } catch (err) {
        // TODO: investigate why _makeOffer is being called from the answer
        if (err != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
          provider.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.WebRTC, err);
          $bc9099f2fab2058874c9150b6e93145$export$default.log("Failed to setLocalDescription, ", err);
        }
      }
    } catch (err_1) {
      provider.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.WebRTC, err_1);
      $bc9099f2fab2058874c9150b6e93145$export$default.log("Failed to createOffer, ", err_1);
    }
  }

  async _makeAnswer() {
    const peerConnection = this.connection.peerConnection;
    const provider = this.connection.provider;

    try {
      const answer = await peerConnection.createAnswer();
      $bc9099f2fab2058874c9150b6e93145$export$default.log("Created answer.");

      if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === 'function') {
        answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
      }

      try {
        await peerConnection.setLocalDescription(answer);
        $bc9099f2fab2058874c9150b6e93145$export$default.log(`Set localDescription:`, answer, `for:${this.connection.peer}`);
        provider.socket.send({
          type: $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Answer,
          payload: {
            sdp: answer,
            type: this.connection.type,
            connectionId: this.connection.connectionId,
            browser: util.browser
          },
          dst: this.connection.peer
        });
      } catch (err) {
        provider.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.WebRTC, err);
        $bc9099f2fab2058874c9150b6e93145$export$default.log("Failed to setLocalDescription, ", err);
      }
    } catch (err_1) {
      provider.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.WebRTC, err_1);
      $bc9099f2fab2058874c9150b6e93145$export$default.log("Failed to create answer, ", err_1);
    }
  }
  /** Handle an SDP. */


  async handleSDP(type, sdp) {
    sdp = new RTCSessionDescription(sdp);
    const peerConnection = this.connection.peerConnection;
    const provider = this.connection.provider;
    $bc9099f2fab2058874c9150b6e93145$export$default.log("Setting remote description", sdp);
    const self = this;

    try {
      await peerConnection.setRemoteDescription(sdp);
      $bc9099f2fab2058874c9150b6e93145$export$default.log(`Set remoteDescription:${type} for:${this.connection.peer}`);

      if (type === "OFFER") {
        await self._makeAnswer();
      }
    } catch (err) {
      provider.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.WebRTC, err);
      $bc9099f2fab2058874c9150b6e93145$export$default.log("Failed to setRemoteDescription, ", err);
    }
  }
  /** Handle a candidate. */


  async handleCandidate(ice) {
    $bc9099f2fab2058874c9150b6e93145$export$default.log(`handleCandidate:`, ice);
    const candidate = ice.candidate;
    const sdpMLineIndex = ice.sdpMLineIndex;
    const sdpMid = ice.sdpMid;
    const peerConnection = this.connection.peerConnection;
    const provider = this.connection.provider;

    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate({
        sdpMid: sdpMid,
        sdpMLineIndex: sdpMLineIndex,
        candidate: candidate
      }));
      $bc9099f2fab2058874c9150b6e93145$export$default.log(`Added ICE candidate for:${this.connection.peer}`);
    } catch (err) {
      provider.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.WebRTC, err);
      $bc9099f2fab2058874c9150b6e93145$export$default.log("Failed to handleCandidate, ", err);
    }
  }

}

class $f886476c0e1d572fb6372169d5431$export$BaseConnection extends EventEmitter {
  constructor(peer, provider, options) {
    super();
    this.peer = peer;
    this.provider = provider;
    this.options = options;
    this._open = false;
    this.metadata = options.metadata;
  }

  get open() {
    return this._open;
  }

}

class $af3efebd2f4a42592207001e5$export$EncodingQueue extends EventEmitter {
  constructor() {
    super();
    this.fileReader = new FileReader();
    this._queue = [];
    this._processing = false;

    this.fileReader.onload = evt => {
      this._processing = false;

      if (evt.target) {
        this.emit('done', evt.target.result);
      }

      this.doNextTask();
    };

    this.fileReader.onerror = evt => {
      $bc9099f2fab2058874c9150b6e93145$export$default.error(`EncodingQueue error:`, evt);
      this._processing = false;
      this.destroy();
      this.emit('error', evt);
    };
  }

  get queue() {
    return this._queue;
  }

  get size() {
    return this.queue.length;
  }

  get processing() {
    return this._processing;
  }

  enque(blob) {
    this.queue.push(blob);
    if (this.processing) return;
    this.doNextTask();
  }

  destroy() {
    this.fileReader.abort();
    this._queue = [];
  }

  doNextTask() {
    if (this.size === 0) return;
    if (this.processing) return;
    this._processing = true;
    this.fileReader.readAsArrayBuffer(this.queue.shift());
  }

}

/**
 * Wraps a DataChannel between two Peers.
 */
class $ebbd8d74e7bc6805437f5524d7ba25$export$DataConnection extends $f886476c0e1d572fb6372169d5431$export$BaseConnection {
  constructor(peerId, provider, options) {
    super(peerId, provider, options);
    this.stringify = JSON.stringify;
    this.parse = JSON.parse;
    this._buffer = [];
    this._bufferSize = 0;
    this._buffering = false;
    this._chunkedData = {};
    this._encodingQueue = new $af3efebd2f4a42592207001e5$export$EncodingQueue();
    this.connectionId = this.options.connectionId || $ebbd8d74e7bc6805437f5524d7ba25$export$DataConnection.ID_PREFIX + util.randomToken();
    this.label = this.options.label || this.connectionId;
    this.serialization = this.options.serialization || $ceed60ce0cf31767c568c168280b408$export$SerializationType.JSON;
    this.reliable = !!this.options.reliable;

    this._encodingQueue.on('done', ab => {
      this._bufferedSend(ab);
    });

    this._encodingQueue.on('error', () => {
      $bc9099f2fab2058874c9150b6e93145$export$default.error(`DC#${this.connectionId}: Error occured in encoding from blob to arraybuffer, close DC`);
      this.close();
    });

    this._negotiator = new $e3a1166e64d9a663986328e52c00dde$export$Negotiator(this);

    this._negotiator.startConnection(this.options._payload || {
      originator: true
    });
  }

  get type() {
    return $ceed60ce0cf31767c568c168280b408$export$ConnectionType.Data;
  }

  get dataChannel() {
    return this._dc;
  }

  get bufferSize() {
    return this._bufferSize;
  }
  /** Called by the Negotiator when the DataChannel is ready. */


  initialize(dc) {
    this._dc = dc;

    this._configureDataChannel();
  }

  _configureDataChannel() {
    if (!util.supports.binaryBlob || util.supports.reliable) {
      this.dataChannel.binaryType = "arraybuffer";
    }

    this.dataChannel.onopen = () => {
      $bc9099f2fab2058874c9150b6e93145$export$default.log(`DC#${this.connectionId} dc connection success`);
      this._open = true;
      this.emit($ceed60ce0cf31767c568c168280b408$export$ConnectionEventType.Open);
    };

    this.dataChannel.onmessage = e => {
      $bc9099f2fab2058874c9150b6e93145$export$default.log(`DC#${this.connectionId} dc onmessage:`, e.data);

      this._handleDataMessage(e);
    };

    this.dataChannel.onclose = () => {
      $bc9099f2fab2058874c9150b6e93145$export$default.log(`DC#${this.connectionId} dc closed for:`, this.peer);
      this.close();
    };
  } // Handles a DataChannel message.


  _handleDataMessage({
    data
  }) {
    let deserializedData = data;

    if (this.serialization === $ceed60ce0cf31767c568c168280b408$export$SerializationType.JSON) {
      deserializedData = this.parse(data);
    } // Check if we've chunked--if so, piece things back together.
    // We're guaranteed that this isn't 0.


    if (deserializedData.__peerData) {
      this._handleChunk(deserializedData);

      return;
    }

    super.emit($ceed60ce0cf31767c568c168280b408$export$ConnectionEventType.Data, deserializedData);
  }

  _handleChunk(data) {
    const id = data.__peerData;
    const chunkInfo = this._chunkedData[id] || {
      data: [],
      count: 0,
      total: data.total
    };
    chunkInfo.data[data.n] = data.data;
    chunkInfo.count++;
    this._chunkedData[id] = chunkInfo;

    if (chunkInfo.total === chunkInfo.count) {
      // Clean up before making the recursive call to `_handleDataMessage`.
      delete this._chunkedData[id]; // We've received all the chunks--time to construct the complete data.

      const data = new Blob(chunkInfo.data);

      this._handleDataMessage({
        data
      });
    }
  }
  /**
   * Exposed functionality for users.
   */

  /** Allows user to close connection. */


  close() {
    this._buffer = [];
    this._bufferSize = 0;
    this._chunkedData = {};

    if (this._negotiator) {
      this._negotiator.cleanup();

      this._negotiator = null;
    }

    if (this.provider) {
      this.provider._removeConnection(this);

      this.provider = null;
    }

    if (this.dataChannel) {
      this.dataChannel.onopen = null;
      this.dataChannel.onmessage = null;
      this.dataChannel.onclose = null;
      this._dc = null;
    }

    if (this._encodingQueue) {
      this._encodingQueue.destroy();

      this._encodingQueue.removeAllListeners();

      this._encodingQueue = null;
    }

    if (!this.open) {
      return;
    }

    this._open = false;
    super.emit($ceed60ce0cf31767c568c168280b408$export$ConnectionEventType.Close);
  }
  /** Allows user to send data. */


  send(data) {
    if (!this.open) {
      super.emit($ceed60ce0cf31767c568c168280b408$export$ConnectionEventType.Error, new Error("Connection is not open. You should listen for the `open` event before sending messages."));
      return;
    }

    if (this.serialization === $ceed60ce0cf31767c568c168280b408$export$SerializationType.JSON) {
      this._bufferedSend(this.stringify(data));
    } else {
      this._bufferedSend(data);
    }
  }

  _bufferedSend(msg) {
    if (this._buffering || !this._trySend(msg)) {
      this._buffer.push(msg);

      this._bufferSize = this._buffer.length;
    }
  } // Returns true if the send succeeds.


  _trySend(msg) {
    if (!this.open) {
      return false;
    }

    if (this.dataChannel.bufferedAmount > $ebbd8d74e7bc6805437f5524d7ba25$export$DataConnection.MAX_BUFFERED_AMOUNT) {
      this._buffering = true;
      setTimeout(() => {
        this._buffering = false;

        this._tryBuffer();
      }, 50);
      return false;
    }

    try {
      this.dataChannel.send(msg);
    } catch (e) {
      $bc9099f2fab2058874c9150b6e93145$export$default.error(`DC#:${this.connectionId} Error when sending:`, e);
      this._buffering = true;
      this.close();
      return false;
    }

    return true;
  } // Try to send the first message in the buffer.


  _tryBuffer() {
    if (!this.open) {
      return;
    }

    if (this._buffer.length === 0) {
      return;
    }

    const msg = this._buffer[0];

    if (this._trySend(msg)) {
      this._buffer.shift();

      this._bufferSize = this._buffer.length;

      this._tryBuffer();
    }
  }

  handleMessage(message) {
    const payload = message.payload;

    switch (message.type) {
      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Answer:
        this._negotiator.handleSDP(message.type, payload.sdp);

        break;

      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Candidate:
        this._negotiator.handleCandidate(payload.candidate);

        break;

      default:
        $bc9099f2fab2058874c9150b6e93145$export$default.warn("Unrecognized message type:", message.type, "from peer:", this.peer);
        break;
    }
  }

}

$ebbd8d74e7bc6805437f5524d7ba25$export$DataConnection.ID_PREFIX = "dc_";
$ebbd8d74e7bc6805437f5524d7ba25$export$DataConnection.MAX_BUFFERED_AMOUNT = 8 * 1024 * 1024;

class $e9539abc198244c673e6c952774758eb$export$API {
  constructor(_options) {
    this._options = _options;
  }

  _buildUrl(method) {
    const protocol = this._options.secure ? "https://" : "http://";
    let url = protocol + this._options.host + ":" + this._options.port + this._options.path + this._options.key + "/" + method;
    const queryString = "?ts=" + new Date().getTime() + "" + Math.random();
    url += queryString;
    return url;
  }
  /** Get a unique ID from the server via XHR and initialize with it. */


  async retrieveId() {
    const url = this._buildUrl("id");

    try {
      const response = await fetch(url);

      if (response.status !== 200) {
        throw new Error(`Error. Status:${response.status}`);
      }

      return response.text();
    } catch (error) {
      $bc9099f2fab2058874c9150b6e93145$export$default.error("Error retrieving ID", error);
      let pathError = "";

      if (this._options.path === "/") {
        pathError = " If you passed in a `path` to your self-hosted PeerServer, " + "you'll also need to pass in that same path when creating a new " + "Peer.";
      }

      throw new Error("Could not get an ID from the server." + pathError);
    }
  }
  /** @deprecated */


  async listAllPeers() {
    const url = this._buildUrl("peers");

    try {
      const response = await fetch(url);

      if (response.status !== 200) {
        if (response.status === 401) {
          let helpfulError = "";
          helpfulError = "You need to enable `allow_discovery` on your self-hosted " + "PeerServer to use this feature.";
          throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
        }

        throw new Error(`Error. Status:${response.status}`);
      }

      return response.json();
    } catch (error) {
      $bc9099f2fab2058874c9150b6e93145$export$default.error("Error retrieving list peers", error);
      throw new Error("Could not get list peers from the server." + error);
    }
  }

}

/**
 * A peer who can initiate connections with other peers.
 */
export class Peer extends EventEmitter {
  constructor(id, options) {
    super();
    this._id = null;
    this._lastServerId = null; // States.

    this._destroyed = false; // Connections have been killed

    this._disconnected = false; // Connection to PeerServer killed but P2P connections still active

    this._open = false; // Sockets and such are not yet open.

    this._connections = new Map(); // All connections for this peer.

    this._lostMessages = new Map(); // src => [list of messages]

    let userId; // Deal with overloading

    if (id && id.constructor == Object) {
      options = id;
    } else if (id) {
      userId = id.toString();
    } // Configurize options


    options = {
      debug: 0,
      host: 'localhost',
      port: 4242,
      path: "/",
      key: Peer.DEFAULT_KEY,
      token: util.randomToken(),
      config: util.defaultConfig,
      ...options
    };
    this._options = options; // Detect relative URL host.

    if (this._options.host === "/") {
      this._options.host = window.location.hostname;
    } // Set path correctly.


    if (this._options.path) {
      if (this._options.path[0] !== "/") {
        this._options.path = "/" + this._options.path;
      }

      if (this._options.path[this._options.path.length - 1] !== "/") {
        this._options.path += "/";
      }
    } // Set whether we use SSL to same as current host


    if (this._options.secure === undefined) {
      this._options.secure = util.isSecure();
    } // Set a custom log function if present


    if (this._options.logFunction) {
      $bc9099f2fab2058874c9150b6e93145$export$default.setLogFunction(this._options.logFunction);
    }

    $bc9099f2fab2058874c9150b6e93145$export$default.logLevel = this._options.debug || 0;
    this._api = new $e9539abc198244c673e6c952774758eb$export$API(options);
    this._socket = this._createServerConnection(); // Ensure WebRTC supported

    if (!util.supports.audioVideo && !util.supports.data) {
      this._delayedAbort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.BrowserIncompatible, "The current browser does not support WebRTC");

      return;
    } // Ensure alphanumeric id


    if (!!userId && !util.validateId(userId)) {
      this._delayedAbort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.InvalidID, `ID "${userId}" is invalid`);

      return;
    }

    if (userId) {
      this._initialize(userId);
    } else {
      this._api.retrieveId().then(id => this._initialize(id)).catch(error => this._abort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.ServerError, error));
    }
  }

  get id() {
    return this._id;
  }

  get options() {
    return this._options;
  }

  get open() {
    return this._open;
  }

  get socket() {
    return this._socket;
  }
  /**
   * @deprecated
   * Return type will change from Object to Map<string,[]>
   */


  get connections() {
    const plainConnections = Object.create(null);

    for (let [k, v] of this._connections) {
      plainConnections[k] = v;
    }

    return plainConnections;
  }

  get destroyed() {
    return this._destroyed;
  }

  get disconnected() {
    return this._disconnected;
  }

  _createServerConnection() {
    const socket = new $bed64a34ec422d9ea5f0379ef2d36ad9$export$Socket(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
    socket.on($ceed60ce0cf31767c568c168280b408$export$SocketEventType.Message, data => {
      this._handleMessage(data);
    });
    socket.on($ceed60ce0cf31767c568c168280b408$export$SocketEventType.Error, error => {
      this._abort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.SocketError, error);
    });
    socket.on($ceed60ce0cf31767c568c168280b408$export$SocketEventType.Disconnected, () => {
      if (this.disconnected) {
        return;
      }

      this.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.Network, "Lost connection to server.");
      this.disconnect();
    });
    socket.on($ceed60ce0cf31767c568c168280b408$export$SocketEventType.Close, () => {
      if (this.disconnected) {
        return;
      }

      this._abort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.SocketClosed, "Underlying socket is already closed.");
    });
    return socket;
  }
  /** Initialize a connection with the server. */


  _initialize(id) {
    this._id = id;
    this.socket.start(id, this._options.token);
  }
  /** Handles messages from the server. */


  _handleMessage(message) {
    const type = message.type;
    const payload = message.payload;
    const peerId = message.src;

    switch (type) {
      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Open:
        // The connection to the server is open.
        this._lastServerId = this.id;
        this._open = true;
        this.emit($ceed60ce0cf31767c568c168280b408$export$PeerEventType.Open, this.id);
        break;

      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Error:
        // Server error.
        this._abort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.ServerError, payload.msg);

        break;

      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.IdTaken:
        // The selected ID is taken.
        this._abort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.UnavailableID, `ID "${this.id}" is taken`);

        break;

      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.InvalidKey:
        // The given API key cannot be found.
        this._abort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.InvalidKey, `API KEY "${this._options.key}" is invalid`);

        break;

      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Leave:
        // Another peer has closed its connection to this peer.
        $bc9099f2fab2058874c9150b6e93145$export$default.log(`Received leave message from ${peerId}`);

        this._cleanupPeer(peerId);

        this._connections.delete(peerId);

        break;

      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Expire:
        // The offer sent to a peer has expired without response.
        this.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.PeerUnavailable, `Could not connect to peer ${peerId}`);
        break;

      case $ceed60ce0cf31767c568c168280b408$export$ServerMessageType.Offer:
        {
          // we should consider switching this to CALL/CONNECT, but this is the least breaking option.
          const connectionId = payload.connectionId;
          let connection = this.getConnection(peerId, connectionId);

          if (connection) {
            connection.close();
            $bc9099f2fab2058874c9150b6e93145$export$default.warn(`Offer received for existing Connection ID:${connectionId}`);
          } // Create a new connection.


          if (payload.type === $ceed60ce0cf31767c568c168280b408$export$ConnectionType.Data) {
            connection = new $ebbd8d74e7bc6805437f5524d7ba25$export$DataConnection(peerId, this, {
              connectionId: connectionId,
              _payload: payload,
              metadata: payload.metadata,
              label: payload.label,
              serialization: payload.serialization,
              reliable: payload.reliable
            });

            this._addConnection(peerId, connection);

            this.emit($ceed60ce0cf31767c568c168280b408$export$PeerEventType.Connection, connection);
          } else {
            $bc9099f2fab2058874c9150b6e93145$export$default.warn(`Received malformed connection type:${payload.type}`);
            return;
          } // Find messages.


          const messages = this._getMessages(connectionId);

          for (let message of messages) {
            connection.handleMessage(message);
          }

          break;
        }

      default:
        {
          if (!payload) {
            $bc9099f2fab2058874c9150b6e93145$export$default.warn(`You received a malformed message from ${peerId} of type ${type}`);
            return;
          }

          const connectionId = payload.connectionId;
          const connection = this.getConnection(peerId, connectionId);

          if (connection && connection.peerConnection) {
            // Pass it on.
            connection.handleMessage(message);
          } else if (connectionId) {
            // Store for possible later use
            this._storeMessage(connectionId, message);
          } else {
            $bc9099f2fab2058874c9150b6e93145$export$default.warn("You received an unrecognized message:", message);
          }

          break;
        }
    }
  }
  /** Stores messages without a set up connection, to be claimed later. */


  _storeMessage(connectionId, message) {
    if (!this._lostMessages.has(connectionId)) {
      this._lostMessages.set(connectionId, []);
    }

    this._lostMessages.get(connectionId).push(message);
  }
  /** Retrieve messages from lost message store */
  //TODO Change it to private


  _getMessages(connectionId) {
    const messages = this._lostMessages.get(connectionId);

    if (messages) {
      this._lostMessages.delete(connectionId);

      return messages;
    }

    return [];
  }
  /**
   * Returns a DataConnection to the specified peer. See documentation for a
   * complete list of options.
   */


  connect(peer, options = {}) {
    if (this.disconnected) {
      $bc9099f2fab2058874c9150b6e93145$export$default.warn("You cannot connect to a new Peer because you called " + ".disconnect() on this Peer and ended your connection with the " + "server. You can create a new Peer to reconnect, or call reconnect " + "on this peer if you believe its ID to still be available.");
      this.emitError($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
      return;
    }

    const dataConnection = new $ebbd8d74e7bc6805437f5524d7ba25$export$DataConnection(peer, this, options);

    this._addConnection(peer, dataConnection);

    return dataConnection;
  }
  /** Add a data/media connection to this peer. */


  _addConnection(peerId, connection) {
    $bc9099f2fab2058874c9150b6e93145$export$default.log(`add connection ${connection.type}:${connection.connectionId} to peerId:${peerId}`);

    if (!this._connections.has(peerId)) {
      this._connections.set(peerId, []);
    }

    this._connections.get(peerId).push(connection);
  } //TODO should be private


  _removeConnection(connection) {
    const connections = this._connections.get(connection.peer);

    if (connections) {
      const index = connections.indexOf(connection);

      if (index !== -1) {
        connections.splice(index, 1);
      }
    } //remove from lost messages


    this._lostMessages.delete(connection.connectionId);
  }
  /** Retrieve a data/media connection for this peer. */


  getConnection(peerId, connectionId) {
    const connections = this._connections.get(peerId);

    if (!connections) {
      return null;
    }

    for (let connection of connections) {
      if (connection.connectionId === connectionId) {
        return connection;
      }
    }

    return null;
  }

  _delayedAbort(type, message) {
    setTimeout(() => {
      this._abort(type, message);
    }, 0);
  }
  /**
   * Emits an error message and destroys the Peer.
   * The Peer is not destroyed if it's in a disconnected state, in which case
   * it retains its disconnected state and its existing connections.
   */


  _abort(type, message) {
    $bc9099f2fab2058874c9150b6e93145$export$default.error("Aborting!");
    this.emitError(type, message);

    if (!this._lastServerId) {
      this.destroy();
    } else {
      this.disconnect();
    }
  }
  /** Emits a typed error message. */


  emitError(type, err) {
    $bc9099f2fab2058874c9150b6e93145$export$default.error("Error:", err);
    let error;

    if (typeof err === "string") {
      error = new Error(err);
    } else {
      error = err;
    }

    error.type = type;
    this.emit($ceed60ce0cf31767c568c168280b408$export$PeerEventType.Error, error);
  }
  /**
   * Destroys the Peer: closes all active connections as well as the connection
   *  to the server.
   * Warning: The peer can no longer create or accept connections after being
   *  destroyed.
   */


  destroy() {
    if (this.destroyed) {
      return;
    }

    $bc9099f2fab2058874c9150b6e93145$export$default.log(`Destroy peer with ID:${this.id}`);
    this.disconnect();

    this._cleanup();

    this._destroyed = true;
    this.emit($ceed60ce0cf31767c568c168280b408$export$PeerEventType.Close);
  }
  /** Disconnects every connection on this peer. */


  _cleanup() {
    for (let peerId of this._connections.keys()) {
      this._cleanupPeer(peerId);

      this._connections.delete(peerId);
    }

    this.socket.removeAllListeners();
  }
  /** Closes all connections to this peer. */


  _cleanupPeer(peerId) {
    const connections = this._connections.get(peerId);

    if (!connections) return;

    for (let connection of connections) {
      connection.close();
    }
  }
  /**
   * Disconnects the Peer's connection to the PeerServer. Does not close any
   *  active connections.
   * Warning: The peer can no longer create or accept connections after being
   *  disconnected. It also cannot reconnect to the server.
   */


  disconnect() {
    if (this.disconnected) {
      return;
    }

    const currentId = this.id;
    $bc9099f2fab2058874c9150b6e93145$export$default.log(`Disconnect peer with ID:${currentId}`);
    this._disconnected = true;
    this._open = false;
    this.socket.close();
    this._lastServerId = currentId;
    this._id = null;
    this.emit($ceed60ce0cf31767c568c168280b408$export$PeerEventType.Disconnected, currentId);
  }
  /** Attempts to reconnect with the same ID. */


  reconnect() {
    if (this.disconnected && !this.destroyed) {
      $bc9099f2fab2058874c9150b6e93145$export$default.log(`Attempting reconnection to server with ID ${this._lastServerId}`);
      this._disconnected = false;

      this._initialize(this._lastServerId);
    } else if (this.destroyed) {
      throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
    } else if (!this.disconnected && !this.open) {
      // Do nothing. We're still connecting the first time.
      $bc9099f2fab2058874c9150b6e93145$export$default.error("In a hurry? We're still trying to make the initial connection!");
    } else {
      throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
    }
  }
  /**
   * Get a list of available peer IDs. If you're running your own server, you'll
   * want to set allow_discovery: true in the PeerServer options. If you're using
   * the cloud server, email team@peerjs.com to get the functionality enabled for
   * your key.
   */


  listAllPeers(cb = _ => {}) {
    this._api.listAllPeers().then(peers => cb(peers)).catch(error => this._abort($ceed60ce0cf31767c568c168280b408$export$PeerErrorType.ServerError, error));
  }

}
export default Peer;
Peer.DEFAULT_KEY = "peerjs";
