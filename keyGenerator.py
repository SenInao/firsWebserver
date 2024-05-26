import secrets

# Generate a random session key of 32 bytes (256 bits)
session_key = secrets.token_bytes(32)
print(session_key.hex())
