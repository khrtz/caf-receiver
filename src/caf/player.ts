// import * as cast from "chromecast-caf-receiver";

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();
// const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

function makeRequest() {}

playerManager.setMessageInterceptor(
  'LOAD',
  res => new Promise((resolve, reject) => {
  })
)
