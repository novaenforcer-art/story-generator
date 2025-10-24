from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    DATABASE_URL: str
    ALLOWED_ORIGINS: str = ""  # Keep as str
    GEMINI_API_KEY: str

    # Convert string to list after loading
    @field_validator("ALLOWED_ORIGINS", mode="after")
    def parse_allowed_origins(cls, v: str) -> List[str]:
        if v:
            return [origin.strip() for origin in v.split(",")]
        return []

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
print(settings.ALLOWED_ORIGINS)
