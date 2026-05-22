#!/usr/bin/env python3
import asyncio, websockets, json

async def test():
    print("Connecting to rosbridge...")
    async with websockets.connect("ws://127.0.0.1:9090") as ws:
        print("Connected!")
        await ws.send(json.dumps({"op": "advertise", "topic": "/frontend_test", "type": "geometry_msgs/msg/Twist"}))
        await asyncio.sleep(0.5)
        await ws.send(json.dumps({"op": "publish", "topic": "/frontend_test", "msg": {"linear": {"x": 0.5, "y": 0, "z": 0}, "angular": {"x": 0, "y": 0, "z": 0}}}))
        await asyncio.sleep(1)
        print("OK: publish sent successfully!")
        try:
            resp = await asyncio.wait_for(ws.recv(), timeout=3)
            print(f"Response: {resp}")
        except asyncio.TimeoutError:
            print("No response (expected for publish)")

asyncio.run(test())
