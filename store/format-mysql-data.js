function formatNestedData(data) {
  return data.map((item) => {
    const keys = Object.keys(item);
    const firstItem = item[keys[0]];
    const secondItem = item[keys[1]];
    const newValue = { ...firstItem };
    newValue[keys[1]] = secondItem;
    return newValue;
  });
}

module.exports = {
  formatNestedData,
};
