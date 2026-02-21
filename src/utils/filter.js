//回傳帶有千分位符號的數值
export const currency = (num) => {
  const n = Number(num) || 0;
  return n.toLocaleString();
}