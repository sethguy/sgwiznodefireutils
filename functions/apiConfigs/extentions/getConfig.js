const getConfig = async (thisApi, configKey) => {
  try {
    const [config = {}] = await thisApi.query([
      {
        actionKey: "where",
        field: "configKey",
        operator: "==",
        value: configKey,
      },
    ]);
    const { configContent = {} } = config;
    const parsedConfig = JSON.parse(configContent);

    return parsedConfig;
  } catch (error) {
    console.log("🚀 ~ getConfig= ~ catch error:", error);

    return {};
  }
};

module.exports = { getConfig };
