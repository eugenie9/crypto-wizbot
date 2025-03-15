const cache = {
  fearChart: {
    generated: 0,
    text: "",
  },
};

const getOrFallback = async ({
  key,
  fallback,
  forceFallback = false,
  ttl = 1000 * 60 * 5,
}) => {
  if (!forceFallback) {
    const cachedResult = cache[key];
    if (cachedResult) {
      if (Date.now() - cachedResult.generated < ttl) {
        console.log(`Cache hit for ${key}`);
        return cachedResult.value;
      }
    }
  }

  try {
    const result = await fallback();
    cache[key] = {
      generated: Date.now(),
      value: result,
    };
    return result;
  } catch (e) {
    console.error(`Error in getOrFallback ${key}:`, e);
    return null;
  }
};

module.exports = {
  ...cache,
  getOrFallback,
};
