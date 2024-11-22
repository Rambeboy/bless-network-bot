const {
  HttpsProxyAgent
} = require('https-proxy-agent');
const readline = require("readline");
const config = require("../config/config.js");
let useProxy;
async function loadFetch() {
  const _0x1902e5 = await import("node-fetch").then(_0x2697fc => _0x2697fc['default']);
  return _0x1902e5;
}
async function promptUseProxy() {
  const _0x163924 = readline.createInterface({
    'input': process.stdin,
    'output': process.stdout
  });
  return new Promise(_0x3f7683 => {
    _0x163924.question("Do you want to use a proxy? (y/n): ", _0x3e423d => {
      _0x163924.close();
      _0x3f7683(_0x3e423d.toLowerCase() === 'y');
    });
  });
}
async function fetchIpAddress(_0x34f836, _0x2ab0cb) {
  const _0x357e83 = await _0x34f836("https://tight-block-2413.txlabs.workers.dev", {
    'agent': _0x2ab0cb
  });
  const _0x1992f7 = await _0x357e83.json();
  console.log('[' + new Date().toISOString() + "] IP fetch response:", _0x1992f7);
  return _0x1992f7.ip;
}
async function registerNode(_0x57691c, _0x49541d, _0x5c0720, _0x5a6905, _0x20b1eb) {
  const _0x33ecfe = await loadFetch();
  const _0x44b729 = "https://gateway-run.bls.dev/api/v1/nodes/" + _0x57691c;
  console.log('[' + new Date().toISOString() + "] Registering node with IP: " + _0x5c0720 + ", Hardware ID: " + _0x49541d);
  const _0x48d373 = await _0x33ecfe(_0x44b729, {
    'method': 'POST',
    'headers': {
      'Content-Type': "application/json",
      'Authorization': "Bearer " + _0x20b1eb
    },
    'body': JSON.stringify({
      'ipAddress': _0x5c0720,
      'hardwareId': _0x49541d
    }),
    'agent': _0x5a6905
  });
  let _0x3a42e9;
  try {
    _0x3a42e9 = await _0x48d373.json();
  } catch (_0x4e75bb) {
    const _0x3a19a0 = await _0x48d373.text();
    console.error('[' + new Date().toISOString() + "] Failed to parse JSON. Response text:", _0x3a19a0);
    throw new Error("Invalid JSON response: " + _0x3a19a0);
  }
  console.log('[' + new Date().toISOString() + "] Registration response:", _0x3a42e9);
  return _0x3a42e9;
}
async function startSession(_0x42f632, _0xc32504, _0x28f99c) {
  const _0x2d551e = await loadFetch();
  const _0x5c9c58 = "https://gateway-run.bls.dev/api/v1/nodes/" + _0x42f632 + "/start-session";
  console.log('[' + new Date().toISOString() + "] Starting session for node " + _0x42f632 + ", it might take a while...");
  const _0x10e8db = await _0x2d551e(_0x5c9c58, {
    'method': 'POST',
    'headers': {
      'Authorization': "Bearer " + _0x28f99c
    },
    'agent': _0xc32504
  });
  let _0xc1628e;
  try {
    _0xc1628e = await _0x10e8db.json();
  } catch (_0xc0c78f) {
    const _0x4407bc = await _0x10e8db.text();
    console.error('[' + new Date().toISOString() + "] Failed to parse JSON. Response text:", _0x4407bc);
    throw new Error("Invalid JSON response: " + _0x4407bc);
  }
  console.log('[' + new Date().toISOString() + "] Start session response:", _0xc1628e);
  return _0xc1628e;
}
async function pingNode(_0x624272, _0x3c7813, _0x148831, _0xd84159, _0x3fce06) {
  const _0x7eb3f0 = await loadFetch();
  const _0x1f2b88 = await import("chalk");
  const _0x45058d = "https://gateway-run.bls.dev/api/v1/nodes/" + _0x624272 + "/ping";
  const _0x266e7c = _0x3c7813 ? JSON.stringify(_0x3c7813.proxy) : "No proxy";
  console.log('[' + new Date().toISOString() + "] Pinging node " + _0x624272 + " using proxy " + _0x266e7c);
  const _0x2741d5 = await _0x7eb3f0(_0x45058d, {
    'method': "POST",
    'headers': {
      'Authorization': "Bearer " + _0xd84159
    },
    'agent': _0x3c7813
  });
  let _0x5bf463;
  try {
    _0x5bf463 = await _0x2741d5.json();
  } catch (_0xf0206f) {
    const _0x2bf5c7 = await _0x2741d5.text();
    console.error('[' + new Date().toISOString() + "] Failed to parse JSON. Response text:", _0x2bf5c7);
    _0x3fce06[_0x624272] = (_0x3fce06[_0x624272] || 0x0) + 0x1;
    throw new Error("Invalid JSON response: " + _0x2bf5c7);
  }
  if (!_0x5bf463.status) {
    console.log('[' + new Date().toISOString() + "] " + _0x1f2b88['default'].green("First time ping initiate") + ", NodeID: " + _0x1f2b88["default"].cyan(_0x624272) + ", Proxy: " + _0x1f2b88['default'].yellow(_0x266e7c) + ", IP: " + _0x1f2b88["default"].yellow(_0x148831));
  } else {
    let _0x4cde0c = _0x5bf463.status.toLowerCase() === 'ok' ? _0x1f2b88["default"].green : _0x1f2b88['default'].red;
    const _0x476a31 = '[' + new Date().toISOString() + "] Ping response status: " + _0x4cde0c(_0x5bf463.status.toUpperCase()) + ", NodeID: " + _0x1f2b88["default"].cyan(_0x624272) + ", Proxy: " + _0x1f2b88["default"].yellow(_0x266e7c) + ", IP: " + _0x1f2b88['default'].yellow(_0x148831);
    console.log(_0x476a31);
  }
  _0x3fce06[_0x624272] = 0x0;
  return _0x5bf463;
}
async function displayHeader() {
  const _0x3aa043 = await import("chalk");
  console.log('');
  console.log(_0x3aa043["default"].yellow(" ============================================"));
  console.log(_0x3aa043["default"].yellow("|          BLESS NETWORK BOT                 |"));
  console.log(_0x3aa043["default"].yellow("|         AUTHOR : NOFAN RAMBE               |"));
  console.log(_0x3aa043["default"].yellow("|         WELCOME & ENJOY SIR!               |"));
  console.log(_0x3aa043["default"].yellow(" ============================================"));
  console.log('');
}
const activeNodes = new Set();
const nodeIntervals = new Map();
async function processNode(_0x3b80d5, _0x571dbf, _0x55c975, _0x4a90fc) {
  const _0x1d406b = {};
  let _0x437328 = null;
  while (true) {
    try {
      if (activeNodes.has(_0x3b80d5.nodeId)) {
        console.log('[' + new Date().toISOString() + "] Node " + _0x3b80d5.nodeId + " is already being processed.");
        return;
      }
      activeNodes.add(_0x3b80d5.nodeId);
      console.log('[' + new Date().toISOString() + "] Processing nodeId: " + _0x3b80d5.nodeId + ", hardwareId: " + _0x3b80d5.hardwareId + ", IP: " + _0x55c975);
      const _0x4c7781 = await registerNode(_0x3b80d5.nodeId, _0x3b80d5.hardwareId, _0x55c975, _0x571dbf, _0x4a90fc);
      console.log('[' + new Date().toISOString() + "] Node registration completed for nodeId: " + _0x3b80d5.nodeId + ". Response:", _0x4c7781);
      const _0x169dae = await startSession(_0x3b80d5.nodeId, _0x571dbf, _0x4a90fc);
      console.log('[' + new Date().toISOString() + "] Session started for nodeId: " + _0x3b80d5.nodeId + ". Response:", _0x169dae);
      console.log('[' + new Date().toISOString() + "] Sending initial ping for nodeId: " + _0x3b80d5.nodeId);
      await pingNode(_0x3b80d5.nodeId, _0x571dbf, _0x55c975, _0x4a90fc, _0x1d406b);
      if (!nodeIntervals.has(_0x3b80d5.nodeId)) {
        _0x437328 = setInterval(async () => {
          try {
            console.log('[' + new Date().toISOString() + "] Sending ping for nodeId: " + _0x3b80d5.nodeId);
            await pingNode(_0x3b80d5.nodeId, _0x571dbf, _0x55c975, _0x4a90fc, _0x1d406b);
          } catch (_0x536896) {
            console.error('[' + new Date().toISOString() + "] Error during ping: " + _0x536896.message);
            _0x1d406b[_0x3b80d5.nodeId] = (_0x1d406b[_0x3b80d5.nodeId] || 0x0) + 0x1;
            if (_0x1d406b[_0x3b80d5.nodeId] >= 0x3) {
              clearInterval(nodeIntervals.get(_0x3b80d5.nodeId));
              nodeIntervals["delete"](_0x3b80d5.nodeId);
              activeNodes["delete"](_0x3b80d5.nodeId);
              console.error('[' + new Date().toISOString() + "] Ping failed " + 0x3 + " times consecutively for nodeId: " + _0x3b80d5.nodeId + ". Restarting process...");
              await new Promise(_0x414bae => setTimeout(_0x414bae, 0x7530));
              await processNode(_0x3b80d5, _0x571dbf, _0x55c975, _0x4a90fc);
            }
            throw _0x536896;
          }
        }, 0x1d4c0);
        nodeIntervals.set(_0x3b80d5.nodeId, _0x437328);
      }
      break;
    } catch (_0x5595fc) {
      console.error('[' + new Date().toISOString() + "] Error occurred for nodeId: " + _0x3b80d5.nodeId + ", restarting process in 50 seconds: " + _0x5595fc.message);
      await new Promise(_0x116f36 => setTimeout(_0x116f36, 0x3a980));
    } finally {
      activeNodes["delete"](_0x3b80d5.nodeId);
    }
  }
}
async function runAll(_0x59e055 = true) {
  try {
    if (_0x59e055) {
      await displayHeader();
      useProxy = await promptUseProxy();
    }
    for (const _0x3f1bc6 of config) {
      for (const _0x5e3b12 of _0x3f1bc6.nodes) {
        const _0x1f3e17 = useProxy ? new HttpsProxyAgent(_0x5e3b12.proxy) : null;
        const _0x2b02b5 = useProxy ? await fetchIpAddress(await loadFetch(), _0x1f3e17) : null;
        processNode(_0x5e3b12, _0x1f3e17, _0x2b02b5, _0x3f1bc6.usertoken);
      }
    }
  } catch (_0xb00c9e) {
    const _0x12cbf6 = await import("chalk");
    console.error(_0x12cbf6['default'].yellow('[' + new Date().toISOString() + "] An error occurred: " + _0xb00c9e.message));
  }
}
process.on("uncaughtException", _0x56fdd5 => {
  console.error('[' + new Date().toISOString() + "] Uncaught exception: " + _0x56fdd5.message);
  runAll(false);
});
runAll();
