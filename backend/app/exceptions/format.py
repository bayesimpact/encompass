"""Handle request handling errors."""


class InvalidFormat(Exception):
    """Exception class for invalid file or data format."""

    def __init__(self, message, status_code=400, payload=None):
        """Initialize an exception."""
        Exception.__init__(self)
        self.message = message
        self.payload = payload
        self.status_code = status_code
