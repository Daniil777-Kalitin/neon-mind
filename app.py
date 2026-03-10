from flask import Flask, render_template, request, jsonify
import requests

import pyttsx3

engine = pyttsx3.init()
voices = engine.getProperty('voices')

engine.setProperty('voice', voices[0].id)
engine.setProperty('rate', 150)

OLLAMA_URL = "http://localhost:11434/api/generate"
app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_text = request.json["message"]

    response = requests.post(OLLAMA_URL, json={
        "model": "llama3",
        "prompt": user_text,
        "stream": False
    })

    answer = response.json()["response"]

    return jsonify({"answer": answer})

if __name__ == "_main_":
    app.run(port=5001, debug=True)