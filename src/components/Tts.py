import asyncio
import websockets
import pyttsx3

engine = pyttsx3.init()

#รอหาภาษาไทยมาลง
TH_voice_id = "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_THAI"
# EN_voice_id = "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_MS_EN-US_ZIRA_11.0"

engine.setProperty('volume', 0.9)  # Volume 0-1
engine.setProperty('rate', 120)  # Speaking rate

engine.setProperty('voice', TH_voice_id)

def speak_text(text):
    engine.say(str(text))
    engine.runAndWait()

async def server(websocket, path):
    async for message in websocket:
        print("Received:", message)
        speak_text(message)

start_server = websockets.serve(server, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
