const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/* #TA09 */
module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        mongodb_username: "dbTraining",
        mongodb_password: "be5U8y6FbhPajhhI",
        mongodb_clsuter: "cluster0",
        mongodb_db: "auth",
      },
    };
  }

  return {
    env: {
      mongodb_username: "dbTraining",
      mongodb_password: "be5U8y6FbhPajhhI",
      mongodb_clsuter: "cluster0",
      mongodb_db: "auth",
    },
  };
};
