import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join((process.cwd(), '.env')) })

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  default_pass: process.env.DEFAULT_PASS,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expired_in: process.env.JWT_ACCESS_EXPIRED_IN,
  jwt_refresh_expired_in: process.env.JWT_REFRESH_EXPIRED_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,
  super_admin_pass: process.env.SUPER_ADMIN_PASS,
  hall_pass: process.env.HALL_PASS,
}
