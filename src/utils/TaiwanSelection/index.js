let countryCsv = [];
let townsCsv = [];
let townsId = "";

export const locationMap = {};
export const pathname =
  process.env.NODE_ENV === "production" ? "/portfolio" : "";

export function pairId(textRow, id) {
  for (let i = 0; i < textRow.length; i++) {
    const item = textRow[i];
    if (item[1]?.trim() == id?.trim()) {
      const content = item[2].trim();
      return content.slice(0, content.length - 1); //去掉多餘的(")
    }
  }
}

function parseCSV(text) {
  const pattern = /(\d+),"([\s\S]*?)(?=\d+,|$)/g;
  let matches = "";
  const rows = [];
  while ((matches = pattern.exec(text)) !== null) {
    rows.push(matches);
  }
  return rows;
}

async function getCsv(url, id) {
  const res = await fetch(`${pathname}/data/TaiwanSelection/csv/${url}.csv`);
  const text = await res.text();
  const textContent = pairId(parseCSV(text), id);
  return textContent;
}

export async function assignValue(id, deep) {
  let textContent = "";
  switch (deep) {
    case 1:
      textContent = await getCsv("county-gpt", id, deep);
      break;
    case 2:
      textContent = await getCsv("town-gpt", id);
      break;
    case 3:
      textContent = await getCsv(`village-${id.slice(0, 8)}-gpt`, id);
      break;
  }

  const keys = {
    id,
    textContent,
  };
  return keys;
}

export function getInitSize(svg) {
  const svgBox = svg.getBBox();

  const { innerWidth, innerHeight } = window;
  let scaleFactor = 0.8;

  if (innerWidth < 500) {
    scaleFactor = 0.6;
  } else if (innerWidth < 968) {
    scaleFactor = 0.7;
  }

  const scaleX = innerWidth / svgBox.width;
  const scaleY = innerHeight / svgBox.height;
  const zoomLevel = Math.min(scaleX, scaleY) * scaleFactor; // 選擇較小的縮放比例

  return zoomLevel;
}

export function getPartyColorBySupport(party, support) {
  if (party === 2) {
    if (support < 40) return "rgb(88, 220, 152)";
    else if (support < 60) return "rgb(49, 198, 114)";
    else return "rgb(39, 174, 97)";
  }

  if (party === 3) {
    if (support < 40) return "rgb(127, 182, 238)";
    else if (support < 50) return "rgb(112, 171, 236)";
    else return "rgb(56, 112, 189)";
  }
}

export function getTransform(svg, scale = 1) {
  const { innerWidth, innerHeight } = window;

  const svgBox = svg.getBBox();
  const centerX = (svgBox.x + svgBox.width / 2) * scale;
  const centerY = (svgBox.y + svgBox.height / 2) * scale;

  // 计算平移值
  const translateX = innerWidth / 2 - centerX;
  const translateY = innerHeight / 2 - centerY;

  return { translateX, translateY };
}
