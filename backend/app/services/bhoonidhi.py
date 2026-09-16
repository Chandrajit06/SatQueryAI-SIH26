import os
from dotenv import load_dotenv

# Load environment variables securely from .env
load_dotenv()

class BhoonidhiClient:
    def __init__(self):
        self.user_id = os.getenv("BHOONIDHI_USER_ID")
        self.access_token = os.getenv("BHOONIDHI_ACCESS_TOKEN")
        self.token_type = os.getenv("BHOONIDHI_TOKEN_TYPE", "Bearer")

    def get_auth_headers(self):
        return {
            "Authorization": f"{self.token_type} {self.access_token}",
            "Content-Type": "application/json"
        }

    def fetch_satellite_metadata(self, bbox: list, start_date: str, end_date: str):
        """
        Simulates connecting to Bhoonidhi STAC catalog using your secure token.
        """
        print(f"[*] Authenticating with Bhoonidhi for User: {self.user_id}")
        
        # In a fully live scenario, you'd use: requests.post(url, json=payload, headers=self.get_auth_headers())
        # Returning structural data for the MVP demo:
        return [
            {"mission": "CARTOSAT-3", "sensor": "Optical MX", "resolution": "0.28m"},
            {"mission": "RISAT-1A", "sensor": "SAR C-Band", "resolution": "1.5m"}
        ]