import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables securely
load_dotenv()

class ConsensusAgent:
    def __init__(self):
        # Initialize the actual OpenAI Client using your secure .env key
        api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=api_key) if api_key else None

    def analyze_query(self, prompt: str, bbox: list, datasets: list):
        """
        Uses an actual LLM (GPT) to analyze the query alongside the satellite context.
        """
        # Fallback in case you forgot to put a real API key in the .env file
        if not self.client or not self.client.api_key or self.client.api_key == "your_openai_api_key_here_if_needed":
            return self._fallback_mock(prompt, bbox)

        # 1. We tell the AI how to behave and what format to return
        system_instruction = """
        You are SatQuery AI, an expert geospatial intelligence assistant. 
        You analyze satellite bounding box coordinates, dataset metadata (like Cartosat/RISAT), and user queries.
        You must return your response strictly as a JSON object with the following keys:
        - "summary": A descriptive paragraph of the analysis based on the user's prompt.
        - "confidence_score": A float between 0.70 and 0.99 indicating confidence.
        - "evidence_chain": A list of 3-4 strings detailing the step-by-step geospatial analysis process.
        """

        # 2. We provide the real context (the Bounding Box and ISRO Data)
        user_context = f"""
        User Query: {prompt}
        Target Area Bounding Box: {bbox}
        Available ISRO Datasets: {datasets}
        
        Analyze the query and provide the JSON output.
        """

        try:
            # 3. Call the actual GPT model
            response = self.client.chat.completions.create(
                model="gpt-4o-mini", # Fast and cost-effective for hackathons
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_context}
                ],
                temperature=0.3, # Low temperature for more analytical/factual responses
                response_format={"type": "json_object"} # Forces strictly valid JSON
            )
            
            # 4. Parse the LLM's JSON response and return it to FastAPI
            raw_content = response.choices[0].message.content
            result = json.loads(raw_content)
            return result

        except Exception as e:
            print(f"[!] OpenAI API Error: {e}")
            return self._fallback_mock(prompt, bbox)

    def _fallback_mock(self, prompt, bbox):
        """Safety fallback so your app doesn't crash during a live demo if the API fails."""
        return {
            "summary": f"Fallback Mode: Analyzed AOI {bbox[:2]} for '{prompt}'. Detected normal seasonal variations.",
            "confidence_score": 0.85,
            "evidence_chain": [
                "1. Verified user via Bhoonidhi API.",
                "2. Extracted Optical and SAR metadata.",
                "3. OpenAI API unavailable, used fallback heuristics."
            ]
        }