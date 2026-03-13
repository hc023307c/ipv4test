const form = document.getElementById("subnet-form");
const ipInput = document.getElementById("ip-input");
const prefixInput = document.getElementById("prefix-input");
const maskInput = document.getElementById("mask-input");
const fillDemoButton = document.getElementById("fill-demo");
const message = document.getElementById("message");

const output = {
  mask: document.getElementById("result-mask"),
  networkName: document.getElementById("result-network-name"),
  broadcast: document.getElementById("result-broadcast"),
  networkRange: document.getElementById("result-network-range"),
  usableRange: document.getElementById("result-usable-range"),
  hostCount: document.getElementById("result-host-count"),
};

const emptyState = {
  mask: "尚未計算",
  networkName: "尚未計算",
  broadcast: "尚未計算",
  networkRange: "尚未計算",
  usableRange: "尚未計算",
  hostCount: "尚未計算",
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const ip = parseIpv4(ipInput.value.trim());
    const prefix = resolvePrefix(prefixInput.value.trim(), maskInput.value.trim());
    const result = calculateSubnet(ip, prefix);

    renderResult(result);
    showMessage("計算完成，已整理出完整網段資訊。", "success");
  } catch (error) {
    resetResult();
    showMessage(error.message, "error");
  }
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    resetResult();
    showMessage("", "");
  }, 0);
});

fillDemoButton.addEventListener("click", () => {
  ipInput.value = "192.168.1.10";
  prefixInput.value = "/24";
  maskInput.value = "";
  showMessage("已帶入範例資料，可以直接按下開始計算。", "success");
});

function parseIpv4(value) {
  if (!value) {
    throw new Error("請輸入 IP 位址。");
  }

  const parts = value.split(".");
  if (parts.length !== 4) {
    throw new Error("IP 位址格式錯誤，請使用 IPv4 格式。");
  }

  const numbers = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      throw new Error("IP 位址格式錯誤，僅能包含數字與點。");
    }

    const octet = Number(part);
    if (octet < 0 || octet > 255) {
      throw new Error("IP 位址每一段都必須介於 0 到 255。");
    }

    return octet;
  });

  return ipv4ToInt(numbers);
}

function resolvePrefix(prefixValue, maskValue) {
  if (!prefixValue && !maskValue) {
    throw new Error("請輸入 CIDR 首碼或子網路遮罩。");
  }

  let prefixFromInput = null;
  let prefixFromMask = null;

  if (prefixValue) {
    const normalized = prefixValue.replace("/", "");
    if (!/^\d+$/.test(normalized)) {
      throw new Error("CIDR 首碼格式錯誤，請輸入 0 到 32。");
    }

    prefixFromInput = Number(normalized);
    if (prefixFromInput < 0 || prefixFromInput > 32) {
      throw new Error("CIDR 首碼需介於 0 到 32。");
    }
  }

  if (maskValue) {
    prefixFromMask = maskToPrefix(maskValue);
  }

  if (prefixFromInput !== null && prefixFromMask !== null && prefixFromInput !== prefixFromMask) {
    throw new Error("CIDR 首碼與子網路遮罩不一致，請確認輸入內容。");
  }

  return prefixFromInput ?? prefixFromMask;
}

function maskToPrefix(maskValue) {
  const maskInt = parseIpv4(maskValue);
  const binary = maskInt.toString(2).padStart(32, "0");

  if (!/^1*0*$/.test(binary)) {
    throw new Error("子網路遮罩格式錯誤，必須是連續的 1 後接連續的 0。");
  }

  return binary.indexOf("0") === -1 ? 32 : binary.indexOf("0");
}

function prefixToMask(prefix) {
  if (prefix === 0) {
    return 0;
  }

  return (0xffffffff << (32 - prefix)) >>> 0;
}

function calculateSubnet(ipInt, prefix) {
  const maskInt = prefixToMask(prefix);
  const networkInt = ipInt & maskInt;
  const wildcardInt = (~maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  let usableRange = "無可用主機位址";
  let hostCount = "0";

  if (prefix <= 30) {
    const firstHost = networkInt + 1;
    const lastHost = broadcastInt - 1;
    usableRange = `${intToIpv4(firstHost)} - ${intToIpv4(lastHost)}`;
    hostCount = String(Math.max(0, 2 ** (32 - prefix) - 2));
  } else if (prefix === 31) {
    usableRange = `${intToIpv4(networkInt)} - ${intToIpv4(broadcastInt)} (點對點用途)`;
    hostCount = "2";
  } else if (prefix === 32) {
    usableRange = `${intToIpv4(networkInt)} (單一位址)`;
    hostCount = "1";
  }

  return {
    mask: intToIpv4(maskInt),
    networkName: `${intToIpv4(networkInt)}/${prefix}`,
    broadcast: intToIpv4(broadcastInt),
    networkRange: `${intToIpv4(networkInt)} - ${intToIpv4(broadcastInt)}`,
    usableRange,
    hostCount,
  };
}

function ipv4ToInt(parts) {
  return (
    ((parts[0] << 24) >>> 0) +
    ((parts[1] << 16) >>> 0) +
    ((parts[2] << 8) >>> 0) +
    (parts[3] >>> 0)
  ) >>> 0;
}

function intToIpv4(value) {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join(".");
}

function renderResult(result) {
  output.mask.textContent = result.mask;
  output.networkName.textContent = result.networkName;
  output.broadcast.textContent = result.broadcast;
  output.networkRange.textContent = result.networkRange;
  output.usableRange.textContent = result.usableRange;
  output.hostCount.textContent = result.hostCount;
}

function resetResult() {
  output.mask.textContent = emptyState.mask;
  output.networkName.textContent = emptyState.networkName;
  output.broadcast.textContent = emptyState.broadcast;
  output.networkRange.textContent = emptyState.networkRange;
  output.usableRange.textContent = emptyState.usableRange;
  output.hostCount.textContent = emptyState.hostCount;
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = "message";

  if (type) {
    message.classList.add(type);
  }
}
