import app from "./index";
import { CheckConnection } from "./config/database";
import logger from "./config/logger";

const PORT = process.env.PORT || 3000;

CheckConnection()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
