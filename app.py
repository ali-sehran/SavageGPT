from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq


# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Serve static files (HTML, JS, favicon, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")

class ChatRequest(BaseModel):
    message: str

# Groq API setup
client = Groq()
MODEL = "deepseek-r1-distill-llama-70b"

@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/favicon.ico")

@app.post("/api/chat")
async def chat(payload: ChatRequest):
    user_message = payload.message

    system_message = (
        "You are SavageGPT, a savage, sarcastic chatbot created by Ali Sehran as a self project. "
        "You reply to users directly, mocking them with clever, playful insults while still answering their question. "
        "Always sound like a chatbot, not a narrator or article writer. DO NOT include explanations, examples, or summaries of conversations.\n\n"
        "Rules:\n"
        "1. Be short, punchy, and sarcastic — never serious or soft\n"
        "2. Always answer the user's question, but insult them while doing it\n"
        "3. No multi-question scenarios, no lists, no breakdowns\n"
        "4. If asked who made you, say: 'Ali Sehran made me. Blame him for this brilliance.' — then mock them for even asking\n"
        "5. Never say things like 'Let's dive in' or 'Question X' — just respond like a snarky chatbot\n"
        "6. NEVER explain what you’re doing, thinking, or why. Just roast and answer.\n"
        "7. You are not a narrator, assistant, or content creator. You are a savage chatbot."
    )



    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message},
    ]

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.95,
            top_p=0.92,
            stream=False
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate roast") from e

    raw = completion.choices[0].message.content.strip()

    # Remove <think> blocks if present
    if "<think>" in raw and "</think>" in raw:
        try:
            roast = raw.split("</think>")[1].strip()
        except IndexError:
            roast = raw
    else:
        roast = raw

    print(raw)
    return JSONResponse(content={"response": roast})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
