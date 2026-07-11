const Config = () => {
  return {
    restful: {
      apiURL: import.meta.env.VITE_API_URL,
      wsURL: import.meta.env.VITE_WS_URL,
      donateURL: import.meta.env.VITE_DONATE_URL,
      hCaptchaSiteKey: import.meta.env.VITE_HCAPTCHA_SITE_KEY,
      enableMoney: import.meta.env.VITE_ENABLE_MONEY,
    },
  }
}

export const restfulApiConfig = Config().restful
