import google.generativeai as genai
import sys

def list_models(api_key):
    try:
        genai.configure(api_key=api_key)
        print("Available Models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        list_models(sys.argv[1])
    else:
        print("Please provide an API key as an argument.")
