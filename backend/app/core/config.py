from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    APP_ENV: str = "development"
    APP_PORT: int = 8000
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""


settings = Settings()
