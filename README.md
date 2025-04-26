# SavageGPT

A snarky, sarcastic AI chatbot that roasts you while answering your questions.

## Overview

SavageGPT is a personal project that uses the deepseek-r1-distill-llama-70b LLM to create a uniquely sarcastic conversational experience. Unlike typical helpful assistants, SavageGPT is deliberately designed to be sharp-witted, delivering clever insults alongside genuine answers.

## Features

- **Sarcastic Responses**: Get roasted while getting your questions answered
- **Lightweight FastAPI Backend**: Simple but robust Python backend
- **Clean Frontend Interface**: Minimalist chat UI for direct interaction
- **Automated Deployment**: Tag-based CD pipeline for seamless updates

## Technology Stack

- **Backend**: FastAPI
- **LLM Integration**: Groq API (deepseek-r1-distill-llama-70b model)
- **Deployment**: GitHub Actions self-hosted runner
- **Exposure**: ngrok tunneling for public access

## Self-Hosted Setup

SavageGPT runs on a self-hosted runner, with a fully automated CD pipeline that deploys on any new version tag.

### Deployment Process

1. Push new code with a version tag (e.g., `v1.0.0`)
2. GitHub Actions runner automatically:
   - Deploys code to the server
   - Sets up environment variables securely
   - Configures systemd services
   - Starts the FastAPI service and ngrok tunnel
   - Outputs the public URL in the workflow logs

## Local Development

```bash
# Clone the repository
git clone https://github.com/ali-sehran/SavageGPT.git
cd SavageGPT

# Install dependencies
pip install fastapi uvicorn groq pydantic python-multipart

# Set your API key
export GROQ_API_KEY="your-groq-api-key"

# Run the server
uvicorn app:app --reload
```

## Deployment
```bash
git tag v1.0.0
git push origin v1.0.0
```
## License
This project is open source and available under the MIT License.
