import app from "./index";
import { createDatabase, CheckConnection } from "./config/database";
import logger from "./config/logger";

const PORT = process.env.PORT || 3000;

const initializeServer = async () => {
  try {
    await createDatabase();
    await CheckConnection();

    app.listen(PORT, () => {
      console.log(process.env.DB_NAME);
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

initializeServer();
