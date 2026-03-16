

grok API

xai-kY7w6oYXiOHnL1ow9pxHdeXWUq2yBk55RLHD1TXsnzRoRIEtRBeIwqcnfekBHWK0Sx1QV5w206QzNwCv


curl https://api.x.ai/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer xai-kY7w6oYXiOHnL1ow9pxHdeXWUq2yBk55RLHD1TXsnzRoRIEtRBeIwqcnfekBHWK0Sx1QV5w206QzNwCv" \
    -d '{
      "messages": [
        {
          "role": "system",
          "content": "You are a test assistant."
        },
        {
          "role": "user",
          "content": "Testing. Just say hi and hello world and nothing else."
        }
      ],
      "model": "grok-4-latest",
      "stream": false,
      "temperature": 0
    }'