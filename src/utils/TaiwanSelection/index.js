import { getAreaDetail } from "@/api/TaiwanSelection";
let countryCsv = [];
let townsCsv = [];
let townsId = "";

export const pathname =
  import.meta.env.MODE === "production" ? "/portfolio" : "";
// const { pathname } = store;

function pairId(textRow, id) {
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

async function getCsv(fileName, id) {
  const text = await getAreaDetail(fileName);
  const textContent = pairId(parseCSV(text), id);
  return textContent;
}

export async function getAIAIanalytics(id, deep) {
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
  return {
    id,
    textContent,
  };
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

export function getTransform(data) {
  if (!Array.isArray(data)) return {};
  /**
   * (x0, y0) 可以代表左上或左下
   * (x1, y1) 可以代表右上或右下
   *
   * x1 - x0 物件寬
   * y1 - y0 物件高
   */
  const [[x0, y0], [x1, y1]] = data;
  const { innerWidth, innerHeight } = window;

  // 计算新的 transform
  const scale = Math.min(
    30, // 最大縮放尺寸限制
    0.8 / Math.max((x1 - x0) / innerWidth, (y1 - y0) / innerHeight)
  );

  const translateX = innerWidth / 2 - (scale * (x0 + x1)) / 2;
  const translateY = innerHeight / 2 - (scale * (y0 + y1)) / 2;

  return { scale, translateX, translateY };
}
